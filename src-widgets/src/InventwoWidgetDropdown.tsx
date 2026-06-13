import React from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState, VisRxWidgetProps } from '@iobroker/types-vis-2';
import { createDocsLinkField } from './utils/docLinkField';

interface DropdownRxData {
    oid: null | string;
    showValue: boolean;
    showText: boolean;
    readOnly: boolean;
    title: string;
    backgroundOid: string | null;
    countBgConditions: number;
    [key: `bgConditionValue${number}`]: string;
    [key: `bgConditionOperator${number}`]: string;
    [key: `bgConditionColor${number}`]: string;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    highlightColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    titleFontSize: number;
    titleColor: string;
    titleBgFromCondition: boolean;
    titlePaddingTop: number;
    titlePaddingBottom: number;
    titlePaddingLeft: number;
    titlePaddingRight: number;
    shadowX: number;
    shadowY: number;
    shadowBlur: number;
    shadowSpread: number;
    shadowColor: string;
    widgetShadowX: number;
    widgetShadowY: number;
    widgetShadowBlur: number;
    widgetShadowSpread: number;
    widgetShadowColor: string;
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
        const prev = prevState.rxData as any;
        const curr = this.state.rxData as any;
        if (prev.oid !== curr.oid || prev.showValue !== curr.showValue || prev.showText !== curr.showText) {
            await this.loadOptions();
        }
    }

    async loadOptions(): Promise<void> {
        const oid = this.state.rxData.oid;
        if (!this.validOid(oid) || !oid) {
            this.setState({ options: [] });
            return;
        }

        try {
            const obj = await this.props.context.socket.getObject(oid);
            if (obj?.common?.states) {
                const states: Record<any, any> = obj.common.states;
                const options: Array<{ value: string | number; label: string }> = [];

                const showVal = this.state.rxData.showValue !== false; // default true (backward compat)
                const showTxt = this.state.rxData.showText !== false; // default true

                if (typeof states === 'object') {
                    Object.entries(states).forEach(([key, value]) => {
                        const numKey = !isNaN(Number(key)) ? Number(key) : key;
                        let label: string;
                        if (showVal && showTxt) {
                            label = `${key} - ${value}`;
                        } else if (showVal && !showTxt) {
                            label = String(key);
                        } else {
                            label = String(value); // showTxt=true or fallback
                        }
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

    // eslint-disable-next-line class-methods-use-this
    compareValues(a: any, b: any, op: string): boolean {
        const numA = a !== '' && !isNaN(Number(a)) ? Number(a) : a;
        const numB = b !== '' && !isNaN(Number(b)) ? Number(b) : b;
        switch (op) {
            case '===':
                return numA == numB;
            case '!=':
                return numA != numB;
            case '>':
                return numA > numB;
            case '<':
                return numA < numB;
            case '>=':
                return numA >= numB;
            case '<=':
                return numA <= numB;
            default:
                return String(a) === String(b);
        }
    }

    getEffectiveBackground(defaultBg: string): string {
        const count = this.state.rxData.countBgConditions ?? 0;
        if (count === 0) {
            return defaultBg;
        }

        const bgOid = this.validOid(this.state.rxData.backgroundOid)
            ? this.state.rxData.backgroundOid
            : this.state.rxData.oid;
        const bgValue = this.getValue(bgOid);

        for (let i = 1; i <= count; i++) {
            const op = this.state.rxData[`bgConditionOperator${i}`] ?? '===';
            const condValue = this.state.rxData[`bgConditionValue${i}`];
            const color = this.state.rxData[`bgConditionColor${i}`];
            if (!color) {
                continue;
            }
            if (this.compareValues(bgValue, condValue, op)) {
                return color;
            }
        }
        return defaultBg;
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
                        createDocsLinkField('docs/en/widgets/dropdown-widget.md') as any,
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
                            tooltip: 'tooltip_widget_dropwown_show_value_in_label',
                        },
                        {
                            name: 'showText',
                            type: 'checkbox',
                            label: 'show_text',
                            default: true,
                        },
                        {
                            name: 'readOnly',
                            type: 'checkbox',
                            label: 'read_only',
                            default: false,
                        },
                        {
                            name: 'title',
                            type: 'text',
                            label: 'title',
                        },
                    ],
                },
                {
                    name: 'attr_group_dropdown_bg_conditions',
                    label: 'attr_group_dropdown_bg_conditions',
                    fields: [
                        {
                            name: 'backgroundOid',
                            type: 'id',
                            label: 'background_oid',
                        },
                        {
                            name: 'countBgConditions',
                            type: 'number',
                            default: 0,
                            label: 'count_row_color_conditions',
                        },
                    ],
                },
                {
                    name: 'countBgConditions',
                    indexFrom: 1,
                    indexTo: 'countBgConditions',
                    label: 'attr_group_row_color_condition',
                    fields: [
                        {
                            name: 'bgConditionOperator',
                            type: 'select',
                            options: [
                                { value: '===', label: 'equal' },
                                { value: '!=', label: 'not_equal' },
                                { value: '>', label: 'greater' },
                                { value: '<', label: 'lower' },
                                { value: '>=', label: 'greater_equal' },
                                { value: '<=', label: 'lower_equal' },
                            ],
                            default: '===',
                            label: 'comparison_operator',
                        },
                        {
                            name: 'bgConditionValue',
                            type: 'text',
                            label: 'value',
                        },
                        {
                            name: 'bgConditionColor',
                            type: 'color',
                            label: 'background',
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
                            label: 'background',
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
                            name: 'titleFontSize',
                            type: 'slider',
                            min: 8,
                            max: 48,
                            step: 1,
                            default: 12,
                            label: 'title_font_size',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'titleColor',
                            type: 'color',
                            label: 'title_color',
                            default: 'rgba(180, 180, 180, 1)',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'titleBgFromCondition',
                            type: 'checkbox',
                            label: 'title_bg_from_condition',
                            default: false,
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'titlePaddingTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'title_padding_top',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'titlePaddingBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 4,
                            label: 'title_padding_bottom',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'titlePaddingLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'title_padding_left',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'titlePaddingRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'title_padding_right',
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
                            name: 'shadowSpread',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'spread',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'shadowColor',
                            type: 'color',
                            default: 'rgba(0, 0, 0, 0.5)',
                            label: 'shadow_color',
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
                            text: 'vis_2_widgets_inventwo_widget_shadow',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'widgetShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'x_offset',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'widgetShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'y_offset',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'widgetShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'blur',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'widgetShadowSpread',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'spread',
                            hidden: '!!data.dropdownFromWidget',
                        },
                        {
                            name: 'widgetShadowColor',
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

        const oid = this.state.rxData.oid;
        if (!this.validOid(oid) || !oid) {
            return;
        }

        const value = event.target.value;
        const typedValue = typeof value === 'number' ? value : !isNaN(Number(value)) ? Number(value) : value;
        this.props.context.setValue(oid, typedValue);
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);

        const style = this.getStyle('dropdownFromWidget', this.groupAttrs.attr_group_css_dropdown);
        const effectiveBg = this.getEffectiveBackground(style.backgroundColor);

        const title = this.state.rxData.title;
        const readOnly = this.state.rxData.readOnly;

        // Find label for current value
        const currentOption = this.state.options.find(o => String(o.value) === String(value));
        const displayLabel = currentOption
            ? currentOption.label
            : value !== undefined && value !== null
              ? String(value)
              : '';

        const titleElement = title ? (
            <div
                style={{
                    fontSize: `${style.titleFontSize ?? 12}px`,
                    color: style.titleColor ?? 'rgba(180,180,180,1)',
                    paddingTop: `${style.titlePaddingTop ?? 2}px`,
                    paddingBottom: `${style.titlePaddingBottom ?? 4}px`,
                    paddingLeft: `${style.titlePaddingLeft ?? 0}px`,
                    paddingRight: `${style.titlePaddingRight ?? 0}px`,
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flexShrink: 0,
                    ...(style.titleBgFromCondition ? { background: effectiveBg } : {}),
                }}
            >
                {title}
            </div>
        ) : null;

        const shadow = `${style.shadowX}px ${style.shadowY}px ${style.shadowBlur}px ${style.shadowSpread ?? 0}px ${style.shadowColor}`;

        const widgetShadow =
            style.widgetShadowX || style.widgetShadowY || style.widgetShadowBlur || style.widgetShadowSpread
                ? `${style.widgetShadowX ?? 0}px ${style.widgetShadowY ?? 0}px ${style.widgetShadowBlur ?? 0}px ${style.widgetShadowSpread ?? 0}px ${style.widgetShadowColor ?? 'rgba(0,0,0,0.5)'}`
                : undefined;

        if (readOnly) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        boxShadow: widgetShadow,
                    }}
                >
                    {titleElement}
                    <div
                        style={{
                            flex: 1,
                            fontSize: `${style.fontSize}px`,
                            color: style.textColor,
                            background: effectiveBg,
                            padding: '0 14px',
                            borderRadius: `${style.borderRadius}px`,
                            border: `${style.borderWidth ?? 1}px solid ${style.borderColor}`,
                            boxShadow: shadow,
                            display: 'flex',
                            alignItems: 'center',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap' as const,
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {displayLabel}
                    </div>
                </div>
            );
        }

        const selectStyles = {
            borderRadius: `${style.borderRadius}px`,
            height: '100%',
            '& .MuiSelect-select': {
                fontSize: `${style.fontSize}px`,
                color: style.textColor,
                background: effectiveBg,
                padding: '0 14px',
                height: '100% !important',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                borderRadius: `${style.borderRadius}px`,
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
                borderWidth: `${style.borderWidth}px`,
            },
            '& .MuiSelect-icon': {
                color: style.textColor,
            },
        };

        const menuProps = {
            PaperProps: {
                style: {
                    maxHeight: 400,
                    backgroundColor: style.backgroundColor,
                    boxShadow: shadow,
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
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    boxShadow: widgetShadow,
                }}
            >
                {titleElement}
                <div
                    style={{
                        flex: 1,
                        boxShadow: shadow,
                        borderRadius: `${style.borderRadius}px`,
                        overflow: 'visible',
                    }}
                >
                    <FormControl
                        fullWidth
                        style={{ height: '100%' }}
                    >
                        <Select
                            disabled={this.props.editMode}
                            value={value !== undefined && value !== null ? value : ''}
                            onChange={e => this.onChange(e)}
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
                </div>
            </div>
        );
    }
}
