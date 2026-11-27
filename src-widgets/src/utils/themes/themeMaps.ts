import type { ThemeInfo } from './themeStore';
import type { ThemeTokenKey } from './themeTokens';

/** Widget data field -> token */
export type ThemeMapping = Record<string, ThemeTokenKey>;

const MAX_STATES = 100;

function isEmpty(value: unknown): boolean {
    return value === undefined || value === null || value === '';
}

function add(mapping: ThemeMapping, token: ThemeTokenKey, ...fields: string[]): void {
    fields.forEach(field => (mapping[field] = token));
}

function universalMapping(data: Record<string, any>): ThemeMapping {
    const m: ThemeMapping = {};
    const surface = data.designThemeSurface || 'tile';
    if (surface === 'card') {
        add(m, 'surface', 'background');
    } else if (surface !== 'none') {
        add(m, 'surfaceVariant', 'background');
    }
    add(m, 'textMuted', 'contentColor');
    add(m, 'text', 'textColor');
    add(m, 'border', 'borderColor');
    add(m, 'shadow', 'outerShadowColor');
    add(
        m,
        'radius',
        'borderRadiusTopLeft',
        'borderRadiusTopRight',
        'borderRadiusBottomRight',
        'borderRadiusBottomLeft',
    );
    add(m, 'borderWidth', 'borderSizeTop', 'borderSizeBottom', 'borderSizeLeft', 'borderSizeRight');
    add(m, 'borderStyle', 'borderStyle');
    add(m, 'shadowX', 'outerShadowX');
    add(m, 'shadowY', 'outerShadowY');
    add(m, 'shadowBlur', 'outerShadowBlur');
    add(m, 'shadowSize', 'outerShadowSize');
    add(m, 'accent', 'backgroundFeedback');
    add(m, 'onAccent', 'contentColorFeedback', 'textColorFeedback');
    add(m, 'surface', 'dialogBackground');
    add(m, 'text', 'dialogTitleColor', 'dialogCloseButtonColor');
    add(
        m,
        'radius',
        'dialogBorderRadiusTopLeft',
        'dialogBorderRadiusTopRight',
        'dialogBorderRadiusBottomRight',
        'dialogBorderRadiusBottomLeft',
    );
    add(m, 'textMuted', 'analogClockFaceColor');
    add(m, 'text', 'analogClockHourHandColor', 'analogClockMinuteHandColor');
    add(m, 'accent', 'analogClockSecondHandColor');

    const count = Math.min(MAX_STATES, Math.max(0, Math.floor(Number(data.countStates)) || 0));
    if (data.mode === 'separatedButtons') {
        for (let i = 1; i <= count; i++) {
            add(m, 'surfaceVariant', `background${i}`);
            add(m, 'accent', `backgroundTrue${i}`);
            add(m, 'textMuted', `contentColor${i}`, `textColor${i}`);
            add(m, 'onAccent', `contentColorTrue${i}`, `textColorTrue${i}`);
            add(m, 'border', `borderColor${i}`, `borderColorTrue${i}`);
            add(m, 'shadow', `outerShadowColor${i}`, `outerShadowColorTrue${i}`);
        }
    } else if (Number(data.countStates) === 1) {
        add(m, 'accent', 'background1');
        add(m, 'onAccent', 'contentColor1', 'textColor1');
        add(m, 'border', 'borderColor1');
        add(m, 'shadow', 'outerShadowColor1');
    }
    return m;
}

