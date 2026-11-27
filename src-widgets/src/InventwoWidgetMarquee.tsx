import React from 'react';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import { createDocsLinkField } from './utils/docLinkField';
import { createDesignPresetField } from './utils/designPresets/DesignPresetField';
import { createThemeFields } from './utils/themes/ThemeField';
import type { DesignSpec } from './utils/designPresets/designFields';

interface MarqueeRxData {
    oid: null | string;
    marqueeText: string;
    direction: 'left' | 'right' | 'up' | 'down';
    speed: number;
    textRepeat: number;
    gap: number;
    pauseOnHover: boolean;
    backgroundColor: string;
}

interface MarqueeState extends VisRxWidgetState {
    textWidth: number;
    containerWidth: number;
    textHeight: number;
    containerHeight: number;
}

/**
 * Design attributes of the Marquee widget for design presets: direction, speed, repetitions, gap and background. Never
 * the datapoint, the text or the hover behaviour.
 */
export const MARQUEE_DESIGN_SPEC: DesignSpec = {
    version: 1,
    groups: {
        common: ['direction', 'speed', 'textRepeat', 'gap', 'backgroundColor'],
        attr_group_css_border_radius: true,
        attr_group_css_border: true,
        attr_group_css_outer_shadow: true,
    },
};

/** Stable reference for the design preset field, which needs the widget info it is part of */
const getMarqueeWidgetInfo = (): RxWidgetInfo => InventwoWidgetMarquee.getWidgetInfo();

export default class InventwoWidgetMarquee extends InventwoGeneric<MarqueeRxData, MarqueeState> {
    private containerRef = React.createRef<HTMLDivElement>();
    private textRef = React.createRef<HTMLSpanElement>();
    private measureTimeout: ReturnType<typeof setTimeout> | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private readonly animName: string;

