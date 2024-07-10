import React from 'react';
import {
    Slider,
} from '@mui/material';

import InventwoGeneric from './InventwoGeneric';

class InventwoWidgetSlider extends InventwoGeneric {
    constructor(props) {
        super(props);
        this.state.sliderValue = 0;
        this.trackAttrs = [];
        const info = InventwoWidgetSlider.getWidgetInfo();
        info.visAttrs.find(group => group.name === 'attr_group_css_slider_track').fields.forEach(field => {
            if (field.name !== 'sliderTrackFromWidget') {
                this.trackAttrs.push(field.name);
            }
        });

        this.thumbAttrs = [];
        info.visAttrs.find(group => group.name === 'attr_group_css_slider_slider_thumb').fields.forEach(field => {
            if (field.name !== 'sliderThumbFromWidget') {
                this.thumbAttrs.push(field.name);
            }
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.setState({ sliderValue: this.getValue(this.state.rxData.oid) });
    }

    static getWidgetInfo() {
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
                            onChange: async (field, data, changeData, socket) => {
                                if (data[field.name] && data[field.name] !== 'nothing_selected') {
                                    const object = await socket.getObject(data[field.name]);
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
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'steps',
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
                            type: 'delimiter',
                            hidden: '!!data.sliderTrackFromWidget',
                        },
                        {
                            type: 'help',
                            text: 'track_shadow',
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
                            type: 'delimiter',
                            hidden: '!!data.sliderThumbFromWidget',
                        },
                        {
                            type: 'help',
                            text: 'thumb_shadow',
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
                overflow: 'visible',
                height: 40,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-slider.png',
        };
    }

    static getI18nPrefix() {
        return 'vis_2_widgets_inventwo_';
    }

    onStateUpdated(id, state) {
        if (id === this.state.rxData.oid && state && state.val !== this.state.sliderValue) {
            this.setState({ sliderValue: state.val });
        }
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return InventwoWidgetSlider.getWidgetInfo();
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const minValue = parseFloat(this.state.rxData.minValue);
        const maxValue = parseFloat(this.state.rxData.maxValue);

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
                const stepDisplay = parseFloat(this.state.rxData.stepDisplay);
                if (stepDisplay > 0) {
                    for (let i = minValue + stepDisplay; i < maxValue; i += stepDisplay) {
                        marks.push({
                            value:  parseFloat(i.toFixed(2).replace(/[.,]00$/, '')),
                            label: i.toFixed(2).replace(/[.,]00$/, ''),
                        });
                    }
                }
            } else {
                let customSteps = this.state.rxData.customSteps;
                if (customSteps === undefined || customSteps === null) {
                    customSteps = '';
                }
                customSteps = customSteps.split(',');

                customSteps.forEach(step => {
                    step = parseInt(step);
                    marks.push({
                        value: step,
                        label: step,
                    });
                });
            }
        }

        const trackStyle = this.getStyle('sliderTrackFromWidget', this.trackAttrs);
        const thumbStyle = this.getStyle('sliderThumbFromWidget', this.thumbAttrs);

        const trackBarType = trackStyle.trackBarType;

        const sliderAttributes = {
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
                backgroundColor: trackBarType === 'normal' ? trackStyle.sliderRailColor : trackBarType === 'inverted' ? trackStyle.sliderRailActiveColor : '', /// /color of the slider outside  teh area between thumbs
                color: trackBarType === 'normal' ? trackStyle.sliderRailColor : trackBarType === 'inverted' ? trackStyle.sliderRailActiveColor : '',
                border: 'none',
                borderRadius: `${trackStyle.trackBorderRadius}px`,
                boxShadow: `${trackStyle.trackShadowX}px ${this.state.rxData.trackShadowY}px ${trackStyle.trackShadowBlur}px ${trackStyle.trackShadowSize}px ${trackStyle.trackShadowColor}`,
            },
            '& .MuiSlider-track': {
                backgroundColor: trackBarType === 'normal' ? this.state.rxData.sliderRailActiveColor : trackBarType === 'inverted' ? trackStyle.sliderRailColor : '',
                color: trackBarType === 'normal' ? this.state.rxData.sliderRailActiveColor : trackBarType === 'inverted' ? trackStyle.sliderRailColor : '',
                border: 'none',
                borderRadius: `${trackStyle.trackBorderRadius}px`,
            },
            '& .MuiSlider-mark': {
                color: trackStyle.sliderRailActiveColor,
            },
            '& .MuiSlider-markLabel': {
                fontSize: this.state.rxStyle['font-size'],
            },
        };

        if (this.state.rxData.orientation === 'horizontal') {
            sliderAttributes['& .MuiSlider-markLabel'].top = trackStyle.trackWidth + 20;
        } else {
            sliderAttributes['& .MuiSlider-markLabel'].left = trackStyle.trackWidth + 20;
        }

        return <Slider
            disabled={this.props.editMode}
            sx={sliderAttributes}
            onChange={(e, val) => this.setState({ sliderValue: val })}
            onChangeCommitted={(e, val) =>
                this.setState({ sliderValue: val }, () =>
                    this.onChange(e, val))}
            min={this.state.rxData.minValue}
            max={this.state.rxData.maxValue}
            step={this.state.rxData.step}
            value={this.state.sliderValue || 0}
            valueLabelDisplay="auto"
            track={trackStyle.trackBarType}
            orientation={this.state.rxData.orientation}
            marks={marks}
        />;
    }
}

export default InventwoWidgetSlider;
