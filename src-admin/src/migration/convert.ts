/**
 * Conversion of the old inventwo vis-1 widgets (tpl `i-vis-*`, adapter vis-inventwo)
 * to the vis-2 widgets of this adapter (`tplInventwoWidget*`).
 *
 * Idea, report structure (converted / partial / skipped), the path fix and the mappings of table and slider are
 * based on the community tool "inventwo-vis1-to-vis2" by crunchip77
 * (https://github.com/crunchip77/inventwo-vis1-to-vis2, MIT License, Copyright (c) 2026).
 * The mapping of the universal, multi and radio button widgets was rewritten against the attribute definitions of
 * vis-inventwo (widgets/vis-inventwo.html) and of the vis-2 universal widget.
 *
 * This module is pure: no file access, no socket, no React. The input is never changed.
 */

/** `data` of a vis-1 widget – the field names are not typed */
type OldData = Record<string, any>;
type NewData = Record<string, any>;

export interface VisWidget {
    tpl?: string;
    widgetSet?: string;
    data?: OldData;
    style?: Record<string, unknown> & { bindings?: unknown[] };
    [key: string]: unknown;
}

export interface VisView {
    widgets?: Record<string, VisWidget>;
    [key: string]: unknown;
}

export type VisProject = Record<string, VisView>;

/** Hint for the user: translation key (without prefix) and the values for the `%s` placeholders */
export interface MigrationNote {
    key: string;
    args?: (string | number)[];
}

export type MigrationQuality = 'full' | 'partial';

interface ConvertedEntry {
    skipped?: false;
    widget: VisWidget;
    mapping: string;
    quality: MigrationQuality;
    notes: MigrationNote[];
}

interface SkippedEntry {
    skipped: true;
    widget: VisWidget;
    /** Old universal/multi subtype, if any */
    subType: string;
}

export type ConvertResult = ConvertedEntry | SkippedEntry;

export interface MigrationReportPartial {
    wid: string;
    view: string;
    mapping: string;
    notes: MigrationNote[];
}

export interface MigrationReportSkipped {
    wid: string;
    view: string;
    tpl: string;
    subType: string;
}

export interface MigrationReport {
    /** Number of converted widgets (full + partial) */
    converted: number;
    /** Converted widgets that must be checked manually */
    partial: MigrationReportPartial[];
    /** Old widgets that could not be converted and were left untouched */
    skipped: MigrationReportSkipped[];
    /** Number of converted widgets by mapping, e.g. `universal:switch` */
    byMapping: Record<string, number>;
    /** Number of `i-vis-*` widgets that are still in the project after the migration */
    remainingOldTpl: number;
    viewsTouched: string[];
}

const WIDGET_SET = 'vis-2-widgets-inventwo';

/**
 * The attribute groups of the vis-2 widgets. The vis-2 editor has a check box per group (`g_<group>` in the widget
 * data): the attributes of a group that is not checked are not passed to the widget, so the converted values would
 * have no effect. `indexed`: groups that exist once per index (`g_<group>-<index>`), with the attribute that holds
 * the count. Must be kept in sync with `getWidgetInfo()` of the widgets.
 */
const WIDGET_GROUPS: Record<string, { groups: string[]; indexed?: [string, string][] }> = {
    tplInventwoWidgetUniversal: {
        groups: [
            'common',
            'attr_group_type_view_in_dialog',
            'attr_group_click_feedback',
            'attr_group_state_default',
            'attr_content_color_picker',
            'attr_content_analog_clock',
            'attr_group_css_text',
            'attr_group_css_content',
            'attr_group_css_alignment',
            'attr_group_css_transparency',
            'attr_group_css_spacing',
            'attr_group_css_border_radius',
            'attr_group_css_border',
            'attr_group_css_outer_shadow',
            'attr_group_css_inner_shadow',
            'attr_group_css_shape',
        ],
        indexed: [['countStates', 'countStates']],
    },
    tplInventwoWidgetTable: {
        groups: [
            'common',
            'attr_group_sorting',
            'attr_group_row_color_conditions',
            'attr_content_css_table',
            'attr_group_css_border_radius',
            'attr_group_css_border',
            'attr_group_css_outer_shadow',
        ],
        indexed: [['countColumns', 'countColumns']],
    },
    tplInventwoWidgetSlider: {
        groups: ['common', 'attr_group_css_slider_track', 'attr_group_css_slider_slider_thumb'],
    },
    tplInventwoWidgetCheckbox: { groups: ['common', 'attr_group_css_style'] },
    tplInventwoWidgetSwitch: { groups: ['common', 'attr_group_css_track', 'attr_group_css_thumb'] },
    tplInventwoWidgetValueList: { groups: ['common', 'attr_group_valuelist_style'] },
    tplInventwoWidgetMarquee: { groups: ['common'] },
};

/** Checks all attribute groups of the widget, so that the converted values take effect */
function enableGroups(tpl: string, data: NewData): void {
    const definition = WIDGET_GROUPS[tpl];
    if (!definition) {
        return;
    }
    definition.groups.forEach(group => {
        data[`g_${group}`] = true;
    });
    (definition.indexed || []).forEach(([group, countAttr]) => {
        const count = Number(data[countAttr]) || 0;
        for (let i = 1; i <= count; i++) {
            data[`g_${group}-${i}`] = true;
        }
    });
}

/**
 * Fields of vis itself, which every widget has and which are used identically by vis-1 and vis-2: visibility,
 * signals, last change, gestures, and `multi-views` (the other views in which the widget is shown too).
 */
const GENERIC_DATA_KEYS =
    /^(g_|visibility-|signals-|lc-|gestures-|name$|comment$|class$|filterkey$|locked$|bindings$|multi-views$)/;

/** vis-1 iValueComparison → vis-2 comparisonOperator */
const COMPARISON_MAP: Record<string, string> = {
    equal: '===',
    not: '!=',
    greater: '>',
    lower: '<',
    greaterEqual: '>=',
    lowerEqual: '<=',
};

/** vis-1 iCheckType (multi widget) → vis-2 compareBy */
const CHECK_TYPE_MAP: Record<string, string> = {
    iCheckDefault: 'default',
    iCheckDpValue: 'value',
    iCheckView: 'view',
};

/** vis-1 iUniversalWidgetType → vis-2 type */
const UNIVERSAL_TYPE_MAP: Record<string, string> = {
    Switch: 'switch',
    State: 'button',
    Navigation: 'nav',
    Background: 'readonly',
    IncreaseDecreaseValue: 'increaseDecreaseValue',
    ViewInPopup: 'viewInDialog',
    HTTP: 'http',
};

const HTTP_TYPE_MAP: Record<string, string> = {
    iSend: 'send',
    iOpenUrl: 'open',
    iOpenUrlNewTab: 'openNewTab',
};

/** vis-1 iContentVertAlign → vis-2 alignItems */
const ALIGN_ITEMS_MAP: Record<string, string> = {
    iStart: 'flex-start',
    iCenter: 'center',
    iEnd: 'flex-end',
    'iSpace-between': 'space-between',
};

