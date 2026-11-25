import type { Connection } from '@iobroker/gui-components';

import { type DesignData, type DesignGroup, sanitizeDesign } from './designFields';

/** File storage of the adapter instance; created as `meta.user` object (see `instanceObjects` in io-package.json) */
export const PRESET_NAMESPACE = 'vis-2-widgets-inventwo.0';
export const PRESET_FILE = 'design-presets.json';
/** Identifies files written by this adapter, both the storage file and exported files */
export const PRESET_FORMAT = 'inventwo-design-presets';
export const PRESET_FORMAT_VERSION = 1;

const MAX_NAME_LENGTH = 100;
/** Limits for files from outside, so a broken or hostile file cannot block the editor or flood the server */
export const MAX_IMPORT_FILE_SIZE = 1024 * 1024;
const MAX_PRESETS = 500;
/** Upper bound for a thumbnail data URL (about 150 KB of PNG) */
export const MAX_THUMBNAIL_LENGTH = 200_000;
const THUMBNAIL_PREFIX = 'data:image/png;base64,';

/** Accepts only small PNG data URLs; anything else (other schemes, SVG with scripts, huge strings) is dropped */
export function sanitizeThumbnail(value: unknown): string | undefined {
    return typeof value === 'string' &&
        value.startsWith(THUMBNAIL_PREFIX) &&
        value.length <= MAX_THUMBNAIL_LENGTH &&
        /^[A-Za-z0-9+/=]*$/.test(value.substring(THUMBNAIL_PREFIX.length))
        ? value
        : undefined;
}

const ISO_TIME = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/;

export interface DesignPreset {
    /** Name given by the user; unique per widget type */
    name: string;
    /** Widget type the preset belongs to, e.g. `tplInventwoWidgetUniversal` */
    widget: string;
    /** `DesignSpec.version` at the time the preset was saved */
    designVersion: number;
    /** ISO time of the last save */
    saved: string;
    design: DesignData;
    /** Small picture of the widget at the time of saving, a `data:image/png;base64,…` URL */
    thumbnail?: string;
    /**
     * Set only in memory for presets shipped with the adapter (`builtin/presets.json`). They are read-only, their
     * names are reserved, and the flag is never written into the storage file or an export file.
     */
    builtin?: boolean;
}

export interface PresetFile {
    format: typeof PRESET_FORMAT;
    version: number;
    presets: DesignPreset[];
}

/** Creates the meta object of the file storage if the instance was installed before it was part of io-package.json */
async function ensureMetaObject(socket: Connection): Promise<void> {
    const obj = await socket.getObject(PRESET_NAMESPACE);
    if (!obj) {
        await socket.setObject(PRESET_NAMESPACE, {
            type: 'meta',
            common: { name: 'inventwo design presets', type: 'meta.user' },
            native: {},
        });
    }
}

function fileText(result: unknown): string {
    if (typeof result === 'string') {
        return result;
    }
    if (result && typeof result === 'object' && 'file' in result) {
        const file = result.file;
        if (typeof file === 'string') {
            return file;
        }
        if (file instanceof ArrayBuffer || ArrayBuffer.isView(file)) {
            return new TextDecoder().decode(file);
        }
        // A Node.js buffer serialized to JSON
        if (file && typeof file === 'object' && Array.isArray((file as { data?: unknown }).data)) {
            return new TextDecoder().decode(new Uint8Array((file as { data: number[] }).data));
        }
    }
    throw new Error('Unexpected file content');
}

/** Removes duplicate names; the last one wins, as it was saved or imported last */
function uniqueByName(presets: DesignPreset[]): DesignPreset[] {
    return [...new Map(presets.map(p => [p.name, p])).values()];
}

/** Name as it is stored: trimmed and limited in length */
function cleanName(name: string): string {
    return name.trim().substring(0, MAX_NAME_LENGTH);
}

/** Key for name comparisons with built-in presets, whose names are reserved regardless of case */
export function nameKey(name: string): string {
    return cleanName(name).toLowerCase();
}

/** Copy without the in-memory `builtin` flag, as it is written into a file */
function toStored(preset: DesignPreset): DesignPreset {
    const stored = { ...preset };
    delete stored.builtin;
    return stored;
}

/**
 * Parses a preset file (storage or export) and keeps only valid presets of the given widget type with their design
 * attributes. Everything else is dropped silently: shared files are not trusted.
 */
