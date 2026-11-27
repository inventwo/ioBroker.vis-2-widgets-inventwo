/**
 * Design tokens of the theme system: the keys, their types and limits, the built-in themes and the validation of
 * values coming from data points (which scripts may write, so nothing is trusted).
 */

export type ThemeTokenKey =
    // colors (CSS color strings, gradients allowed for accent/surface/surfaceVariant/background)
    | 'accent'
    | 'onAccent'
    | 'onAccentIcon'
    | 'surface'
    | 'surfaceVariant'
    | 'text'
    | 'textMuted'
    | 'icon'
    | 'track'
    | 'thumb'
    | 'border'
    | 'shadow'
    | 'shadowTile'
    | 'glow'
    // numbers (px)
    | 'radius'
    | 'radiusSmall'
    | 'borderWidth'
    | 'shadowX'
    | 'shadowY'
    | 'shadowBlur'
    | 'shadowSize'
    // 'none' | 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'
    | 'borderStyle'
    // CSS font-family string, '' = inherit
    | 'fontFamily'
    // color: view background (only exposed as CSS variable)
    | 'background';

export type ThemeTokenType = 'color' | 'number' | 'select' | 'text';

export interface ThemeTokenDef {
    key: ThemeTokenKey;
    type: ThemeTokenType;
    group: 'colors' | 'shape' | 'border' | 'shadow' | 'font';
    /** i18n key without prefix, e.g. 'theme_token_accent' */
    label: string;
    min?: number;
    max?: number;
    options?: string[];
}

/** All tokens; the order is the order in UIs */
export const THEME_TOKENS: readonly ThemeTokenDef[] = [
    { key: 'background', type: 'color', group: 'colors', label: 'theme_token_background' },
    { key: 'surface', type: 'color', group: 'colors', label: 'theme_token_surface' },
    { key: 'surfaceVariant', type: 'color', group: 'colors', label: 'theme_token_surfaceVariant' },
    { key: 'accent', type: 'color', group: 'colors', label: 'theme_token_accent' },
    { key: 'onAccent', type: 'color', group: 'colors', label: 'theme_token_onAccent' },
    { key: 'onAccentIcon', type: 'color', group: 'colors', label: 'theme_token_onAccentIcon' },
    { key: 'text', type: 'color', group: 'colors', label: 'theme_token_text' },
    { key: 'textMuted', type: 'color', group: 'colors', label: 'theme_token_textMuted' },
    { key: 'icon', type: 'color', group: 'colors', label: 'theme_token_icon' },
    { key: 'track', type: 'color', group: 'colors', label: 'theme_token_track' },
    { key: 'thumb', type: 'color', group: 'colors', label: 'theme_token_thumb' },
    { key: 'radius', type: 'number', group: 'shape', label: 'theme_token_radius', min: 0, max: 100 },
    { key: 'radiusSmall', type: 'number', group: 'shape', label: 'theme_token_radiusSmall', min: 0, max: 100 },
    { key: 'border', type: 'color', group: 'border', label: 'theme_token_border' },
    { key: 'borderWidth', type: 'number', group: 'border', label: 'theme_token_borderWidth', min: 0, max: 20 },
    {
        key: 'borderStyle',
        type: 'select',
        group: 'border',
        label: 'theme_token_borderStyle',
        options: ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'],
    },
    { key: 'shadow', type: 'color', group: 'shadow', label: 'theme_token_shadow' },
    { key: 'shadowTile', type: 'color', group: 'shadow', label: 'theme_token_shadowTile' },
    { key: 'glow', type: 'color', group: 'shadow', label: 'theme_token_glow' },
    { key: 'shadowX', type: 'number', group: 'shadow', label: 'theme_token_shadowX', min: -50, max: 50 },
    { key: 'shadowY', type: 'number', group: 'shadow', label: 'theme_token_shadowY', min: -50, max: 50 },
    { key: 'shadowBlur', type: 'number', group: 'shadow', label: 'theme_token_shadowBlur', min: 0, max: 100 },
    { key: 'shadowSize', type: 'number', group: 'shadow', label: 'theme_token_shadowSize', min: -50, max: 50 },
    { key: 'fontFamily', type: 'text', group: 'font', label: 'theme_token_fontFamily' },
];