    constructor(props: VisRxWidgetProps) {
        super(props);
        this.animName = `inventwo_marquee_${Math.random().toString(36).slice(2, 9)}`;
        this.state = {
            ...this.state,
            textWidth: 0,
            containerWidth: 0,
            textHeight: 0,
            containerHeight: 0,
        };
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    componentDidMount(): void {
        super.componentDidMount();
        this.scheduleMeasure(150);
    }

    componentDidUpdate(_prevProps: VisRxWidgetProps, prevState: MarqueeState): void {
        // Avoid re-measuring when only dimension state changed (prevents infinite loops)
        if (
            prevState.textWidth !== this.state.textWidth ||
            prevState.containerWidth !== this.state.containerWidth ||
            prevState.textHeight !== this.state.textHeight ||
            prevState.containerHeight !== this.state.containerHeight
        ) {
            return;
        }
        this.scheduleMeasure(50);
    }

    componentWillUnmount(): void {
        super.componentWillUnmount();
        if (this.measureTimeout !== null) {
            clearTimeout(this.measureTimeout);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
    }

    onStateUpdated(id: string | null, _state: ioBroker.State): void {
        if (id === this.state.rxData.oid) {
            this.scheduleMeasure(50);
        }
    }

    private scheduleMeasure(delay = 50): void {
        if (this.measureTimeout !== null) {
            clearTimeout(this.measureTimeout);
        }
        this.measureTimeout = setTimeout(() => {
            this.measureDimensions();
            this.measureTimeout = null;
        }, delay);
    }

    private measureDimensions(): void {
        if (!this.containerRef.current || !this.textRef.current) {
            return;
        }
        const cw = this.containerRef.current.clientWidth;
        const ch = this.containerRef.current.clientHeight;
        const tw = this.textRef.current.offsetWidth;
        const th = this.textRef.current.offsetHeight;

        if (!this.resizeObserver && window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => this.scheduleMeasure(50));
            this.resizeObserver.observe(this.containerRef.current);
        }

        if (
            cw !== this.state.containerWidth ||
            tw !== this.state.textWidth ||
            ch !== this.state.containerHeight ||
            th !== this.state.textHeight
        ) {
            this.setState({ containerWidth: cw, textWidth: tw, containerHeight: ch, textHeight: th });
        }
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetMarquee',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_marquee',
            visName: 'widget_marquee',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        createDocsLinkField('docs/en/widgets/marquee-widget.md') as any,
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
                        },
                        {
                            name: 'marqueeText',
                            type: 'text',
                            label: 'marquee_text',
                            hidden: '!!data.oid && data.oid !== "nothing_selected"',
                        },
                        {
                            name: 'direction',
                            type: 'select',
                            options: [
                                { value: 'left', label: 'left' },
                                { value: 'right', label: 'right' },
                                { value: 'up', label: 'up' },
                                { value: 'down', label: 'down' },
                            ],
                            default: 'left',
                            label: 'direction',
                        },
                        {
                            name: 'speed',
                            type: 'slider',
                            min: 10,
                            max: 500,
                            step: 5,
                            default: 80,
                            label: 'marquee_speed',
                            tooltip: 'marquee_speed_tooltip',
                        },
                        {
                            name: 'textRepeat',
                            type: 'number',
                            label: 'marquee_repeat',
                            default: 3,
                            tooltip: 'marquee_repeat_tooltip',
                        },
                        {
                            name: 'gap',
                            type: 'slider',
                            min: 0,
                            max: 500,
                            step: 10,
                            default: 50,
                            label: 'marquee_gap',
                            tooltip: 'marquee_gap_tooltip',
                        },
                        {
                            name: 'pauseOnHover',
                            type: 'checkbox',
                            label: 'marquee_pause_on_hover',
                            default: false,
                        },
                        {
                            name: 'backgroundColor',
                            type: 'color',
                            label: 'background',
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
                            tpl: 'tplInventwoWidgetMarquee',
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
                            tpl: 'tplInventwoWidgetMarquee',
                            all: true,
                        },
                        {
                            name: 'borderColor',
                            type: 'color',
                            label: 'border_color',
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
                                { value: 'inset', label: 'inset' },
                                { value: 'outset', label: 'outset' },
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
                            tpl: 'tplInventwoWidgetMarquee',
                            all: true,
                        },
                        {
                            name: 'outerShadowColor',
                            type: 'color',
                            label: 'outer_shadow_color',
                            default: 'rgb(0,0,0)',
                            hidden: '!!data.outerShadowStyleFromWidget',
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
                    name: 'attr_group_theme',
                    label: 'attr_group_theme',
                    fields: createThemeFields(getMarqueeWidgetInfo) as any,
                },
                {
                    name: 'attr_group_design_presets',
                    label: 'attr_group_design_presets',
                    fields: [
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_design_presets_help_generic',
                        },
                        createDesignPresetField(getMarqueeWidgetInfo, MARQUEE_DESIGN_SPEC) as any,
                    ],
                },
            ],
            visDefaultStyle: {
                width: 300,
                height: 40,
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-marquee.png',
            visOrder: 9,
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.

    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetMarquee.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const text = this.validOid(this.state.rxData.oid)
            ? String(this.getValue(this.state.rxData.oid) ?? '')
            : (this.state.rxData.marqueeText ?? '');

        const speed = this.state.rxData.speed || 80;
        const direction = this.state.rxData.direction || 'left';
        const textRepeat = Math.max(1, Math.floor(this.state.rxData.textRepeat) || 3);
        const gap = this.state.rxData.gap ?? 50;
        const pauseOnHover = this.state.rxData.pauseOnHover;
        const backgroundColor = this.state.rxData.backgroundColor;

        const outerShadow = this.getStyle(
            'outerShadowStyleFromWidget',
            this.groupAttrs.attr_group_css_outer_shadow,
        );
        const border = this.getStyle('borderStyleFromWidget', this.groupAttrs.attr_group_css_border);
        const radius = this.getStyle('borderRadiusStyleFromWidget', this.groupAttrs.attr_group_css_border_radius);
        const boxShadow = outerShadow.outerShadowColor
            ? `${outerShadow.outerShadowX ?? 0}px ${outerShadow.outerShadowY ?? 0}px ${outerShadow.outerShadowBlur ?? 0}px ${outerShadow.outerShadowSize ?? 0}px ${outerShadow.outerShadowColor}`
            : undefined;
        const borderRadius = `${radius.borderRadiusTopLeft ?? 0}px ${radius.borderRadiusTopRight ?? 0}px ${radius.borderRadiusBottomRight ?? 0}px ${radius.borderRadiusBottomLeft ?? 0}px`;

        const isVertical = direction === 'up' || direction === 'down';
        const { textWidth, textHeight } = this.state;
        const primarySize = isVertical ? textHeight : textWidth;

        // One full animation cycle = one text copy + its trailing gap
        const cycleSize = primarySize + gap;
        // Duration for exactly one cycle at constant speed (px/s) → independent of textRepeat
        const duration = primarySize > 0 && speed > 0 ? cycleSize / speed : 0;

        let styleContent = '';
        if (primarySize > 0) {
            if (isVertical) {
                // up: start at 0, end at -cycleSize → copy slides off top, next copy takes over
                // down: start at -cycleSize, end at 0 → copy slides in from top
                const fromY = direction === 'up' ? 0 : -cycleSize;
                const toY = direction === 'up' ? -cycleSize : 0;
                styleContent = `@keyframes ${this.animName} { from { transform: translateY(${fromY}px); } to { transform: translateY(${toY}px); } }`;
            } else {
                // left: start at 0, end at -cycleSize → copy slides off left, next copy takes over
                // right: start at -cycleSize, end at 0 → copy slides in from left
                const fromX = direction === 'left' ? 0 : -cycleSize;
                const toX = direction === 'left' ? -cycleSize : 0;
                styleContent = `@keyframes ${this.animName} { from { transform: translateX(${fromX}px); } to { transform: translateX(${toX}px); } }`;
            }
        }

        const commonFontStyle: React.CSSProperties = {
            fontSize: this.state.rxStyle?.['font-size'] ?? undefined,
            color: this.state.rxStyle?.color ?? undefined,
            fontFamily: this.state.rxStyle?.['font-family'] ?? undefined,
            fontWeight: this.state.rxStyle?.['font-weight'] ?? undefined,
            fontStyle: this.state.rxStyle?.['font-style'] ?? undefined,
            letterSpacing: this.state.rxStyle?.['letter-spacing'] ?? undefined,
        };

        const textStyle: React.CSSProperties = isVertical
            ? {
                  ...commonFontStyle,
                  display: 'block',
                  marginBottom: gap,
              }
            : {
                  ...commonFontStyle,
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  marginRight: gap,
              };

        const innerStyle: React.CSSProperties = {
            ...(isVertical ? { display: 'block' } : { display: 'inline-block', whiteSpace: 'nowrap' }),
            ...(duration > 0 ? { animation: `${this.animName} ${duration.toFixed(3)}s linear infinite` } : {}),
        };

        const handleMouseEnter = pauseOnHover
            ? (e: React.MouseEvent<HTMLSpanElement>): void => {
                  e.currentTarget.style.animationPlayState = 'paused';
              }
            : undefined;

        const handleMouseLeave = pauseOnHover
            ? (e: React.MouseEvent<HTMLSpanElement>): void => {
                  e.currentTarget.style.animationPlayState = 'running';
              }
            : undefined;

        // Render textRepeat copies of the text, each followed by a gap (via margin)
        const copies = Array.from({ length: textRepeat }, (_, i) => (
            <span
                key={i}
                ref={i === 0 ? this.textRef : undefined}
                style={textStyle}
            >
                {text}
            </span>
        ));

        return (
            <div
                ref={this.containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: isVertical ? 'stretch' : 'center',
                    flexDirection: isVertical ? 'column' : 'row',
                    background: backgroundColor || undefined,
                    position: 'relative',
                    boxSizing: 'border-box',
                    boxShadow,
                    borderRadius,
                    borderColor: border.borderColor,
                    borderStyle: border.borderStyle,
                    borderTopWidth: `${border.borderSizeTop ?? 0}px`,
                    borderBottomWidth: `${border.borderSizeBottom ?? 0}px`,
                    borderLeftWidth: `${border.borderSizeLeft ?? 0}px`,
                    borderRightWidth: `${border.borderSizeRight ?? 0}px`,
                }}
            >
                {styleContent ? <style>{styleContent}</style> : null}
                <span
                    style={innerStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {copies}
                </span>
            </div>
        );
    }
}
