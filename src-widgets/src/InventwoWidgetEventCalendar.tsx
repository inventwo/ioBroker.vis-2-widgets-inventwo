import React from 'react';
import type { SxProps } from '@mui/material';
import { Box } from '@mui/material';

import FullCalendar from '@fullcalendar/react';
import type { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import fcDeLocale from '@fullcalendar/core/locales/de';
import fcRuLocale from '@fullcalendar/core/locales/ru';
import fcPtLocale from '@fullcalendar/core/locales/pt';
import fcNlLocale from '@fullcalendar/core/locales/nl';
import fcFrLocale from '@fullcalendar/core/locales/fr';
import fcItLocale from '@fullcalendar/core/locales/it';
import fcEsLocale from '@fullcalendar/core/locales/es';
import fcPlLocale from '@fullcalendar/core/locales/pl';
import fcUkLocale from '@fullcalendar/core/locales/uk';
import fcZhCnLocale from '@fullcalendar/core/locales/zh-cn';

import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import { createDocsLinkField } from './utils/docLinkField';

const SUPPORTED_LOCALES = ['en', 'de', 'ru', 'pt', 'nl', 'fr', 'it', 'es', 'pl', 'uk', 'zh-cn'];

const FULLCALENDAR_LOCALES: Record<string, any> = {
    de: fcDeLocale,
    ru: fcRuLocale,
    pt: fcPtLocale,
    nl: fcNlLocale,
    fr: fcFrLocale,
    it: fcItLocale,
    es: fcEsLocale,
    pl: fcPlLocale,
    uk: fcUkLocale,
    'zh-cn': fcZhCnLocale,
};

function resolveDayjsLocale(): string {
    const lang = (navigator.language || 'en').toLowerCase();
    if (lang.startsWith('zh')) {
        return 'zh-cn';
    }
    const base = lang.split('-')[0];
    return SUPPORTED_LOCALES.includes(base) ? base : 'en';
}

type EventCalendarView = 'month' | 'week' | 'day' | 'listDay' | 'listWeek' | 'listMonth' | 'listYear' | 'multiMonth';

function mapFullCalendarView(view: EventCalendarView): string {
    switch (view) {
        case 'week':
            return 'timeGridWeek';
        case 'day':
            return 'timeGridDay';
        case 'listDay':
            return 'listDay';
        case 'listWeek':
            return 'listWeek';
        case 'listMonth':
            return 'listMonth';
        case 'listYear':
            return 'listYear';
        case 'multiMonth':
            return 'multiMonthYear';
        default:
            return 'dayGridMonth';
    }
}

/**
 * Field names come in two flavors: a simple custom JSON shape (`title`/`start`/`end`/`color`),
 * and the native shape produced by the ioBroker `ical` adapter's JSON datapoint
 * (`event`/`_date`/`_end`/`_calColor`/`_allDay`), which can be pointed at directly.
 */
interface CalendarEventItem {
    title?: string;
    summary?: string;
    event?: string;
    start?: string | number;
    end?: string | number;
    _date?: string | number;
    _end?: string | number;
    allDay?: boolean;
    _allDay?: boolean;
    color?: string;
    _calColor?: string;
}

function getEventTitle(event: CalendarEventItem): string {
    return event.title || event.summary || event.event || '';
}

function getEventColor(event: CalendarEventItem): string | undefined {
    return event.color || event._calColor;
}

function getEventStart(event: CalendarEventItem): string | number | undefined {
    return event.start ?? event._date;
}

function getEventEnd(event: CalendarEventItem): string | number | undefined {
    return event.end ?? event._end;
}

function isEventAllDay(event: CalendarEventItem): boolean {
    return Boolean(event.allDay ?? event._allDay);
}

function parseCalendarEvents(value: any): CalendarEventItem[] {
    if (value === undefined || value === null || value === '') {
        return [];
    }
    let data: any = value;
    if (typeof value === 'string') {
        try {
            data = JSON.parse(value);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(data)) {
        return [];
    }
    return data.filter(item => item && typeof item === 'object' && getEventStart(item) !== undefined);
}

/**
 * FullCalendar itself follows the iCal convention that all-day event ends are exclusive
 * (the day *after* the last visible day), so the raw start/end values can be handed over
 * as-is - including the ioBroker `ical` adapter's native `_date`/`_end` fields - without any
 * adjustment.
 */
function toFullCalendarEvents(events: CalendarEventItem[]): EventInput[] {
    return events.reduce<EventInput[]>((result, event) => {
        const start = getEventStart(event);
        if (start === undefined) {
            return result;
        }
        result.push({
            title: getEventTitle(event),
            start,
            end: getEventEnd(event),
            allDay: isEventAllDay(event),
            backgroundColor: getEventColor(event),
            borderColor: getEventColor(event),
        });
        return result;
    }, []);
}

interface EventColorRule {
    match: string;
    color: string;
}

/**
 * Manual name-based color override. Needed because the ioBroker `ical` adapter only exposes
 * one color per calendar (`_calColor`), not per event (unlike Google Calendar's own event
 * colors), so events from the same calendar can't otherwise be told apart by color.
 * Case-insensitive substring match; the first matching rule wins.
 */
function getEventColorOverride(title: string, rules: EventColorRule[]): string | undefined {
    const lowerTitle = title.toLowerCase();
    const rule = rules.find(r => r.match && lowerTitle.includes(r.match.toLowerCase()));
    return rule?.color;
}

function applyEventColorRules(events: EventInput[], rules: EventColorRule[]): EventInput[] {
    if (!rules.length) {
        return events;
    }
    return events.map(event => {
        const color = getEventColorOverride(String(event.title ?? ''), rules);
        return color ? { ...event, backgroundColor: color, borderColor: color } : event;
    });
}

interface EventCalendarRxData {
    eventsOid: null | string;
    firstDayOfWeek: 'monday' | 'sunday';
    countEventColorRules: number;
    [key: `eventColorRuleMatch${number}`]: string;
    [key: `eventColorRuleColor${number}`]: string;
    fcView: EventCalendarView;
    fcShowHeader: boolean;
    fcAllowNavigation: boolean;
    fcShowWeekNumbers: boolean;
    fcWeekNumberType: 'iso' | 'simple';

    fcHeaderFromWidget: string;
    fcHeaderTextColor: string;
    fcHeaderFontSize: number;
    fcHeaderButtonTextColor: string;
    fcHeaderButtonBackgroundColor: string;
    fcHeaderButtonBorderColor: string;
    fcHeaderButtonBorderRadius: number;
    fcHeaderButtonHoverTextColor: string;
    fcHeaderButtonHoverBackgroundColor: string;

    fcWeekdaysFromWidget: string;
    fcWeekdayTextColor: string;
    fcWeekdayBackgroundColor: string;
    fcWeekdayFontSize: number;

    fcDayFromWidget: string;
    fcDayTextColor: string;
    fcDayFontSize: number;
    fcDayOutsideMonthTextColor: string;
    fcWeekendBackgroundColor: string;
    fcWeekNumberTextColor: string;
    fcWeekNumberBackgroundColor: string;
    fcWeekNumberFontSize: number;

    fcTodayFromWidget: string;
    fcTodayBackgroundColor: string;
    fcTodayTextColor: string;
    fcTodayBorderColor: string;
    fcTodayBorderWidth: number;
    fcShowNowIndicator: boolean;
    fcNowIndicatorColor: string;

    fcEventFromWidget: string;
    fcEventBackgroundColor: string;
    fcEventTextColor: string;
    fcEventBorderColor: string;
    fcEventBorderRadius: number;
    fcEventFontSize: number;
    fcMoreTextColor: string;

    fcBorderFromWidget: string;
    fcShowBorders: boolean;
    fcBorderWidth: number;
    fcBorderColor: string;
}

interface EventCalendarState extends VisRxWidgetState {
    events: EventInput[];
}

export default class InventwoWidgetEventCalendar extends InventwoGeneric<EventCalendarRxData, EventCalendarState> {
    private fullCalendarRef = React.createRef<FullCalendar>();
    private fullCalendarResizeObserver: ResizeObserver | null = null;

    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = {
            ...this.state,
            events: [],
        };
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.setState({
            events: toFullCalendarEvents(parseCalendarEvents(this.getValue(this.state.rxData.eventsOid))),
        });
    }

    componentDidUpdate(
        prevProps: VisRxWidgetProps,
        prevState: EventCalendarState & { rxData: EventCalendarRxData },
    ): void {
        super.componentDidUpdate?.(prevProps, prevState);

        const api = this.fullCalendarRef.current?.getApi();
        if (api && api.view.type !== mapFullCalendarView(this.state.rxData.fcView ?? 'month')) {
            api.changeView(mapFullCalendarView(this.state.rxData.fcView ?? 'month'));
        }
    }

    componentWillUnmount(): void {
        super.componentWillUnmount?.();
        this.fullCalendarResizeObserver?.disconnect();
    }

    /**
     * FullCalendar caches its measured size on mount and only recalculates on the browser
     * window's resize event - resizing just the widget's container (e.g. dragging its handles
     * in the vis editor) doesn't fire that event, so the calendar would stay at its old size
     * until the page is reloaded. Observing the container directly and calling `updateSize()`
     * keeps it in sync immediately.
     */
    attachFullCalendarContainer = (node: HTMLDivElement | null): void => {
        this.fullCalendarResizeObserver?.disconnect();
        this.fullCalendarResizeObserver = null;
        if (node) {
            this.fullCalendarResizeObserver = new ResizeObserver(() => {
                this.fullCalendarRef.current?.getApi().updateSize();
            });
            this.fullCalendarResizeObserver.observe(node);
        }
    };

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetEventCalendar',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_event_calendar',
            visName: 'widget_event_calendar',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        createDocsLinkField('docs/en/widgets/event-calendar-widget.md') as any,
                        {
                            name: 'eventsOid',
                            type: 'id',
                            label: 'calendar_events_oid',
                            tooltip: 'calendar_events_oid_help',
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
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: 'fcView',
                            type: 'select',
                            options: [
                                { value: 'month', label: 'calendar_fc_view_month' },
                                { value: 'week', label: 'calendar_fc_view_week' },
                                { value: 'day', label: 'calendar_fc_view_day' },
                                { value: 'multiMonth', label: 'calendar_fc_view_multi_month' },
                                { value: 'listDay', label: 'calendar_fc_view_list_day' },
                                { value: 'listWeek', label: 'calendar_fc_view_list_week' },
                                { value: 'listMonth', label: 'calendar_fc_view_list_month' },
                                { value: 'listYear', label: 'calendar_fc_view_list_year' },
                            ],
                            default: 'month',
                            label: 'calendar_fc_view',
                        },
                        {
                            name: 'fcShowHeader',
                            type: 'checkbox',
                            label: 'calendar_fc_show_header',
                            default: true,
                        },
                        {
                            name: 'fcAllowNavigation',
                            type: 'checkbox',
                            label: 'calendar_fc_allow_navigation',
                            default: true,
                            hidden: '!data.fcShowHeader',
                        },
                        {
                            name: 'fcShowWeekNumbers',
                            type: 'checkbox',
                            label: 'calendar_show_week_numbers',
                            default: false,
                        },
                        {
                            name: 'fcWeekNumberType',
                            type: 'select',
                            options: [
                                { value: 'iso', label: 'week_number_type_iso' },
                                { value: 'simple', label: 'week_number_type_simple' },
                            ],
                            default: 'iso',
                            label: 'calendar_week_number_type',
                            tooltip: 'calendar_week_number_type_help',
                            hidden: '!data.fcShowWeekNumbers',
                        },
                    ],
                },
                {
                    name: 'attr_group_event_color_rules',
                    label: 'attr_group_event_color_rules',
                    fields: [
                        {
                            name: 'countEventColorRules',
                            type: 'number',
                            default: 0,
                            label: 'count_event_color_rules',
                        },
                    ],
                },
                {
                    name: 'countEventColorRules',
                    indexFrom: 1,
                    indexTo: 'countEventColorRules',
                    label: 'attr_group_event_color_rule',
                    fields: [
                        {
                            name: 'eventColorRuleMatch',
                            type: 'text',
                            label: 'event_color_rule_match',
                        },
                        {
                            name: 'eventColorRuleColor',
                            type: 'color',
                            label: 'event_color_rule_color',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_fc_header',
                    label: 'attr_group_css_calendar_fc_header',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'fcHeaderFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetEventCalendar',
                            all: true,
                        },
                        {
                            name: 'fcHeaderTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'fc_header_text_color',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderFontSize',
                            type: 'slider',
                            min: 10,
                            max: 40,
                            step: 1,
                            default: 20,
                            label: 'fc_header_font_size',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_fc_header_buttons',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderButtonTextColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'fc_header_button_text_color',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderButtonBackgroundColor',
                            type: 'color',
                            default: 'transparent',
                            label: 'fc_header_button_background_color',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderButtonBorderColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'fc_header_button_border_color',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderButtonBorderRadius',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 4,
                            label: 'fc_header_button_border_radius',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderButtonHoverTextColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'fc_header_button_hover_text_color',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                        {
                            name: 'fcHeaderButtonHoverBackgroundColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'fc_header_button_hover_background_color',
                            hidden: '!!data.fcHeaderFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_fc_weekdays',
                    label: 'attr_group_css_calendar_fc_weekdays',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'fcWeekdaysFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetEventCalendar',
                            all: true,
                        },
                        {
                            name: 'fcWeekdayTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.54)',
                            label: 'fc_weekday_text_color',
                            hidden: '!!data.fcWeekdaysFromWidget',
                        },
                        {
                            name: 'fcWeekdayBackgroundColor',
                            type: 'color',
                            default: 'transparent',
                            label: 'fc_weekday_background_color',
                            hidden: '!!data.fcWeekdaysFromWidget',
                        },
                        {
                            name: 'fcWeekdayFontSize',
                            type: 'slider',
                            min: 8,
                            max: 24,
                            step: 1,
                            default: 13,
                            label: 'fc_weekday_font_size',
                            hidden: '!!data.fcWeekdaysFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_fc_day',
                    label: 'attr_group_css_calendar_fc_day',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'fcDayFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetEventCalendar',
                            all: true,
                        },
                        {
                            name: 'fcDayTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'fc_day_text_color',
                            hidden: '!!data.fcDayFromWidget',
                        },
                        {
                            name: 'fcDayFontSize',
                            type: 'slider',
                            min: 8,
                            max: 24,
                            step: 1,
                            default: 13,
                            label: 'fc_day_font_size',
                            hidden: '!!data.fcDayFromWidget',
                        },
                        {
                            name: 'fcDayOutsideMonthTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.38)',
                            label: 'fc_day_outside_month_text_color',
                            hidden: '!!data.fcDayFromWidget',
                        },
                        {
                            name: 'fcWeekendBackgroundColor',
                            type: 'color',
                            default: 'transparent',
                            label: 'fc_weekend_background_color',
                            hidden: '!!data.fcDayFromWidget',
                        },
                        {
                            name: 'fcWeekNumberTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.38)',
                            label: 'week_number_text_color',
                            hidden: '!!data.fcDayFromWidget || !data.fcShowWeekNumbers',
                        },
                        {
                            name: 'fcWeekNumberBackgroundColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.04)',
                            label: 'fc_week_number_background_color',
                            hidden: '!!data.fcDayFromWidget || !data.fcShowWeekNumbers',
                        },
                        {
                            name: 'fcWeekNumberFontSize',
                            type: 'slider',
                            min: 6,
                            max: 24,
                            step: 1,
                            default: 11,
                            label: 'fc_week_number_font_size',
                            hidden: '!!data.fcDayFromWidget || !data.fcShowWeekNumbers',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_fc_today',
                    label: 'attr_group_css_calendar_fc_today',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'fcTodayFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetEventCalendar',
                            all: true,
                        },
                        {
                            name: 'fcTodayBackgroundColor',
                            type: 'color',
                            default: 'rgba(94, 107, 63, 0.08)',
                            label: 'fc_today_background_color',
                            hidden: '!!data.fcTodayFromWidget',
                        },
                        {
                            name: 'fcTodayTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.87)',
                            label: 'fc_today_text_color',
                            hidden: '!!data.fcTodayFromWidget',
                        },
                        {
                            name: 'fcTodayBorderColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'fc_today_border_color',
                            hidden: '!!data.fcTodayFromWidget',
                        },
                        {
                            name: 'fcTodayBorderWidth',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 2,
                            label: 'fc_today_border_width',
                            hidden: '!!data.fcTodayFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.fcTodayFromWidget',
                        },
                        {
                            name: 'fcShowNowIndicator',
                            type: 'checkbox',
                            default: true,
                            label: 'fc_show_now_indicator',
                            tooltip: 'fc_show_now_indicator_help',
                            hidden: '!!data.fcTodayFromWidget',
                        },
                        {
                            name: 'fcNowIndicatorColor',
                            type: 'color',
                            default: 'rgb(217,72,63)',
                            label: 'fc_now_indicator_color',
                            hidden: '!!data.fcTodayFromWidget || !data.fcShowNowIndicator',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_fc_event',
                    label: 'attr_group_css_calendar_fc_event',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'fcEventFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetEventCalendar',
                            all: true,
                        },
                        {
                            name: 'fcEventBackgroundColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'fc_event_background_color',
                            hidden: '!!data.fcEventFromWidget',
                        },
                        {
                            name: 'fcEventTextColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'fc_event_text_color',
                            hidden: '!!data.fcEventFromWidget',
                        },
                        {
                            name: 'fcEventBorderColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'fc_event_border_color',
                            hidden: '!!data.fcEventFromWidget',
                        },
                        {
                            name: 'fcEventBorderRadius',
                            type: 'slider',
                            min: 0,
                            max: 20,
                            step: 1,
                            default: 4,
                            label: 'fc_event_border_radius',
                            hidden: '!!data.fcEventFromWidget',
                        },
                        {
                            name: 'fcEventFontSize',
                            type: 'slider',
                            min: 8,
                            max: 24,
                            step: 1,
                            default: 12,
                            label: 'fc_event_font_size',
                            hidden: '!!data.fcEventFromWidget',
                        },
                        {
                            name: 'fcMoreTextColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.6)',
                            label: 'fc_more_text_color',
                            hidden: '!!data.fcEventFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_calendar_fc_border',
                    label: 'attr_group_css_calendar_fc_border',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'fcBorderFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetEventCalendar',
                            all: true,
                        },
                        {
                            name: 'fcShowBorders',
                            type: 'checkbox',
                            default: true,
                            label: 'fc_show_borders',
                            hidden: '!!data.fcBorderFromWidget',
                        },
                        {
                            name: 'fcBorderWidth',
                            type: 'slider',
                            min: 0,
                            max: 5,
                            step: 1,
                            default: 1,
                            label: 'fc_border_width',
                            hidden: '!!data.fcBorderFromWidget || !data.fcShowBorders',
                        },
                        {
                            name: 'fcBorderColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.12)',
                            label: 'fc_border_color',
                            hidden: '!!data.fcBorderFromWidget || !data.fcShowBorders',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 600,
                height: 500,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-event-calendar.png',
        };
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetEventCalendar.getWidgetInfo();
    }

    onStateUpdated(id: string | null, state: ioBroker.State): void {
        if (id === this.state.rxData.eventsOid && state) {
            this.setState({ events: toFullCalendarEvents(parseCalendarEvents(state.val)) });
        }
    }

    getEventColorRules(): EventColorRule[] {
        const rxData = this.state.rxData;
        const count = rxData.countEventColorRules ?? 0;
        const rules: EventColorRule[] = [];
        for (let i = 1; i <= count; i++) {
            const match = rxData[`eventColorRuleMatch${i}`];
            const color = rxData[`eventColorRuleColor${i}`];
            if (match && color) {
                rules.push({ match, color });
            }
        }
        return rules;
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const rxData = this.state.rxData;
        const headerStyle = this.getStyle('fcHeaderFromWidget', this.groupAttrs.attr_group_css_calendar_fc_header);
        const weekdaysStyle = this.getStyle(
            'fcWeekdaysFromWidget',
            this.groupAttrs.attr_group_css_calendar_fc_weekdays,
        );
        const dayStyle = this.getStyle('fcDayFromWidget', this.groupAttrs.attr_group_css_calendar_fc_day);
        const todayStyle = this.getStyle('fcTodayFromWidget', this.groupAttrs.attr_group_css_calendar_fc_today);
        const eventStyle = this.getStyle('fcEventFromWidget', this.groupAttrs.attr_group_css_calendar_fc_event);
        const borderStyle = this.getStyle('fcBorderFromWidget', this.groupAttrs.attr_group_css_calendar_fc_border);
        const weekStartsOn: 0 | 1 = rxData.firstDayOfWeek === 'sunday' ? 0 : 1;
        const locale = resolveDayjsLocale();

        const showBorders = borderStyle.fcShowBorders ?? true;
        const borderWidth = showBorders ? (borderStyle.fcBorderWidth ?? 1) : 0;
        const showNowIndicator = todayStyle.fcShowNowIndicator ?? true;

        const fcSx: SxProps = {
            width: '100%',
            height: '100%',
            color: this.state.rxStyle!.color,
            fontFamily: this.state.rxStyle!['font-family'],
            '& .fc': {
                height: '100%',
            },
            '& .fc-toolbar-title': {
                color: headerStyle.fcHeaderTextColor,
                fontSize: `${headerStyle.fcHeaderFontSize ?? 20}px`,
            },
            // Applies uniformly to prev/next/today - FullCalendar gives all three the same
            // "fc-button fc-button-primary" classes, so one rule covers all of them; the
            // colors need !important because FullCalendar's own ".fc-button-primary" rule
            // (same specificity, via CSS variables) would otherwise win depending on
            // stylesheet injection order - the same issue as the list/week-number overrides.
            '& .fc-button': {
                color: `${headerStyle.fcHeaderButtonTextColor} !important`,
                backgroundColor: `${headerStyle.fcHeaderButtonBackgroundColor} !important`,
                borderColor: `${headerStyle.fcHeaderButtonBorderColor} !important`,
                borderRadius: `${headerStyle.fcHeaderButtonBorderRadius ?? 4}px`,
                boxShadow: 'none',
            },
            // The "today" button is disabled once the view already shows today's period, and
            // FullCalendar's ".fc-button-primary:disabled" rule re-asserts its own default
            // colors (via the same CSS variables) at that point, undoing the rule above.
            '& .fc-button:disabled': {
                color: `${headerStyle.fcHeaderButtonTextColor} !important`,
                backgroundColor: `${headerStyle.fcHeaderButtonBackgroundColor} !important`,
                borderColor: `${headerStyle.fcHeaderButtonBorderColor} !important`,
            },
            '& .fc-button:hover, & .fc-button:focus, & .fc-button-active': {
                color: `${headerStyle.fcHeaderButtonHoverTextColor} !important`,
                backgroundColor: `${headerStyle.fcHeaderButtonHoverBackgroundColor} !important`,
                borderColor: `${headerStyle.fcHeaderButtonHoverBackgroundColor} !important`,
                boxShadow: 'none',
            },
            // The prev/next chevrons render at 1.5em (FullCalendar's default icon size),
            // taller than the "today" button's plain 1em text, so the grouped prev/next
            // buttons end up visibly taller - shrinking the icon to match the text size
            // equalizes the button heights.
            '& .fc-icon': {
                fontSize: '1em',
                verticalAlign: 'middle',
            },
            '& .fc-col-header-cell': {
                backgroundColor: `${weekdaysStyle.fcWeekdayBackgroundColor} !important`,
            },
            // FullCalendar's own stylesheet paints the background on the <th> itself
            // (".fc .fc-list-sticky .fc-list-day > *" using --fc-page-bg-color), not on the
            // "-cushion" div inside it - overriding the cushion alone leaves that <th>
            // background showing through, so the same ">*" target has to be styled directly.
            '& .fc-list-day > *': {
                backgroundColor: `${weekdaysStyle.fcWeekdayBackgroundColor} !important`,
            },
            '& .fc-list-day-cushion': {
                backgroundColor: `${weekdaysStyle.fcWeekdayBackgroundColor} !important`,
            },
            '& .fc-col-header-cell-cushion, & .fc-list-day-text, & .fc-list-day-side-text': {
                color: weekdaysStyle.fcWeekdayTextColor,
                fontSize: `${weekdaysStyle.fcWeekdayFontSize ?? 13}px`,
            },
            '& .fc-daygrid-day-number': {
                color: dayStyle.fcDayTextColor,
                fontSize: `${dayStyle.fcDayFontSize ?? 13}px`,
            },
            '& .fc-day-other .fc-daygrid-day-number': {
                color: dayStyle.fcDayOutsideMonthTextColor,
            },
            '& .fc-day-sat, & .fc-day-sun': {
                backgroundColor: dayStyle.fcWeekendBackgroundColor,
            },
            '& .fc-day-today': {
                backgroundColor: `${todayStyle.fcTodayBackgroundColor} !important`,
                boxShadow: `inset 0 0 0 ${todayStyle.fcTodayBorderWidth ?? 2}px ${todayStyle.fcTodayBorderColor}`,
            },
            '& .fc-day-today .fc-daygrid-day-number, & .fc-day-today .fc-col-header-cell-cushion': {
                color: todayStyle.fcTodayTextColor,
            },
            '& .fc-timegrid-now-indicator-line': {
                borderColor: todayStyle.fcNowIndicatorColor,
            },
            '& .fc-timegrid-now-indicator-arrow': {
                borderColor: todayStyle.fcNowIndicatorColor,
                color: todayStyle.fcNowIndicatorColor,
            },
            '& .fc-theme-standard td, & .fc-theme-standard th, & .fc-theme-standard .fc-scrollgrid': {
                borderWidth: `${borderWidth}px`,
                borderColor: borderStyle.fcBorderColor,
                borderStyle: showBorders ? 'solid' : 'none',
            },
            '& .fc-event': {
                backgroundColor: eventStyle.fcEventBackgroundColor,
                borderColor: eventStyle.fcEventBorderColor,
                color: eventStyle.fcEventTextColor,
                borderRadius: `${eventStyle.fcEventBorderRadius ?? 4}px`,
                fontSize: `${eventStyle.fcEventFontSize ?? 12}px`,
            },
            '& .fc-daygrid-more-link': {
                color: eventStyle.fcMoreTextColor,
            },
            '& .fc-daygrid-week-number': {
                color: dayStyle.fcWeekNumberTextColor,
                backgroundColor: `${dayStyle.fcWeekNumberBackgroundColor} !important`,
                fontSize: `${dayStyle.fcWeekNumberFontSize ?? 11}px`,
            },
        };

        const headerToolbar: false | { left: string; center: string; right: string } = !rxData.fcShowHeader
            ? false
            : {
                  left: (rxData.fcAllowNavigation ?? true) ? 'prev,next today' : '',
                  center: 'title',
                  right: '',
              };

        const calendar = (
            <Box
                ref={this.attachFullCalendarContainer}
                sx={fcSx}
            >
                <FullCalendar
                    ref={this.fullCalendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin]}
                    initialView={mapFullCalendarView(rxData.fcView ?? 'month')}
                    headerToolbar={headerToolbar}
                    locale={FULLCALENDAR_LOCALES[locale]}
                    firstDay={weekStartsOn}
                    height="100%"
                    nowIndicator={showNowIndicator}
                    weekNumbers={rxData.fcShowWeekNumbers ?? false}
                    weekNumberCalculation={rxData.fcWeekNumberType === 'simple' ? 'local' : 'ISO'}
                    events={applyEventColorRules(this.state.events, this.getEventColorRules())}
                />
            </Box>
        );

        return this.props.editMode ? (
            <div style={{ pointerEvents: 'none', width: '100%', height: '100%' }}>{calendar}</div>
        ) : (
            calendar
        );
    }
}
