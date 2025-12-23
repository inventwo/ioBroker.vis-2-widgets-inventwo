import type { SxProps } from '@mui/material';
import { Slider } from '@mui/material';
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

interface SliderRxData {
    oid: null | string;
    minValue: number;
    maxValue: number;
    step: number;
    showMinMax: boolean;
    orientation: 'horizontal' | 'vertical';
    showSteps: boolean;
    stepMode: 'auto' | 'custom';
    stepDisplay: number;
    customSteps: string;
    sliderRailColor: string;
    sliderRailActiveColor: string;
    trackBarType: 'normal' | 'inverted' | false;
    trackShadowX: number;
    trackShadowY: number;
    trackShadowBlur: number;
    trackShadowSize: number;
    sliderThumbColor: string;
    thumbShadowX: number;
    thumbShadowY: number;
    thumbShadowBlur: number;
    thumbShadowSize: number;
}

interface SliderState extends VisRxWidgetState {
    sliderValue: number | null;
}

export default class InventwoWidgetSlider extends InventwoGeneric<SliderRxData, SliderState> {
    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = {
            ...this.state,
            sliderValue: 0,
        };
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.setState({ sliderValue: this.getValue(this.state.rxData.oid) });
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetSlider',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_slider',
            visName: 'widget_slider',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
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

