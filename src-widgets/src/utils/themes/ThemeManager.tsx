import React from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    MenuItem,
    Slider,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    CheckCircle as ActiveIcon,
    ContentCopy as CopyIcon,
    Delete as DeleteIcon,
    DownloadForOffline as ExportAllIcon,
    DriveFileRenameOutline as RenameIcon,
    FileDownload as ExportIcon,
    FileUpload as ImportIcon,
    LibraryAdd as DuplicateIcon,
    Lightbulb as LightbulbIcon,
    RestartAlt as RestoreIcon,
    SettingsBackupRestore as ResetIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import { ColorPicker, I18n, type Connection } from '@iobroker/gui-components';

import {
    THEME_TOKENS,
    getBuiltinStatus,
    sanitizeTokenValue,
    themeIdFromName,
    type ThemeTokenDef,
    type ThemeTokenKey,
    type ThemeTokens,
} from './themeTokens';
import { THEME_ACTIVE_ID, THEME_FOLDER, themeStore, type ThemeInfo } from './themeStore';
import { MAX_THEME_FILE_SIZE, parseThemeFile, serializeThemes, themeFileName, uniqueThemeName } from './themeFile';

const I18N_PREFIX = 'vis_2_widgets_inventwo_';
const t = (key: string, ...args: (string | number)[]): string => I18n.t(`${I18N_PREFIX}${key}`, ...args);

/** Delay before a changed token is written to its data point */
const WRITE_DELAY = 250;

/**
 * Label of a built-in theme: blue "Built-in", or orange "Built-in · modified" when its values differ from the
 * original. `onSelected` = the label sits on the selected (primary colored) list row and needs light colors there.
 */
function renderBuiltinChip(
    status: ReturnType<typeof getBuiltinStatus>,
    size: 'small' | 'medium' = 'small',
    onSelected = false,
): React.JSX.Element | null {
    if (status === 'custom') {
        return null;
    }
    const modified = status === 'modified';
    const small = size === 'small';
    const palette = modified ? 'warning' : 'primary';
    return (
        <Tooltip title={t(modified ? 'theme_builtin_modified_tooltip' : 'theme_builtin_tooltip')}>
            <Chip
                component="span"
                size="small"
                label={t(modified ? 'theme_builtin_modified' : 'theme_builtin')}
                sx={theme => ({
                    flexShrink: 0,
                    height: small ? 18 : 24,
                    fontSize: small ? '0.65rem' : '0.75rem',
                    fontWeight: 500,
                    color: onSelected ? '#fff' : theme.palette[palette].main,
                    backgroundColor: onSelected
                        ? 'rgba(255,255,255,0.22)'
                        : `color-mix(in srgb, ${theme.palette[palette].main} 16%, transparent)`,
                    '& .MuiChip-label': { px: small ? 0.75 : 1 },
                })}
            />
        </Tooltip>
    );
}

/** Data point of a token, e.g. `vis-2-widgets-inventwo.0.themes.dark.accent` */
const tokenStateId = (themeId: string, key: ThemeTokenKey): string => `${THEME_FOLDER}.${themeId}.${key}`;

/** Theme shown last, so the manager opens on it again (kept while the editor page is open) */
let lastSelectedTheme: string | null = null;

function copyToClipboard(text: string): void {
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

/** Copy for pages without the clipboard API (http on another host than localhost) */
function fallbackCopy(text: string): void {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
        document.execCommand('copy');
    } catch {
        // nothing to do: the id is visible and can be selected by hand
    }
    area.remove();
}

/** Offers `text` as a JSON file download */
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

const px = (value: string | number | undefined): string => `${Number(value) || 0}px`;

/** Small two-colored swatch (surface / accent) of a theme */
export function ThemeSwatch(props: { tokens: ThemeTokens; size?: number }): React.JSX.Element {
    const size = props.size ?? 22;
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-flex',
                flexShrink: 0,
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                border: 1,
                borderColor: 'divider',
                background: String(props.tokens.background),
            }}
        >
            <Box
                component="span"
                sx={{ width: '50%', height: '100%', background: String(props.tokens.surface) }}
            />
            <Box
                component="span"
                sx={{ width: '50%', height: '100%', background: String(props.tokens.accent) }}
            />
        </Box>
    );
}

