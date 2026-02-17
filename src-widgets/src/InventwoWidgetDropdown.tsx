import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState, VisRxWidgetProps } from '@iobroker/types-vis-2';

interface DropdownRxData {
    oid: null | string;
    showValue: boolean;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    highlightColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    shadowX: number;
    shadowY: number;
    shadowBlur: number;
    shadowColor: string;
}

interface DropdownState extends VisRxWidgetState {
    options: Array<{ value: string | number; label: string }>;
}

export default class InventwoWidgetDropdown extends InventwoGeneric<DropdownRxData, DropdownState> {
    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = {
            ...this.state,
            options: [],
        };
    }

    async componentDidMount(): Promise<void> {
        super.componentDidMount();
        await this.loadOptions();
    }

    async componentDidUpdate(prevProps: VisRxWidgetProps, prevState: DropdownState): Promise<void> {
        const prevOid = (prevState.rxData as any).oid;
        const currentOid = (this.state.rxData as any).oid;
        if (prevOid !== currentOid) {
            await this.loadOptions();
        }
    }

    async loadOptions(): Promise<void> {
        const oid = (this.state.rxData as any).oid;
        if (!this.validOid(oid) || !oid) {
            this.setState({ options: [] });
            return;
        }

        try {
            const obj = await this.props.context.socket.getObject(oid);
            if (obj?.common?.states) {
                const states = obj.common.states;
                const options: Array<{ value: string | number; label: string }> = [];

                if (typeof states === 'object') {
                    Object.entries(states).forEach(([key, value]) => {
                        const numKey = !isNaN(Number(key)) ? Number(key) : key;
                        const label = (this.state.rxData as any).showValue ? `${key} - ${value}` : String(value);
                        options.push({ value: numKey, label });
                    });
                }

                this.setState({ options });
            } else {
                this.setState({ options: [] });
            }
        } catch (error) {
            console.error('Error loading dropdown options:', error);
            this.setState({ options: [] });
        }
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetDropdown',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_dropdown',
            visName: 'widget_dropdown',
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
                            name: 'showValue',
                            type: 'checkbox',
                            label: 'show_value_in_label',
                            default: true,
                        },
                    ],
                },
                {
                    name: 'attr_group_css_dropdown',
                    label: 'attr_group_css_dropdown',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'dropdownFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetDropdown',
                            all: true,
                        },
                        {
                            name: 'fontSize',
                            type: 'slider',
                            min: 8,
                            max: 48,
                            step: 1,
                            default: 16,
                            label: 'font_size',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'textColor',
                            type: 'color',
                            label: 'text_color',
                            default: 'rgba(255, 255, 255, 1)',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'backgroundColor',
                            type: 'color',
                            label: 'background_color',
                            default: 'rgba(50, 50, 50, 1)',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'highlightColor',
                            type: 'color',
                            label: 'highlight_color',
                            default: 'rgba(143, 164, 85, 1)',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'borderColor',
                            type: 'color',
                            label: 'border_color',
                            default: 'rgba(100, 100, 100, 1)',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'borderWidth',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 1,
                            label: 'border_width',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'borderRadius',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 4,
                            label: 'border_radius',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_dropdown_shadow',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'shadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'shadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'shadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 4,
                            label: 'blur',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'shadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color',
                            hidden: '!!data.dropdownFromWidget',
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                'overflow-x': 'visible',
                'overflow-y': 'visible',
                width: 300,
                height: 50,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-dropdown.png',
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetDropdown.getWidgetInfo();
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    onChange(event: SelectChangeEvent<string | number>): void {
        if (this.props.editMode) {
            return;
        }

        const oid = (this.state.rxData as any).oid;
        if (!this.validOid(oid) || !oid) {
            return;
        }

        const value = event.target.value;
        // Ensure value is the correct type (number or string based on option)
        const typedValue = typeof value === 'number' ? value : !isNaN(Number(value)) ? Number(value) : value;
        this.props.context.setValue(oid, typedValue);
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const oid = (this.state.rxData as any).oid;
        const value = this.getValue(oid);

        const style = this.getStyle('dropdownFromWidget', this.groupAttrs.attr_group_css_dropdown);

        const selectStyles = {
            '& .MuiSelect-select': {
                fontSize: `${style.fontSize}px`,
                color: style.textColor,
                backgroundColor: style.backgroundColor,
                borderRadius: `${style.borderRadius}px`,
                padding: '10px 14px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: style.borderColor,
                borderWidth: `${style.borderWidth}px`,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: style.highlightColor,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: style.highlightColor,
            },
            '& .MuiSelect-icon': {
                color: style.textColor,
            },
            boxShadow: `${style.shadowX}px ${style.shadowY}px ${style.shadowBlur}px ${style.shadowColor}`,
        };

        const menuProps = {
            PaperProps: {
                style: {
                    maxHeight: 400,
                    backgroundColor: style.backgroundColor,
                    boxShadow: `${style.shadowX}px ${style.shadowY}px ${style.shadowBlur}px ${style.shadowColor}`,
                },
            },
        };

        const menuItemStyles = {
            fontSize: `${style.fontSize}px`,
            color: style.textColor,
            backgroundColor: style.backgroundColor,
            '&:hover': {
                backgroundColor: style.highlightColor,
            },
            '&.Mui-selected': {
                backgroundColor: style.highlightColor,
            },
            '&.Mui-selected:hover': {
                backgroundColor: style.highlightColor,
            },
        };

        return (
            <FormControl fullWidth>
                <Select
                    value={value !== undefined && value !== null ? value : ''}
                    onChange={e => this.onChange(e)}
                    disabled={this.props.editMode}
                    sx={selectStyles}
                    MenuProps={menuProps}
                >
                    {this.state.options.map(option => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={menuItemStyles}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}