                                        if (object.common.min !== undefined && object.common.min !== data.max_value) {
                                            data.max_value = object.common.min;
                                            changed = true;
                                        }
                                        if (object.common.max !== undefined && object.common.max !== data.min_value) {
                                            data.min_value = object.common.max;
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
                            name: 'orientation',
                            type: 'select',
                            options: [
                                { value: 'horizontal', label: 'horizontal' },
                                { value: 'vertical', label: 'vertical' },
                            ],
                            default: 'horizontal',
                            label: 'orientation',
                        },
                        {
                            name: 'showMinMax',
                            type: 'checkbox',
                            label: 'show_min_max',
                            default: true,
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_steps',
                        },
                        {
                            name: 'showSteps',
                            type: 'checkbox',
                            label: 'show_steps',
                            default: false,
                        },
                        {
                            name: 'stepMode',
                            type: 'select',
                            options: [
                                { value: 'auto', label: 'auto' },
                                { value: 'custom', label: 'custom' },
                            ],
                            default: 'auto',
                            label: 'step_mode',
                            hidden: '!data.showSteps',
                        },
                        {
                            name: 'stepDisplay',
                            type: 'number',
                            label: 'step_display',
                            default: 10,
                            hidden: '!data.showSteps || data.stepMode != "auto"',
                        },
                        {
                            name: 'customSteps',
                            type: 'text',
                            label: 'custom_steps',
                            hidden: '!data.showSteps || data.stepMode != "custom"',
                            tooltip: 'custom_steps_tooltip',
                        },
                    ],
                },

                {
                    name: 'attr_group_css_slider_track',
                    label: 'attr_group_css_slider_track',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'sliderTrackFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetSlider',
                            all: true,
                        },
                        {
                            name: 'sliderRailColor',
                            type: 'color',
                            default: 'rgb(110,110,110)',
                            label: 'slider_rail_color',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'sliderRailActiveColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'slider_rail_active_color',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackBarType',
                            type: 'select',
                            options: [
                                { value: 'normal', label: 'normal' },
                                { value: 'inverted', label: 'inverted' },
                                { value: false, label: 'none' },
                            ],
                            default: 'normal',
                            label: 'track_bar_type',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackWidth',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'track_width',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackBorderRadius',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'track_border_radius',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_track_shadow',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            name: 'trackShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'shadow_color',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_slider_slider_thumb',
                    label: 'attr_group_css_slider_slider_thumb',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'sliderThumbFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetSlider',
                            all: true,
                        },
                        {
                            name: 'sliderThumbColor',
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'slider_thumb_color',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbSize',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 16,
                            label: 'thumbSize',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbBorderRadius',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'thumb_border_radius',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_thumb_shadow',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            name: 'thumbShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 150,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
                height: 40,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-slider.png',
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
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetSlider.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const minValue = this.state.rxData.minValue;
        const maxValue = this.state.rxData.maxValue;

        const marks = [];
        if (this.state.rxData.showMinMax) {
            marks.push({
                value: minValue,
                label: minValue,
            });
            marks.push({
                value: maxValue,
                label: maxValue,
            });
        }

        if (this.state.rxData.showSteps) {
            if (this.state.rxData.stepMode === 'auto') {
                const stepDisplay = this.state.rxData.stepDisplay;
                if (stepDisplay > 0 && minValue && maxValue && stepDisplay) {
                    for (let i = minValue + stepDisplay; i < maxValue; i += stepDisplay) {
                        marks.push({
                            value: parseFloat(i.toFixed(2).replace(/[.,]00$/, '')),
                            label: i.toFixed(2).replace(/[.,]00$/, ''),
                        });
                    }
                }
            } else {
                let customSteps = this.state.rxData.customSteps;
                if (customSteps === undefined || customSteps === null) {
                    customSteps = '';
                }
                const steps: string[] = customSteps.split(',');

                steps.forEach(step => {
                    const s: number = parseInt(step);
                    marks.push({
                        value: s,
                        label: s,
                    });
                });
            }
        }

        const trackStyle = this.getStyle('sliderTrackFromWidget', this.groupAttrs.attr_group_css_slider_track);
        const thumbStyle = this.getStyle('sliderThumbFromWidget', this.groupAttrs.attr_group_css_slider_slider_thumb);

        const trackBarType = trackStyle.trackBarType;

        let sliderAttributes: SxProps = {
            height: this.state.rxData.orientation === 'horizontal' ? trackStyle.trackWidth : '100%',
            width: this.state.rxData.orientation !== 'horizontal' ? trackStyle.trackWidth : '100%',
            '& .MuiSlider-thumb': {
                backgroundColor: thumbStyle.sliderThumbColor, // color of thumbs
                width: thumbStyle.thumbSize,
                height: thumbStyle.thumbSize,
                borderRadius: `${thumbStyle.thumbBorderRadius}%`,
                // marginLeft: `-${thumbOffset}px`,
                '&:before': {
                    boxShadow: `${thumbStyle.thumbShadowX}px ${thumbStyle.thumbShadowY}px ${thumbStyle.thumbShadowBlur}px ${thumbStyle.thumbShadowSize}px ${thumbStyle.thumbShadowColor}`,
                },
            },
            '& .MuiSlider-rail': {
                backgroundColor:
                    trackBarType === 'normal'
                        ? trackStyle.sliderRailColor
                        : trackBarType === 'inverted'
                          ? trackStyle.sliderRailActiveColor
                          : '',
                color:
                    trackBarType === 'normal'
                        ? trackStyle.sliderRailColor
                        : trackBarType === 'inverted'
                          ? trackStyle.sliderRailActiveColor
                          : '',
                border: 'none',
                borderRadius: `${trackStyle.trackBorderRadius}px`,
                boxShadow: `${trackStyle.trackShadowX}px ${this.state.rxData.trackShadowY}px ${trackStyle.trackShadowBlur}px ${trackStyle.trackShadowSize}px ${trackStyle.trackShadowColor}`,
            },
            '& .MuiSlider-track': {
                backgroundColor:
                    trackBarType === 'normal'
                        ? this.state.rxData.sliderRailActiveColor
                        : trackBarType === 'inverted'
                          ? trackStyle.sliderRailColor
                          : '',
                color:
                    trackBarType === 'normal'
                        ? this.state.rxData.sliderRailActiveColor
                        : trackBarType === 'inverted'
                          ? trackStyle.sliderRailColor
                          : '',
                border: 'none',
                borderRadius: `${trackStyle.trackBorderRadius}px`,
            },
            '& .MuiSlider-mark': {
                color: trackStyle.sliderRailActiveColor,
            },
            '& .MuiSlider-markLabel': {
                fontSize: this.state.rxStyle!['font-size'],
                color: this.state.rxStyle!.color,
                textShadow: this.state.rxStyle!['text-shadow'],
                fontFamily: this.state.rxStyle!['font-family'],
                fontStyle: this.state.rxStyle!['font-style'],
                fontVariant: this.state.rxStyle!['font-variant'],
                fontWeight: this.state.rxStyle!['font-weight'],
                lineHeight: this.state.rxStyle!['line-height'],
                letterSpacing: this.state.rxStyle!['letter-spacing'],
                wordSpacing: this.state.rxStyle!['word-spacing'],
            },
        };

        if (this.state.rxData.orientation === 'horizontal') {
            sliderAttributes = {
                ...sliderAttributes,
                '& .MuiSlider-markLabel': {
                    top: trackStyle.trackWidth + 20,
                },
            };
        } else {
            sliderAttributes = {
                ...sliderAttributes,
                '& .MuiSlider-markLabel': {
                    left: trackStyle.trackWidth + 20,
                },
            };
        }

        return (
            <Slider
                disabled={this.props.editMode}
                sx={sliderAttributes}
                onChange={(_e, val) => this.setState({ sliderValue: val as number })}
                onChangeCommitted={(e, val) =>
                    this.setState({ sliderValue: val as number }, () => this.onChange(e, val))
                }
                min={this.state.rxData.minValue}
                max={this.state.rxData.maxValue}
                step={this.state.rxData.step}
                value={this.state.sliderValue || 0}
                valueLabelDisplay="auto"
                track={trackStyle.trackBarType}
                orientation={this.state.rxData.orientation}
                marks={marks}
            />
        );
    }
}
