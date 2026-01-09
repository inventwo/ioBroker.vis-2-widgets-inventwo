import React from 'react';
import { Card, CardContent, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { Icon } from '@iobroker/adapter-react-v5';

import { hexToCSSFilter } from 'hex-to-css-filter';
import iro from '@jaames/iro';

import './assets/inventwo.css';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type { ColorPickerProps } from '@jaames/iro/dist/ColorPicker';
import type { UniversalCompleteRxData } from './types/UniversalWidgetRxDataTypes';
import type {
    UniversalWidgetAlignmentStyles,
    UniversalWidgetBorderRadiusStyles,
    UniversalWidgetBorderStyles,
    UniversalWidgetClickFeedbackStyles,
    UniversalWidgetContentStyles,
    UniversalWidgetInnerShadowStyles,
    UniversalWidgetOuterShadowStyles,
    UniversalWidgetSpacingStyles,
    UniversalWidgetStyles,
    UniversalWidgetStylesStyles,
    UniversalWidgetTextStyles,
    UniversalWidgetTransparencyStyles,
    UniversalWidgetValueData,
} from './types/UniversalWidgetValueData';

const styles = {
    dialogTitle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
};

interface UniversalState extends VisRxWidgetState {
    currentView: null | string;
    dialogOpen: boolean;
    showFeedback: boolean;
    isMounted: boolean;
    svgRef: React.RefObject<SVGSVGElement | null>;
    previousOidValue: any;
    dialogCloseTimeout: null | number;
    colorPicker: iro.ColorPicker | null;
    clockInterval: null | number;
    currentTime: Date;
}

export default class InventwoWidgetUniversal extends InventwoGeneric<UniversalCompleteRxData, UniversalState> {
    private readonly refContentContainer: React.RefObject<HTMLDivElement | null> = React.createRef();

    constructor(props: VisRxWidgetProps) {
        super(props);
        this.state = {
            ...this.state,
            currentView: null,
            dialogOpen: false,
            showFeedback: false,
            isMounted: false,
            svgRef: React.createRef(),
            previousOidValue: null,
            dialogCloseTimeout: null,
            colorPicker: null,
            clockInterval: null,
            currentTime: new Date(),
        };
    }

    static getWidgetInfo(): RxWidgetInfo {
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
                            hidden: 'data.type != "button"',
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
                            name: 'dialogCloseTimeoutSeconds',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'close_after_x_seconds',
                        },
                        {
                            name: 'dialogBackground',
                            type: 'color',
                            default: 'rgb(18, 18, 18)',
                            label: 'background',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_titlebar',
                        },
                        {
                            name: 'dialogTitleHide',
                            type: 'checkbox',
                            label: 'hide',
                        },
                        {
                            name: 'dialogTitle',
                            type: 'html',
                            label: 'title',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogTitleColor',
                            type: 'color',
                            default: 'rgb(255,255,255)',
                            label: 'color',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogTitleSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 20,
                            label: 'size',
                            hidden: 'data.dialogTitleHide',
                        },

                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_titlebar_padding',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogTitlePaddingTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'top',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogTitlePaddingBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'bottom',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogTitlePaddingLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'left',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogTitlePaddingRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'right',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_close_button',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogCloseButtonBackground',
                            type: 'color',
                            default: 'rgba(255,255,255,0)',
                            label: 'background',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogCloseButtonColor',
                            type: 'color',
                            default: 'rgba(255,255,255,1)',
                            label: 'color',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: 'dialogCloseButtonSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 14,
                            label: 'size',
                            hidden: 'data.dialogTitleHide',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
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
                            name: 'clickThrough',
                            type: 'checkbox',
                            default: false,
                            label: 'click_through',
                        },
                        {
                            label: 'from_widget',
                            name: 'clickFeedbackFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                            hidden: '!!data.clickThrough',
                        },
                        {
                            name: 'feedbackDuration',
                            type: 'slider',
                            min: 0,
                            max: 5000,
                            step: 100,
                            default: 0,
                            label: 'duration',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                            hidden: '!!data.clickThrough',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_colors',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                        {
                            name: 'contentColorFeedback',
                            type: 'color',
                            label: 'content_color',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget || data.mode == "separatedButtons" || data.contentType != "icon"',
                        },
                        {
                            name: 'backgroundFeedback',
                            type: 'color',
                            default: 'rgba(69, 86, 24, 1)',
                            label: 'background',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                        {
                            name: 'textColorFeedback',
                            type: 'color',
                            label: 'text_color',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                        {
                            name: 'borderColorFeedback',
                            type: 'color',
                            label: 'border_color',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                        {
                            name: 'outerShadowColorFeedback',
                            type: 'color',
                            label: 'outer_shadow_color',
                            default: 'rgba(0, 0, 0, 1)',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                        {
                            name: 'innerShadowColorFeedback',
                            type: 'color',
                            label: 'inner_shadow_color',
                            hidden: '!!data.clickThrough || !!data.clickFeedbackFromWidget',
                        },
                    ],
                },

                {
                    name: 'attr_group_state_default',
                    label: 'attr_group_state_default',
                    fields: [
                        {
                            name: '',
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
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
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
                            hidden: '!!data.defaultColorsStyleFromWidget',
                        },
                        {
                            name: 'textColor',
                            type: 'color',
                            label: 'text_color',
                            hidden: '!!data.defaultColorsStyleFromWidget',
                        },
                        {
                            name: 'borderColor',
                            type: 'color',
                            label: 'border_color',
                            hidden: '!!data.defaultColorsStyleFromWidget',
                        },
                        {
                            name: 'outerShadowColor',
                            type: 'color',
                            label: 'outer_shadow_color',
                            default: 'rgba(0, 0, 0, 1)',
                            hidden: '!!data.defaultColorsStyleFromWidget',
                        },
                        {
                            name: 'innerShadowColor',
                            type: 'color',
                            label: 'inner_shadow_color',
                            hidden: '!!data.defaultColorsStyleFromWidget',
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
                            name: '',
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
                            name: 'value',
                            type: 'text',
                            label: 'value',
                            hidden: '(data.type == "nav" && data["compareBy" + index] != "value") || data["compareBy" + index] == "view"',
                        },
                        {
                            name: 'view',
                            type: 'views',
                            label: 'view',
                            hidden: '(data.type != "nav" && data["compareBy" + index] != "view") || data["compareBy" + index] == "value"',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_text_and_content',
                        },
                        {
                            name: 'text',
                            type: 'html',
                            label: 'text',
                        },
                        {
                            name: 'textTrue',
                            type: 'html',
                            label: 'text_true',
                            hidden: 'data.mode == "singleButton"',
                        },
                        {
                            name: 'icon',
                            type: 'icon64',
                            label: 'icon',
                            hidden: 'data.contentType != "icon"',
                        },
                        {
                            name: 'iconTrue',
                            type: 'icon64',
                            label: 'icon_true',
                            hidden: 'data.mode == "singleButton" || data.contentType != "icon"',
                        },
                        {
                            name: 'image',
                            type: 'image',
                            label: 'image',
                            hidden: 'data.contentType != "image"',
                        },
                        {
                            name: 'imageTrue',
                            type: 'image',
                            label: 'image_true',
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
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_colors',
                        },
                        {
                            label: 'from_widget',
                            name: 'stateColorsStyleFromWidget',
                            type: 'widget',
                            tpl: 'tplInventwoWidgetUniversal',
                            all: true,
                        },
                        {
                            name: 'contentColor',
                            type: 'color',
                            label: 'content_color',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.contentType != "icon" && data.contentType != "image"',
                        },
                        {
                            name: 'contentColorTrue',
                            type: 'color',
                            label: 'content_color_true',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.mode == "singleButton" || data.contentType != "icon"',
                        },
                        {
                            name: 'background',
                            type: 'color',
                            default: 'rgb(69,86,24)',
                            label: 'background',
                            hidden: '!!data["stateColorsStyleFromWidget" + index]',
                        },
                        {
                            name: 'backgroundTrue',
                            type: 'color',
                            default: 'rgb(69,86,24)',
                            label: 'background_true',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.mode == "singleButton"',
                        },
                        {
                            name: 'textColor',
                            type: 'color',
                            label: 'text_color',
                            hidden: '!!data["stateColorsStyleFromWidget" + index]',
                        },
                        {
                            name: 'textColorTrue',
                            type: 'color',
                            label: 'text_color_true',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.mode == "singleButton"',
                        },
                        {
                            name: 'borderColor',
                            type: 'color',
                            label: 'border_color',
                            hidden: '!!data["stateColorsStyleFromWidget" + index]',
                        },
                        {
                            name: 'borderColorTrue',
                            type: 'color',
                            label: 'border_color_true',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.mode == "singleButton"',
                        },
                        {
                            name: 'outerShadowColor',
                            type: 'color',
                            label: 'outer_shadow_color',
                            hidden: '!!data["stateColorsStyleFromWidget" + index]',
                            default: 'rgb(0,0,0)',
                        },
                        {
                            name: 'outerShadowColorTrue',
                            type: 'color',
                            label: 'outer_shadow_color_true',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.mode == "singleButton"',
                            default: 'rgb(0,0,0)',
                        },
                        {
                            name: 'innerShadowColor',
                            type: 'color',
                            label: 'inner_shadow_color',
                            hidden: '!!data["stateColorsStyleFromWidget" + index]',
                        },
                        {
                            name: 'innerShadowColorTrue',
                            type: 'color',
                            label: 'inner_shadow_color_true',
                            hidden: '!!data["stateColorsStyleFromWidget" + index] || data.mode == "singleButton"',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
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
                            name: '',
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
                            name: '',
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

                {
                    name: 'attr_content_analog_clock',
                    label: 'attr_content_analog_clock',
                    hidden: 'data.contentType != "analogClock"',
                    fields: [
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_clock_face',
                        },
                        {
                            name: 'analogClockFaceDesign',
                            type: 'select',
                            options: [
                                { value: 'classic', label: 'classic' },
                                { value: 'modern', label: 'modern' },
                                { value: 'minimal', label: 'minimal' },
                                { value: 'dashes', label: 'dashes' },
                                { value: 'custom', label: 'custom' },
                            ],
                            default: 'classic',
                            label: 'design',
                        },
                        {
                            name: 'analogClockCustomTickInterval',
                            type: 'select',
                            options: [
                                { value: 'hours', label: 'hours_only' },
                                { value: 'minutes', label: 'minutes_as_small' },
                                { value: 'both', label: 'both' },
                            ],
                            default: 'hours',
                            label: 'tick_interval',
                            hidden: 'data.analogClockFaceDesign != "custom"',
                        },
                        {
                            name: 'analogClockCustomTickThickness',
                            type: 'slider',
                            min: 0.5,
                            max: 5,
                            step: 0.5,
                            default: 1.5,
                            label: 'tick_thickness',
                            hidden: 'data.analogClockFaceDesign != "custom"',
                        },
                        {
                            name: 'analogClockCustomTickThicknessMain',
                            type: 'slider',
                            min: 0.5,
                            max: 5,
                            step: 0.5,
                            default: 2,
                            label: 'tick_thickness_main',
                            hidden: 'data.analogClockFaceDesign != "custom"',
                        },
                        {
                            name: 'analogClockCustomTickLength',
                            type: 'slider',
                            min: 2,
                            max: 15,
                            step: 1,
                            default: 5,
                            label: 'tick_length',
                            hidden: 'data.analogClockFaceDesign != "custom"',
                        },
                        {
                            name: 'analogClockCustomTickLengthMain',
                            type: 'slider',
                            min: 2,
                            max: 15,
                            step: 1,
                            default: 9,
                            label: 'tick_length_main',
                            hidden: 'data.analogClockFaceDesign != "custom"',
                        },
                        {
                            name: 'analogClockCustomShowNumbers',
                            type: 'select',
                            options: [
                                { value: 'all', label: 'all_numbers' },
                                { value: 'main', label: 'main_hours_only' },
                                { value: 'none', label: 'none' },
                            ],
                            default: 'all',
                            label: 'show_numbers',
                            hidden: 'data.analogClockFaceDesign != "custom"',
                        },
                        {
                            name: 'analogClockCustomNumberSize',
                            type: 'slider',
                            min: 4,
                            max: 16,
                            step: 1,
                            default: 8,
                            label: 'number_size',
                            hidden: 'data.analogClockFaceDesign != "custom" || data.analogClockCustomShowNumbers == "none"',
                        },
                        {
                            name: 'analogClockCustomNumberOffset',
                            type: 'slider',
                            min: 10,
                            max: 45,
                            step: 1,
                            default: 30,
                            label: 'number_offset',
                            hidden: 'data.analogClockFaceDesign != "custom" || data.analogClockCustomShowNumbers == "none"',
                        },
                        {
                            name: 'analogClockFaceColor',
                            type: 'color',
                            default: 'rgb(0, 0, 0)',
                            label: 'color',
                        },
                        {
                            name: 'analogClockBackgroundColor',
                            type: 'color',
                            default: 'rgb(255, 255, 255)',
                            label: 'background',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_clock_ring',
                        },
                        {
                            name: 'analogClockShowRing',
                            type: 'checkbox',
                            default: true,
                            label: 'show_ring',
                        },
                        {
                            name: 'analogClockRingThickness',
                            type: 'slider',
                            min: 0.5,
                            max: 5,
                            step: 0.5,
                            default: 1,
                            label: 'ring_thickness',
                            hidden: '!data.analogClockShowRing',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_hour_hand',
                        },
                        {
                            name: 'analogClockShowHourHand',
                            type: 'checkbox',
                            default: true,
                            label: 'show',
                        },
                        {
                            name: 'analogClockHourHandDesign',
                            type: 'select',
                            options: [
                                { value: 'classic', label: 'classic' },
                                { value: 'modern', label: 'modern' },
                                { value: 'arrow', label: 'arrow' },
                            ],
                            default: 'classic',
                            label: 'design',
                            hidden: '!data.analogClockShowHourHand',
                        },
                        {
                            name: 'analogClockHourHandColor',
                            type: 'color',
                            default: 'rgb(0, 0, 0)',
                            label: 'color',
                            hidden: '!data.analogClockShowHourHand',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_minute_hand',
                        },
                        {
                            name: 'analogClockShowMinuteHand',
                            type: 'checkbox',
                            default: true,
                            label: 'show',
                        },
                        {
                            name: 'analogClockMinuteHandDesign',
                            type: 'select',
                            options: [
                                { value: 'classic', label: 'classic' },
                                { value: 'modern', label: 'modern' },
                                { value: 'arrow', label: 'arrow' },
                            ],
                            default: 'classic',
                            label: 'design',
                            hidden: '!data.analogClockShowMinuteHand',
                        },
                        {
                            name: 'analogClockMinuteHandColor',
                            type: 'color',
                            default: 'rgb(0, 0, 0)',
                            label: 'color',
                            hidden: '!data.analogClockShowMinuteHand',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_second_hand',
                        },
                        {
                            name: 'analogClockShowSecondHand',
                            type: 'checkbox',
                            default: true,
                            label: 'show',
                        },
                        {
                            name: 'analogClockSecondHandDesign',
                            type: 'select',
                            options: [
                                { value: 'classic', label: 'classic' },
                                { value: 'modern', label: 'modern' },
                                { value: 'arrow', label: 'arrow' },
                            ],
                            default: 'classic',
                            label: 'design',
                            hidden: '!data.analogClockShowSecondHand',
                        },
                        {
                            name: 'analogClockSecondHandColor',
                            type: 'color',
                            default: 'rgb(255, 0, 0)',
                            label: 'color',
                            hidden: '!data.analogClockShowSecondHand',
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
                            hidden: '!!data.textStyleFromWidget',
                        },
                        {
                            name: 'textMarginTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_top',
                            hidden: '!!data.textStyleFromWidget',
                        },
                        {
                            name: 'textMarginBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_bottom',
                            hidden: '!!data.textStyleFromWidget',
                        },
                        {
                            name: 'textMarginLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_left',
                            hidden: '!!data.textStyleFromWidget',
                        },
                        {
                            name: 'textMarginRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_right',
                            hidden: '!!data.textStyleFromWidget',
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
                                { value: 'analogClock', label: 'analog_clock' },
                            ],
                            default: 'icon',
                            label: 'content_type',
                            tooltip: 'tooltip_content_type',
                        },
                        {
                            name: 'scaleContentToFit',
                            type: 'checkbox',
                            default: false,
                            label: 'scale_to_fit',
                            hidden: 'data.contentType != "viewInWidget"',
                        },
                        {
                            name: 'contentMarginTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_top',
                            hidden: '!!data.contentStyleFromWidget',
                        },
                        {
                            name: 'contentMarginBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_bottom',
                            hidden: '!!data.contentStyleFromWidget',
                        },
                        {
                            name: 'contentMarginLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_left',
                            hidden: '!!data.contentStyleFromWidget',
                        },
                        {
                            name: 'contentMarginRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'margin_right',
                            hidden: '!!data.contentStyleFromWidget',
                        },
                        {
                            name: 'contentSize',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 40,
                            label: 'content_size',
                            hidden: '!!data.contentStyleFromWidget || (data.contentType == "image" && data.imageObjectFit)',
                        },
                        {
                            name: 'contentRotation',
                            type: 'slider',
                            min: -180,
                            max: 180,
                            step: 1,
                            default: 0,
                            label: 'rotation',
                            hidden: '!!data.contentStyleFromWidget',
                        },
                        {
                            name: 'contentMirror',
                            type: 'checkbox',
                            default: false,
                            label: 'mirror',
                            hidden: '!!data.contentStyleFromWidget',
                        },

                        {
                            name: '',
                            type: 'delimiter',
                            hidden: 'data.contentType != "image"',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_image_resize_and_position',
                            hidden: 'data.contentType != "image"',
                        },
                        {
                            name: 'imageObjectFit',
                            type: 'select',
                            options: [
                                { value: '', label: 'none' },
                                { value: 'contain', label: 'contain' },
                                { value: 'cover', label: 'cover' },
                                { value: 'fill', label: 'fill' },
                                { value: 'repeat', label: 'repeat' },
                            ],
                            default: 'none',
                            label: 'fill_type',
                            hidden: '!!data.contentStyleFromWidget || data.contentType != "image"',
                        },
                        {
                            name: 'imageBackgroundSize',
                            type: 'slider',
                            min: 0,
                            max: 1000,
                            step: 1,
                            default: 100,
                            label: 'scale',
                            hidden: '!!data.contentStyleFromWidget || data.imageObjectFit != "repeat" || data.contentType != "image"',
                        },
                        {
                            name: 'imageObjectPosition',
                            type: 'select',
                            options: [
                                { value: 'none', label: '' },
                                { value: 'top', label: 'top' },
                                { value: 'bottom', label: 'bottom' },
                                { value: 'left', label: 'left' },
                                { value: 'right', label: 'right' },
                                { value: 'center', label: 'center' },
                            ],
                            default: 'none',
                            label: 'position',
                            hidden: '!!data.contentStyleFromWidget || data.contentType != "image" || data.imageObjectFit == "none"',
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
                            name: 'flexDirection',
                            type: 'select',
                            options: [
                                { value: 'row', label: 'row' },
                                { value: 'column', label: 'column' },
                            ],
                            default: 'column',
                            label: 'direction',
                            hidden: '!!data.alignmentStyleFromWidget',
                        },
                        {
                            name: 'alignItems',
                            type: 'select',
                            options: [
                                { value: 'flex-start', label: 'start' },
                                { value: 'center', label: 'center' },
                                { value: 'flex-end', label: 'end' },
                                { value: 'space-between', label: 'space between' },
                            ],
                            default: 'space-between',
                            label: 'alignment',
                            hidden: '!!data.alignmentStyleFromWidget',
                        },
                        {
                            name: 'textAlign',
                            type: 'select',
                            options: [
                                { value: 'start', label: 'start' },
                                { value: 'center', label: 'center' },
                                { value: 'end', label: 'end' },
                            ],
                            default: 'start',
                            label: 'text_align',
                            hidden: '!!data.alignmentStyleFromWidget',
                        },
                        {
                            name: 'contentAlign',
                            type: 'select',
                            options: [
                                { value: 'start', label: 'start' },
                                { value: 'center', label: 'center' },
                                { value: 'end', label: 'end' },
                            ],
                            default: 'center',
                            label: 'content_align',
                            hidden: '!!data.alignmentStyleFromWidget',
                        },
                        {
                            name: 'invertOrder',
                            type: 'checkbox',
                            label: 'invert_order',
                            hidden: '!!data.alignmentStyleFromWidget',
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
                            hidden: '!!data.transparencyStyleFromWidget',
                        },
                        {
                            name: 'contentOpacity',
                            type: 'slider',
                            min: 0,
                            max: 1,
                            step: 0.1,
                            default: 1,
                            label: 'content_opacity',
                            hidden: '!!data.transparencyStyleFromWidget',
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
                            hidden: '!!data.spacingStyleFromWidget',
                        },
                        {
                            name: 'paddingRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_right',
                            hidden: '!!data.spacingStyleFromWidget',
                        },
                        {
                            name: 'paddingTop',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_top',
                            hidden: '!!data.spacingStyleFromWidget',
                        },
                        {
                            name: 'paddingBottom',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 10,
                            label: 'padding_bottom',
                            hidden: '!!data.spacingStyleFromWidget',
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
                            hidden: '!!data.borderRadiusStyleFromWidget',
                        },
                        {
                            name: 'borderRadiusTopRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'top_right',
                            hidden: '!!data.borderRadiusStyleFromWidget',
                        },
                        {
                            name: 'borderRadiusBottomRight',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 12,
                            label: 'bottom_right',
                            hidden: '!!data.borderRadiusStyleFromWidget',
                        },
                        {
                            name: 'borderRadiusBottomLeft',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'bottom_left',
                            hidden: '!!data.borderRadiusStyleFromWidget',
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
                            hidden: '!!data.borderStyleFromWidget',
                        },
                        {
                            name: 'borderSizeBottom',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_bottom',
                            hidden: '!!data.borderStyleFromWidget',
                        },
                        {
                            name: 'borderSizeLeft',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_left',
                            hidden: '!!data.borderStyleFromWidget',
                        },
                        {
                            name: 'borderSizeRight',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 0,
                            label: 'size_right',
                            hidden: '!!data.borderStyleFromWidget',
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
                            hidden: '!!data.borderStyleFromWidget',
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
                            hidden: '!!data.outerShadowStyleFromWidget',
                        },
                        {
                            name: 'outerShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'y_offset',
                            hidden: '!!data.outerShadowStyleFromWidget',
                        },
                        {
                            name: 'outerShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 2,
                            label: 'blur',
                            hidden: '!!data.outerShadowStyleFromWidget',
                        },
                        {
                            name: 'outerShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 1,
                            label: 'size',
                            hidden: '!!data.outerShadowStyleFromWidget',
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
                            hidden: '!!data.innerShadowStyleFromWidget',
                        },
                        {
                            name: 'innerShadowY',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'y_offset',
                            hidden: '!!data.innerShadowStyleFromWidget',
                        },
                        {
                            name: 'innerShadowBlur',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'blur',
                            hidden: '!!data.innerShadowStyleFromWidget',
                        },
                        {
                            name: 'innerShadowSize',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 0,
                            label: 'size',
                            hidden: '!!data.innerShadowStyleFromWidget',
                        },
                    ],
                },

                // check here all possible types https://github.com/ioBroker/ioBroker.vis/blob/react/src/src/Attributes/Widget/SCHEMA.md
            ],
            visDefaultStyle: {
                width: 110,
                height: 110,
                position: 'absolute',
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-universal.png',
        };
    }

    propertiesUpdate(): void {
        // The Widget has 3 important states
        // 1. this.state.values - contains all state values, that are used in widget (automatically collected from widget info).
        //                        So you can use `this.state.values[this.state.rxData.oid + '.val']` to get the value of state with id this.state.rxData.oid
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

            const el: HTMLElement | null = document.querySelector(
                `#${this.props.id} .vis-inventwo-widget-color-picker-wrapper`,
            );
            if (el) {
                el.innerHTML = '';

                const colorPickerProps: ColorPickerProps = {
                    width: this.state.rxData.colorPickerWidth,
                    color: '#ffff00',
                    layout: components,
                    handleRadius: this.state.rxData.colorPickerHandleSize,
                    padding: this.state.rxData.colorPickerHandleMargin,
                    margin: this.state.rxData.colorPickerComponentsSpace,
                    layoutDirection: this.state.rxData.colorPickerDirection,
                    borderWidth: this.state.rxData.colorPickerBorderWidth,
                    borderColor: this.state.rxData.colorPickerBorderColor,
                };
                // @ts-expect-error
                const colorPicker = new iro.ColorPicker(el, colorPickerProps);
                this.setState({ colorPicker: colorPicker });

                colorPicker.on('input:change', (color: iro.Color) => {
                    const colorModel = this.state.rxData.colorPickerColorModel;

                    switch (colorModel) {
                        case 'hex':
                            if (this.state.rxData.colorPickerOid) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid, color.hexString);
                            }
                            break;
                        case 'hex8':
                            if (this.state.rxData.colorPickerOid) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid, color.hex8String);
                            }
                            break;
                        case 'rgb':
                            if (this.state.rxData.colorPickerOid1) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid1, color.rgb.r);
                            }
                            if (this.state.rxData.colorPickerOid2) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid2, color.rgb.g);
                            }
                            if (this.state.rxData.colorPickerOid3) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid3, color.rgb.b);
                            }
                            break;
                        case 'hsl':
                            if (this.state.rxData.colorPickerOid1) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid1, color.hsl.h);
                            }
                            if (this.state.rxData.colorPickerOid2) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid2, color.hsl.s);
                            }
                            if (this.state.rxData.colorPickerOid3) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid3, color.hsl.l);
                            }
                            break;
                        case 'hsv':
                            if (this.state.rxData.colorPickerOid1) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid1, color.hsv.h ?? null);
                            }
                            if (this.state.rxData.colorPickerOid2) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid2, color.hsv.s ?? null);
                            }
                            if (this.state.rxData.colorPickerOid3) {
                                this.props.context.setValue(this.state.rxData.colorPickerOid3, color.hsv.v ?? null);
                            }
                            break;
                    }
                });

                void this.setColorPickerColor();
            }
        }
    }

    async setColorPickerColor(): Promise<void> {
        if (!this.state.colorPicker) {
            return;
        }
        const colorModel = this.state.rxData.colorPickerColorModel;
        const color = this.state.rxData.colorPickerOid
            ? ((await this.props.context.socket.getState(this.state.rxData.colorPickerOid))?.val as string)
            : undefined;
        const color1 = this.state.rxData.colorPickerOid1
            ? ((await this.props.context.socket.getState(this.state.rxData.colorPickerOid1))?.val as number)
            : undefined;
        const color2 = this.state.rxData.colorPickerOid2
            ? ((await this.props.context.socket.getState(this.state.rxData.colorPickerOid2))?.val as number)
            : undefined;
        const color3 = this.state.rxData.colorPickerOid3
            ? ((await this.props.context.socket.getState(this.state.rxData.colorPickerOid3))?.val as number)
            : undefined;

        switch (colorModel) {
            case 'hex':
                if (color && /^#([A-Fa-f0-9]{3}$)|([A-Fa-f0-9]{6}$)/.test(color)) {
                    this.state.colorPicker.color.hexString = color;
                } else {
                    this.state.colorPicker.color.hexString = '#ffffff';
                }
                break;
            case 'hex8':
                if (color && /^#([A-Fa-f0-9]{8}$)/.test(color)) {
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

    componentDidMount(): void {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();

        // Adding delay to prevent dialog is opened on page load or view change, when object id value matches
        setTimeout(() => {
            this.setState({ isMounted: true });
        }, 500);

        if (!this.props.editMode && this.state.rxData.clickThrough) {
            this.refService.current.style.pointerEvents = 'none';
        }

        // Start clock interval for analog clock
        if (this.state.rxData.contentType === 'analogClock') {
            const clockInterval = window.setInterval(() => {
                this.setState({ currentTime: new Date() });
            }, 1000);
            this.setState({ clockInterval });
        }
    }

    componentWillUnmount(): void {
        if (this.state.clockInterval) {
            window.clearInterval(this.state.clockInterval);
        }
    }

    componentDidUpdate(_prevProps: any, prevState: { dialogOpen: any }): void {
        if (prevState.dialogOpen && !this.state.dialogOpen && this.state.dialogCloseTimeout) {
            clearTimeout(this.state.dialogCloseTimeout);
        }

        // Start or stop clock interval based on content type changes
        if (this.state.rxData.contentType === 'analogClock' && !this.state.clockInterval) {
            const clockInterval = window.setInterval(() => {
                this.setState({ currentTime: new Date() });
            }, 1000);
            this.setState({ clockInterval });
        } else if (this.state.rxData.contentType !== 'analogClock' && this.state.clockInterval) {
            window.clearInterval(this.state.clockInterval);
            this.setState({ clockInterval: null });
        }
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetUniversal.getWidgetInfo();
    }

    // This function is called every time when rxData is changed
    onRxDataChanged(): void {
        this.propertiesUpdate();
    }

    // This function is called every time when some Object State updated, but all changes lands into this.state.values too
    onStateUpdated(id: string, state: ioBroker.State): void {
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

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    // eslint-disable-next-line class-methods-use-this
    compare(value1: any, value2: any, operator = '==='): boolean {
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

    getValueData(index: number | null = null): UniversalWidgetValueData {
        let oid = null;
        let value = null;
        let data: UniversalWidgetStyles | null = null;

        if (index === null) {
            for (let i = 1; i <= this.state.rxData.countStates; i++) {
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

                const isNavBtn = (compareBy === 'default' && this.state.rxData.type === 'nav') || compareBy === 'view';

                if (!isNavBtn) {
                    if (this.validOid(this.state.rxData[`oid${i}`])) {
                        oid = this.state.rxData[`oid${i}`];
                    } else if (this.validOid(this.state.rxData.oid)) {
                        oid = this.state.rxData.oid;
                    } else {
                        continue;
                    }

                    value = this.getValue(oid);
                }

                if (
                    (((compareBy === 'default' && this.state.rxData.type !== 'nav') || compareBy === 'value') &&
                        this.compare(value, compareValue, comparisonOperator)) ||
                    (isNavBtn &&
                        this.state.rxData.mode === 'singleButton' &&
                        this.state.rxData.countStates === 1 &&
                        this.state.rxData.view === this.props.view) ||
                    (isNavBtn && this.state.rxData.countStates > 1 && this.state.rxData[`view${i}`] === this.props.view)
                ) {
                    data = this.getStateData(i);
                    break;
                }
            }
        } else {
            oid = this.state.rxData.oid;
            value = this.getValue(oid);
            if (
                ((this.state.rxData.type === 'switch' ||
                    this.state.rxData.type === 'button' ||
                    this.state.rxData.type === 'readonly') &&
                    value === this.convertValue(this.state.rxData[`value${index}`])) ||
                (this.state.rxData.type === 'nav' && this.state.rxData[`view${index}`] === this.props.view)
            ) {
                data = this.getStateData(index, true);
            } else {
                data = this.getStateData(index);
            }
        }

        if (data == null) {
            const defaultColorsStyle = this.getStyle(
                'defaultColorsStyleFromWidget',
                this.groupAttrs.attr_group_state_default,
            );

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

        let dataWithStyles: UniversalWidgetValueData = {
            ...data,
            styles: {} as UniversalWidgetStylesStyles,
        };
        dataWithStyles.styles = {
            ...(this.getStyle('textStyleFromWidget', this.groupAttrs.attr_group_css_text) as UniversalWidgetTextStyles),
            ...(this.getStyle(
                'contentStyleFromWidget',
                this.groupAttrs.attr_group_css_content,
            ) as UniversalWidgetContentStyles),
            ...(this.getStyle(
                'alignmentStyleFromWidget',
                this.groupAttrs.attr_group_css_alignment,
            ) as UniversalWidgetAlignmentStyles),
            ...(this.getStyle(
                'transparencyStyleFromWidget',
                this.groupAttrs.attr_group_css_transparency,
            ) as UniversalWidgetTransparencyStyles),
            ...(this.getStyle(
                'spacingStyleFromWidget',
                this.groupAttrs.attr_group_css_spacing,
            ) as UniversalWidgetSpacingStyles),
            ...(this.getStyle(
                'borderRadiusStyleFromWidget',
                this.groupAttrs.attr_group_css_border_radius,
            ) as UniversalWidgetBorderRadiusStyles),
            ...(this.getStyle(
                'borderStyleFromWidget',
                this.groupAttrs.attr_group_css_border,
            ) as UniversalWidgetBorderStyles),
            ...(this.getStyle(
                'outerShadowStyleFromWidget',
                this.groupAttrs.attr_group_css_outer_shadow,
            ) as UniversalWidgetOuterShadowStyles),
            ...(this.getStyle(
                'innerShadowStyleFromWidget',
                this.groupAttrs.attr_group_css_inner_shadow,
            ) as UniversalWidgetInnerShadowStyles),
            ...(this.getStyle(
                'clickFeedbackFromWidget',
                this.groupAttrs.attr_group_click_feedback,
            ) as UniversalWidgetClickFeedbackStyles),
        };

        if (this.state.showFeedback && !this.state.rxData.clickThrough) {
            dataWithStyles = this.replaceWithClickFeedbackData(dataWithStyles);
        }

        return dataWithStyles;
    }

    getStateData(i: number, useExtraTrueValues = false): UniversalWidgetStyles {
        const stateColorsStyle = this.getStyle(`stateColorsStyleFromWidget${i}`, this.groupAttrs.countStates, i);

        const data = {
            background: stateColorsStyle[`background${i}`],
            icon: this.state.rxData[`icon${i}`],
            image: this.state.rxData[`image${i}`],
            contentColor: stateColorsStyle[`contentColor${i}`],
            text: this.state.rxData[`text${i}`],
            textColor: stateColorsStyle[`textColor${i}`],
            outerShadowColor: stateColorsStyle[`outerShadowColor${i}`],
            innerShadowColor: stateColorsStyle[`innerShadowColor${i}`],
            borderColor: stateColorsStyle[`borderColor${i}`],
            html: this.state.rxData[`html${i}`],
            viewInWidget: this.state.rxData[`viewInWidget${i}`],
            contentBlinkInterval: this.state.rxData[`contentBlinkInterval${i}`],
            contentSize:
                (this.state.rxData[`contentSize${i}`] as unknown as number) > 0
                    ? this.state.rxData[`contentSize${i}`]
                    : this.state.rxData.contentSize,
            styles: {},
        };

        if (useExtraTrueValues) {
            data.background = stateColorsStyle[`backgroundTrue${i}`];
            data.icon = this.state.rxData[`iconTrue${i}`];
            data.image = this.state.rxData[`imageTrue${i}`];
            data.contentColor = stateColorsStyle[`contentColorTrue${i}`];
            data.text = this.state.rxData[`textTrue${i}`];
            data.html = this.state.rxData[`htmlTrue${i}`];
            data.viewInWidget = this.state.rxData[`viewInWidgetTrue${i}`];
            data.textColor = stateColorsStyle[`textColorTrue${i}`];
            data.borderColor = stateColorsStyle[`borderColorTrue${i}`];
            data.outerShadowColor = stateColorsStyle[`outerShadowColorTrue${i}`];
            data.innerShadowColor = stateColorsStyle[`innerShadowColorTrue${i}`];
        }
        return data;
    }

    replaceWithClickFeedbackData(data: UniversalWidgetValueData): UniversalWidgetValueData {
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

    onClick(index: number | null, e: React.MouseEvent<HTMLDivElement>): void {
        if (!this.isInteractionAllowed(e)) {
            return;
        }

        const oid = this.state.rxData.oid;
        this.setState({ showFeedback: true });

        switch (this.state.rxData.type) {
            case 'switch':
                if (!oid || !this.validOid(oid)) {
                    break;
                }
                if (this.state.rxData.mode === 'singleButton') {
                    const valueTrue = this.convertValue(this.state.rxData.valueTrue);
                    if (this.state.values[`${oid}.val`] === valueTrue) {
                        this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueFalse));
                    } else {
                        this.props.context.setValue(oid, valueTrue);
                    }
                } else if (index !== null) {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData[`value${index}`]));
                }
                break;
            case 'button':
                if (!oid || !this.validOid(oid)) {
                    break;
                }
                if (this.state.rxData.buttonHoldValue) {
                    break;
                }

                if (this.state.rxData.mode === 'singleButton') {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue));
                } else if (index !== null) {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData[`value${index}`]));
                }

                break;
            case 'nav':
                // @ts-expect-error
                if (e?.target?.closest('.inventwo-dialog')) {
                    return;
                }

                if (this.state.rxData.mode === 'singleButton') {
                    if (this.state.rxData.view) {
                        window.vis.changeView(this.state.rxData.view, this.state.rxData.view);
                    }
                } else if (index !== null) {
                    if (this.state.rxData[`view${index}`]) {
                        window.vis.changeView(this.state.rxData[`view${index}`], this.state.rxData[`view${index}`]);
                    }
                }
                break;
            case 'viewInDialog':
                this.setState({ dialogOpen: true });
                if (this.state.rxData.dialogCloseTimeoutSeconds && this.state.rxData.dialogCloseTimeoutSeconds > 0) {
                    const dialogCloseTimeout = setTimeout(() => {
                        this.setState({ dialogOpen: false });
                    }, this.state.rxData.dialogCloseTimeoutSeconds * 1000) as unknown as number;
                    this.setState({ dialogCloseTimeout: dialogCloseTimeout });
                }
                if (oid) {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue));
                }
                break;
            case 'increaseDecreaseValue':
                if (!oid || !this.validOid(oid)) {
                    break;
                }
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

    onBtnMouseDown(index: number | null, e: React.MouseEvent<HTMLDivElement>): void {
        if (!this.isInteractionAllowed(e)) {
            return;
        }

        const oid = this.state.rxData.oid;
        if (!oid || !this.validOid(oid)) {
            return;
        }

        switch (this.state.rxData.type) {
            case 'button':
                if (!this.state.rxData.buttonHoldValue) {
                    break;
                }

                this.setState({ previousOidValue: this.getValue(oid) });

                if (this.state.rxData.mode === 'singleButton') {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData.valueTrue));
                } else if (index !== null) {
                    this.props.context.setValue(oid, this.convertValue(this.state.rxData[`value${index}`]));
                }

                break;
        }
    }

    onBtnMouseUp(e: React.MouseEvent<HTMLDivElement>): void {
        if (!this.isInteractionAllowed(e)) {
            return;
        }

        const oid = this.state.rxData.oid;
        if (!oid || !this.validOid(oid)) {
            return;
        }

        switch (this.state.rxData.type) {
            case 'button':
                if (!this.state.rxData.buttonHoldValue) {
                    break;
                }

                this.props.context.setValue(oid, this.state.previousOidValue);

                break;
        }
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        if (this.state.showFeedback && !this.state.rxData.clickThrough) {
            const clickFeedback = this.getStyle('clickFeedbackFromWidget', this.groupAttrs.attr_group_click_feedback);

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

    buildWidgetBody(): React.JSX.Element {
        const widgetContent = [];

        if (this.state.rxData.mode === 'singleButton') {
            widgetContent.push(this.getSingleCard());
        } else {
            const content = [];
            for (let i = 1; i <= this.state.rxData.countStates; i++) {
                content.push(this.getSingleCard(i));
            }

            widgetContent.push(
                <div
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
                </div>,
            );
        }

        if (this.state.rxData.type === 'viewInDialog') {
            widgetContent.push(
                <Dialog
                    className="inventwo-dialog"
                    key="dialog"
                    open={this.state.dialogOpen}
                    fullScreen
                    sx={{
                        '& .MuiDialog-container': {
                            '& .MuiDialog-paper': {
                                maxWidth: !this.state.rxData.dialogFullscreen
                                    ? `${this.state.rxData.dialogWidth + (!Number.isNaN(Number(this.state.rxData.dialogWidth)) ? 'px' : '')}`
                                    : '100%',
                                maxHeight: !this.state.rxData.dialogFullscreen
                                    ? `${this.state.rxData.dialogHeight + (!Number.isNaN(Number(this.state.rxData.dialogWidth)) ? 'px' : '')}`
                                    : '100%',
                                background: this.state.rxData.dialogBackground,
                                borderRadius: `
                                ${this.state.rxData.dialogBorderRadiusTopLeft}px 
                                ${this.state.rxData.dialogBorderRadiusTopRight}px 
                                ${this.state.rxData.dialogBorderRadiusBottomRight}px 
                                ${this.state.rxData.dialogBorderRadiusBottomLeft}px
                            `,
                            },
                            '.MuiDialogContent-root': {
                                padding: `${this.valWithUnit(this.state.rxData.dialogPadding)}`,
                            },
                            '.MuiDialogTitle-root': {
                                padding: `${this.valWithUnit(this.state.rxData.dialogTitlePaddingTop)} ${this.valWithUnit(this.state.rxData.dialogTitlePaddingRight)} ${this.valWithUnit(this.state.rxData.dialogTitlePaddingBottom)} ${this.valWithUnit(this.state.rxData.dialogTitlePaddingLeft)}`,
                                color: this.state.rxData.dialogTitleColor,
                                display: this.state.rxData.dialogTitleHide ? 'none !important' : 'flex',
                            },
                        },
                    }}
                    onClose={(_event, reason) => {
                        if (reason && reason === 'backdropClick' && !this.state.rxData.dialogCloseOnClickOutside) {
                            return;
                        }
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
                    <DialogContent>{this.buildViewInWidget(this.state.rxData.view)}</DialogContent>
                </Dialog>,
            );
        }

        return (
            <div
                style={{
                    overflow: 'visible',
                    height: '100%',
                    width: '100%',
                    fontSize: this.state.rxStyle!['font-size'],
                    color: this.state.rxStyle!.color,
                    textShadow: this.state.rxStyle!['text-shadow'] as string,
                    fontFamily: this.state.rxStyle!['font-family'] as string,
                    fontStyle: this.state.rxStyle!['font-style'] as string,
                    fontVariant: this.state.rxStyle!['font-variant'] as string,
                    fontWeight: this.state.rxStyle!['font-weight'],
                    lineHeight: this.state.rxStyle!['line-height'],
                    letterSpacing: this.state.rxStyle!['letter-spacing'],
                    wordSpacing: this.state.rxStyle!['word-spacing'],
                }}
            >
                {widgetContent}
            </div>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    getContentIcon(valueData: UniversalWidgetValueData): React.JSX.Element | string {
        if (valueData.icon === null) {
            return '';
        }
        return (
            <Icon
                src={valueData.icon}
                style={{
                    width: valueData.contentSize,
                    color: valueData.contentColor,
                }}
            ></Icon>
        );
    }

    getContentImage(valueData: UniversalWidgetValueData): React.JSX.Element | string {
        const img = valueData.image;
        if (img === null) {
            return '';
        }

        const hex = this.convertRgbToHex(valueData.contentColor);
        let filter = null;
        if (hex) {
            filter = hexToCSSFilter(hex);
        }

        if (valueData.styles.imageObjectFit != 'repeat') {
            return (
                <Icon
                    src={img}
                    style={{
                        width: !valueData.styles.imageObjectFit ? valueData.contentSize : '100%',
                        filter: filter ? filter.filter : '',
                        objectFit: (valueData.styles.imageObjectFit ?? '') as React.CSSProperties['objectFit'],
                        objectPosition: valueData.styles.imageObjectPosition ?? '',
                        height: valueData.styles.imageObjectFit ? '100%' : '',
                    }}
                />
            );
        }

        return (
            <div
                style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: valueData.styles.imageBackgroundSize ?? 'auto',
                    backgroundPosition: valueData.styles.imageObjectPosition ?? '',
                    height: '100%',
                    width: '100%',
                }}
            ></div>
        );
    }

    // eslint-disable-next-line class-methods-use-this
    getContentHtml(valueData: UniversalWidgetValueData): React.JSX.Element {
        return (
            <div
                style={{
                    fontSize: `${valueData.contentSize}px`,
                }}
                dangerouslySetInnerHTML={{ __html: valueData.html as string }}
            />
        );
    }

    getContentViewInWidget(valueData: UniversalWidgetValueData): React.JSX.Element {
        const view = valueData.viewInWidget;
        return this.buildViewInWidget(view);
    }

    buildViewInWidget(view: string | null): React.JSX.Element {
        if (view === this.props.view) {
            return <div>Cannot use recursive views</div>;
        }

        const style: Record<string, string | number> = {};

        if (this.state.rxData.scaleContentToFit && this.props.refParent.current && this.refContentContainer.current) {
            const width = this.refContentContainer.current.offsetWidth;
            let parentView = this.props.refParent.current;
            let count = 0;
            while (parentView.className.includes('vis-view') && count < 5) {
                parentView = parentView.parentNode as HTMLElement;
                count += 1;
            }

            const parentWidth = parentView.offsetWidth;
            const factor = width / parentWidth;
            style.transform = `scale(${factor})`;
            style.transformOrigin = 'top left';
            style.width = `${(1 / factor) * 100}%`;
            style.height = `${(1 / factor) * 100}%`;
        }

        return (
            <div
                style={{
                    position: 'relative',
                    overflow: !this.state.rxData.scaleContentToFit ? 'auto' : '',
                    height: '100%',
                }}
                className="inventwo-view-in-widget-wrapper"
            >
                {view ? this.getWidgetView(view, { style }) : null}
            </div>
        );
    }

    getContentAnalogClock(valueData: UniversalWidgetValueData): React.JSX.Element {
        const time = this.state.currentTime;
        const hours = time.getHours() % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        // Calculate angles for clock hands
        const secondAngle = (seconds * 6); // 360 / 60 = 6 degrees per second
        const minuteAngle = (minutes * 6) + (seconds * 0.1); // 6 degrees per minute + fractional
        const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + fractional

        const size = 100; // Use viewBox for scalability
        const centerX = size / 2;
        const centerY = size / 2;

        // Clock face design rendering
        const renderClockFace = () => {
            const faceColor = this.state.rxData.analogClockFaceColor || 'rgb(0, 0, 0)';
            const bgColor = this.state.rxData.analogClockBackgroundColor || 'rgb(255, 255, 255)';
            const design = this.state.rxData.analogClockFaceDesign || 'classic';

            // Get custom settings or preset defaults
            let tickInterval: 'hours' | 'minutes' | 'both' = 'hours';
            let tickThickness = 1.5;
            let tickThicknessMain = 2;
            let numberSize = 8;
            let numberOffset = 30;
            let showNumbers: 'all' | 'main' | 'none' = 'all';

            if (design === 'classic') {
                // Classic: all 12 numbers, no tick marks
                tickInterval = 'hours';
                showNumbers = 'all';
                numberSize = 8;
                numberOffset = 36;
                tickThickness = 0; // no ticks in classic
            } else if (design === 'modern') {
                // Modern: tick marks only, no numbers
                tickInterval = 'hours';
                tickThickness = 2;
                tickThicknessMain = 2;
                showNumbers = 'none';
            } else if (design === 'minimal') {
                // Minimal: no ticks, no numbers
                tickInterval = 'hours';
                tickThickness = 0;
                showNumbers = 'none';
            } else if (design === 'dashes') {
                // Dashes: tick marks with numbers at 12, 3, 6, 9
                tickInterval = 'hours';
                tickThickness = 1.5;
                tickThicknessMain = 2;
                showNumbers = 'main';
                numberSize = 8;
                numberOffset = 30;
            } else if (design === 'custom') {
                // Custom: use user-defined settings
                tickInterval = this.state.rxData.analogClockCustomTickInterval || 'hours';
                tickThickness = this.state.rxData.analogClockCustomTickThickness ?? 1.5;
                tickThicknessMain = this.state.rxData.analogClockCustomTickThicknessMain ?? 2;
                numberSize = this.state.rxData.analogClockCustomNumberSize ?? 8;
                numberOffset = this.state.rxData.analogClockCustomNumberOffset ?? 30;
                showNumbers = this.state.rxData.analogClockCustomShowNumbers ?? 'all';
            }

            // Get tick length settings
            let tickLength = 5; // Default regular tick length
            let tickLengthMain = 9; // Default main tick length
            
            if (design === 'custom') {
                tickLength = this.state.rxData.analogClockCustomTickLength ?? 5;
                tickLengthMain = this.state.rxData.analogClockCustomTickLengthMain ?? 9;
            }

            // Render base circle with configurable ring
            let borderWidth = 1;
            const showRing = this.state.rxData.analogClockShowRing ?? true;
            const ringThickness = this.state.rxData.analogClockRingThickness ?? 1;
            
            if (design === 'custom') {
                // Custom design uses user-defined ring settings
                borderWidth = showRing ? ringThickness : 0;
            } else if (design === 'modern') {
                borderWidth = 2;
            } else if (design === 'minimal') {
                borderWidth = 0.5;
            } else {
                borderWidth = 1;
            }
            
            return (
                <>
                    <circle cx={centerX} cy={centerY} r={48} fill={bgColor} stroke={faceColor} strokeWidth={borderWidth} />
                    
                    {/* Render tick marks and numbers */}
                    {design !== 'minimal' && (
                        <>
                            {/* Hour marks (only show if tickInterval is 'hours' or 'both') */}
                            {(tickInterval === 'hours' || tickInterval === 'both') && [...Array(12)].map((_, i) => {
                                const angle = (i * 30 - 90) * (Math.PI / 180);
                                const number = i === 0 ? 12 : i;
                                const isMainHour = i === 0 || i === 3 || i === 6 || i === 9;
                                
                                // Classic design never shows tick marks
                                const showTick = design !== 'classic' && tickThickness > 0;
                                
                                // Calculate tick mark positions using customizable length
                                const outerRadius = 47;
                                const currentTickLength = isMainHour ? tickLengthMain : tickLength;
                                const innerRadius = outerRadius - currentTickLength;
                                const x1 = centerX + Math.cos(angle) * innerRadius;
                                const y1 = centerY + Math.sin(angle) * innerRadius;
                                const x2 = centerX + Math.cos(angle) * outerRadius;
                                const y2 = centerY + Math.sin(angle) * outerRadius;
                                
                                // Determine if we should show numbers for this position
                                let showNumberHere = false;
                                if (showNumbers === 'all') {
                                    // Show all 12 numbers
                                    showNumberHere = true;
                                } else if (showNumbers === 'main') {
                                    // Show only main hour numbers (12, 3, 6, 9)
                                    showNumberHere = isMainHour;
                                } else if (showNumbers === 'none') {
                                    // Show no numbers
                                    showNumberHere = false;
                                }
                                
                                return (
                                    <g key={`hour-${i}`}>
                                        {showTick && (
                                            <line
                                                x1={x1}
                                                y1={y1}
                                                x2={x2}
                                                y2={y2}
                                                stroke={faceColor}
                                                strokeWidth={isMainHour ? tickThicknessMain : tickThickness}
                                                strokeLinecap="round"
                                            />
                                        )}
                                        {showNumberHere && (
                                            <text
                                                x={centerX + Math.cos(angle) * numberOffset}
                                                y={centerY + Math.sin(angle) * numberOffset}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                fill={faceColor}
                                                fontSize={numberSize}
                                                fontWeight="bold"
                                            >
                                                {number}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                            
                            {/* Minute marks (only if tickInterval is 'minutes' or 'both') */}
                            {(tickInterval === 'minutes' || tickInterval === 'both') && [...Array(60)].map((_, i) => {
                                // For 'both' mode, skip hour positions (they're already drawn)
                                // For 'minutes' mode, show all 60 minute marks
                                if (tickInterval === 'both' && i % 5 === 0) return null;
                                
                                const angle = (i * 6 - 90) * (Math.PI / 180);
                                const outerRadius = 47;
                                const minuteTickLength = tickLength * 0.4; // Minute marks are 40% of regular tick length
                                const innerRadius = outerRadius - minuteTickLength;
                                const x1 = centerX + Math.cos(angle) * innerRadius;
                                const y1 = centerY + Math.sin(angle) * innerRadius;
                                const x2 = centerX + Math.cos(angle) * outerRadius;
                                const y2 = centerY + Math.sin(angle) * outerRadius;
                                
                                return (
                                    <line
                                        key={`minute-${i}`}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={faceColor}
                                        strokeWidth={tickThickness * 0.5}
                                        strokeLinecap="round"
                                    />
                                );
                            })}
                        </>
                    )}
                    
                    {/* Center dot */}
                    <circle cx={centerX} cy={centerY} r={design === 'modern' ? 3 : 2.5} fill={faceColor} />
                </>
            );
        };

        // Render clock hand based on design
        const renderHand = (angle: number, length: number, width: number, color: string, design: string) => {
            const rad = (angle - 90) * (Math.PI / 180);
            const x = centerX + Math.cos(rad) * length;
            const y = centerY + Math.sin(rad) * length;

            if (design === 'arrow') {
                const tipX = centerX + Math.cos(rad) * length;
                const tipY = centerY + Math.sin(rad) * length;
                const leftAngle = rad + (150 * Math.PI / 180);
                const rightAngle = rad - (150 * Math.PI / 180);
                const arrowWidth = width * 2;
                const leftX = tipX + Math.cos(leftAngle) * arrowWidth;
                const leftY = tipY + Math.sin(leftAngle) * arrowWidth;
                const rightX = tipX + Math.cos(rightAngle) * arrowWidth;
                const rightY = tipY + Math.sin(rightAngle) * arrowWidth;

                return (
                    <>
                        <line
                            x1={centerX}
                            y1={centerY}
                            x2={x}
                            y2={y}
                            stroke={color}
                            strokeWidth={width}
                            strokeLinecap="round"
                        />
                        <polygon
                            points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
                            fill={color}
                        />
                    </>
                );
            } else if (design === 'modern') {
                return (
                    <line
                        x1={centerX}
                        y1={centerY}
                        x2={x}
                        y2={y}
                        stroke={color}
                        strokeWidth={width}
                        strokeLinecap="square"
                    />
                );
            } else {
                // classic
                return (
                    <line
                        x1={centerX}
                        y1={centerY}
                        x2={x}
                        y2={y}
                        stroke={color}
                        strokeWidth={width}
                        strokeLinecap="round"
                    />
                );
            }
        };

        return (
            <svg
                viewBox={`0 0 ${size} ${size}`}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            >
                {renderClockFace()}
                
                {/* Hour hand */}
                {this.state.rxData.analogClockShowHourHand && renderHand(
                    hourAngle,
                    25,
                    3,
                    this.state.rxData.analogClockHourHandColor || 'rgb(0, 0, 0)',
                    this.state.rxData.analogClockHourHandDesign || 'classic'
                )}

                {/* Minute hand */}
                {this.state.rxData.analogClockShowMinuteHand && renderHand(
                    minuteAngle,
                    35,
                    2,
                    this.state.rxData.analogClockMinuteHandColor || 'rgb(0, 0, 0)',
                    this.state.rxData.analogClockMinuteHandDesign || 'classic'
                )}

                {/* Second hand */}
                {this.state.rxData.analogClockShowSecondHand && renderHand(
                    secondAngle,
                    38,
                    1,
                    this.state.rxData.analogClockSecondHandColor || 'rgb(255, 0, 0)',
                    this.state.rxData.analogClockSecondHandDesign || 'classic'
                )}
            </svg>
        );
    }

    getCardContent(valueData: UniversalWidgetValueData): React.JSX.Element {
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
            case 'analogClock':
                c = this.getContentAnalogClock(valueData);
                break;
            default:
                c = '';
        }
        return (
            <div
                className={
                    this.state.rxData.contentType === 'colorPicker' ? 'vis-inventwo-widget-color-picker-wrapper' : ''
                }
                style={{
                    height: '100%',
                    width:
                        this.state.rxData.contentType === 'viewInWidget' ||
                        this.state.rxData.contentType === 'analogClock' ||
                        (this.state.rxData.contentType === 'image' && valueData.styles.imageObjectFit)
                            ? '100%'
                            : '',
                    transform: `rotateZ(${valueData.styles.contentRotation}deg)`,
                    animation:
                        valueData.contentBlinkInterval > 0
                            ? `blink ${valueData.contentBlinkInterval / 1000}s infinite`
                            : '',
                }}
                ref={this.refContentContainer}
            >
                {c}
            </div>
        );
    }

    buildCard(
        valueData: UniversalWidgetValueData,
        i: number | null,
        content: React.JSX.Element | string,
    ): React.JSX.Element {
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

        return (
            <div
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
                    onMouseUp={e => this.onBtnMouseUp(e)}
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
            </div>
        );
    }

    getSingleCard(i: number | null = null): React.JSX.Element {
        const valueData = this.getValueData(i);

        const content = this.getCardContent(valueData);

        const cardContent = (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: (valueData.styles.flexDirection +
                        (valueData.styles.invertOrder ? '-reverse' : '')) as React.CSSProperties['flexDirection'],
                    justifyContent:
                        valueData.styles.invertOrder && valueData.styles.alignItems === 'flex-start'
                            ? 'flex-end'
                            : valueData.styles.invertOrder && valueData.styles.alignItems === 'flex-end'
                              ? 'flex-start'
                              : valueData.styles.alignItems,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexGrow: valueData.styles.imageObjectFit ? 1 : '',
                        justifyContent:
                            valueData.styles.flexDirection === 'column' ? valueData.styles.contentAlign : '',
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
                        textAlign: this.state.rxStyle!['text-align'] as React.CSSProperties['textAlign'],
                        alignSelf: valueData.styles.textAlign,
                        textDecoration: valueData.styles.textDecoration,
                        color: valueData.textColor,
                        margin: `${valueData.styles.textMarginTop}px ${valueData.styles.textMarginRight}px ${valueData.styles.textMarginBottom}px ${valueData.styles.textMarginLeft}px`,
                    }}
                    dangerouslySetInnerHTML={{ __html: valueData.text }}
                />
            </div>
        );

        return this.buildCard(valueData, i, cardContent);
    }
}
