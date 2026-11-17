import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    AlertTitle,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    LinearProgress,
    Link,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { I18n } from '@iobroker/gui-components';

import {
    convertMultiViewWidgets,
    hasMultiViewCopies,
    isOldInventwoWidget,
    migrateVisProject,
    restoreMultiViewWidgets,
    rewriteProjectPaths,
    type MigrationNote,
    type MigrationReport,
    type RestoredWidget,
    type VisProject,
} from './migration/convert';
import { SUPPORT, type SupportLevel } from './migration/support';

/**
 * The migration page of the adapter settings (shown by MigrationComponent):
 * converts the old inventwo vis-1 widgets (`i-vis-*`) of a vis-2 project to the widgets of this adapter.
 *
 * Everything runs in the browser. The project files are read and written through the admin socket,
 * the adapter itself has no backend process.
 */

const VIS_NAMESPACE = 'vis-2.0';
/** File storage of vis-1 – only read, as reference for widgets that got lost during the import */
const VIS1_NAMESPACE = 'vis.0';
const VIEWS_FILE = 'vis-views.json';
const BACKUP_PREFIX = 'vis-views-backup-inventwo-';
const ISSUES_URL = 'https://github.com/inventwo/ioBroker.vis-2-widgets-inventwo/issues';

/** Prefix of all translation keys of this component set (src/i18n/*.json) */
const I18N_PREFIX = 'custom_inventwo_';

/**
 * Translation with `%s` placeholders. The admin loads the texts from `admin/custom/i18n/<lang>.json`
 * (`i18n: true` in admin/jsonConfig.json) and falls back to English for languages without a file.
 */
function t(key: string, ...args: (string | number)[]): string {
    return I18n.t(`${I18N_PREFIX}${key}`, ...args.map(String));
}

function noteText(note: MigrationNote): string {
    return t(note.key, ...(note.args || []));
}

interface DirEntry {
    file: string;
    isDir: boolean;
}

type FileResult = { file: string | object; mimeType: string } | string;

/** The part of the admin connection that is used here */
interface AdminSocket {
    readDir(namespace: string, path: string): Promise<DirEntry[]>;
    readFile(namespace: string, fileName: string, base64?: boolean): Promise<FileResult>;
    writeFile64(namespace: string, fileName: string, data: ArrayBuffer): Promise<void>;
}

interface MigrationProps {
    /** Connection of the admin (`oContext.socket` of the JSON config component) */
    socket?: AdminSocket;
}

interface Analysis {
    views: number;
    widgets: number;
    oldWidgets: number;
    report: MigrationReport;
    restored: RestoredWidget[];
    /** true: the widgets come from the vis-1 project, false: they were only converted to the vis-2 notation */
    fromVis1: boolean;
}

interface Done {
    converted: number;
    /** Name of the backup file, if the project was converted in place */
    backup?: string;
    /** Name of the new project, if the result was written to a new project */
    target?: string;
    files: number;
}

const LEVEL_COLOR: Record<SupportLevel, 'success' | 'warning' | 'default'> = {
    full: 'success',
    partial: 'warning',
    none: 'default',
};

function fileContent(result: FileResult): string | object {
    return typeof result === 'object' && result !== null && 'file' in result ? result.file : result;
}

async function readViewsFile(socket: AdminSocket, namespace: string, project: string): Promise<string> {
    const file = fileContent(await socket.readFile(namespace, `${project}/${VIEWS_FILE}`));
    return typeof file === 'string' ? file : JSON.stringify(file, null, 2);
}

/**
 * Writes a text file. The text must be passed as binary data: a string would be taken as base64 by the socket.
 */
function writeTextFile(socket: AdminSocket, fileName: string, text: string): Promise<void> {
    return socket.writeFile64(VIS_NAMESPACE, fileName, new TextEncoder().encode(text).buffer);
}

