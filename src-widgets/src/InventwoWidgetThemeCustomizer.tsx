import React from 'react';
import { Box, ButtonBase, Collapse, Slider, Switch } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ColorizeIcon from '@mui/icons-material/Colorize';
import { I18n } from '@iobroker/gui-components';

import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import {
    ACCENT_SWATCHES,
    BUILTIN_THEMES,
    DEFAULT_TOKENS,
    THEME_TOKENS,
    type ThemeTokenDef,
    type ThemeTokenKey,
    type ThemeTokens,
} from './utils/themes/themeTokens';
import { themeStore, type ThemeInfo, type ThemeScope } from './utils/themes/themeStore';
import ThemeColorPicker from './utils/themes/ThemeColorPicker';
import { createThemeFilterField, parseThemeFilter } from './utils/themes/ThemeFilterField';

type CustomizerScope = 'global' | 'device' | 'choice';

interface ThemeCustomizerRxData {
    title: string;
    showThemes: boolean;
    themeFilter: string;
    showColorPicker: boolean;
    scope: CustomizerScope;
    layout: 'grid' | 'row';
    cardSize: number;
    /** `show<Token>`, `<colorToken>Colors`, `fontFamilyOptions` */
    [key: string]: unknown;
}

interface ThemeCustomizerState extends VisRxWidgetState {
    /** Incremented on every store change to trigger a re-render */
    themeRevision: number;
    /** Only used with scope 'choice': changes affect this browser only */
    deviceOnly: boolean;
    /** Values while a slider or the color picker is dragged; shown instead of the token value */
    drafts: Partial<Record<ThemeTokenKey, string | number>>;
    /** Color token whose color picker is open */
    pickerOpen: ThemeTokenKey | null;
    /** Inline error message of the last failed write */
    error: string;
}

const I18N_PREFIX = 'vis_2_widgets_inventwo_';
const t = (key: string, ...args: (string | number)[]): string => I18n.t(`${I18N_PREFIX}${key}`, ...args);

/** Minimal touch target size in px */
const TOUCH = 44;
/** Shared transition for interactive elements */
const TRANSITION = 'transform 160ms ease, box-shadow 160ms ease, outline-color 160ms ease, background 200ms ease';
/** Checkerboard behind colors with transparency */
const CHECKER = 'repeating-conic-gradient(#bbb 0% 25%, #fff 0% 50%) 0 0 / 12px 12px';
/** Background of the color picker button */
const RAINBOW = 'conic-gradient(#f44, #fb3, #5d5, #3cf, #66f, #d4f, #f44)';

/** Token value as number with fallback */
const num = (value: string | number | undefined, fallback: number): number => {
    const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
    return Number.isFinite(n) ? n : fallback;
};

/** Token value as CSS string with fallback */
const str = (value: string | number | undefined, fallback: string): string =>
    value === undefined || value === null || value === '' ? fallback : String(value);

/** Normalizes a CSS color string for comparisons (case and whitespace insensitive) */
const normColor = (color: string | number | undefined): string =>
    String(color ?? '')
        .toLowerCase()
        .replace(/\s+/g, '');

/** Splits a list attribute by the given separator and drops empty entries */
const splitList = (value: string | undefined, separator: string): string[] =>
    (value || '')
        .split(separator)
        .map(entry => entry.trim())
        .filter(entry => entry);

type TokenGroup = ThemeTokenDef['group'];

const TOKEN_GROUPS: readonly TokenGroup[] = ['colors', 'shape', 'border', 'shadow', 'font'];

/** Tokens shown by default (the two sections of the first version of the widget) */
const SHOWN_BY_DEFAULT: readonly ThemeTokenKey[] = ['accent', 'radius'];

/** Slider ranges in the customizer: narrower than the token limits, so the slider stays usable on a tablet */
const SLIDER_RANGES: Partial<Record<ThemeTokenKey, [number, number]>> = {
    radius: [0, 40],
    radiusSmall: [0, 30],
    borderWidth: [0, 8],
    shadowX: [-30, 30],
    shadowY: [-30, 30],
    shadowBlur: [0, 60],
    shadowSize: [-20, 20],
};

/** Font suggestions when the widget does not define its own; '' = font of the view */
const DEFAULT_FONTS: readonly string[] = [
    '',
    'system-ui, sans-serif',
    'Roboto, sans-serif',
    'Georgia, serif',
    "'Segoe UI', sans-serif",
    'ui-monospace, monospace',
];

