import type { RxWidgetInfo, RxWidgetInfoGroup } from '@iobroker/types-vis-2';

/** A value of a design attribute as it is stored in a preset; `null` means "not set" (removes the value on apply) */
export type DesignValue = string | number | boolean | null;
export type DesignData = Record<string, DesignValue>;

/**
 * Which attributes of a widget type belong to its design.
 *
 * `groups` maps the name of an attribute group (`visAttrs[].name`) to either `true` (every field of the group) or a
 * list of field names. Fields of the types `help`, `delimiter`, `custom` and `widget` are never taken, the
 * `…FromWidget` field of a group is only used to resolve the effective values.
 */
export interface DesignSpec {
    /** Version of the design attribute set; raise it when attributes are renamed so old presets can be migrated */
    readonly version: number;
    readonly groups: Readonly<Record<string, true | readonly string[]>>;
    /**
     * Groups without an own "From widget" field that follow the one of another group, e.g. the additional shadow
     * layers follow `outerShadowStyleFromWidget`. Maps the group name to that (not indexed) field.
     */
    readonly fromWidgetOf?: Readonly<Record<string, string>>;
}

/** Field types that never hold a design value */
const SKIPPED_TYPES = new Set(['help', 'delimiter', 'custom', 'widget']);

/** Highest index accepted for indexed groups (states, shadow layers) when a file is imported */
export const MAX_GROUP_INDEX = 100;
/** Longest string value taken over; long enough for gradients and custom shape paths */
const MAX_VALUE_LENGTH = 2000;
/** Index suffix of an indexed attribute, without leading zeros */
const INDEX_SUFFIX = /^[1-9]\d*$/;

/** A group resolved against the spec: its design fields, its "From widget" field and its index range */
export interface DesignGroup {
    readonly name: string;
    readonly fields: readonly string[];
    readonly fromWidgetField?: string;
    /** True if the "From widget" field carries the index too (`stateColorsStyleFromWidget3`) */
    readonly fromWidgetIndexed?: boolean;
    readonly indexFrom?: number;
    /** Name of the attribute that holds the last index */
    readonly indexTo?: string;
}

export function getDesignGroups(info: RxWidgetInfo, spec: DesignSpec): DesignGroup[] {
    const result: DesignGroup[] = [];
    info.visAttrs.forEach((group: RxWidgetInfoGroup) => {
        const selection = spec.groups[group.name];
        if (!selection) {
            return;
        }
        let fromWidgetField: string | undefined;
        const fields: string[] = [];
        group.fields.forEach(field => {
            const name = field.name;
            const type = (field as { type?: string }).type;
            if (!name) {
                return;
            }
            if (type === 'widget' && name.endsWith('FromWidget')) {
                fromWidgetField = name;
                return;
            }
            if (!type || SKIPPED_TYPES.has(type)) {
                return;
            }
            if (selection === true || selection.includes(name)) {
                fields.push(name);
            }
        });
        if (!fields.length) {
            return;
        }
        const indexTo = typeof group.indexTo === 'string' ? group.indexTo : undefined;
        const sharedFromWidget = spec.fromWidgetOf?.[group.name];
        result.push({
            name: group.name,
            fields,
            fromWidgetField: sharedFromWidget ?? fromWidgetField,
            fromWidgetIndexed: !sharedFromWidget && !!indexTo && !!fromWidgetField,
            indexFrom: indexTo ? (group.indexFrom ?? 1) : undefined,
            indexTo,
        });
    });
    return result;
}

/** A binding like `{oid}` or `{v:oid;...}` refers to a datapoint and is therefore not part of a design */
export function isBinding(value: unknown): boolean {
    return typeof value === 'string' && /\{[^{}]+\}/.test(value);
}