/** All files of a project folder (paths relative to the project), without the views file and our backups */
async function listProjectFiles(socket: AdminSocket, project: string, folder = ''): Promise<string[]> {
    const entries = await socket.readDir(VIS_NAMESPACE, folder ? `${project}/${folder}` : project);
    const files: string[] = [];
    for (const entry of entries) {
        const name = folder ? `${folder}/${entry.file}` : entry.file;
        if (entry.isDir) {
            files.push(...(await listProjectFiles(socket, project, name)));
        } else if (name !== VIEWS_FILE && !name.startsWith(BACKUP_PREFIX)) {
            files.push(name);
        }
    }
    return files;
}

async function copyProjectFile(socket: AdminSocket, from: string, to: string, name: string): Promise<void> {
    const base64 = fileContent(await socket.readFile(VIS_NAMESPACE, `${from}/${name}`, true));
    if (typeof base64 !== 'string') {
        throw new Error('unexpected file content');
    }
    const binary = atob(base64);
    if (!binary.length) {
        // The socket refuses to write a file without content ("No data provided"), and e.g. vis-user.css is
        // often empty. A line break is the closest thing to an empty file.
        await writeTextFile(socket, `${to}/${name}`, '\n');
        return;
    }
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    await socket.writeFile64(VIS_NAMESPACE, `${to}/${name}`, bytes.buffer);
}

function countWidgets(project: VisProject): { views: number; widgets: number; oldWidgets: number } {
    const result = { views: 0, widgets: 0, oldWidgets: 0 };
    Object.keys(project).forEach(viewName => {
        const widgets = project[viewName]?.widgets;
        if (viewName === '___settings' || !widgets || typeof widgets !== 'object') {
            return;
        }
        result.views++;
        Object.values(widgets).forEach(widget => {
            result.widgets++;
            if (isOldInventwoWidget(widget)) {
                result.oldWidgets++;
            }
        });
    });
    return result;
}

/**
 * The whole conversion of a project:
 * 1. widgets shown in several views: convert the copies that are still in the project and restore the lost ones
 *    from the vis-1 project (if given) – vis-2 removes these copies when it loads a project
 * 2. convert the old inventwo widgets
 * 3. adjust the file paths, if the result is written to another project
 */
function convertProject(
    originalText: string,
    vis1Text: string | null,
    source: string,
    target: string,
): { project: VisProject; report: MigrationReport; restored: RestoredWidget[]; fromVis1: boolean } {
    let project: VisProject = JSON.parse(originalText);
    let restored: RestoredWidget[] = [];
    if (hasMultiViewCopies(project)) {
        ({ project, restored } = convertMultiViewWidgets(project));
    }
    let fromVis1 = false;
    if (vis1Text) {
        const result = restoreMultiViewWidgets(project, JSON.parse(vis1Text));
        project = result.project;
        if (result.restored.length) {
            restored = [...restored, ...result.restored];
            fromVis1 = true;
        }
    }
    const result = migrateVisProject(project);
    project =
        target === source ? result.project : rewriteProjectPaths(result.project, [[VIS_NAMESPACE, source]], target);

    // Tells running vis-2 clients that the project has changed
    const settings = project.___settings as Record<string, unknown> | undefined;
    if (settings && typeof settings === 'object') {
        settings.ts = `${Date.now()}.${Math.random().toString(36).substring(7)}`;
    }
    return { project, report: result.report, restored, fromVis1 };
}

/**
 * Names of the projects of a vis file storage: the folders that contain a views file.
 * A folder without it is no project, e.g. the rest of an aborted copy – it may be used as target again.
 */
async function listProjects(socket: AdminSocket, namespace: string): Promise<string[]> {
    const entries = await socket.readDir(namespace, '');
    const projects: string[] = [];
    for (const entry of entries) {
        if (!entry.isDir) {
            continue;
        }
        const files = await socket.readDir(namespace, entry.file).catch((): DirEntry[] => []);
        if (files.some(file => !file.isDir && file.file === VIEWS_FILE)) {
            projects.push(entry.file);
        }
    }
    return projects.sort();
}

