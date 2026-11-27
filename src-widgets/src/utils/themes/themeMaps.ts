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

/**
 * Look of the active state (`designThemeActive`): `accent` fills the button with the accent color, `subtle` keeps
 * the tile and colors only the icon. `designThemeGlow` adds a shadow in the glow color to either of them.
 */
type ActiveStyle = 'accent' | 'subtle';

interface ActiveLook {
    style: ActiveStyle;
    /** Background of the active state with the subtle look */
    tile: ThemeTokenKey;
    /** Shadow color of the active state */
    shadow: ThemeTokenKey;
}

/** Adds the fields of an active state: background, icon, text and shadow color */
function addActive(
    m: ThemeMapping,
    look: ActiveLook,
    fields: { background: string; content: string; text: string; shadow: string },
): void {
    if (look.style === 'accent') {
        add(m, 'accent', fields.background);
        add(m, 'onAccentIcon', fields.content);
        add(m, 'onAccent', fields.text);
    } else {
        add(m, look.tile, fields.background);
        add(m, 'accent', fields.content);
        add(m, 'text', fields.text);
    }
    add(m, look.shadow, fields.shadow);
}

function universalMapping(data: Record<string, any>): ThemeMapping {
    const m: ThemeMapping = {};
    const surface = data.designThemeSurface || 'tile';
    if (surface === 'card') {
        add(m, 'surface', 'background');
    } else if (surface !== 'none') {
        add(m, 'surfaceVariant', 'background');
    }
    // Shadow of the surface: cards and tiles have their own shadow color; without an own surface there is none
    const surfaceShadow: ThemeTokenKey = surface === 'card' ? 'shadow' : 'shadowTile';
    // `glow` was a value of `designThemeActive` before the separate setting `designThemeGlow`
    const glow = !!data.designThemeGlow || data.designThemeActive === 'glow';
    const active: ActiveLook = {
        style: data.designThemeActive === 'subtle' || data.designThemeActive === 'glow' ? 'subtle' : 'accent',
        // without an own surface the active button gets the tile color
        tile: surface === 'card' ? 'surface' : 'surfaceVariant',
        shadow: glow ? 'glow' : surfaceShadow,
    };
    // Label (text) in the inactive state: `text` or `muted`; separated buttons used the secondary text before
    const label = data.designThemeLabel;
    add(m, 'icon', 'contentColor');
    add(m, label === 'muted' ? 'textMuted' : 'text', 'textColor');
    add(m, 'border', 'borderColor');
    if (surface !== 'none') {
        add(m, surfaceShadow, 'outerShadowColor');
    }
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
    add(m, 'onAccentIcon', 'contentColorFeedback');
    add(m, 'onAccent', 'textColorFeedback');
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
            add(m, 'icon', `contentColor${i}`);
            add(m, label === 'text' ? 'text' : 'textMuted', `textColor${i}`);
            add(m, 'border', `borderColor${i}`, `borderColorTrue${i}`);
            add(m, 'shadowTile', `outerShadowColor${i}`);
            addActive(
                m,
                { ...active, tile: 'surfaceVariant', shadow: glow ? 'glow' : 'shadowTile' },
                {
                    background: `backgroundTrue${i}`,
                    content: `contentColorTrue${i}`,
                    text: `textColorTrue${i}`,
                    shadow: `outerShadowColorTrue${i}`,
                },
            );
        }
    } else if (Number(data.countStates) === 1) {
        add(m, 'border', 'borderColor1');
        addActive(m, active, {
            background: 'background1',
            content: 'contentColor1',
            text: 'textColor1',
            shadow: 'outerShadowColor1',
        });
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
        'weekdayTextColor',
        'dayOutsideMonthTextColor',
        'dayDisabledTextColor',
        'weekNumberTextColor',
    );
    add(calendar, 'icon', 'headerIconColor');
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