/** vis-1 iTextAlign / iImgAlign → vis-2 textAlign / contentAlign */
const ALIGN_MAP: Record<string, string> = {
    iStart: 'start',
    iCenter: 'center',
    iEnd: 'end',
};

/** Border styles that exist in vis-2. `outset` does not exist there. */
const BORDER_STYLES = new Set(['none', 'dashed', 'dotted', 'double', 'groove', 'inset', 'ridge', 'solid']);

/** vis-1 clock face → vis-2 analogClockFaceDesign (rough assignment only) */
const CLOCK_FACE_MAP: Record<string, string> = {
    '01': 'classic',
    '02': 'modern',
    '03': 'minimal',
    '04': 'dashes',
};

const TABLE_FORMAT_MAP: Record<string, string> = {
    normal: 'text',
    number: 'number',
    boolean: 'boolean',
    datetime: 'datetime',
    image: 'image',
};

/** vis-1 iColorPickerFormat → vis-2 colorPickerColorModel */
const COLOR_MODEL_MAP: Record<string, string> = {
    HEX: 'hex',
    'HEX 8': 'hex8',
    RGB: 'rgb',
    HSL: 'hsl',
    HSV: 'hsv',
    CIE: 'cie',
};

/** vis-1 iValueListStyle → vis-2 bulletType. "none" and the alphabetic styles do not exist in vis-2. */
const VALUE_LIST_BULLET_MAP: Record<string, string> = {
    disc: 'disc',
    circle: 'circle',
    square: 'square',
    decimal: 'number',
    'decimal-leading-zero': 'number',
};

function pickGenericData(old: OldData): NewData {
    const out: NewData = {};
    Object.keys(old).forEach(key => {
        if (GENERIC_DATA_KEYS.test(key)) {
            out[key] = old[key];
        }
    });
    return out;
}

function isSet(val: unknown): boolean {
    return val !== undefined && val !== null && val !== '';
}

/** "72px" → 72 – vis stores sizes often as string with px */
function parseNum(val: unknown, fallback: number): number {
    if (!isSet(val)) {
        return fallback;
    }
    const n = Number.parseFloat(String(val));
    return Number.isNaN(n) ? fallback : n;
}

function truth(val: unknown): boolean {
    return val === true || val === 'true' || val === '1' || val === 1;
}

/** First value that is set, as it is */
function first(...values: unknown[]): unknown {
    return values.find(isSet);
}

/** Copies `value` to `data[key]` only if it is set – so the vis-2 default stays active otherwise */
function setIf(data: NewData, key: string, value: unknown): void {
    if (isSet(value)) {
        data[key] = value;
    }
}

/** New widget: keeps everything of the old one (group membership, ...) except template, set, data and style */
function wrapWidget(tpl: string, data: NewData, widget: VisWidget, style?: Record<string, unknown>): VisWidget {
    enableGroups(tpl, data);
    return {
        ...widget,
        tpl,
        widgetSet: WIDGET_SET,
        data,
        style: { ...(widget.style || {}), ...(style || {}), bindings: widget.style?.bindings || [] },
    };
}

/** vis-1 iContentType → vis-2 contentType */
function mapContentType(old: OldData, notes: MigrationNote[]): string {
    switch (old.iContentType) {
        case 'clock_analog':
            return 'analogClock';
        case 'clock_digital':
            // There is no digital clock in vis-2
            notes.push({ key: 'migration_note_clock_digital' });
            return 'html';
        case 'html_text':
            return 'html';
        default:
            return 'image';
    }
}

function analogClockFromOld(old: OldData, notes: MigrationNote[]): NewData {
    const out: NewData = {
        analogClockFaceDesign: CLOCK_FACE_MAP[String(old.iImgClockFace || '01').padStart(2, '0')] || 'classic',
        // vis-1 default: border is shown
        analogClockShowRing: old.iImgClockShowBorder === undefined ? true : truth(old.iImgClockShowBorder),
        analogClockShowSecondHand: truth(old.iClockShowSeconds),
    };
    setIf(out, 'analogClockFaceColor', old.iImgColorClockFace);
    setIf(out, 'analogClockBackgroundColor', old.iButtonCol);
    setIf(out, 'analogClockHourHandColor', old.iImgColorHands);
    setIf(out, 'analogClockMinuteHandColor', old.iImgColorHands);
    setIf(out, 'analogClockSecondHandColor', old.iImgColorHandSecond);

    notes.push({ key: 'migration_note_clock_design' });
    if (isSet(old.iClockTimezone)) {
        notes.push({ key: 'migration_note_clock_timezone', args: [String(old.iClockTimezone)] });
    }
    return out;
}

/** The style group (`group.i-css`) of the vis-1 universal / multi / radio button widgets → vis-2 universal */
function styleFromOld(old: OldData): NewData {
    const out: NewData = {
        backgroundOpacity: parseNum(first(old.iOpacityBack, old.iOpacity), 1),
        contentOpacity: parseNum(old.iOpacityCtn, 1),

        borderRadiusTopLeft: parseNum(old.iCornerRadiusUL, 12),
        borderRadiusTopRight: parseNum(old.iCornerRadiusUR, 0),
        borderRadiusBottomRight: parseNum(old.iCornerRadiusLR, 12),
        borderRadiusBottomLeft: parseNum(old.iCornerRadiusLL, 0),

        flexDirection: old.iContentFlexDirection === 'horizontal' ? 'row' : 'column',
        alignItems: ALIGN_ITEMS_MAP[old.iContentVertAlign] || 'space-between',
        invertOrder: old.iContentOrder === 'orderTextImg',
        textAlign: ALIGN_MAP[old.iTextAlign] || 'start',
        contentAlign: ALIGN_MAP[old.iImgAlign] || 'center',

        textDecoration: old.iTextDecoration || 'none',
        textMarginTop: parseNum(old.iTextSpaceTop, 0),
        textMarginBottom: parseNum(old.iTextSpaceBottom, 0),
        textMarginLeft: parseNum(old.iTextSpaceLeft, 0),
        textMarginRight: parseNum(old.iTextSpaceRight, 0),

        contentSize: parseNum(old.iIconSize, 35),
        contentMarginTop: parseNum(old.iImgSpaceTop, 5),
        contentMarginBottom: parseNum(old.iImgSpaceBottom, 0),
        contentMarginLeft: parseNum(old.iImgSpaceLeft, 0),
        contentMarginRight: parseNum(old.iImgSpaceRight, 0),
        contentRotation: parseNum(old.iImgRotation, 0),
        contentMirror: truth(old.iFlipImage),

        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 7,
        paddingRight: 7,

        outerShadowX: parseNum(old.iShadowXOffset, 2),
        outerShadowY: parseNum(old.iShadowYOffset, 2),
        outerShadowBlur: parseNum(old.iShadowBlur, 2),
        outerShadowSize: parseNum(old.iShadowSpread, 1),

        innerShadowX: parseNum(old.iShadowInnerXOffset, 0),
        innerShadowY: parseNum(old.iShadowInnerYOffset, 0),
        innerShadowBlur: parseNum(old.iShadowInnerBlur, 0),
        innerShadowSize: parseNum(old.iShadowInnerSpread, 0),

        borderStyle: BORDER_STYLES.has(old.iBorderStyle) ? old.iBorderStyle : old.iBorderStyle ? 'solid' : 'none',
    };
    const borderSize = parseNum(old.iBorderSize, 0);
    out.borderSizeTop = borderSize;
    out.borderSizeBottom = borderSize;
    out.borderSizeLeft = borderSize;
    out.borderSizeRight = borderSize;
    return out;
}

