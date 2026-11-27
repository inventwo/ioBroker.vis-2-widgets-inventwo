import type { Connection } from '@iobroker/gui-components';

import {
    BUILTIN_THEMES,
    DEFAULT_TOKENS,
    RESERVED_THEME_IDS,
    THEME_TOKENS,
    type ThemeTokenKey,
    type ThemeTokens,
    completeTokens,
    getTokenDef,
    isThemeTokenKey,
    sanitizeTokenValue,
    themeIdFromName,
} from './themeTokens';

/** Instance whose objects hold the themes */
export const THEME_NAMESPACE = 'vis-2-widgets-inventwo.0';
/** Folder of all theme data points */
export const THEME_FOLDER = `${THEME_NAMESPACE}.themes`;
/** State with the id of the globally active theme ('' = none) */
export const THEME_ACTIVE_ID = `${THEME_FOLDER}.active`;

const CACHE_KEY = 'inventwo.themes.cache';
const DEVICE_KEY = 'inventwo.themes.deviceActive';
const STYLE_ELEMENT_ID = 'inventwo-theme-vars';
const NOTIFY_DELAY = 30;
const MAX_NAME_LENGTH = 100;
const THEME_ID_PATTERN = /^[a-z0-9_]{1,64}$/;

export interface ThemeInfo {
    id: string;
    name: string;
    order: number;
    /** Complete; values missing in the data points follow `completeTokens` (fallback token, then DEFAULT_TOKENS) */
    tokens: ThemeTokens;
}

export type ThemeScope = 'global' | 'device';

interface RawTheme {
    name: string;
    order: number;
}

interface CacheFile {
    themes: ThemeInfo[];
    active: string;
}

// ---------------------------------------------------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------------------------------------------------

let socket: Connection | null = null;
let initPromise: Promise<void> | null = null;
let ready = false;
/** Theme channels (id -> name/order) */
const channels = new Map<string, RawTheme>();
/** Valid token values from the data points, per theme id (also for ids whose channel is not known yet) */
const tokenValues = new Map<string, Partial<ThemeTokens>>();
let globalActive = '';
/** Built lazily from `channels` + `tokenValues`, reset on every change */
let themesCache: ThemeInfo[] | null = null;
const listeners = new Set<() => void>();
let notifyTimer: ReturnType<typeof setTimeout> | null = null;

function warn(text: string, error?: unknown): void {
    console.warn(`[inventwo themes] ${text}`, error ?? '');
}

function isValidThemeId(id: unknown): id is string {
    return typeof id === 'string' && THEME_ID_PATTERN.test(id) && !RESERVED_THEME_IDS.includes(id);
}

/**
 * Throws for an invalid theme id. The type guard checks a copy typed `unknown`: checked directly, a failed guard
 * would narrow the `string` parameter to `never` in the error message.
 */
function assertThemeId(id: string): void {
    const candidate: unknown = id;
    if (!isValidThemeId(candidate)) {
        throw new Error(`Invalid theme id "${id}"`);
    }
}

function cleanName(name: unknown, fallback: string): string {
    let text = '';
    if (typeof name === 'string') {
        text = name;
    } else if (name && typeof name === 'object') {
        // ioBroker.Translated
        const translated = name as Record<string, unknown>;
        const value = translated.en ?? translated.de ?? Object.values(translated).find(v => typeof v === 'string');
        text = typeof value === 'string' ? value : '';
    }
    text = text.trim().substring(0, MAX_NAME_LENGTH);
    return text || fallback;
}

function storageGet(key: string): string | null {
    try {
        return window.localStorage?.getItem(key) ?? null;
    } catch {
        return null;
    }
}

function storageSet(key: string, value: string | null): void {
    try {
        if (value === null) {
            window.localStorage?.removeItem(key);
        } else {
            window.localStorage?.setItem(key, value);
        }
    } catch {
        // Storage not available (private mode, quota): the cache is only an optimization
    }
}

function buildThemes(): ThemeInfo[] {
    if (!themesCache) {
        themesCache = [...channels.entries()]
            .map(([id, raw]) => ({
                id,
                name: raw.name,
                order: raw.order,
                tokens: completeTokens(tokenValues.get(id) || {}, id),
            }))
            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
    }
    return themesCache;
}

function deviceActive(): string {
    const value = storageGet(DEVICE_KEY);
    return isValidThemeId(value) ? value : '';
}

function effectiveActiveId(): string {
    const device = deviceActive();
    if (device && channels.has(device)) {
        return device;
    }
    return globalActive;
}

// ---------------------------------------------------------------------------------------------------------------------
// CSS variables + cache
// ---------------------------------------------------------------------------------------------------------------------

