import React from 'react';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import { createDocsLinkField } from './utils/docLinkField';

interface MarqueeRxData {
    oid: null | string;
    marqueeText: string;
    direction: 'left' | 'right';
    speed: number;
    textRepeat: number;
    gap: number;
    pauseOnHover: boolean;
    backgroundColor: string;
}

interface MarqueeState extends VisRxWidgetState {
    textWidth: number;
    containerWidth: number;
}

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
        if (prevState.textWidth !== this.state.textWidth || prevState.containerWidth !== this.state.containerWidth) {
            return;
        }
        this.scheduleMeasure(50);
    }

    componentWillUnmount(): void {
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
        const tw = this.textRef.current.offsetWidth;

        if (!this.resizeObserver && window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => this.scheduleMeasure(50));
            this.resizeObserver.observe(this.containerRef.current);
        }

        if (cw !== this.state.containerWidth || tw !== this.state.textWidth) {
            this.setState({ containerWidth: cw, textWidth: tw });
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
            ],
            visDefaultStyle: {
                width: 300,
                height: 40,
            },
            visPrev: '',
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
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

        const { textWidth } = this.state;

        // One full animation cycle = one text copy + its trailing gap
        const cycleWidth = textWidth + gap;
        // Duration for exactly one cycle at constant speed (px/s) â†’ independent of textRepeat
        const duration = textWidth > 0 && speed > 0 ? cycleWidth / speed : 0;

        // Left: start at 0, end at -cycleWidth â†’ copy slides off left, next copy takes over
        // Right: start at -cycleWidth, end at 0 â†’ copy slides off right, next copy takes over
        const fromX = direction === 'left' ? 0 : -cycleWidth;
        const toX = direction === 'left' ? -cycleWidth : 0;

        const styleContent =
            textWidth > 0
                ? `@keyframes ${this.animName} { from { transform: translateX(${fromX}px); } to { transform: translateX(${toX}px); } }`
                : '';

        const textStyle: React.CSSProperties = {
            display: 'inline-block',
            whiteSpace: 'nowrap',
            marginRight: gap,
            fontSize: this.state.rxStyle?.['font-size'] ?? undefined,
            color: this.state.rxStyle?.color ?? undefined,
            fontFamily: this.state.rxStyle?.['font-family'] ?? undefined,
            fontWeight: this.state.rxStyle?.['font-weight'] ?? undefined,
            fontStyle: this.state.rxStyle?.['font-style'] ?? undefined,
            letterSpacing: this.state.rxStyle?.['letter-spacing'] ?? undefined,
        };

        const innerStyle: React.CSSProperties =
            textWidth > 0
                ? {
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      animation: `${this.animName} ${duration.toFixed(3)}s linear infinite`,
                  }
                : {
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
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

        // Render textRepeat copies of the text, each followed by a gap (via marginRight)
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
                    alignItems: 'center',
                    background: backgroundColor || undefined,
                    position: 'relative',
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
