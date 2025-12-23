import type React from 'react';

export interface UniversalWidgetValueData extends UniversalWidgetStyles {
    styles: UniversalWidgetStylesStyles;
}

export interface UniversalWidgetDefaultState {
    text: string;
    icon: string | null;
    image: string | null;
    html: string | null;
    viewInWidget: string | null;
    contentBlinkInterval: number;
    contentColor: string;
    background: string;
    textColor: string;
    borderColor: string;
    outerShadowColor: string;
    innerShadowColor: string;
}

export interface UniversalWidgetStylesStyles
    extends UniversalWidgetTextStyles,
        UniversalWidgetContentStyles,
        UniversalWidgetAlignmentStyles,
        UniversalWidgetTransparencyStyles,
        UniversalWidgetSpacingStyles,
        UniversalWidgetBorderRadiusStyles,
        UniversalWidgetBorderStyles,
        UniversalWidgetOuterShadowStyles,
        UniversalWidgetInnerShadowStyles,
        UniversalWidgetClickFeedbackStyles {}

export interface UniversalWidgetStyles extends UniversalWidgetDefaultState {
    contentSize: number | string;
}

export interface UniversalWidgetTextStyles {
    textDecoration: 'none' | 'underline' | 'line-through' | 'underline line-through';
    textMarginTop: number | string;
    textMarginBottom: number | string;
    textMarginLeft: number | string;
    textMarginRight: number | string;
}

export interface UniversalWidgetContentStyles {
    contentType: 'icon' | 'image' | 'html' | 'viewInWidget' | 'colorPicker';
    scaleContentToFit: boolean;
    contentMarginTop: number | string;
    contentMarginBottom: number | string;
    contentMarginLeft: number | string;
    contentMarginRight: number | string;
    contentSize: number | string;
    contentRotation: number;
    contentMirror: boolean;
    imageObjectFit: '' | 'contain' | 'cover' | 'fill' | 'repeat';
    imageBackgroundSize: number | string;
    imageObjectPosition: 'none' | 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface UniversalWidgetAlignmentStyles {
    flexDirection: React.CSSProperties['flexDirection'];
    alignItems: 'flex-start' | 'flex-end' | 'center' | 'space-between';
    textAlign: 'start' | 'end' | 'center';
    contentAlign: 'start' | 'end' | 'center';
    invertOrder: boolean;
}

export interface UniversalWidgetTransparencyStyles {
    backgroundOpacity: number;
    contentOpacity: number;
}

export interface UniversalWidgetSpacingStyles {
    paddingLeft: number;
    paddingRight: number;
    paddingTop: number;
    paddingBottom: number;
}

export interface UniversalWidgetBorderRadiusStyles {
    borderRadiusTopLeft: number;
    borderRadiusTopRight: number;
    borderRadiusBottomLeft: number;
    borderRadiusBottomRight: number;
}

export interface UniversalWidgetBorderStyles {
    borderSizeTop: number;
    borderSizeBottom: number;
    borderSizeLeft: number;
    borderSizeRight: number;
    borderStyle: React.CSSProperties['borderStyle'];
}

export interface UniversalWidgetOuterShadowStyles {
    outerShadowBlur: number;
    outerShadowSize: number;
    outerShadowX: number;
    outerShadowY: number;
}

export interface UniversalWidgetInnerShadowStyles {
    innerShadowBlur: number;
    innerShadowSize: number;
    innerShadowX: number;
    innerShadowY: number;
}

export interface UniversalWidgetClickFeedbackStyles {
    feedbackDuration: number;
    contentColorFeedback: string;
    backgroundFeedback: string;
    textColorFeedback: string;
    borderColorFeedback: string;
    outerShadowColorFeedback: string;
    innerShadowColorFeedback: string;
}
