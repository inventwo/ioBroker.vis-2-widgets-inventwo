import React from 'react';
import type { SxProps } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/ru';
import 'dayjs/locale/pt';
import 'dayjs/locale/nl';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/es';
import 'dayjs/locale/pl';
import 'dayjs/locale/uk';
import 'dayjs/locale/zh-cn';

import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import { createDocsLinkField } from './utils/docLinkField';

const SUPPORTED_LOCALES = ['en', 'de', 'ru', 'pt', 'nl', 'fr', 'it', 'es', 'pl', 'uk', 'zh-cn'];

function resolveDayjsLocale(): string {
    const lang = (navigator.language || 'en').toLowerCase();
    if (lang.startsWith('zh')) {
        return 'zh-cn';
    }
    const base = lang.split('-')[0];
    return SUPPORTED_LOCALES.includes(base) ? base : 'en';
}

/**
 * Builds a per-instance AdapterDayjs subclass so first-day-of-week and week-number
 * calculation can be configured independently for every widget instance without
 * mutating the global dayjs locale (which would affect other widgets on the page).
 */
function createCalendarAdapter(weekStartsOn: 0 | 1, weekNumberType: 'iso' | 'simple'): typeof AdapterDayjs {
    return class extends AdapterDayjs {
        constructor(options: any) {
            super(options);

            this.startOfWeek = (value: Dayjs): Dayjs => {
                const day = value.day();
                const diff = (day - weekStartsOn + 7) % 7;
                return value.subtract(diff, 'day').startOf('day');
            };

            this.endOfWeek = (value: Dayjs): Dayjs => this.startOfWeek(value).add(6, 'day').endOf('day');

            this.getWeekNumber = (value: Dayjs): number => {
                const date = value.toDate();

                if (weekNumberType === 'simple') {
                    // Week 1 is the week that contains January 1st.
                    const startOfYear = new Date(date.getFullYear(), 0, 1);
                    const yearStartDay = startOfYear.getDay();
                    const diffToWeekStart = (yearStartDay - weekStartsOn + 7) % 7;
                    const startOfWeekOfYear = new Date(startOfYear);
                    startOfWeekOfYear.setDate(startOfYear.getDate() - diffToWeekStart);
                    const diffDays = Math.floor((date.getTime() - startOfWeekOfYear.getTime()) / 86400000);
                    return Math.floor(diffDays / 7) + 1;
                }

                // ISO-8601: weeks start on Monday, week 1 is the week containing the first Thursday.
                const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                const dayNum = (d.getUTCDay() + 6) % 7;
                d.setUTCDate(d.getUTCDate() - dayNum + 3);
                const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
                const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
                firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
                return 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
            };
        }
    };
}

interface CalendarRxData {
    oid: null | string;
    readOnly: boolean;
    oidFormat: 'timestamp' | 'iso';
    showToday: boolean;
    disablePast: boolean;
    disableFuture: boolean;
    allowMonthYearNavigation: boolean;
    firstDayOfWeek: 'monday' | 'sunday';
    showWeekNumbers: boolean;
    weekNumberType: 'iso' | 'simple';
    daySize: number;

    headerFromWidget: string;
    headerTextColor: string;
    headerIconColor: string;
    headerIconHoverColor: string;

    weekdaysFromWidget: string;
    weekdayTextColor: string;

    dayFromWidget: string;
    dayTextColor: string;
    dayHoverColor: string;
    dayBorderRadius: number;
    dayOutsideMonthTextColor: string;
    dayDisabledTextColor: string;

    selectedFromWidget: string;
    selectedBackgroundColor: string;
    selectedTextColor: string;
    selectedShadowX: number;
    selectedShadowY: number;
    selectedShadowBlur: number;
    selectedShadowSize: number;
    selectedShadowColor: string;

    todayFromWidget: string;
    todayBorderColor: string;
    todayBackgroundColor: string;
    todayTextColor: string;

    weekNumberFromWidget: string;
    weekNumberTextColor: string;
}

interface CalendarState extends VisRxWidgetState {
    selectedValue: Dayjs | null;
}

