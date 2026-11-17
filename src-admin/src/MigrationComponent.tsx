import React from 'react';

// important to import from the package and not from some children
import { ConfigGeneric, type ConfigGenericProps, type ConfigGenericState } from '@iobroker/json-config';

import Migration from './Migration';

/**
 * Custom component of the adapter settings (admin/jsonConfig.json, `type: 'custom'`).
 * It stores nothing in the adapter configuration: it only hosts the migration page and passes the admin socket to it.
 */
export default class MigrationComponent extends ConfigGeneric<ConfigGenericProps, ConfigGenericState> {
    renderItem(): React.JSX.Element {
        return <Migration socket={this.props.oContext.socket} />;
    }
}
