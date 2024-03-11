import React from 'react';
import {
    Box, Card, CardContent, Dialog, DialogContent, DialogTitle, IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { withStyles } from '@mui/styles';

import { Icon } from '@iobroker/adapter-react-v5';
import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import iro from '@jaames/iro';

const styles = () => ({
    dialogTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

class InventwoWidgetUniversal extends (window.visRxWidget || VisRxWidget) {
    constructor(props) {
        super(props);
        this.state.currentView = null;
        this.state.dialogOpen = false;
    }

    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetUniversal',
            visSet: 'vis2inventwo',
            visSetLabel: 'vis_2_widgets_set_inventwo',
            visWidgetLabel: 'vis_2_widgets_inventwo_widget_universal',
            visName: 'vis_2_widgets_inventwo_widget_universal',
            visSetColor: 'rgba(69, 86, 24, 1)',
            visAttrs: [
                {
                    name: 'common', // group name
                    fields: [
                        {
                            name: 'type',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'switch', label: 'switch' },
                                { value: 'button', label: 'button' },
                                { value: 'nav', label: 'nav' },
                                { value: 'readonly', label: 'read_only' },
                                { value: 'viewInDialog', label: 'view_in_dialog' },
                            ],
                            default: 'switch',
                            label: 'type', // translated field label
                        },
                        {
                            name: 'mode',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'combined', label: 'combined' },
                                { value: 'separated', label: 'separated' },
                            ],
                            default: 'combined',
                            label: 'mode', // translated field label
                        },
                        {
                            name: 'direction',     // name in data structure
                            type: 'select',
                            options: [
                                { value: 'row', label: 'row' },
                                { value: 'column', label: 'column' },
                            ],
                            default: 'row',
                            label: 'direction', // translated field label
                            hidden: 'data.mode == "combined"',
                        },
                        {
                            name: 'oid',     // name in data structure
                            type: 'id',
                            label: 'oid', // translated field label,
                            hidden: 'data.type == "nav" || data.type == "viewInDialog"',
                        },
                        {
                            name: 'view',     // name in data structure
                            type: 'views',
                            label: 'view', // translated field label,
                            hidden: '(data.type != "nav" && data.type != "viewInDialog") || data.mode == "separated"',
                        },
                        {
                            name: 'valueFalse',     // name in data structure
                            type: 'text',
                            label: 'value_false', // translated field label
                            hidden: 'data.type != "switch" || data.mode == "separated"',
                        },
                        {
                            name: 'valueTrue',     // name in data structure
                            type: 'text',
                            label: 'value_true', // translated field label
                            hidden: 'data.type == "nav" || data.type == "viewInDialog"  || data.mode == "separated"',
                        },

                        {
                            name: 'dialogTitle',
                            type: 'text',
                            label: 'dialog_title',
                            hidden: 'data.type != "viewInDialog"',
                        },
                        {
                            name: 'dialogFullscreen',
                            type: 'checkbox',
                            label: 'dialog_fullscreen',
                            hidden: 'data.type != "viewInDialog"',
                        },
                        {
                            name: 'dialogWidth',
                            type: 'slider',
                            min: 1,
                            max: 1000,
                            step: 1,
                            default: 500,
                            label: 'dialog_width',
                            hidden: 'data.type != "viewInDialog" || data.dialogFullscreen',
                        },
                        {
                            name: 'dialogHeight',
                            type: 'slider',
                            min: 1,
                            max: 1000,
                            step: 1,
                            default: 300,
                            label: 'dialog_height',
                            hidden: 'data.type != "viewInDialog" || data.dialogFullscreen',
                        },

                        {
                            name: 'testDimension',
                            type: 'dimension',
                            default: 300,
                            label: 'test_dimesnion',
                        },

                        {
                            name: 'buttonSize',     // name in data structure
                            type: 'slider',
                            min: 1,
                            max: 200,
                            step: 10,
                            default: 110,
                            label: 'button_width', // translated field label
                            hidden: 'data.mode == "combined"',
                        },
                        {
                            name: 'buttonHeight',     // name in data structure
                            type: 'slider',
                            min: 1,
                            max: 200,
                            step: 10,
                            default: 110,
                            label: 'button_width', // translated field label
                            hidden: 'data.mode == "combined"',
                        },
                        {
                            name: 'btnSpacing',     // name in data structure
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'button_spacing', // translated field label
                            hidden: 'data.mode == "combined"',
                        },
                        {
                            name: 'countStates',
                            type: 'number',
                            default: 1,
                            label: 'count_states',
                            hidden: 'data.countStates > 0',
                        },
                    ],
                },
                {
                    name: 'vis_2_widgets_inventwo_attr_group_state_default', // group name
                    label: 'vis_2_widgets_inventwo_attr_group_state_default',
                    fields: [
                        {
                            name: 'text',     // name in data structure
                            type: 'html',
                            label: 'text', // translated field label
                            hidden: 'data.mode == "separated"',
                        },
                        {
                            name: 'icon',     // name in data structure
                            type: 'icon64',
                            label: 'icon', // translated field label
                            hidden: 'data.mode == "separated" || data.contentType != "icon"',
                        },
                        {
                            name: 'image',     // name in data structure
                            type: 'image',
                            label: 'image', // translated field label
                            hidden: 'data.mode == "separated" || data.contentType != "image"',
                        },
                        {
                            name: 'html',
                            type: 'html',
                            label: 'text_html',
                            hidden: 'data.mode == "separated" || data.contentType != "html"',
                        },
                        {
                            name: 'viewInWidget',
                            type: 'views',
                            label: 'view_in_widget',
                            hidden: 'data.mode == "separated" || data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'contentColor',     // name in data structure
                            type: 'color',
                            label: 'content_color', // translated field label
                            hidden: 'data.mode == "separated" || data.contentType != "icon"',
                        },
                        {
                            name: 'textColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(255, 255, 255, 1)',
                            label: 'text_color', // translated field label
                        },
                        {
                            name: 'borderColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'border_color', // translated field label
                        },
                        {
                            name: 'outerShadowColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'outer_shadow_color', // translated field label
                        },
                        {
                            name: 'innerShadowColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'inner_shadow_color', // translated field label
                        },
                    ],
                },
                {
                    name: 'countStates', // group name
                    indexFrom: 1,
                    indexTo: 'countStates',
                    label: 'vis_2_widgets_inventwo_attr_group_states',
                    fields: [
                        {
                            name: 'value',     // name in data structure
                            type: 'text',
                            label: 'value', // translated field label
                            hidden: 'data.type == "nav" || (data.mode == "combined" && data.countStates <= 1)',
                        },
                        {
                            name: 'view',     // name in data structure
                            type: 'views',
                            label: 'view', // translated field label,
                            hidden: 'data.type != "nav"',
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
                            hidden: 'data.mode == "combined"',
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
                            hidden: 'data.mode == "combined" || data.contentType != "icon"',
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
                            hidden: 'data.mode == "combined" || data.contentType != "image"',
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
                            hidden: 'data.mode == "combined" || data.contentType != "html"',
                        },
                        {
                            name: 'viewInWidget',
                            type: 'views',
                            label: 'view_in_widget',
                            hidden: 'data.mode == "combined" || data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'viewInWidgetTrue',
                            type: 'views',
                            label: 'view_in_widget_true',
                            hidden: 'data.mode == "combined" || data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'contentColor',     // name in data structure
                            type: 'color',
                            label: 'content_color', // translated field label,
                            hidden: 'data.contentType != "icon"',
                        },
                        {
                            name: 'contentColorTrue',     // name in data structure
                            type: 'color',
                            label: 'content_color_true', // translated field label
                            hidden: 'data.mode == "combined" || data.contentType != "icon"',
                        },
                        {
                            name: 'background',     // name in data structure
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'background color', // translated field label
                        },
                        {
                            name: 'backgroundTrue',     // name in data structure
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'background_true', // translated field label
                            hidden: 'data.mode == "combined"',
                        },
                        {
                            name: 'textColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(255, 255, 255, 1)',
                            label: 'text_color', // translated field label
                        },
                        {
                            name: 'borderColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'border_color', // translated field label
                        },
                        {
                            name: 'outerShadowColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'outer_shadow_color', // translated field label
                        },
                        {
                            name: 'innerShadowColor',     // name in data structure
                            type: 'color',
                            default: 'rgba(0, 0, 0, 1)',
                            label: 'inner_shadow_color', // translated field label
                        },
                    ],
                },

                {
                    name: 'vis_2_widgets_inventwo_attr_content_color_picker',
                    label: 'vis_2_widgets_inventwo_attr_content_color_picker',
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
                            text: 'layout_size',
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
                            text: 'components',
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

                {
                    name: 'vis_2_widgets_inventwo_attr_group_css', // group name
                    label: 'vis_2_widgets_inventwo_attr_group_css',
                    fields: [
                        {
                            type: 'help',
                            text: 'text',
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
                        },
                        {
                            name: 'textMarginTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_top',
                        },
                        {
                            name: 'textMarginBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_bottom',
                        },
                        {
                            name: 'textMarginLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_left',
                        },
                        {
                            name: 'textMarginRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_right',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'content',
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
                        },
                        {
                            name: 'contentMarginTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_top',
                        },
                        {
                            name: 'contentMarginBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_bottom',
                        },
                        {
                            name: 'contentMarginLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_left',
                        },
                        {
                            name: 'contentMarginRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_right',
                        },
                        {
                            name: 'contentSize',
                            type: 'slider',
                            min: 1,
                            max: 100,
                            step: 1,
                            default: 40,
                            label: 'content_size',
                        },
                        {
                            name: 'contentRotation',
                            type: 'slider',
                            min: -180,
                            max: 180,
                            step: 1,
                            default: 0,
                            label: 'rotation',
                        },
                        {
                            name: 'contentMirror',
                            type: 'checkbox',
                            default: false,
                            label: 'mirror',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'alignment',
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
                        },
                        {
                            name: 'invertOrder',     // name in data structure
                            type: 'checkbox',
                            label: 'invert_order', // translated field label
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'transparency',
                        },
                        {
                            name: 'backgroundOpacity',
                            type: 'slider',
                            min: 0,
                            max: 1,
                            step: 0.1,
                            default: 1,
                            label: 'background_opacity',
                        },
                        {
                            name: 'contentOpacity',
                            type: 'slider',
                            min: 0,
                            max: 1,
                            step: 0.1,
                            default: 1,
                            label: 'content_opacity',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'spacing',
                        },
                        {
                            name: 'paddingLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_left',
                        },
                        {
                            name: 'paddingRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_right',
                        },
                        {
                            name: 'paddingTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_top',
                        },
                        {
                            name: 'paddingBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_bottom',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'border_radius',
                        },
                        {
                            name: 'borderRadiusTopLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'top_left',
                        },
                        {
                            name: 'borderRadiusTopRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'top_right',
                        },
                        {
                            name: 'borderRadiusBottomRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'bottom_right',
                        },
                        {
                            name: 'borderRadiusBottomLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'bottom_left',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'border',
                        },
                        {
                            name: 'borderSizeTop',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_top',
                        },
                        {
                            name: 'borderSizeBottom',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_bottom',
                        },
                        {
                            name: 'borderSizeLeft',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_left',
                        },
                        {
                            name: 'borderSizeRight',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_right',
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
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'outer_shadow',
                        },
                        {
                            name: 'outerShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'x_offset',
                        },
                        {
                            name: 'outerShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                        },
                        {
                            name: 'outerShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                        },
                        {
                            name: 'outerShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                        },
                        {
                            type: 'delimiter',
                        },
                        {
                            type: 'help',
                            text: 'inner_shadow',
                        },
                        {
                            name: 'innerShadowX',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'x_offset',
                        },
                        {
                            name: 'innerShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'y_offset',
                        },
                        {
                            name: 'innerShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'blur',
                        },
                        {
                            name: 'innerShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'size',
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
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-demo.png',
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
                        this.props.context.setValue(this.state.rxData.colorPickerOid, color.hexString);
                        break;
                    case 'hex8':
                        this.props.context.setValue(this.state.rxData.colorPickerOid, color.hex8String);
                        break;
                    case 'rgb':
                        this.props.context.setValue(this.state.rxData.colorPickerOid1, color.rgb.r);
                        this.props.context.setValue(this.state.rxData.colorPickerOid2, color.rgb.g);
                        this.props.context.setValue(this.state.rxData.colorPickerOid3, color.rgb.b);
                        break;
                    case 'hsl':
                        this.props.context.setValue(this.state.rxData.colorPickerOid1, color.hsl.h);
                        this.props.context.setValue(this.state.rxData.colorPickerOid2, color.hsl.s);
                        this.props.context.setValue(this.state.rxData.colorPickerOid3, color.hsl.l);
                        break;
                    case 'hsv':
                        this.props.context.setValue(this.state.rxData.colorPickerOid1, color.hsv.h);
                        this.props.context.setValue(this.state.rxData.colorPickerOid2, color.hsv.s);
                        this.props.context.setValue(this.state.rxData.colorPickerOid3, color.hsv.v);
                        break;
                }
            });

            this.setColorPickerColor();
        }
    }

    async setColorPickerColor() {
        const colorModel = this.state.rxData.colorPickerColorModel;
        const color = (await this.props.context.socket.getState(this.state.rxData.colorPickerOid)).val;
        const color1 = (await this.props.context.socket.getState(this.state.rxData.colorPickerOid1)).val;
        const color2 = (await this.props.context.socket.getState(this.state.rxData.colorPickerOid2)).val;
        const color3 = (await this.props.context.socket.getState(this.state.rxData.colorPickerOid3)).val;

        // eslint-disable-next-line default-case
        switch (colorModel) {
            case 'hex':
                if ((/^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(color))) {
                    this.state.colorPicker.color.hexString = color;
                } else {
                    this.state.colorPicker.color.hexString = '#ffffff';
                }
                break;
            case 'hex8':
                if ((/^#([A-Fa-f0-9]{8}$)/.test(color))) {
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

    }

    getValue(oid) {
        if (oid !== undefined && oid !== '' && oid !== 'nothing_selected') {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }

    getValueData(index = null) {
        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);

        if (value !== undefined || index !== null) {
            if (index === null) {
                for (let i = 1; i <= this.state.rxData.countStates; i++) {
                    if (
                        (this.state.rxData.type === 'switch' && this.state.rxData.mode === 'combined' && this.state.rxData.countStates === 1 && this.state.rxData.valueTrue === value)
                        || (this.state.rxData.type === 'switch' && this.state.rxData[`value${i}`] === value)
                        || (this.state.rxData.type === 'nav' && this.state.rxData[`view${i}`] === this.props.view)
                    ) {
                        return this.getStateData(i);
                    }
                }
            } else {
                if (
                    (this.state.rxData.type === 'switch' && this.state.rxData[`value${index}`] === value)
                    || (this.state.rxData.type === 'nav' && this.state.rxData[`view${index}`] === this.props.view)
                ) {
                    return this.getStateData(index, true);
                }
                return this.getStateData(index);
            }
        }

        return {
            background: this.state.rxStyle['background-color'],
            icon: this.state.rxData.icon,
            image: this.state.rxData.image,
            contentColor: this.state.rxData.contentColor,
            text: this.state.rxData.text,
            textColor: this.state.rxData.textColor,
            outerShadowColor: this.state.rxData.outerShadowColor,
            innerShadowColor: this.state.rxData.innerShadowColor,
            borderColor: this.state.rxData.borderColor,
            html: this.state.rxData.html,
            viewInWidget: this.state.rxData.viewInWidget,
        };
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
        };

        if (useExtraTrueValues) {
            data.background = this.state.rxData[`backgroundTrue${i}`];
            data.icon = this.state.rxData[`iconTrue${i}`];
            data.image = this.state.rxData[`imageTrue${i}`];
            data.contentColor = this.state.rxData[`contentColorTrue${i}`];
            data.text = this.state.rxData[`textTrue${i}`];
            data.html = this.state.rxData[`htmlTrue${i}`];
            data.viewInWidget = this.state.rxData[`viewInWidgetTrue${i}`];
        }
        return data;
    }

    onClick(index = null, e = null) {
        if (this.props.editMode) return;
        if (e.target.closest('.IroColorPicker') !== null) return;

        const oid = this.state.rxData.oid;

        // eslint-disable-next-line default-case
        switch (this.state.rxData.type) {
            case 'switch':
                if (this.state.rxData.mode === 'combined') {
                    if (this.state.values[`${oid}.val`] === this.state.rxData.valueTrue) {
                        this.props.context.setValue(oid, this.state.rxData.valueFalse);
                    } else {
                        this.props.context.setValue(oid, this.state.rxData.valueTrue);
                    }
                } else {
                    this.props.context.setValue(oid, this.state.rxData[`value${index}`]);
                }
                break;
            case 'button':
                if (this.state.rxData.mode === 'combined') {
                    this.props.context.setValue(oid, this.state.rxData.valueTrue);
                } else {
                    this.props.context.setValue(oid, this.state.rxData[`value${index}`]);
                }
                break;
            case 'nav':
                if (e.target.closest('.inventwo-dialog') !== undefined) {
                    return;
                }

                if (this.state.rxData.mode === 'combined') {
                    window.vis.changeView(this.state.rxData.view, this.state.rxData.view);
                } else {
                    window.vis.changeView(this.state.rxData[`view${index}`], this.state.rxData[`view${index}`]);
                }
                break;
            case 'viewInDialog':
                console.log(this.state);
                this.setState({ dialogOpen: true });
                break;
        }
    }

    renderWidgetBody(props) {
        super.renderWidgetBody(props);
        this.wrappedContent = true;
        return this.buildWidgetBody();
    }

    buildWidgetBody() {
        const widgetContent = [];

        if (this.state.rxData.mode === 'combined') {
            widgetContent.push(this.getSingleCard());
            // return super.wrapContent(this.getSingleCard(), null, {background: 'transparent' }, {background: 'transparent'});
        } else {
            const content = [];
            for (let i = 1; i <= this.state.rxData.countStates; i++) {
                content.push(this.getSingleCard(i));
            }

            widgetContent.push(<Box
                key="cardWrapper"
                sx={{
                    display: 'flex',
                    height: '100%',
                    overflow: 'auto',
                    gap: `${this.state.rxData.btnSpacing}px`,
                    flexDirection: this.state.rxData.direction,
                    padding: '10px',
                    margin: '-10px',
                }}
            >
                {content}
            </Box>);
        }

        if (this.state.rxData.type === 'viewInDialog') {
            widgetContent.push(<Dialog
                classes="inventwo-dialog"
                key="dialog"
                open={this.state.dialogOpen}
                fullScreen
                sx={{
                    '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                            maxWidth: !this.state.rxData.dialogFullscreen ? `${this.state.rxData.dialogWidth}px` : '100%',
                            maxHeight: !this.state.rxData.dialogFullscreen ? `${this.state.rxData.dialogHeight}px` : '100%',
                        },
                    },
                }}
            >
                <DialogTitle className={this.props.classes.dialogTitle}>
                    <span>{this.state.rxData.dialogTitle}</span>
                    <IconButton onClick={() => this.setState({ dialogOpen: false })}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {this.buildViewInWidget(this.state.rxData.view)}
                </DialogContent>
            </Dialog>);
        }

        return <div style={{ overflow: 'visible', height: '100%', width: '100%' }}>
            {widgetContent}
        </div>;
    }

    getContentIcon(i = null) {
        return <Icon
            src={this.getValueData(i).icon}
            style={{
                width: this.state.rxData.contentSize,
                height: this.state.rxData.contentSize,
                color: this.getValueData(i).contentColor,
            }}
        ></Icon>;
    }

    getContentImage(i = null) {
        return <img
            src={this.getValueData(i).image}
            style={{
                width: this.state.rxData.contentSize,
                height: this.state.rxData.contentSize,
                // color: this.getValueData(i).contentColor,
            }}
        ></img>;
    }

    getContentHtml(i = null) {
        return <div
            style={{
                fontSize: `${this.state.rxData.contentSize}px`,
            }}
            dangerouslySetInnerHTML={{ __html: this.getValueData(i).html }}
        ></div>;
    }

    getContentViewInWidget(i = null) {
        const view = this.getValueData(i).viewInWidget;
        return this.buildViewInWidget(view);
    }

    getContentColorPicker(i = null) {
        return <div className="vis-inventwo-widget-color-picker-wrapper"></div>;
    }

    buildViewInWidget(view) {
        if (view === this.props.view) {
            return <div>Cannot use recursive views</div>;
        }

        const style = {};

        return <div style={{
            position: 'relative',
            overflow: 'auto',
            height: '100%',
        }}
        >
            {view ? this.getWidgetView(view, { style }) : null}
        </div>;
    }

    getCardContent(i = null) {
        let c;
        switch (this.state.rxData.contentType) {
            case 'icon':
                c = this.getContentIcon(i);
                break;
            case 'image':
                c = this.getContentImage(i);
                break;
            case 'html':
                c = this.getContentHtml(i);
                break;
            case 'viewInWidget':
                c = this.getContentViewInWidget(i);
                break;
            // case 'colorPicker':
            // c = this.getContentColorPicker(i);
            // break;
            default:
                c = '';
        }
        return <div
            className={this.state.rxData.contentType === 'colorPicker' ? 'vis-inventwo-widget-color-picker-wrapper' : ''}
            style={{
                height: '100%',
                transform: `rotateZ(${this.state.rxData.contentRotation}deg)`,
                // margin: `${this.state.rxData.contentMarginTop}px ${this.state.rxData.contentMarginRight}px ${this.state.rxData.contentMarginBottom}px ${this.state.rxData.contentMarginLeft}px`,
            }}
        >
            {c}
        </div>;
    }

    buildCard(i, content) {
        return <div
            key={i !== null ? i : ''}
            style={{
                width: i === null ? '100%' : '',
                height: i === null ? '100%' : '',
                flex: i !== null ? `0 0 ${this.state.rxData.buttonSize}px` : '',
                position: 'relative',
                border: this.state.rxData.borderRadiusTopLeft,
                borderRadius: `${this.state.rxData.borderRadiusTopLeft}px ${this.state.rxData.borderRadiusTopRight}px ${this.state.rxData.borderRadiusBottomRight}px ${this.state.rxData.borderRadiusBottomLeft}px`,
            }}
        >
            <Card
                className="vis_rx_widget_card"
                sx={{
                    background: this.getValueData(i).background,
                    borderRadius: `${this.state.rxData.borderRadiusTopLeft}px ${this.state.rxData.borderRadiusTopRight}px ${this.state.rxData.borderRadiusBottomRight}px ${this.state.rxData.borderRadiusBottomLeft}px`,
                    boxShadow: `${this.state.rxData.outerShadowX}px ${this.state.rxData.outerShadowY}px ${this.state.rxData.outerShadowBlur}px ${this.state.rxData.outerShadowSize}px ${this.getValueData(i).outerShadowColor}, 
                        inset ${this.state.rxData.innerShadowX}px ${this.state.rxData.innerShadowY}px ${this.state.rxData.innerShadowBlur}px ${this.state.rxData.innerShadowSize}px ${this.getValueData(i).innerShadowColor}`,
                    opacity: this.state.rxData.backgroundOpacity,
                    position: 'absolute',
                    inset: 0,
                    borderColor: this.getValueData(i).borderColor,
                    borderTopWidth: `${this.state.rxData.borderSizeTop}px`,
                    borderBottomWidth: `${this.state.rxData.borderSizeBottom}px`,
                    borderLeftWidth: `${this.state.rxData.borderSizeLeft}px`,
                    borderRightWidth: `${this.state.rxData.borderSizeRight}px`,
                    borderStyle: this.state.rxData.borderStyle,
                }}
            ></Card>
            <Card
                sx={{
                    cursor: this.state.rxData.type !== 'readonly' ? 'pointer' : '',
                    background: 'transparent',
                    borderRadius: `${this.state.rxData.borderRadiusTopLeft}px ${this.state.rxData.borderRadiusTopRight}px ${this.state.rxData.borderRadiusBottomRight}px ${this.state.rxData.borderRadiusBottomLeft}px`,
                    opacity: this.state.rxData.contentOpacity,
                    position: 'absolute',
                    inset: 0,
                }}
                onClick={e => this.onClick(i, e)}
            >
                <CardContent
                    sx={{
                        boxSizing: 'border-box',
                        width: '100%',
                        height: '100%',
                    }}
                    style={{
                        padding: `${this.state.rxData.paddingTop}px ${this.state.rxData.paddingRight}px ${this.state.rxData.paddingBottom}px ${this.state.rxData.paddingLeft}px`,
                    }}
                >
                    {content}
                </CardContent>
            </Card>

        </div>;
    }

    getSingleCard(i = null) {
        const content = this.getCardContent(i);
        const cardContent = <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: this.state.rxData.flexDirection + (this.state.rxData.invertOrder ? '-reverse' : ''),
                justifyContent: this.state.rxData.invertOrder && this.state.rxData.alignItems === 'flex-start' ? 'flex-end' : (this.state.rxData.invertOrder && this.state.rxData.alignItems === 'flex-end' ? 'flex-start' : this.state.rxData.alignItems),
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: this.state.rxData.flexDirection === 'column' ? this.state.rxData.contentAlign : '',
                    alignSelf: this.state.rxData.flexDirection === 'row' ? this.state.rxData.contentAlign : '',
                    transform: `scaleX(${this.state.rxData.contentMirror ? -1 : 1})`,
                    height: this.state.rxData.contentType === 'viewInWidget' ? '100%' : '',
                    overflow: 'hidden',
                    margin: `${this.state.rxData.contentMarginTop}px ${this.state.rxData.contentMarginRight}px ${this.state.rxData.contentMarginBottom}px ${this.state.rxData.contentMarginLeft}px`,
                }}
            >
                {content}
            </div>

            <div
                style={{
                    textAlign: this.state.rxData.flexDirection === 'column' ? this.state.rxData.textAlign : '',
                    alignSelf: this.state.rxData.flexDirection === 'row' ? this.state.rxData.textAlign : '',
                    textDecoration: this.state.rxData.textDecoration,
                    color: this.getValueData(i).textColor,
                    margin: `${this.state.rxData.textMarginTop}px ${this.state.rxData.textMarginRight}px ${this.state.rxData.textMarginBottom}px ${this.state.rxData.textMarginLeft}px`,
                }}
                dangerouslySetInnerHTML={{ __html: this.getValueData(i).text }}
            ></div>
        </div>;

        return this.buildCard(i, cardContent);
    }
}

export default withStyles(styles)(InventwoWidgetUniversal);
