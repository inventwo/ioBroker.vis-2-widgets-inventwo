import { RESERVED_THEME_IDS, THEME_TOKENS, type ThemeTokens, sanitizeTokenValue } from './themeTokens';

/** Identifies exported theme files */
export const THEME_FILE_FORMAT = 'inventwo-vis2-themes';
export const THEME_FILE_VERSION = 1;
/** Limits for files from outside, so a broken or hostile file cannot block the editor or flood the server */
export const MAX_THEME_FILE_SIZE = 1024 * 1024;
export const MAX_IMPORT_THEMES = 50;
/** Same limit as the name field of the theme manager */
export const MAX_THEME_NAME_LENGTH = 60;

const THEME_ID_PATTERN = /^[a-z0-9_]{1,64}$/;

/** A theme read from a file; `tokens` holds only the valid values, missing ones get the defaults on creation */
export interface ImportedTheme {
    /** Undefined if the file has no usable id */
    id?: string;
    name: string;
    tokens: Partial<ThemeTokens>;
}

/** Theme entry of an export file */
export interface ThemeFileEntry {
    id: string;
    name: string;
    tokens: ThemeTokens;
}

export interface ThemeFile {
    format: typeof THEME_FILE_FORMAT;
    version: number;
    themes: ThemeFileEntry[];
}

function cleanName(value: unknown): string {
    return typeof value === 'string'
        ? value.trim().replace(/\s+/g, ' ').substring(0, MAX_THEME_NAME_LENGTH).trim()
        : '';
}

function cleanId(value: unknown): string | undefined {
    return typeof value === 'string' && THEME_ID_PATTERN.test(value) && !RESERVED_THEME_IDS.includes(value)
        ? value
        : undefined;
}

/** Valid token values of an untrusted object; unknown keys are dropped */
function cleanTokens(value: unknown): Partial<ThemeTokens> {
    const tokens: Partial<ThemeTokens> = {};
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        THEME_TOKENS.forEach(def => {
            if (Object.prototype.hasOwnProperty.call(value, def.key)) {
                const clean = sanitizeTokenValue(def.key, (value as Record<string, unknown>)[def.key]);
                if (clean !== undefined) {
                    tokens[def.key] = clean;
                }
            }
        });
    }
    return tokens;
}

function parseEntry(raw: unknown): ImportedTheme | null {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const entry = raw as Record<string, unknown>;
    const tokens = cleanTokens(entry.tokens);
    // An entry without a single usable value is not a theme
    if (!Object.keys(tokens).length) {
        return null;
    }
    const id = cleanId(entry.id);
    const name = cleanName(entry.name) || id || 'Theme';
    return { id, name, tokens };
}

/** Text of an export file with the given themes; the token values are sanitized and complete */
export function serializeThemes(themes: { id: string; name: string; tokens: ThemeTokens }[]): string {
    const file: ThemeFile = {
        format: THEME_FILE_FORMAT,
        version: THEME_FILE_VERSION,
        themes: themes.map(theme => {
            const tokens = {} as ThemeTokens;
            THEME_TOKENS.forEach(def => {
                const value = sanitizeTokenValue(def.key, theme.tokens[def.key]);
                if (value !== undefined) {
                    tokens[def.key] = value;
                }
            });
            return { id: theme.id, name: theme.name, tokens };
        }),
    };
    return JSON.stringify(file, null, 2);
}

/**
 * Reads an export file (one or many themes). Returns null if the text is not a theme file; invalid entries are
 * skipped, so the result can be empty. At most `MAX_IMPORT_THEMES` themes are returned.
 */
export function parseThemeFile(text: string): ImportedTheme[] | null {
    let json: unknown;
    try {
        json = JSON.parse(text);
    } catch {
        return null;
    }
    if (!json || typeof json !== 'object' || (json as Record<string, unknown>).format !== THEME_FILE_FORMAT) {
        return null;
    }
    const file = json as Record<string, unknown>;
    // `themes` is the regular form; a single `theme` object is accepted as well
    const list: unknown[] | null = Array.isArray(file.themes) ? file.themes : file.theme ? [file.theme] : null;
    if (!list) {
        return null;
    }
    const result: ImportedTheme[] = [];
    for (const raw of list) {
        if (result.length >= MAX_IMPORT_THEMES) {
            break;
        }
        const entry = parseEntry(raw);
        if (entry) {
            result.push(entry);
        }
    }
    return result;
}

/**
 * Name that is not in `existing` (case-insensitive): "Name", "Name (2)", "Name (3)", ... An existing counter suffix
 * is replaced instead of appended.
 */
export function uniqueThemeName(name: string, existing: Iterable<string>): string {
    const taken = new Set([...existing].map(n => n.toLowerCase()));
    if (!taken.has(name.toLowerCase())) {
        return name;
    }
    const base = name.replace(/\s*\(\d+\)$/, '') || 'Theme';
    for (let i = 2; ; i++) {
        const suffix = ` (${i})`;
        const candidate = `${base.substring(0, MAX_THEME_NAME_LENGTH - suffix.length).trim()}${suffix}`;
        if (!taken.has(candidate.toLowerCase())) {
            return candidate;
        }
    }
}

/** File name (without extension) derived from a theme name */
export function themeFileName(name: string): string {
    return name.replace(/[^\p{L}\p{N}_\- ]+/gu, '_').trim() || 'theme';
}
