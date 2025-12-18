import { styled } from '@mui/material/styles';
import { Table, TableRow, TableCell, TableContainer, TableHead, TableBody, Paper } from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';

import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState } from '@iobroker/types-vis-2';
import type { CSSProperties } from 'react';
import React from 'react';

interface TableRxData {
    oid: null | string;
    countColumns: number;
    maxRows: number;
    showHead: boolean;
    headerHeight: number | string;
    backgroundHeader: string;
    headerBorderWidth: number | string;
    headerBorderColor: string;
    rowBorderWidth: string | number;
    rowBorderColor: string;
    backgroundOddRow: string;
    backgroundEvenRow: string;
    columnHeight: string | number;
    [key: `columnTitleAlign${number}`]: React.CSSProperties['textAlign'];
    [key: `columnWidth${number}`]: string | number;
    [key: `columnTitle${number}`]: string | number;
    [key: `columnKey${number}`]: string | number;
    [key: `columnPrefix${number}`]: string;
    [key: `columnSuffix${number}`]: string;
    [key: `columnPlaceholder${number}`]: string;
    [key: `columnValueFormat${number}`]: 'text' | 'number' | 'datetime' | 'image';
    [key: `columnNumberDecimals${number}`]: number;
    [key: `columnDatetimeFormat${number}`]: 'datetime' | 'date' | 'time';
    [key: `columnContentAlign${number}`]: React.CSSProperties['textAlign'];
    [key: `columnDatetimeFormatCustom${number}`]: string;
}

