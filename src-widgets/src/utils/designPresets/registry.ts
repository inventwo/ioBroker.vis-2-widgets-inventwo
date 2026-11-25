import type { RxWidgetInfo } from '@iobroker/types-vis-2';

import InventwoWidgetUniversal, { UNIVERSAL_DESIGN_SPEC } from '../../InventwoWidgetUniversal';
import InventwoWidgetSlider, { SLIDER_DESIGN_SPEC } from '../../InventwoWidgetSlider';
import InventwoWidgetRadialSlider, { RADIAL_SLIDER_DESIGN_SPEC } from '../../InventwoWidgetRadialSlider';
import InventwoWidgetSwitch, { SWITCH_DESIGN_SPEC } from '../../InventwoWidgetSwitch';
import InventwoWidgetCheckbox, { CHECKBOX_DESIGN_SPEC } from '../../InventwoWidgetCheckbox';
import InventwoWidgetDropdown, { DROPDOWN_DESIGN_SPEC } from '../../InventwoWidgetDropdown';
import InventwoWidgetMarquee, { MARQUEE_DESIGN_SPEC } from '../../InventwoWidgetMarquee';
import InventwoWidgetValueList, { VALUE_LIST_DESIGN_SPEC } from '../../InventwoWidgetValueList';
import InventwoWidgetTable, { TABLE_DESIGN_SPEC } from '../../InventwoWidgetTable';
import InventwoWidgetCalendar, { CALENDAR_DESIGN_SPEC } from '../../InventwoWidgetCalendar';
import InventwoWidgetEventCalendar, { EVENT_CALENDAR_DESIGN_SPEC } from '../../InventwoWidgetEventCalendar';
import type { DesignSpec } from './designFields';

/** A widget type that supports design presets */
export interface PresetWidgetType {
    /** Widget type (`tplInventwo…`), must match `getWidgetInfo().id` */
    id: string;
    getWidgetInfo: () => RxWidgetInfo;
    spec: DesignSpec;
}

/** All widget types with design presets, in the order the preset gallery shows them */
export const PRESET_WIDGET_TYPES: PresetWidgetType[] = [
    {
        id: 'tplInventwoWidgetUniversal',
        getWidgetInfo: () => InventwoWidgetUniversal.getWidgetInfo(),
        spec: UNIVERSAL_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetSlider',
        getWidgetInfo: () => InventwoWidgetSlider.getWidgetInfo(),
        spec: SLIDER_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetRadialSlider',
        getWidgetInfo: () => InventwoWidgetRadialSlider.getWidgetInfo(),
        spec: RADIAL_SLIDER_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetSwitch',
        getWidgetInfo: () => InventwoWidgetSwitch.getWidgetInfo(),
        spec: SWITCH_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetCheckbox',
        getWidgetInfo: () => InventwoWidgetCheckbox.getWidgetInfo(),
        spec: CHECKBOX_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetDropdown',
        getWidgetInfo: () => InventwoWidgetDropdown.getWidgetInfo(),
        spec: DROPDOWN_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetMarquee',
        getWidgetInfo: () => InventwoWidgetMarquee.getWidgetInfo(),
        spec: MARQUEE_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetValueList',
        getWidgetInfo: () => InventwoWidgetValueList.getWidgetInfo(),
        spec: VALUE_LIST_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetTable',
        getWidgetInfo: () => InventwoWidgetTable.getWidgetInfo(),
        spec: TABLE_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetCalendar',
        getWidgetInfo: () => InventwoWidgetCalendar.getWidgetInfo(),
        spec: CALENDAR_DESIGN_SPEC,
    },
    {
        id: 'tplInventwoWidgetEventCalendar',
        getWidgetInfo: () => InventwoWidgetEventCalendar.getWidgetInfo(),
        spec: EVENT_CALENDAR_DESIGN_SPEC,
    },
];
