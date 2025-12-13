import React from 'react';
import { FormControlLabel, FormGroup, Checkbox } from '@mui/material';

import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';

interface CheckboxRxData {
    oid: null | string;
    valueFalse: any;
    valueTrue: any;
    textFalse: string;
    textTrue: string;
    textPosition: 'top' | 'bottom' | 'start' | 'end';
}

export default class InventwoWidgetCheckbox extends InventwoGeneric<CheckboxRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
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
                        },
                        {
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
                    ],
                },
            ],
            visDefaultStyle: {
                'overflow-x': 'visible',
                'overflow-y': 'visible',
                width: 70,
                height: 40,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-checkbox.png',
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetCheckbox.getWidgetInfo();
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    onChange(): void {
        if (this.props.editMode) {
            return;
        }

        const oid = this.state.rxData.oid;
        if (!this.validOid(oid) || !oid) {
            return;
        }
        if (this.getValue(oid) === this.convertValue(this.state.rxData.valueTrue)) {
            this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueFalse));
        } else {
            this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue));
        }
    }

    getValue(oid: string | null | undefined): any {
        if (this.validOid(oid)) {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }
    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);
        const isChecked = this.validOid(oid) && value === this.convertValue(this.state.rxData.valueTrue);

        const styles = this.getStyle('styleFromWidget', this.groupAttrs.attr_group_css_style);

        const attributes = {
            color: styles.boxColor,
            '&.Mui-checked': {
                color: styles.boxColorActive,
            },
            '& .MuiSvgIcon-root': {
                fontSize: `${styles.boxSize}px`,
            },
        };

        const attributesLabel = {
            '& .MuiFormControlLabel-label': {
                fontSize: this.state.rxStyle!['font-size'],
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

        return (
            <FormGroup>
                <FormControlLabel
                    sx={attributesLabel}
                    control={
                        <Checkbox
                            sx={attributes}
                            onClick={() => this.onChange()}
                            checked={isChecked}
                        />
                    }
                    label={isChecked ? this.state.rxData.textTrue : this.state.rxData.textFalse}
                    labelPlacement={this.state.rxData.textPosition}
                />
            </FormGroup>
        );
    }
}