export default class InventwoWidgetCalendar extends InventwoGeneric<CalendarRxData, CalendarState> {
    private adapterCache: { key: string; AdapterClass: typeof AdapterDayjs } | null = null;

    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = {
            ...this.state,
            selectedValue: null,
        };
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.setState({ selectedValue: this.dateFromOidValue(this.getValue(this.state.rxData.oid)) });
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetCalendar',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_calendar',
            visName: 'widget_calendar',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        createDocsLinkField('docs/en/widgets/calendar-widget.md') as any,
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
                        },
                        {
                            name: 'oidFormat',
                            type: 'select',
                            options: [
                                { value: 'timestamp', label: 'oid_format_timestamp' },
                                { value: 'iso', label: 'oid_format_iso' },
                            ],
                            default: 'timestamp',
                            label: 'oid_format',
                        },
                        {
                            name: 'readOnly',
                            type: 'checkbox',
                            label: 'read_only',
                            default: false,
                        },
                        {
                            name: 'showToday',
                            type: 'checkbox',
                            label: 'calendar_show_today',
                            default: true,
                        },
                        {
                            name: 'disablePast',
                            type: 'checkbox',
                            label: 'calendar_disable_past',
                            default: false,
                        },
                        {
                            name: 'disableFuture',
                            type: 'checkbox',
                            label: 'calendar_disable_future',
                            default: false,
                        },
                        {
                            name: 'allowMonthYearNavigation',
                            type: 'checkbox',
                            label: 'calendar_year_month_navigation',
                            default: true,
                        },
                        {
                            name: 'firstDayOfWeek',
                            type: 'select',
                            options: [
                                { value: 'monday', label: 'monday' },
                                { value: 'sunday', label: 'sunday' },
                            ],
                            default: 'monday',
                            label: 'calendar_first_day_of_week',
                        },
                        {
                            name: 'showWeekNumbers',
                            type: 'checkbox',
                            label: 'calendar_show_week_numbers',
                            default: false,
                        },
                        {
                            name: 'weekNumberType',
                            type: 'select',
                            options: [
                                { value: 'iso', label: 'week_number_type_iso' },
                                { value: 'simple', label: 'week_number_type_simple' },
                            ],
                            default: 'iso',
                            label: 'calendar_week_number_type',
                            tooltip: 'calendar_week_number_type_help',
                            hidden: '!data.showWeekNumbers',
                        },
                        {
                            name: 'daySize',
                            type: 'slider',
                            min: 20,
                            max: 80,
                            step: 1,
                            default: 36,
                            label: 'day_size',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_header',
                    label: 'attr_group_css_calendar_header',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'headerFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCalendar',
                            all: true,
                        },
                        {
                            name: 'headerTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'header_text_color',
                            hidden: '!!data.headerFromWidget',
                        },
                        {
                            name: 'headerIconColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.54)',
                            label: 'header_icon_color',
                            hidden: '!!data.headerFromWidget',
                        },
                        {
                            name: 'headerIconHoverColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'header_icon_hover_color',
                            hidden: '!!data.headerFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_weekdays',
                    label: 'attr_group_css_calendar_weekdays',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'weekdaysFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCalendar',
                            all: true,
                        },
                        {
                            name: 'weekdayTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.54)',
                            label: 'weekday_text_color',
                            hidden: '!!data.weekdaysFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_day',
                    label: 'attr_group_css_calendar_day',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'dayFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCalendar',
                            all: true,
                        },
                        {
                            name: 'dayTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'day_text_color',
                            hidden: '!!data.dayFromWidget',
                        },
                        {
                            name: 'dayHoverColor',
                            type: 'color',
                            default: 'rgba(94, 107, 63, 0.15)',
                            label: 'day_hover_color',
                            hidden: '!!data.dayFromWidget',
                        },
                        {
                            name: 'dayBorderRadius',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 50,
                            label: 'day_border_radius',
                            hidden: '!!data.dayFromWidget',
                        },
                        {
                            name: 'dayOutsideMonthTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.38)',
                            label: 'day_outside_month_text_color',
                            hidden: '!!data.dayFromWidget',
                        },
                        {
                            name: 'dayDisabledTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.26)',
                            label: 'day_disabled_text_color',
                            hidden: '!!data.dayFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_day_selected',
                    label: 'attr_group_css_calendar_day_selected',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'selectedFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCalendar',
                            all: true,
                        },
                        {
                            name: 'selectedBackgroundColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'selected_background_color',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: 'selectedTextColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'selected_text_color',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_selected_shadow',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: 'selectedShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'x_offset',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: 'selectedShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: 'selectedShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 4,
                            label: 'blur',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: 'selectedShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'size',
                            hidden: '!!data.selectedFromWidget',
                        },
                        {
                            name: 'selectedShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.4)',
                            label: 'shadow_color',
                            hidden: '!!data.selectedFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_today',
                    label: 'attr_group_css_calendar_today',
                    hidden: '!data.showToday',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'todayFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCalendar',
                            all: true,
                        },
                        {
                            name: 'todayBorderColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'today_border_color',
                            hidden: '!!data.todayFromWidget',
                        },
                        {
                            name: 'todayBackgroundColor',
                            type: 'color',
                            default: 'rgba(94, 107, 63, 0.08)',
                            label: 'today_background_color',
                            hidden: '!!data.todayFromWidget',
                        },
                        {
                            name: 'todayTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'today_text_color',
                            hidden: '!!data.todayFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_week_number',
                    label: 'attr_group_css_calendar_week_number',
                    hidden: '!data.showWeekNumbers',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'weekNumberFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCalendar',
                            all: true,
                        },
                        {
                            name: 'weekNumberTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.38)',
                            label: 'week_number_text_color',
                            hidden: '!!data.weekNumberFromWidget',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 320,
                height: 350,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-calendar.png',
        };
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetCalendar.getWidgetInfo();
    }

    onStateUpdated(id: string | null, state: ioBroker.State): void {
        if (id === this.state.rxData.oid && state) {
            this.setState({ selectedValue: this.dateFromOidValue(state.val) });
        }
    }

    dateFromOidValue(value: any): Dayjs | null {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        if (this.state.rxData.oidFormat === 'iso') {
            const parsed = dayjs(value);
            return parsed.isValid() ? parsed : null;
        }
        const num = Number(value);
        if (Number.isNaN(num)) {
            return null;
        }
        const parsed = dayjs(num);
        return parsed.isValid() ? parsed : null;
    }

    oidValueFromDate(value: Dayjs): string | number {
        if (this.state.rxData.oidFormat === 'iso') {
            return value.format('YYYY-MM-DD');
        }
        return value.valueOf();
    }

    onDateChange(value: Dayjs | null): void {
        const oid = this.state.rxData.oid;
        if (!this.validOid(oid)) {
            return;
        }

        this.setState({ selectedValue: value });

        if (this.props.editMode || this.state.rxData.readOnly || !value) {
            return;
        }
        this.props.context.setValue(oid as string, this.oidValueFromDate(value));
    }

    getAdapterClass(weekStartsOn: 0 | 1, weekNumberType: 'iso' | 'simple'): typeof AdapterDayjs {
        const key = `${weekStartsOn}-${weekNumberType}`;
        if (this.adapterCache?.key !== key) {
            this.adapterCache = { key, AdapterClass: createCalendarAdapter(weekStartsOn, weekNumberType) };
        }
        return this.adapterCache.AdapterClass;
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const rxData = this.state.rxData;

        const headerStyle = this.getStyle('headerFromWidget', this.groupAttrs.attr_group_css_calendar_header);
        const weekdaysStyle = this.getStyle('weekdaysFromWidget', this.groupAttrs.attr_group_css_calendar_weekdays);
        const dayStyle = this.getStyle('dayFromWidget', this.groupAttrs.attr_group_css_calendar_day);
        const selectedStyle = this.getStyle('selectedFromWidget', this.groupAttrs.attr_group_css_calendar_day_selected);
        const todayStyle = this.getStyle('todayFromWidget', this.groupAttrs.attr_group_css_calendar_today);
        const weekNumberStyle = this.getStyle(
            'weekNumberFromWidget',
            this.groupAttrs.attr_group_css_calendar_week_number,
        );

        const weekStartsOn: 0 | 1 = rxData.firstDayOfWeek === 'sunday' ? 0 : 1;
        const AdapterClass = this.getAdapterClass(weekStartsOn, rxData.weekNumberType ?? 'iso');
        const locale = resolveDayjsLocale();

        const daySize = rxData.daySize ?? 36;

        const calendarSx: SxProps = {
            width: '100%',
            height: '100%',
            maxHeight: 'none',
            color: this.state.rxStyle!.color,
            fontFamily: this.state.rxStyle!['font-family'],
            '& .MuiPickersCalendarHeader-root': {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
            '& .MuiPickersCalendarHeader-label': {
                color: headerStyle.headerTextColor,
            },
            '& .MuiPickersCalendarHeader-switchViewButton': {
                color: headerStyle.headerIconColor,
                '&:hover': {
                    color: headerStyle.headerIconHoverColor,
                },
            },
            '& .MuiPickersArrowSwitcher-button': {
                color: headerStyle.headerIconColor,
                '&:hover': {
                    color: headerStyle.headerIconHoverColor,
                },
            },
            '& .MuiDayCalendar-weekDayLabel': {
                color: weekdaysStyle.weekdayTextColor,
                width: daySize,
                height: daySize,
            },
            '& .MuiDayCalendar-weekNumberLabel': {
                color: weekNumberStyle.weekNumberTextColor,
                width: daySize,
                height: daySize,
            },
            '& .MuiDayCalendar-weekNumber': {
                color: weekNumberStyle.weekNumberTextColor,
                width: daySize,
                height: daySize,
            },
            '& .MuiPickersDay-root': {
                color: dayStyle.dayTextColor,
                width: daySize,
                height: daySize,
                fontSize: this.state.rxStyle!['font-size'],
                borderRadius: `${dayStyle.dayBorderRadius}%`,
                '&:hover': {
                    backgroundColor: dayStyle.dayHoverColor,
                },
            },
            '& .MuiPickersDay-dayOutsideMonth': {
                color: dayStyle.dayOutsideMonthTextColor,
            },
            '& .MuiPickersDay-root.Mui-disabled': {
                color: dayStyle.dayDisabledTextColor,
            },
            '& .MuiPickersDay-root.MuiPickersDay-today': rxData.showToday
                ? {
                      borderColor: todayStyle.todayBorderColor,
                      backgroundColor: todayStyle.todayBackgroundColor,
                      color: todayStyle.todayTextColor,
                  }
                : {
                      border: 'none',
                  },
            '& .MuiPickersDay-root.Mui-selected': {
                backgroundColor: selectedStyle.selectedBackgroundColor,
                color: selectedStyle.selectedTextColor,
                boxShadow: `${selectedStyle.selectedShadowX}px ${selectedStyle.selectedShadowY}px ${selectedStyle.selectedShadowBlur}px ${selectedStyle.selectedShadowSize}px ${selectedStyle.selectedShadowColor}`,
                '&:hover': {
                    backgroundColor: selectedStyle.selectedBackgroundColor,
                },
                '&:focus': {
                    backgroundColor: selectedStyle.selectedBackgroundColor,
                },
            },
            // The row-height animation container has a fixed min-height based on the default
            // (non-configurable) day size, so it has to be scaled manually to match daySize -
            // otherwise larger day cells get visually cut off / trigger scrolling.
            '& .MuiDayCalendar-slideTransition, & .MuiDayCalendar-loadingContainer': {
                minHeight: (daySize + 4) * 6,
            },
            // Month/year selection grid (opened via the header label) - reuses the day and
            // selected-day colors so it stays consistent with the rest of the calendar instead
            // of falling back to the MUI default theme color.
            '& .MuiPickersYear-yearButton, & .MuiPickersMonth-monthButton': {
                color: dayStyle.dayTextColor,
                '&:hover': {
                    backgroundColor: dayStyle.dayHoverColor,
                },
            },
            '& .MuiPickersYear-yearButton.Mui-disabled, & .MuiPickersMonth-monthButton.Mui-disabled': {
                color: dayStyle.dayDisabledTextColor,
            },
            '& .MuiPickersYear-yearButton.Mui-selected, & .MuiPickersMonth-monthButton.Mui-selected': {
                backgroundColor: selectedStyle.selectedBackgroundColor,
                color: selectedStyle.selectedTextColor,
                '&:hover': {
                    backgroundColor: selectedStyle.selectedBackgroundColor,
                },
                '&:focus': {
                    backgroundColor: selectedStyle.selectedBackgroundColor,
                },
            },
        };

        const calendar = (
            <LocalizationProvider
                dateAdapter={AdapterClass}
                adapterLocale={locale}
            >
                <DateCalendar
                    sx={calendarSx}
                    value={this.state.selectedValue}
                    onChange={value => this.onDateChange(value)}
                    disablePast={rxData.disablePast}
                    disableFuture={rxData.disableFuture}
                    displayWeekNumber={rxData.showWeekNumbers}
                    showDaysOutsideCurrentMonth
                    views={rxData.allowMonthYearNavigation ? ['year', 'month', 'day'] : ['day']}
                />
            </LocalizationProvider>
        );

        return rxData.readOnly || this.props.editMode ? (
            <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>{calendar}</div>
        ) : (
            calendar
        );
    }
}
