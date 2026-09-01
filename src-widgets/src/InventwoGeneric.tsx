import type { VisRxWidgetProps, VisRxWidgetState } from '@iobroker/types-vis-2';
import type VisRxWidget from '@iobroker/types-vis-2/visRxWidget';
import type React from 'react';

export default class InventwoGeneric<
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

    validFieldValue(value: any): boolean {
        return value !== undefined && value !== null && value !== '';
    }

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

    isInteractionAllowed(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): boolean {
        if (this.props.editMode) {
            return false;
        }
        // @ts-expect-error
        if (e && e.target?.closest('.IroColorPicker') !== null) {
            return false;
        }

        // @ts-expect-error
        const closestElementCheck = e?.target?.closest(`.inventwo-view-in-widget-wrapper, .vis-widget`);
        if (closestElementCheck) {
            if (closestElementCheck.classList.contains('inventwo-view-in-widget-wrapper')) {
                return false;
            }
        }

        return this.state.rxData.type !== 'readonly';
    }

    validOid(oid: string | null | undefined): boolean {
        return oid !== undefined && oid !== null && oid !== 'nothing_selected' && oid !== '';
    }

    valWithUnit(value: any): string {
        return value + (!Number.isNaN(Number(value)) ? 'px' : '');
    }

    formatDate(value: any, format: string): string {
        if (!format) {
            return String(value);
        }

        const d = new Date(value);
        if (Number.isNaN(d.getTime())) {
            return String(value);
        }

        const pad = (n: number, len = 2): string => String(n).padStart(len, '0');

        const isoWeek = (date: Date): number => {
            const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            // Thursday of the current week decides the week's year (ISO-8601).
            target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
            const firstThursday = new Date(target.getFullYear(), 0, 4);
            firstThursday.setDate(firstThursday.getDate() + 3 - ((firstThursday.getDay() + 6) % 7));
            return 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
        };

        const locale = navigator.language;

        const map: Record<string, () => string> = {
            YYYY: () => String(d.getFullYear()),
            YY: () => String(d.getFullYear()).slice(-2),
            MM: () => pad(d.getMonth() + 1),
            M: () => String(d.getMonth() + 1),
            DD: () => pad(d.getDate()),
            D: () => String(d.getDate()),
            hh: () => pad(d.getHours()),
            h: () => String(d.getHours()),
            mm: () => pad(d.getMinutes()),
            m: () => String(d.getMinutes()),
            sss: () => pad(d.getMilliseconds(), 3),
            ss: () => pad(d.getSeconds()),
            s: () => String(d.getSeconds()),
            WDL: () => d.toLocaleDateString(locale, { weekday: 'long' }),
            WD: () => d.toLocaleDateString(locale, { weekday: 'short' }),
            KW: () => pad(isoWeek(d)),
            K: () => String(isoWeek(d)),
        };

        return format.replace(/YYYY|YY|MM|M|DD|D|hh|h|mm|m|sss|ss|s|WDL|WD|KW|K/g, match => map[match]());
    }
}