/** Small fake widget rendered from the tokens: tile with icon, active pill, slider track, text and muted text */
function ThemePreview(props: { tokens: ThemeTokens }): React.JSX.Element {
    const tk = props.tokens;
    const border =
        tk.borderStyle === 'none' || !Number(tk.borderWidth)
            ? 'none'
            : `${px(tk.borderWidth)} ${String(tk.borderStyle)} ${String(tk.border)}`;
    const shadow = `${px(tk.shadowX)} ${px(tk.shadowY)} ${px(tk.shadowBlur)} ${px(tk.shadowSize)} ${String(tk.shadow)}`;
    const fontFamily = tk.fontFamily ? String(tk.fontFamily) : undefined;
    const tile = (background: string | number, children: React.ReactNode): React.JSX.Element => (
        <Box
            sx={{
                background: String(background),
                borderRadius: px(tk.radius),
                border,
                boxShadow: shadow,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                minWidth: 0,
            }}
        >
            {children}
        </Box>
    );
    return (
        <Box
            sx={{
                background: String(tk.background),
                borderRadius: 1,
                p: 2,
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: 2,
                fontFamily,
                color: String(tk.text),
            }}
        >
            {tile(
                tk.surfaceVariant,
                <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 34,
                                height: 34,
                                flexShrink: 0,
                                borderRadius: px(tk.radiusSmall),
                                background: String(tk.accent),
                                color: String(tk.onAccent),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <LightbulbIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <Box sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
                                {t('theme_preview_title')}
                            </Box>
                            <Box sx={{ fontSize: 12, color: String(tk.textMuted), lineHeight: 1.3 }}>
                                {t('theme_preview_subtitle')}
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75 }}>
                        <Box
                            sx={{
                                px: 1.25,
                                py: 0.25,
                                fontSize: 12,
                                borderRadius: px(tk.radiusSmall),
                                background: String(tk.accent),
                                color: String(tk.onAccent),
                            }}
                        >
                            {t('theme_preview_on')}
                        </Box>
                        <Box
                            sx={{
                                px: 1.25,
                                py: 0.25,
                                fontSize: 12,
                                borderRadius: px(tk.radiusSmall),
                                background: String(tk.track),
                                color: String(tk.textMuted),
                            }}
                        >
                            {t('theme_preview_off')}
                        </Box>
                    </Box>
                </>,
            )}
            {tile(
                tk.surface,
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                        <span>{t('theme_preview_slider')}</span>
                        <Box
                            component="span"
                            sx={{ color: String(tk.textMuted) }}
                        >
                            60 %
                        </Box>
                    </Box>
                    <Box sx={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', height: 6, borderRadius: 3, background: String(tk.track) }} />
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 0,
                                width: '60%',
                                height: 6,
                                borderRadius: 3,
                                background: String(tk.accent),
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                left: 'calc(60% - 8px)',
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                background: String(tk.thumb),
                                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                            }}
                        />
                    </Box>
                    <Box sx={{ fontSize: 12, color: String(tk.textMuted) }}>{t('theme_preview_muted')}</Box>
                </>,
            )}
        </Box>
    );
}

interface ThemeManagerProps {
    socket: Connection;
    onClose: () => void;
    /** Theme selected when the dialog opens */
    initialTheme?: string;
}

interface ThemeManagerState {
    selected: string | null;
    /** Values typed but not written yet, key `<themeId>.<tokenKey>` */
    drafts: Record<string, string | number>;
    busy: boolean;
    error: string;
    /** Success message, e.g. after an import */
    info: string;
    dialog: 'new' | 'duplicate' | 'rename' | 'delete' | 'reset' | null;
    name: string;
    /** Data point id that was copied last (for the short "copied" feedback) */
    copied: string;
    /** Increased on every store change to re-render */
    revision: number;
}

/**
 * Dialog to create, edit and delete the themes. Every token change is written to its data point (debounced), so all
 * widgets coupled to the theme update immediately. Class component on purpose, see the note on Fast Refresh in
 * `vite.config.ts`.
 */
export class ThemeManager extends React.Component<ThemeManagerProps, ThemeManagerState> {
    private mounted = false;
    private unsubscribe: (() => void) | null = null;
    private readonly timers = new Map<string, { timer: ReturnType<typeof setTimeout>; write: () => void }>();
    private copiedTimer: ReturnType<typeof setTimeout> | null = null;
    /** Draft values not shown yet, see `onTokenChange` */
    private readonly pendingDrafts = new Map<string, string | number>();
    private draftFrame: number | null = null;
    private readonly fileInput = React.createRef<HTMLInputElement>();

