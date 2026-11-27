import React from 'react';
import { Box, Button, IconButton, ListSubheader, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import { Palette as PaletteIcon } from '@mui/icons-material';
import { I18n } from '@iobroker/gui-components';
import type { RxWidgetInfo, RxWidgetInfoCustomComponentProperties } from '@iobroker/types-vis-2';

import type { ThemeTokenKey } from './themeTokens';
import { themeStore, type ThemeInfo } from './themeStore';
import { getThemeMapping } from './themeMaps';
import { ThemeManager, ThemeSwatch } from './ThemeManager';

const I18N_PREFIX = 'vis_2_widgets_inventwo_';
const t = (key: string, ...args: (string | number)[]): string => I18n.t(`${I18N_PREFIX}${key}`, ...args);

/** Value of `designTheme` that follows the active theme */
const ACTIVE_REF = '*';

type LooseRecord = Record<string, any>;

/** A selected widget: its type and its data */
interface WidgetEntry {
    tpl: string;
    data: LooseRecord;
}

const isEmpty = (value: unknown): boolean => value === undefined || value === null || value === '';

/** Menu item of a theme: swatch and name */
function renderThemeItem(theme: ThemeInfo): React.JSX.Element {
    return (
        <MenuItem
            key={theme.id}
            value={theme.id}
            sx={{ gap: 1 }}
        >
            <ThemeSwatch
                tokens={theme.tokens}
                size={18}
            />
            <Typography
                variant="body2"
                noWrap
            >
                {theme.name}
            </Typography>
        </MenuItem>
    );
}

interface ThemeFieldProps {
    getWidgetInfo: () => RxWidgetInfo;
    data: LooseRecord;
    onDataChange: (newData: LooseRecord) => void;
    fieldProps: RxWidgetInfoCustomComponentProperties;
}

interface ThemeFieldState {
    managerOpen: boolean;
    /** Increased on every store change to re-render */
    revision: number;
}

/**
 * Attribute field `designTheme`: couples the selected widgets to a theme. Coupling clears the fields the theme
 * controls (an own value always wins), decoupling writes the current token values back into the empty ones.
 */
class ThemeField extends React.Component<ThemeFieldProps, ThemeFieldState> {
    private mounted = false;
    private unsubscribe: (() => void) | null = null;

    constructor(props: ThemeFieldProps) {
        super(props);
        this.state = { managerOpen: false, revision: 0 };
    }

    componentDidMount(): void {
        this.mounted = true;
        this.unsubscribe = themeStore.subscribe(() => {
            if (this.mounted) {
                this.setState(state => ({ revision: state.revision + 1 }));
            }
        });
        themeStore.init(this.props.fieldProps.context.socket).catch(e => console.warn('[inventwo themes]', e));
    }

    componentWillUnmount(): void {
        this.mounted = false;
        this.unsubscribe?.();
        this.unsubscribe = null;
    }

    private get ref(): string {
        // with a multi selection vis-2 passes no `data`; use the value the selected widgets share
        if (this.props.data) {
            return String(this.props.data.designTheme ?? '');
        }
        const values = new Set(this.getEntries().map(e => String(e.data.designTheme ?? '')));
        return values.size === 1 ? [...values][0] : '';
    }

    /** The selected widgets; with a single selection the data of the field is used, it is always up to date */
    private getEntries(): WidgetEntry[] {
        const { selectedWidgets, selectedWidget, selectedView, context } = this.props.fieldProps;
        const ids = Array.isArray(selectedWidgets) && selectedWidgets.length ? selectedWidgets : [selectedWidget];
        const widgets = context.views?.[selectedView]?.widgets;
        const entries: WidgetEntry[] = [];
        if (ids.length > 1 && widgets) {
            ids.forEach(id => {
                const widget = id ? widgets[id] : undefined;
                if (widget?.tpl) {
                    entries.push({ tpl: widget.tpl, data: widget.data ?? {} });
                }
            });
        }
        if (!entries.length) {
            const id = ids[0];
            const tpl = (id && widgets?.[id]?.tpl) || this.props.getWidgetInfo().id;
            entries.push({ tpl, data: this.props.data ?? {} });
        }
        return entries;
    }

    /** Field → token of every selected widget; `designTheme` is set to `ref`, the mapping may depend on it */
    private static mappings(entries: WidgetEntry[], ref: string): Record<string, ThemeTokenKey>[] {
        return entries.map(entry => {
            try {
                return getThemeMapping(entry.tpl, { ...entry.data, designTheme: ref });
            } catch (e) {
                console.warn('[inventwo themes] mapping failed', e);
                return {};
            }
        });
    }

    /** Union of the fields the theme controls over all selected widgets */
    private static mappedFields(entries: WidgetEntry[], ref: string): string[] {
        const fields = new Set<string>();
        ThemeField.mappings(entries, ref).forEach(mapping => Object.keys(mapping).forEach(f => fields.add(f)));
        return [...fields];
    }

    /** Patch that clears every field the theme controls */
    private static clearPatch(entries: WidgetEntry[], ref: string): LooseRecord {
        const patch: LooseRecord = {};
        ThemeField.mappedFields(entries, ref).forEach(field => (patch[field] = ''));
        return patch;
    }

    /**
     * Patch that writes the token values of the theme into the controlled fields that are still empty, so the widget
     * keeps its look after decoupling. Only for widgets of one type; a field is written only if it is empty in every
     * selected widget and maps to the same token everywhere (the patch is applied to all selected widgets).
     */
    private static bakePatch(entries: WidgetEntry[], ref: string): LooseRecord {
        const theme = themeStore.resolve(ref);
        if (!theme || new Set(entries.map(e => e.tpl)).size !== 1) {
            return {};
        }
        const mappings = ThemeField.mappings(entries, ref);
        const tokens: Record<string, ThemeTokenKey | null> = {};
        mappings.forEach(mapping =>
            Object.entries(mapping).forEach(([field, token]) => {
                tokens[field] = field in tokens && tokens[field] !== token ? null : token;
            }),
        );
        const patch: LooseRecord = {};
        Object.entries(tokens).forEach(([field, token]) => {
            if (token && entries.every(e => isEmpty(e.data[field]))) {
                patch[field] = theme.tokens[token];
            }
        });
        return patch;
    }

    private onSelect(value: string): void {
        const old = this.ref;
        if (value === old) {
            return;
        }
        const entries = this.getEntries();
        let patch: LooseRecord = {};
        if (!old) {
            // couple: the theme only fills empty fields, so the own values of the design fields are removed
            patch = ThemeField.clearPatch(entries, value);
        } else if (!value) {
            // decouple: keep the current look
            patch = ThemeField.bakePatch(entries, old);
        }
        patch.designTheme = value;
        this.props.onDataChange(patch);
    }

    private onReset = (): void => {
        this.props.onDataChange(ThemeField.clearPatch(this.getEntries(), this.ref));
    };

    /** Number of controlled fields and of those that have an own value (in at least one selected widget) */
    private getStatus(): { total: number; own: number } {
        const entries = this.getEntries();
        const fields = ThemeField.mappedFields(entries, this.ref);
        const own = fields.filter(field => entries.some(e => !isEmpty(e.data[field]))).length;
        return { total: fields.length, own };
    }

    render(): React.JSX.Element {
        const ref = this.ref;
        const themes = themeStore.getThemes();
        const active = themeStore.getTheme(themeStore.getActiveId());
        const resolved = ref ? themeStore.resolve(ref) : undefined;
        const unknown = !!ref && ref !== ACTIVE_REF && !themeStore.getTheme(ref);
        const status = ref ? this.getStatus() : null;

        const items: React.JSX.Element[] = [
            <MenuItem
                key="none"
                value=""
            >
                <em>{t('design_theme_none')}</em>
            </MenuItem>,
            <MenuItem
                key="active"
                value={ACTIVE_REF}
                sx={{ gap: 1 }}
                disabled={!active && ref !== ACTIVE_REF}
            >
                {active ? (
                    <ThemeSwatch
                        tokens={active.tokens}
                        size={18}
                    />
                ) : null}
                <Typography
                    variant="body2"
                    noWrap
                >
                    {t('design_theme_active', active?.name ?? '—')}
                </Typography>
            </MenuItem>,
        ];
        if (themes.length) {
            items.push(
                <ListSubheader
                    key="themes"
                    sx={{ lineHeight: '32px' }}
                >
                    {t('design_theme_section_themes')}
                </ListSubheader>,
                ...themes.map(renderThemeItem),
            );
        }
        if (unknown) {
            // the theme was deleted: keep the value selectable, the widget falls back to its own values
            items.push(
                <MenuItem
                    key="unknown"
                    value={ref}
                >
                    <Typography
                        variant="body2"
                        color="error"
                        noWrap
                    >
                        {t('design_theme_unknown', ref)}
                    </Typography>
                </MenuItem>,
            );
        }

        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, width: '100%', minWidth: 0, py: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TextField
                        select
                        size="small"
                        variant="standard"
                        fullWidth
                        value={ref}
                        onChange={e => this.onSelect(e.target.value)}
                        slotProps={{
                            select: {
                                renderValue: () => (
                                    <Box
                                        component="span"
                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.75, minWidth: 0 }}
                                    >
                                        {resolved ? (
                                            <ThemeSwatch
                                                tokens={resolved.tokens}
                                                size={16}
                                            />
                                        ) : null}
                                        <Box
                                            component="span"
                                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        >
                                            {!ref
                                                ? t('design_theme_none')
                                                : ref === ACTIVE_REF
                                                  ? t('design_theme_active', active?.name ?? '—')
                                                  : unknown
                                                    ? t('design_theme_unknown', ref)
                                                    : resolved?.name}
                                        </Box>
                                    </Box>
                                ),
                                displayEmpty: true,
                            },
                            htmlInput: { 'aria-label': t('design_theme') },
                        }}
                    >
                        {items}
                    </TextField>
                    <Tooltip
                        title={t('theme_manager_open')}
                        disableInteractive
                    >
                        <IconButton
                            size="small"
                            color={themes.length ? 'default' : 'primary'}
                            onClick={() => this.setState({ managerOpen: true })}
                            aria-label={t('theme_manager_open')}
                        >
                            <PaletteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                {!themes.length ? (
                    <Tooltip
                        title={t('design_theme_no_themes')}
                        disableInteractive
                    >
                        <Button
                            size="small"
                            variant="text"
                            onClick={() => this.setState({ managerOpen: true })}
                            sx={{ alignSelf: 'flex-start', p: 0, minWidth: 0, textTransform: 'none', fontSize: 12 }}
                        >
                            {t('design_theme_create')}
                        </Button>
                    </Tooltip>
                ) : null}

                {status ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.25 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ lineHeight: 1.3 }}
                        >
                            {t('design_theme_status', status.total - status.own, status.total)}
                        </Typography>
                        {status.own ? (
                            <Tooltip
                                title={t('design_theme_reset_hint', status.own)}
                                disableInteractive
                            >
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={this.onReset}
                                    sx={{ p: 0, minWidth: 0, textTransform: 'none', fontSize: 12 }}
                                >
                                    {t('design_theme_reset')}
                                </Button>
                            </Tooltip>
                        ) : null}
                    </Box>
                ) : null}

                {this.state.managerOpen ? (
                    <ThemeManager
                        socket={this.props.fieldProps.context.socket}
                        initialTheme={resolved?.id}
                        onClose={() => this.setState({ managerOpen: false })}
                    />
                ) : null}
            </Box>
        );
    }
}

