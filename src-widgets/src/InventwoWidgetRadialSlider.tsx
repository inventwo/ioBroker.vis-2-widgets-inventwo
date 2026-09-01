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
                                    const object = await socket.getObject(data[field.name as string]);
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
                            name: 'readOnly',
                            type: 'checkbox',
                            label: 'read_only',
                            default: false,
                        },
                    ],
                },
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
                            min: 1,
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
            ],
            visDefaultStyle: {
                width: 200,
                height: 200,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-radial-slider.png',
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
        const radius = Math.max(10, (size - trackStyle.trackWidth - thumbStyle.thumbSize) / 2);

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

        const trackGradient = cssGradientToSvgDef(trackStyle.trackColor, 'radialTrackColorGradient', size);
        const trackActiveGradient = cssGradientToSvgDef(
            trackStyle.trackActiveColor,
            'radialTrackActiveColorGradient',
            size,
        );
        const trackStroke = trackGradient ? trackGradient.strokeRef : trackStyle.trackColor;
        const trackActiveStroke = trackActiveGradient ? trackActiveGradient.strokeRef : trackStyle.trackActiveColor;

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
                    <path
                        d={activePath}
                        fill="none"
                        stroke={trackActiveStroke}
                        strokeWidth={trackStyle.trackWidth}
                        strokeLinecap="round"
                    />
                    {/* Thumb */}
                    <circle
                        cx={thumbPosition.x}
                        cy={thumbPosition.y}
                        r={thumbStyle.thumbSize / 2}
                        fill={thumbStyle.thumbColor}
                        style={{
                            filter: `drop-shadow(${thumbStyle.thumbShadowX}px ${thumbStyle.thumbShadowY}px ${thumbStyle.thumbShadowBlur}px ${thumbStyle.thumbShadowColor})`,
                        }}
                    />
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
                                color: this.state.rxData.valueColor,
                                fontWeight: 'bold',
                                fontFamily: this.state.rxStyle!['font-family'],
                            }}
                        >
                            {currentValue}
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
                </Box>
            </Box>
        );
    }
}