    constructor(props: ThemeManagerProps) {
        super(props);
        this.state = {
            selected: props.initialTheme || lastSelectedTheme,
            drafts: {},
            busy: false,
            error: '',
            info: '',
            dialog: null,
            name: '',
            copied: '',
            revision: 0,
        };
    }

    componentDidMount(): void {
        this.mounted = true;
        this.unsubscribe = themeStore.subscribe(() => {
            if (this.mounted) {
                this.setState(state => ({ revision: state.revision + 1 }));
            }
        });
        void this.run(async () => {
            await themeStore.init(this.props.socket);
            // First start: create the built-in themes, so there is something to work with
            if (!themeStore.getThemes().length) {
                await themeStore.seedBuiltinThemes();
            }
        });
    }

    componentWillUnmount(): void {
        this.mounted = false;
        if (this.draftFrame !== null) {
            cancelAnimationFrame(this.draftFrame);
            this.draftFrame = null;
        }
        this.unsubscribe?.();
        this.unsubscribe = null;
        if (this.copiedTimer) {
            clearTimeout(this.copiedTimer);
        }
        // write the pending changes now instead of losing them
        this.timers.forEach(entry => {
            clearTimeout(entry.timer);
            entry.write();
        });
        this.timers.clear();
    }

    /** Selected theme; falls back to the active one or the first one if the selection does not exist (anymore) */
    private get theme(): ThemeInfo | undefined {
        const themes = themeStore.getThemes();
        return (
            (this.state.selected ? themeStore.getTheme(this.state.selected) : undefined) ??
            themeStore.getTheme(themeStore.getGlobalActiveId()) ??
            themes[0]
        );
    }

    private showError(prefix: string, e: unknown): void {
        console.warn(`[inventwo themes] ${prefix}`, e);
        if (this.mounted) {
            this.setState({ error: `${t(prefix)}: ${e instanceof Error ? e.message : String(e)}` });
        }
    }

    private async run(action: () => Promise<void>, errorKey = 'theme_error_storage'): Promise<void> {
        this.setState({ busy: true, error: '', info: '' });
        try {
            await action();
        } catch (e) {
            this.showError(errorKey, e);
        } finally {
            if (this.mounted) {
                this.setState({ busy: false });
            }
        }
    }

    private onSelect(id: string): void {
        lastSelectedTheme = id;
        this.setState({ selected: id });
    }

    /** Shows the value at once and writes it to the data point after `WRITE_DELAY` */
    private onTokenChange(themeId: string, key: ThemeTokenKey, value: string | number): void {
        const draftKey = `${themeId}.${key}`;
        if (THEME_TOKENS.find(def => def.key === key)?.type === 'color') {
            // The color picker reports every move from its own commit phase. Setting state right there makes React
            // render synchronously again and again while dragging, until it aborts with "Maximum update depth
            // exceeded" (#185). So color drafts are collected and shown once per frame, outside of any commit.
            // Text and number fields stay immediate, otherwise their cursor would jump.
            this.pendingDrafts.set(draftKey, value);
            this.draftFrame ??= requestAnimationFrame(() => this.flushDrafts());
        } else {
            this.pendingDrafts.delete(draftKey);
            this.setState(state => ({ drafts: { ...state.drafts, [draftKey]: value } }));
        }

        const pending = this.timers.get(draftKey);
        if (pending) {
            clearTimeout(pending.timer);
        }
        const write = (): void => {
            this.timers.delete(draftKey);
            const sanitized = sanitizeTokenValue(key, value);
            if (sanitized === undefined) {
                // invalid input (e.g. an empty number field): keep the draft, the field shows the error
                return;
            }
            themeStore
                .setToken(themeId, key, sanitized)
                .catch(e => this.showError('theme_error_write', e))
                .finally(() => {
                    // drop the draft unless a newer value was typed meanwhile
                    if (this.mounted && !this.timers.has(draftKey)) {
                        this.setState(state => {
                            const drafts = { ...state.drafts };
                            delete drafts[draftKey];
                            return { drafts };
                        });
                    }
                });
        };
        this.timers.set(draftKey, { timer: setTimeout(write, WRITE_DELAY), write });
    }