/** vis-1 has the text size and the text shadow in the widget data, vis-2 takes them from the CSS of the widget */
function cssFromOld(old: OldData, widget: VisWidget): Record<string, unknown> {
    const css: Record<string, unknown> = {};
    if (isSet(old.iTextSize) && !isSet(widget.style?.['font-size'])) {
        css['font-size'] = `${parseNum(old.iTextSize, 12)}px`;
    }
    const x = parseNum(old.iShadowTextXOffset, 0);
    const y = parseNum(old.iShadowTextYOffset, 0);
    const blur = parseNum(old.iShadowTextBlur, 0);
    if ((x || y || blur) && !isSet(widget.style?.['text-shadow'])) {
        css['text-shadow'] = `${x}px ${y}px ${blur}px ${old.iShadowTextColor || '#111111'}`;
    }
    return css;
}

/** Text color and size of the simple text widgets → CSS of the widget */
function textCssFromOld(old: OldData, widget: VisWidget): Record<string, unknown> {
    const css = cssFromOld(old, widget);
    if (isSet(old.iTextColor) && !isSet(widget.style?.color)) {
        css.color = old.iTextColor;
    }
    return css;
}

/** The look while no state is active (vis-2 group "default state") */
function defaultStateFromOld(old: OldData): NewData {
    const out: NewData = {
        text: old.iTextFalse || '',
        background: old.iButtonCol || '#333333',
        textColor: old.iTextColor || '#ffffff',
        contentBlinkInterval: parseNum(old.iImgBlinkFalse, 0),
    };
    setIf(out, 'image', old.iImageFalse);
    setIf(out, 'html', old.iHtmlTextFieldFalse);
    setIf(out, 'contentColor', old.iImgColorFalse);
    setIf(out, 'borderColor', old.iBorderColor);
    setIf(out, 'outerShadowColor', old.iShadowColor);
    setIf(out, 'innerShadowColor', old.iShadowInnerColor);
    return out;
}

/**
 * The active state of the vis-1 universal widget → state 1 of the vis-2 universal widget.
 * vis-2 shows nothing of the default state while a state is active, so text and image fall back to the default ones.
 */
function activeStateFromOld(old: OldData): NewData {
    const out: NewData = {
        countStates: 1,
        compareBy1: 'default',
        comparisonOperator1: COMPARISON_MAP[old.iValueComparison] || '===',
        text1: first(old.iTextTrue, old.iTextFalse) || '',
        background1: first(old.iButtonActive, old.iButtonCol) || '#455618',
        textColor1: first(old.iTextColorActive, old.iTextColor) || '#ffffff',
        contentBlinkInterval1: parseNum(old.iImgBlinkTrue, 0),
    };
    setIf(out, 'image1', first(old.iImageTrue, old.iImageFalse));
    setIf(out, 'html1', first(old.iHtmlTextFieldTrue, old.iHtmlTextFieldFalse));
    setIf(out, 'contentColor1', first(old.iImgColorTrue, old.iImgColorFalse));
    setIf(out, 'borderColor1', first(old.iBorderColorActive, old.iBorderColor));
    setIf(out, 'outerShadowColor1', first(old.iShadowColorActive, old.iShadowColor));
    setIf(out, 'innerShadowColor1', first(old.iShadowInnerColorActive, old.iShadowInnerColor));
    return out;
}

/** The states of the vis-1 multi widget (iUniversalValueCount) → states of the vis-2 universal widget */
function multiStatesFromOld(old: OldData): NewData {
    const count = parseNum(old.iUniversalValueCount, 1);
    const out: NewData = { countStates: count };
    for (let i = 1; i <= count; i++) {
        out[`compareBy${i}`] = CHECK_TYPE_MAP[old[`iCheckType${i}`]] || 'default';
        out[`comparisonOperator${i}`] = COMPARISON_MAP[old[`iValueComparison${i}`]] || '===';
        out[`text${i}`] = first(old[`iTextTrue${i}`], old.iTextFalse) || '';
        out[`background${i}`] = first(old[`iButtonActiveM${i}`], old.iButtonCol) || '#455618';
        out[`textColor${i}`] = first(old[`iTextColorActive${i}`], old.iTextColorActive, old.iTextColor) || '#ffffff';
        out[`contentBlinkInterval${i}`] = parseNum(old[`iImgBlinkTrue${i}`], 0);
        setIf(out, `oid${i}`, old[`oid${i}`]);
        setIf(out, `value${i}`, old[`iValue${i}`]);
        setIf(out, `view${i}`, old[`iView${i}`]);
        setIf(out, `image${i}`, first(old[`iImageTrue${i}`], old.iImageFalse));
        setIf(out, `html${i}`, first(old[`iHtmlTextFieldTrue${i}`], old.iHtmlTextFieldFalse));
        setIf(out, `contentColor${i}`, first(old[`iImgColorTrue${i}`], old.iImgColorFalse));
        setIf(out, `borderColor${i}`, first(old[`iBorderColorActiveM${i}`], old.iBorderColorActive, old.iBorderColor));
        setIf(
            out,
            `outerShadowColor${i}`,
            first(old[`iShadowColorActiveM${i}`], old.iShadowColorActive, old.iShadowColor),
        );
        setIf(
            out,
            `innerShadowColor${i}`,
            first(old[`iShadowInnerColorActiveM${i}`], old.iShadowInnerColorActive, old.iShadowInnerColor),
        );
    }
    return out;
}

function dialogFromOld(old: OldData, notes: MigrationNote[]): NewData {
    const out: NewData = {
        dialogBackground: old.iPopUpBackground || '#666666',
        dialogWidth: parseNum(old.iPopUpWidth, 800),
        dialogHeight: parseNum(old.iPopUpHeight, 500),
        dialogCloseOnClickOutside: !truth(old.iPopUpPreventClickOutside),
        dialogCloseTimeoutSeconds: parseNum(old.iPopUpCloseAfterSeconds, 0),
        dialogPosition: old.iPopUpPosition || 'center',
        dialogPositionX: parseNum(old.iPopUpPositionX, 0),
        dialogPositionY: parseNum(old.iPopUpPositionY, 0),
        // vis-1 default: title is shown
        dialogTitleHide: old.iPopUpShowTitle !== undefined && !truth(old.iPopUpShowTitle),
        dialogTitleSize: parseNum(old.iPopUpTitleSize, 28),
        dialogBorderRadiusTopLeft: parseNum(old.iPopUpCornerRadiusUL, 12),
        dialogBorderRadiusTopRight: parseNum(old.iPopUpCornerRadiusUR, 0),
        dialogBorderRadiusBottomRight: parseNum(old.iPopUpCornerRadiusLR, 12),
        dialogBorderRadiusBottomLeft: parseNum(old.iPopUpCornerRadiusLL, 0),
    };
    setIf(out, 'dialogTitle', old.iPopUpTitle);
    setIf(out, 'dialogTitleColor', old.iPopUpTitleColor);
    setIf(out, 'dialogCloseButtonColor', old.iPopUpCloseBtnColor);

    if (/%|vw|vh/.test(`${old.iPopUpWidth || ''}${old.iPopUpHeight || ''}`)) {
        notes.push({ key: 'migration_note_dialog_size' });
    }
    if (isSet(old['iPopUpCloseDp-oid'])) {
        notes.push({ key: 'migration_note_dialog_close_dp' });
    }
    return out;
}

