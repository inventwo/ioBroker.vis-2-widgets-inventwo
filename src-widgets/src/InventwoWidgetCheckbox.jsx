import React from 'react';
import {
    FormControlLabel,
    FormGroup,
    Checkbox,
} from '@mui/material';

import InventwoGeneric from './InventwoGeneric';

class InventwoWidgetCheckbox extends InventwoGeneric {
    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetCheckbox',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_checkbox',
            visName: 'widget_checkbox',
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
                    name: 'attr_group_css_style',
                    label: 'attr_group_css_style',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'styleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetCheckbox',
                            all: true,
                        },

                        {
                            name: 'boxColor',
                            type: 'color',
                            label: 'box_color',
                            hidden: '!!data.styleFromWidget',
                        },
                        {
                            name: 'boxColorActive',
                            type: 'color',
                            label: 'box_color_active',
                            hidden: '!!data.styleFromWidget',
                        },
                        {
                            name: 'boxSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 24,
                            label: 'box_size',
                            hidden: '!!data.styleFromWidget',
                        },
                    ]
                }
            ],
            visDefaultStyle: {
                overflow: 'visible',
                width: 70,
                height: 40,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-checkbox.png',
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
        return InventwoWidgetCheckbox.getWidgetInfo();
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
        if (!this.validOid(oid)) return;
        if (this.getValue(this.state.rxData.oid) === this.convertValue(this.state.rxData.valueTrue, true)) {
            this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueFalse, false));
        } else {
            this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue, true));
        }
    }

    getValue(oid) {
        if (this.validOid(oid)) {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }
    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);
        const isChecked = this.validOid(oid) && value === this.convertValue(this.state.rxData.valueTrue, true);

        const styles = this.getStyle('styleFromWidget', this.groupAttrs.attr_group_css_style);

        const attributes = {
            color: styles.boxColor,
            '&.Mui-checked': {
                color: styles.boxColorActive
            },
            '& .MuiSvgIcon-root': {
                fontSize: styles.boxSize + 'px'
            }
        }

        const attributesLabel = {
            '& .MuiFormControlLabel-label': {
                fontSize: this.state.rxStyle['font-size'],
                textShadow: this.state.rxStyle['text-shadow'],
                fontFamily: this.state.rxStyle['font-family'],
                fontStyle: this.state.rxStyle['font-style'],
                fontVariant: this.state.rxStyle['font-variant'],
                fontWeight: this.state.rxStyle['font-weight'],
                lineHeight: this.state.rxStyle['line-height'],
                letterSpacing: this.state.rxStyle['letter-spacing'],
                wordSpacing: this.state.rxStyle['word-spacing'],
            }
        }

        return <FormGroup>
            <FormControlLabel
                sx={attributesLabel}
                control={<Checkbox
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

export default InventwoWidgetCheckbox;