/** `20261117-191502` */
function timestamp(): string {
    const now = new Date();
    const pad = (num: number): string => String(num).padStart(2, '0');
    return (
        `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-` +
        `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    );
}

function downloadJson(fileName: string, content: unknown): void {
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
}

/** One numbered section of the page */
function Section(props: { title: string; children: React.ReactNode }): React.JSX.Element {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold' }}
            >
                {props.title}
            </Typography>
            {props.children}
        </Paper>
    );
}

/** A number with its meaning, e.g. "406 – convertible without rework" */
function Figure(props: { value: number; label: string; color: string }): React.JSX.Element {
    return (
        <Paper
            variant="outlined"
            sx={{ p: 1.5, minWidth: 160, flex: 1, borderLeft: 4, borderLeftColor: props.color }}
        >
            <Typography variant="h5">{props.value}</Typography>
            <Typography
                variant="body2"
                color="text.secondary"
            >
                {props.label}
            </Typography>
        </Paper>
    );
}

/** Collapsible block with a title */
function Details(props: { title: string; expanded?: boolean; children: React.ReactNode }): React.JSX.Element {
    return (
        <Accordion
            variant="outlined"
            disableGutters
            defaultExpanded={props.expanded}
        >
            <AccordionSummary expandIcon={<span>▾</span>}>
                <Typography sx={{ fontWeight: 'bold' }}>{props.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{props.children}</AccordionDetails>
        </Accordion>
    );
}

export default function Migration(props: MigrationProps): React.JSX.Element {
    const socket = props.socket;

    const [projects, setProjects] = useState<string[] | null>(null);
    const [vis1Projects, setVis1Projects] = useState<string[]>([]);
    const [project, setProject] = useState('');
    const [vis1Project, setVis1Project] = useState('');
    const [targetName, setTargetName] = useState('');
    const [busy, setBusy] = useState(false);
    const [progress, setProgress] = useState('');
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [confirm, setConfirm] = useState(false);
    const [done, setDone] = useState<Done | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!socket) {
            return;
        }
        listProjects(socket, VIS_NAMESPACE)
            .then(list => {
                setProjects(list);
                if (list.length === 1) {
                    setProject(list[0]);
                }
            })
            .catch(e => setError(t('migration_error_list', String(e))));
        // vis-1 is optional: without it there is simply nothing to restore from
        listProjects(socket, VIS1_NAMESPACE)
            .then(setVis1Projects)
            .catch(() => setVis1Projects([]));
    }, [socket]);

    const target = targetName.trim();
    let targetError = '';
    if (target && !/^[-\w]+$/.test(target)) {
        targetError = t('migration_target_invalid');
    } else if (target && projects?.includes(target)) {
        targetError = t('migration_target_exists');
    }

    const resetResult = (): void => {
        setAnalysis(null);
        setDone(null);
        setError('');
    };

    const onAnalyse = useCallback(async () => {
        if (!socket || !project) {
            return;
        }
        setBusy(true);
        setError('');
        setAnalysis(null);
        setDone(null);
        try {
            const originalText = await readViewsFile(socket, VIS_NAMESPACE, project);
            const vis1Text = vis1Project ? await readViewsFile(socket, VIS1_NAMESPACE, vis1Project) : null;
            const result = convertProject(originalText, vis1Text, project, project);
            setAnalysis({
                ...countWidgets(JSON.parse(originalText)),
                report: result.report,
                restored: result.restored,
                fromVis1: result.fromVis1,
            });
        } catch (e) {
            setError(t('migration_error_read', `${VIS_NAMESPACE}/${project}/${VIEWS_FILE}`, String(e)));
        }
        setBusy(false);
    }, [socket, project, vis1Project]);

    const onMigrate = useCallback(async () => {
        setConfirm(false);
        if (!socket || !project) {
            return;
        }
        setBusy(true);
        setError('');
        try {
            // Read the files again: they could have been changed since the analysis
            const originalText = await readViewsFile(socket, VIS_NAMESPACE, project);
            const vis1Text = vis1Project ? await readViewsFile(socket, VIS1_NAMESPACE, vis1Project) : null;
            const result = convertProject(originalText, vis1Text, project, target || project);
            const migratedText = JSON.stringify(result.project, null, 2);
            const state: Analysis = {
                ...countWidgets(JSON.parse(originalText)),
                report: result.report,
                restored: result.restored,
                fromVis1: result.fromVis1,
            };

            if (target) {
                // New project: copy all files of the source, then write the converted views. The source stays as it is.
                const files = await listProjectFiles(socket, project);
                for (let i = 0; i < files.length; i++) {
                    setProgress(t('migration_progress_copy', i + 1, files.length));
                    try {
                        await copyProjectFile(socket, project, target, files[i]);
                    } catch (e) {
                        throw new Error(t('migration_error_copy', files[i], String(e)));
                    }
                }
                setProgress(t('migration_progress_write'));
                await writeTextFile(socket, `${target}/${VIEWS_FILE}`, migratedText);
                setAnalysis(state);
                setDone({ converted: result.report.converted, target, files: files.length });
                setTargetName('');
                setProjects(await listProjects(socket, VIS_NAMESPACE));
            } else {
                // In place: 1. backup, and only if it can be read back unchanged ...
                setProgress(t('migration_progress_write'));
                const backup = `${BACKUP_PREFIX}${timestamp()}.json`;
                await writeTextFile(socket, `${project}/${backup}`, originalText);
                const saved = fileContent(await socket.readFile(VIS_NAMESPACE, `${project}/${backup}`));
                const savedText = typeof saved === 'string' ? saved : JSON.stringify(saved);
                if (JSON.stringify(JSON.parse(savedText)) !== JSON.stringify(JSON.parse(originalText))) {
                    throw new Error(t('migration_error_backup'));
                }
                // 2. ... the project is overwritten
                await writeTextFile(socket, `${project}/${VIEWS_FILE}`, migratedText);
                setAnalysis(state);
                setDone({ converted: result.report.converted, backup, files: 0 });
            }
        } catch (e) {
            setError(t('migration_error_write', e instanceof Error ? e.message : String(e)));
        }
        setProgress('');
        setBusy(false);
    }, [socket, project, vis1Project, target]);

    const report = analysis?.report;
    const restored = analysis?.restored || [];
    const fullCount = report ? report.converted - report.partial.length : 0;
    const hasWork = !!report && (report.converted > 0 || restored.length > 0);
    const startLabel = target ? t('migration_start_new', target) : t('migration_start_overwrite', project);

    /** Skipped widgets grouped by template */
    const skippedByTpl = useMemo(() => {
        const result: Record<string, number> = {};
        (report?.skipped || []).forEach(entry => {
            const key = entry.subType ? `${entry.tpl} (${entry.subType})` : entry.tpl;
            result[key] = (result[key] || 0) + 1;
        });
        return result;
    }, [report]);

    let restoreText = '';
    if (analysis && restored.length) {
        restoreText = analysis.fromVis1
            ? t('migration_restore_summary', restored.length, restored.filter(entry => entry.added).length)
            : t('migration_multiview_summary', restored.length);
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 1100, display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
            <Box>
                <Typography variant="h6">{t('migration_title')}</Typography>
                <Typography variant="body2">{t('migration_intro')}</Typography>
            </Box>

            <Alert severity="warning">
                <AlertTitle>{t('migration_risk_title')}</AlertTitle>
                <Box
                    component="ul"
                    sx={{ m: 0, pl: 2.5 }}
                >
                    <li>{t('migration_risk_1')}</li>
                    <li>{t('migration_risk_2')}</li>
                    <li>{t('migration_risk_3')}</li>
                    <li>{t('migration_risk_4')}</li>
                </Box>
            </Alert>

            <Alert severity="info">
                {t('migration_disclaimer')}{' '}
                <Link
                    href={ISSUES_URL}
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('migration_disclaimer_issue')}
                </Link>
                .
            </Alert>

            <Details title={t('migration_support_title')}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('migration_support_old')}</TableCell>
                            <TableCell>{t('migration_support_new')}</TableCell>
                            <TableCell>{t('migration_support_result')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {SUPPORT.map(entry => (
                            <TableRow key={entry.old}>
                                <TableCell>{entry.old}</TableCell>
                                <TableCell>
                                    {entry.target.startsWith('migration_') ? t(entry.target) : entry.target}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        size="small"
                                        color={LEVEL_COLOR[entry.level]}
                                        label={t(`migration_level_${entry.level}`)}
                                        sx={{ mr: 1 }}
                                    />
                                    {entry.note ? t(entry.note) : ''}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {t('migration_support_dropped')}
                </Typography>
            </Details>

            {!socket ? <Alert severity="error">{t('migration_no_socket')}</Alert> : null}
            {projects && !projects.length ? <Alert severity="info">{t('migration_no_projects')}</Alert> : null}

            <Section title={t('migration_step_source')}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <FormControl
                        variant="standard"
                        sx={{ minWidth: 260, flex: 1 }}
                    >
                        <InputLabel shrink>{t('migration_source_vis2')}</InputLabel>
                        <Select
                            value={project}
                            displayEmpty
                            disabled={!projects?.length || busy}
                            onChange={e => {
                                setProject(e.target.value);
                                resetResult();
                            }}
                        >
                            {(projects || []).map(name => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        variant="standard"
                        sx={{ minWidth: 260, flex: 1 }}
                        label={t('migration_target_name')}
                        value={targetName}
                        disabled={busy}
                        error={!!targetError}
                        helperText={targetError || t('migration_target_help_optional')}
                        onChange={e => {
                            setTargetName(e.target.value);
                            setDone(null);
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Box>

                {vis1Projects.length ? (
                    <FormControl
                        variant="standard"
                        sx={{ maxWidth: 520 }}
                    >
                        <InputLabel shrink>{t('migration_reference_vis1')}</InputLabel>
                        <Select
                            value={vis1Project}
                            displayEmpty
                            disabled={busy}
                            onChange={e => {
                                setVis1Project(e.target.value);
                                resetResult();
                            }}
                        >
                            <MenuItem value="">
                                <em>{t('migration_reference_none')}</em>
                            </MenuItem>
                            {vis1Projects.map(name => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>{t('migration_reference_help')}</FormHelperText>
                    </FormControl>
                ) : null}

                {project && !targetError && target ? (
                    <Alert severity="info">{t('migration_info_copy', project, target)}</Alert>
                ) : null}
                {project && !targetError && !target ? (
                    <Alert severity="warning">{t('migration_warn_overwrite', project)}</Alert>
                ) : null}
            </Section>

            <Section title={t('migration_step_preview')}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        disabled={!project || busy}
                        onClick={onAnalyse}
                    >
                        {t('migration_analyse')}
                    </Button>
                    {busy && !progress ? <CircularProgress size={24} /> : null}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {t('migration_preview_text')}
                    </Typography>
                </Box>

                {analysis && report ? (
                    <>
                        <Typography variant="body2">
                            {t('migration_summary', analysis.views, analysis.widgets, analysis.oldWidgets)}
                            {!hasWork && !report.skipped.length ? ` ${t('migration_nothing')}` : ''}
                            {restoreText ? ` ${restoreText}` : ''}
                        </Typography>
                        {report.converted || report.skipped.length ? (
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Figure
                                    value={fullCount}
                                    label={t('migration_result_full')}
                                    color="success.main"
                                />
                                <Figure
                                    value={report.partial.length}
                                    label={t('migration_result_partial')}
                                    color="warning.main"
                                />
                                <Figure
                                    value={report.skipped.length}
                                    label={t('migration_result_skipped')}
                                    color="text.disabled"
                                />
                            </Box>
                        ) : null}
                    </>
                ) : null}
            </Section>

            <Section title={t('migration_step_run')}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                    {!done ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={busy || !hasWork || !!targetError}
                            onClick={() => setConfirm(true)}
                        >
                            {startLabel}
                        </Button>
                    ) : null}
                    {report ? (
                        <Button
                            variant="outlined"
                            onClick={() =>
                                downloadJson(`inventwo-migration-${done?.target || project}.json`, {
                                    project,
                                    target: done?.target,
                                    date: new Date().toISOString(),
                                    migrated: !!done,
                                    backup: done?.backup,
                                    ...report,
                                    restored,
                                    partial: report.partial.map(entry => ({
                                        ...entry,
                                        notes: entry.notes.map(noteText),
                                    })),
                                })
                            }
                        >
                            {t('migration_download_report')}
                        </Button>
                    ) : null}
                </Box>
                {progress ? (
                    <Box>
                        <Typography variant="body2">{progress}</Typography>
                        <LinearProgress />
                    </Box>
                ) : null}
                {error ? <Alert severity="error">{error}</Alert> : null}
                {done ? (
                    <Alert severity="success">
                        {done.target
                            ? t('migration_done_new', done.target, done.converted, done.files)
                            : t(
                                  'migration_done_overwrite',
                                  done.converted,
                                  project,
                                  `${VIS_NAMESPACE}/${project}/${done.backup}`,
                              )}
                        <br />
                        {done.target ? t('migration_done_hint_new') : t('migration_done_hint_overwrite')}
                    </Alert>
                ) : null}
            </Section>

            {report && Object.keys(report.byMapping).length ? (
                <Details title={`${t('migration_table_mappings')} (${report.converted})`}>
                    <Table
                        size="small"
                        sx={{ maxWidth: 480 }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('migration_col_mapping')}</TableCell>
                                <TableCell align="right">{t('migration_col_count')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(report.byMapping)
                                .sort()
                                .map(mapping => (
                                    <TableRow key={mapping}>
                                        <TableCell>{mapping}</TableCell>
                                        <TableCell align="right">{report.byMapping[mapping]}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Details>
            ) : null}

            {report?.partial.length ? (
                <Details
                    title={`${t('migration_table_partial')} (${report.partial.length})`}
                    expanded={report.partial.length <= 25}
                >
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('migration_col_view')}</TableCell>
                                <TableCell>{t('migration_col_widget')}</TableCell>
                                <TableCell>{t('migration_col_mapping')}</TableCell>
                                <TableCell>{t('migration_col_notes')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.partial.map(entry => (
                                <TableRow key={`${entry.view}/${entry.wid}`}>
                                    <TableCell>{entry.view}</TableCell>
                                    <TableCell>{entry.wid}</TableCell>
                                    <TableCell>{entry.mapping}</TableCell>
                                    <TableCell>
                                        {entry.notes.map((note, i) => (
                                            <div key={i}>{noteText(note)}</div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Details>
            ) : null}

            {report?.skipped.length ? (
                <Details
                    title={`${t('migration_table_skipped')} (${report.skipped.length})`}
                    expanded={report.skipped.length <= 25}
                >
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {Object.keys(skippedByTpl)
                            .sort()
                            .map(tpl => (
                                <Chip
                                    key={tpl}
                                    size="small"
                                    label={`${tpl}: ${skippedByTpl[tpl]}`}
                                />
                            ))}
                    </Box>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('migration_col_view')}</TableCell>
                                <TableCell>{t('migration_col_widget')}</TableCell>
                                <TableCell>{t('migration_col_template')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {report.skipped.map(entry => (
                                <TableRow key={`${entry.view}/${entry.wid}`}>
                                    <TableCell>{entry.view}</TableCell>
                                    <TableCell>{entry.wid}</TableCell>
                                    <TableCell>
                                        {entry.subType ? `${entry.tpl} (${entry.subType})` : entry.tpl}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Details>
            ) : null}

            {restored.length ? (
                <Details title={`${t('migration_table_restored')} (${restored.length})`}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('migration_col_view')}</TableCell>
                                <TableCell>{t('migration_col_widget')}</TableCell>
                                <TableCell>{t('migration_col_other_views')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restored.map(entry => (
                                <TableRow key={`${entry.view}/${entry.wid}`}>
                                    <TableCell>{entry.view}</TableCell>
                                    <TableCell>{entry.wid}</TableCell>
                                    <TableCell>{entry.views.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Details>
            ) : null}

            <Dialog
                open={confirm}
                onClose={() => setConfirm(false)}
            >
                <DialogTitle>{t('migration_confirm_title')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {target
                            ? t('migration_confirm_new', target, report?.converted || 0)
                            : t('migration_confirm_overwrite', report?.converted || 0, project)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onMigrate}
                    >
                        {startLabel}
                    </Button>
                    <Button
                        variant="contained"
                        color="grey"
                        onClick={() => setConfirm(false)}
                    >
                        {t('migration_cancel')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
