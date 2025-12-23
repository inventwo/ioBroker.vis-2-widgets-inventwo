import type { ColorPickerProps } from '@jaames/iro/dist/ColorPicker';
import type {
    UniversalWidgetAlignmentStyles,
    UniversalWidgetBorderRadiusStyles,
    UniversalWidgetBorderStyles,
    UniversalWidgetClickFeedbackStyles,
    UniversalWidgetContentStyles,
    UniversalWidgetDefaultState,
    UniversalWidgetInnerShadowStyles,
    UniversalWidgetOuterShadowStyles,
    UniversalWidgetTextStyles,
    UniversalWidgetTransparencyStyles,
} from './UniversalWidgetValueData';

export interface UniversalCompleteRxData
    extends UniversalRxData,
        UniversalStateRxData,
        ColorPickerRxData,
        AnalogClockRxData,
        DialogRxData,
        UniversalWidgetDefaultState,
        UniversalWidgetTextStyles,
        UniversalWidgetContentStyles,
        UniversalWidgetAlignmentStyles,
        UniversalWidgetBorderStyles,
        UniversalWidgetBorderRadiusStyles,
        UniversalWidgetTransparencyStyles,
        UniversalWidgetOuterShadowStyles,
        UniversalWidgetInnerShadowStyles,
        UniversalWidgetClickFeedbackStyles {}

export interface UniversalRxData {
    oid: null | string;
    type: 'switch' | 'button' | 'nav' | 'readonly' | 'viewInDialog' | 'increaseDecreaseValue' | 'http';
    mode: 'singleButton' | 'separatedButtons';
    url: string;
    httpType: 'send' | 'open' | 'openNewTab';
    valueFalse: string;
    valueTrue: string;
    view: string;
    buttonSize: number;
    btnSpacing: number;
    countStates: number;
    buttonHoldValue: boolean;
    contentType: 'icon' | 'image' | 'html' | 'viewInWidget' | 'colorPicker' | 'analogClock';
    clickThrough: boolean;
    dialogCloseTimeoutSeconds: number;
    direction: 'row' | 'column';
}

export interface UniversalStateRxData {
    [key: `compareBy${number}`]: 'default' | 'value' | 'view';
    [key: `comparisonOperator${number}`]: '===' | '!=' | '>' | '<' | '>=' | '<=';
    [key: `value${number}`]: any;
    [key: `oid${number}`]: null | string;
    [key: `view${number}`]: string;
    [key: `icon${number}`]: string;
    [key: `image${number}`]: string;
    [key: `text${number}`]: string;
    [key: `html${number}`]: string;
    [key: `viewInWidget${number}`]: string;
    [key: `contentBlinkInterval${number}`]: number;
    [key: `contentSize${number}`]: string;
    [key: `iconTrue${number}`]: string;
    [key: `imageTrue${number}`]: string;
    [key: `textTrue${number}`]: string;
    [key: `htmlTrue${number}`]: string;
    [key: `viewInWidgetTrue${number}`]: string;
}

export interface ColorPickerRxData {
    colorPickerShowWheel: boolean;
    colorPickerShowAlpha: boolean;
    colorPickerShowBox: boolean;
    colorPickerShowHue: boolean;
    colorPickerShowSaturation: boolean;
    colorPickerShowValue: boolean;
    colorPickerShowRed: boolean;
    colorPickerShowGreen: boolean;
    colorPickerShowBlue: boolean;
    colorPickerShowKelvin: boolean;
    colorPickerWidth: ColorPickerProps['width'];
    colorPickerHandleSize: ColorPickerProps['handleRadius'];
    colorPickerHandleMargin: ColorPickerProps['padding'];
    colorPickerComponentsSpace: ColorPickerProps['margin'];
    colorPickerDirection: ColorPickerProps['layoutDirection'];
    colorPickerBorderWidth: ColorPickerProps['borderWidth'];
    colorPickerBorderColor: ColorPickerProps['borderColor'];
    colorPickerColorModel: 'hsv' | 'hsl' | 'rgb' | 'cie' | 'hex' | 'hex8';
    colorPickerOid: string | null;
    colorPickerOid1: string | null;
    colorPickerOid2: string | null;
    colorPickerOid3: string | null;
}

export interface AnalogClockRxData {
    analogClockFaceDesign: 'classic' | 'modern' | 'minimal' | 'dashes';
    analogClockFaceColor: string;
    analogClockBackgroundColor: string;
    analogClockShowHourHand: boolean;
    analogClockHourHandDesign: 'classic' | 'modern' | 'arrow';
    analogClockHourHandColor: string;
    analogClockShowMinuteHand: boolean;
    analogClockMinuteHandDesign: 'classic' | 'modern' | 'arrow';
    analogClockMinuteHandColor: string;
    analogClockShowSecondHand: boolean;
    analogClockSecondHandDesign: 'classic' | 'modern' | 'arrow';
    analogClockSecondHandColor: string;
}

export interface DialogRxData {
    dialogFullscreen: boolean;
    dialogCloseOnClickOutside: boolean;
    dialogWidth: number;
    dialogHeight: number;
    dialogPadding: number;
    dialogBackground: string;
    dialogTitleHide: boolean;
    dialogTitle: string;
    dialogTitleColor: string;
    dialogTitleSize: number;
    dialogTitlePaddingTop: number;
    dialogTitlePaddingBottom: number;
    dialogTitlePaddingLeft: number;
    dialogTitlePaddingRight: number;
    dialogCloseButtonBackground: string;
    dialogCloseButtonColor: string;
    dialogCloseButtonSize: number;
    dialogBorderRadiusTopLeft: number;
    dialogBorderRadiusTopRight: number;
    dialogBorderRadiusBottomRight: number;
    dialogBorderRadiusBottomLeft: number;
}
