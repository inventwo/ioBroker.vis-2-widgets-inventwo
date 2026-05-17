import React from 'react';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';

interface ValueListRxData {
    oid: null | string;
    manualText: string;
    separator: string;
    trimItems: boolean;
    ignoreEmpty: boolean;
    bulletType: 'disc' | 'circle' | 'square' | 'dash' | 'arrow' | 'number' | 'none' | 'custom';
    bulletCustom: string;
    bulletColor: string;
    textColor: string;
    backgroundColor: string;
    fontSize: number;
    lineSpacing: number;
    bulletSpacing: number;
    padding: number;
    textAlign: 'left' | 'center' | 'right';
}

type ValueListState = VisRxWidgetState;

class InventwoWidgetValueList extends InventwoGeneric<ValueListRxData, ValueListState> {
    constructor(props: VisRxWidgetProps) {
        super(props);
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetValueList',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_valuelist',
            visName: 'widget_valuelist',
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
                            name: 'manualText',
                            type: 'text',
                            label: 'valuelist_manual_text',
                            hidden: '!!data.oid && data.oid !== "nothing_selected"',
                        },
                        {
                            name: 'separator',
                            type: 'text',
                            label: 'valuelist_separator',
                            tooltip: 'valuelist_separator_tooltip',
                            default: ',',
                        },
                        {
                            name: 'trimItems',
                            type: 'checkbox',
                            label: 'valuelist_trim_items',
                            default: true,
                        },
                        {
                            name: 'ignoreEmpty',
                            type: 'checkbox',
                            label: 'valuelist_ignore_empty',
                            default: true,
                        },
                    ],
                },
                {
                    name: 'attr_group_valuelist_style',
                    label: 'attr_group_valuelist_style',
                    fields: [
                        {
                            name: 'bulletType',
                            type: 'select',
                            label: 'valuelist_bullet_type',
                            options: [
                                { value: 'disc', label: 'valuelist_bullet_disc' },
                                { value: 'circle', label: 'valuelist_bullet_circle' },
                                { value: 'square', label: 'valuelist_bullet_square' },
                                { value: 'dash', label: 'valuelist_bullet_dash' },
                                { value: 'arrow', label: 'valuelist_bullet_arrow' },
                                { value: 'number', label: 'valuelist_bullet_number' },
                                { value: 'none', label: 'none' },
                                { value: 'custom', label: 'custom' },
                            ],
                            default: 'disc',
                        },
                        {
                            name: 'bulletCustom',
                            type: 'text',
                            label: 'valuelist_bullet_custom_char',
                            hidden: 'data.bulletType !== "custom"',
                            default: '*',
                        },
                        {
                            name: 'bulletColor',
                            type: 'color',
                            label: 'valuelist_bullet_color',
                            hidden: 'data.bulletType === "none"',
                        },
                        {
                            name: 'bulletSpacing',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 8,
                            label: 'valuelist_bullet_spacing',
                            hidden: 'data.bulletType === "none"',
                        },
                        {
                            name: '',
                            type: 'delimiter',
                        },
                        {
                            name: 'lineSpacing',
                            type: 'slider',
                            min: 0,
                            max: 50,
                            step: 1,
                            default: 4,
                            label: 'valuelist_line_spacing',
                        },
                        {
                            name: 'padding',
                            type: 'number',
                            label: 'padding',
                            default: 4,
                        },
                    ],
                },
            ],
            visDefaultStyle: {
                width: 200,
                height: 150,
            },
            visPrev: '',
        };
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetValueList.getWidgetInfo();
    }

    private static getBulletChar(type: string, index: number, customChar: string): string {
        switch (type) {
            case 'disc':
                return '•';
            case 'circle':
                return '○';
            case 'square':
                return '▪';
            case 'dash':
                return '–';
            case 'arrow':
                return '›';
            case 'number':
                return `${index + 1}.`;
            case 'custom':
                return customChar || '*';
            case 'none':
                return '';
            default:
                return '•';
        }
    }

    private static resolveSeparator(sep: string): string {
        return sep.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const rxData = this.state.rxData;

        const rawText = this.validOid(rxData.oid) ? String(this.getValue(rxData.oid) ?? '') : (rxData.manualText ?? '');

        const rawSeparator = rxData.separator ?? ',';
        const separator = InventwoWidgetValueList.resolveSeparator(rawSeparator);

        let items: string[] = separator ? rawText.split(separator) : [rawText];

        if (rxData.trimItems) {
            items = items.map(item => item.trim());
        }
        if (rxData.ignoreEmpty) {
            items = items.filter(item => item !== '');
        }

        const bulletType = rxData.bulletType || 'disc';
        const bulletCustom = rxData.bulletCustom || '*';
        const bulletColor = rxData.bulletColor || undefined;
        const lineSpacing = rxData.lineSpacing ?? 4;
        const bulletSpacing = rxData.bulletSpacing ?? 8;
        const padding = rxData.padding ?? 4;
        const textAlign = rxData.textAlign || 'left';

        const containerStyle: React.CSSProperties = {
            width: '100%',
            height: '100%',
            overflow: 'auto',
            boxSizing: 'border-box',
            padding: padding ? `${padding}px` : undefined,
            fontFamily: (this.state.rxStyle?.['font-family'] as string) ?? undefined,
            fontWeight: (this.state.rxStyle?.['font-weight'] as string) ?? undefined,
            fontStyle: (this.state.rxStyle?.['font-style'] as string) ?? undefined,
        };

        return (
            <div style={containerStyle}>
                {items.map((item, index) => {
                    const bullet = InventwoWidgetValueList.getBulletChar(bulletType, index, bulletCustom);
                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent:
                                    textAlign === 'center'
                                        ? 'center'
                                        : textAlign === 'right'
                                          ? 'flex-end'
                                          : 'flex-start',
                                marginBottom: index < items.length - 1 ? `${lineSpacing}px` : undefined,
                            }}
                        >
                            {bulletType !== 'none' && (
                                <span
                                    style={{
                                        marginRight: `${bulletSpacing}px`,
                                        color: bulletColor,
                                        flexShrink: 0,
                                        userSelect: 'none',
                                    }}
                                >
                                    {bullet}
                                </span>
                            )}
                            <span
                                style={{
                                    wordBreak: 'break-word',
                                    textAlign,
                                }}
                            >
                                {item}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default InventwoWidgetValueList;