const capitalize = (key: string): string => key.charAt(0).toUpperCase() + key.slice(1);

/** Widget attribute: show the token in the customizer (`showAccent`, `showRadius`, …) */
const showField = (key: ThemeTokenKey): string => `show${capitalize(key)}`;

/** Widget attribute: suggested values of a color or font token (`accentColors`, `fontFamilyOptions`) */
const suggestionsField = (def: ThemeTokenDef): string =>
    def.type === 'color' ? `${def.key}Colors` : `${def.key}Options`;

/** One attribute group per token group with a checkbox per token and a suggestion list for colors and fonts */
function createTokenGroups(): RxWidgetInfo['visAttrs'] {
    return TOKEN_GROUPS.map(group => ({
        name: `attr_group_theme_customizer_${group}`,
        label: `attr_group_theme_customizer_${group}`,
        fields: THEME_TOKENS.filter(def => def.group === group).flatMap(def => {
            const fields: Record<string, unknown>[] = [
                {
                    name: showField(def.key),
                    type: 'checkbox',
                    label: def.label,
                    default: SHOWN_BY_DEFAULT.includes(def.key),
                },
            ];
            if (def.type === 'color' || def.type === 'text') {
                fields.push({
                    name: suggestionsField(def),
                    type: 'text',
                    label: def.type === 'color' ? 'theme_customizer_suggestions' : 'theme_customizer_font_options',
                    tooltip:
                        def.type === 'color'
                            ? 'theme_customizer_suggestions_tooltip'
                            : 'theme_customizer_font_options_tooltip',
                    hidden: `!data.${showField(def.key)}`,
                });
            }
            return fields;
        }),
    })) as unknown as RxWidgetInfo['visAttrs'];
}

/**
 * Runtime widget to switch the active theme and adjust its values (colors, corners, border, shadow, font), e.g. on a
 * wall tablet. Every value can be shown or hidden; colors offer suggestions and a color picker.
 * Styles itself with the tokens of the effective active theme.
 */
export default class InventwoWidgetThemeCustomizer extends InventwoGeneric<
    ThemeCustomizerRxData,
    ThemeCustomizerState