    private flushDrafts(): void {
        this.draftFrame = null;
        if (!this.mounted || !this.pendingDrafts.size) {
            this.pendingDrafts.clear();
            return;
        }
        const pending = Object.fromEntries(this.pendingDrafts);
        this.pendingDrafts.clear();
        this.setState(state => ({ drafts: { ...state.drafts, ...pending } }));
    }

    /** Writes the original values of the selected built-in theme back; unsaved edits of it are dropped */
    private onResetBuiltin = (): void => {
        const theme = this.theme;
        this.setState({ dialog: null });
        if (!theme) {
            return;
        }
        const prefix = `${theme.id}.`;
        [...this.timers.entries()].forEach(([draftKey, entry]) => {
            if (draftKey.startsWith(prefix)) {
                clearTimeout(entry.timer);
                this.timers.delete(draftKey);
            }
        });
        [...this.pendingDrafts.keys()].forEach(draftKey => {
            if (draftKey.startsWith(prefix)) {
                this.pendingDrafts.delete(draftKey);
            }
        });
        this.setState(state => ({
            drafts: Object.fromEntries(Object.entries(state.drafts).filter(([key]) => !key.startsWith(prefix))),
        }));
        void this.run(() => themeStore.resetBuiltinTheme(theme.id), 'theme_error_write');
    };

    /** Tokens of a theme including the values not written yet */
    private effectiveTokens(theme: ThemeInfo): ThemeTokens {
        const tokens = { ...theme.tokens };
        THEME_TOKENS.forEach(def => {
            const draft = this.state.drafts[`${theme.id}.${def.key}`];
            if (draft !== undefined) {
                tokens[def.key] = draft;
            }
        });
        return tokens;
    }

    private onCopyId(id: string): void {
        copyToClipboard(id);
        if (this.copiedTimer) {
            clearTimeout(this.copiedTimer);
        }
        this.setState({ copied: id });
        this.copiedTimer = setTimeout(() => this.mounted && this.setState({ copied: '' }), 1500);
    }

    private onNameDialogOk = (): void => {
        const { dialog } = this.state;
        const name = this.state.name.trim();
        const theme = this.theme;
        if (!name) {
            return;
        }
        this.setState({ dialog: null });
        void this.run(async () => {
            if (dialog === 'new') {
                this.onSelect(await themeStore.createTheme(name));
            } else if (dialog === 'duplicate' && theme) {
                this.onSelect(await themeStore.duplicateTheme(theme.id, name));
            } else if (dialog === 'rename' && theme) {
                await themeStore.renameTheme(theme.id, name);
            }
        });
    };

    private onDelete = (): void => {
        const theme = this.theme;
        this.setState({ dialog: null });
        if (!theme) {
            return;
        }
        void this.run(async () => {
            await themeStore.deleteTheme(theme.id);
            const next = themeStore.getThemes().find(th => th.id !== theme.id);
            this.setState({ selected: next?.id ?? null });
            lastSelectedTheme = next?.id ?? null;
        });
    };

    private onExport(themes: ThemeInfo[], fileName: string): void {
        try {
            download(fileName, serializeThemes(themes));
        } catch (e) {
            this.showError('theme_error_export', e);
        }
    }

