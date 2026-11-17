/**
 * Shared "color zones" attribute groups: a number of zones, each with a start value and a color.
 * Mode "active": the zone with the highest start value that is not above the current value
 * colors the whole active part (`InventwoGeneric.getColorZoneColor()`).
 * Mode "segments": every zone colors only its own section of the active part, with a hard cut
 * or a smooth transition between the zones (`InventwoGeneric.getColorZoneStops()`).
 * Mode "track": like "segments", but the zones are always shown along the whole track (scale).
 *
 * @param extraFields  Additional widget specific fields shown below the zone count
 */
export function createColorZoneGroups(extraFields: Record<string, unknown>[] = []): any[] {
    return [
        {
            name: 'attr_group_color_zones',
            label: 'attr_group_color_zones',
            fields: [
                {
                    name: '',
                    type: 'help',
                    text: 'vis_2_widgets_inventwo_color_zones_help',
                },
                {
                    name: 'colorZoneCount',
                    type: 'number',
                    min: 0,
                    default: 0,
                    label: 'color_zone_count',
                },
                {
                    name: 'colorZoneMode',
                    type: 'select',
                    options: [
                        { value: 'active', label: 'color_zone_mode_active' },
                        { value: 'segments', label: 'color_zone_mode_segments' },
                        { value: 'track', label: 'color_zone_mode_track' },
                    ],
                    default: 'active',
                    label: 'color_zone_mode',
                    tooltip: 'color_zone_mode_tooltip',
                    hidden: '!data.colorZoneCount',
                },
                {
                    name: 'colorZoneTransition',
                    type: 'select',
                    options: [
                        { value: 'hard', label: 'color_zone_transition_hard' },
                        { value: 'smooth', label: 'color_zone_transition_smooth' },
                    ],
                    default: 'hard',
                    label: 'color_zone_transition',
                    hidden: '!data.colorZoneCount || !data.colorZoneMode || data.colorZoneMode == "active"',
                },
                ...extraFields,
            ],
        },
        {
            name: 'colorZoneCount',
            indexFrom: 1,
            indexTo: 'colorZoneCount',
            label: 'attr_group_color_zone',
            fields: [
                {
                    name: 'colorZoneFrom',
                    type: 'number',
                    label: 'color_zone_from',
                    tooltip: 'color_zone_from_tooltip',
                },
                {
                    name: 'colorZoneColor',
                    type: 'color',
                    label: 'color',
                },
            ],
        },
    ];
}
