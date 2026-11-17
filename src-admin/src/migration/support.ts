/** How well a vis-1 widget can be converted */
export type SupportLevel = 'full' | 'partial' | 'none';

export interface SupportEntry {
    /** Name of the widget in vis-1 */
    old: string;
    /** vis-2 widget (name or translation key) and the variant, e.g. the type of the universal widget */
    target: string;
    level: SupportLevel;
    /** Translation key of the remark */
    note?: string;
}

const UNIVERSAL = 'migration_support_universal';

/**
 * Overview for the user: which vis-1 widgets are converted to what – shown on the settings page before the migration.
 * Must be kept in sync with `convertInventwoWidget()` in convert.ts.
 */
export const SUPPORT: SupportEntry[] = [
    { old: 'Universal – Switch', target: UNIVERSAL, level: 'full' },
    { old: 'Universal – Background', target: UNIVERSAL, level: 'full' },
    { old: 'Universal – Navigation', target: UNIVERSAL, level: 'full' },
    { old: 'Universal – View in Popup', target: UNIVERSAL, level: 'full' },
    { old: 'Universal – State', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_state' },
    {
        old: 'Universal – Increase/Decrease value',
        target: UNIVERSAL,
        level: 'partial',
        note: 'migration_support_note_increase',
    },
    { old: 'Universal – HTTP', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_http' },
    { old: 'Universal – Clock', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_clock' },
    { old: 'Multi', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_multi' },
    { old: 'Switch, Switch small', target: UNIVERSAL, level: 'full' },
    { old: 'Background, Background small', target: UNIVERSAL, level: 'full' },
    { old: 'Button, Button small', target: UNIVERSAL, level: 'full' },
    { old: 'Navigation, Navigation small', target: UNIVERSAL, level: 'full' },
    { old: 'Image, Image (new)', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_image' },
    { old: 'Radiobutton list', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_radio' },
    { old: 'Color picker', target: UNIVERSAL, level: 'partial', note: 'migration_support_note_colorpicker' },
    { old: 'Checkbox', target: 'Checkbox', level: 'partial', note: 'migration_support_note_checkbox' },
    { old: 'Switch basic', target: 'Switch', level: 'partial', note: 'migration_support_note_switch_basic' },
    { old: 'Switch (rocker)', target: 'Switch', level: 'partial', note: 'migration_support_note_switch_rocker' },
    { old: 'Value list', target: 'Value List', level: 'full', note: 'migration_support_note_valuelist' },
    { old: 'Marquee', target: 'Marquee', level: 'partial', note: 'migration_support_note_marquee' },
    { old: 'JSON table', target: 'Table', level: 'partial', note: 'migration_support_note_table' },
    { old: 'Slider simple', target: 'Slider', level: 'partial', note: 'migration_support_note_slider' },
    { old: 'Color slider', target: '–', level: 'none', note: 'migration_support_note_color_slider' },
];