/** `i-vis-universal` and `i-vis-multi` → `tplInventwoWidgetUniversal` */
function convertUniversal(widget: VisWidget, isMulti: boolean): ConvertResult {
    const old = widget.data || {};
    const subType = String(old.iUniversalWidgetType || 'Switch');
    const type = UNIVERSAL_TYPE_MAP[subType];
    if (!type) {
        return { skipped: true, widget, subType };
    }

    const notes: MigrationNote[] = [];
    const contentType = mapContentType(old, notes);
    const isValueType = old.iValueType === 'value';

    const data: NewData = {
        ...pickGenericData(old),
        type,
        mode: 'singleButton',
        // vis-1 ignores the data point of backgrounds and navigation buttons, vis-2 would use (and write) it
        oid: !isMulti && (type === 'readonly' || type === 'nav') ? '' : old.oid || '',
        contentType,
        ...styleFromOld(old),
        ...defaultStateFromOld(old),
        ...(isMulti ? multiStatesFromOld(old) : activeStateFromOld(old)),
    };
    if (contentType === 'analogClock') {
        Object.assign(data, analogClockFromOld(old, notes));
    }

    switch (type) {
        case 'switch':
            data.valueFalse = isValueType ? (old.iValueFalse ?? '') : 'false';
            data.valueTrue = isValueType ? (old.iValueTrue ?? '') : 'true';
            break;

        case 'button':
            // vis-1 "State": sets `value` on click and is active while the data point has this value
            data.valueTrue = first(old.value, old.iValueTrue) ?? 'true';
            notes.push({ key: 'migration_note_state' });
            if (parseNum(old.iStateResetValueTime, 0) > 0) {
                notes.push({ key: 'migration_note_state_reset' });
            }
            break;

        case 'nav':
            data.view = old.nav_view || '';
            if (!data.view && !isMulti) {
                notes.push({ key: 'migration_note_nav_view' });
            }
            break;

        case 'increaseDecreaseValue':
            data.valueTrue = first(old.value, old.iValueTrue) ?? '1';
            notes.push({ key: 'migration_note_increase' });
            break;

        case 'viewInDialog':
            data.view = old.nav_view || '';
            // Opens the dialog, when the data point gets this value
            setIf(data, 'valueTrue', old.iPopUpOpenDpValue);
            Object.assign(data, dialogFromOld(old, notes));
            if (!data.view) {
                notes.push({ key: 'migration_note_nav_view' });
            }
            break;

        case 'http':
            data.url = old.value || '';
            data.httpType = HTTP_TYPE_MAP[old.iHttpType] || 'send';
            notes.push({ key: 'migration_note_http' });
            break;
    }

    if (isMulti) {
        notes.push({ key: 'migration_note_multi' });
    }
    if ([old.iButtonColHover, old.iShadowColorHover, old.iShadowInnerColorHover, old.iBorderColorHover].some(isSet)) {
        notes.push({ key: 'migration_note_hover' });
    }

    return {
        widget: wrapWidget('tplInventwoWidgetUniversal', data, widget, cssFromOld(old, widget)),
        mapping: `${isMulti ? 'multi' : 'universal'}:${type}${contentType === 'analogClock' ? '+analogClock' : ''}`,
        quality: notes.length ? 'partial' : 'full',
        notes,
    };
}

/**
 * The old tile widgets (`i-vis-switch`, `i-vis-switch-small`, `i-vis-background`, `i-vis-background-small`,
 * `i-vis-button`, `i-vis-button-small`, `i-vis-navigation`, `i-vis-navigation-small`) → universal.
 * They are predecessors of the vis-1 universal widget and use a subset of its fields.
 */
function convertOldTile(widget: VisWidget, type: 'switch' | 'readonly' | 'button' | 'nav'): ConvertedEntry {
    const raw = widget.data || {};
    // Buttons and navigation have only one text and one image
    const old: OldData = {
        ...raw,
        iTextFalse: first(raw.iTextFalse, raw.iText),
        iImageFalse: first(raw.iImageFalse, raw.iImage),
    };
    const isValueType = old.iValueType === 'value';
    const notes: MigrationNote[] = [];
    const data: NewData = {
        ...pickGenericData(old),
        type,
        mode: 'singleButton',
        oid: old.oid || '',
        contentType: 'image',
        ...styleFromOld(old),
        ...defaultStateFromOld(old),
        ...activeStateFromOld(old),
        // These widgets have no shadow
        outerShadowSize: 0,
        outerShadowX: 0,
        outerShadowY: 0,
        outerShadowBlur: 0,
    };
    switch (type) {
        case 'switch':
            data.valueFalse = isValueType ? (old.iValueFalse ?? '') : 'false';
            data.valueTrue = isValueType ? (old.iValueTrue ?? '') : 'true';
            break;
        case 'readonly':
            data.valueTrue = isValueType ? (old.iValueTrue ?? '') : 'true';
            break;
        case 'button':
            data.valueTrue = old.value ?? 'true';
            break;
        case 'nav':
            data.view = old.nav_view || '';
            // vis-1 writes iNavValue to the data point on click, vis-2 writes "value true"
            if (isSet(old.oid) && isSet(old.iNavValue)) {
                data.valueTrue = old.iNavValue;
            } else {
                data.oid = '';
            }
            if (!data.view) {
                notes.push({ key: 'migration_note_nav_view' });
            }
            break;
    }
    if (truth(old.iInvertImageCol)) {
        notes.push({ key: 'migration_note_invert' });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetUniversal', data, widget, cssFromOld(old, widget)),
        mapping: `universal:${type}`,
        quality: notes.length ? 'partial' : 'full',
        notes,
    };
}

