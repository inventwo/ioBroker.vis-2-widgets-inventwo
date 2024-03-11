import React from 'react';

import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';
import iro from '@jaames/iro';
import {Card, CardContent} from "@mui/material";
class InventwoWidgetColorPicker extends (window.visRxWidget || VisRxWidget) {
    constructor(props) {
        super(props);
        this.state.colorPicker = null;
    }

    static getWidgetInfo() {
        return {
            id: 'tplInventwoWidgetColorPicker',
            visSet: 'vis2inventwo',
            visWidgetLabel: 'vis_2_widgets_inventwo_widget_color_picker',
            visName: 'vis_2_widgets_inventwo_widget_color_picker',
            visAttrs: [
                {
                    name: 'common',
                    fields: [
                        {
                            name: 'oid',
                            type: 'id',
                            label: 'oid',
                        },
                    ],
                },

                {
                    name: 'vis_2_widgets_inventwo_attr_group_css',
                    label: 'vis_2_widgets_inventwo_attr_group_css',
                    fields: [

                    ],
                },
            ],
            visDefaultStyle: {
                width: 360,
                heigth: 400,
                overflow: 'hidden',
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
    }

    componentDidMount() {
        super.componentDidMount();

        // Update data
        this.propertiesUpdate();

        const el = document.querySelector(`#${this.props.id} .vis-inventwo-widget-color-picker-wrapper`);
        this.state.colorPicker = new iro.ColorPicker(el, {
            width: 320,
            color: '#ffff00',
        });
    }

    // Do not delete this method. It is used by vis to read the widget configuration.
    // eslint-disable-next-line class-methods-use-this
    getWidgetInfo() {
        return InventwoWidgetColorPicker.getWidgetInfo();
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

    renderWidgetBody(props) {
        super.renderWidgetBody(props);

        return <Card

        >
            <CardContent

            >
                <div className="vis-inventwo-widget-color-picker-wrapper">
                    {/*<div id={this.props.id}></div>*/}
                </div>
            </CardContent>
        </Card>;
    }
}

export default InventwoWidgetColorPicker;
