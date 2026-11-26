import type { SxProps } from '@mui/material';
import { Box } from '@mui/material';
import InventwoGeneric from './InventwoGeneric';
import type {
    RxWidgetInfo,
    VisRxWidgetState,
    VisRxWidgetProps,
    RxWidgetInfoAttributesField,
    WidgetData,
    RxRenderWidgetProps,
} from '@iobroker/types-vis-2';
import React from 'react';
import { createDocsLinkField } from './utils/docLinkField';
import { createDesignPresetField } from './utils/designPresets/DesignPresetField';
import { createThemeFields } from './utils/themes/ThemeField';
import type { DesignSpec } from './utils/designPresets/designFields';
import { createColorZoneGroups } from './utils/colorZoneFields';

function splitOutsideParens(str: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    for (const ch of str) {
        if (ch === '(') {
            depth++;
        } else if (ch === ')') {
            depth--;
        }
        if (ch === ',' && depth === 0) {
            parts.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    if (current.trim()) {
        parts.push(current.trim());
    }
    return parts;
}

function cssGradientToSvgDef(
    colorValue: string,
    id: string,
    size: number,
): { def: React.JSX.Element; strokeRef: string } | null {
    const trimmed = colorValue?.trim() ?? '';
    const match = trimmed.match(/^linear-gradient\((.+)\)$/s);
    if (!match) {
        return null;
    }

    const parts = splitOutsideParens(match[1]);
    let startIdx = 0;
    let angle = 180;

    const firstPart = parts[0]?.trim();
    if (firstPart && /^-?\d+(\.\d+)?deg$/i.test(firstPart)) {
        angle = parseFloat(firstPart);
        startIdx = 1;
    }

    const stops: Array<{ color: string; position: number }> = [];
    for (let i = startIdx; i < parts.length; i++) {
        const part = parts[i].trim();
        const stopMatch = part.match(/^(.*?)\s+(-?\d+(?:\.\d+)?)%\s*$/);
        if (stopMatch) {
            stops.push({ color: stopMatch[1].trim(), position: parseFloat(stopMatch[2]) / 100 });
        } else {
            stops.push({ color: part, position: -1 });
        }
    }

    if (stops.length === 0) {
        return null;
    }
    if (stops[0].position === -1) {
        stops[0].position = 0;
    }
    if (stops[stops.length - 1].position === -1) {
        stops[stops.length - 1].position = 1;
    }
    for (let i = 1; i < stops.length - 1; i++) {
        if (stops[i].position === -1) {
            let nextSet = i + 1;
            while (nextSet < stops.length && stops[nextSet].position === -1) {
                nextSet++;
            }
            stops[i].position =
                stops[i - 1].position +
                ((stops[nextSet].position - stops[i - 1].position) * (i - (i - 1))) / (nextSet - (i - 1));
        }
    }

    const rad = (angle * Math.PI) / 180;
    const cx = size / 2;
    const cy = size / 2;
    const halfLen = (size * Math.SQRT2) / 2;

    const x1 = cx - Math.sin(rad) * halfLen;
    const y1 = cy + Math.cos(rad) * halfLen;
    const x2 = cx + Math.sin(rad) * halfLen;
    const y2 = cy - Math.cos(rad) * halfLen;

    const def = (
        <linearGradient
            key={id}
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
        >
            {stops.map((stop, idx) => (
                <stop
                    key={idx}
                    offset={`${stop.position * 100}%`}
                    stopColor={stop.color}
                />
            ))}
        </linearGradient>
    );

    return { def, strokeRef: `url(#${id})` };
}

interface RadialSliderRxData {
    oid: null | string;
    minValue: number;
    maxValue: number;
    step: number;
    showValue: boolean;
    valueDecimals: number | string | null;
    valueDecimalSeparator: string;
    valueUnit: string;
    colorZoneCount: number;
    colorZoneMode: 'active' | 'segments' | 'track';
    secondOid: string | null;
    secondPrefix: string;
    secondUnit: string;
    showLastChange: boolean;
    lastChangeFormat: string;
    showScale: boolean;
    scaleInterval: number | string | null;
    scaleMinorCount: number;
    scaleTickLength: number;
    scaleTickWidth: number;
    scaleColor: string;
    scaleLabels: 'none' | 'minmax' | 'all';
    scaleLabelSize: number;
    scaleLabelColor: string;
    showNeedle: boolean;
    needleColor: string;
    needleWidth: number;
    needleLength: number;
    needleCapSize: number;
    colorZoneTransition: 'hard' | 'smooth';
    colorZoneApplyToValue: boolean;
    [key: `colorZoneFrom${number}`]: number | string;
    [key: `colorZoneColor${number}`]: string;
    showLabel: boolean;
    label: string;
    readOnly: boolean;
    startAngle: number;
    endAngle: number;
    trackWidth: number;
    trackColor: string;
    trackActiveColor: string;
    thumbColor: string;
    thumbSize: number;
    valueSize: number;
    valueColor: string;
    labelSize: number;
    labelColor: string;
    trackShadowX: number;
    trackShadowY: number;
    trackShadowBlur: number;
    trackShadowColor: string;
    thumbShadowX: number;
    thumbShadowY: number;
    thumbShadowBlur: number;
    thumbShadowColor: string;
}

interface RadialSliderState extends VisRxWidgetState {
    sliderValue: number | null;
    isDragging: boolean;
}

/**
 * Design attributes of the Radial Slider widget for design presets: arc angles, color zone rendering, track, thumb,
 * size and color of value and label, scale ticks and needle. Never datapoints, min/max/step, texts, units, formats,
 * which texts are shown, the scale interval or the color zones themselves (their thresholds depend on min/max, their
 * colors belong to them).
 */
export const RADIAL_SLIDER_DESIGN_SPEC: DesignSpec = {
    version: 1,
    groups: {
        common: ['startAngle', 'endAngle'],
        attr_group_color_zones: ['colorZoneMode', 'colorZoneTransition', 'colorZoneApplyToValue'],
        attr_group_css_radial_track: true,
        attr_group_css_radial_thumb: true,
        attr_group_css_radial_value: true,
        attr_group_css_radial_scale: [
            'showScale',
            'scaleMinorCount',
            'scaleTickLength',
            'scaleTickWidth',
            'scaleColor',
            'scaleLabels',
            'scaleLabelSize',
            'scaleLabelColor',
            'showNeedle',
            'needleColor',
            'needleWidth',
            'needleLength',
            'needleCapSize',
        ],
    },
};

/** Stable reference for the design preset field, which needs the widget info it is part of */
const getRadialSliderWidgetInfo = (): RxWidgetInfo => InventwoWidgetRadialSlider.getWidgetInfo();

export default class InventwoWidgetRadialSlider extends InventwoGeneric<RadialSliderRxData, RadialSliderState> {
    private containerRef: React.RefObject<HTMLDivElement | null>;

    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = {
            ...this.state,
            sliderValue: 0,
            isDragging: false,
        };
        this.containerRef = React.createRef();
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.setState({ sliderValue: this.getValue(this.state.rxData.oid) });
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetRadialSlider',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_radial_slider',
            visName: 'widget_radial_slider',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        createDocsLinkField('docs/en/widgets/radial-slider-widget.md') as any,
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
                            onChange: async (
                                field: RxWidgetInfoAttributesField,
                                data: WidgetData,
                                changeData,
                                socket,
                            ) => {
                                if (data[field.name as string] && data[field.name as string] !== 'nothing_selected') {
                                    const object = (await socket.getObject(data[field.name as string])) as
                                        | ioBroker.StateObject
                                        | null
                                        | undefined;
                                    if (object?.common) {
                                        let changed = false;

                                        if (object.common.min !== undefined && object.common.min !== data.minValue) {
                                            data.minValue = object.common.min;
                                            changed = true;
                                        }
                                        if (object.common.max !== undefined && object.common.max !== data.maxValue) {
                                            data.maxValue = object.common.max;
                                            changed = true;
                                        }
                                        if (object.common.step !== undefined && object.common.step !== data.step) {
                                            data.step = object.common.step;
                                            changed = true;
                                        }
                                        changed && changeData(data);
                                    }
                                }
                            },
                        },
                        {
                            name: 'minValue',
                            type: 'number',
                            label: 'min_value',
                            default: 0,
                        },
                        {
                            name: 'maxValue',
                            type: 'number',
                            label: 'max_value',
                            default: 100,
                        },
                        {
                            name: 'step',
                            type: 'number',
                            label: 'step',
                            default: 1,
                        },
                        {
                            name: 'startAngle',
                            type: 'slider',
                            min: 0,
                            max: 360,
                            step: 1,
                            default: 225,
                            label: 'start_angle',
                        },
                        {
                            name: 'endAngle',
                            type: 'slider',
                            min: 0,
                            max: 360,
                            step: 1,
                            default: 135,
                            label: 'end_angle',
                        },
                        {
                            name: 'showValue',
                            type: 'checkbox',
                            label: 'show_value',
                            default: true,
                        },
                        {
                            name: 'valueDecimals',
                            type: 'number',
                            min: 0,
                            max: 10,
                            label: 'decimals',
                            tooltip: 'value_decimals_tooltip',
                            hidden: '!data.showValue',
                        },
                        {
                            name: 'valueDecimalSeparator',
                            type: 'text',
                            label: 'decimal_separator',
                            tooltip: 'tooltip_decimal_separator',
                            hidden: '!data.showValue',
                        },
                        {
                            name: 'valueUnit',
                            type: 'text',
                            label: 'slider_unit',
                            hidden: '!data.showValue',
                        },
                        {
                            name: 'showLabel',
                            type: 'checkbox',
                            label: 'show_label',
                            default: true,
                        },
                        {
                            name: 'label',
                            type: 'text',
                            label: 'label',
                            default: '',
                            hidden: '!data.showLabel',
                        },
                        {
                            name: 'secondOid',
                            type: 'id',
                            label: 'second_oid',
                            tooltip: 'second_oid_tooltip',
                        },
                        {
                            name: 'secondPrefix',
                            type: 'text',
                            label: 'second_prefix',
                            hidden: '!data.secondOid || data.secondOid == "nothing_selected"',
                        },
                        {
                            name: 'secondUnit',
                            type: 'text',
                            label: 'second_unit',
                            hidden: '!data.secondOid || data.secondOid == "nothing_selected"',
                        },
                        {
                            name: 'showLastChange',
                            type: 'checkbox',
                            label: 'show_last_change',
                            default: false,
                        },
                        {
                            name: 'lastChangeFormat',
                            type: 'text',
                            label: 'last_change_format',
                            tooltip: 'last_change_format_tooltip',
                            default: 'DD.MM. hh:mm',
                            hidden: '!data.showLastChange',
                        },
                        {
                            name: 'readOnly',
                            type: 'checkbox',
                            label: 'read_only',
                            default: false,
                        },
                    ],
                },
                {
                    name: 'attr_group_theme',
                    label: 'attr_group_theme',
                    fields: createThemeFields(getRadialSliderWidgetInfo) as any,
                },
                {
                    name: 'attr_group_design_presets',
                    label: 'attr_group_design_presets',
                    fields: [
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_design_presets_help_generic',
                        },
                        createDesignPresetField(getRadialSliderWidgetInfo, RADIAL_SLIDER_DESIGN_SPEC) as any,
                    ],
                },
                ...createColorZoneGroups([
                    {
                        name: 'colorZoneApplyToValue',
                        type: 'checkbox',
                        default: false,
                        label: 'color_zone_apply_to_value',
                        hidden: '!data.colorZoneCount',
                    },
                ]),
                {
                    name: 'attr_group_css_radial_track',
                    label: 'attr_group_css_radial_track',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'radialTrackFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetRadialSlider',
                            all: true,
                        },
                        {
                            name: 'trackColor',
                            type: 'color',
                            default: 'rgb(110,110,110)',
                            label: 'track_color',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: 'trackActiveColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'track_active_color',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: 'trackWidth',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'track_width',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_track_shadow',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: 'trackShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: 'trackShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: 'trackShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                        {
                            name: 'trackShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'shadow_color',
                            hidden: '!!data.radialTrackFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_radial_thumb',
                    label: 'attr_group_css_radial_thumb',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'radialThumbFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetRadialSlider',
                            all: true,
                        },
                        {
                            name: 'thumbColor',
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'thumb_color',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: 'thumbSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 16,
                            label: 'thumbSize',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_thumb_shadow',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color',
                            hidden: '!!data.radialThumbFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_radial_value',
                    label: 'attr_group_css_radial_value',
                    fields: [
                        {
                            name: 'valueSize',
                            type: 'slider',
                            min: 8,
                            max: 100,
                            step: 1,
                            default: 32,
                            label: 'value_size',
                        },
                        {
                            name: 'valueColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'value_color',
                        },
                        {
                            name: 'labelSize',
                            type: 'slider',
                            min: 8,
                            max: 50,
                            step: 1,
                            default: 14,
                            label: 'label_size',
                        },
                        {
                            name: 'labelColor',
                            type: 'color',
                            default: 'rgb(200,200,200)',
                            label: 'label_color',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_radial_scale',
                    label: 'attr_group_css_radial_scale',
                    fields: [
                        {
                            name: 'showScale',
                            type: 'checkbox',
                            label: 'show_scale',
                            default: false,
                        },
                        {
                            name: 'scaleInterval',
                            type: 'number',
                            label: 'scale_interval',
                            tooltip: 'scale_interval_tooltip',
                            hidden: '!data.showScale',
                        },
                        {
                            name: 'scaleMinorCount',
                            type: 'slider',
                            min: 0,
                            max: 9,
                            step: 1,
                            default: 0,
                            label: 'scale_minor_count',
                            hidden: '!data.showScale',
                        },
                        {
                            name: 'scaleTickLength',
                            type: 'slider',
                            min: 1,
                            max: 40,
                            step: 1,
                            default: 8,
                            label: 'scale_tick_length',
                            hidden: '!data.showScale',
                        },
                        {
                            name: 'scaleTickWidth',
                            type: 'slider',
                            min: 1,
                            max: 10,
                            step: 1,
                            default: 2,
                            label: 'scale_tick_width',
                            hidden: '!data.showScale',
                        },
                        {
                            name: 'scaleColor',
                            type: 'color',
                            default: 'rgb(200,200,200)',
                            label: 'scale_color',
                            hidden: '!data.showScale',
                        },
                        {
                            name: 'scaleLabels',
                            type: 'select',
                            options: [
                                { value: 'none', label: 'scale_labels_none' },
                                { value: 'minmax', label: 'scale_labels_minmax' },
                                { value: 'all', label: 'scale_labels_all' },
                            ],
                            default: 'none',
                            label: 'scale_labels',
                            hidden: '!data.showScale',
                        },
                        {
                            name: 'scaleLabelSize',
                            type: 'slider',
                            min: 6,
                            max: 40,
                            step: 1,
                            default: 11,
                            label: 'scale_label_size',
                            hidden: '!data.showScale || !data.scaleLabels || data.scaleLabels == "none"',
                        },
                        {
                            name: 'scaleLabelColor',
                            type: 'color',
                            default: 'rgb(200,200,200)',
                            label: 'scale_label_color',
                            hidden: '!data.showScale || !data.scaleLabels || data.scaleLabels == "none"',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: 'showNeedle',
                            type: 'checkbox',
                            label: 'show_needle',
                            default: false,
                        },
                        {
                            name: 'needleColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'needle_color',
                            hidden: '!data.showNeedle',
                        },
                        {
                            name: 'needleWidth',
                            type: 'slider',
                            min: 1,
                            max: 20,
                            step: 1,
                            default: 3,
                            label: 'needle_width',
                            hidden: '!data.showNeedle',
                        },
                        {
                            name: 'needleLength',
                            type: 'slider',
                            min: 10,
                            max: 100,
                            step: 1,
                            default: 80,
                            label: 'needle_length',
                            hidden: '!data.showNeedle',
                        },
                        {
                            name: 'needleCapSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'needle_cap_size',
                            hidden: '!data.showNeedle',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 200,
                height: 200,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-radial-slider.png',
            visOrder: 5,
        };
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    onStateUpdated(id: string | null, state: ioBroker.State): void {
        if (id === this.state.rxData.oid && state && state.val !== this.state.sliderValue) {
            this.setState({ sliderValue: state.val as number });
        }
    }

    // Do not delete this method. It is used by vis to read the widget configuration.

    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetRadialSlider.getWidgetInfo();
    }

    private polarToCartesian(
        centerX: number,
        centerY: number,
        radius: number,
        angleInDegrees: number,
    ): { x: number; y: number } {
        const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians),
        };
    }

    private describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
        const start = this.polarToCartesian(x, y, radius, endAngle);
        const end = this.polarToCartesian(x, y, radius, startAngle);
        let arcSpan = endAngle - startAngle;
        if (arcSpan < 0) {
            arcSpan += 360;
        }
        const largeArcFlag = arcSpan > 180 ? '1' : '0';
        return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
    }

    private formatNumber(value: number): string {
        const decimals = this.state.rxData.valueDecimals;
        let text = String(value);
        if (this.validFieldValue(decimals) && !Number.isNaN(Number(decimals)) && !Number.isNaN(Number(value))) {
            text = Number(value).toFixed(Math.max(0, Math.min(10, Math.round(Number(decimals)))));
        }
        const separator = this.state.rxData.valueDecimalSeparator;
        if (separator) {
            text = text.replace('.', separator);
        }
        return text;
    }

    private formatDisplayValue(value: number): string {
        return `${this.formatNumber(value)}${this.state.rxData.valueUnit ?? ''}`;
    }

    private handleMouseDown = (e: React.MouseEvent | React.TouchEvent): void => {
        if (this.props.editMode || this.state.rxData.readOnly) {
            return;
        }
        this.setState({ isDragging: true });
        this.handleMove(e);
        document.addEventListener('mousemove', this.handleMouseMove as any);
        document.addEventListener('mouseup', this.handleMouseUp);
        document.addEventListener('touchmove', this.handleTouchMove as any);
        document.addEventListener('touchend', this.handleMouseUp);
    };

    private handleMouseMove = (e: MouseEvent): void => {
        if (this.state.isDragging) {
            this.handleMove(e);
        }
    };

    private handleTouchMove = (e: TouchEvent): void => {
        if (this.state.isDragging) {
            this.handleMove(e);
        }
    };

    private handleMouseUp = (): void => {
        if (this.state.isDragging) {
            this.setState({ isDragging: false });
            this.onChange(null, this.state.sliderValue);
            document.removeEventListener('mousemove', this.handleMouseMove as any);
            document.removeEventListener('mouseup', this.handleMouseUp);
            document.removeEventListener('touchmove', this.handleTouchMove as any);
            document.removeEventListener('touchend', this.handleMouseUp);
        }
    };

    private handleMove(e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): void {
        if (!this.containerRef.current) {
            return;
        }

        const rect = this.containerRef.current.getBoundingClientRect();
        // Use the same size calculation as in render for consistency
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        let clientX: number;
        let clientY: number;

        if ('touches' in e) {
            // Check if there are any touches (user may have lifted finger)
            if (e.touches.length === 0) {
                return;
            }
            clientX = e.touches[0].clientX - rect.left;
            clientY = e.touches[0].clientY - rect.top;
        } else {
            clientX = e.clientX - rect.left;
            clientY = e.clientY - rect.top;
        }

        const dx = clientX - centerX;
        const dy = clientY - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        if (angle < 0) {
            angle += 360;
        }

        const startAngle = this.state.rxData.startAngle;
        const endAngle = this.state.rxData.endAngle;
        let totalAngle = endAngle - startAngle;
        if (totalAngle < 0) {
            totalAngle += 360;
        }

        let normalizedAngle = angle - startAngle;
        if (normalizedAngle < 0) {
            normalizedAngle += 360;
        }

        // Snap to nearest boundary when outside valid range
        if (normalizedAngle > totalAngle) {
            const distanceToStartAngle = Math.min(normalizedAngle, 360 - normalizedAngle);
            const distanceToEndAngle = Math.abs(normalizedAngle - totalAngle);
            normalizedAngle = distanceToStartAngle < distanceToEndAngle ? 0 : totalAngle;
        }

        const percentage = normalizedAngle / totalAngle;
        const range = this.state.rxData.maxValue - this.state.rxData.minValue;
        let newValue = this.state.rxData.minValue + percentage * range;

        const step = this.state.rxData.step || 1;
        newValue = Math.round(newValue / step) * step;
        newValue = Math.max(this.state.rxData.minValue, Math.min(this.state.rxData.maxValue, newValue));

        if (newValue !== this.state.sliderValue) {
            this.setState({ sliderValue: newValue });
        }
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const trackStyle = this.getStyle('radialTrackFromWidget', this.groupAttrs.attr_group_css_radial_track);
        const thumbStyle = this.getStyle('radialThumbFromWidget', this.groupAttrs.attr_group_css_radial_thumb);

        const size = Math.min(
            parseInt(this.state.rxStyle!.width as string) || 200,
            parseInt(this.state.rxStyle!.height as string) || 200,
        );
        const centerX = size / 2;
        const centerY = size / 2;
        const thumbSize = Number(thumbStyle.thumbSize ?? 16);
        const radius = Math.max(10, (size - trackStyle.trackWidth - thumbSize) / 2);

        const minValue = this.state.rxData.minValue;
        const maxValue = this.state.rxData.maxValue;
        const currentValue = this.state.sliderValue ?? minValue;

        const startAngle = this.state.rxData.startAngle;
        const endAngle = this.state.rxData.endAngle;
        let totalAngle = endAngle - startAngle;
        if (totalAngle < 0) {
            totalAngle += 360;
        }

        const percentage = (currentValue - minValue) / (maxValue - minValue);
        const currentAngle = startAngle + percentage * totalAngle;

        const trackPath = this.describeArc(centerX, centerY, radius, startAngle, endAngle);
        const activePath = this.describeArc(centerX, centerY, radius, startAngle, currentAngle);
        const thumbPosition = this.polarToCartesian(centerX, centerY, radius, currentAngle);

        // A matching color zone replaces the active track color (and optionally the value color)
        const zoneColor = this.getColorZoneColor(currentValue);
        const activeColor: string = zoneColor ?? trackStyle.trackActiveColor;
        const valueColor: string =
            zoneColor && this.state.rxData.colorZoneApplyToValue && !/gradient\(/i.test(zoneColor)
                ? zoneColor
                : this.state.rxData.valueColor;

        // Zone mode "segments": the active arc is drawn as several partial arcs, one per zone
        // (hard cut) or as many small slices with mixed colors (smooth transition).
        // `mix` is a CSS color-mix() value; browsers that don't know it fall back to `color`.
        const zoneSegments: { from: number; to: number; color: string; mix?: string }[] = [];
        const zoneStops = this.getColorZoneStops(minValue, maxValue, trackStyle.trackActiveColor);
        const fraction = Math.max(0, Math.min(1, Number.isFinite(percentage) ? percentage : 0));
        // mode "track": the zones are always shown along the whole arc, independent of the value
        const zoneFraction = this.state.rxData.colorZoneMode === 'track' ? 1 : fraction;
        if (zoneStops && zoneFraction > 0) {
            if (this.state.rxData.colorZoneTransition === 'smooth') {
                const sliceCount = Math.max(1, Math.ceil((zoneFraction * totalAngle) / 3));
                for (let k = 0; k < sliceCount; k++) {
                    const from = (k / sliceCount) * zoneFraction;
                    const to = ((k + 1) / sliceCount) * zoneFraction;
                    const mid = (from + to) / 2;
                    let idx = 0;
                    for (let i = 0; i < zoneStops.length; i++) {
                        if (zoneStops[i].pos <= mid) {
                            idx = i;
                        }
                    }
                    const stop = zoneStops[idx];
                    const next = zoneStops[idx + 1];
                    let mix: string | undefined;
                    if (next && next.pos > stop.pos) {
                        const share = ((mid - stop.pos) / (next.pos - stop.pos)) * 100;
                        mix = `color-mix(in srgb, ${next.color} ${share.toFixed(1)}%, ${stop.color})`;
                    }
                    zoneSegments.push({ from, to, color: stop.color, mix });
                }
            } else {
                zoneStops.forEach((stop, i) => {
                    const to = Math.min(zoneStops[i + 1]?.pos ?? 1, zoneFraction);
                    if (to > stop.pos) {
                        zoneSegments.push({ from: stop.pos, to, color: stop.color });
                    }
                });
            }
        }
        const firstSegment = zoneSegments[0];
        const lastSegment = zoneSegments[zoneSegments.length - 1];
        const arcStartPosition = this.polarToCartesian(centerX, centerY, radius, startAngle);
        const zoneEndPosition = this.polarToCartesian(centerX, centerY, radius, startAngle + zoneFraction * totalAngle);

        // Scale: ticks (and optional labels) on the inner side of the track
        const range = Number(maxValue) - Number(minValue);
        const trackWidth = Number(trackStyle.trackWidth) || 0;
        const scaleTicks: { value: number; major: boolean }[] = [];
        if (this.state.rxData.showScale && range > 0) {
            let interval = Number(this.state.rxData.scaleInterval);
            if (!(interval > 0)) {
                interval = range / 10;
            }
            // never draw an absurd number of ticks
            interval = Math.max(interval, range / 200);
            const minorCount = Math.max(0, Math.min(9, Math.round(Number(this.state.rxData.scaleMinorCount) || 0)));
            const majorCount = Math.floor(range / interval + 1e-9);
            for (let i = 0; i <= majorCount; i++) {
                const value = Number(minValue) + i * interval;
                scaleTicks.push({ value, major: true });
                for (let m = 1; m <= minorCount; m++) {
                    const minorValue = value + (m * interval) / (minorCount + 1);
                    if (minorValue < Number(maxValue) - 1e-9) {
                        scaleTicks.push({ value: minorValue, major: false });
                    }
                }
            }
            if (majorCount * interval < range - 1e-9) {
                scaleTicks.push({ value: Number(maxValue), major: true });
            }
        }
        const tickLength = Number(this.state.rxData.scaleTickLength) || 8;
        const tickOuterRadius = radius - trackWidth / 2 - 3;
        const scaleLabels = this.state.rxData.scaleLabels ?? 'none';
        const scaleLabelSize = Number(this.state.rxData.scaleLabelSize) || 11;
        const scaleLabelRadius = tickOuterRadius - tickLength - 4 - scaleLabelSize;
        const valueToAngle = (value: number): number => startAngle + ((value - Number(minValue)) / range) * totalAngle;

        // Needle from the center to the current value
        const needleLength = Number(this.state.rxData.needleLength) || 80;
        const needleTip = this.polarToCartesian(
            centerX,
            centerY,
            (radius * needleLength) / 100,
            startAngle + fraction * totalAngle,
        );
        const needleCapSize = Number(this.state.rxData.needleCapSize ?? 12);

        // Additional lines below the label: second value and time of the last change
        const smallTextStyle = {
            fontSize: `${this.state.rxData.labelSize}px`,
            color: this.state.rxData.labelColor,
            fontFamily: this.state.rxStyle!['font-family'],
            marginTop: '2px',
        };
        let secondText: string | null = null;
        if (this.validOid(this.state.rxData.secondOid)) {
            const secondValue = this.getValue(this.state.rxData.secondOid);
            if (this.validFieldValue(secondValue)) {
                const formatted = Number.isNaN(Number(secondValue))
                    ? String(secondValue)
                    : this.formatNumber(Number(secondValue));
                secondText = `${this.state.rxData.secondPrefix ?? ''}${formatted}${this.state.rxData.secondUnit ?? ''}`;
            }
        }
        let lastChangeText: string | null = null;
        if (this.state.rxData.showLastChange && this.validOid(this.state.rxData.oid)) {
            const lastChange = this.state.values[`${this.state.rxData.oid}.lc`];
            if (lastChange) {
                lastChangeText = this.formatDate(lastChange, this.state.rxData.lastChangeFormat || 'DD.MM. hh:mm');
            }
        }

        const trackGradient = cssGradientToSvgDef(trackStyle.trackColor, 'radialTrackColorGradient', size);
        const trackActiveGradient = cssGradientToSvgDef(activeColor, 'radialTrackActiveColorGradient', size);
        const trackStroke = trackGradient ? trackGradient.strokeRef : trackStyle.trackColor;
        const trackActiveStroke = trackActiveGradient ? trackActiveGradient.strokeRef : activeColor;

        const containerStyle: SxProps = {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            cursor: this.props.editMode || this.state.rxData.readOnly ? 'default' : 'pointer',
            userSelect: 'none',
        };

        return (
            <Box
                ref={this.containerRef}
                sx={containerStyle}
                onMouseDown={this.handleMouseDown}
                onTouchStart={this.handleMouseDown}
            >
                <svg
                    width={size}
                    height={size}
                    style={{ overflow: 'visible' }}
                >
                    {(trackGradient || trackActiveGradient) && (
                        <defs>
                            {trackGradient?.def}
                            {trackActiveGradient?.def}
                        </defs>
                    )}
                    {/* Background track */}
                    <path
                        d={trackPath}
                        fill="none"
                        stroke={trackStroke}
                        strokeWidth={trackStyle.trackWidth}
                        strokeLinecap="round"
                        style={{
                            filter: `drop-shadow(${trackStyle.trackShadowX}px ${trackStyle.trackShadowY}px ${trackStyle.trackShadowBlur}px ${trackStyle.trackShadowColor})`,
                        }}
                    />
                    {/* Active track */}
                    {zoneSegments.length === 0 ? (
                        <path
                            d={activePath}
                            fill="none"
                            stroke={trackActiveStroke}
                            strokeWidth={trackStyle.trackWidth}
                            strokeLinecap="round"
                        />
                    ) : (
                        <>
                            {/* round cap at the start of the arc */}
                            <circle
                                cx={arcStartPosition.x}
                                cy={arcStartPosition.y}
                                r={trackStyle.trackWidth / 2}
                                fill={firstSegment.color}
                                style={firstSegment.mix ? { fill: firstSegment.mix } : undefined}
                            />
                            {zoneSegments.map((segment, idx) => (
                                <path
                                    key={idx}
                                    d={this.describeArc(
                                        centerX,
                                        centerY,
                                        radius,
                                        startAngle + segment.from * totalAngle,
                                        // small overlap so no gaps show between neighbouring segments
                                        startAngle +
                                            segment.to * totalAngle +
                                            (idx < zoneSegments.length - 1 ? 0.4 : 0),
                                    )}
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth={trackStyle.trackWidth}
                                    strokeLinecap="butt"
                                    style={segment.mix ? { stroke: segment.mix } : undefined}
                                />
                            ))}
                            {/* round cap at the end of the colored arc */}
                            <circle
                                cx={zoneEndPosition.x}
                                cy={zoneEndPosition.y}
                                r={trackStyle.trackWidth / 2}
                                fill={lastSegment.color}
                                style={lastSegment.mix ? { fill: lastSegment.mix } : undefined}
                            />
                        </>
                    )}
                    {/* Scale ticks and labels */}
                    {scaleTicks.map((tick, idx) => {
                        const angle = valueToAngle(tick.value);
                        const outer = this.polarToCartesian(centerX, centerY, tickOuterRadius, angle);
                        const inner = this.polarToCartesian(
                            centerX,
                            centerY,
                            tickOuterRadius - (tick.major ? tickLength : tickLength * 0.55),
                            angle,
                        );
                        return (
                            <line
                                key={`tick${idx}`}
                                x1={outer.x}
                                y1={outer.y}
                                x2={inner.x}
                                y2={inner.y}
                                stroke={this.state.rxData.scaleColor || 'rgb(200,200,200)'}
                                strokeWidth={
                                    tick.major
                                        ? Number(this.state.rxData.scaleTickWidth) || 2
                                        : Math.max(1, (Number(this.state.rxData.scaleTickWidth) || 2) / 2)
                                }
                                strokeLinecap="round"
                            />
                        );
                    })}
                    {scaleLabels !== 'none' &&
                        scaleTicks
                            .filter(
                                tick =>
                                    tick.major &&
                                    (scaleLabels === 'all' ||
                                        Math.abs(tick.value - Number(minValue)) < 1e-9 ||
                                        Math.abs(tick.value - Number(maxValue)) < 1e-9),
                            )
                            .map((tick, idx) => {
                                const pos = this.polarToCartesian(
                                    centerX,
                                    centerY,
                                    scaleLabelRadius,
                                    valueToAngle(tick.value),
                                );
                                return (
                                    <text
                                        key={`label${idx}`}
                                        x={pos.x}
                                        y={pos.y}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={scaleLabelSize}
                                        fontFamily={this.state.rxStyle!['font-family'] as string}
                                        fill={this.state.rxData.scaleLabelColor || 'rgb(200,200,200)'}
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {this.formatNumber(parseFloat(tick.value.toPrecision(10)))}
                                    </text>
                                );
                            })}
                    {/* Thumb (hidden when its size is 0, e.g. for a pure gauge) */}
                    {thumbSize > 0 && (
                        <circle
                            cx={thumbPosition.x}
                            cy={thumbPosition.y}
                            r={thumbSize / 2}
                            fill={thumbStyle.thumbColor}
                            style={{
                                filter: `drop-shadow(${thumbStyle.thumbShadowX}px ${thumbStyle.thumbShadowY}px ${thumbStyle.thumbShadowBlur}px ${thumbStyle.thumbShadowColor})`,
                            }}
                        />
                    )}
                    {/* Needle */}
                    {this.state.rxData.showNeedle && (
                        <>
                            <line
                                x1={centerX}
                                y1={centerY}
                                x2={needleTip.x}
                                y2={needleTip.y}
                                stroke={this.state.rxData.needleColor || 'rgb(255,255,255)'}
                                strokeWidth={Number(this.state.rxData.needleWidth) || 3}
                                strokeLinecap="round"
                            />
                            {needleCapSize > 0 && (
                                <circle
                                    cx={centerX}
                                    cy={centerY}
                                    r={needleCapSize / 2}
                                    fill={this.state.rxData.needleColor || 'rgb(255,255,255)'}
                                />
                            )}
                        </>
                    )}
                </svg>
                {/* Center value display */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}
                >
                    {this.state.rxData.showValue && (
                        <Box
                            sx={{
                                fontSize: `${this.state.rxData.valueSize}px`,
                                color: valueColor,
                                fontWeight: 'bold',
                                fontFamily: this.state.rxStyle!['font-family'],
                            }}
                        >
                            {this.formatDisplayValue(currentValue)}
                        </Box>
                    )}
                    {this.state.rxData.showLabel && this.state.rxData.label && (
                        <Box
                            sx={{
                                fontSize: `${this.state.rxData.labelSize}px`,
                                color: this.state.rxData.labelColor,
                                fontFamily: this.state.rxStyle!['font-family'],
                                marginTop: '4px',
                            }}
                        >
                            {this.state.rxData.label}
                        </Box>
                    )}
                    {secondText !== null && <Box sx={smallTextStyle}>{secondText}</Box>}
                    {lastChangeText !== null && <Box sx={smallTextStyle}>{lastChangeText}</Box>}
                </Box>
            </Box>
        );
    }
}
