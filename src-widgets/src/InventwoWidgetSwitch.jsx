import React from 'react';
import {
    FormControlLabel,
    FormGroup,
    Switch,
} from '@mui/material';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import { styled } from '@mui/styles';

class InventwoWidgetSwitch extends (window.visRxWidget || VisRxWidget) {
    constructor(props) {
        super(props);
        this.state.sliderValue = 0;
    }

    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetSwitch',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'vis_2_widgets_inventwo_widget_switch',
            visName: 'vis_2_widgets_inventwo_widget_switch',
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
                            name: 'valueFalse',
                            type: 'text',
                            label: 'value_false',
                        },
                        {
                            name: 'valueTrue',
                            type: 'text',
                            label: 'value_true',
                        },
                        {
                            name: 'textFalse',
                            type: 'html',
                            label: 'text_false',
                        }, {
                            name: 'textTrue',
                            type: 'html',
                            label: 'text_true',
                        },
                        {
                            name: 'textPosition',
                            type: 'select',
                            options: [
                                { value: 'top', label: 'top' },
                                { value: 'bottom', label: 'bottom' },
                                { value: 'start', label: 'start' },
                                { value: 'end', label: 'end' },
                            ],
                            default: 'end',
                            label: 'text_position',
                        },
                    ],
                },
                {
                    name: 'vis_2_widgets_inventwo_attr_group_css_track',
                    label: 'vis_2_widgets_inventwo_attr_group_css_track',
                    fields: [
                        {
                            name: 'trackColor',
                            type: 'color',
                            label: 'track_color',
                        },
                        {
                            name: 'trackColorTrue',
                            type: 'color',
                            label: 'track_color_true',
                            default: 'rgb(143,164,85)',
                        },
                        {
                            name: 'trackSize',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 12,
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
                        {
                            name: 'trackShadowColorTrue',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'shadow_color_true',
                        },
                    ],
                },
                {
                    name: 'vis_2_widgets_inventwo_attr_group_css_thumb',
                    label: 'vis_2_widgets_inventwo_attr_group_css_thumb',
                    fields: [
                        {
                            name: 'thumbColor',
                            type: 'color',
                            label: 'thumb_color',
                        },
                        {
                            name: 'thumbColorTrue',
                            type: 'color',
                            label: 'thumb_color_true',
                            default: 'rgb(69,86,24)',
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
                        {
                            name: 'thumbShadowColorTrue',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color_true',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                overflow: 'visible',
                width: 50,
                height: 38,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-switch.png',
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
        return InventwoWidgetSwitch.getWidgetInfo();
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

    onChange() {
        if (this.props.editMode) return;
        const oid = this.state.rxData.oid;
        if (this.getValue(this.state.rxData.oid) === this.convertValue(this.state.rxData.valueTrue)) {
            this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueFalse));
        } else {
            this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue));
        }
    }

    getValue(oid) {
        if (oid !== undefined && oid !== '' && oid !== 'nothing_selected') {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }

    // eslint-disable-next-line class-methods-use-this
    convertValue(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(value)) return parseFloat(value);
        return value;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);
        const isChecked = value === this.convertValue(this.state.rxData.valueTrue);

        let thumbShadowColor = this.state.rxData.thumbShadowColor;
        let trackShadowColor = this.state.rxData.trackShadowColor;
        if (isChecked) {
            thumbShadowColor = this.state.rxData.thumbShadowColorTrue;
            trackShadowColor = this.state.rxData.trackShadowColorTrue;
        }

        const attributes = {
            '&.MuiSwitch-root': {
                alignItems: 'center',
                height: this.state.rxData.trackSize,
                width: '34px',
                boxSizing: 'content-box',
            },
            '& .MuiSwitch-switchBase': {
                color: this.state.rxData.thumbColor,
                top: 'unset',
            },
            '& .MuiSwitch-thumb': {
                width: this.state.rxData.thumbSize,
                height: this.state.rxData.thumbSize,
                borderRadius: `${this.state.rxData.thumbBorderRadius}%`,
                boxShadow: `${this.state.rxData.thumbShadowX}px ${this.state.rxData.thumbShadowY}px ${this.state.rxData.thumbShadowBlur}px ${this.state.rxData.thumbShadowSize}px ${thumbShadowColor}`,
            },
            '& .Mui-checked': {
                color: this.state.rxData.thumbColorTrue,
            },
            '& .MuiSwitch-track': {
                backgroundColor: this.state.rxData.trackColor,
                // eslint-disable-next-line no-mixed-operators
                borderRadius: `${this.state.rxData.trackBorderRadius / 2 / 100 * this.state.rxData.trackSize}px`,
                boxShadow: `${this.state.rxData.trackShadowX}px ${this.state.rxData.trackShadowY}px ${this.state.rxData.trackShadowBlur}px ${this.state.rxData.trackShadowSize}px ${trackShadowColor}`,
            },
            '& .Mui-checked + .MuiSwitch-track': {
                backgroundColor: this.state.rxData.trackColorTrue,
            },
        };

        const CustomSwitch = styled(Switch)(() => (attributes));

        return <FormGroup>
            <FormControlLabel
                control={
                    <CustomSwitch
                        onClick={() => this.onChange()}
                        checked={isChecked}
                    ></CustomSwitch>
                }
                label={isChecked ? this.state.rxData.textTrue : this.state.rxData.textFalse}
                labelPlacement={this.state.rxData.textPosition}
            ></FormControlLabel>

        </FormGroup>;
    }
}

export default InventwoWidgetSwitch;
