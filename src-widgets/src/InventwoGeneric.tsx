import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import type { VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type React from 'react';

class InventwoGeneric<
    RxData extends Record<string, any>,
    State extends Partial<VisRxWidgetState> = VisRxWidgetState,
> extends (window.visRxWidget as typeof VisRxWidget)<RxData, State> {
    protected groupAttrs: Record<string, string[]> = {};

    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    constructor(props: VisRxWidgetProps) {
        super(props);

        const info = this.getWidgetInfo();
        info.visAttrs.forEach(group => {
            group.fields.forEach(field => {
                if (field.name === undefined) {
                    return;
                }
                if (!field.name.endsWith('FromWidget')) {
                    if (this.groupAttrs[group.name] === undefined) {
                        this.groupAttrs[group.name] = [];
                    }
                    this.groupAttrs[group.name].push(field.name);
                }
            });
        });
    }

    onChange(_e: any, value: any): void {
        if (this.props.editMode) {
            return;
        }
        const oid = this.state.rxData.oid;
        this.props.context.setValue(oid, parseFloat(value));
    }

    getValue(oid: string | null | undefined): any {
        if (oid !== undefined && oid !== '' && oid !== 'nothing_selected') {
            return this.state.values[`${oid}.val`];
        }
        return undefined;
    }

    getStyle(widgetFieldName: string, attrList: string[], index: number | null = null): Record<string, any> {
        const trackStyle: Record<string, any> = {};
        const wid = this.state.rxData[widgetFieldName];
        const isState = index ?? 0 > 0;
        if (wid) {
            let found = false;
            // first try to find widget in the same view
            const thisView = this.props.context.views[this.props.view];
            const widgetData = thisView?.widgets?.[wid]?.data;
            if (widgetData) {
                // extract palette settings from widget settings
                attrList.forEach(attr => {
                    let attrName = attr;
                    if (isState) {
                        attrName = `${attr}${index}`;
                    }

                    trackStyle[attrName] = widgetData[attrName];
                });
                found = true;
            } else {
                // try to find this widget
                const viewIds = Object.keys(this.props.context.views);
                for (let v = 0; v < viewIds.length; v++) {
                    const view = this.props.context.views[viewIds[v]];
                    if (view.name !== this.props.view && view.widgets?.[wid]?.data) {
                        const widgetData1 = view.widgets[wid].data;
                        // extract palette settings from widget settings
                        attrList.forEach(attr => {
                            let attrName = attr;
                            if (isState) {
                                attrName = `${attr}${index}`;
                            }

                            trackStyle[attrName] = widgetData1[attrName];
                        });
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                attrList.forEach(attr => {
                    let attrName = attr;
                    if (isState) {
                        attrName = `${attr}${index}`;
                    }

                    trackStyle[attrName] = this.state.rxData[attrName];
                });
            }
        } else {
            attrList.forEach(attr => {
                let attrName = attr;
                if (isState) {
                    attrName = `${attr}${index}`;
                }

                trackStyle[attrName] = this.state.rxData[attrName];
            });
        }

        return trackStyle;
    }

    // eslint-disable-next-line class-methods-use-this
    convertValue(value: any, defaultValue: any = null): any {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        if (!isNaN(value)) {
            return parseFloat(value);
        }

        if ((value === undefined || value === null || value === '') && defaultValue !== null) {
            return defaultValue;
        }
        return value;
    }

    // eslint-disable-next-line class-methods-use-this
    validFieldValue(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
    }

    // eslint-disable-next-line class-methods-use-this
    convertRgbToHex(colorStr: string): string | null {
        if (!colorStr) {
            return null;
        }
        const rgbaValues = colorStr.match(/(\d+),(\d+),(\d+),(\d+)/);
        if (!rgbaValues) {
            return null;
        }
        const [red, green, blue] = rgbaValues.slice(1, 5).map(parseFloat);

        function componentToHex(c: number): string {
            const hex = c.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        }

        return `#${componentToHex(red)}${componentToHex(green)}${componentToHex(blue)}`;
    }

    isInteractionAllowed(e: React.MouseEvent<HTMLDivElement>): boolean {
        if (this.props.editMode) {
            return false;
        }
        // @ts-expect-error
        if (e && e.target?.closest('.IroColorPicker') !== null) {
            return false;
        }

        // @ts-expect-error
        const closestElementCheck = e?.target?.closest(`.inventwo-view-in-widget-wrapper, #${this.props.id}`);
        if (closestElementCheck.classList.contains('inventwo-view-in-widget-wrapper')) {
            return false;
        }

        return this.state.rxData.type !== 'readonly';
    }

    // eslint-disable-next-line class-methods-use-this
    validOid(oid: string | null | undefined): boolean {
        return oid !== undefined && oid !== null && oid !== 'nothing_selected' && oid !== '';
    }

    // eslint-disable-next-line class-methods-use-this
    valWithUnit(value: any): string {
        return value + (!Number.isNaN(Number(value)) ? 'px' : '');
    }
}

export default InventwoGeneric;