export function parsePresetFile(text: string, widget: string, groups: DesignGroup[]): DesignPreset[] | null {
    let json: unknown;
    try {
        json = JSON.parse(text);
    } catch {
        return null;
    }
    return parsePresetData(json, widget, groups);
}

/** Like `parsePresetFile`, for an already parsed file */
export function parsePresetData(json: unknown, widget: string, groups: DesignGroup[]): DesignPreset[] | null {
    if (!json || typeof json !== 'object' || (json as PresetFile).format !== PRESET_FORMAT) {
        return null;
    }
    const presets = (json as PresetFile).presets;
    if (!Array.isArray(presets)) {
        return null;
    }
    const result: DesignPreset[] = [];
    presets.slice(0, MAX_PRESETS).forEach((raw: unknown) => {
        if (!raw || typeof raw !== 'object') {
            return;
        }
        const preset = raw as Partial<DesignPreset>;
        if (preset.widget !== widget || typeof preset.name !== 'string') {
            return;
        }
        const name = cleanName(preset.name);
        if (!name) {
            return;
        }
        const design = sanitizeDesign(groups, preset.design);
        if (!Object.keys(design).length) {
            return;
        }
        result.push({
            name,
            widget,
            designVersion: typeof preset.designVersion === 'number' ? preset.designVersion : 1,
            saved:
                typeof preset.saved === 'string' && ISO_TIME.test(preset.saved)
                    ? preset.saved
                    : new Date().toISOString(),
            design,
            thumbnail: sanitizeThumbnail(preset.thumbnail),
        });
    });
    return uniqueByName(result);
}

/**
 * Reads the raw storage file with the presets of all widget types. Only a missing file counts as empty; every other
 * problem throws, so a failed read never leads to a write that would drop the existing presets.
 */
async function readAll(socket: Connection): Promise<DesignPreset[]> {
    const exists = await socket.fileExists(PRESET_NAMESPACE, PRESET_FILE);
    if (!exists) {
        return [];
    }
    const json = JSON.parse(fileText(await socket.readFile(PRESET_NAMESPACE, PRESET_FILE))) as PresetFile;
    if (json?.format !== PRESET_FORMAT || !Array.isArray(json.presets)) {
        throw new Error(`${PRESET_FILE} has an unknown format`);
    }
    return json.presets;
}

async function writeAll(socket: Connection, presets: DesignPreset[]): Promise<void> {
    await ensureMetaObject(socket);
    const file: PresetFile = {
        format: PRESET_FORMAT,
        version: PRESET_FORMAT_VERSION,
        presets: presets.filter(p => !p.builtin).map(toStored),
    };
    const bytes = new TextEncoder().encode(JSON.stringify(file, null, 2));
    await socket.writeFile64(PRESET_NAMESPACE, PRESET_FILE, bytes.buffer);
}

/** Content of `builtin/presets.json`; a dynamic import, so it is an own chunk loaded only when presets are shown */
let builtinFile: Promise<unknown> | null = null;
/** Validated built-in presets per widget type */
const builtinCache = new Map<string, DesignPreset[]>();

function loadBuiltinFile(): Promise<unknown> {
    builtinFile ??= import('./builtin/presets.json').then(
        module => (module as { default: unknown }).default,
        (error: unknown) => {
            // Allow a new attempt, e.g. after a network problem
            builtinFile = null;
            throw error;
        },
    );
    return builtinFile;
}

/**
 * Presets of one widget type shipped with the adapter, in file order and marked with `builtin: true`. They pass the
 * same validation as user files, so only whitelisted design attributes of the type are used.
 */
export async function loadBuiltinPresets(widget: string, groups: DesignGroup[]): Promise<DesignPreset[]> {
    const cached = builtinCache.get(widget);
    if (cached) {
        return cached;
    }
    const presets = (parsePresetData(await loadBuiltinFile(), widget, groups) ?? []).map(p => ({
        ...p,
        builtin: true,
    }));
    builtinCache.set(widget, presets);
    return presets;
}

/** Reserved names (as `nameKey`) of the built-in presets of one widget type, read without the design validation */
async function builtinNameKeys(widget: string): Promise<Set<string>> {
    const json = await loadBuiltinFile();
    const presets: unknown = json && typeof json === 'object' ? (json as PresetFile).presets : null;
    const keys = new Set<string>();
    if (Array.isArray(presets)) {
        presets.forEach((raw: unknown) => {
            const preset = raw as Partial<DesignPreset> | null;
            if (preset && preset.widget === widget && typeof preset.name === 'string') {
                keys.add(nameKey(preset.name));
            }
        });
    }
    return keys;
}

