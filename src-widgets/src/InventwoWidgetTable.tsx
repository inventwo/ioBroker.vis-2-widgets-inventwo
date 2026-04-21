import { styled } from '@mui/material/styles';
import type { SxProps } from '@mui/material';
import {
    Table,
    TableRow,
    TableCell,
    TableContainer,
    TableHead,
    TableBody,
    Paper,
    TableSortLabel,
    ClickAwayListener,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Button,
    Box,
    Divider,
    Typography,
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import { tableRowClasses } from '@mui/material/TableRow';
import FilterListIcon from '@mui/icons-material/FilterList';
import InventwoGeneric from './InventwoGeneric';
import type { RxRenderWidgetProps, RxWidgetInfo, VisRxWidgetState, VisRxWidgetProps } from '@iobroker/types-vis-2';
import React from 'react';

interface TableRxData {
    oid: null | string;
    countColumns: number;
    maxRows: number;
    showHead: boolean;
    defaultSortColumn: string;
    defaultSortOrder: 'asc' | 'desc';
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
    [key: `sortable${number}`]: boolean;
    [key: `columnHidden${number}`]: boolean;
    [key: `columnFilterable${number}`]: boolean;
    stickyHeader: boolean;
    countRowConditions: number;
    [key: `rowConditionKey${number}`]: string;
    [key: `rowConditionValue${number}`]: string;
    [key: `rowConditionColor${number}`]: string;
}

interface TableWidgetState extends VisRxWidgetState {
    orderBy: string | null;
    order: 'asc' | 'desc';
    filters: Record<string, string[]>;
    filterAnchorEl: HTMLElement | null;
    filterButtonRect: DOMRect | null;
    filterColumn: string | null;
    filterColumnAllValues: string[];
    filterColumnPendingValues: string[];
    parentHeight: number | null;
}

export default class InventwoWidgetTable extends InventwoGeneric<TableRxData, TableWidgetState> {
    private wrapperRef = React.createRef<HTMLDivElement>();
    private resizeObserver: ResizeObserver | null = null;
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
                        {
                            name: 'stickyHeader',
                            type: 'checkbox',
                            default: false,
                            label: 'sticky_header',
                        },
                        {
                            name: 'defaultSortColumn',
                            type: 'text',
                            label: 'default_sort_column',
                            tooltip: 'tooltip_default_sort_column',
                        },
                        {
                            name: 'defaultSortOrder',
                            type: 'select',
                            options: [
                                { value: 'asc', label: 'ascending' },
                                { value: 'desc', label: 'descending' },
                            ],
                            default: 'asc',
                            label: 'default_sort_order',
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
                            name: 'columnHidden',
                            type: 'checkbox',
                            default: false,
                            label: 'column_hidden',
                        },
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
                        {
                            name: 'sortable',
                            type: 'checkbox',
                            default: false,
                            label: 'sortable',
                        },
                        {
                            name: 'columnFilterable',
                            type: 'checkbox',
                            default: false,
                            label: 'column_filterable',
                        },
                    ],
                },
                {
                    name: 'attr_group_row_color_conditions',
                    label: 'attr_group_row_color_conditions',
                    fields: [
                        {
                            name: 'countRowConditions',
                            type: 'number',
                            default: 0,
                            label: 'count_row_color_conditions',
                        },
                    ],
                },
                {
                    name: 'countRowConditions',
                    indexFrom: 1,
                    indexTo: 'countRowConditions',
                    label: 'attr_group_row_color_condition',
                    fields: [
                        {
                            name: 'rowConditionKey',
                            type: 'text',
                            label: 'row_color_condition_key',
                        },
                        {
                            name: 'rowConditionValue',
                            type: 'text',
                            label: 'row_color_condition_value',
                        },
                        {
                            name: 'rowConditionColor',
                            type: 'color',
                            label: 'row_color_condition_color',
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
                width: 400,
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

    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetTable.getWidgetInfo();
    }

    componentDidMount(): void {
        super.componentDidMount?.();

        if (this.state.rxData.defaultSortColumn && !this.state.orderBy) {
            this.setState({
                orderBy: this.state.rxData.defaultSortColumn,
                order: this.state.rxData.defaultSortOrder || 'asc',
            });
        }

        // Measure parent (VIS widget) height
        const parent = this.wrapperRef.current?.parentElement;
        if (parent) {
            this.setState({ parentHeight: parent.clientHeight });
            this.resizeObserver = new ResizeObserver(entries => {
                for (const entry of entries) {
                    this.setState({ parentHeight: entry.contentRect.height });
                }
            });
            this.resizeObserver.observe(parent);
        }
    }

    componentWillUnmount(): void {
        this.resizeObserver?.disconnect();
    }

    componentDidUpdate(prevProps: VisRxWidgetProps, prevState: TableWidgetState & { rxData: TableRxData }): void {
        super.componentDidUpdate?.(prevProps, prevState);

        // Check if default sort settings have changed
        if (
            this.state.rxData.defaultSortColumn !== prevState.rxData.defaultSortColumn ||
            this.state.rxData.defaultSortOrder !== prevState.rxData.defaultSortOrder
        ) {
            // Update sorting when default settings change
            if (this.state.rxData.defaultSortColumn) {
                this.setState({
                    orderBy: this.state.rxData.defaultSortColumn,
                    order: this.state.rxData.defaultSortOrder || 'asc',
                });
            } else {
                // Clear sorting if default column is removed
                this.setState({
                    orderBy: null,
                    order: 'asc',
                });
            }
        }
    }

    handleRequestSort = (columnKey: string): void => {
        const isAsc = this.state.orderBy === columnKey && this.state.order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: columnKey,
        });
    };

    sortData = (data: Record<string, any>[], orderBy: string | null, order: 'asc' | 'desc'): Record<string, any>[] => {
        if (!orderBy) {
            return data;
        }
        return [...data].sort((a, b) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];
            if (aValue == null && bValue == null) {
                return 0;
            }
            if (aValue == null) {
                return order === 'asc' ? 1 : -1;
            }
            if (bValue == null) {
                return order === 'asc' ? -1 : 1;
            }
            let comparison;
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                comparison = aValue.localeCompare(bValue);
            } else {
                comparison = String(aValue).localeCompare(String(bValue));
            }
            return order === 'asc' ? comparison : -comparison;
        });
    };

    getRowColor = (row: Record<string, any>): string | undefined => {
        const count = this.state.rxData.countRowConditions ?? 0;
        for (let i = 1; i <= count; i++) {
            const keyOrIndex = this.state.rxData[`rowConditionKey${i}`];
            const condValue = this.state.rxData[`rowConditionValue${i}`];
            const color = this.state.rxData[`rowConditionColor${i}`];
            if (!color || keyOrIndex === undefined || keyOrIndex === '') {
                continue;
            }
            const asNumber = Number(keyOrIndex);
            const resolvedKey = !isNaN(asNumber) && keyOrIndex.trim() !== '' ? Object.keys(row)[asNumber] : keyOrIndex;
            if (resolvedKey !== undefined && String(row[resolvedKey]) === String(condValue)) {
                return color;
            }
        }
        return undefined;
    };

    openFilterMenu = (
        event: React.MouseEvent<HTMLElement>,
        columnKey: string,
        allData: Record<string, any>[],
    ): void => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const uniqueValues = Array.from(new Set(allData.map(row => String(row[columnKey] ?? '')))).sort();
        const currentFilter = this.state.filters?.[columnKey] ?? uniqueValues;
        this.setState({
            filterAnchorEl: event.currentTarget,
            filterButtonRect: rect,
            filterColumn: columnKey,
            filterColumnAllValues: uniqueValues,
            filterColumnPendingValues: currentFilter,
        });
    };

    closeFilterMenu = (): void => {
        this.setState({ filterAnchorEl: null, filterButtonRect: null, filterColumn: null });
    };

    applyFilter = (): void => {
        const { filterColumn, filterColumnPendingValues, filterColumnAllValues } = this.state;
        if (!filterColumn) {
            return;
        }
        const filters = { ...(this.state.filters ?? {}) };
        // If all values selected, remove filter (= no filter)
        if (filterColumnPendingValues.length === filterColumnAllValues.length) {
            delete filters[filterColumn];
        } else {
            filters[filterColumn] = filterColumnPendingValues;
        }
        this.setState({ filters, filterAnchorEl: null, filterColumn: null });
    };

    togglePendingValue = (value: string): void => {
        const current = this.state.filterColumnPendingValues;
        const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
        this.setState({ filterColumnPendingValues: next });
    };

    applyDataFilters = (data: Record<string, any>[]): Record<string, any>[] => {
        const filters = this.state.filters;
        if (!filters || Object.keys(filters).length === 0) {
            return data;
        }
        return data.filter(row =>
            Object.entries(filters).every(([key, allowed]) => allowed.includes(String(row[key] ?? ''))),
        );
    };

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

        const unfilteredJson = json!;

        // Sort the data if orderBy is set
        if (json && this.state.orderBy) {
            json = this.sortData(json, this.state.orderBy, this.state.order || 'asc');
        }

        // Apply column filters
        if (json) {
            json = this.applyDataFilters(json);
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

        const renderFilterButton = (colKey: string): React.JSX.Element => {
            const isActive = !!this.state.filters?.[colKey];
            return (
                <IconButton
                    size="small"
                    onClick={e => {
                        e.stopPropagation();
                        this.openFilterMenu(e, colKey, unfilteredJson);
                    }}
                    sx={{ padding: '2px', color: isActive ? 'primary.main' : 'inherit', opacity: isActive ? 1 : 0.4 }}
                >
                    <FilterListIcon fontSize="small" />
                </IconButton>
            );
        };

        if ((json && json.length > 0) || unfilteredJson.length > 0) {
            const sourceJson = unfilteredJson.length > 0 ? unfilteredJson : json!;
            const countColumns = this.state.rxData.countColumns;
            if (countColumns === 0) {
                Object.keys(sourceJson[0]).forEach((h, index) => {
                    headers.push(
                        <StyledTableHeaderCell key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TableSortLabel
                                    active={this.state.orderBy === h}
                                    direction={this.state.orderBy === h ? this.state.order : 'asc'}
                                    onClick={() => this.handleRequestSort(h)}
                                >
                                    {h}
                                </TableSortLabel>
                            </Box>
                        </StyledTableHeaderCell>,
                    );
                });
            } else {
                for (let i = 1; i <= this.state.rxData.countColumns; i++) {
                    if (this.state.rxData[`columnHidden${i}`]) {
                        continue;
                    }

                    let columnTitle = this.state.rxData[`columnTitle${i}`];

                    if (columnTitle === null) {
                        columnTitle = Object.keys(sourceJson[0])[i - 1];
                    }

                    let columnKey = this.state.rxData[`columnKey${i}`];
                    if (!columnKey) {
                        columnKey = Object.keys(sourceJson[0])[i - 1];
                    }

                    const isSortable = this.state.rxData[`sortable${i}`];

                    const styles: SxProps = {
                        textAlign: this.state.rxData[`columnTitleAlign${i}`],
                    };
                    if (this.state.rxData[`columnWidth${i}`]) {
                        styles.width = this.valWithUnit(this.state.rxData[`columnWidth${i}`]);
                        styles.overflow = 'hidden';
                    }

                    headers.push(
                        <StyledTableHeaderCell
                            key={i}
                            sx={styles}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: this.state.rxData[`columnTitleAlign${i}`] ?? 'left',
                                }}
                            >
                                {isSortable ? (
                                    <TableSortLabel
                                        active={this.state.orderBy === String(columnKey)}
                                        direction={this.state.orderBy === String(columnKey) ? this.state.order : 'asc'}
                                        onClick={() => this.handleRequestSort(String(columnKey))}
                                    >
                                        {columnTitle}
                                    </TableSortLabel>
                                ) : (
                                    <span>{columnTitle}</span>
                                )}
                                {this.state.rxData[`columnFilterable${i}`]
                                    ? renderFilterButton(String(columnKey))
                                    : null}
                            </Box>
                        </StyledTableHeaderCell>,
                    );
                }
            }

            let maxRows = this.state.rxData.maxRows;
            if (maxRows <= 0) {
                maxRows = json!.length;
            } else {
                maxRows = Math.min(maxRows, json!.length);
            }

            for (let index = 0; index < maxRows; index++) {
                const r = json![index];
                const columns = [];
                const rowColor = this.getRowColor(r);

                if (countColumns === 0) {
                    Object.values(r).forEach((v, indexCol: number) => {
                        if (typeof v === 'object' && v !== null) {
                            v = JSON.stringify(v);
                        }
                        v = <span dangerouslySetInnerHTML={{ __html: v as string }}></span>;
                        columns.push(<StyledTableCell key={`${index}_${indexCol}`}>{v}</StyledTableCell>);
                    });
                } else {
                    for (let i = 1; i <= this.state.rxData.countColumns; i++) {
                        if (this.state.rxData[`columnHidden${i}`]) {
                            continue;
                        }

                        let columnKey = this.state.rxData[`columnKey${i}`];
                        const columnPrefix = this.state.rxData[`columnPrefix${i}`];
                        const columnSuffix = this.state.rxData[`columnSuffix${i}`];
                        const columnPlaceholder = this.state.rxData[`columnPlaceholder${i}`];
                        const columnFormat = this.state.rxData[`columnValueFormat${i}`];
                        if (!columnKey) {
                            columnKey = Object.keys(sourceJson[0])[i - 1];
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
                                    style={{ width: columnWidth }}
                                    alt={columnValue}
                                />
                            );
                        } else {
                            if (typeof columnValue === 'object' && columnValue !== null) {
                                columnValue = JSON.stringify(columnValue);
                            }
                            columnValue = <span dangerouslySetInnerHTML={{ __html: columnValue as string }}></span>;
                        }

                        const styles: SxProps = {
                            textAlign: this.state.rxData[`columnContentAlign${i}`],
                        };
                        if (this.state.rxData[`columnWidth${i}`]) {
                            styles.width = this.valWithUnit(this.state.rxData[`columnWidth${i}`]);
                            styles.overflow = 'hidden';
                        }

                        columns.push(
                            <StyledTableCell
                                key={`${index}_${i}`}
                                sx={styles}
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
                        sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            ...(rowColor ? { backgroundColor: `${rowColor} !important` } : {}),
                        }}
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

        const { filterAnchorEl, filterButtonRect, filterColumn, filterColumnAllValues, filterColumnPendingValues } =
            this.state;
        const allSelected = filterColumnPendingValues?.length === filterColumnAllValues?.length;
        const stickyHeader = this.state.rxData.stickyHeader;
        const parentHeight = this.state.parentHeight;

        // Calculate filter box position from stored rect (works even inside CSS-transformed containers)
        const FILTER_WIDTH = 220;
        const FILTER_MAX_HEIGHT = 350;

        // Position filter box relative to the outer wrapper div
        const wrapperRect = this.wrapperRef.current?.getBoundingClientRect();
        let filterLeft = filterButtonRect && wrapperRect ? filterButtonRect.left - wrapperRect.left : 0;
        const filterTop = filterButtonRect && wrapperRect ? filterButtonRect.bottom - wrapperRect.top : 0;
        if (filterButtonRect && wrapperRect && filterLeft + FILTER_WIDTH > wrapperRect.width) {
            filterLeft = Math.max(0, filterLeft + filterButtonRect.width - FILTER_WIDTH);
        }

        const filterBox =
            filterAnchorEl && filterButtonRect ? (
                <ClickAwayListener onClickAway={this.closeFilterMenu}>
                    <Paper
                        elevation={8}
                        style={{
                            position: 'absolute',
                            top: filterTop,
                            left: filterLeft,
                            zIndex: 9999,
                            width: FILTER_WIDTH,
                            maxHeight: FILTER_MAX_HEIGHT,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <Typography
                                variant="caption"
                                sx={{ px: 1, fontWeight: 'bold' }}
                            >
                                {filterColumn}
                            </Typography>
                            <Divider sx={{ my: 0.5 }} />
                            <Box sx={{ display: 'flex', gap: 0.5, px: 1, pb: 0.5 }}>
                                <Button
                                    size="small"
                                    color="inherit"
                                    onClick={() =>
                                        this.setState({
                                            filterColumnPendingValues: filterColumnAllValues ?? [],
                                        })
                                    }
                                >
                                    Alle
                                </Button>
                                <Button
                                    size="small"
                                    color="inherit"
                                    onClick={() => this.setState({ filterColumnPendingValues: [] })}
                                >
                                    Keine
                                </Button>
                            </Box>
                            <Divider sx={{ mb: 0.5 }} />
                            <List
                                dense
                                disablePadding
                                sx={{ overflowY: 'auto', flex: 1 }}
                            >
                                <ListItem
                                    dense
                                    disablePadding
                                    sx={{ pl: 0.5 }}
                                >
                                    <Checkbox
                                        size="small"
                                        color="default"
                                        checked={allSelected}
                                        indeterminate={!allSelected && (filterColumnPendingValues?.length ?? 0) > 0}
                                        onChange={() =>
                                            this.setState({
                                                filterColumnPendingValues: allSelected
                                                    ? []
                                                    : (filterColumnAllValues ?? []),
                                            })
                                        }
                                    />
                                    <ListItemText primary={<em>Alle auswählen</em>} />
                                </ListItem>
                                <Divider />
                                {(filterColumnAllValues ?? []).map(val => (
                                    <ListItem
                                        key={val}
                                        dense
                                        disablePadding
                                        sx={{ pl: 0.5 }}
                                    >
                                        <Checkbox
                                            size="small"
                                            color="default"
                                            checked={filterColumnPendingValues?.includes(val) ?? false}
                                            onChange={() => this.togglePendingValue(val)}
                                        />
                                        <ListItemText primary={val === '' ? <em>(leer)</em> : val} />
                                    </ListItem>
                                ))}
                            </List>
                            <Divider sx={{ mt: 0.5 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
                                <Button
                                    size="small"
                                    onClick={this.closeFilterMenu}
                                    color="inherit"
                                >
                                    Abbrechen
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="inherit"
                                    onClick={this.applyFilter}
                                >
                                    OK
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </ClickAwayListener>
            ) : null;

        return (
            <div style={{ position: 'relative', height: '100%' }}>
                <div
                    ref={this.wrapperRef}
                    style={{
                        boxShadow: `${shadow}`,
                        overflow: 'auto',
                        height: 'fit-content',
                        maxHeight: '100%',
                        width: 'fit-content',
                        minWidth: '100%',
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
                            height: 'auto',
                            maxHeight: stickyHeader && parentHeight ? `${parentHeight}px` : 'none',
                            background: 'transparent',
                            borderRadius: 0,
                        }}
                    >
                        <Table
                            stickyHeader={stickyHeader}
                            sx={{ tableLayout: 'fixed' }}
                        >
                            {this.state.rxData.showHead && (
                                <TableHead>
                                    <StyledTableHeaderRow>{headers}</StyledTableHeaderRow>
                                </TableHead>
                            )}
                            <TableBody>{rows}</TableBody>
                        </Table>
                    </TableContainer>
                </div>
                {filterBox}
            </div>
        );
    }
}