    /**
     * Creates every theme of the chosen file as a new theme. Nothing is overwritten: if the id or the name exists
     * already, the theme gets a free name like "Name (2)" and an id derived from it.
     */
    private onImportFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) {
            return;
        }
        void this.run(async () => {
            if (file.size > MAX_THEME_FILE_SIZE) {
                throw new Error(t('theme_import_invalid_file'));
            }
            const parsed = parseThemeFile(await file.text());
            if (!parsed) {
                throw new Error(t('theme_import_invalid_file'));
            }
            if (!parsed.length) {
                throw new Error(t('theme_import_none'));
            }
            const themes = themeStore.getThemes();
            const ids = themes.map(th => th.id);
            const names = themes.map(th => th.name);
            let first = '';
            for (const entry of parsed) {
                let name = entry.name;
                let id = entry.id;
                if ((id && ids.includes(id)) || names.some(n => n.toLowerCase() === name.toLowerCase())) {
                    name = uniqueThemeName(name, names);
                    id = undefined;
                }
                id ||= themeIdFromName(name, ids);
                const created = await themeStore.createTheme(name, entry.tokens, id);
                ids.push(created);
                names.push(name);
                first ||= created;
            }
            if (first) {
                this.onSelect(first);
            }
            if (this.mounted) {
                this.setState({ info: t('theme_imported', parsed.length) });
            }
        }, 'theme_error_import');
    };

    private renderIdLine(id: string): React.JSX.Element {
        const copied = this.state.copied === id;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    title={id}
                    sx={{
                        fontFamily: 'monospace',
                        fontSize: 11,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        userSelect: 'all',
                    }}
                >
                    {id}
                </Typography>
                <Tooltip
                    title={copied ? t('theme_id_copied') : t('theme_copy_id')}
                    disableInteractive
                >
                    <IconButton
                        size="small"
                        onClick={() => this.onCopyId(id)}
                        sx={{ p: 0.25 }}
                        aria-label={t('theme_copy_id')}
                    >
                        <CopyIcon
                            sx={{ fontSize: 13 }}
                            color={copied ? 'success' : 'inherit'}
                        />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

    private renderTokenInput(theme: ThemeInfo, def: ThemeTokenDef, value: string | number): React.JSX.Element {
        const onChange = (v: string | number): void => this.onTokenChange(theme.id, def.key, v);
        const invalid = sanitizeTokenValue(def.key, value) === undefined;
        switch (def.type) {
            case 'color':
                return (
                    <ColorPicker
                        id={`inventwo-theme-${def.key}`}
                        value={String(value ?? '')}
                        onChange={v => onChange(v)}
                        sx={{ width: '100%' }}
                    />
                );
            case 'number': {
                const min = def.min ?? 0;
                const max = def.max ?? 100;
                const num = Number(value);
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Slider
                            size="small"
                            min={min}
                            max={max}
                            step={1}
                            value={Number.isFinite(num) ? Math.min(max, Math.max(min, num)) : min}
                            onChange={(_e, v) => onChange(v)}
                            sx={{ flexGrow: 1 }}
                        />
                        <TextField
                            size="small"
                            variant="standard"
                            type="number"
                            value={value}
                            error={invalid}
                            onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
                            slotProps={{
                                htmlInput: { min, max, step: 1 },
                                input: {
                                    endAdornment: (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            px
                                        </Typography>
                                    ),
                                },
                            }}
                            sx={{ width: 80, flexShrink: 0 }}
                        />
                    </Box>
                );
            }
            case 'select':
                return (
                    <TextField
                        select
                        size="small"
                        variant="standard"
                        fullWidth
                        value={String(value)}
                        onChange={e => onChange(e.target.value)}
                    >
                        {(def.options ?? []).map(option => (
                            <MenuItem
                                key={option}
                                value={option}
                            >
                                {t(`theme_border_style_${option}`)}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            default:
                return (
                    <TextField
                        size="small"
                        variant="standard"
                        fullWidth
                        value={String(value ?? '')}
                        error={invalid}
                        placeholder={def.key === 'fontFamily' ? t('theme_font_inherit') : undefined}
                        onChange={e => onChange(e.target.value)}
                    />
                );
        }
    }

    /** Tokens of the selected theme, grouped like `THEME_TOKENS` */
    private renderTokens(theme: ThemeInfo, tokens: ThemeTokens): React.JSX.Element {
        const groups: { group: ThemeTokenDef['group']; defs: ThemeTokenDef[] }[] = [];
        THEME_TOKENS.forEach(def => {
            const entry = groups.find(g => g.group === def.group);
            if (entry) {
                entry.defs.push(def);
            } else {
                groups.push({ group: def.group, defs: [def] });
            }
        });
        return (
            <>
                {groups.map(({ group, defs }) => (
                    <Box
                        key={group}
                        sx={{ mt: 2.5 }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, color: 'primary.main' }}
                        >
                            {t(`theme_group_${group}`)}
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                columnGap: 3,
                                rowGap: 1.5,
                            }}
                        >
                            {defs.map(def => (
                                <Box
                                    key={def.key}
                                    sx={{ minWidth: 0 }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ mb: 0.25 }}
                                    >
                                        {t(def.label)}
                                    </Typography>
                                    {this.renderTokenInput(theme, def, tokens[def.key])}
                                    {this.renderIdLine(tokenStateId(theme.id, def.key))}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))}
            </>
        );
    }

    private renderNavigation(themes: ThemeInfo[], current: ThemeInfo | undefined): React.JSX.Element {
        const { busy } = this.state;
        const activeId = themeStore.getGlobalActiveId();
        const action = (
            title: string,
            icon: React.JSX.Element,
            onClick: () => void,
            disabled: boolean,
        ): React.JSX.Element => (
            <Tooltip
                title={title}
                disableInteractive
            >
                <span>
                    <IconButton
                        size="small"
                        disabled={busy || disabled}
                        onClick={onClick}
                        aria-label={title}
                    >
                        {icon}
                    </IconButton>
                </span>
            </Tooltip>
        );
        return (
            <Box
                sx={{
                    // wide enough for all toolbar actions in one row
                    width: 280,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight: 1,
                    borderColor: 'divider',
                }}
            >
                <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', px: 1, py: 0.5, borderBottom: 1, borderColor: 'divider' }}
                >
                    {action(
                        t('theme_new'),
                        <AddIcon fontSize="small" />,
                        () => this.setState({ dialog: 'new', name: '' }),
                        false,
                    )}
                    {action(
                        t('theme_duplicate'),
                        <DuplicateIcon fontSize="small" />,
                        () =>
                            this.setState({
                                dialog: 'duplicate',
                                name: current ? t('theme_copy_name', current.name) : '',
                            }),
                        !current,
                    )}
                    {action(
                        t('theme_rename'),
                        <RenameIcon fontSize="small" />,
                        () => this.setState({ dialog: 'rename', name: current?.name ?? '' }),
                        !current,
                    )}
                    {action(
                        t('theme_delete'),
                        <DeleteIcon fontSize="small" />,
                        () => this.setState({ dialog: 'delete' }),
                        !current,
                    )}
                    {action(
                        t('theme_restore_builtin'),
                        <RestoreIcon fontSize="small" />,
                        () => void this.run(() => themeStore.seedBuiltinThemes()),
                        false,
                    )}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ mx: 0.5, my: 0.5 }}
                    />
                    {action(
                        t('theme_import'),
                        <ImportIcon fontSize="small" />,
                        () => this.fileInput.current?.click(),
                        false,
                    )}
                    {action(
                        t('theme_export'),
                        <ExportIcon fontSize="small" />,
                        () => current && this.onExport([current], `${themeFileName(current.name)}.json`),
                        !current,
                    )}
                    {action(
                        t('theme_export_all'),
                        <ExportAllIcon fontSize="small" />,
                        () => this.onExport(themes, 'inventwo-themes.json'),
                        !themes.length,
                    )}
                    <input
                        ref={this.fileInput}
                        type="file"
                        accept="application/json,.json"
                        style={{ display: 'none' }}
                        onChange={this.onImportFile}
                    />
                </Box>
                <List
                    dense
                    disablePadding
                    sx={{ flexGrow: 1, overflowY: 'auto' }}
                >
                    {themes.map(theme => (
                        <ListItemButton
                            key={theme.id}
                            selected={theme.id === current?.id}
                            onClick={() => this.onSelect(theme.id)}
                            sx={{ gap: 1.25 }}
                        >
                            <ThemeSwatch tokens={theme.tokens} />
                            <ListItemText
                                primary={theme.name}
                                secondary={
                                    <Box
                                        component="span"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{
                                                fontFamily: 'monospace',
                                                fontSize: 11,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {theme.id}
                                        </Box>
                                        {renderBuiltinChip(
                                            getBuiltinStatus(theme.id, theme.tokens),
                                            'small',
                                            theme.id === current?.id,
                                        )}
                                    </Box>
                                }
                                slotProps={{
                                    primary: { noWrap: true },
                                }}
                            />
                            {theme.id === activeId ? (
                                <Tooltip title={t('theme_active_global')}>
                                    <StarIcon
                                        fontSize="small"
                                        color="warning"
                                    />
                                </Tooltip>
                            ) : null}
                        </ListItemButton>
                    ))}
                    {!themes.length && !busy ? (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ p: 2 }}
                        >
                            {t('theme_none')}
                        </Typography>
                    ) : null}
                </List>
                <Box sx={{ px: 1.5, py: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {t('theme_active_state')}
                    </Typography>
                    {this.renderIdLine(THEME_ACTIVE_ID)}
                </Box>
            </Box>
        );
    }

    private renderDetails(theme: ThemeInfo | undefined): React.JSX.Element | null {
        if (!theme) {
            return null;
        }
        const tokens = this.effectiveTokens(theme);
        const isActive = theme.id === themeStore.getGlobalActiveId();
        const builtinStatus = getBuiltinStatus(theme.id, theme.tokens);
        return (
            <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                    <Typography
                        variant="h6"
                        sx={{ flexGrow: 1, minWidth: 0 }}
                        noWrap
                    >
                        {theme.name}
                    </Typography>
                    {renderBuiltinChip(builtinStatus, 'medium')}
                    {builtinStatus === 'modified' ? (
                        <Button
                            size="small"
                            variant="outlined"
                            color="warning"
                            startIcon={<ResetIcon />}
                            disabled={this.state.busy}
                            onClick={() => this.setState({ dialog: 'reset' })}
                        >
                            {t('theme_reset_builtin')}
                        </Button>
                    ) : null}
                    {isActive ? (
                        <Chip
                            size="small"
                            color="warning"
                            icon={<StarIcon />}
                            label={t('theme_active_global')}
                        />
                    ) : (
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<ActiveIcon />}
                            disabled={this.state.busy}
                            onClick={() => void this.run(() => themeStore.setActive(theme.id, 'global'))}
                        >
                            {t('theme_set_active')}
                        </Button>
                    )}
                </Box>
                <ThemePreview tokens={tokens} />
                <Typography
                    variant="caption"
                    color="text.secondary"
                    component="div"
                    sx={{ mt: 1 }}
                >
                    {t('theme_datapoints_hint')}
                </Typography>
                {this.renderTokens(theme, tokens)}
            </>
        );
    }

    render(): React.JSX.Element {
        const { busy, error, info, dialog, name } = this.state;
        const themes = themeStore.getThemes();
        const current = this.theme;
        const nameDialogTitle =
            dialog === 'new' ? t('theme_new') : dialog === 'duplicate' ? t('theme_duplicate') : t('theme_rename');

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
                        <Box sx={{ flexGrow: 1 }}>{t('theme_manager_title')}</Box>
                        {busy ? <CircularProgress size={20} /> : null}
                    </DialogTitle>
                    <DialogContent
                        dividers
                        sx={{ p: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        {error ? (
                            <Alert
                                severity="error"
                                onClose={() => this.setState({ error: '' })}
                                sx={{ m: 1 }}
                            >
                                {error}
                            </Alert>
                        ) : null}
                        {info ? (
                            <Alert
                                severity="success"
                                onClose={() => this.setState({ info: '' })}
                                sx={{ m: 1 }}
                            >
                                {info}
                            </Alert>
                        ) : null}
                        <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
                            {this.renderNavigation(themes, current)}
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>{this.renderDetails(current)}</Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.onClose}>{t('design_preset_close')}</Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialog === 'new' || dialog === 'duplicate' || dialog === 'rename'}
                    onClose={() => this.setState({ dialog: null })}
                    fullWidth
                    maxWidth="xs"
                >
                    <DialogTitle>{nameDialogTitle}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            fullWidth
                            variant="standard"
                            label={t('theme_name')}
                            value={name}
                            onChange={e => this.setState({ name: e.target.value })}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    this.onNameDialogOk();
                                }
                            }}
                            slotProps={{ htmlInput: { maxLength: 60 } }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialog: null })}>{t('design_preset_cancel')}</Button>
                        <Button
                            variant="contained"
                            disabled={!name.trim()}
                            onClick={this.onNameDialogOk}
                        >
                            {t('theme_ok')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialog === 'reset'}
                    onClose={() => this.setState({ dialog: null })}
                    maxWidth="xs"
                >
                    <DialogTitle>{t('theme_reset_builtin')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('theme_reset_builtin_confirm', current?.name ?? '')}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialog: null })}>{t('design_preset_cancel')}</Button>
                        <Button
                            variant="contained"
                            color="warning"
                            onClick={this.onResetBuiltin}
                        >
                            {t('theme_reset_builtin')}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={dialog === 'delete'}
                    onClose={() => this.setState({ dialog: null })}
                    maxWidth="xs"
                >
                    <DialogTitle>{t('theme_delete')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{t('theme_delete_confirm', current?.name ?? '')}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ dialog: null })}>{t('design_preset_cancel')}</Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={this.onDelete}
                        >
                            {t('theme_delete')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}