/** True if the name is reserved by a built-in preset of the widget type (compared trimmed and case-insensitive) */
export async function isBuiltinName(widget: string, name: string): Promise<boolean> {
    return (await builtinNameKeys(widget)).has(nameKey(name));
}

/** Loads the presets of one widget type saved by the user, sorted by name */
export async function loadUserPresets(
    socket: Connection,
    widget: string,
    groups: DesignGroup[],
): Promise<DesignPreset[]> {
    const own = parsePresetData(
        { format: PRESET_FORMAT, version: PRESET_FORMAT_VERSION, presets: await readAll(socket) },
        widget,
        groups,
    );
    return (own ?? []).sort((a, b) => a.name.localeCompare(b.name));
}

export interface PresetList {
    /** Built-in presets first (in file order), then the user's presets (sorted by name) */
    presets: DesignPreset[];
    /** Set if the user's presets (or the built-in ones) could not be loaded; everything else is listed anyway */
    error: Error | null;
}

/** Loads the built-in and the user's presets of one widget type; never throws */
export async function loadPresets(socket: Connection, widget: string, groups: DesignGroup[]): Promise<PresetList> {
    const [builtin, user] = await Promise.allSettled([
        loadBuiltinPresets(widget, groups),
        loadUserPresets(socket, widget, groups),
    ]);
    const presets = [
        ...(builtin.status === 'fulfilled' ? builtin.value : []),
        ...(user.status === 'fulfilled' ? user.value : []),
    ];
    const failed = user.status === 'rejected' ? user : builtin.status === 'rejected' ? builtin : null;
    const error = failed ? (failed.reason instanceof Error ? failed.reason : new Error(String(failed.reason))) : null;
    return { presets, error };
}

/**
 * Renames presets whose name is reserved by a built-in preset to the first free name with a suffix like " (2)".
 * Used for imports, so a file can never replace a built-in preset. Names in `taken` (and of the other presets) are
 * not used for the new names either, so no existing preset is overwritten by a renamed one.
 */
export async function renameReserved(
    widget: string,
    presets: DesignPreset[],
    taken: string[] = [],
): Promise<DesignPreset[]> {
    const reserved = await builtinNameKeys(widget);
    const used = new Set([...reserved, ...taken.map(nameKey), ...presets.map(p => nameKey(p.name))]);
    return presets.map(preset => {
        if (!reserved.has(nameKey(preset.name))) {
            return preset;
        }
        let name = preset.name;
        for (let i = 2; used.has(nameKey(name)); i++) {
            const suffix = ` (${i})`;
            name = `${preset.name.substring(0, MAX_NAME_LENGTH - suffix.length).trim()}${suffix}`;
        }
        used.add(nameKey(name));
        return { ...preset, name };
    });
}

/**
 * Adds or replaces the user's presets (same widget type and name) and removes the ones named in `remove`. The file
 * is read again right before writing, so presets saved meanwhile in another editor are kept. Only the storage file
 * is changed: built-in presets are never written, and a preset with the name of a built-in preset is refused.
 */
export async function updatePresets(
    socket: Connection,
    widget: string,
    upsert: DesignPreset[],
    remove: string[] = [],
): Promise<void> {
    const added = uniqueByName(upsert.filter(p => !p.builtin).map(toStored));
    if (added.length) {
        const reserved = await builtinNameKeys(widget);
        const clash = added.find(p => reserved.has(nameKey(p.name)));
        if (clash) {
            throw new Error(`"${clash.name}" is reserved by a built-in preset`);
        }
    }
    const all = await readAll(socket);
    const replaced = new Set([...added.map(p => p.name), ...remove]);
    const kept = all.filter(p => p.widget !== widget || !replaced.has(p.name));
    await writeAll(socket, [...kept, ...added]);
}

export function createPreset(
    name: string,
    widget: string,
    designVersion: number,
    design: DesignData,
    thumbnail?: string,
): DesignPreset {
    return {
        name: cleanName(name),
        widget,
        designVersion,
        saved: new Date().toISOString(),
        design,
        thumbnail: sanitizeThumbnail(thumbnail),
    };
}

/** Text of an export file; built-in presets can be exported too, but without the `builtin` flag */
export function serializePresets(presets: DesignPreset[]): string {
    const file: PresetFile = { format: PRESET_FORMAT, version: PRESET_FORMAT_VERSION, presets: presets.map(toStored) };
    return JSON.stringify(file, null, 2);
}