export default class InventwoWidgetTable extends InventwoGeneric<TableRxData, VisRxWidgetState> {
    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetTable',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_table',
            visName: 'widget_table',
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
                            name: 'countColumns',
                            type: 'number',
                            default: 0,
                            label: 'count_columns',
                            hidden: 'data.countColumns > 0',
                        },
                        {
                            name: 'maxRows',
                            type: 'number',
                            min: 0,
                            step: 1,
                            default: 0,
                            label: 'max_rows',
                        },
                        {
                            name: 'showHead',
                            type: 'checkbox',
                            default: true,
                            label: 'show_head',
                        },
                    ],
                },

                {
                    name: 'countColumns',
                    indexFrom: 1,
                    indexTo: 'countColumns',
                    label: 'attr_group_columns',
                    fields: [
                        {
                            name: 'columnKey',
                            type: 'text',
                            label: 'key',
                        },
                        {
                            name: 'columnTitle',
                            type: 'text',
                            label: 'title',
                        },
                        {
                            name: 'columnWidth',
                            type: 'slider',
                            min: 0,
                            max: 200,
                            step: 1,
                            default: 0,
                            label: 'width',
                        },
                        {
                            name: 'columnPrefix',
                            type: 'text',
                            label: 'prefix',
                        },
                        {
                            name: 'columnSuffix',
                            type: 'text',
                            label: 'suffix',
                        },
                        {
                            name: 'columnPlaceholder',
                            type: 'text',
                            label: 'placeholder',
                        },
                        {
                            name: 'columnTitleAlign',
                            type: 'select',
                            options: [
                                { value: 'left', label: 'left' },
                                { value: 'center', label: 'center' },
                                { value: 'right', label: 'right' },
                            ],
                            default: 'center',
                            label: 'title_align',
                        },
                        {
                            name: 'columnContentAlign',
                            type: 'select',
                            options: [
                                { value: 'left', label: 'left' },
                                { value: 'center', label: 'center' },
                                { value: 'right', label: 'right' },
                            ],
                            default: 'left',
                            label: 'content_align',
                        },
                        {
                            name: 'columnValueFormat',
                            type: 'select',
                            options: [
                                { value: 'text', label: 'Text' },
                                { value: 'number', label: 'Number' },
                                { value: 'datetime', label: 'datetime' },
                                { value: 'image', label: 'image' },
                            ],
                            default: 'text',
                            label: 'format',
                        },
                        {
                            name: 'columnNumberDecimals',
                            type: 'number',
                            label: 'decimals',
                            default: 0,
                            hidden: 'data["columnValueFormat" + index] != "number"',
                        },

                        {
                            name: 'columnDatetimeFormat',
                            type: 'select',
                            options: [
                                { value: 'datetime', label: 'Datetime' },
                                { value: 'date', label: 'Date' },
                                { value: 'time', label: 'Time' },
                                { value: 'custom', label: 'Custom' },
                            ],
                            default: 'datetime',
                            label: 'datetime_format',
                            hidden: 'data["columnValueFormat" + index] != "datetime"',
                        },
                        {
                            name: 'columnDatetimeFormatCustom',
                            type: 'text',
                            label: 'datetime_format_custom',
                            tooltip: 'tooltip_datetime_custom_format',
                            hidden: 'data["columnValueFormat" + index] != "datetime" || data["columnDatetimeFormat" + index] != "custom"',
                        },
                    ],
                },
                {
                    name: 'attr_content_css_table',
                    label: 'attr_content_css_table',
                    fields: [
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_colors',
                        },
                        {
                            name: 'backgroundHeader',
                            type: 'color',
                            label: 'background_header',
                        },
                        {
                            name: 'backgroundOddRow',
                            type: 'color',
                            label: 'background_odd_row',
                        },
                        {
                            name: 'backgroundEvenRow',
                            type: 'color',
                            label: 'background_even_row',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_heights',
                        },
                        {
                            name: 'headerHeight',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 50,
                            label: 'header_height',
                        },
                        {
                            name: 'columnHeight',
                            type: 'slider',
                            min: 0,
                            max: 100,
                            step: 1,
                            default: 50,
                            label: 'column_height',
                        },
                        {
                            name: '',
                            type: 'help',
                            text: 'vis_2_widgets_inventwo_row_border',
                        },
                        {
                            name: 'headerBorderWidth',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 1,
                            label: 'thickness_header',
                        },
                        {
                            name: 'headerBorderColor',
                            type: 'color',
                            label: 'color_header',
                            default: 'rgb(81, 81, 81)',
                        },
                        {
                            name: 'rowBorderWidth',
                            type: 'slider',
                            min: 0,
                            max: 10,
                            step: 1,
                            default: 1,
                            label: 'thickness',
                        },
                        {
                            name: 'rowBorderColor',
                            type: 'color',
                            label: 'color',
                            default: 'rgb(81, 81, 81)',
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
                            tpl: 'tplInventwoWidgetTable',
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
                            tpl: 'tplInventwoWidgetTable',
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
                            tpl: 'tplInventwoWidgetTable',
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
            ],
            visDefaultStyle: {
                'overflow-x': 'visible',
                'overflow-y': 'visible',
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-table.png',
        };
    }

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetTable.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);

        let json: null | Record<string, any>[] = null;

        if (value === undefined || value === null || value === '') {
            return <div>Keine Daten</div>;
        }
        try {
            json = JSON.parse(value);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            return <div>Invalides JSON</div>;
        }

        const headers = [];
        const rows = [];

        const outerShadowStyle = this.getStyle(
            'outerShadowStyleFromWidget',
            this.groupAttrs.attr_group_css_outer_shadow,
        );
        const borderStyle = this.getStyle('borderStyleFromWidget', this.groupAttrs.attr_group_css_border);

        const StyledTableHeaderRow = styled(TableRow)(() => ({
            [`&.${tableRowClasses.root}`]: {
                height: this.valWithUnit(this.state.rxData.headerHeight),
            },
        }));

        const StyledTableHeaderCell = styled(TableCell)(() => ({
            [`&.${tableCellClasses.head}`]: {
                backgroundColor: this.state.rxData.backgroundHeader,
            },
            [`&.${tableCellClasses.root}`]: {
                paddingTop: 0,
                paddingBottom: 0,
                fontSize: this.state.rxStyle!['font-size'],
                color: this.state.rxStyle!.color,
                textShadow: this.state.rxStyle!['text-shadow'],
                fontFamily: this.state.rxStyle!['font-family'],
                fontStyle: this.state.rxStyle!['font-style'],
                fontVariant: this.state.rxStyle!['font-variant'],
                fontWeight: this.state.rxStyle!['font-weight'],
                lineHeight: this.state.rxStyle!['line-height'],
                letterSpacing: this.state.rxStyle!['letter-spacing'],
                wordSpacing: this.state.rxStyle!['word-spacing'],
                borderBottomWidth: this.state.rxData.headerBorderWidth,
                borderColor: this.state.rxData.headerBorderColor,
            },
        }));

        const StyledTableCell = styled(TableCell)(() => ({
            [`&.${tableCellClasses.root}`]: {
                paddingTop: 0,
                paddingBottom: 0,
                fontSize: this.state.rxStyle!['font-size'],
                color: this.state.rxStyle!.color,
                textShadow: this.state.rxStyle!['text-shadow'],
                fontFamily: this.state.rxStyle!['font-family'],
                fontStyle: this.state.rxStyle!['font-style'],
                fontVariant: this.state.rxStyle!['font-variant'],
                fontWeight: this.state.rxStyle!['font-weight'],
                lineHeight: this.state.rxStyle!['line-height'],
                letterSpacing: this.state.rxStyle!['letter-spacing'],
                wordSpacing: this.state.rxStyle!['word-spacing'],
                borderBottomWidth: this.state.rxData.rowBorderWidth,
                borderColor: this.state.rxData.rowBorderColor,
            },
        }));

        const StyledTableRow = styled(TableRow)(() => ({
            '&:nth-of-type(odd)': {
                backgroundColor: this.state.rxData.backgroundOddRow,
            },
            '&:nth-of-type(even)': {
                backgroundColor: this.state.rxData.backgroundEvenRow,
            },
            [`&.${tableRowClasses.root}`]: {
                height: this.valWithUnit(this.state.rxData.columnHeight),
            },
        }));

        if (json && json.length > 0) {
            const countColumns = this.state.rxData.countColumns;
            if (countColumns === 0) {
                Object.keys(json[0]).forEach((h, index) => {
                    headers.push(<StyledTableHeaderCell key={index}>{h}</StyledTableHeaderCell>);
                });
            } else {
                for (let i = 1; i <= this.state.rxData.countColumns; i++) {
                    let columnTitle = this.state.rxData[`columnTitle${i}`];

                    if (columnTitle === null) {
                        columnTitle = Object.keys(json[0])[i - 1];
                    }
                    const styles: CSSProperties = {
                        textAlign: this.state.rxData[`columnTitleAlign${i}`],
                    };
                    if (this.state.rxData[`columnWidth${i}`]) {
                        styles.width = this.valWithUnit(this.state.rxData[`columnWidth${i}`]);
                    }
                    headers.push(
                        <StyledTableHeaderCell
                            key={i}
                            style={styles}
                        >
                            {columnTitle}
                        </StyledTableHeaderCell>,
                    );
                }
            }

            let maxRows = this.state.rxData.maxRows;
            if (maxRows <= 0) {
                maxRows = json.length;
            } else {
                maxRows = Math.min(maxRows, json.length);
            }

            for (let index = 0; index < maxRows; index++) {
                const r = json[index];
                const columns = [];

                if (countColumns === 0) {
                    Object.values(r).forEach((v, indexCol: number) => {
                        if (typeof v === 'object' && v !== null) {
                            v = JSON.stringify(v);
                        }
                        columns.push(<StyledTableCell key={`${index}_${indexCol}`}>{v}</StyledTableCell>);
                    });
                } else {
                    for (let i = 1; i <= this.state.rxData.countColumns; i++) {
                        let columnKey = this.state.rxData[`columnKey${i}`];
                        const columnPrefix = this.state.rxData[`columnPrefix${i}`];
                        const columnSuffix = this.state.rxData[`columnSuffix${i}`];
                        const columnPlaceholder = this.state.rxData[`columnPlaceholder${i}`];
                        const columnFormat = this.state.rxData[`columnValueFormat${i}`];
                        if (!columnKey) {
                            columnKey = Object.keys(json[0])[i - 1];
                        }
                        let columnValue = r[columnKey];
                        if ((columnValue === null || columnValue === '') && columnPlaceholder) {
                            columnValue = columnPlaceholder;
                        } else if (columnFormat === 'number') {
                            const formatter = new Intl.NumberFormat(navigator.language, {
                                minimumFractionDigits: this.state.rxData[`columnNumberDecimals${i}`] ?? 0,
                                maximumFractionDigits: this.state.rxData[`columnNumberDecimals${i}`] ?? 0,
                            });
                            columnValue = formatter.format(columnValue);
                        } else if (columnFormat === 'datetime') {
                            if (columnValue) {
                                const datetimeFormat = this.state.rxData[`columnDatetimeFormat${i}`];
                                if (datetimeFormat === 'datetime') {
                                    columnValue = new Date(columnValue).toLocaleString();
                                } else if (datetimeFormat === 'date') {
                                    columnValue = new Date(columnValue).toLocaleDateString();
                                } else if (datetimeFormat === 'time') {
                                    columnValue = new Date(columnValue).toLocaleTimeString();
                                } else if (datetimeFormat === 'custom') {
                                    columnValue = this.formatDate(
                                        columnValue,
                                        this.state.rxData[`columnDatetimeFormatCustom${i}`] ?? '',
                                    );
                                }
                            }
                        } else if (columnFormat == 'image') {
                            let columnWidth = this.state.rxData[`columnWidth${i}`];
                            if (!columnWidth || columnWidth === 0) {
                                columnWidth = '100%';
                            } else {
                                columnWidth = this.valWithUnit(columnWidth);
                            }
                            columnValue = (
                                <img
                                    src={columnValue}
                                    style={{
                                        width: columnWidth,
                                    }}
                                    alt={columnValue}
                                />
                            );
                        } else {
                            if (typeof columnValue === 'object' && columnValue !== null) {
                                columnValue = JSON.stringify(columnValue);
                            }
                        }

                        columns.push(
                            <StyledTableCell
                                key={`${index}_${i}`}
                                style={{
                                    textAlign: this.state.rxData[`columnContentAlign${i}`],
                                }}
                            >
                                {columnPrefix}
                                {columnValue}
                                {columnSuffix}
                            </StyledTableCell>,
                        );
                    }
                }

                rows.push(
                    <StyledTableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        {columns}
                    </StyledTableRow>,
                );
            }
        }

        let shadow = '';
        if (outerShadowStyle.outerShadowColor) {
            shadow += `${outerShadowStyle.outerShadowX}px ${outerShadowStyle.outerShadowY}px ${outerShadowStyle.outerShadowBlur}px ${outerShadowStyle.outerShadowSize}px ${outerShadowStyle.outerShadowColor}`;
        }

        const borderRadiusStyle = this.getStyle(
            'borderRadiusStyleFromWidget',
            this.groupAttrs.attr_group_css_border_radius,
        );

        return (
            <div
                style={{
                    boxShadow: `${shadow}`,
                    overflow: 'hidden',
                    height: '100%',
                    borderColor: borderStyle.borderColor,
                    borderTopWidth: `${borderStyle.borderSizeTop}px`,
                    borderBottomWidth: `${borderStyle.borderSizeBottom}px`,
                    borderLeftWidth: `${borderStyle.borderSizeLeft}px`,
                    borderRightWidth: `${borderStyle.borderSizeRight}px`,
                    borderStyle: borderStyle.borderStyle,
                    borderRadius: `${borderRadiusStyle.borderRadiusTopLeft}px ${borderRadiusStyle.borderRadiusTopRight}px ${borderRadiusStyle.borderRadiusBottomRight}px ${borderRadiusStyle.borderRadiusBottomLeft}px`,
                }}
            >
                <TableContainer
                    component={Paper}
                    style={{
                        height: '100%',
                        background: 'transparent',
                        borderRadius: 0,
                    }}
                >
                    <Table>
                        {this.state.rxData.showHead && (
                            <TableHead>
                                <StyledTableHeaderRow>{headers}</StyledTableHeaderRow>
                            </TableHead>
                        )}
                        <TableBody>{rows}</TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}