function kebab(key: string): string {
    return key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
}

/** CSS text with the variables of a theme; values are sanitized, so they cannot leave the declaration */
export function themeCssVariables(tokens: ThemeTokens): string {
    const lines = THEME_TOKENS.map(def => {
        const value = sanitizeTokenValue(def.key, tokens[def.key]) ?? DEFAULT_TOKENS[def.key];
        let css: string;
        if (def.type === 'number') {
            css = `${value}px`;
        } else if (def.key === 'fontFamily') {
            css = value === '' ? 'inherit' : String(value);
        } else {
            css = String(value);
        }
        return `    --iw-${kebab(def.key)}: ${css};`;
    });
    return `:root {\n${lines.join('\n')}\n}`;
}

function writeCssVariables(): void {
    if (typeof document === 'undefined') {
        return;
    }
    try {
        const activeId = effectiveActiveId();
        const theme = activeId ? buildThemes().find(t => t.id === activeId) : undefined;
        let element = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement | null;
        if (!theme) {
            element?.remove();
            return;
        }
        if (!element) {
            element = document.createElement('style');
            element.id = STYLE_ELEMENT_ID;
            document.head.appendChild(element);
        }
        const css = themeCssVariables(theme.tokens);
        if (element.textContent !== css) {
            element.textContent = css;
        }
    } catch (error) {
        warn('Cannot write CSS variables', error);
    }
}

function writeCache(): void {
    const file: CacheFile = { themes: buildThemes(), active: globalActive };
    storageSet(CACHE_KEY, JSON.stringify(file));
}