/** `i-vis-image-new` and `i-vis-image`: image (depending on a data point) → universal, read only, no background */
function convertImage(widget: VisWidget): ConvertedEntry {
    const raw = widget.data || {};
    const old: OldData = { ...raw, iImageFalse: first(raw.iImageFalse, raw.iImage) };
    const data: NewData = {
        ...pickGenericData(old),
        type: 'readonly',
        mode: 'singleButton',
        oid: old.oid || '',
        contentType: 'image',
        text: '',
        background: 'rgba(0,0,0,0)',
        backgroundOpacity: 0,
        scaleContentToFit: true,
        contentOpacity: parseNum(first(old.iOpacityCtn, old.iOpacityImg), 1),
        contentRotation: parseNum(old.iImgRotation, 0),
        contentMirror: truth(old.iFlipImage),
        contentBlinkInterval: parseNum(old.iImgBlinkFalse, 0),
        borderRadiusTopLeft: parseNum(old.iCornerRadiusUL, 0),
        borderRadiusTopRight: parseNum(old.iCornerRadiusUR, 0),
        borderRadiusBottomRight: parseNum(old.iCornerRadiusLR, 0),
        borderRadiusBottomLeft: parseNum(old.iCornerRadiusLL, 0),
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        outerShadowX: 0,
        outerShadowY: 0,
        outerShadowBlur: parseNum(old.iShadowBlur, 0),
        outerShadowSize: parseNum(old.iShadowSpread, 0),
        clickThrough: !truth(old.iPointerEvents),

        countStates: 1,
        compareBy1: 'default',
        comparisonOperator1: '===',
        text1: '',
        background1: 'rgba(0,0,0,0)',
        contentBlinkInterval1: parseNum(old.iImgBlinkTrue, 0),
    };
    setIf(data, 'valueTrue', first(old.iValue, 'true'));
    setIf(data, 'image', old.iImageFalse);
    setIf(data, 'image1', first(old.iImageTrue, old.iImageFalse));
    setIf(data, 'contentColor', old.iImgColorFalse);
    setIf(data, 'contentColor1', first(old.iImgColorTrue, old.iImgColorFalse));
    setIf(data, 'outerShadowColor', old.iShadowColor);
    setIf(data, 'outerShadowColor1', first(old.iShadowColorActive, old.iShadowColor));
    if (old.iImgScaleType === 'iRepeat') {
        data.imageObjectFit = 'repeat';
        setIf(data, 'imageBackgroundSize', old.iImgTileSize);
    } else if (old.iImgScaleType === 'iStretch') {
        data.imageObjectFit = 'fill';
    }
    return {
        widget: wrapWidget('tplInventwoWidgetUniversal', data, widget),
        mapping: 'universal:readonly-image',
        quality: 'partial',
        notes: [{ key: 'migration_note_image' }],
    };
}

/** `i-vis-radiobutton-list` → universal with separated buttons (one button per value) */
function convertRadiobuttonList(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const count = parseNum(old.iRadiobtnsCount, 1);
    const data: NewData = {
        ...pickGenericData(old),
        type: 'button',
        mode: 'separatedButtons',
        direction: old.iRadiobtnAlign === 'vertical' ? 'column' : 'row',
        oid: old.oid || '',
        buttonSize: parseNum(old.iRadiobtnWidth, 100),
        btnSpacing: parseNum(old.iRadiobtnSpace, 10),
        contentType: 'image',
        ...styleFromOld(old),
        countStates: count,
    };
    for (let i = 1; i <= count; i++) {
        const text = old[`iTextFalse${i}`] || '';
        data[`value${i}`] = String(old[`iValue${i}`] ?? '');
        data[`text${i}`] = text;
        data[`textTrue${i}`] = old[`iTextTrue${i}`] || text;
        data[`background${i}`] = first(old[`iButtonBackM${i}`], old.iButtonCol) || '#333333';
        data[`backgroundTrue${i}`] = first(old[`iButtonBackActiveM${i}`], old.iButtonActive) || '#455618';
        data[`textColor${i}`] = old.iTextColor || '#ffffff';
        data[`textColorTrue${i}`] = first(old.iTextColorActive, old.iTextColor) || '#ffffff';
        setIf(data, `image${i}`, old[`iImageFalse${i}`]);
        setIf(data, `imageTrue${i}`, first(old[`iImageTrue${i}`], old[`iImageFalse${i}`]));
        setIf(data, `contentColor${i}`, old[`iImgColorFalse${i}`]);
        setIf(data, `contentColorTrue${i}`, first(old[`iImgColorTrue${i}`], old[`iImgColorFalse${i}`]));
    }
    const notes: MigrationNote[] = [{ key: 'migration_note_radiobuttons' }];
    if (old.iRadiobtnWrap === 'iMatrix') {
        notes.push({ key: 'migration_note_radiobuttons_matrix' });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetUniversal', data, widget, cssFromOld(old, widget)),
        mapping: 'universal:radiobutton-list',
        quality: 'partial',
        notes,
    };
}

/** `i-vis-color-picker` → universal with the color picker as content */
function convertColorPicker(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const data: NewData = {
        ...pickGenericData(old),
        type: 'readonly',
        mode: 'singleButton',
        oid: '',
        contentType: 'colorPicker',
        ...styleFromOld(old),
        text: old.iText || '',
        background: old.iButtonCol || '#333333',
        textColor: old.iTextColor || '#ffffff',
        countStates: 0,

        colorPickerColorModel: COLOR_MODEL_MAP[old.iColorPickerFormat] || 'hex',
        colorPickerOid: old.oid || '',
        colorPickerWidth: parseNum(old.iColorPickerWidth, 200),
        colorPickerComponentsSpace: parseNum(old.iColorPickerComponentMargin, 12),
        colorPickerHandleSize: parseNum(old.iColorPickerHandleRadius, 8),
        colorPickerHandleMargin: parseNum(old.iColorPickerHandlePadding, 6),
        colorPickerDirection: old.iColorPickerLayoutDirection === 'horizontal' ? 'horizontal' : 'vertical',
        // vis-1 default: only the wheel is shown
        colorPickerShowWheel: old.iColorPickerShowWheel === undefined ? true : truth(old.iColorPickerShowWheel),
        colorPickerShowBox: false,
        colorPickerShowHue: truth(old.iColorPickerShowSliderHue),
        colorPickerShowSaturation: truth(old.iColorPickerShowSliderSaturation),
        colorPickerShowValue: truth(old.iColorPickerShowSliderValue),
        colorPickerShowRed: truth(old.iColorPickerShowSliderRed),
        colorPickerShowGreen: truth(old.iColorPickerShowSliderGreen),
        colorPickerShowBlue: truth(old.iColorPickerShowSliderBlue),
        colorPickerShowAlpha: truth(old.iColorPickerShowSliderAlpha),
        colorPickerShowKelvin: truth(old.iColorPickerShowSliderKelvin),
    };
    setIf(data, 'colorPickerOid1', old['iColorPickerColor1-oid']);
    setIf(data, 'colorPickerOid2', old['iColorPickerColor2-oid']);
    setIf(data, 'colorPickerOid3', old['iColorPickerColor3-oid']);
    setIf(data, 'outerShadowColor', old.iShadowColor);
    setIf(data, 'innerShadowColor', old.iShadowInnerColor);
    setIf(data, 'borderColor', old.iBorderColor);

    const notes: MigrationNote[] = [{ key: 'migration_note_colorpicker' }];
    if (isSet(old['iColorPickerTransparency-oid'])) {
        notes.push({ key: 'migration_note_colorpicker_alpha' });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetUniversal', data, widget, cssFromOld(old, widget)),
        mapping: 'universal:colorPicker',
        quality: 'partial',
        notes,
    };
}