> {
    private unsubscribeThemes: (() => void) | null = null;

    private errorTimer: ReturnType<typeof setTimeout> | null = null;

    /** Pending throttled writes while a slider or the color picker is dragged */
    private liveWrites = new Map<ThemeTokenKey, { timer: ReturnType<typeof setTimeout>; value: string | number }>();

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetThemeCustomizer',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_theme_customizer',
            visName: 'widget_theme_customizer',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'title',
                            type: 'text',
                            label: 'theme_customizer_title',
                        },
                        {
                            name: 'scope',
                            type: 'select',
                            label: 'theme_customizer_scope',
                            options: [
                                { value: 'global', label: 'theme_customizer_scope_global' },
                                { value: 'device', label: 'theme_customizer_scope_device' },
                                { value: 'choice', label: 'theme_customizer_scope_choice' },
                            ],
                            default: 'global',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_theme_customizer_scope_help',
                        },
                    ],
                },
                {
                    name: 'attr_group_theme_customizer_sections',
                    label: 'attr_group_theme_customizer_sections',
                    fields: [
                        {
                            name: 'showThemes',
                            type: 'checkbox',
                            label: 'theme_customizer_show_themes',
                            default: true,
                        },
                        createThemeFilterField('themeFilter', {
                            label: 'theme_customizer_theme_filter',
                            tooltip: 'theme_customizer_theme_filter_tooltip',
                            hidden: '!data.showThemes',
                        }),
                        {
                            name: 'showColorPicker',
                            type: 'checkbox',
                            label: 'theme_customizer_show_color_picker',
                            tooltip: 'theme_customizer_show_color_picker_tooltip',
                            default: true,
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_theme_customizer_sections_help',
                        },
                    ],
                },
                ...createTokenGroups(),
                {
                    name: 'attr_group_theme_customizer_layout',
                    label: 'attr_group_theme_customizer_layout',
                    fields: [
                        {
                            name: 'layout',
                            type: 'select',
                            label: 'theme_customizer_layout',
                            options: [
                                { value: 'grid', label: 'theme_customizer_layout_grid' },
                                { value: 'row', label: 'theme_customizer_layout_row' },
                            ],
                            default: 'grid',
                        },
                        {
                            name: 'cardSize',
                            type: 'slider',
                            label: 'theme_customizer_card_size',
                            min: 80,
                            max: 260,
                            step: 5,
                            default: 130,
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 420,
                height: 400,
                // the card shadow of the theme must not be cut off by the widget frame
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-theme-customizer.png',
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetThemeCustomizer.getWidgetInfo();
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    constructor(props: VisRxWidgetProps) {
        super(props);
        let deviceOnly = false;
        try {
            deviceOnly = !!themeStore.getDeviceActiveId();
        } catch {
            // store not available yet
        }
        this.state = {
            ...this.state,
            themeRevision: 0,
            deviceOnly,
            drafts: {},
            pickerOpen: null,
            error: '',
        };
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.unsubscribeThemes = themeStore.subscribe(() =>
            this.setState(prev => ({ themeRevision: prev.themeRevision + 1 })),
        );
        themeStore.init(this.props.context.socket).catch((e: unknown) => {
            console.warn('[inventwo theme customizer] cannot initialize themes', e);
        });
    }

    componentWillUnmount(): void {
        super.componentWillUnmount?.();
        this.unsubscribeThemes?.();
        this.unsubscribeThemes = null;
        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
            this.errorTimer = null;
        }
        this.liveWrites.forEach(entry => clearTimeout(entry.timer));
        this.liveWrites.clear();
    }

    /** Scope the active theme is written to */
    private getWriteScope(): ThemeScope {
        const scope = this.state.rxData.scope || 'global';
        if (scope === 'choice') {
            return this.state.deviceOnly ? 'device' : 'global';
        }
        return scope === 'device' ? 'device' : 'global';
    }

    /** Shows a short inline error message that disappears after a few seconds */
    private showError(e: unknown): void {
        console.warn('[inventwo theme customizer] write failed', e);
        if (this.errorTimer) {
            clearTimeout(this.errorTimer);
        }
        this.setState({ error: t('theme_customizer_write_error') });
        this.errorTimer = setTimeout(() => {
            this.errorTimer = null;
            this.setState({ error: '' });
        }, 5000);
    }

    /** Runs a store write unless the editor is open; errors are shown inline */
    private async write(action: () => Promise<void>): Promise<void> {
        if (this.props.editMode) {
            return;
        }
        try {
            await action();
            if (this.state.error) {
                this.setState({ error: '' });
            }
        } catch (e) {
            this.showError(e);
        }
    }

    private onSelectTheme(id: string): void {
        const scope = this.getWriteScope();
        void this.write(async () => {
            if (scope === 'global' && themeStore.getDeviceActiveId()) {
                // A device override would hide the global change on this device
                await themeStore.setActive('', 'device');
            }
            await themeStore.setActive(id, scope);
        });
    }

    private onToggleDeviceOnly(deviceOnly: boolean): void {
        if (this.props.editMode) {
            return;
        }
        this.setState({ deviceOnly });
        void this.write(async () => {
            // Device only: pin the current theme to this browser; otherwise follow the global theme again
            await themeStore.setActive(deviceOnly ? themeStore.getActiveId() : '', 'device');
        });
    }

    /** Writes a token of the theme at once (tap on a suggestion, style chip, end of a drag) */
    private onSetToken(themeId: string, key: ThemeTokenKey, value: string | number): void {
        const pending = this.liveWrites.get(key);
        if (pending) {
            clearTimeout(pending.timer);
            this.liveWrites.delete(key);
        }
        if (this.props.editMode) {
            this.clearDraft(key);
            return;
        }
        void this.write(() => themeStore.setToken(themeId, key, value)).finally(() => this.clearDraft(key));
    }

    /**
     * Shows a value while it is dragged and writes it throttled, so the coupled widgets follow live without a write
     * per pointer move
     */
    private onDraftToken(themeId: string, key: ThemeTokenKey, value: string | number): void {
        this.setState(prev => ({ drafts: { ...prev.drafts, [key]: value } }));
        if (this.props.editMode) {
            return;
        }
        const pending = this.liveWrites.get(key);
        if (pending) {
            pending.value = value;
            return;
        }
        const entry = {
            value,
            timer: setTimeout(() => {
                this.liveWrites.delete(key);
                void this.write(() => themeStore.setToken(themeId, key, entry.value));
            }, 300),
        };
        this.liveWrites.set(key, entry);
    }

    private clearDraft(key: ThemeTokenKey): void {
        this.setState(prev => {
            if (!(key in prev.drafts)) {
                return null;
            }
            const drafts = { ...prev.drafts };
            delete drafts[key];
            return { drafts };
        });
    }

    /** Current value of a token: the dragged value if any, else the value of the theme */
    private tokenValue(active: ThemeInfo, key: ThemeTokenKey): string | number {
        return this.state.drafts[key] ?? active.tokens[key];
    }

    /** Themes shown as cards, optionally filtered by the `themeFilter` attribute */
    private getVisibleThemes(themes: ThemeInfo[]): ThemeInfo[] {
        const filter = parseThemeFilter(this.state.rxData.themeFilter);
        if (!filter.length) {
            return themes;
        }
        return themes.filter(theme => filter.includes(theme.id));
    }

    private static renderSectionTitle(text: string, tokens: ThemeTokens, extra?: React.ReactNode): React.JSX.Element {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    mb: 1,
                    minHeight: 24,
                }}
            >
                <Box
                    component="span"
                    sx={{
                        fontSize: '0.75em',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: str(tokens.textMuted, 'inherit'),
                    }}
                >
                    {text}
                </Box>
                {extra}
            </Box>
        );
    }

    /** Small preview of a theme drawn from its tokens */
    private static renderThemePreview(theme: ThemeInfo, size: number): React.JSX.Element {
        const tk = theme.tokens;
        const scale = size / 130;
        const radius = Math.min(num(tk.radius, 20) * scale * 0.6, 24);
        const radiusSmall = Math.min(num(tk.radiusSmall, 12) * scale * 0.6, 16);
        const surface = str(tk.surface, 'rgb(27,30,36)');

        return (
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    background: str(tk.background, surface),
                    borderRadius: `${radius + 4}px`,
                    p: `${Math.round(8 * scale)}px`,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        background: surface,
                        borderRadius: `${radius}px`,
                        p: `${Math.round(9 * scale)}px`,
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: `${Math.max(3, Math.round(5 * scale))}px`,
                        boxShadow: `0 ${Math.round(3 * scale)}px ${Math.round(8 * scale)}px ${str(tk.shadow, 'transparent')}`,
                    }}
                >
                    <Box
                        sx={{
                            width: '62%',
                            height: `${Math.max(4, Math.round(6 * scale))}px`,
                            borderRadius: 99,
                            background: str(tk.text, '#fff'),
                        }}
                    />
                    <Box
                        sx={{
                            width: '40%',
                            height: `${Math.max(3, Math.round(4 * scale))}px`,
                            borderRadius: 99,
                            background: str(tk.textMuted, '#888'),
                        }}
                    />
                    <Box
                        sx={{
                            flex: 1,
                            mt: `${Math.round(2 * scale)}px`,
                            background: str(tk.surfaceVariant, surface),
                            borderRadius: `${radiusSmall}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: `${Math.round(7 * scale)}px`,
                            gap: `${Math.round(5 * scale)}px`,
                        }}
                    >
                        <Box
                            sx={{
                                width: `${Math.round(9 * scale)}px`,
                                height: `${Math.round(9 * scale)}px`,
                                borderRadius: '50%',
                                background: str(tk.accent, '#9fdb58'),
                                flexShrink: 0,
                            }}
                        />
                        <Box
                            sx={{
                                width: `${Math.round(26 * scale)}px`,
                                height: `${Math.round(13 * scale)}px`,
                                borderRadius: 99,
                                background: str(tk.accent, '#9fdb58'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: `${Math.max(1, Math.round(2 * scale))}px`,
                                boxSizing: 'border-box',
                                flexShrink: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    width: `${Math.round(9 * scale)}px`,
                                    height: `${Math.round(9 * scale)}px`,
                                    borderRadius: '50%',
                                    background: str(tk.onAccent, '#fff'),
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    private renderThemes(themes: ThemeInfo[], activeId: string, tokens: ThemeTokens): React.JSX.Element {
        const size = Math.max(80, num(this.state.rxData.cardSize, 130));
        const isRow = this.state.rxData.layout === 'row';
        const accent = str(tokens.accent, 'rgb(159,219,88)');
        const radius = num(tokens.radius, 20);
        const cardRadius = Math.min(radius, 24);

        return (
            <Box
                sx={
                    isRow
                        ? {
                              display: 'flex',
                              gap: 1.5,
                              overflowX: 'auto',
                              overflowY: 'hidden',
                              scrollSnapType: 'x mandatory',
                              WebkitOverflowScrolling: 'touch',
                              // room for the selection ring, which is drawn outside the card
                              p: '4px',
                              m: '-4px',
                              scrollbarWidth: 'thin',
                          }
                        : {
                              display: 'grid',
                              gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`,
                              gap: 1.5,
                          }
                }
            >
                {themes.map(theme => {
                    const selected = theme.id === activeId;
                    return (
                        <ButtonBase
                            key={theme.id}
                            onClick={() => this.onSelectTheme(theme.id)}
                            aria-pressed={selected}
                            focusRipple
                            sx={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                gap: 1,
                                p: 1,
                                minHeight: TOUCH,
                                width: isRow ? `${size}px` : 'auto',
                                flexShrink: 0,
                                scrollSnapAlign: 'start',
                                textAlign: 'left',
                                color: 'inherit',
                                fontFamily: 'inherit',
                                borderRadius: `${cardRadius}px`,
                                background: str(tokens.surfaceVariant, 'transparent'),
                                outline: `2px solid ${selected ? accent : 'transparent'}`,
                                outlineOffset: '2px',
                                transition: TRANSITION,
                                '&:active': { transform: 'scale(0.97)' },
                                // outline does not render gradients: fall back to a ring via box-shadow
                                ...(selected && accent.includes('gradient')
                                    ? { outline: 'none', boxShadow: `0 0 0 2px ${str(tokens.text, '#fff')}` }
                                    : {}),
                            }}
                        >
                            {InventwoWidgetThemeCustomizer.renderThemePreview(theme, size)}
                            <Box
                                component="span"
                                sx={{
                                    display: 'block',
                                    px: 0.5,
                                    pr: selected ? 3.5 : 0.5,
                                    fontSize: '0.9em',
                                    fontWeight: selected ? 600 : 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: '24px',
                                }}
                            >
                                {theme.name || theme.id}
                            </Box>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: 10,
                                    bottom: 10,
                                    width: 22,
                                    height: 22,
                                    borderRadius: '50%',
                                    background: accent,
                                    color: str(tokens.onAccent, '#000'),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: selected ? 1 : 0,
                                    transform: selected ? 'scale(1)' : 'scale(0.4)',
                                    transition: 'opacity 160ms ease, transform 160ms ease',
                                }}
                            >
                                <CheckIcon sx={{ fontSize: 16 }} />
                            </Box>
                        </ButtonBase>
                    );
                })}
            </Box>
        );
    }

    /** Suggested values of a color or font token: from the widget attribute, else built-in defaults */
    private getSuggestions(def: ThemeTokenDef, themes: ThemeInfo[]): string[] {
        const own = splitList(this.state.rxData[suggestionsField(def)] as string | undefined, ';');
        if (own.length) {
            return own;
        }
        if (def.type === 'text') {
            return [...DEFAULT_FONTS];
        }
        if (def.key === 'accent') {
            return [...ACCENT_SWATCHES];
        }
        // the values of the built-in themes and of all other themes: they stay stable while the active theme changes
        const activeId = themeStore.getActiveId();
        const sources: { tokens: ThemeTokens }[] = [
            ...BUILTIN_THEMES,
            ...themes.filter(theme => theme.id !== activeId),
        ];
        const seen = new Set<string>();
        const values: string[] = [];
        sources.forEach(theme => {
            const value = String(theme.tokens[def.key] ?? '');
            if (value && !seen.has(normColor(value))) {
                seen.add(normColor(value));
                values.push(value);
            }
        });
        return values;
    }

    /** Round color button; colors with transparency are drawn on a checkerboard */
    private static renderSwatch(
        key: string,
        color: string,
        selected: boolean,
        tokens: ThemeTokens,
        onClick: () => void,
        label: string,
        children?: React.ReactNode,
    ): React.JSX.Element {
        const layer = color.includes('gradient') ? color : `linear-gradient(${color}, ${color})`;
        return (
            <ButtonBase
                key={key}
                onClick={onClick}
                aria-pressed={selected}
                aria-label={label}
                title={label}
                sx={{
                    width: TOUCH,
                    height: TOUCH,
                    borderRadius: '50%',
                    background: `${layer}, ${CHECKER}`,
                    boxShadow: selected
                        ? `0 0 0 3px ${str(tokens.surface, '#000')}, 0 0 0 5px ${str(tokens.text, '#fff')}`
                        : 'inset 0 0 0 1px rgba(127,127,127,0.35)',
                    m: '5px',
                    color: '#fff',
                    transition: TRANSITION,
                    '&:active': { transform: 'scale(0.9)' },
                }}
            >
                {children ?? (
                    <CheckIcon
                        sx={{
                            fontSize: 20,
                            opacity: selected ? 1 : 0,
                            transition: 'opacity 160ms ease',
                            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.6))',
                        }}
                    />
                )}
            </ButtonBase>
        );
    }

    private renderColor(
        def: ThemeTokenDef,
        active: ThemeInfo,
        themes: ThemeInfo[],
        tokens: ThemeTokens,
    ): React.JSX.Element {
        const value = String(this.tokenValue(active, def.key) ?? '');
        const current = normColor(value);
        const suggestions = this.getSuggestions(def, themes);
        const pickerAllowed = this.state.rxData.showColorPicker !== false;
        const pickerOpen = pickerAllowed && this.state.pickerOpen === def.key;
        const isCustom = !!current && !suggestions.some(color => normColor(color) === current);

        return (
            <>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {suggestions.map(color =>
                        InventwoWidgetThemeCustomizer.renderSwatch(
                            color,
                            color,
                            normColor(color) === current,
                            tokens,
                            () => this.onSetToken(active.id, def.key, color),
                            color,
                        ),
                    )}
                    {pickerAllowed
                        ? InventwoWidgetThemeCustomizer.renderSwatch(
                              '__picker',
                              isCustom ? value : RAINBOW,
                              isCustom || pickerOpen,
                              tokens,
                              () => this.setState({ pickerOpen: pickerOpen ? null : def.key }),
                              t('theme_customizer_color_picker'),
                              <ColorizeIcon sx={{ fontSize: 20, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.6))' }} />,
                          )
                        : null}
                </Box>
                {pickerAllowed ? (
                    <Collapse
                        in={pickerOpen}
                        unmountOnExit
                    >
                        <Box
                            sx={{
                                mt: 1.5,
                                p: 1.5,
                                borderRadius: `${Math.min(num(tokens.radiusSmall, 12), 20)}px`,
                                background: str(tokens.surfaceVariant, 'transparent'),
                            }}
                        >
                            <ThemeColorPicker
                                value={value}
                                tokens={tokens}
                                onChange={color => this.onDraftToken(active.id, def.key, color)}
                                onCommit={color => this.onSetToken(active.id, def.key, color)}
                            />
                        </Box>
                    </Collapse>
                ) : null}
            </>
        );
    }

    private renderNumber(def: ThemeTokenDef, active: ThemeInfo, tokens: ThemeTokens): React.JSX.Element {
        const [min, max] = SLIDER_RANGES[def.key] ?? [def.min ?? 0, def.max ?? 100];
        const value = Math.min(max, Math.max(min, num(this.tokenValue(active, def.key), 0)));
        const accent = str(tokens.accent, 'rgb(159,219,88)');
        const isRadius = def.group === 'shape';

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
                {isRadius ? (
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            flexShrink: 0,
                            borderTop: `3px solid ${str(tokens.textMuted, 'currentColor')}`,
                            borderLeft: `3px solid ${str(tokens.textMuted, 'currentColor')}`,
                            borderTopLeftRadius: `${Math.round(value * 0.7)}px`,
                            transition: 'border-radius 120ms ease',
                        }}
                    />
                ) : null}
                <Slider
                    value={value}
                    min={min}
                    max={max}
                    step={1}
                    track={min < 0 ? false : 'normal'}
                    onChange={(_e, v) => this.onDraftToken(active.id, def.key, Array.isArray(v) ? v[0] : v)}
                    onChangeCommitted={(_e, v) => this.onSetToken(active.id, def.key, Array.isArray(v) ? v[0] : v)}
                    aria-label={t(def.label)}
                    sx={{
                        flex: 1,
                        height: 6,
                        py: '19px',
                        color: 'inherit',
                        '& .MuiSlider-rail': {
                            background: str(tokens.track, 'rgba(127,127,127,0.3)'),
                            opacity: 1,
                        },
                        '& .MuiSlider-track': {
                            background: accent,
                            border: 'none',
                        },
                        '& .MuiSlider-thumb': {
                            width: 28,
                            height: 28,
                            backgroundColor: str(tokens.thumb, '#fff'),
                            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                            '&::before': { boxShadow: 'none' },
                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                            },
                        },
                    }}
                />
                <Box
                    component="span"
                    sx={{
                        minWidth: 48,
                        textAlign: 'right',
                        fontVariantNumeric: 'tabular-nums',
                        color: str(tokens.textMuted, 'inherit'),
                        fontSize: '0.9em',
                    }}
                >
                    {`${value} px`}
                </Box>
            </Box>
        );
    }

    /** Row of large chips; used for the border style and the font */
    private static renderChips(
        options: { value: string; label: string; preview?: React.ReactNode; fontFamily?: string }[],
        current: string,
        tokens: ThemeTokens,
        onSelect: (value: string) => void,
    ): React.JSX.Element {
        const accent = str(tokens.accent, 'rgb(159,219,88)');
        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {options.map(option => {
                    const selected = option.value === current;
                    return (
                        <ButtonBase
                            key={option.value || '__default'}
                            onClick={() => onSelect(option.value)}
                            aria-pressed={selected}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                minHeight: TOUCH,
                                px: 2,
                                borderRadius: `${Math.min(num(tokens.radiusSmall, 12), 22)}px`,
                                background: selected ? accent : str(tokens.surfaceVariant, 'transparent'),
                                color: selected ? str(tokens.onAccent, '#000') : 'inherit',
                                fontFamily: option.fontFamily || 'inherit',
                                fontSize: '0.9em',
                                fontWeight: selected ? 600 : 500,
                                transition: TRANSITION,
                                '&:active': { transform: 'scale(0.96)' },
                            }}
                        >
                            {option.preview}
                            {option.label}
                        </ButtonBase>
                    );
                })}
            </Box>
        );
    }

    private renderSelect(def: ThemeTokenDef, active: ThemeInfo, tokens: ThemeTokens): React.JSX.Element {
        const current = String(this.tokenValue(active, def.key) ?? '');
        return InventwoWidgetThemeCustomizer.renderChips(
            (def.options ?? []).map(option => ({
                value: option,
                label: t(`theme_border_style_${option}`),
                preview: (
                    <Box
                        component="span"
                        sx={{
                            width: 22,
                            height: 0,
                            borderTop: `3px ${option === 'none' ? 'solid' : option} currentColor`,
                            opacity: option === 'none' ? 0 : 1,
                        }}
                    />
                ),
            })),
            current,
            tokens,
            value => this.onSetToken(active.id, def.key, value),
        );
    }

    private renderFont(
        def: ThemeTokenDef,
        active: ThemeInfo,
        themes: ThemeInfo[],
        tokens: ThemeTokens,
    ): React.JSX.Element {
        const current = String(this.tokenValue(active, def.key) ?? '');
        const fonts = this.getSuggestions(def, themes);
        if (!fonts.includes(current)) {
            fonts.push(current);
        }
        return InventwoWidgetThemeCustomizer.renderChips(
            fonts.map(font => ({
                value: font,
                label: font ? font.split(',')[0].replace(/['"]/g, '').trim() : t('theme_customizer_font_default'),
                fontFamily: font,
            })),
            current,
            tokens,
            value => this.onSetToken(active.id, def.key, value),
        );
    }

    private renderToken(
        def: ThemeTokenDef,
        active: ThemeInfo,
        themes: ThemeInfo[],
        tokens: ThemeTokens,
    ): React.ReactNode {
        switch (def.type) {
            case 'color':
                return this.renderColor(def, active, themes, tokens);
            case 'number':
                return this.renderNumber(def, active, tokens);
            case 'select':
                return this.renderSelect(def, active, tokens);
            default:
                return this.renderFont(def, active, themes, tokens);
        }
    }

    /** Is the token switched on in the widget attributes? */
    private isTokenShown(key: ThemeTokenKey): boolean {
        const value = this.state.rxData[showField(key)];
        return value === undefined || value === null || value === '' ? SHOWN_BY_DEFAULT.includes(key) : !!value;
    }

    private renderDeviceSwitch(tokens: ThemeTokens): React.JSX.Element {
        const accent = str(tokens.accent, 'rgb(159,219,88)');
        return (
            <Box
                component="label"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    minHeight: TOUCH,
                    px: 1.5,
                    borderRadius: `${Math.min(num(tokens.radiusSmall, 12), 22)}px`,
                    background: str(tokens.surfaceVariant, 'transparent'),
                    cursor: 'pointer',
                }}
            >
                <Box
                    component="span"
                    sx={{ fontSize: '0.9em' }}
                >
                    {t('theme_customizer_device_only')}
                </Box>
                <Switch
                    checked={this.state.deviceOnly}
                    onChange={e => this.onToggleDeviceOnly(e.target.checked)}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: str(tokens.thumb, '#fff') },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            background: accent,
                            opacity: 1,
                        },
                        '& .MuiSwitch-track': {
                            background: str(tokens.track, 'rgba(127,127,127,0.4)'),
                            opacity: 1,
                        },
                    }}
                />
            </Box>
        );
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const rxData = this.state.rxData;
        let themes: ThemeInfo[] = [];
        let activeId = '';
        let ready = false;
        try {
            themes = themeStore.getThemes();
            activeId = themeStore.getActiveId();
            ready = themeStore.isReady();
        } catch (e) {
            console.warn('[inventwo theme customizer] cannot read themes', e);
        }

        const active = themes.find(theme => theme.id === activeId);
        // values being dragged (drafts) show at once, also on the widget itself
        const tokens: ThemeTokens = active ? { ...active.tokens, ...this.state.drafts } : DEFAULT_TOKENS;
        const showThemes = rxData.showThemes !== false;
        const visibleThemes = this.getVisibleThemes(themes);
        const radius = Math.min(num(tokens.radius, 20), 40);
        const fontFamily = str(tokens.fontFamily, '');
        // The widget is a card itself: border and shadow of the theme, like every other coupled card
        const borderWidth = num(tokens.borderWidth, 0);
        const borderStyle = str(tokens.borderStyle, 'solid');
        const border =
            borderWidth > 0 && borderStyle !== 'none'
                ? `${borderWidth}px ${borderStyle} ${str(tokens.border, 'transparent')}`
                : 'none';
        const shadowColor = str(tokens.shadow, 'transparent');
        const shadow = `${num(tokens.shadowX, 0)}px ${num(tokens.shadowY, 0)}px ${num(tokens.shadowBlur, 0)}px ${num(
            tokens.shadowSize,
            0,
        )}px ${shadowColor}`;

        let content: React.ReactNode;
        if (!themes.length) {
            content = (
                <Box sx={{ color: str(tokens.textMuted, 'inherit'), fontSize: '0.9em', py: 1 }}>
                    {ready ? t('theme_customizer_no_themes') : t('theme_customizer_loading')}
                </Box>
            );
        } else {
            content = (
                <>
                    {showThemes && visibleThemes.length ? (
                        <Box component="section">
                            {InventwoWidgetThemeCustomizer.renderSectionTitle(
                                t('theme_customizer_section_themes'),
                                tokens,
                            )}
                            {this.renderThemes(visibleThemes, activeId, tokens)}
                        </Box>
                    ) : null}
                    {rxData.scope === 'choice' ? this.renderDeviceSwitch(tokens) : null}
                    {active
                        ? THEME_TOKENS.filter(def => this.isTokenShown(def.key)).map(def => (
                              <Box
                                  component="section"
                                  key={def.key}
                              >
                                  {InventwoWidgetThemeCustomizer.renderSectionTitle(t(def.label), tokens)}
                                  {this.renderToken(def, active, themes, tokens)}
                              </Box>
                          ))
                        : null}
                </>
            );
        }

        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    background: str(tokens.surface, 'transparent'),
                    color: str(tokens.text, 'inherit'),
                    borderRadius: `${radius}px`,
                    border,
                    boxShadow: shadow,
                    fontFamily: fontFamily || undefined,
                    transition:
                        'background 250ms ease, color 250ms ease, border-radius 250ms ease, border-color 250ms ease, box-shadow 250ms ease',
                    WebkitTapHighlightColor: 'transparent',
                    userSelect: 'none',
                    // In the editor the widget must stay selectable and must not write anything
                    pointerEvents: this.props.editMode ? 'none' : undefined,
                }}
            >
                {rxData.title ? (
                    <Box
                        component="h3"
                        sx={{ m: 0, fontSize: '1.15em', fontWeight: 600, lineHeight: 1.3 }}
                    >
                        {rxData.title}
                    </Box>
                ) : null}
                {content}
                {this.state.error ? (
                    <Box
                        role="alert"
                        sx={{
                            fontSize: '0.85em',
                            px: 1.5,
                            py: 1,
                            borderRadius: `${Math.min(num(tokens.radiusSmall, 12), 16)}px`,
                            background: 'rgba(220,53,69,0.15)',
                            color: 'inherit',
                            border: '1px solid rgba(220,53,69,0.35)',
                        }}
                    >
                        {this.state.error}
                    </Box>
                ) : null}
            </Box>
        );
    }
}
