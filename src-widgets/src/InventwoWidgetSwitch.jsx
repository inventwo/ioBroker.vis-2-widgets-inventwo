import React from 'react';
import {
    FormControlLabel,
    FormGroup,
    Switch,
} from '@mui/material';

import InventwoGeneric from './InventwoGeneric';

class InventwoWidgetSwitch extends InventwoGeneric {
    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetSwitch',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_switch',
            visName: 'widget_switch',
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
                    name: 'attr_group_css_track',
                    label: 'attr_group_css_track',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'trackFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetSwitch',
                            all: true,
                        },
                        {
                            name: 'trackColor',
                            type: 'color',
                            label: 'track_color',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackColorTrue',
                            type: 'color',
                            label: 'track_color_true',
                            default: 'rgb(143,164,85)',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackSize',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'track_width',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackBorderRadius',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'track_border_radius',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            type: 'delimiter',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            type: 'help',
                            text: 'track_shadow',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'shadow_color',
                            hidden: '!!data.trackFromWidget',
                        },
                        {
                            name: 'trackShadowColorTrue',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'shadow_color_true',
                            hidden: '!!data.trackFromWidget',
                        },
                    ],
                },
                {
                    name: 'attr_group_css_thumb',
                    label: 'attr_group_css_thumb',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'thumbFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetSwitch',
                            all: true,
                        },
                        {
                            name: 'thumbColor',
                            type: 'color',
                            label: 'thumb_color',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbColorTrue',
                            type: 'color',
                            label: 'thumb_color_true',
                            default: 'rgb(69,86,24)',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbSize',
                            type: 'slider',
                            min: 1,
                            max: 50,
                            step: 1,
                            default: 16,
                            label: 'thumbSize',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbBorderRadius',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 100,
                            label: 'thumb_border_radius',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            type: 'delimiter',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            type: 'help',
                            text: 'thumb_shadow',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbShadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color',
                            hidden: '!!data.thumbFromWidget',
                        },
                        {
                            name: 'thumbShadowColorTrue',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color_true',
                            hidden: '!!data.thumbFromWidget',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                overflow: 'visible',
                width: 70,
                height: 40,
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

    static getI18nPrefix() {
        return 'vis_2_widgets_inventwo_';
    }

    onChange() {
        if (this.props.editMode) return;
        const oid = this.state.rxData.oid;
        if (this.getValue(this.state.rxData.oid) === InventwoWidgetSwitch.convertValue(this.state.rxData.valueTrue, true)) {
            this.props.context.setValue(oid, InventwoWidgetSwitch.convertValue(this.state.rxData.valueFalse, false));
        } else {
            this.props.context.setValue(oid, InventwoWidgetSwitch.convertValue(this.state.rxData.valueTrue, true));
        }
    }

    getValue(oid) {
        if (oid !== undefined && oid !== '' && oid !== 'nothing_selected') {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }

    static convertValue(value, defaultValue) {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(value)) {
            return parseFloat(value);
        }
        if (value === undefined || value === null || value === '') {
            return defaultValue;
        }

        return value;
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);
        const isChecked = value === InventwoWidgetSwitch.convertValue(this.state.rxData.valueTrue, true);

        const trackStyle = this.getStyle('trackFromWidget', this.groupAttrs.attr_group_css_track);
        const thumbStyle = this.getStyle('thumbFromWidget', this.groupAttrs.attr_group_css_thumb);

        let thumbShadowColor = thumbStyle.thumbShadowColor;
        let trackShadowColor = trackStyle.trackShadowColor;
        if (isChecked) {
            thumbShadowColor = thumbStyle.thumbShadowColorTrue;
            trackShadowColor = trackStyle.trackShadowColorTrue;
        }

        const attributes = {
            '&.MuiSwitch-root': {
                alignItems: 'center',
                height: trackStyle.trackSize,
                width: '34px',
                boxSizing: 'content-box',
            },
            '& .MuiSwitch-switchBase': {
                color: thumbStyle.thumbColor,
                top: 'unset',
            },
            '& .MuiSwitch-thumb': {
                width: thumbStyle.thumbSize,
                height: thumbStyle.thumbSize,
                borderRadius: `${thumbStyle.thumbBorderRadius}%`,
                boxShadow: `${thumbStyle.thumbShadowX}px ${thumbStyle.thumbShadowY}px ${thumbStyle.thumbShadowBlur}px ${thumbStyle.thumbShadowSize}px ${thumbShadowColor}`,
            },
            '& .Mui-checked .MuiSwitch-thumb': {
                color: thumbStyle.thumbColorTrue,
            },
            '& .MuiSwitch-track': {
                backgroundColor: trackStyle.trackColor,
                // eslint-disable-next-line no-mixed-operators
                borderRadius: `${trackStyle.trackBorderRadius / 2 / 100 * trackStyle.trackSize}px`,
                boxShadow: `${trackStyle.trackShadowX}px ${trackStyle.trackShadowY}px ${trackStyle.trackShadowBlur}px ${trackStyle.trackShadowSize}px ${trackShadowColor}`,
            },
            '& .Mui-checked + .MuiSwitch-track': {
                backgroundColor: trackStyle.trackColorTrue,
            },
        };

        return <FormGroup>
            <FormControlLabel
                control={<Switch
                    disabled={this.props.editMode}
                    sx={attributes}
                    onClick={() => this.onChange()}
                    checked={isChecked}
                />}
                label={isChecked ? this.state.rxData.textTrue : this.state.rxData.textFalse}
                labelPlacement={this.state.rxData.textPosition}
            />
        </FormGroup>;
    }
}

export default InventwoWidgetSwitch;