/** `i-vis-checkbox` (one widget with several checkboxes) → `tplInventwoWidgetCheckbox` (one checkbox) */
function convertCheckbox(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const count = parseNum(old.iCheckboxCount, 1);
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid1 || '',
        valueFalse: old.iValueFalse1 ?? 'false',
        valueTrue: old.iValueTrue1 ?? 'true',
        textFalse: old.iText1 || '',
        textTrue: old.iText1 || '',
        textPosition: 'end',
        boxColor: old.iBackgroundColor || '#ffffff',
        boxColorActive: old.iBackgroundColorActive || '#ffffff',
        boxSize: parseNum(old.iWidth, 30),
    };
    const notes: MigrationNote[] = [{ key: 'migration_note_checkbox' }];
    if (count > 1) {
        notes.push({ key: 'migration_note_only_first', args: [count] });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetCheckbox', data, widget),
        mapping: 'checkbox',
        quality: 'partial',
        notes,
    };
}

/** `i-vis-switch-basic` (one widget with several switches) → `tplInventwoWidgetSwitch` (one switch) */
function convertSwitchBasic(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const count = parseNum(old.iSwitchCount, 1);
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid1 || '',
        valueFalse: old.iValueFalse1 ?? 'false',
        valueTrue: old.iValueTrue1 ?? 'true',
        textFalse: old.iTextFalse1 || '',
        textTrue: first(old.iTextTrue1, old.iTextFalse1) || '',
        textPosition: 'end',
        trackColor: old.iBackgroundColor || '#333333',
        trackColorTrue: old.iBackgroundColorActive || '#7e9640',
        trackSize: parseNum(old.iBarWidth, 20),
        trackBorderRadius: parseNum(old.iBorderRadius, 20),
        thumbColor: old.iKnobBackgroundColor || '#455618',
        thumbColorTrue: old.iKnobBackgroundColorActive || '#455618',
        thumbSize: parseNum(old.iKnobWidth, 30),
        thumbBorderRadius: parseNum(old.iKnobBorderRadius, 30),
    };
    const notes: MigrationNote[] = [];
    if (count > 1) {
        notes.push({ key: 'migration_note_only_first', args: [count] });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetSwitch', data, widget),
        mapping: 'switch',
        quality: notes.length ? 'partial' : 'full',
        notes,
    };
}

/** `i-vis-switch-1` (rocker switch drawn as image) → `tplInventwoWidgetSwitch` */
function convertSwitchRocker(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid || '',
        valueFalse: isSet(old.iValueFalse) ? old.iValueFalse : 'false',
        valueTrue: isSet(old.iValueTrue) ? old.iValueTrue : 'true',
        textFalse: '',
        textTrue: '',
        trackColor: old.iSwitchColOffActive || '#ff0000',
        trackColorTrue: old.iSwitchColOnActive || '#00ff00',
    };
    return {
        widget: wrapWidget('tplInventwoWidgetSwitch', data, widget),
        mapping: 'switch:rocker',
        quality: 'partial',
        notes: [{ key: 'migration_note_switch_rocker' }],
    };
}

/** `i-vis-valuelist` → `tplInventwoWidgetValueList` */
function convertValueList(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const listStyle = String(old.iValueListStyle || 'disc').trim();
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid || '',
        manualText: old.iValueListText || '',
        separator: old.iValueListDelimiter || '',
        bulletType: VALUE_LIST_BULLET_MAP[listStyle] || 'disc',
        lineSpacing: parseNum(old.iValueListEntryDistance, 0),
    };
    const notes: MigrationNote[] = [];
    if (!VALUE_LIST_BULLET_MAP[listStyle]) {
        notes.push({ key: 'migration_note_valuelist_bullet', args: [listStyle] });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetValueList', data, widget, textCssFromOld(old, widget)),
        mapping: 'valuelist',
        quality: notes.length ? 'partial' : 'full',
        notes,
    };
}

/** `i-vis-marquee` → `tplInventwoWidgetMarquee` */
function convertMarquee(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid || '',
        marqueeText: old.iMarqueeText || '',
        direction: old.iMarqueeDirection || 'left',
    };
    return {
        widget: wrapWidget('tplInventwoWidgetMarquee', data, widget, textCssFromOld(old, widget)),
        mapping: 'marquee',
        quality: 'partial',
        // The speed has another unit in vis-2, so the default is used
        notes: [{ key: 'migration_note_marquee' }],
    };
}

/** vis-1 iCol* → vis-2 columnKey1, columnTitle1, ... (indexed like in the vis-2 editor) */
function appendTableColumns(old: OldData, data: NewData, colCount: number): MigrationNote[] {
    const notes: MigrationNote[] = [];
    let mappedCols = 0;
    let thresholds = false;
    for (let i = 1; i <= colCount; i++) {
        const key = old[`iColAttr${i}`];
        if (isSet(key)) {
            data[`columnKey${i}`] = String(key);
            mappedCols++;
        }
        setIf(data, `columnTitle${i}`, old[`iColName${i}`]);
        if (old[`iColShow${i}`] === false || old[`iColShow${i}`] === 'false') {
            data[`columnHidden${i}`] = true;
        }
        if (isSet(old[`iColWidth${i}`])) {
            data[`columnWidth${i}`] = parseNum(old[`iColWidth${i}`], 0);
        }
        setIf(data, `columnPrefix${i}`, old[`iColPreText${i}`]);
        setIf(data, `columnSuffix${i}`, old[`iColAfterText${i}`]);
        setIf(data, `columnPlaceholder${i}`, old[`iTblCellPlaceholder${i}`]);
        setIf(data, `columnTitleAlign${i}`, old[`iTblHeadTextAlign${i}`]);
        setIf(data, `columnContentAlign${i}`, old[`iTblTextAlign${i}`]);

        const format = TABLE_FORMAT_MAP[String(old[`iTblCellFormat${i}`] || 'normal').toLowerCase()] || 'text';
        data[`columnValueFormat${i}`] = format;
        if (format === 'number') {
            data[`columnNumberDecimals${i}`] = parseNum(old[`iTblCellNumberDecimals${i}`], 2);
            setIf(data, `columnDecimalSeparator${i}`, old[`iTblCellNumberDecimalSeperator${i}`]);
            setIf(data, `columnThousandSeparator${i}`, old[`iTblCellNumberThousandSeperator${i}`]);
        } else if (format === 'boolean') {
            setIf(data, `columnBooleanCheckedColor${i}`, old[`iTblCellBooleanColorTrue${i}`]);
            setIf(data, `columnBooleanUncheckedColor${i}`, old[`iTblCellBooleanColorFalse${i}`]);
        } else if (format === 'datetime' && isSet(old[`iTblCellDatetimeFormat${i}`])) {
            data[`columnDatetimeFormat${i}`] = 'custom';
            data[`columnDatetimeFormatCustom${i}`] = old[`iTblCellDatetimeFormat${i}`];
        }
        if (isSet(old[`iTblCellThresholds-oid${i}`]) || isSet(old[`iTblCellThresholdsText${i}`])) {
            thresholds = true;
        }
    }
    if (mappedCols === 0) {
        notes.push({ key: 'migration_note_table_no_columns' });
    } else if (mappedCols < colCount) {
        notes.push({ key: 'migration_note_table_some_columns', args: [mappedCols, colCount] });
    }
    if (thresholds) {
        notes.push({ key: 'migration_note_table_thresholds' });
    }
    notes.push({ key: 'migration_note_table_style' });
    return notes;
}