/** Mappings that do not depend on the widget data */
const STATIC_MAPPINGS: Record<string, ThemeMapping> = (() => {
    const slider: ThemeMapping = {};
    add(slider, 'track', 'sliderRailColor');
    add(slider, 'accent', 'sliderRailActiveColor', 'sliderThumbColor');
    add(slider, 'shadow', 'trackShadowColor', 'thumbShadowColor');

    const radial: ThemeMapping = {};
    add(radial, 'track', 'trackColor');
    add(radial, 'accent', 'trackActiveColor', 'thumbColor');
    add(radial, 'shadow', 'trackShadowColor', 'thumbShadowColor');
    add(radial, 'text', 'valueColor', 'needleColor');
    add(radial, 'textMuted', 'labelColor', 'scaleColor', 'scaleLabelColor');

    const sw: ThemeMapping = {};
    add(sw, 'track', 'trackColor');
    add(sw, 'accent', 'trackColorTrue');
    add(sw, 'thumb', 'thumbColor', 'thumbColorTrue');
    add(sw, 'shadow', 'trackShadowColor', 'trackShadowColorTrue', 'thumbShadowColor', 'thumbShadowColorTrue');

    const checkbox: ThemeMapping = {};
    add(checkbox, 'textMuted', 'boxColor');
    add(checkbox, 'accent', 'boxColorActive');

    const dropdown: ThemeMapping = {};
    add(dropdown, 'text', 'textColor');
    add(dropdown, 'surfaceVariant', 'backgroundColor');
    add(dropdown, 'accent', 'highlightColor');
    add(dropdown, 'border', 'borderColor');
    add(dropdown, 'borderWidth', 'borderWidth');
    add(dropdown, 'radiusSmall', 'borderRadius');
    add(dropdown, 'textMuted', 'titleColor');
    add(dropdown, 'shadow', 'shadowColor', 'widgetShadowColor');

    const marquee: ThemeMapping = {};
    add(marquee, 'surface', 'backgroundColor');
    add(marquee, 'border', 'borderColor');
    add(
        marquee,
        'radius',
        'borderRadiusTopLeft',
        'borderRadiusTopRight',
        'borderRadiusBottomRight',
        'borderRadiusBottomLeft',
    );
    add(marquee, 'borderWidth', 'borderSizeTop', 'borderSizeBottom', 'borderSizeLeft', 'borderSizeRight');
    add(marquee, 'borderStyle', 'borderStyle');
    add(marquee, 'shadow', 'outerShadowColor');
    add(marquee, 'shadowX', 'outerShadowX');
    add(marquee, 'shadowY', 'outerShadowY');
    add(marquee, 'shadowBlur', 'outerShadowBlur');
    add(marquee, 'shadowSize', 'outerShadowSize');

    const valueList: ThemeMapping = {};
    add(valueList, 'accent', 'bulletColor');

    const table: ThemeMapping = {};
    add(table, 'surfaceVariant', 'backgroundHeader');
    add(table, 'surface', 'backgroundOddRow', 'backgroundEvenRow');
    add(table, 'border', 'headerBorderColor', 'rowBorderColor', 'borderColor');
    add(
        table,
        'radius',
        'borderRadiusTopLeft',
        'borderRadiusTopRight',
        'borderRadiusBottomRight',
        'borderRadiusBottomLeft',
    );
    add(table, 'borderWidth', 'borderSizeTop', 'borderSizeBottom', 'borderSizeLeft', 'borderSizeRight');
    add(table, 'borderStyle', 'borderStyle');
    add(table, 'shadow', 'outerShadowColor');
    add(table, 'shadowX', 'outerShadowX');
    add(table, 'shadowY', 'outerShadowY');
    add(table, 'shadowBlur', 'outerShadowBlur');
    add(table, 'shadowSize', 'outerShadowSize');

    const calendar: ThemeMapping = {};
    add(calendar, 'text', 'headerTextColor', 'headerIconHoverColor', 'dayTextColor', 'todayTextColor');
    add(
        calendar,
        'textMuted',
        'headerIconColor',
        'weekdayTextColor',
        'dayOutsideMonthTextColor',
        'dayDisabledTextColor',
        'weekNumberTextColor',
    );
    add(calendar, 'surfaceVariant', 'dayHoverColor');
    add(calendar, 'accent', 'selectedBackgroundColor', 'todayBorderColor');
    add(calendar, 'onAccent', 'selectedTextColor');
    add(calendar, 'shadow', 'selectedShadowColor');

    const eventCalendar: ThemeMapping = {};
    add(eventCalendar, 'text', 'fcHeaderTextColor', 'fcDayTextColor', 'fcTodayTextColor');
    add(
        eventCalendar,
        'accent',
        'fcHeaderButtonTextColor',
        'fcHeaderButtonHoverBackgroundColor',
        'fcTodayBorderColor',
        'fcEventBackgroundColor',
        'fcEventBorderColor',
    );
    add(eventCalendar, 'border', 'fcHeaderButtonBorderColor', 'fcBorderColor');
    add(eventCalendar, 'radiusSmall', 'fcHeaderButtonBorderRadius', 'fcEventBorderRadius');
    add(eventCalendar, 'onAccent', 'fcHeaderButtonHoverTextColor', 'fcEventTextColor');
    add(
        eventCalendar,
        'textMuted',
        'fcWeekdayTextColor',
        'fcDayOutsideMonthTextColor',
        'fcWeekNumberTextColor',
        'fcMoreTextColor',
    );

    return {
        tplInventwoWidgetSlider: slider,
        tplInventwoWidgetRadialSlider: radial,
        tplInventwoWidgetSwitch: sw,
        tplInventwoWidgetCheckbox: checkbox,
        tplInventwoWidgetDropdown: dropdown,
        tplInventwoWidgetMarquee: marquee,
        tplInventwoWidgetValueList: valueList,
        tplInventwoWidgetTable: table,
        tplInventwoWidgetCalendar: calendar,
        tplInventwoWidgetEventCalendar: eventCalendar,
    };
})();

