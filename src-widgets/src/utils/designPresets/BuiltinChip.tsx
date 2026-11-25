import React from 'react';
import { Chip } from '@mui/material';
import { I18n } from '@iobroker/gui-components';

/** Small label that marks a preset shipped with the adapter (dropdown value, preview, gallery card) */
export function BuiltinChip(): React.JSX.Element {
    return (
        <Chip
            label={I18n.t('vis_2_widgets_inventwo_design_preset_builtin')}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ height: 18, fontSize: '0.65rem', flexShrink: 0, '& .MuiChip-label': { px: 0.75 } }}
        />
    );
}
