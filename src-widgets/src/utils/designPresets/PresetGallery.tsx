import React from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    FileDownload as ExportIcon,
    Palette as PaletteIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { I18n } from '@iobroker/gui-components';
import type {
    CustomPaletteProperties,
    Project,
    RxWidgetInfo,
    SingleWidget,
    SingleWidgetId,
} from '@iobroker/types-vis-2';

import { BuiltinChip } from './BuiltinChip';
import { type DesignData, getDesignGroups, sanitizeDesign } from './designFields';
import { type DesignPreset, loadPresets, serializePresets, updatePresets } from './presetStore';
import { PRESET_WIDGET_TYPES, type PresetWidgetType } from './registry';

const I18N_PREFIX = 'vis_2_widgets_inventwo_';
const WIDGET_SET = 'vis-2-widgets-inventwo';
const t = (key: string, ...args: (string | number)[]): string => I18n.t(`${I18N_PREFIX}${key}`, ...args);

/** Start position of a new widget and the step used to avoid placing it exactly on top of another one */
const INSERT_OFFSET = 20;
const MAX_CASCADE = 50;

type LooseRecord = Record<string, unknown>;

/** `addWidget` of the vis-2 editor (`window.visAddWidget`, set by the editor since 2.x) */
type VisAddWidget = (
    tpl: string,
    left: number,
    top: number,
    data?: LooseRecord,
    style?: LooseRecord,
) => Promise<string | undefined>;