/** Options of `createThemeFields` */
export interface ThemeFieldsOptions {
    /** Adds `designThemeSurface`, `designThemeActive`, `designThemeGlow` and `designThemeLabel`; Universal widget only */
    surface?: boolean;
}

/**
 * Returns the fields of the attribute group `attr_group_theme`: a short help, the theme selection (`designTheme`) and,
 * with `options.surface`, the surface the theme uses as background (`designThemeSurface`), the look of the active
 * state (`designThemeActive`, `designThemeGlow`) and the color of the label (`designThemeLabel`).
 *
 * `getWidgetInfo` is only called lazily: the fields are created while the widget info is built, so the widget type
 * cannot be read from it here (endless recursion). That is why the Universal widget passes `{ surface: true }`.
 *
 * @param getWidgetInfo  Returns the widget info
 * @param options        See `ThemeFieldsOptions`
 */
export function createThemeFields(
    getWidgetInfo: () => RxWidgetInfo,
    options: ThemeFieldsOptions = {},
): Record<string, unknown>[] {
    let widgetType: string | undefined;
    const fields: Record<string, unknown>[] = [
        {
            name: '',
            type: 'help',
            text: 'vis_2_widgets_inventwo_design_theme_help',
        },
        {
            name: 'designTheme',
            type: 'custom',
            label: 'design_theme',
            noBinding: true,
            component: (
                _field: unknown,
                data: LooseRecord,
                onDataChange: (newData: LooseRecord) => void,
                props: RxWidgetInfoCustomComponentProperties,
            ) => (
                // same reason for the key as in `createDesignPresetField`: one instance per widget type
                <ThemeField
                    key={(widgetType ??= getWidgetInfo().id)}
                    getWidgetInfo={getWidgetInfo}
                    data={data}
                    onDataChange={onDataChange}
                    fieldProps={props}
                />
            ),
        },
    ];
    if (options.surface) {
        fields.push({
            name: 'designThemeSurface',
            type: 'select',
            label: 'design_theme_surface',
            tooltip: 'design_theme_surface_tooltip',
            options: [
                { value: 'tile', label: 'design_theme_surface_tile' },
                { value: 'card', label: 'design_theme_surface_card' },
                { value: 'none', label: 'design_theme_surface_none' },
            ],
            default: 'tile',
            noBinding: true,
            hidden: '!data.designTheme',
        });
        fields.push({
            name: 'designThemeActive',
            type: 'select',
            label: 'design_theme_state',
            tooltip: 'design_theme_state_tooltip',
            options: [
                { value: 'accent', label: 'design_theme_state_accent' },
                { value: 'subtle', label: 'design_theme_state_subtle' },
            ],
            default: 'accent',
            noBinding: true,
            // only a single button with one state and separated buttons have a state the theme colors
            hidden: "!data.designTheme || (data.mode !== 'separatedButtons' && Number(data.countStates) !== 1)",
        });
        fields.push({
            name: 'designThemeGlow',
            type: 'checkbox',
            label: 'design_theme_glow',
            tooltip: 'design_theme_glow_tooltip',
            noBinding: true,
            hidden: "!data.designTheme || (data.mode !== 'separatedButtons' && Number(data.countStates) !== 1)",
        });
        fields.push({
            name: 'designThemeLabel',
            type: 'select',
            label: 'design_theme_label',
            tooltip: 'design_theme_label_tooltip',
            options: [
                // empty: text, with separated buttons the secondary text (as before this option)
                { value: '', label: 'design_theme_label_auto' },
                { value: 'text', label: 'design_theme_label_text' },
                { value: 'muted', label: 'design_theme_label_muted' },
            ],
            default: '',
            noBinding: true,
            hidden: '!data.designTheme',
        });
    }
    return fields;
}
