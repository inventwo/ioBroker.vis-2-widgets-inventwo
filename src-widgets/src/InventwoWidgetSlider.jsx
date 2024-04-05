import React from 'react';
import {
    Slider,
} from '@mui/material';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import { styled } from '@mui/styles';

class InventwoWidgetSlider extends (window.visRxWidget || VisRxWidget) {
    constructor(props) {
        super(props);
        this.state.sliderValue = 0;
    }

    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetSlider',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'vis_2_widgets_inventwo_widget_slider',
            visName: 'vis_2_widgets_inventwo_widget_slider',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
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
                    name: 'vis_2_widgets_inventwo_attr_group_css_slider_track',
                    label: 'vis_2_widgets_inventwo_attr_group_css_slider_track',
                    fields: [
                        {
                            name: 'sliderRailColor',
                            type: 'color',
                            default: 'rgb(110,110,110)',
                            label: 'slider_rail_color',
                        },
                        {
                            name: 'sliderRailActiveColor',
                            type: 'color',
                            default: 'rgb(94,107,63)',
                            label: 'slider_rail_active_color',
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
                        },
                        {
                            name: 'trackWidth',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'track_width',
                        },
                        {
                            name: 'trackBorderRadius',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'track_border_radius',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'track_shadow',
                        },
                        {
                            name: 'trackShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                        },
                        {
                            name: 'trackShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                        },
                        {
                            name: 'trackShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                        },
                        {
                            name: 'trackShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                        },
                        {
                            name: 'trackShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'shadow_color',
                        },
                    ],
                },
                {
                    name: 'vis_2_widgets_inventwo_attr_group_css_slider_slider_thumb',
                    label: 'vis_2_widgets_inventwo_attr_group_css_slider_slider_thumb',
                    fields: [
                        {
                            name: 'sliderThumbColor',
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'slider_thumb_color',
                        },
                        {
                            name: 'thumbSize',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 16,
                            label: 'thumbSize',
                        },
                        {
                            name: 'thumbBorderRadius',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'thumb_border_radius',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'thumb_shadow',
                        },
                        {
                            name: 'thumbShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                        },
                        {
                            name: 'thumbShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                        },
                        {
                            name: 'thumbShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                        },
                        {
                            name: 'thumbShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                        },
                        {
                            name: 'thumbShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color',
                        },
                    ],
                },

            ],
            visDefaultStyle: {
                width: 110,
                overflow: 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-slider.png',
        };
    }

    // eslint-disable-next-line class-methods-use-this
    propertiesUpdate() {
        // Widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get value of state with id this.state.rxData.oid
        // 2. this.state.rxData - contains all widget data with replaced bindings. E.g. if this.state.data.type is `{system.adapter.admin.0.alive}`,
        //                        then this.state.rxData.type will have state value of `system.adapter.admin.0.alive`
        // 3. this.state.rxStyle - contains all widget styles with replaced bindings. E.g. if this.state.styles.width is `{javascript.0.width}px`,
        //                        then this.state.rxData.type will have state value of `javascript.0.width` + 'px
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return InventwoWidgetSlider.getWidgetInfo();
    }

    // This function is called every time when rxData is changed
    onRxDataChanged() {
        this.propertiesUpdate();
    }

    // This function is called every time when rxStyle is changed
    // eslint-disable-next-line class-methods-use-this
    onRxStyleChanged() {

    }

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    onStateUpdated(id, state) {

    }

    onChange(e, value) {
        if (this.props.editMode) return;
        const oid = this.state.rxData.oid;
        this.props.context.setValue(oid, parseFloat(value));
    }

    getValue(oid) {
        if (oid !== undefined && oid !== '' && oid !== 'nothing_selected') {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);
        const trackBarType = this.state.rxData.trackBarType;

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

        const sliderAttributes = {
            height: this.state.rxData.orientation === 'horizontal' ? this.state.rxData.trackWidth : '100%',
            width: this.state.rxData.orientation !== 'horizontal' ? this.state.rxData.trackWidth : '100%',
            '& .MuiSlider-thumb': {
                backgroundColor: this.state.rxData.sliderThumbColor, // color of thumbs
                width: this.state.rxData.thumbSize,
                height: this.state.rxData.thumbSize,
                borderRadius: `${this.state.rxData.thumbBorderRadius}%`,
                // marginLeft: `-${thumbOffset}px`,
                '&:before': {
                    boxShadow: `${this.state.rxData.thumbShadowX}px ${this.state.rxData.thumbShadowY}px ${this.state.rxData.thumbShadowBlur}px ${this.state.rxData.thumbShadowSize}px ${this.state.rxData.thumbShadowColor}`,
                },
            },
            '& .MuiSlider-rail': {
                backgroundColor: trackBarType === 'normal' ? this.state.rxData.sliderRailColor : trackBarType === 'inverted' ? this.state.rxData.sliderRailActiveColor : '', /// /color of the slider outside  teh area between thumbs
                color: trackBarType === 'normal' ? this.state.rxData.sliderRailColor : trackBarType === 'inverted' ? this.state.rxData.sliderRailActiveColor : '',
                border: 'none',
                borderRadius: this.state.rxData.trackBorderRadius,
                boxShadow: `${this.state.rxData.trackShadowX}px ${this.state.rxData.trackShadowY}px ${this.state.rxData.trackShadowBlur}px ${this.state.rxData.trackShadowSize}px ${this.state.rxData.trackShadowColor}`,
            },
            '& .MuiSlider-track': {
                backgroundColor: trackBarType === 'normal' ? this.state.rxData.sliderRailActiveColor : trackBarType === 'inverted' ? this.state.rxData.sliderRailColor : '',
                color: trackBarType === 'normal' ? this.state.rxData.sliderRailActiveColor : trackBarType === 'inverted' ? this.state.rxData.sliderRailColor : '',
                border: 'none',
                borderRadius: this.state.rxData.trackBorderRadius,
            },
            '& .MuiSlider-mark': {
                color: this.state.rxData.sliderRailActiveColor,
            },
            '& .MuiSlider-markLabel': {
                fontSize: this.state.rxStyle['font-size'],
            },
        };

        if (this.state.rxData.orientation === 'horizontal') {
            sliderAttributes['& .MuiSlider-markLabel'].top = this.state.rxData.trackWidth + 20;
        } else {
            sliderAttributes['& .MuiSlider-markLabel'].left = this.state.rxData.trackWidth + 20;
        }

        const CustomSlider = styled(Slider)(() => (sliderAttributes));

        return <CustomSlider
            onChangeCommitted={(e, val) => this.onChange(e, val)}
            min={this.state.rxData.minValue}
            max={this.state.rxData.maxValue}
            step={this.state.rxData.step}
            defaultValue={value}
            valueLabelDisplay="auto"
            track={this.state.rxData.trackBarType}
            orientation={this.state.rxData.orientation}
            marks={marks}
        ></CustomSlider>;
    }
}

export default InventwoWidgetSlider;