function download(fileName: string, text: string): void {
    const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function safeFileName(name: string): string {
    return name.replace(/[^\w\- ]+/g, '_').trim() || 'preset';
}

function widgetLabel(info: RxWidgetInfo): string {
    return info.visWidgetLabel ? I18n.t(`${I18N_PREFIX}${info.visWidgetLabel}`) : info.id;
}

/** Label for the navigation: without the explanation in brackets, e.g. "Universal (Schalter, …)" → "Universal" */
function shortLabel(label: string): string {
    const pos = label.indexOf(' (');
    return pos > 0 ? label.substring(0, pos) : label;
}

/** Widget type shown last, so the gallery opens on it again (kept while the editor page is open) */
let lastSelectedType: string | null = null;

function hasIndex(item: LooseRecord): boolean {
    return typeof item.indexFrom === 'number' || (typeof item.indexFrom === 'string' && !!item.indexFrom);
}

/** Resolves `indexFrom`/`indexTo`: a number is taken as is, a string names the attribute that holds the value */
function indexBound(value: unknown, data: LooseRecord, fallback: number): number {
    if (Number.isInteger(value)) {
        return value as number;
    }
    if (typeof value === 'string' && value) {
        return parseInt(String(data[value]), 10);
    }
    return fallback;
}

interface ExpandedGroup {
    name: string;
    fields: LooseRecord[];
}

/** Expands indexed groups and fields like the vis-2 editor does (group `states` → `states-1`, field `color` → `color1`) */
function expandAttributes(info: RxWidgetInfo, data: LooseRecord): ExpandedGroup[] {
    const result: ExpandedGroup[] = [];
    const expandFields = (fields: LooseRecord[], suffix: string): LooseRecord[] => {
        const list: LooseRecord[] = [];
        fields.forEach(field => {
            if (typeof field.name !== 'string') {
                return;
            }
            if (!hasIndex(field)) {
                list.push({ ...field, name: `${field.name}${suffix}` });
                return;
            }
            const from = indexBound(field.indexFrom, data, 1);
            const to = indexBound(field.indexTo, data, 1);
            for (let i = from; i <= to; i++) {
                list.push({ ...field, name: `${field.name}${suffix}${i}` });
            }
        });
        return list;
    };

    (info.visAttrs as unknown as LooseRecord[]).forEach(group => {
        const name = typeof group.name === 'string' && group.name ? group.name : 'common';
        const fields = Array.isArray(group.fields) ? (group.fields as LooseRecord[]) : [];
        if (!hasIndex(group)) {
            result.push({ name, fields: expandFields(fields, '') });
            return;
        }
        const from = indexBound(group.indexFrom, data, NaN);
        const to = indexBound(group.indexTo, data, NaN);
        for (let i = from; i <= to; i++) {
            result.push({ name: `${name}-${i}`, fields: expandFields(fields, String(i)) });
        }
    });
    return result;
}

/**
 * Sets the `default` of every attribute that has no value yet, the same way the vis-2 editor does when a widget is
 * dropped from the palette. Repeated because a default may be a counter that adds further indexed attributes.
 */
export function fillDefaults(info: RxWidgetInfo, data: LooseRecord): void {
    for (let round = 0; round < 3; round++) {
        let changed = false;
        expandAttributes(info, data).forEach(group => {
            group.fields.forEach(field => {
                const name = field.name as string;
                if (field.default !== undefined && field.default !== null && data[name] === undefined) {
                    data[name] = field.default;
                    data[`g_${group.name}`] = true;
                    changed = true;
                }
            });
        });
        if (!changed) {
            break;
        }
    }
}

/** Design values of a preset as they are written to a new widget: only known design attributes, no "unset" values */
export function presetDesignValues(type: PresetWidgetType, preset: DesignPreset): LooseRecord {
    const design: DesignData = sanitizeDesign(getDesignGroups(type.getWidgetInfo(), type.spec), preset.design);
    const result: LooseRecord = {};
    Object.entries(design).forEach(([key, value]) => {
        if (value !== null) {
            result[key] = value;
        }
    });
    return result;
}

function pixels(value: unknown): number {
    if (typeof value === 'number') {
        return value;
    }
    return typeof value === 'string' ? parseFloat(value) : NaN;
}

/** Top left corner, moved diagonally as long as another widget starts at exactly that place */
function freePosition(project: Project, viewName: string): { left: number; top: number } {
    const widgets = Object.values(project[viewName]?.widgets ?? {}) as SingleWidget[];
    const taken = widgets
        .filter(w => !w.grouped && w.style)
        .map(w => ({
            left: pixels((w.style as LooseRecord).left),
            top: pixels((w.style as LooseRecord).top),
        }));
    let left = INSERT_OFFSET;
    let top = INSERT_OFFSET;
    for (let i = 0; i < MAX_CASCADE; i++) {
        if (!taken.some(p => Math.abs(p.left - left) < 5 && Math.abs(p.top - top) < 5)) {
            break;
        }
        left += INSERT_OFFSET;
        top += INSERT_OFFSET;
    }
    return { left, top };
}

/**
 * Adds a new widget of the preset's type with the preset's design to the selected view.
 *
 * The editor's own `addWidget` (`window.visAddWidget`) is used if available: it works on the current project state,
 * fills the defaults, applies `visDefaultStyle` and selects the new widget, exactly like a drop from the palette.
 * Otherwise the widget is built here the same way and written with `changeProject`.
 */
async function insertPresetWidget(
    palette: CustomPaletteProperties,
    type: PresetWidgetType,
    preset: DesignPreset,
): Promise<void> {
    const view = palette.selectedView;
    if (!view || !palette.project[view]) {
        throw new Error(t('design_preset_no_view'));
    }
    const info = type.getWidgetInfo();
    const design = presetDesignValues(type, preset);
    const { left, top } = freePosition(palette.project, view);

    const visAddWidget = (window as unknown as { visAddWidget?: VisAddWidget }).visAddWidget;
    if (typeof visAddWidget === 'function') {
        await visAddWidget(info.id, left, top, design);
        return;
    }

    const project = JSON.parse(JSON.stringify(palette.project)) as Project;
    const data: LooseRecord = { bindings: [] };
    if (
        info.visAttrs.some(
            group => !hasIndex(group as unknown as LooseRecord) && group.fields.some(f => f.name === 'oid'),
        )
    ) {
        data.oid = 'nothing_selected';
    }
    Object.assign(data, design);
    fillDefaults(info, data);

    const style: LooseRecord = { bindings: [], left: `${left}px`, top: `${top}px` };
    Object.assign(style, info.visDefaultStyle ?? {});
    if (style.position === 'relative') {
        style.width = '100%';
    }

    const wid: SingleWidgetId = palette.helpers.getNewWidgetId(project);
    project[view].widgets[wid] = {
        tpl: info.id,
        widgetSet: WIDGET_SET,
        data,
        style,
    };
    await palette.changeProject(project);
}

interface TypePresets {
    type: PresetWidgetType;
    label: string;
    presets: DesignPreset[];
}

interface PresetGalleryProps {
    palette: CustomPaletteProperties;
    onClose: () => void;
}

interface PresetGalleryState {
    list: TypePresets[] | null;
    busy: boolean;
    error: string;
    status: string;
    toDelete: { type: PresetWidgetType; preset: DesignPreset } | null;
    /** Widget type shown on the right */
    selected: string | null;
}

/** Dialog with the saved presets of all widget types */
class PresetGallery extends React.Component<PresetGalleryProps, PresetGalleryState> {
    private mounted = false;

    constructor(props: PresetGalleryProps) {
        super(props);
        this.state = { list: null, busy: false, error: '', status: '', toDelete: null, selected: lastSelectedType };
    }

    componentDidMount(): void {
        this.mounted = true;
        void this.reload();
    }

    componentWillUnmount(): void {
        this.mounted = false;
    }

    /** Loads the built-in and own presets of all types; if the own ones cannot be read, the built-in ones are shown */
    private async reload(): Promise<void> {
        this.setState({ busy: true, error: '' });
        try {
            const list: TypePresets[] = [];
            let error: Error | null = null;
            for (const type of PRESET_WIDGET_TYPES) {
                const info = type.getWidgetInfo();
                const loaded = await loadPresets(this.props.palette.socket, type.id, getDesignGroups(info, type.spec));
                error ??= loaded.error;
                list.push({ type, label: widgetLabel(info), presets: loaded.presets });
            }
            if (this.mounted) {
                // keep the shown type; otherwise start with the first type that has presets
                const selected = list.some(entry => entry.type.id === this.state.selected)
                    ? this.state.selected
                    : ((list.find(entry => entry.presets.length) ?? list[0])?.type.id ?? null);
                this.setState({
                    list,
                    selected,
                    error: error ? `${t('design_preset_error_load')}: ${String(error)}` : '',
                });
            }
        } catch (e) {
            if (this.mounted) {
                this.setState({ error: `${t('design_preset_error_load')}: ${String(e)}` });
            }
        } finally {
            if (this.mounted) {
                this.setState({ busy: false });
            }
        }
    }

    private onInsert(type: PresetWidgetType, preset: DesignPreset): void {
        this.setState({ busy: true, error: '', status: '' });
        insertPresetWidget(this.props.palette, type, preset)
            .then(() => this.props.onClose())
            .catch(e => {
                if (this.mounted) {
                    this.setState({ busy: false, error: `${t('design_preset_error_insert')}: ${e}` });
                }
            });
    }

    private onDelete = (): void => {
        const target = this.state.toDelete;
        this.setState({ toDelete: null });
        if (!target || target.preset.builtin) {
            return;
        }
        this.setState({ busy: true, error: '', status: '' });
        updatePresets(this.props.palette.socket, target.type.id, [], [target.preset.name])
            .then(() => {
                if (this.mounted) {
                    this.setState({ status: t('design_preset_deleted', target.preset.name) });
                }
                return this.reload();
            })
            .catch(e => {
                if (this.mounted) {
                    this.setState({ busy: false, error: `${t('design_preset_error_storage')}: ${e}` });
                }
            });
    };

    private renderCard(type: PresetWidgetType, preset: DesignPreset): React.JSX.Element {
        const { busy } = this.state;
        const saved = new Date(preset.saved);
        return (
            <Card
                key={`${preset.builtin ? 'builtin' : 'user'}:${preset.name}`}
                variant="outlined"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        height: 110,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 1,
                        bgcolor: 'action.hover',
                        backgroundImage: 'repeating-conic-gradient(rgba(128,128,128,0.12) 0% 25%, transparent 0% 50%)',
                        backgroundSize: '16px 16px',
                    }}
                >
                    {preset.thumbnail ? (
                        <img
                            src={preset.thumbnail}
                            alt={preset.name}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    ) : (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {t('design_preset_no_thumbnail')}
                        </Typography>
                    )}
                    {preset.builtin ? (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 6,
                                right: 6,
                                bgcolor: 'background.paper',
                                borderRadius: 4,
                            }}
                        >
                            <BuiltinChip />
                        </Box>
                    ) : null}
                </Box>
                <CardContent sx={{ py: 1, px: 1.5, flexGrow: 1, '&:last-child': { pb: 1 } }}>
                    <Typography
                        variant="body2"
                        sx={{ fontWeight: 'bold', wordBreak: 'break-word' }}
                    >
                        {preset.name}
                    </Typography>
                    {preset.builtin || Number.isNaN(saved.getTime()) ? null : (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {saved.toLocaleString()}
                        </Typography>
                    )}
                </CardContent>
                <CardActions sx={{ pt: 0, px: 1, justifyContent: 'space-between' }}>
                    <Tooltip title={t('design_preset_insert_hint')}>
                        <span>
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<AddIcon />}
                                disabled={busy}
                                onClick={() => this.onInsert(type, preset)}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                {t('design_preset_insert')}
                            </Button>
                        </span>
                    </Tooltip>
                    <Box sx={{ display: 'flex', flexShrink: 0 }}>
                        <Tooltip title={t('design_preset_export')}>
                            <span>
                                <IconButton
                                    size="small"
                                    disabled={busy}
                                    onClick={() =>
                                        download(`${safeFileName(preset.name)}.json`, serializePresets([preset]))
                                    }
                                >
                                    <ExportIcon fontSize="small" />
                                </IconButton>
                            </span>
                        </Tooltip>
                        {preset.builtin ? null : (
                            <Tooltip title={t('design_preset_delete')}>
                                <span>
                                    <IconButton
                                        size="small"
                                        disabled={busy}
                                        onClick={() => this.setState({ toDelete: { type, preset } })}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    </Box>
                </CardActions>
            </Card>
        );
    }

    private onSelect(typeId: string): void {
        lastSelectedType = typeId;
        this.setState({ selected: typeId });
    }

    /** Navigation on the left: one entry per widget type with the number of presets */
    private renderNavigation(list: TypePresets[]): React.JSX.Element {
        return (
            <List
                dense
                disablePadding
                sx={{ width: 220, flexShrink: 0, overflowY: 'auto', borderRight: 1, borderColor: 'divider' }}
            >
                {list.map(entry => (
                    <ListItemButton
                        key={entry.type.id}
                        selected={entry.type.id === this.state.selected}
                        onClick={() => this.onSelect(entry.type.id)}
                        title={entry.label}
                    >
                        <ListItemText
                            primary={shortLabel(entry.label)}
                            slotProps={{ primary: { noWrap: true } }}
                        />
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                        >
                            {entry.presets.length}
                        </Typography>
                    </ListItemButton>
                ))}
            </List>
        );
    }

    /** Presets of the selected widget type on the right */
    private renderPresets(entry: TypePresets | undefined): React.JSX.Element | null {
        if (!entry) {
            return null;
        }
        return (
            <>
                <Typography
                    variant="subtitle1"
                    sx={{ mb: 1 }}
                >
                    {entry.label}
                </Typography>
                {entry.presets.length ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                            gap: 1.5,
                        }}
                    >
                        {entry.presets.map(preset => this.renderCard(entry.type, preset))}
                    </Box>
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {t('design_preset_gallery_empty')}
                    </Typography>
                )}
            </>
        );
    }

    render(): React.JSX.Element {
        const { list, busy, error, status, toDelete, selected } = this.state;

        return (
            <>
                <Dialog
                    open
                    onClose={this.props.onClose}
                    fullWidth
                    maxWidth="lg"
                    slotProps={{ paper: { sx: { height: '85vh' } } }}
                >
                    <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>{t('widget_design_presets')}</Box>
                        {busy ? <CircularProgress size={20} /> : null}
                        <Tooltip title={t('design_preset_refresh')}>
                            <span>
                                <IconButton
                                    size="small"
                                    disabled={busy}
                                    onClick={() => void this.reload()}
                                >
                                    <RefreshIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </DialogTitle>
                    <DialogContent
                        dividers
                        sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        {error || status ? (
                            <Box sx={{ px: 2, pt: 1 }}>
                                {error ? <Typography color="error">{error}</Typography> : null}
                                {status ? <Typography color="success.main">{status}</Typography> : null}
                            </Box>
                        ) : null}
                        {list ? (
                            <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
                                {this.renderNavigation(list)}
                                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                                    {this.renderPresets(list.find(entry => entry.type.id === selected))}
                                </Box>
                            </Box>
                        ) : null}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose}>{t('design_preset_close')}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={!!toDelete}
                    onClose={() => this.setState({ toDelete: null })}
                    maxWidth="xs"
                >
                    <DialogTitle>{t('design_preset_delete')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t('design_preset_delete_confirm', toDelete?.preset.name ?? '')}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ toDelete: null })}>{t('design_preset_cancel')}</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={this.onDelete}
                        >
                            {t('design_preset_delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

interface PresetPaletteEntryState {
    open: boolean;
}

/**
 * Entry of the widget palette (`customPalette`): a button that opens the preset gallery. Class component on purpose,
 * see the note on Fast Refresh in `vite.config.ts`.
 */
export class PresetPaletteEntry extends React.Component<CustomPaletteProperties, PresetPaletteEntryState> {
    constructor(props: CustomPaletteProperties) {
        super(props);
        this.state = { open: false };
    }

    render(): React.JSX.Element {
        return (
            <>
                <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    startIcon={<PaletteIcon />}
                    onClick={() => this.setState({ open: true })}
                >
                    {t('widget_design_presets')}
                </Button>
                {this.state.open ? (
                    <PresetGallery
                        palette={this.props}
                        onClose={() => this.setState({ open: false })}
                    />
                ) : null}
            </>
        );
    }
}