/** `i-vis-jsontable` → `tplInventwoWidgetTable` */
function convertJsonTable(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const colCount = parseNum(old.iColCount, 1);
    const borderSize = parseNum(old.iBorderSize, 0);
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid || '',
        maxRows: parseNum(old.iTblRowLimit, 0),
        countColumns: colCount,
        showHead: truth(old.iTblShowHead),
        stickyHeader: truth(old.iTblFixedHead),
        pagination: false,
        backgroundHeader: old.iTblHeaderColor || '#333333',
        backgroundEvenRow: old.iTblRowEvenColor || '#333333',
        backgroundOddRow: old.iTblRowUnevenColor || '#455618',
        rowBorderWidth: borderSize,
        headerBorderWidth: borderSize,
        // The table itself has no border, corners and shadow in vis-1
        borderRadiusTopLeft: 0,
        borderRadiusBottomRight: 0,
        outerShadowX: 0,
        outerShadowY: 0,
        outerShadowBlur: 0,
        outerShadowSize: 0,
    };
    setIf(data, 'rowBorderColor', old.iBorderColor);
    setIf(data, 'headerBorderColor', old.iBorderColor);
    if (isSet(old.iTblSortAttr)) {
        data.defaultSortColumn = old.iTblSortAttr;
        data.defaultSortOrder = old.iTblSortOrder === 'desc' ? 'desc' : 'asc';
    }
    // vis-2 has one text color for the whole table: the one of the widget CSS
    const css: Record<string, unknown> = {};
    if (isSet(old.iTblRowEvenTextColor) && !isSet(widget.style?.color)) {
        css.color = old.iTblRowEvenTextColor;
    }
    return {
        widget: wrapWidget('tplInventwoWidgetTable', data, widget, css),
        mapping: 'table',
        quality: 'partial',
        notes: appendTableColumns(old, data, colCount),
    };
}

/** `i-vis-slider-simple` and `i-vis-slider-simple-2` → `tplInventwoWidgetSlider` */
function convertSliderSimple(widget: VisWidget): ConvertedEntry {
    const old = widget.data || {};
    const data: NewData = {
        ...pickGenericData(old),
        oid: old.oid || '',
        minValue: parseNum(old.iMinVal, 1),
        maxValue: parseNum(old.iMaxVal, 100),
        step: parseNum(old.iStepVal, 1),
        orientation: 'horizontal',
        showMinMax: truth(old.iShowMinMax),
        showSteps: truth(old.iShowSteps),
        valueLabelDisplay: truth(old.iShowValue) ? 'on' : 'auto',
        sliderRailColor: old.iSliderColor || '#ffffff',
        sliderRailActiveColor: old.iSliderKnobColor || '#455618',
        sliderThumbColor: old.iSliderKnobColor || '#455618',
        trackWidth: parseNum(old.iSliderHeight, 10),
        trackBorderRadius: parseNum(old.iSliderCorners, 100),
        thumbSize: parseNum(old.iSliderKnobSize, 20),
        thumbBorderRadius: parseNum(old.iSliderKnobCorners, 100),
    };
    setIf(data, 'sliderTitle', old.iSliderLabel);
    setIf(data, 'sliderUnit', old.iValueAfterText);

    const css: Record<string, unknown> = {};
    if (isSet(old.iSliderTextColor) && !isSet(widget.style?.color)) {
        css.color = old.iSliderTextColor;
    }
    const notes: MigrationNote[] = [{ key: 'migration_note_slider' }];
    if (parseNum(old.iSliderRotation, 0) !== 0) {
        notes.push({ key: 'migration_note_slider_rotation' });
    }
    return {
        widget: wrapWidget('tplInventwoWidgetSlider', data, widget, css),
        mapping: 'slider',
        quality: 'partial',
        notes,
    };
}

export function isOldInventwoWidget(widget: VisWidget | null | undefined): boolean {
    return !!widget && typeof widget.tpl === 'string' && /^i-vis-/.test(widget.tpl);
}

/** Converts one widget. The passed widget is not changed. */
export function convertInventwoWidget(widget: VisWidget): ConvertResult {
    switch (widget.tpl) {
        case 'i-vis-universal':
            return convertUniversal(widget, false);
        case 'i-vis-multi':
            return convertUniversal(widget, true);
        case 'i-vis-switch':
        case 'i-vis-switch-small':
            return convertOldTile(widget, 'switch');
        case 'i-vis-background':
        case 'i-vis-background-small':
            return convertOldTile(widget, 'readonly');
        case 'i-vis-button':
        case 'i-vis-button-small':
            return convertOldTile(widget, 'button');
        case 'i-vis-navigation':
        case 'i-vis-navigation-small':
            return convertOldTile(widget, 'nav');
        case 'i-vis-image-new':
        case 'i-vis-image':
            return convertImage(widget);
        case 'i-vis-radiobutton-list':
            return convertRadiobuttonList(widget);
        case 'i-vis-color-picker':
            return convertColorPicker(widget);
        case 'i-vis-checkbox':
            return convertCheckbox(widget);
        case 'i-vis-switch-basic':
            return convertSwitchBasic(widget);
        case 'i-vis-switch-1':
            return convertSwitchRocker(widget);
        case 'i-vis-valuelist':
            return convertValueList(widget);
        case 'i-vis-marquee':
            return convertMarquee(widget);
        case 'i-vis-jsontable':
            return convertJsonTable(widget);
        case 'i-vis-slider-simple':
        case 'i-vis-slider-simple-2':
            return convertSliderSimple(widget);
        default:
            // No counterpart in vis-2: i-vis-slider-color-hor, i-vis-slider-color-vert, i-vis-grid
            return { skipped: true, widget, subType: '' };
    }
}

function countOldWidgets(project: VisProject): number {
    let count = 0;
    Object.keys(project).forEach(viewName => {
        const widgets = project[viewName]?.widgets;
        if (viewName === '___settings' || !widgets || typeof widgets !== 'object') {
            return;
        }
        Object.values(widgets).forEach(widget => {
            if (isOldInventwoWidget(widget)) {
                count++;
            }
        });
    });
    return count;
}

/**
 * Converts all old inventwo widgets of a vis-2 project (content of `vis-views.json`).
 *
 * @param project parsed content of vis-views.json. It is not changed.
 * @returns the converted copy of the project and the report
 */