const TOKEN_DEFS: Readonly<Record<string, ThemeTokenDef>> = Object.fromEntries(THEME_TOKENS.map(def => [def.key, def]));

/** Returns the definition of a token, or undefined if `key` is not a token key */
export function getTokenDef(key: string): ThemeTokenDef | undefined {
    return Object.prototype.hasOwnProperty.call(TOKEN_DEFS, key) ? TOKEN_DEFS[key] : undefined;
}

/** True if `key` is a valid token key */
export function isThemeTokenKey(key: unknown): key is ThemeTokenKey {
    return typeof key === 'string' && getTokenDef(key) !== undefined;
}

export type ThemeTokens = Record<ThemeTokenKey, string | number>;

export interface ThemeDefinition {
    id: string;
    name: string;
    tokens: ThemeTokens;
}

const DARK_TOKENS: ThemeTokens = {
    accent: 'rgb(159,219,88)',
    onAccent: 'rgb(24,42,8)',
    onAccentIcon: 'rgb(24,42,8)',
    surface: 'rgb(27,30,36)',
    surfaceVariant: 'rgb(36,40,48)',
    text: 'rgb(236,238,242)',
    textMuted: 'rgb(128,135,148)',
    icon: 'rgb(128,135,148)',
    track: 'rgb(46,50,59)',
    thumb: 'rgb(255,255,255)',
    border: 'rgba(255,255,255,0.06)',
    shadow: 'rgba(0,0,0,0.35)',
    shadowTile: 'rgba(0,0,0,0.35)',
    glow: 'color-mix(in srgb, rgb(159,219,88) 40%, transparent)',
    radius: 20,
    radiusSmall: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    shadowX: 0,
    shadowY: 8,
    shadowBlur: 24,
    shadowSize: 0,
    fontFamily: '',
    background: 'rgb(16,18,22)',
};

/** Token values used for everything a theme does not define (= the built-in theme `dark`) */
export const DEFAULT_TOKENS: ThemeTokens = Object.freeze({ ...DARK_TOKENS });

/** Color tokens that may hold a gradient (they are only applied with `background`) */
const GRADIENT_TOKENS: ReadonlySet<ThemeTokenKey> = new Set(['accent', 'surface', 'surfaceVariant', 'background']);

const MAX_COLOR_LENGTH = 500;
const MAX_FONT_LENGTH = 200;
/**
 * Characters allowed in a color: enough for names, hex, rgb()/hsl() and gradients with angles, percentages and
 * `to right`. Everything that could leave a CSS declaration or value (`;`, `{`, `}`, `:`, quotes, `\`, `<`, `>`) is
 * missing on purpose, because the values end up in a `<style>` tag.
 */