/** Fields of a widget of type `tpl` with data `data` that the theme controls */
export function getThemeMapping(tpl: string, data: Record<string, any>): ThemeMapping {
    if (tpl === 'tplInventwoWidgetUniversal') {
        return universalMapping(data || {});
    }
    const mapping = STATIC_MAPPINGS[tpl];
    return mapping ? { ...mapping } : {};
}

/** Style properties (rxStyle) the theme fills for every widget */
const STYLE_MAPPING: Readonly<Record<string, ThemeTokenKey>> = {
    color: 'text',
    'font-family': 'fontFamily',
};

/**
 * Values written by `applyTheme` into an object: field -> { before, written }. vis-2 may reuse the same pending
 * `rxData` object for several updates; this lets a later call replace (or remove) the token values written earlier
 * instead of treating them as the user's own values.
 */
const written = new WeakMap<object, Map<string, { before: unknown; value: unknown }>>();

function fill(
    target: Record<string, any>,
    entries: [string, ThemeTokenKey][],
    theme: ThemeInfo | undefined,
    skipEmptyTokens: boolean,
): void {
    let marks = written.get(target);
    const wanted = new Set<string>();
    entries.forEach(([field, token]) => {
        if (!theme) {
            return;
        }
        const tokenValue = theme.tokens[token];
        if (tokenValue === undefined || (skipEmptyTokens && tokenValue === '')) {
            return;
        }
        const mark = marks?.get(field);
        const current = target[field];
        const ours = mark !== undefined && current === mark.value;
        if (!ours && !isEmpty(current)) {
            // Own value wins
            return;
        }
        if (!marks) {
            marks = new Map();
            written.set(target, marks);
        }
        marks.set(field, { before: ours ? mark.before : current, value: tokenValue });
        target[field] = tokenValue;
        wanted.add(field);
    });
    // Remove token values written earlier that do not apply anymore (decoupled, field no longer mapped)
    const allMarks = marks;
    allMarks?.forEach((mark, field) => {
        if (wanted.has(field)) {
            return;
        }
        if (target[field] === mark.value) {
            if (mark.before === undefined) {
                delete target[field];
            } else {
                target[field] = mark.before;
            }
        }
        allMarks.delete(field);
    });
}

/**
 * Fills every mapped field whose value is empty (undefined, null, '') with the token value; also rxStyle `color`
 * (text) and `font-family` (fontFamily, only if not empty) when the style value is empty. Mutates the objects.
 * Calling it again on the same objects is safe: values it wrote before are updated to the current tokens.
 */
export function applyTheme(
    tpl: string,
    rxData: Record<string, any>,
    rxStyle: Record<string, any> | undefined,
    theme: ThemeInfo,
): void {
    if (rxData && typeof rxData === 'object') {
        fill(rxData, Object.entries(getThemeMapping(tpl, rxData)), theme, false);
    }
    if (rxStyle && typeof rxStyle === 'object') {
        fill(rxStyle, Object.entries(STYLE_MAPPING), theme, true);
    }
}

/**
 * Reverts what `applyTheme` wrote into these objects (for a widget that is not coupled anymore while vis-2 still
 * holds the same pending objects). Values changed by others meanwhile are kept.
 */
export function removeTheme(rxData: Record<string, any> | undefined, rxStyle?: Record<string, any>): void {
    if (rxData && typeof rxData === 'object' && written.has(rxData)) {
        fill(rxData, [], undefined, false);
    }
    if (rxStyle && typeof rxStyle === 'object' && written.has(rxStyle)) {
        fill(rxStyle, [], undefined, true);
    }
}
