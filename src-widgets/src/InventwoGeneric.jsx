import { VisRxWidget } from '@iobroker/vis-2-widgets-react-dev';

class InventwoGeneric extends (window.visRxWidget || VisRxWidget) {
    static getI18nPrefix() {
        return 'vis_2_widgets_inventwo_';
    }

    constructor(props) {
        super(props);

        this.groupAttrs = [];
        const info = this.getWidgetInfo();
        info.visAttrs.forEach(group => {
            group.fields.forEach(field => {
                if (field.name === undefined) return;
                if (!field.name.endsWith('FromWidget')) {
                    if (this.groupAttrs[group.name] === undefined) {
                        this.groupAttrs[group.name] = [];
                    }
                    this.groupAttrs[group.name].push(field.name);
                }
            });
        });
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

    // eslint-disable-next-line class-methods-use-this
    convertValue(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(value)) return parseFloat(value);
        return value;
    }

    // eslint-disable-next-line class-methods-use-this
    validFieldValue(value) {
        return value !== undefined && value !== null && value !== '';
    }

    // eslint-disable-next-line class-methods-use-this
    convertRgbToHex(colorStr) {
        if (!colorStr) return null;
        const rgbaValues = colorStr.match(/(\d+),(\d+),(\d+),(\d+)/);
        if (!rgbaValues) {
            return null;
        }
        const [red, green, blue] = rgbaValues.slice(1, 5).map(parseFloat);

        function componentToHex(c) {
            const hex = c.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        }

        return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
    }

    isInteractionAllowed(e = null) {
        if (this.props.editMode) return false;
        if (e && e.target.closest('.IroColorPicker') !== null) return false;

        const closestElementCheck = e.target.closest(`.inventwo-view-in-widget-wrapper, #${this.props.id}`);
        if (closestElementCheck.classList.contains('inventwo-view-in-widget-wrapper')) return false;

        if (this.state.rxData.type === 'readonly') return false;

        return true;
    }

    // eslint-disable-next-line class-methods-use-this
    validOid(oid) {
        return oid !== undefined && oid !== null && oid !== 'nothing_selected' && oid !== '';
    }
}

export default InventwoGeneric;