const COLOR_PATTERN = /^[a-zA-Z0-9#(),.%\s+\-/]+$/;
/** Font family list: letters (any language), digits, spaces, commas, hyphens, underscores, dots and quotes */
const FONT_PATTERN = /^[\p{L}\p{N} ,\-_.'"]*$/u;

function countChar(value: string, char: string): number {
    return value.split(char).length - 1;
}

/**
 * Validates and coerces a token value, e.g. from a data point. Returns undefined if the value is not usable; then
 * the default value of the token applies.
 */
export function sanitizeTokenValue(key: ThemeTokenKey, value: unknown): string | number | undefined {
    const def = getTokenDef(key);
    if (!def) {
        return undefined;
    }
    switch (def.type) {
        case 'color': {
            if (typeof value !== 'string') {
                return undefined;
            }
            const color = value.trim().replace(/\s+/g, ' ');
            if (!color || color.length > MAX_COLOR_LENGTH || !COLOR_PATTERN.test(color)) {
                return undefined;
            }
            if (countChar(color, '(') !== countChar(color, ')')) {
                return undefined;
            }
            if (/gradient\(/i.test(color) && !GRADIENT_TOKENS.has(key)) {
                return undefined;
            }
            return color;
        }
        case 'number': {
            if (typeof value === 'boolean' || value === null || value === undefined || value === '') {
                return undefined;
            }
            const num = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : NaN;
            if (!Number.isFinite(num)) {
                return undefined;
            }
            let result = Math.round(num * 100) / 100;
            if (def.min !== undefined) {
                result = Math.max(def.min, result);
            }
            if (def.max !== undefined) {
                result = Math.min(def.max, result);
            }
            return result;
        }
        case 'select': {
            if (typeof value !== 'string') {
                return undefined;
            }
            const option = value.trim();
            return def.options?.includes(option) ? option : undefined;
        }
        case 'text': {
            if (typeof value !== 'string') {
                return undefined;
            }
            const text = value.trim().replace(/\s+/g, ' ');
            if (text.length > MAX_FONT_LENGTH || !FONT_PATTERN.test(text)) {
                return undefined;
            }
            // Unbalanced quotes would swallow the rest of a CSS declaration
            if (countChar(text, '"') % 2 || countChar(text, "'") % 2) {
                return undefined;
            }
            return text;
        }
        default:
            return undefined;
    }
}

/**
 * Complete token set from untrusted input: every valid value of `tokens` is taken, all other keys get the value of
 * `fallback`.
 */
export function sanitizeTokens(tokens: unknown, fallback: ThemeTokens = DEFAULT_TOKENS): ThemeTokens {
    const result = { ...fallback };
    if (tokens && typeof tokens === 'object') {
        THEME_TOKENS.forEach(def => {
            const value = sanitizeTokenValue(def.key, (tokens as Record<string, unknown>)[def.key]);
            if (value !== undefined) {
                result[def.key] = value;
            }
        });
    }
    return result;
}

/** Themes shipped with the adapter; seeded as data points when no theme exists yet */
export const BUILTIN_THEMES: readonly ThemeDefinition[] = [
    { id: 'dark', name: 'Graphite', tokens: { ...DARK_TOKENS } },
    {
        id: 'light',
        name: 'Linen',
        tokens: {
            accent: 'rgb(201,106,58)',
            onAccent: 'rgb(255,255,255)',
            onAccentIcon: 'rgb(255,255,255)',
            surface: 'rgb(255,252,247)',
            surfaceVariant: 'rgb(245,240,232)',
            text: 'rgb(43,38,33)',
            textMuted: 'rgb(130,120,108)',
            icon: 'rgb(130,120,108)',
            track: 'rgb(228,220,208)',
            thumb: 'rgb(255,255,255)',
            border: 'rgba(60,45,30,0.10)',
            shadow: 'rgba(80,60,40,0.14)',
            shadowTile: 'rgba(80,60,40,0.14)',
            glow: 'color-mix(in srgb, rgb(201,106,58) 40%, transparent)',
            radius: 18,
            radiusSmall: 10,
            borderWidth: 1,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 6,
            shadowBlur: 20,
            shadowSize: 0,
            fontFamily: '',
            background: 'rgb(237,231,221)',
        },
    },
    {
        id: 'ocean',
        name: 'Ocean',
        tokens: {
            accent: 'rgb(56,212,224)',
            onAccent: 'rgb(4,38,46)',
            onAccentIcon: 'rgb(4,38,46)',
            surface: 'rgb(14,32,52)',
            surfaceVariant: 'rgb(20,44,70)',
            text: 'rgb(226,240,250)',
            textMuted: 'rgb(122,152,180)',
            icon: 'rgb(122,152,180)',
            track: 'rgb(30,58,88)',
            thumb: 'rgb(255,255,255)',
            border: 'rgba(120,200,255,0.10)',
            shadow: 'rgba(0,10,25,0.45)',
            shadowTile: 'rgba(0,10,25,0.45)',
            glow: 'color-mix(in srgb, rgb(56,212,224) 40%, transparent)',
            radius: 16,
            radiusSmall: 10,
            borderWidth: 1,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 10,
            shadowBlur: 28,
            shadowSize: 0,
            fontFamily: '',
            background: 'linear-gradient(160deg, rgb(7,20,36) 0%, rgb(10,36,62) 100%)',
        },
    },
    {
        id: 'glass',
        name: 'Glass',
        tokens: {
            accent: 'rgb(255,176,222)',
            onAccent: 'rgb(74,22,78)',
            onAccentIcon: 'rgb(74,22,78)',
            surface: 'rgba(255,255,255,0.12)',
            surfaceVariant: 'rgba(255,255,255,0.18)',
            text: 'rgb(255,255,255)',
            textMuted: 'rgba(255,255,255,0.72)',
            icon: 'rgba(255,255,255,0.72)',
            track: 'rgba(255,255,255,0.24)',
            thumb: 'rgb(255,255,255)',
            border: 'rgba(255,255,255,0.28)',
            shadow: 'rgba(40,10,70,0.25)',
            shadowTile: 'rgba(40,10,70,0.25)',
            glow: 'color-mix(in srgb, rgb(255,176,222) 40%, transparent)',
            radius: 22,
            radiusSmall: 14,
            borderWidth: 1,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 8,
            shadowBlur: 32,
            shadowSize: 0,
            fontFamily: '',
            background: 'linear-gradient(135deg, rgb(98,52,196) 0%, rgb(160,64,190) 50%, rgb(226,84,160) 100%)',
        },
    },
    {
        // Classic desktop look of the late 90s: gray raised surfaces on a teal desktop
        id: 'retro98',
        name: 'Retro 98',
        tokens: {
            accent: 'rgb(0,0,128)',
            onAccent: 'rgb(255,255,255)',
            onAccentIcon: 'rgb(255,255,255)',
            surface: 'rgb(192,192,192)',
            surfaceVariant: 'rgb(192,192,192)',
            text: 'rgb(0,0,0)',
            textMuted: 'rgb(96,96,96)',
            icon: 'rgb(96,96,96)',
            track: 'rgb(255,255,255)',
            thumb: 'rgb(192,192,192)',
            border: 'rgb(223,223,223)',
            shadow: 'rgba(0,0,0,0.6)',
            shadowTile: 'rgba(0,0,0,0.6)',
            glow: 'color-mix(in srgb, rgb(0,0,128) 40%, transparent)',
            radius: 0,
            radiusSmall: 0,
            borderWidth: 2,
            borderStyle: 'outset',
            shadowX: 1,
            shadowY: 1,
            shadowBlur: 0,
            shadowSize: 0,
            fontFamily: "Tahoma, 'MS Sans Serif', Verdana, sans-serif",
            background: 'rgb(0,128,128)',
        },
    },
    {
        // Neo-brutalism: thick black outlines, hard offset shadows, loud colors
        id: 'brutal',
        name: 'Neo Brutal',
        tokens: {
            accent: 'rgb(255,92,141)',
            onAccent: 'rgb(17,17,17)',
            onAccentIcon: 'rgb(17,17,17)',
            surface: 'rgb(255,255,255)',
            surfaceVariant: 'rgb(255,222,89)',
            text: 'rgb(17,17,17)',
            textMuted: 'rgb(84,84,84)',
            icon: 'rgb(84,84,84)',
            track: 'rgb(235,228,214)',
            thumb: 'rgb(255,255,255)',
            border: 'rgb(17,17,17)',
            shadow: 'rgb(17,17,17)',
            shadowTile: 'rgb(17,17,17)',
            glow: 'color-mix(in srgb, rgb(255,92,141) 40%, transparent)',
            radius: 8,
            radiusSmall: 6,
            borderWidth: 3,
            borderStyle: 'solid',
            shadowX: 6,
            shadowY: 6,
            shadowBlur: 0,
            shadowSize: 0,
            fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
            background: 'rgb(255,244,224)',
        },
    },
    {
        // 80s neon: dark violet, magenta accent, cyan details, glowing edges
        id: 'synthwave',
        name: 'Synthwave',
        tokens: {
            accent: 'rgb(255,46,196)',
            onAccent: 'rgb(255,255,255)',
            onAccentIcon: 'rgb(255,255,255)',
            surface: 'rgb(28,14,48)',
            surfaceVariant: 'rgb(44,20,72)',
            text: 'rgb(250,232,255)',
            textMuted: 'rgb(172,142,204)',
            icon: 'rgb(172,142,204)',
            track: 'rgba(0,229,255,0.35)',
            thumb: 'rgb(255,255,255)',
            border: 'rgba(255,46,196,0.55)',
            shadow: 'rgba(255,46,196,0.45)',
            shadowTile: 'rgba(255,46,196,0.45)',
            glow: 'color-mix(in srgb, rgb(255,46,196) 40%, transparent)',
            radius: 6,
            radiusSmall: 4,
            borderWidth: 1,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 0,
            shadowBlur: 18,
            shadowSize: 0,
            fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
            background: 'linear-gradient(180deg, rgb(18,6,36) 0%, rgb(44,10,64) 60%, rgb(86,18,86) 100%)',
        },
    },
    {
        // Phosphor screen: green on black, monospace, dashed outlines
        id: 'terminal',
        name: 'Terminal',
        tokens: {
            accent: 'rgb(51,255,102)',
            onAccent: 'rgb(0,20,6)',
            onAccentIcon: 'rgb(0,20,6)',
            surface: 'rgb(8,16,10)',
            surfaceVariant: 'rgb(12,28,16)',
            text: 'rgb(51,255,102)',
            textMuted: 'rgb(32,150,64)',
            icon: 'rgb(32,150,64)',
            track: 'rgb(18,48,26)',
            thumb: 'rgb(214,255,224)',
            border: 'rgba(51,255,102,0.6)',
            shadow: 'rgba(51,255,102,0.22)',
            shadowTile: 'rgba(51,255,102,0.22)',
            glow: 'color-mix(in srgb, rgb(51,255,102) 40%, transparent)',
            radius: 0,
            radiusSmall: 0,
            borderWidth: 1,
            borderStyle: 'dashed',
            shadowX: 0,
            shadowY: 0,
            shadowBlur: 12,
            shadowSize: 0,
            fontFamily: "Consolas, 'Lucida Console', 'Courier New', monospace",
            background: 'rgb(4,9,5)',
        },
    },
    {
        // Friendly and light: pastel colors, large radius, no border, soft shadow
        id: 'pastel',
        name: 'Soft Pastel',
        tokens: {
            accent: 'rgb(139,108,239)',
            onAccent: 'rgb(255,255,255)',
            onAccentIcon: 'rgb(255,255,255)',
            surface: 'rgb(255,255,255)',
            surfaceVariant: 'rgb(243,238,255)',
            text: 'rgb(52,48,74)',
            textMuted: 'rgb(140,134,166)',
            icon: 'rgb(140,134,166)',
            track: 'rgb(232,226,250)',
            thumb: 'rgb(255,255,255)',
            border: 'rgba(139,108,239,0.12)',
            shadow: 'rgba(110,90,190,0.16)',
            shadowTile: 'rgba(110,90,190,0.16)',
            glow: 'color-mix(in srgb, rgb(139,108,239) 40%, transparent)',
            radius: 24,
            radiusSmall: 16,
            borderWidth: 0,
            borderStyle: 'none',
            shadowX: 0,
            shadowY: 12,
            shadowBlur: 32,
            shadowSize: 0,
            fontFamily: "Nunito, 'Segoe UI', system-ui, sans-serif",
            background: 'linear-gradient(160deg, rgb(244,240,255) 0%, rgb(234,246,250) 100%)',
        },
    },
    {
        // Wall panels at night: pure black, dim red light that does not dazzle, no glow
        id: 'night',
        name: 'Night Vision',
        tokens: {
            accent: 'rgb(196,44,32)',
            onAccent: 'rgb(0,0,0)',
            onAccentIcon: 'rgb(0,0,0)',
            surface: 'rgb(12,6,6)',
            surfaceVariant: 'rgb(22,10,10)',
            text: 'rgb(208,88,74)',
            textMuted: 'rgb(122,50,44)',
            icon: 'rgb(122,50,44)',
            track: 'rgb(44,16,14)',
            thumb: 'rgb(140,64,56)',
            border: 'rgba(196,44,32,0.18)',
            shadow: 'rgba(0,0,0,0)',
            shadowTile: 'rgba(0,0,0,0)',
            glow: 'color-mix(in srgb, rgb(196,44,32) 40%, transparent)',
            radius: 14,
            radiusSmall: 10,
            borderWidth: 1,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 0,
            shadowBlur: 0,
            shadowSize: 0,
            fontFamily: '',
            background: 'rgb(0,0,0)',
        },
    },
    {
        // Maximum legibility from a distance: black and white, yellow accent, solid white outlines
        id: 'contrast',
        name: 'High Contrast',
        tokens: {
            accent: 'rgb(255,214,0)',
            onAccent: 'rgb(0,0,0)',
            onAccentIcon: 'rgb(0,0,0)',
            surface: 'rgb(0,0,0)',
            surfaceVariant: 'rgb(32,32,32)',
            text: 'rgb(255,255,255)',
            textMuted: 'rgb(214,214,214)',
            icon: 'rgb(214,214,214)',
            track: 'rgb(96,96,96)',
            thumb: 'rgb(255,255,255)',
            border: 'rgb(255,255,255)',
            shadow: 'rgba(0,0,0,0)',
            shadowTile: 'rgba(0,0,0,0)',
            glow: 'color-mix(in srgb, rgb(255,214,0) 40%, transparent)',
            radius: 8,
            radiusSmall: 6,
            borderWidth: 2,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 0,
            shadowBlur: 0,
            shadowSize: 0,
            fontFamily: "Verdana, 'Segoe UI', Arial, sans-serif",
            background: 'rgb(0,0,0)',
        },
    },
    {
        // Warm and natural: deep moss green, amber accent, serif font
        id: 'forest',
        name: 'Forest',
        tokens: {
            accent: 'rgb(226,166,84)',
            onAccent: 'rgb(40,26,8)',
            onAccentIcon: 'rgb(40,26,8)',
            surface: 'rgb(30,46,36)',
            surfaceVariant: 'rgb(40,60,46)',
            text: 'rgb(236,230,212)',
            textMuted: 'rgb(152,164,138)',
            icon: 'rgb(152,164,138)',
            track: 'rgb(56,80,62)',
            thumb: 'rgb(246,240,224)',
            border: 'rgba(226,206,156,0.14)',
            shadow: 'rgba(0,0,0,0.35)',
            shadowTile: 'rgba(0,0,0,0.35)',
            glow: 'color-mix(in srgb, rgb(226,166,84) 40%, transparent)',
            radius: 14,
            radiusSmall: 9,
            borderWidth: 1,
            borderStyle: 'solid',
            shadowX: 0,
            shadowY: 8,
            shadowBlur: 24,
            shadowSize: 0,
            fontFamily: "Georgia, 'Palatino Linotype', 'Book Antiqua', serif",
            background: 'linear-gradient(160deg, rgb(16,28,22) 0%, rgb(30,48,36) 100%)',
        },
    },
];

/**
 * Tokens added later: a theme stored before has no value for them and takes the value of another token of the same
 * theme instead of the default, so its look does not change (e.g. `icon` was colored with `textMuted` before).
 */
const TOKEN_FALLBACKS: Readonly<Partial<Record<ThemeTokenKey, (tokens: ThemeTokens) => string | number>>> = {
    icon: tokens => tokens.textMuted,
    onAccentIcon: tokens => tokens.onAccent,
    shadowTile: tokens => tokens.shadow,
    // a gradient cannot be mixed; then the plain shadow color is used
    glow: tokens =>
        /gradient\(/i.test(String(tokens.accent))
            ? tokens.shadow
            : `color-mix(in srgb, ${String(tokens.accent)} 40%, transparent)`,
};

/**
 * Complete token set from the values a theme defines. A built-in theme (`id`) takes missing tokens from its original
 * values, so it gets the values of tokens added later and is not shown as modified. Other themes follow
 * `TOKEN_FALLBACKS`, then the defaults.
 */
export function completeTokens(values: Partial<ThemeTokens>, id?: string): ThemeTokens {
    const builtin = id ? BUILTIN_THEMES.find(theme => theme.id === id) : undefined;
    if (builtin) {
        return { ...DEFAULT_TOKENS, ...builtin.tokens, ...values };
    }
    const result: ThemeTokens = { ...DEFAULT_TOKENS, ...values };
    (Object.entries(TOKEN_FALLBACKS) as [ThemeTokenKey, (tokens: ThemeTokens) => string | number][]).forEach(
        ([key, derive]) => {
            if (values[key] === undefined) {
                result[key] = derive(result);
            }
        },
    );
    return result;
}

/** How a theme relates to the built-in themes: not built-in, built-in as shipped, or built-in with changed values */
export type BuiltinStatus = 'custom' | 'original' | 'modified';

/** Comparable form of a token value: colors and texts without spaces and case, numbers as numbers */
function comparable(key: ThemeTokenKey, value: unknown): string {
    const clean = sanitizeTokenValue(key, value);
    if (clean === undefined) {
        return '';
    }
    return typeof clean === 'number' ? String(clean) : clean.replace(/\s+/g, '').toLowerCase();
}

/**
 * Built-in status of a theme. A theme counts as built-in when its id is the id of a built-in theme; a duplicate
 * gets a new id and is therefore an own theme. Only the values are compared, the name may differ.
 */
export function getBuiltinStatus(id: string, tokens: Partial<ThemeTokens>): BuiltinStatus {
    const builtin = BUILTIN_THEMES.find(theme => theme.id === id);
    if (!builtin) {
        return 'custom';
    }
    const changed = THEME_TOKENS.some(
        def => comparable(def.key, tokens[def.key]) !== comparable(def.key, builtin.tokens[def.key]),
    );
    return changed ? 'modified' : 'original';
}

/** Ids that cannot be used for a theme, because a data point of the `themes` folder has that name */
export const RESERVED_THEME_IDS: readonly string[] = ['active'];

const MAX_ID_LENGTH = 40;

/** Builds a theme id (`a-z0-9_`) from a display name that is not in `existing` (and not reserved) */
export function themeIdFromName(name: string, existing: string[]): string {
    let base = String(name ?? '')
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .substring(0, MAX_ID_LENGTH)
        .replace(/_+$/, '');
    if (!base) {
        base = 'theme';
    }
    const taken = new Set([...existing, ...RESERVED_THEME_IDS]);
    if (!taken.has(base)) {
        return base;
    }
    for (let i = 2; ; i++) {
        const id = `${base}_${i}`;
        if (!taken.has(id)) {
            return id;
        }
    }
}

/** Accent colors offered by the customizer */
export const ACCENT_SWATCHES: readonly string[] = [
    'rgb(159,219,88)', // lime
    'rgb(52,199,89)', // green
    'rgb(56,212,224)', // cyan
    'rgb(10,132,255)', // blue
    'rgb(94,92,230)', // indigo
    'rgb(175,82,222)', // purple
    'rgb(255,105,180)', // pink
    'rgb(255,69,58)', // red
    'rgb(255,149,0)', // orange
    'rgb(255,204,0)', // yellow
];
