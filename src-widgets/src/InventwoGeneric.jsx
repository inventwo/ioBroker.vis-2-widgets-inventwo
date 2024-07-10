import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

class InventwoGeneric extends (window.visRxWidget || VisRxWidget) {
    static getI18nPrefix() {
        return 'vis_2_widgets_inventwo_';
    }

    onChange(e, value) {
        if (this.props.editMode) {
            return;
        }
        const oid = this.state.rxData.oid;
        this.props.context.setValue(oid, parseFloat(value));
    }

    getValue(oid) {
        if (oid !== undefined && oid !== '' && oid !== 'nothing_selected') {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }

    getStyle(widgetFieldName, attrList) {
        const trackStyle = {};
        const wid = this.state.rxData[widgetFieldName];
        if (wid) {
            let found = false;
            // first try to find widget in the same view
            const thisView = this.props.context.views[this.props.view];
            const widgetData = thisView?.widgets?.[wid]?.data;
            if (widgetData) {
                // extract palette settings from widget settings
                attrList.forEach(attr => trackStyle[attr] = widgetData[attr]);
                found = true;
            } else {
                // try to find this widget
                const viewIds = Object.keys(this.props.context.views);
                for (let v = 0; v < viewIds.length; v++) {
                    const view = this.props.context.views[viewIds[v]];
                    if (view !== this.props.view && view.widgets?.[wid]?.data) {
                        const widgetData1 = view.widgets[wid].data;
                        // extract palette settings from widget settings
                        attrList.forEach(attr => trackStyle[attr] = widgetData1[attr]);
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                attrList.forEach(attr => trackStyle[attr] = this.state.rxData[attr]);
            }
        } else {
            attrList.forEach(attr => trackStyle[attr] = this.state.rxData[attr]);
        }

        return trackStyle;
    }
}

export default InventwoGeneric;
