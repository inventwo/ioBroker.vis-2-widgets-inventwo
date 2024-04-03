import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

class InventwoWidgetTable extends (window.visRxWidget || VisRxWidget) {
    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetTable',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'vis_2_widgets_inventwo_widget_table',
            visName: 'vis_2_widgets_inventwo_widget_table',
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
                            default: 1,
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
                    label: 'vis_2_widgets_inventwo_attr_group_columns',
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
                    ],
                },
            ],
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
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return InventwoWidgetTable.getWidgetInfo();
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

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        this.wrappedContent = true;

        const oid = this.state.rxData.oid;
        const value = this.getValue(oid);

        let json = null;

        if (value === undefined || value === null || value === '') {
            return <div>Keine Daten</div>;
        }
        try {
            json = JSON.parse(value);
        } catch (e) {
            return <div>Invalides JSON</div>;
        }

        const headers = [];
        const rows = [];

        if (json.length > 0) {
            const countColumns = this.state.rxData.countColumns;
            if (countColumns === 0) {
                Object.keys(json[0]).forEach((h, index) => {
                    headers.push(<TableCell key={index}>
                        {h}
                    </TableCell>);
                });
            } else {
                for (let i = 1; i <= this.state.rxData.countColumns; i++) {
                    let columnTitle = this.state.rxData[`columnTitle${i}`];

                    if (columnTitle === null) {
                        columnTitle = Object.keys(json[0])[i - 1];
                    }
                    headers.push(<TableCell
                        key={i}
                        style={{
                            width: `${this.state.rxData[`columnWidth${i}`]}px`,
                            textAlign: this.state.rxData[`columnTitleAlign${i}`],
                        }}
                    >
                        {columnTitle}
                    </TableCell>);
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
                    Object.values(r).forEach((v, indexCol) => {
                        columns.push(<TableCell key={`${index}_${indexCol}`}>{v}</TableCell>);
                    });
                } else {
                    for (let i = 1; i <= this.state.rxData.countColumns; i++) {
                        let columnKey = this.state.rxData[`columnKey${i}`];
                        const columnPrefix = this.state.rxData[`columnPrefix${i}`];
                        const columnSuffix = this.state.rxData[`columnSuffix${i}`];
                        if (columnKey === null) {
                            columnKey = Object.keys(json[0])[i - 1];
                        }
                        columns.push(<TableCell
                            key={`${index}_${i}`}
                            style={{
                                textAlign: this.state.rxData[`columnContentAlign${i}`],
                            }}
                        >
                            {columnPrefix}
                            {r[columnKey]}
                            {columnSuffix}
                        </TableCell>);
                    }
                }

                rows.push(<TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    {columns}
                </TableRow>);
            }
        }

        return <TableContainer component={Paper} style={{ height: '100%' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {this.state.rxData.showHead ? headers : null}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>;
    }
}

export default InventwoWidgetTable;
