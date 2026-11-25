import React from 'react';
import InventwoGeneric from './InventwoGeneric';
import type { CustomPaletteProperties, RxRenderWidgetProps, RxWidgetInfo } from '@iobroker/types-vis-2';
import { PresetPaletteEntry } from './utils/designPresets/PresetGallery';

/**
 * Not a real widget: it only adds the "Design presets" entry to the palette of the vis-2 editor (`customPalette`).
 * vis-2 shows no draggable entry for types with a custom palette, so this widget is never placed on a view.
 */
export default class InventwoWidgetDesignPresets extends InventwoGeneric<Record<string, never>> {
    static getI18nPrefix(): string {
        return 'vis_2_widgets_inventwo_';
    }

    static getWidgetInfo(): RxWidgetInfo {
        return {
            id: 'tplInventwoWidgetDesignPresets',
            visSet: 'vis-2-widgets-inventwo',
            visWidgetLabel: 'widget_design_presets',
            visName: 'widget_design_presets',
            visAttrs: [],
            visDefaultStyle: {
                width: 100,
                height: 40,
            },
            visPrev: 'widgets/vis-2-widgets-inventwo/img/vis-widget-inventwo-universal.png',
            visOrder: 100,
            customPalette: (props: CustomPaletteProperties) => (
                <PresetPaletteEntry
                    key="inventwoDesignPresets"
                    {...props}
                />
            ),
        };
    }

    getWidgetInfo(): RxWidgetInfo {
        return InventwoWidgetDesignPresets.getWidgetInfo();
    }

    renderWidgetBody(props: RxRenderWidgetProps): React.JSX.Element {
        super.renderWidgetBody(props);
        return <div className="vis-widget-body" />;
    }
}
