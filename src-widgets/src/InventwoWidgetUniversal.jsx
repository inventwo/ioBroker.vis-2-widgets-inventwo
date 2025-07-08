import React from 'react';
import {
    Card, CardContent, Dialog,
    DialogContent, DialogTitle, IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { Icon } from '@iobroker/adapter-react-v5';

import { hexToCSSFilter } from 'hex-to-css-filter';
import iro from './lib/iro.min';

import './assets/inventwo.css';
import InventwoGeneric from './InventwoGeneric';

const styles = {
    dialogTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
};

class InventwoWidgetUniversal extends InventwoGeneric {
    constructor(props) {
        super(props);
        this.state.currentView = null;
        this.state.dialogOpen = false;
        this.state.showFeedback = false;
        this.state.isMounted = false;
        this.state.svgRef = React.createRef();
        this.state.previousOidValue = null;
    }

    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetUniversal',
            visSet: 'vis-2-widgets-inventwo',
            visSetLabel: 'set_label',
            visWidgetLabel: 'widget_universal',
            visName: 'widget_universal',
            visSetColor: 'rgba(69, 86, 24, 1)',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'type',
                            type: 'select',
                            options: [
                                { value: 'switch', label: 'switch' },
                                { value: 'button', label: 'button' },
                                { value: 'nav', label: 'nav' },
                                { value: 'readonly', label: 'read_only' },
                                { value: 'viewInDialog', label: 'view_in_dialog' },
                                { value: 'increaseDecreaseValue', label: 'increase_decrease_value' },
                                { value: 'http', label: 'send_http' },
                            ],
                            default: 'switch',
                            label: 'type',
                            tooltip: 'tooltip_widget_type',
                        },
                        {
                            name: 'mode',
                            type: 'select',
                            options: [
                                { value: 'singleButton', label: 'single_button' },
                                { value: 'separatedButtons', label: 'separated_buttons' },
                            ],
                            default: 'singleButton',
                            label: 'mode',
                            tooltip: 'tooltip_widget_mode',
                        },
                        {
                            name: 'direction',
                            type: 'select',
                            options: [
                                { value: 'row', label: 'row' },
                                { value: 'column', label: 'column' },
                            ],
                            default: 'row',
                            label: 'direction',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
                            // hidden: '(data.type == "nav" || data.type == "viewInDialog") && data.compareBy != "value"',
                        },
                        {
                            name: 'url',
                            type: 'text',
                            label: 'url',
                            hidden: 'data.type != "http"',
                        },
                        {
                            name: 'httpType',
                            type: 'select',
                            options: [
                                { value: 'send', label: 'send_request' },
                                { value: 'open', label: 'open_url' },
                                { value: 'openNewTab', label: 'open_url_new_tab' },
                            ],
                            default: 'send',
                            label: 'http_type',
                            hidden: 'data.type != "http"',
                        },
                        {
                            name: 'view',
                            type: 'views',
                            label: 'view',
                            hidden: '(data.type != "nav" && data.type != "viewInDialog") || data.mode == "separatedButtons"',
                        },
                        {
                            name: 'valueFalse',
                            type: 'text',
                            label: 'value_false',
                            hidden: 'data.type != "switch" || data.mode == "separatedButtons"',
                        },
                        {
                            name: 'valueTrue',
                            type: 'text',
                            label: 'value_true',
                            hidden: 'data.mode == "separatedButtons" || data.type == "http"',
                            // hidden: '((data.type == "nav" || data.type == "viewInDialog") && data.compareBy != "value") || data.mode == "separatedButtons" || data.type == "http"',
                        },
                        {
                            name: 'buttonSize',
                            type: 'slider',
                            min: 1,
                            max: 200,
                            step: 10,
                            default: 110,
                            label: 'button_size',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'btnSpacing',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'button_spacing',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'countStates',
                            type: 'number',
                            default: 1,
                            label: 'count_states',
                            hidden: 'data.countStates > 0',
                        },
                        {
                            name: 'buttonHoldValue',
                            type: 'checkbox',
                            default: false,
                            label: 'button_hold_value',
                            tooltip: 'tooltip_button_hold_value',
                            hidden: 'data.type != "button"'
                        },
                    ],
                },

                {
                    name: 'attr_group_type_view_in_dialog',
                    label: 'attr_group_type_view_in_dialog',
                    hidden: 'data.type != "viewInDialog"',
                    fields: [
                        {
                            name: 'dialogFullscreen',
                            type: 'checkbox',
                            label: 'dialog_fullscreen',
                            hidden: 'data.type != "viewInDialog"',
                        },
                        {
                            name: 'dialogCloseOnClickOutside',
                            type: 'checkbox',
                            label: 'dialog_close_on_click_outside',
                            hidden: 'data.type != "viewInDialog" || data.dialogFullscreen',
                        },
                        {
                            name: 'dialogWidth',
                            type: 'slider',
                            min: 1,
                            max: 1000,
                            step: 1,
                            default: 500,
                            label: 'dialog_width',
                            hidden: 'data.dialogFullscreen',
                        },
                        {
                            name: 'dialogHeight',
                            type: 'slider',
                            min: 1,
                            max: 1000,
                            step: 1,
                            default: 300,
                            label: 'dialog_height',
                            hidden: 'data.dialogFullscreen',
                        },
                        {
                            name: 'dialogPadding',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding',
                        },
                        {
                            name: 'dialogBackground',
                            type: 'color',
                            default: 'rgb(18, 18, 18)',
                            label: 'background',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_titlebar',
                        },
                        {
                            name: 'dialogTitle',
                            type: 'html',
                            label: 'title',
                        },
                        {
                            name: 'dialogTitleColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'color',
                        },
                        {
                            name: 'dialogTitleSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 20,
                            label: 'size',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_close_button',
                        },
                        {
                            name: 'dialogCloseButtonBackground',
                            type: 'color',
                            default: 'rgba(255,255,255,0)',
                            label: 'background',
                        },
                        {
                            name: 'dialogCloseButtonColor',
                            type: 'color',
                            default: 'rgba(255,255,255,1)',
                            label: 'color',
                        },
                        {
                            name: 'dialogCloseButtonSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 14,
                            label: 'size',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_border_radius',
                        },
                        {
                            name: 'dialogBorderRadiusTopLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'top_left',
                        },
                        {
                            name: 'dialogBorderRadiusTopRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'top_right',
                        },
                        {
                            name: 'dialogBorderRadiusBottomRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'bottom_right',
                        },
                        {
                            name: 'dialogBorderRadiusBottomLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'bottom_left',
                        },
                    ],
                },
                {
                    name: 'attr_group_click_feedback',
                    label: 'attr_group_click_feedback',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'clickFeedbackFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'feedbackDuration',
                            type: 'slider',
                            min: 0,
                            max: 5000,
                            step: 100,
                            default: 0,
                            label: 'duration',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_colors',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                        {
                            name: 'contentColorFeedback',
                            type: 'color',
                            label: 'content_color',
                            hidden: '!!data.clickFeedbackFromWidget || data.mode == "separatedButtons" || data.contentType != "icon"',
                        },
                        {
                            name: 'backgroundFeedback',
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'background',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                        {
                            name: 'textColorFeedback',
                            type: 'color',
                            label: 'text_color',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                        {
                            name: 'borderColorFeedback',
                            type: 'color',
                            label: 'border_color',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                        {
                            name: 'outerShadowColorFeedback',
                            type: 'color',
                            label: 'outer_shadow_color',
                            default: 'rgba(0, 0, 0, 1)',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                        {
                            name: 'innerShadowColorFeedback',
                            type: 'color',
                            label: 'inner_shadow_color',
                            hidden: '!!data.clickFeedbackFromWidget'
                        },
                    ],
                },

                {
                    name: 'attr_group_state_default',
                    label: 'attr_group_state_default',
                    fields: [
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_text_and_content',
                        },
                        {
                            name: 'text',
                            type: 'html',
                            label: 'text',
                            hidden: 'data.mode == "separatedButtons"',
                        },
                        {
                            name: 'icon',
                            type: 'icon64',
                            label: 'icon',
                            hidden: 'data.mode == "separatedButtons" || data.contentType != "icon"',
                        },
                        {
                            name: 'image',
                            type: 'image',
                            label: 'image',
                            hidden: 'data.mode == "separatedButtons" || data.contentType != "image"',
                        },
                        {
                            name: 'html',
                            type: 'html',
                            label: 'text_html',
                            hidden: 'data.mode == "separatedButtons" || data.contentType != "html"',
                        },
                        {
                            name: 'viewInWidget',
                            type: 'views',
                            label: 'view_in_widget',
                            hidden: 'data.mode == "separatedButtons" || data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'contentBlinkInterval',
                            type: 'slider',
                            min: 0,
                            max: 2000,
                            step: 100,
                            default: 0,
                            label: 'content_blink_interval',
                        },
                        {
                            type: 'delimiter',
                        },

                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_colors',
                        },
                        {
                            label: 'from_widget',
                            name: 'defaultColorsStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'contentColor',
                            type: 'color',
                            label: 'content_color',
                            hidden: '!!data.defaultColorsStyleFromWidget || data.mode == "separatedButtons" || (data.contentType != "icon" && data.contentType != "image")',
                        },
                        {
                            name: 'background',
                            type: 'color',
                            label: 'background',
                            hidden: '!!data.defaultColorsStyleFromWidget'
                        },
                        {
                            name: 'textColor',
                            type: 'color',
                            label: 'text_color',
                            hidden: '!!data.defaultColorsStyleFromWidget'
                        },
                        {
                            name: 'borderColor',
                            type: 'color',
                            label: 'border_color',
                            hidden: '!!data.defaultColorsStyleFromWidget'
                        },
                        {
                            name: 'outerShadowColor',
                            type: 'color',
                            label: 'outer_shadow_color',
                            default: 'rgba(0, 0, 0, 1)',
                            hidden: '!!data.defaultColorsStyleFromWidget'
                        },
                        {
                            name: 'innerShadowColor',
                            type: 'color',
                            label: 'inner_shadow_color',
                            hidden: '!!data.defaultColorsStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'countStates',
                    indexFrom: 1,
                    indexTo: 'countStates',
                    label: 'attr_group_states',
                    fields: [
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_condition',
                        },
                        {
                            name: 'compareBy',
                            type: 'select',
                            options: [
                                { value: 'default', label: 'compare_by_widget_default' },
                                { value: 'value', label: 'value' },
                                { value: 'view', label: 'view' },
                            ],
                            default: 'default',
                            label: 'compare_by',
                            hidden: 'data.mode == "separatedButtons"',
                            tooltip: 'tooltip_compare_by',
                        },
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
                            hidden: '(data.type == "nav" && data["compareBy" + index] != "value") || data["compareBy" + index] == "view" || data.mode == "separatedButtons"',
                            tooltip: 'tooltip_state_oid',
                        },
                        {
                            name: 'comparisonOperator',
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
                            hidden: 'data.type == "nav" || data["compareBy" + index] == "view" || data.mode == "separatedButtons"',
                        },
                        {
                            name: 'value',     // name in data structure
                            type: 'text',
                            label: 'value', // translated field label
                            hidden: '(data.type == "nav" && data["compareBy" + index] != "value") || data["compareBy" + index] == "view"',
                        },
                        {
                            name: 'view',     // name in data structure
                            type: 'views',
                            label: 'view', // translated field label,
                            hidden: '(data.type != "nav" && data["compareBy" + index] != "view") || data["compareBy" + index] == "value"',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_text_and_content',
                        },
                        {
                            name: 'text',     // name in data structure
                            type: 'html',
                            label: 'text', // translated field label
                        },
                        {
                            name: 'textTrue',     // name in data structure
                            type: 'html',
                            label: 'text_true', // translated field label
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'icon',     // name in data structure
                            type: 'icon64',
                            label: 'icon', // translated field label
                            hidden: 'data.contentType != "icon"',
                        },
                        {
                            name: 'iconTrue',     // name in data structure
                            type: 'icon64',
                            label: 'icon_true', // translated field label
                            hidden: 'data.mode == "singleButton" || data.contentType != "icon"',
                        },
                        {
                            name: 'image',     // name in data structure
                            type: 'image',
                            label: 'image', // translated field label
                            hidden: 'data.contentType != "image"',
                        },
                        {
                            name: 'imageTrue',     // name in data structure
                            type: 'image',
                            label: 'image_true', // translated field label
                            hidden: 'data.mode == "singleButton" || data.contentType != "image"',
                        },
                        {
                            name: 'html',
                            type: 'html',
                            label: 'text_html',
                            hidden: 'data.contentType != "html"',
                        },
                        {
                            name: 'htmlTrue',
                            type: 'html',
                            label: 'text_html_true',
                            hidden: 'data.mode == "singleButton" || data.contentType != "html"',
                        },
                        {
                            name: 'viewInWidget',
                            type: 'views',
                            label: 'view_in_widget',
                            hidden: 'data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'viewInWidgetTrue',
                            type: 'views',
                            label: 'view_in_widget_true',
                            hidden: 'data.mode == "singleButton" || data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'contentBlinkInterval',
                            type: 'slider',
                            min: 0,
                            max: 2000,
                            step: 100,
                            default: 0,
                            label: 'content_blink_interval',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_colors',
                        },
                        {
                            name: 'contentColor',     // name in data structure
                            type: 'color',
                            label: 'content_color', // translated field label,
                            hidden: 'data.contentType != "icon" && data.contentType != "image"',
                        },
                        {
                            name: 'contentColorTrue',     // name in data structure
                            type: 'color',
                            label: 'content_color_true', // translated field label
                            hidden: 'data.mode == "singleButton" || data.contentType != "icon"',
                        },
                        {
                            name: 'background',
                            type: 'color',
                            default: 'rgb(69,86,24)',
                            label: 'background',
                        },
                        {
                            name: 'backgroundTrue',
                            type: 'color',
                            default: 'rgb(69,86,24)',
                            label: 'background_true',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'textColor',
                            type: 'color',
                            label: 'text_color',
                        },
                        {
                            name: 'textColorTrue',
                            type: 'color',
                            label: 'text_color_true',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'borderColor',
                            type: 'color',
                            label: 'border_color',
                        },
                        {
                            name: 'borderColorTrue',
                            type: 'color',
                            label: 'border_color_true',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'outerShadowColor',
                            type: 'color',
                            label: 'outer_shadow_color',
                            default: 'rgb(0,0,0)',
                        },
                        {
                            name: 'outerShadowColorTrue',
                            type: 'color',
                            label: 'outer_shadow_color_true',
                            hidden: 'data.mode == "singleButton"',
                            default: 'rgb(0,0,0)',
                        },
                        {
                            name: 'innerShadowColor',
                            type: 'color',
                            label: 'inner_shadow_color',
                        },
                        {
                            name: 'innerShadowColorTrue',
                            type: 'color',
                            label: 'inner_shadow_color_true',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_content',
                        },
                        {
                            name: 'contentSize',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 0,
                            label: 'content_size',
                        },
                    ],
                },

                {
                    name: 'attr_content_color_picker',
                    label: 'attr_content_color_picker',
                    hidden: 'data.contentType != "colorPicker"',
                    fields: [
                        {
                            name: 'colorPickerColorModel',
                            type: 'select',
                            options: [
                                { value: 'hex', label: 'hex' },
                                { value: 'hex8', label: 'hex_8' },
                                { value: 'rgb', label: 'rgb' },
                                { value: 'hsl', label: 'hsl' },
                                { value: 'hsv', label: 'hsv' },
                                { value: 'cie', label: 'cie' },
                            ],
                            default: 'hex',
                            label: 'color_model',
                        },
                        {
                            name: 'colorPickerOid',
                            type: 'id',
                            hidden: 'data.colorPickerColorModel === "rgb" || data.colorPickerColorModel === "hsl" || data.colorPickerColorModel === "hsv"',
                            label: 'oid',
                        },
                        {
                            name: 'colorPickerOid1',
                            type: 'id',
                            hidden: 'data.colorPickerColorModel !== "rgb" && data.colorPickerColorModel !== "hsl" && data.colorPickerColorModel !== "hsv"',
                            label: 'oid_value_1',
                        },
                        {
                            name: 'colorPickerOid2',
                            type: 'id',
                            hidden: 'data.colorPickerColorModel !== "rgb" && data.colorPickerColorModel !== "hsl" && data.colorPickerColorModel !== "hsv"',
                            label: 'oid_value_2',
                        },
                        {
                            name: 'colorPickerOid3',
                            type: 'id',
                            hidden: 'data.colorPickerColorModel !== "rgb" && data.colorPickerColorModel !== "hsl" && data.colorPickerColorModel !== "hsv"',
                            label: 'oid_value_3',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_layout_size',
                        },
                        {
                            name: 'colorPickerWidth',
                            type: 'slider',
                            min: 0,
                            max: 500,
                            step: 1,
                            default: 200,
                            label: 'width',
                        },
                        {
                            name: 'colorPickerHandleSize',
                            type: 'slider',
                            min: 0,
                            max: 20,
                            step: 1,
                            default: 8,
                            label: 'handle_size',
                        },
                        {
                            name: 'colorPickerHandleMargin',
                            type: 'slider',
                            min: 0,
                            max: 20,
                            step: 1,
                            default: 6,
                            label: 'handle_margin',
                        },
                        {
                            name: 'colorPickerComponentsSpace',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'components_space',
                        },
                        {
                            name: 'colorPickerDirection',
                            type: 'select',
                            options: [
                                { value: 'vertical', label: 'vertical' },
                                { value: 'horizontal', label: 'horizontal' },
                            ],
                            default: 'vertical',
                            label: 'direction',
                        },
                        {
                            name: 'colorPickerBorderWidth',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'border_width',
                        },
                        {
                            name: 'colorPickerBorderColor',
                            type: 'color',
                            label: 'border_color',
                        },
                        {
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_components',
                        },
                        {
                            name: 'colorPickerShowWheel',
                            type: 'checkbox',
                            default: true,
                            label: 'show_wheel',
                        },
                        {
                            name: 'colorPickerShowBox',
                            type: 'checkbox',
                            label: 'show_box',
                        },
                        {
                            name: 'colorPickerShowHue',
                            type: 'checkbox',
                            label: 'show_hue',
                        },
                        {
                            name: 'colorPickerShowSaturation',
                            type: 'checkbox',
                            default: true,
                            label: 'show_Saturation',
                        },
                        {
                            name: 'colorPickerShowValue',
                            type: 'checkbox',
                            default: true,
                            label: 'show_value',
                        },
                        {
                            name: 'colorPickerShowRed',
                            type: 'checkbox',
                            label: 'show_red',
                        },
                        {
                            name: 'colorPickerShowGreen',
                            type: 'checkbox',
                            label: 'show_green',
                        },
                        {
                            name: 'colorPickerShowBlue',
                            type: 'checkbox',
                            label: 'show_blue',
                        },
                        {
                            name: 'colorPickerShowAlpha',
                            type: 'checkbox',
                            label: 'show_Alpha',
                        },
                        {
                            name: 'colorPickerShowKelvin',
                            type: 'checkbox',
                            label: 'show_kelvin',
                        },
                    ],
                },

                // CSS Settings
                {
                    name: 'attr_group_css_text',
                    label: 'attr_group_css_text',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'textStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'textDecoration',
                            type: 'select',
                            options: [
                                { value: 'none', label: 'none' },
                                { value: 'underline', label: 'underline' },
                                { value: 'overline', label: 'overline' },
                                { value: 'line-through', label: 'line-through' },
                            ],
                            default: 'none',
                            label: 'text_decoration',
                            hidden: '!!data.textStyleFromWidget'
                        },
                        {
                            name: 'textMarginTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_top',
                            hidden: '!!data.textStyleFromWidget'
                        },
                        {
                            name: 'textMarginBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_bottom',
                            hidden: '!!data.textStyleFromWidget'
                        },
                        {
                            name: 'textMarginLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_left',
                            hidden: '!!data.textStyleFromWidget'
                        },
                        {
                            name: 'textMarginRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_right',
                            hidden: '!!data.textStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_content',
                    label: 'attr_group_css_content',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'contentStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'contentType',
                            type: 'select',
                            options: [
                                { value: 'icon', label: 'icon' },
                                { value: 'image', label: 'image' },
                                { value: 'html', label: 'text_html' },
                                { value: 'viewInWidget', label: 'view_in_widget' },
                                { value: 'colorPicker', label: 'color_picker' },
                            ],
                            default: 'icon',
                            label: 'content_type',
                            tooltip: 'tooltip_content_type',
                        },
                        {
                            name: 'contentMarginTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_top',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                        {
                            name: 'contentMarginBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_bottom',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                        {
                            name: 'contentMarginLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_left',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                        {
                            name: 'contentMarginRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_right',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                        {
                            name: 'contentSize',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 40,
                            label: 'content_size',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                        {
                            name: 'contentRotation',
                            type: 'slider',
                            min: -180,
                            max: 180,
                            step: 1,
                            default: 0,
                            label: 'rotation',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                        {
                            name: 'contentMirror',
                            type: 'checkbox',
                            default: false,
                            label: 'mirror',
                            hidden: '!!data.contentStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_alignment',
                    label: 'attr_group_css_alignment',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'alignmentStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'flexDirection',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'row', label: 'row' },
                                { value: 'column', label: 'column' },
                            ],
                            default: 'column',
                            label: 'direction', // translated field label
                            hidden: '!!data.alignmentStyleFromWidget'
                        },
                        {
                            name: 'alignItems',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'flex-start', label: 'start' },
                                { value: 'center', label: 'center' },
                                { value: 'flex-end', label: 'end' },
                                { value: 'space-between', label: 'space between' },
                            ],
                            default: 'space-between',
                            label: 'alignment', // translated field label
                            hidden: '!!data.alignmentStyleFromWidget'
                        },
                        {
                            name: 'textAlign',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'start', label: 'start' },
                                { value: 'center', label: 'center' },
                                { value: 'end', label: 'end' },
                            ],
                            default: 'start',
                            label: 'text_align', // translated field label
                            hidden: '!!data.alignmentStyleFromWidget'
                        },
                        {
                            name: 'contentAlign',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'start', label: 'start' },
                                { value: 'center', label: 'center' },
                                { value: 'end', label: 'end' },
                            ],
                            default: 'center',
                            label: 'content_align', // translated field label
                            hidden: '!!data.alignmentStyleFromWidget'
                        },
                        {
                            name: 'invertOrder',     // name in data structure
                            type: 'checkbox',
                            label: 'invert_order', // translated field label
                            hidden: '!!data.alignmentStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_transparency',
                    label: 'attr_group_css_transparency',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'transparencyStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'backgroundOpacity',
                            type: 'slider',
                            min: 0,
                            max: 1,
                            step: 0.1,
                            default: 1,
                            label: 'background_opacity',
                            hidden: '!!data.transparencyStyleFromWidget'
                        },
                        {
                            name: 'contentOpacity',
                            type: 'slider',
                            min: 0,
                            max: 1,
                            step: 0.1,
                            default: 1,
                            label: 'content_opacity',
                            hidden: '!!data.transparencyStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_spacing',
                    label: 'attr_group_css_spacing',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'spacingStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'paddingLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_left',
                            hidden: '!!data.spacingStyleFromWidget'
                        },
                        {
                            name: 'paddingRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_right',
                            hidden: '!!data.spacingStyleFromWidget'
                        },
                        {
                            name: 'paddingTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_top',
                            hidden: '!!data.spacingStyleFromWidget'
                        },
                        {
                            name: 'paddingBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_bottom',
                            hidden: '!!data.spacingStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_border_radius',
                    label: 'attr_group_css_border_radius',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'borderRadiusStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'borderRadiusTopLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'top_left',
                            hidden: '!!data.borderRadiusStyleFromWidget'
                        },
                        {
                            name: 'borderRadiusTopRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'top_right',
                            hidden: '!!data.borderRadiusStyleFromWidget'
                        },
                        {
                            name: 'borderRadiusBottomRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'bottom_right',
                            hidden: '!!data.borderRadiusStyleFromWidget'
                        },
                        {
                            name: 'borderRadiusBottomLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'bottom_left',
                            hidden: '!!data.borderRadiusStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_border',
                    label: 'attr_group_css_border',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'borderStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'borderSizeTop',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_top',
                            hidden: '!!data.borderStyleFromWidget'
                        },
                        {
                            name: 'borderSizeBottom',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_bottom',
                            hidden: '!!data.borderStyleFromWidget'
                        },
                        {
                            name: 'borderSizeLeft',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_left',
                            hidden: '!!data.borderStyleFromWidget'
                        },
                        {
                            name: 'borderSizeRight',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_right',
                            hidden: '!!data.borderStyleFromWidget'
                        },
                        {
                            name: 'borderStyle',
                            type: 'select',
                            options: [
                                { value: 'none', label: 'none' },
                                { value: 'dashed', label: 'dashed' },
                                { value: 'dotted', label: 'dotted' },
                                { value: 'double', label: 'double' },
                                { value: 'groove', label: 'groove' },
                                { value: 'inset', label: 'outset' },
                                { value: 'ridge', label: 'ridge' },
                                { value: 'solid', label: 'solid' },
                            ],
                            default: 'none',
                            label: 'border_style',
                            hidden: '!!data.borderStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_outer_shadow',
                    label: 'attr_group_css_outer_shadow',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'outerShadowStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'outerShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                            hidden: '!!data.outerShadowStyleFromWidget'
                        },
                        {
                            name: 'outerShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.outerShadowStyleFromWidget'
                        },
                        {
                            name: 'outerShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.outerShadowStyleFromWidget'
                        },
                        {
                            name: 'outerShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                            hidden: '!!data.outerShadowStyleFromWidget'
                        },
                    ],
                },
                {
                    name: 'attr_group_css_inner_shadow',
                    label: 'attr_group_css_inner_shadow',
                    fields: [
                        {
                            label: 'from_widget',
                            name: 'innerShadowStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'innerShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'x_offset',
                            hidden: '!!data.innerShadowStyleFromWidget'
                        },
                        {
                            name: 'innerShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'y_offset',
                            hidden: '!!data.innerShadowStyleFromWidget'
                        },
                        {
                            name: 'innerShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'blur',
                            hidden: '!!data.innerShadowStyleFromWidget'
                        },
                        {
                            name: 'innerShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'size',
                            hidden: '!!data.innerShadowStyleFromWidget'
                        },
                    ],
                },

                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: {
                width: 110,
                height: 110,
                position: 'absolute',
                overflow: 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-universal.png',
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

        if (this.state.rxData.contentType === 'colorPicker') {
            const components = [];

            if (this.state.rxData.colorPickerShowWheel) {
                components.push({
                    component: iro.ui.Wheel,
                    options: {},
                });
            }
            if (this.state.rxData.colorPickerShowBox) {
                components.push({
                    component: iro.ui.Box,
                    options: {},
                });
            }
            if (this.state.rxData.colorPickerShowHue) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'hue',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowSaturation) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'saturation',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowValue) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'value',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowRed) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'red',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowGreen) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'green',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowBlue) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'blue',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowAlpha) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'alpha',
                    },
                });
            }
            if (this.state.rxData.colorPickerShowKelvin) {
                components.push({
                    component: iro.ui.Slider,
                    options: {
                        sliderType: 'kelvin',
                    },
                });
            }

            const el = document.querySelector(`#${this.props.id} .vis-inventwo-widget-color-picker-wrapper`);
            el.innerHTML = '';

            this.state.colorPicker = new iro.ColorPicker(el, {
                width: this.state.rxData.colorPickerWidth,
                color: '#ffff00',
                layout: components,
                handleRadius: this.state.rxData.colorPickerHandleSize,
                padding: this.state.rxData.colorPickerHandleMargin,
                margin: this.state.rxData.colorPickerComponentsSpace,
                layoutDirection: this.state.rxData.colorPickerDirection,
                borderWidth: this.state.rxData.colorPickerBorderWidth,
                borderColor: this.state.rxData.colorPickerBorderColor,
            });

            this.state.colorPicker.on('input:change', color => {
                const colorModel = this.state.rxData.colorPickerColorModel;
                // eslint-disable-next-line default-case
                switch (colorModel) {
                    case 'hex':
                        if (this.state.rxData.colorPickerOid) this.props.context.setValue(this.state.rxData.colorPickerOid, color.hexString);
                        break;
                    case 'hex8':
                        if (this.state.rxData.colorPickerOid) this.props.context.setValue(this.state.rxData.colorPickerOid, color.hex8String);
                        break;
                    case 'rgb':
                        if (this.state.rxData.colorPickerOid1) this.props.context.setValue(this.state.rxData.colorPickerOid1, color.rgb.r);
                        if (this.state.rxData.colorPickerOid2) this.props.context.setValue(this.state.rxData.colorPickerOid2, color.rgb.g);
                        if (this.state.rxData.colorPickerOid3) this.props.context.setValue(this.state.rxData.colorPickerOid3, color.rgb.b);
                        break;
                    case 'hsl':
                        if (this.state.rxData.colorPickerOid1) this.props.context.setValue(this.state.rxData.colorPickerOid1, color.hsl.h);
                        if (this.state.rxData.colorPickerOid2) this.props.context.setValue(this.state.rxData.colorPickerOid2, color.hsl.s);
                        if (this.state.rxData.colorPickerOid3) this.props.context.setValue(this.state.rxData.colorPickerOid3, color.hsl.l);
                        break;
                    case 'hsv':
                        if (this.state.rxData.colorPickerOid1) this.props.context.setValue(this.state.rxData.colorPickerOid1, color.hsv.h);
                        if (this.state.rxData.colorPickerOid2) this.props.context.setValue(this.state.rxData.colorPickerOid2, color.hsv.s);
                        if (this.state.rxData.colorPickerOid3) this.props.context.setValue(this.state.rxData.colorPickerOid3, color.hsv.v);
                        break;
                }
            });

            this.setColorPickerColor();
        }
    }

    async setColorPickerColor() {
        const colorModel = this.state.rxData.colorPickerColorModel;
        const color = this.state.rxData.colorPickerOid ? (await this.props.context.socket.getState(this.state.rxData.colorPickerOid)).val : undefined;
        const color1 = this.state.rxData.colorPickerOid1 ? (await this.props.context.socket.getState(this.state.rxData.colorPickerOid1)).val : undefined;
        const color2 = this.state.rxData.colorPickerOid2 ? (await this.props.context.socket.getState(this.state.rxData.colorPickerOid2)).val : undefined;
        const color3 = this.state.rxData.colorPickerOid3 ? (await this.props.context.socket.getState(this.state.rxData.colorPickerOid3)).val : undefined;

        // eslint-disable-next-line default-case
        switch (colorModel) {
            case 'hex':
                if (color && (/^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(color))) {
                    this.state.colorPicker.color.hexString = color;
                } else {
                    this.state.colorPicker.color.hexString = '#ffffff';
                }
                break;
            case 'hex8':
                if (color && (/^#([A-Fa-f0-9]{8}$)/.test(color))) {
                    this.state.colorPicker.color.hex8String = color;
                } else {
                    this.state.colorPicker.color.hexString = '#ffffffff';
                }
                break;
            case 'rgb':
                if (color1 !== undefined && color2 !== undefined && color3 !== undefined) {
                    this.state.colorPicker.color.rgb = {
                        r: color1,
                        g: color2,
                        b: color3,
                    };
                } else {
                    this.state.colorPicker.color.rgb = {
                        r: 255,
                        g: 255,
                        b: 255,
                    };
                }
                break;
            case 'hsl':
                if (color1 !== undefined && color2 !== undefined && color3 !== undefined) {
                    this.state.colorPicker.color.hsl = {
                        h: color1,
                        s: color2,
                        l: color3,
                    };
                } else {
                    this.state.colorPicker.color.hsl = {
                        h: 330,
                        s: 0,
                        l: 100,
                    };
                }
                break;
            case 'hsv':
                if (color1 !== undefined && color2 !== undefined && color3 !== undefined) {
                    this.state.colorPicker.color.hsv = {
                        h: color1,
                        s: color2,
                        v: color3,
                    };
                } else {
                    this.state.colorPicker.color.hsv = {
                        h: 0,
                        s: 0,
                        v: 100,
                    };
                }
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();

        // Adding delay to prevent dialog is opened on page load or view change, when object id value matches
        setTimeout(() => {
            this.state.isMounted = true;
        }, 500);
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return InventwoWidgetUniversal.getWidgetInfo();
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
        if (this.state.rxData.type === 'viewInDialog' && id === this.state.rxData.oid && !this.props.editMode) {
            const val = this.convertValue(this.state.rxData.valueTrue);
            if (this.state.isMounted) {
                if (val === state.val) {
                    this.setState({ dialogOpen: true });
                } else {
                    this.setState({ dialogOpen: false });
                }
            }
        }
    }

    // eslint-disable-next-line class-methods-use-this
    eval(value1, value2, operator = '===') {
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(value1)) {
            value1 = `"${value1}"`;
        }
        // eslint-disable-next-line no-restricted-globals
        if (isNaN(value2)) {
            value2 = `"${value2}"`;
        }
        // eslint-disable-next-line no-eval
        return eval(`${value1} ${operator} ${value2}`);
    }

    static getI18nPrefix() {
        return 'vis_2_widgets_inventwo_';
    }

    // eslint-disable-next-line class-methods-use-this
    compare(value1, value2, operator = '===') {
        switch (operator) {
            case '===':
            case '==':
                return value1 === value2;
            case '<':
                return value1 < value2;
            case '>':
                return value1 > value2;
            case '<=':
                return value1 <= value2;
            case '>=':
                return value1 >= value2;
            case '!=':
                return value1 !== value2;
            default:
                return false;
        }
    }

    getValueData(index = null) {
        let oid = null;
        let value = null;
        let data = null;

        if (index === null) {
            for (let i = 1; i <= this.state.rxData.countStates; i++) {
                if (this.validOid(this.state.rxData[`oid${i}`])) {
                    oid = this.state.rxData[`oid${i}`];
                } else if (this.validOid(this.state.rxData.oid)) {
                    oid = this.state.rxData.oid;
                } else continue;

                value = this.getValue(oid);

                let compareBy = this.state.rxData[`compareBy${i}`];
                if (compareBy === undefined || compareBy === null) {
                    compareBy = 'default';
                }

                let comparisonOperator = this.state.rxData[`comparisonOperator${i}`];
                if (comparisonOperator === undefined || comparisonOperator === null) {
                    comparisonOperator = '===';
                }

                let compareValue = this.state.rxData.valueTrue;
                if (this.state.rxData[`value${i}`] !== undefined && this.state.rxData[`value${i}`] !== null) {
                    compareValue = this.state.rxData[`value${i}`];
                }
                compareValue = this.convertValue(compareValue);

                if (
                    (
                        (
                            (
                                compareBy === 'default'
                                && this.state.rxData.type !== 'nav'
                            )
                            || compareBy === 'value'
                        )
                        && this.compare(value, compareValue, comparisonOperator)
                    )
                    || (
                        (
                            (
                                compareBy === 'default'
                                && this.state.rxData.type === 'nav'
                            )
                            || compareBy === 'view'
                        )
                        && this.state.rxData.mode === 'singleButton'
                        && this.state.rxData.countStates === 1
                        && this.state.rxData.view === this.props.view
                    )
                    || (
                        (
                            (
                                compareBy === 'default'
                                && this.state.rxData.type === 'nav'
                            )
                            || compareBy === 'view'
                        )
                        && this.state.rxData.countStates > 1
                        && this.state.rxData[`view${i}`] === this.props.view
                    )
                ) {
                    data = this.getStateData(i);
                    break;
                }
            }
        } else {
            oid = this.state.rxData.oid;
            value = this.getValue(oid);
            if (
                (
                    (
                        this.state.rxData.type === 'switch'
                        || this.state.rxData.type === 'button'
                        || this.state.rxData.type === 'readonly'
                    )
                    && value === this.convertValue(this.state.rxData[`value${index}`])
                )
                || (this.state.rxData.type === 'nav' && this.state.rxData[`view${index}`] === this.props.view)
            ) {
                data = this.getStateData(index, true);
            } else {
                data = this.getStateData(index);
            }
        }

        if (data === null) {

            const defaultColorsStyle = this.getStyle('defaultColorsStyleFromWidget', this.groupAttrs.attr_group_state_default)

            data = {
                background: defaultColorsStyle.background,
                icon: this.state.rxData.icon,
                image: this.state.rxData.image,
                contentColor: defaultColorsStyle.contentColor,
                text: this.state.rxData.text,
                textColor: defaultColorsStyle.textColor,
                outerShadowColor: defaultColorsStyle.outerShadowColor,
                innerShadowColor: defaultColorsStyle.innerShadowColor,
                borderColor: defaultColorsStyle.borderColor,
                html: this.state.rxData.html,
                viewInWidget: this.state.rxData.viewInWidget,
                contentBlinkInterval: this.state.rxData.contentBlinkInterval,
                contentSize: this.state.rxData.contentSize,
            };
        }

        const textStyle = this.getStyle('textStyleFromWidget', this.groupAttrs.attr_group_css_text)
        const contentStyle = this.getStyle('contentStyleFromWidget', this.groupAttrs.attr_group_css_content)
        const alignmentStyle = this.getStyle('alignmentStyleFromWidget', this.groupAttrs.attr_group_css_alignment)
        const transparencyStyle = this.getStyle('transparencyStyleFromWidget', this.groupAttrs.attr_group_css_transparency)
        const spacingStyle = this.getStyle('spacingStyleFromWidget', this.groupAttrs.attr_group_css_spacing)
        const borderRadiusStyle = this.getStyle('borderRadiusStyleFromWidget', this.groupAttrs.attr_group_css_border_radius)
        const borderStyle = this.getStyle('borderStyleFromWidget', this.groupAttrs.attr_group_css_border)
        const outerShadowStyle = this.getStyle('outerShadowStyleFromWidget', this.groupAttrs.attr_group_css_outer_shadow)
        const innerShadowStyle = this.getStyle('innerShadowStyleFromWidget', this.groupAttrs.attr_group_css_inner_shadow)
        const clickFeedback = this.getStyle('clickFeedbackFromWidget', this.groupAttrs.attr_group_click_feedback)

        data.styles = {
            ...textStyle,
            ...contentStyle,
            ...alignmentStyle,
            ...transparencyStyle,
            ...spacingStyle,
            ...borderRadiusStyle,
            ...borderStyle,
            ...outerShadowStyle,
            ...innerShadowStyle,
            ...clickFeedback
        }

        if (this.state.showFeedback) {
            data = this.replaceWithClickFeedbackData(data);
        }

        return data;
    }

    getStateData(i, useExtraTrueValues = false) {
        const data = {
            background: this.state.rxData[`background${i}`],
            icon: this.state.rxData[`icon${i}`],
            image: this.state.rxData[`image${i}`],
            contentColor: this.state.rxData[`contentColor${i}`],
            text: this.state.rxData[`text${i}`],
            textColor: this.state.rxData[`textColor${i}`],
            outerShadowColor: this.state.rxData[`outerShadowColor${i}`],
            innerShadowColor: this.state.rxData[`innerShadowColor${i}`],
            borderColor: this.state.rxData[`borderColor${i}`],
            html: this.state.rxData[`html${i}`],
            viewInWidget: this.state.rxData[`viewInWidget${i}`],
            contentBlinkInterval: this.state.rxData[`contentBlinkInterval${i}`],
            contentSize: this.state.rxData[`contentSize${i}`] > 0 ? this.state.rxData[`contentSize${i}`] : this.state.rxData.contentSize,
        };

        if (useExtraTrueValues) {
            data.background = this.state.rxData[`backgroundTrue${i}`];
            data.icon = this.state.rxData[`iconTrue${i}`];
            data.image = this.state.rxData[`imageTrue${i}`];
            data.contentColor = this.state.rxData[`contentColorTrue${i}`];
            data.text = this.state.rxData[`textTrue${i}`];
            data.html = this.state.rxData[`htmlTrue${i}`];
            data.viewInWidget = this.state.rxData[`viewInWidgetTrue${i}`];
            data.textColor = this.state.rxData[`textColorTrue${i}`];
            data.borderColor = this.state.rxData[`borderColorTrue${i}`];
            data.outerShadowColor = this.state.rxData[`outerShadowColorTrue${i}`];
            data.innerShadowColor = this.state.rxData[`innerShadowColorTrue${i}`];
        }

        return data;
    }

    replaceWithClickFeedbackData(data) {
        if (this.validFieldValue(data.styles.backgroundFeedback)) {
            data.background = data.styles.backgroundFeedback;
        }
        if (this.validFieldValue(data.styles.contentColorFeedback)) {
            data.contentColor = data.styles.contentColorFeedback;
        }
        if (this.validFieldValue(data.styles.textColorFeedback)) {
            data.textColor = data.styles.textColorFeedback;
        }
        if (this.validFieldValue(data.styles.outerShadowColorFeedback)) {
            data.outerShadowColor = data.styles.outerShadowColorFeedback;
        }
        if (this.validFieldValue(data.styles.innerShadowColorFeedback)) {
            data.innerShadowColor = data.styles.innerShadowColorFeedback;
        }
        if (this.validFieldValue(data.styles.borderColorFeedback)) {
            data.borderColor = data.styles.borderColorFeedback;
        }
        return data;
    }

    onClick(index = null, e = null) {
        if (!this.isInteractionAllowed(e)) return;

        console.log("on click")

        const oid = this.state.rxData.oid;

        this.setState({ showFeedback: true });

        // eslint-disable-next-line default-case
        switch (this.state.rxData.type) {
            case 'switch':
                if (this.state.rxData.mode === 'singleButton') {
                    const valueTrue = this.convertValue(this.state.rxData.valueTrue);
                    if (this.state.values[`${oid}.val`] === valueTrue) {
                        this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueFalse));
                    } else {
                        this.props.context.setValue(oid, valueTrue);
                    }
                } else {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData[`value${index}`]));
                }
                break;
            case 'button':
                if (this.state.rxData.buttonHoldValue) break;

                const val = this.state.rxData.mode === 'singleButton'
                    ? this.state.rxData.valueTrue : this.state.rxData[`value${index}`];

                this.props.context.setValue(oid, this.convertValue(val));

                break;
            case 'nav':
                // eslint-disable-next-line no-case-declarations
                const elCheckDialog = e.target.closest('.inventwo-dialog');
                if (elCheckDialog !== undefined && elCheckDialog !== null) {
                    return;
                }

                if (this.state.rxData.mode === 'singleButton') {
                    window.vis.changeView(this.state.rxData.view, this.state.rxData.view);
                } else {
                    window.vis.changeView(this.state.rxData[`view${index}`], this.state.rxData[`view${index}`]);
                }
                break;
            case 'viewInDialog':
                this.setState({ dialogOpen: true });
                if (oid) {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue));
                }
                break;
            case 'increaseDecreaseValue':
                // eslint-disable-next-line no-case-declarations
                let value = this.getValue(oid);
                value += this.convertValue(this.state.rxData.valueTrue);
                this.props.context.setValue(oid, value);
                break;
            case 'http':
                // eslint-disable-next-line no-case-declarations
                const httpType = this.state.rxData.httpType;
                // eslint-disable-next-line no-case-declarations
                const url = this.state.rxData.url;

                if (httpType === 'send') {
                    const http = new XMLHttpRequest();
                    http.open('GET', url);
                    http.send();
                } else if (httpType === 'open') {
                    window.open(url, '_self');
                } else if (httpType === 'openNewTab') {
                    window.open(url, '_blank');
                }
                break;
        }
    }

    onBtnMouseDown(index = null, e = null) {
        if (!this.isInteractionAllowed(e)) return;
        console.log("on down")

        const oid = this.state.rxData.oid;

        // eslint-disable-next-line default-case
        switch (this.state.rxData.type) {
            case 'button':
                if (!this.state.rxData.buttonHoldValue) break;

                const val = this.state.rxData.mode === 'singleButton'
                    ? this.state.rxData.valueTrue : this.state.rxData[`value${index}`];

                this.state.previousOidValue = this.getValue(oid);

                this.props.context.setValue(oid, this.convertValue(val));

                break;
        }
    }

    onBtnMouseUp(index = null, e = null) {
        if (!this.isInteractionAllowed(e)) return;

        console.log("on up")

        const oid = this.state.rxData.oid;

        // eslint-disable-next-line default-case
        switch (this.state.rxData.type) {
            case 'button':
                if (!this.state.rxData.buttonHoldValue) break;

                this.props.context.setValue(oid, this.state.previousOidValue);

                break;
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        this.wrappedContent = true;

        if (this.state.showFeedback) {

            const clickFeedback = this.getStyle('clickFeedbackFromWidget', this.groupAttrs.attr_group_click_feedback)

            let feedbackDuration = clickFeedback.feedbackDuration;
            if (feedbackDuration === undefined) {
                feedbackDuration = 0;
            }
            if (feedbackDuration > 0) {
                setTimeout(() => {
                    this.setState({ showFeedback: false });
                }, feedbackDuration);
            } else {
                this.setState({ showFeedback: false });
            }
        }

        return this.buildWidgetBody();
    }

    buildWidgetBody() {
        const widgetContent = [];

        if (this.state.rxData.mode === 'singleButton') {
            widgetContent.push(this.getSingleCard());
        } else {
            const content = [];
            for (let i = 1; i <= this.state.rxData.countStates; i++) {
                content.push(this.getSingleCard(i));
            }

            widgetContent.push(<div
                key="cardWrapper"
                style={{
                    display: 'flex',
                    height: '100%',
                    overflow: 'auto',
                    gap: `${this.state.rxData.btnSpacing}px`,
                    flexDirection: this.state.rxData.direction,
                    padding: 10,
                    margin: -10,
                }}
            >
                {content}
            </div>);
        }

        if (this.state.rxData.type === 'viewInDialog') {
            widgetContent.push(<Dialog
                className="inventwo-dialog"
                key="dialog"
                open={this.state.dialogOpen}
                fullScreen
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiDialog-paper': {
                            maxWidth: !this.state.rxData.dialogFullscreen ? `${this.state.rxData.dialogWidth + (!Number.isNaN(Number(this.state.rxData.dialogWidth)) ? 'px' : '')}` : '100%',
                            maxHeight: !this.state.rxData.dialogFullscreen ? `${this.state.rxData.dialogHeight + (!Number.isNaN(Number(this.state.rxData.dialogWidth)) ? 'px' : '')}` : '100%',
                            background: this.state.rxData.dialogBackground,
                            borderRadius: `
                                ${this.state.rxData.dialogBorderRadiusTopLeft}px 
                                ${this.state.rxData.dialogBorderRadiusTopRight}px 
                                ${this.state.rxData.dialogBorderRadiusBottomRight}px 
                                ${this.state.rxData.dialogBorderRadiusBottomLeft}px
                            `,
                        },
                        '.MuiDialogContent-root': {
                            padding: `${this.state.rxData.dialogPadding + (!Number.isNaN(Number(this.state.rxData.dialogPadding)) ? 'px' : '')}`,
                        },
                        '.MuiDialogTitle-root': {
                            padding: `${this.state.rxData.dialogPadding + (!Number.isNaN(Number(this.state.rxData.dialogPadding)) ? 'px' : '')}`,
                            color: this.state.rxData.dialogTitleColor,
                        },
                    },
                }}
                onClose={(event, reason) => {
                    if (reason && reason === 'backdropClick' && !this.state.rxData.dialogCloseOnClickOutside) return;
                    this.setState({ dialogOpen: false });
                }}
            >
                <DialogTitle style={styles.dialogTitle}>
                    <span>{this.state.rxData.dialogTitle}</span>
                    <IconButton
                        onClick={() => this.setState({ dialogOpen: false })}
                        sx={{
                            background: this.state.rxData.dialogCloseButtonBackground,
                            color: this.state.rxData.dialogCloseButtonColor,
                            '&:hover': {
                                background: this.state.rxData.dialogCloseButtonBackground,
                            },
                        }}
                    >
                        <CloseIcon
                            sx={{
                                width: this.state.rxData.dialogCloseButtonSize,
                                height: this.state.rxData.dialogCloseButtonSize,
                            }}
                        />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {this.buildViewInWidget(this.state.rxData.view)}
                </DialogContent>
            </Dialog>);
        }

        return <div
            style={{
                overflow: 'visible',
                height: '100%',
                width: '100%',
                fontSize: this.state.rxStyle['font-size'],
                color: this.state.rxStyle.color,
                textShadow: this.state.rxStyle['text-shadow'],
                fontFamily: this.state.rxStyle['font-family'],
                fontStyle: this.state.rxStyle['font-style'],
                fontVariant: this.state.rxStyle['font-variant'],
                fontWeight: this.state.rxStyle['font-weight'],
                lineHeight: this.state.rxStyle['line-height'],
                letterSpacing: this.state.rxStyle['letter-spacing'],
                wordSpacing: this.state.rxStyle['word-spacing'],
            }}
        >
            {widgetContent}
        </div>;
    }

    getContentIcon(valueData) {
        if (valueData.icon === null) {
            return '';
        }
        return <Icon
            src={valueData.icon}
            style={{
                width: valueData.contentSize,
                color: valueData.contentColor,
            }}
        ></Icon>;
    }

    getContentImage(valueData) {
        const img = valueData.image;
        if (img === null) {
            return '';
        }

        const hex = this.convertRgbToHex(valueData.contentColor);
        let filter = null;
        if (hex) {
            filter = hexToCSSFilter(hex);
        }

        return <Icon
            src={img}
            style={{
                width: valueData.contentSize,
                filter: filter ? filter.filter : '',
            }}
        />;
    }

    getContentHtml(valueData) {
        return <div
            style={{
                fontSize: `${valueData.contentSize}px`,
            }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: valueData.html }}
        />;
    }

    getContentViewInWidget(valueData) {
        const view = valueData.viewInWidget;
        return this.buildViewInWidget(view);
    }

    buildViewInWidget(view) {
        if (view === this.props.view) {
            return <div>Cannot use recursive views</div>;
        }

        const style = {};

        return <div
            style={{
                position: 'relative',
                overflow: 'auto',
                height: '100%',
            }}
            className="inventwo-view-in-widget-wrapper"
        >
            {view ? this.getWidgetView(view, { style }) : null}
        </div>;
    }

    getCardContent(valueData) {
        let c;
        switch (this.state.rxData.contentType) {
            case 'icon':
                c = this.getContentIcon(valueData);
                break;
            case 'image':
                c = this.getContentImage(valueData);
                break;
            case 'html':
                c = this.getContentHtml(valueData);
                break;
            case 'viewInWidget':
                c = this.getContentViewInWidget(valueData);
                break;
            default:
                c = '';
        }
        return <div
            className={this.state.rxData.contentType === 'colorPicker' ? 'vis-inventwo-widget-color-picker-wrapper' : ''}
            style={{
                height: '100%',
                width: this.state.rxData.contentType === 'viewInWidget' ? '100%' : '',
                transform: `rotateZ(${valueData.styles.contentRotation}deg)`,
                animation: valueData.contentBlinkInterval > 0 ? `blink ${valueData.contentBlinkInterval / 1000}s infinite` : '',
            }}
        >
            {c}
        </div>;
    }

    buildCard(valueData, i, content) {
        let shadow = '';
        if (valueData.outerShadowColor) {
            shadow += `${valueData.styles.outerShadowX}px ${valueData.styles.outerShadowY}px ${valueData.styles.outerShadowBlur}px ${valueData.styles.outerShadowSize}px ${valueData.outerShadowColor}`;
        }

        if (valueData.innerShadowColor) {
            if (shadow !== '') {
                shadow += ', ';
            }
            shadow += `inset ${valueData.styles.innerShadowX}px ${valueData.styles.innerShadowY}px ${valueData.styles.innerShadowBlur}px ${valueData.styles.innerShadowSize}px ${valueData.innerShadowColor}`;
        }

        return <div
            key={i !== null ? i : ''}
            style={{
                width: i === null ? '100%' : '',
                height: i === null ? '100%' : '',
                flex: i !== null ? `0 0 ${this.state.rxData.buttonSize}px` : '',
                position: 'relative',
                border: valueData.styles.borderRadiusTopLeft,
                borderRadius: `${valueData.styles.borderRadiusTopLeft}px ${valueData.styles.borderRadiusTopRight}px ${valueData.styles.borderRadiusBottomRight}px ${valueData.styles.borderRadiusBottomLeft}px`,
            }}
        >
            <Card
                className="vis_rx_widget_card"
                style={{
                    background: valueData.background,
                    borderRadius: `${valueData.styles.borderRadiusTopLeft}px ${valueData.styles.borderRadiusTopRight}px ${valueData.styles.borderRadiusBottomRight}px ${valueData.styles.borderRadiusBottomLeft}px`,
                    boxShadow: shadow,
                    opacity: valueData.styles.backgroundOpacity,
                    position: 'absolute',
                    inset: 0,
                    borderColor: valueData.borderColor,
                    borderTopWidth: `${valueData.styles.borderSizeTop}px`,
                    borderBottomWidth: `${valueData.styles.borderSizeBottom}px`,
                    borderLeftWidth: `${valueData.styles.borderSizeLeft}px`,
                    borderRightWidth: `${valueData.styles.borderSizeRight}px`,
                    borderStyle: valueData.styles.borderStyle,
                }}
            />
            <Card
                style={{
                    cursor: this.state.rxData.type !== 'readonly' ? 'pointer' : '',
                    background: 'transparent',
                    borderRadius: `${valueData.styles.borderRadiusTopLeft}px ${valueData.styles.borderRadiusTopRight}px ${valueData.styles.borderRadiusBottomRight}px ${valueData.styles.borderRadiusBottomLeft}px`,
                    opacity: valueData.styles.contentOpacity,
                    position: 'absolute',
                    inset: 0,
                    color: 'unset',
                    boxShadow: 'none',
                }}
                onClick={e => this.onClick(i, e)}
                onMouseDown={e => this.onBtnMouseDown(i, e)}
                onMouseUp={e => this.onBtnMouseUp(i, e)}
            >
                <CardContent
                    style={{
                        padding: `${valueData.styles.paddingTop}px ${valueData.styles.paddingRight}px ${valueData.styles.paddingBottom}px ${valueData.styles.paddingLeft}px`,
                        boxSizing: 'border-box',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {content}
                </CardContent>
            </Card>
        </div>;
    }

    getSingleCard(i = null) {
        const valueData = this.getValueData(i);

        const content = this.getCardContent(valueData);

        const cardContent = <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: valueData.styles.flexDirection + (valueData.styles.invertOrder ? '-reverse' : ''),
                justifyContent: valueData.styles.invertOrder && valueData.styles.alignItems === 'flex-start' ? 'flex-end' : (valueData.styles.invertOrder && valueData.styles.alignItems === 'flex-end' ? 'flex-start' : valueData.styles.alignItems),
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: valueData.styles.flexDirection === 'column' ? valueData.styles.contentAlign : '',
                    alignSelf: valueData.styles.flexDirection === 'row' ? valueData.styles.contentAlign : '',
                    transform: `scaleX(${valueData.styles.contentMirror ? -1 : 1})`,
                    height: this.state.rxData.contentType === 'viewInWidget' ? '100%' : '',
                    overflow: 'hidden',
                    margin: `${valueData.styles.contentMarginTop}px ${valueData.styles.contentMarginRight}px ${valueData.styles.contentMarginBottom}px ${valueData.styles.contentMarginLeft}px`,
                }}
            >
                {content}
            </div>
            <div
                style={{
                    textAlign: valueData.styles.flexDirection === 'column' ? valueData.styles.textAlign : '',
                    alignSelf: valueData.styles.flexDirection === 'row' ? valueData.styles.textAlign : '',
                    textDecoration: valueData.styles.textDecoration,
                    color: valueData.textColor,
                    margin: `${valueData.styles.textMarginTop}px ${valueData.styles.textMarginRight}px ${valueData.styles.textMarginBottom}px ${valueData.styles.textMarginLeft}px`,
                }}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: valueData.text }}
            />
        </div>;

        return this.buildCard(valueData, i, cardContent);
    }
}

export default InventwoWidgetUniversal;