function toDesignValue(value: unknown): DesignValue | undefined {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    if (typeof value === 'string') {
        return isBinding(value) || value.length > MAX_VALUE_LENGTH ? undefined : value;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    return undefined;
}

/** Finds the data of a widget in any view of the project (same lookup as `InventwoGeneric.getStyle`) */
type ProjectLike = Record<string, unknown>;

function findWidgetData(project: ProjectLike | undefined, wid: unknown): Record<string, unknown> | undefined {
    if (!project || typeof wid !== 'string' || !wid) {
        return undefined;
    }
    for (const viewName of Object.keys(project)) {
        if (viewName === '___settings') {
            continue;
        }
        const view = project[viewName] as { widgets?: Record<string, { data?: Record<string, unknown> }> } | undefined;
        const data = view?.widgets?.[wid]?.data;
        if (data) {
            return data;
        }
    }
    return undefined;
}

function indexRange(group: DesignGroup, data: Record<string, unknown>): number[] {
    if (!group.indexTo) {
        return [];
    }
    const raw = data[group.indexTo];
    const parsed = typeof raw === 'number' ? raw : typeof raw === 'string' ? parseInt(raw, 10) : 0;
    const count = Math.min(Number.isFinite(parsed) ? parsed : 0, MAX_GROUP_INDEX);
    const from = group.indexFrom ?? 1;
    const result: number[] = [];
    for (let i = from; i <= count; i++) {
        result.push(i);
    }
    return result;
}

/**
 * Reads the design of a widget. Where a group takes its style from another widget ("From widget"), the values of
 * that widget are used, so the preset holds what the widget actually looks like.
 *
 * Index ranges are taken from the widget's own data: the counters of shadow layers are design fields and thus
 * resolved first; the number of states belongs to the function and is never part of the preset.
 */
export function extractDesign(
    info: RxWidgetInfo,
    spec: DesignSpec,
    data: Record<string, unknown>,
    project?: ProjectLike,
): DesignData {
    const groups = getDesignGroups(info, spec);
    const result: DesignData = {};

    const take = (source: Record<string, unknown>, key: string): void => {
        const value = toDesignValue(source[key]);
        if (value !== undefined) {
            result[key] = value;
        }
    };

    // Plain groups first: they include the counters (e.g. `outerShadowExtraCount`) of the indexed groups
    groups
        .filter(group => !group.indexTo)
        .forEach(group => {
            const ref = group.fromWidgetField ? findWidgetData(project, data[group.fromWidgetField]) : undefined;
            group.fields.forEach(field => take(ref ?? data, field));
        });

    groups
        .filter(group => group.indexTo)
        .forEach(group => {
            // Shadow layers follow their counter as stored in the preset; states follow the widget's own count
            const counterSource = group.indexTo! in result ? (result as Record<string, unknown>) : data;
            indexRange(group, counterSource).forEach(index => {
                const refField = group.fromWidgetIndexed ? `${group.fromWidgetField}${index}` : group.fromWidgetField;
                const ref = refField ? findWidgetData(project, data[refField]) : undefined;
                group.fields.forEach(field => take(ref ?? data, `${field}${index}`));
            });
        });

    return result;
}

/** Returns true if `key` is a design attribute of the spec (indexed keys like `background3` included) */
export function isDesignKey(groups: DesignGroup[], key: string): boolean {
    return groups.some(group => {
        if (!group.indexTo) {
            return group.fields.includes(key);
        }
        return group.fields.some(field => {
            if (!key.startsWith(field)) {
                return false;
            }
            const rest = key.substring(field.length);
            if (!INDEX_SUFFIX.test(rest)) {
                return false;
            }
            const index = parseInt(rest, 10);
            return index >= (group.indexFrom ?? 1) && index <= MAX_GROUP_INDEX;
        });
    });
}

/** Attributes a basic setup must never set: datapoints, passwords, addresses, view references and scripts */
const SETUP_FORBIDDEN = /oid|password|pin|url|script|^view|^(bindings|signals|lc|visibility)/i;
const SETUP_KEY = /^[A-Za-z][A-Za-z0-9_]*$/;

/**
 * Basic setup of a built-in preset (e.g. widget type, mode, content type, value range): plain values of harmless
 * attributes only. User presets never carry a setup.
 */
export function sanitizeSetup(raw: unknown): DesignData {
    const result: DesignData = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return result;
    }
    Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
        if (!SETUP_KEY.test(key) || SETUP_FORBIDDEN.test(key)) {
            return;
        }
        const setupValue = toDesignValue(value);
        if (setupValue !== undefined && setupValue !== null) {
            result[key] = setupValue;
        }
    });
    return result;
}

/** Keeps only design attributes with plain values; used for everything that comes from outside (import, clipboard) */
export function sanitizeDesign(groups: DesignGroup[], raw: unknown): DesignData {
    const result: DesignData = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return result;
    }
    Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
        if (!isDesignKey(groups, key)) {
            return;
        }
        if (value === null) {
            result[key] = null;
            return;
        }
        const designValue = toDesignValue(value);
        if (designValue !== undefined) {
            result[key] = designValue;
        }
    });
    return result;
}

/**
 * Builds the change set for `onDataChange`: the preset values plus `null` for the "From widget" references of the
 * design groups, so that the preset's look takes effect instead of the referenced widget's. For indexed groups only
 * the indices the preset has values for are released; other states keep their reference. vis-2 applies the change
 * set to every selected widget and removes attributes that are `null`.
 */
export function buildApplyPatch(groups: DesignGroup[], design: DesignData): DesignData {
    const patch: DesignData = { ...design };
    groups.forEach(group => {
        if (!group.fromWidgetField) {
            return;
        }
        if (!group.fromWidgetIndexed) {
            patch[group.fromWidgetField] = null;
            return;
        }
        const indices = new Set<string>();
        Object.keys(design).forEach(key => {
            group.fields.forEach(field => {
                const rest = key.startsWith(field) ? key.substring(field.length) : '';
                if (INDEX_SUFFIX.test(rest)) {
                    indices.add(rest);
                }
            });
        });
        indices.forEach(index => {
            patch[`${group.fromWidgetField}${index}`] = null;
        });
    });
    return patch;
}