export function migrateVisProject(project: VisProject): { project: VisProject; report: MigrationReport } {
    const result: VisProject = JSON.parse(JSON.stringify(project));
    const report: MigrationReport = {
        converted: 0,
        partial: [],
        skipped: [],
        byMapping: {},
        remainingOldTpl: 0,
        viewsTouched: [],
    };

    Object.keys(result).forEach(viewName => {
        const widgets = result[viewName]?.widgets;
        if (viewName === '___settings' || !widgets || typeof widgets !== 'object') {
            return;
        }
        let touched = false;
        Object.keys(widgets).forEach(wid => {
            const widget = widgets[wid];
            if (!isOldInventwoWidget(widget)) {
                return;
            }
            const entry = convertInventwoWidget(widget);
            if (entry.skipped) {
                report.skipped.push({ wid, view: viewName, tpl: widget.tpl || '', subType: entry.subType });
                return;
            }
            widgets[wid] = entry.widget;
            touched = true;
            report.converted++;
            report.byMapping[entry.mapping] = (report.byMapping[entry.mapping] || 0) + 1;
            if (entry.quality === 'partial') {
                report.partial.push({ wid, view: viewName, mapping: entry.mapping, notes: entry.notes });
            }
        });
        if (touched) {
            report.viewsTouched.push(viewName);
        }
    });

    report.remainingOldTpl = countOldWidgets(result);
    return { project: result, report };
}

/**
 * Rewrites the paths of the project files (images, ...) after a project was copied to another place:
 * `/<namespace>/<project>/` → `/vis-2.0/<target>/`. Works on the whole project, i.e. also on widgets of other
 * adapters. Paths of other projects and of system folders like `/vis/signals/` are not touched.
 *
 * @param project the project. It is not changed.
 * @param sources the old places of the files, e.g. `[['vis.0', 'main'], ['vis', 'main']]`
 * @param target name of the vis-2 project that holds the files now
 */
export function rewriteProjectPaths(project: VisProject, sources: [string, string][], target: string): VisProject {
    let text = JSON.stringify(project);
    sources.forEach(([namespace, name]) => {
        if (namespace === 'vis-2.0' && name === target) {
            return;
        }
        // The text is JSON: a slash may be escaped, the project name is JSON-encoded
        const from = JSON.stringify(`/${namespace}/${name}/`).slice(1, -1);
        const to = JSON.stringify(`/vis-2.0/${target}/`).slice(1, -1);
        text = text.split(from).join(to);
    });
    return JSON.parse(text);
}

export interface RestoredWidget {
    /** ID of the widget in the vis-2 project */
    wid: string;
    /** View that holds the widget */
    view: string;
    /** Other views in which the widget is shown too */
    views: string[];
    /** true: the widget was missing and was added, false: only the list of views was completed */
    added: boolean;
}

/**
 * Restores the widgets that are shown in several views.
 *
 * vis-1 stores such a widget in every view with the ID `<id>_<view>`. vis-2 stores it only once (ID without
 * underscore) with the other views in the attribute `multi-views` – and removes every widget with an underscore in
 * the ID when a project is loaded. So after the import of a vis-1 project these widgets are gone.
 *
 * @param project the vis-2 project (content of vis-views.json). It is not changed.
 * @param vis1Project the original vis-1 project
 * @returns the completed copy of the vis-2 project and the list of the restored widgets
 */
export function restoreMultiViewWidgets(
    project: VisProject,
    vis1Project: VisProject,
): { project: VisProject; restored: RestoredWidget[] } {
    const result: VisProject = JSON.parse(JSON.stringify(project));
    const restored: RestoredWidget[] = [];
    const isView = (viewName: string): boolean =>
        viewName !== '___settings' && !!result[viewName]?.widgets && typeof result[viewName].widgets === 'object';

    // base ID → the views of the vis-1 project that contain a copy, with the copy itself
    const copies: Record<string, { view: string; widget: VisWidget }[]> = {};
    Object.keys(vis1Project).forEach(viewName => {
        const widgets = vis1Project[viewName]?.widgets;
        if (viewName === '___settings' || !widgets || typeof widgets !== 'object') {
            return;
        }
        Object.keys(widgets).forEach(wid => {
            const match = wid.match(/^([wg]\d+)_.+$/);
            if (match && !copies[match[1]]?.find(copy => copy.view === viewName)) {
                copies[match[1]] ||= [];
                copies[match[1]].push({ view: viewName, widget: widgets[wid] });
            }
        });
    });

    const usedIds = new Set<string>();
    Object.keys(result).forEach(viewName => {
        if (isView(viewName)) {
            Object.keys(result[viewName].widgets!).forEach(wid => usedIds.add(wid));
        }
    });

    Object.keys(copies).forEach(baseId => {
        const placements = copies[baseId].filter(copy => isView(copy.view));
        if (!placements.length) {
            return;
        }
        const allViews = placements.map(copy => copy.view);

        // The import of vis-2 may have kept the widget in one of the views
        const keptIn = allViews.find(viewName => {
            const kept = result[viewName].widgets![baseId];
            return kept && kept.tpl === placements[0].widget.tpl;
        });
        if (keptIn) {
            const kept = result[keptIn].widgets![baseId];
            const others = allViews.filter(viewName => viewName !== keptIn);
            if (others.length && !kept.data?.['multi-views']) {
                kept.data = { ...(kept.data || {}), 'multi-views': others.join(',') };
                restored.push({ wid: baseId, view: keptIn, views: others, added: false });
            }
            return;
        }

        let wid = baseId;
        if (usedIds.has(wid)) {
            let num = 1;
            do {
                wid = `w${String(num++).padStart(6, '0')}`;
            } while (usedIds.has(wid));
        }
        usedIds.add(wid);

        const home = placements[0];
        const others = allViews.slice(1);
        const widget: VisWidget = JSON.parse(JSON.stringify(home.widget));
        widget.data ||= {};
        // Old vis-1 attribute with the list of views
        delete widget.data.views;
        if (others.length) {
            widget.data['multi-views'] = others.join(',');
        }
        result[home.view].widgets![wid] = widget;
        restored.push({ wid, view: home.view, views: others, added: true });
    });

    return { project: result, restored };
}

/** true, if the project contains widgets in the vis-1 notation for several views (`<id>_<view>`) */
export function hasMultiViewCopies(project: VisProject): boolean {
    return Object.keys(project).some(viewName => {
        const widgets = project[viewName]?.widgets;
        return (
            viewName !== '___settings' &&
            !!widgets &&
            typeof widgets === 'object' &&
            Object.keys(widgets).some(wid => /^[wg]\d+_.+$/.test(wid))
        );
    });
}

/**
 * Converts the widgets that are shown in several views from the vis-1 notation (one copy per view with the ID
 * `<id>_<view>`) to the vis-2 notation (one widget with the attribute `multi-views`).
 * Without this, vis-2 removes these widgets when it loads the project.
 *
 * @param project a vis-1 project or a vis-2 project that was imported from vis-1 and not opened yet. Not changed.
 */
export function convertMultiViewWidgets(project: VisProject): { project: VisProject; restored: RestoredWidget[] } {
    const stripped: VisProject = JSON.parse(JSON.stringify(project));
    Object.keys(stripped).forEach(viewName => {
        const widgets = stripped[viewName]?.widgets;
        if (viewName === '___settings' || !widgets || typeof widgets !== 'object') {
            return;
        }
        Object.keys(widgets).forEach(wid => {
            if (/^[wg]\d+_.+$/.test(wid)) {
                delete widgets[wid];
            }
        });
    });
    return restoreMultiViewWidgets(stripped, project);
}