function loadCache(): void {
    const text = storageGet(CACHE_KEY);
    if (!text) {
        return;
    }
    try {
        const file = JSON.parse(text) as Partial<CacheFile> | null;
        if (!file || typeof file !== 'object' || !Array.isArray(file.themes)) {
            return;
        }
        file.themes.forEach((raw: unknown) => {
            if (!raw || typeof raw !== 'object') {
                return;
            }
            const theme = raw as Partial<ThemeInfo>;
            if (!isValidThemeId(theme.id)) {
                return;
            }
            channels.set(theme.id, {
                name: cleanName(theme.name, theme.id),
                order: typeof theme.order === 'number' && Number.isFinite(theme.order) ? theme.order : 0,
            });
            const values: Partial<ThemeTokens> = {};
            if (theme.tokens && typeof theme.tokens === 'object') {
                THEME_TOKENS.forEach(def => {
                    const value = sanitizeTokenValue(def.key, (theme.tokens as Record<string, unknown>)[def.key]);
                    if (value !== undefined) {
                        values[def.key] = value;
                    }
                });
            }
            tokenValues.set(theme.id, values);
        });
        globalActive = isValidThemeId(file.active) ? file.active : '';
        themesCache = null;
    } catch (error) {
        warn('Ignoring broken theme cache', error);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Change handling
// ---------------------------------------------------------------------------------------------------------------------

function flush(): void {
    notifyTimer = null;
    writeCssVariables();
    if (ready) {
        writeCache();
    }
    [...listeners].forEach(listener => {
        try {
            listener();
        } catch (error) {
            warn('Theme listener failed', error);
        }
    });
}

/** Coalesces many changes (a theme has ~20 states) into one notification */
function changed(): void {
    themesCache = null;
    if (!notifyTimer) {
        notifyTimer = setTimeout(flush, NOTIFY_DELAY);
    }
}

/** Splits `vis-2-widgets-inventwo.0.themes.<id>[.<token>]` */
function parseId(id: string): { themeId: string; token?: string } | null {
    if (!id.startsWith(`${THEME_FOLDER}.`)) {
        return null;
    }
    const parts = id.substring(THEME_FOLDER.length + 1).split('.');
    if (parts.length === 1) {
        return { themeId: parts[0] };
    }
    if (parts.length === 2) {
        return { themeId: parts[0], token: parts[1] };
    }
    return null;
}

/** Applies a state value; returns true if something changed */
function applyState(id: string, state: ioBroker.State | null | undefined): boolean {
    if (id === THEME_ACTIVE_ID) {
        const value = state?.val;
        const active = typeof value === 'string' && isValidThemeId(value.trim()) ? value.trim() : '';
        if (active === globalActive) {
            return false;
        }
        globalActive = active;
        return true;
    }
    const parsed = parseId(id);
    if (!parsed?.token || !isValidThemeId(parsed.themeId) || !isThemeTokenKey(parsed.token)) {
        return false;
    }
    const key: ThemeTokenKey = parsed.token;
    const values = tokenValues.get(parsed.themeId) || {};
    const value = state ? sanitizeTokenValue(key, state.val) : undefined;
    if (state && value === undefined && state.val !== null && state.val !== undefined) {
        warn(`Ignoring invalid value of ${id}: ${JSON.stringify(state.val)?.substring(0, 100)}`);
    }
    if (values[key] === value) {
        return false;
    }
    if (value === undefined) {
        delete values[key];
    } else {
        values[key] = value;
    }
    tokenValues.set(parsed.themeId, values);
    return true;
}

const onStateChange: ioBroker.StateChangeHandler = (id, state) => {
    try {
        if (applyState(id, state)) {
            changed();
        }
    } catch (error) {
        warn(`Cannot handle change of ${id}`, error);
    }
};

/** Applies a channel object; returns true if something changed */
function applyChannel(id: string, obj: ioBroker.Object | null | undefined): boolean {
    const parsed = parseId(id);
    if (!parsed || parsed.token || !isValidThemeId(parsed.themeId)) {
        return false;
    }
    const themeId = parsed.themeId;
    // A deleted theme keeps its objects (see deleteTheme) and is only flagged
    if (!obj || obj.type !== 'channel' || (obj.native as Record<string, unknown> | undefined)?.deleted === true) {
        if (!channels.has(themeId)) {
            return false;
        }
        channels.delete(themeId);
        tokenValues.delete(themeId);
        return true;
    }
    const order = (obj.native as Record<string, unknown> | undefined)?.order;
    const raw: RawTheme = {
        name: cleanName(obj.common?.name, themeId),
        order: typeof order === 'number' && Number.isFinite(order) ? order : 0,
    };
    const old = channels.get(themeId);
    if (old && old.name === raw.name && old.order === raw.order) {
        return false;
    }
    channels.set(themeId, raw);
    return true;
}

const onObjectChange = (id: string, obj: ioBroker.Object | null | undefined): void => {
    try {
        const parsed = parseId(id);
        if (!parsed) {
            return;
        }
        if (parsed.token) {
            // A deleted token object: its value falls back to the default
            if (!obj && isThemeTokenKey(parsed.token) && applyState(id, null)) {
                changed();
            }
            return;
        }
        if (applyChannel(id, obj)) {
            changed();
        }
    } catch (error) {
        warn(`Cannot handle object change of ${id}`, error);
    }
};

async function load(conn: Connection): Promise<void> {
    const objects = await conn.getObjectView(`${THEME_FOLDER}.`, `${THEME_FOLDER}.香`, 'channel');
    const states = await conn.getStates(`${THEME_FOLDER}.*`);

    channels.clear();
    tokenValues.clear();
    Object.entries(objects || {}).forEach(([id, obj]) => applyChannel(id, obj));
    let hasActive = false;
    Object.entries(states || {}).forEach(([id, state]) => {
        if (id === THEME_ACTIVE_ID) {
            hasActive = true;
        }
        applyState(id, state);
    });
    if (!hasActive) {
        globalActive = '';
    }
    // Forget token values of ids without a channel (left-overs)
    [...tokenValues.keys()].forEach(id => !channels.has(id) && tokenValues.delete(id));
    ready = true;
    changed();

    await conn.subscribeState(`${THEME_FOLDER}.*`, onStateChange);
    try {
        await conn.subscribeObject(`${THEME_FOLDER}.*`, onObjectChange);
    } catch (error) {
        // Without object subscription new/deleted themes are seen after a reload only
        warn('Cannot subscribe to theme objects', error);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------------------------------------------------

function requireSocket(): Connection {
    if (!socket) {
        throw new Error('Theme store is not initialized');
    }
    return socket;
}

async function ensureBaseObjects(conn: Connection): Promise<void> {
    const folder = await conn.getObject(THEME_FOLDER);
    if (!folder) {
        await conn.setObject(THEME_FOLDER, {
            type: 'folder',
            common: { name: 'Themes' },
            native: {},
        });
    }
    const active = await conn.getObject(THEME_ACTIVE_ID);
    if (!active) {
        await conn.setObject(THEME_ACTIVE_ID, {
            type: 'state',
            common: {
                name: 'Active theme',
                type: 'string',
                role: 'text',
                read: true,
                write: true,
                def: '',
            },
            native: {},
        });
    }
}

function tokenObject(key: ThemeTokenKey, value: string | number): ioBroker.SettableObject {
    const def = getTokenDef(key)!;
    const common: Record<string, unknown> = {
        name: key,
        type: def.type === 'number' ? 'number' : 'string',
        role: def.type === 'number' ? 'level' : 'text',
        read: true,
        write: true,
        def: value,
    };
    if (def.type === 'number') {
        common.unit = 'px';
        common.min = def.min;
        common.max = def.max;
    }
    if (def.type === 'select' && def.options) {
        common.states = Object.fromEntries(def.options.map(option => [option, option]));
    }
    return { type: 'state', common, native: {} } as unknown as ioBroker.SettableObject;
}

function nextOrder(): number {
    let max = -1;
    channels.forEach(raw => (max = Math.max(max, raw.order)));
    return max + 1;
}

/** Store API: a module singleton shared by all widgets and editor components */
export const themeStore = {
    /** Idempotent. Loads objects+states, subscribes `vis-2-widgets-inventwo.0.themes.*` (states) and the objects of the folder. */
    init(conn: Connection): Promise<void> {
        if (!conn) {
            return Promise.resolve();
        }
        if (initPromise && socket === conn) {
            return initPromise;
        }
        if (socket && socket !== conn) {
            try {
                socket.unsubscribeState(`${THEME_FOLDER}.*`, onStateChange);
                void socket.unsubscribeObject(`${THEME_FOLDER}.*`, onObjectChange).catch(() => {});
            } catch {
                // ignore
            }
        }
        socket = conn;
        initPromise = load(conn).catch((error: unknown) => {
            warn('Cannot load themes', error);
            // Allow a new attempt by the next widget
            if (socket === conn) {
                initPromise = null;
            }
        });
        return initPromise;
    },

    /** True when the themes were loaded from the server (the cache may provide themes before) */
    isReady(): boolean {
        return ready;
    },

    /** All themes, sorted by order and name */
    getThemes(): ThemeInfo[] {
        return buildThemes();
    },

    getTheme(id: string): ThemeInfo | undefined {
        if (!id) {
            return undefined;
        }
        return buildThemes().find(theme => theme.id === id);
    },

    /** Effective active theme id: device override (localStorage) if set and existing, else global state */
    getActiveId(): string {
        return effectiveActiveId();
    },

    getGlobalActiveId(): string {
        return globalActive;
    },

    /** '' = follow global */
    getDeviceActiveId(): string {
        return deviceActive();
    },

    /** '' -> undefined (not coupled), '*' -> active theme, else that theme. */
    resolve(ref: string | undefined | null): ThemeInfo | undefined {
        if (!ref || typeof ref !== 'string') {
            return undefined;
        }
        return this.getTheme(ref === '*' ? effectiveActiveId() : ref);
    },

    /** Listener for any change (debounced ~30 ms). Returns unsubscribe. */
    subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => {
            listeners.delete(listener);
        };
    },

    /** global: writes themes.active; device: localStorage ('' clears) */
    async setActive(id: string, scope: ThemeScope): Promise<void> {
        const value = id || '';
        if (value) {
            assertThemeId(value);
        }
        if (scope === 'device') {
            storageSet(DEVICE_KEY, value || null);
            changed();
            return;
        }
        const conn = requireSocket();
        await ensureBaseObjects(conn);
        await conn.setState(THEME_ACTIVE_ID, value, false);
        if (globalActive !== value) {
            globalActive = value;
            changed();
        }
    },

    /** Writes the state of one token (ack false) */
    async setToken(id: string, key: ThemeTokenKey, value: string | number): Promise<void> {
        assertThemeId(id);
        const clean = sanitizeTokenValue(key, value);
        if (clean === undefined) {
            throw new Error(`Invalid value for ${key}`);
        }
        const conn = requireSocket();
        const stateId = `${THEME_FOLDER}.${id}.${key}`;
        const values = tokenValues.get(id) || {};
        const had = Object.prototype.hasOwnProperty.call(values, key);
        const previous = values[key];
        // Optimistic: the editor shows the change at once
        values[key] = clean;
        tokenValues.set(id, values);
        changed();
        try {
            const obj = await conn.getObject(stateId);
            if (!obj) {
                await conn.setObject(stateId, tokenObject(key, clean));
            }
            await conn.setState(stateId, clean, false);
        } catch (error) {
            const current = tokenValues.get(id) || {};
            if (current[key] === clean) {
                if (had && previous !== undefined) {
                    current[key] = previous;
                } else {
                    delete current[key];
                }
                tokenValues.set(id, current);
                changed();
            }
            throw error;
        }
    },

    /** Writes the original values of a built-in theme back; the name stays. Only differing values are written. */
    async resetBuiltinTheme(id: string): Promise<void> {
        const builtin = BUILTIN_THEMES.find(theme => theme.id === id);
        const theme = this.getTheme(id);
        if (!builtin || !theme) {
            throw new Error(`"${id}" is not a built-in theme`);
        }
        for (const def of THEME_TOKENS) {
            const original = builtin.tokens[def.key];
            if (String(theme.tokens[def.key]) !== String(original)) {
                await this.setToken(id, def.key, original);
            }
        }
    },

    /** Creates channel + all states, returns the id */
    async createTheme(name: string, tokens?: Partial<ThemeTokens>, id?: string): Promise<string> {
        const conn = requireSocket();
        const displayName = cleanName(name, 'Theme');
        const existing = [...channels.keys()];
        const themeId = id && isValidThemeId(id) && !channels.has(id) ? id : themeIdFromName(displayName, existing);
        const given: Partial<ThemeTokens> = {};
        if (tokens) {
            THEME_TOKENS.forEach(def => {
                const value = sanitizeTokenValue(def.key, tokens[def.key]);
                if (value !== undefined) {
                    given[def.key] = value;
                }
            });
        }
        // e.g. an imported file from an older version without `icon`
        const values = completeTokens(given);
        const order = nextOrder();

        await ensureBaseObjects(conn);
        await conn.setObject(`${THEME_FOLDER}.${themeId}`, {
            type: 'channel',
            common: { name: displayName },
            native: { order },
        });
        for (const def of THEME_TOKENS) {
            const stateId = `${THEME_FOLDER}.${themeId}.${def.key}`;
            await conn.setObject(stateId, tokenObject(def.key, values[def.key]));
            await conn.setState(stateId, values[def.key], true);
        }

        channels.set(themeId, { name: displayName, order });
        tokenValues.set(themeId, { ...values });
        changed();
        return themeId;
    },

    async renameTheme(id: string, name: string): Promise<void> {
        const conn = requireSocket();
        const channelId = `${THEME_FOLDER}.${id}`;
        const obj = await conn.getObject(channelId);
        if (!obj || obj.type !== 'channel') {
            throw new Error(`Theme "${id}" does not exist`);
        }
        const displayName = cleanName(name, id);
        obj.common = { ...obj.common, name: displayName };
        await conn.setObject(channelId, obj);
        const raw = channels.get(id);
        if (raw && raw.name !== displayName) {
            channels.set(id, { ...raw, name: displayName });
            changed();
        }
    },

    /**
     * Removes a theme. The web socket of vis-2 may not delete objects (delObject/delObjects are admin commands), so
     * the channel is flagged with `native.deleted` and ignored from then on. Creating a theme with the same id
     * overwrites the flag and all values.
     */
    async deleteTheme(id: string): Promise<void> {
        assertThemeId(id);
        const conn = requireSocket();
        const channelId = `${THEME_FOLDER}.${id}`;
        const obj = await conn.getObject(channelId);
        if (obj && obj.type === 'channel') {
            obj.native = { ...obj.native, deleted: true };
            await conn.setObject(channelId, obj);
        }
        channels.delete(id);
        tokenValues.delete(id);
        if (deviceActive() === id) {
            storageSet(DEVICE_KEY, null);
        }
        changed();
        if (globalActive === id) {
            const next = buildThemes()[0]?.id || '';
            await this.setActive(next, 'global');
        }
    },

    async duplicateTheme(id: string, name: string): Promise<string> {
        const source = this.getTheme(id);
        if (!source) {
            throw new Error(`Theme "${id}" does not exist`);
        }
        return this.createTheme(name, { ...source.tokens });
    },

    /** Creates BUILTIN_THEMES that do not exist; sets active to 'dark' if none */
    async seedBuiltinThemes(): Promise<void> {
        const conn = requireSocket();
        if (initPromise) {
            await initPromise;
        }
        if (!ready) {
            // Without the current state of the server, existing themes could be overwritten
            throw new Error('Themes could not be loaded');
        }
        await ensureBaseObjects(conn);
        for (const theme of BUILTIN_THEMES) {
            if (!channels.has(theme.id)) {
                await this.createTheme(theme.name, theme.tokens, theme.id);
            }
        }
        if (!globalActive || !channels.has(globalActive)) {
            await this.setActive('dark', 'global');
        }
    },
};

// ---------------------------------------------------------------------------------------------------------------------
// Module init: the cache gives the first render its tokens before the server answered
// ---------------------------------------------------------------------------------------------------------------------

loadCache();
writeCssVariables();

if (typeof window !== 'undefined') {
    // Device override changed in another tab
    window.addEventListener('storage', event => {
        if (event.key === DEVICE_KEY) {
            changed();
        }
    });
}
