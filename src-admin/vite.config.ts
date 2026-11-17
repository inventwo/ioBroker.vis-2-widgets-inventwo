import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/gui-components/modulefederation.admin.config';
import { readFileSync } from 'node:fs';

// Build of the custom components for the adapter settings (admin/jsonConfig.json, `type: 'custom'`).
// Structure and build follow https://github.com/ioBroker/ioBroker.admin-component-template
const config = {
    plugins: [
        federation({
            manifest: true,
            // Must be unique per component set and match the first segment of `name` in
            // `admin/jsonConfig.json` - two components sharing this name collide at runtime.
            name: 'AdminComponentInventwoSet',
            filename: 'customComponents.js',
            exposes: {
                './Components': './src/Components.tsx',
            },
            remotes: {},
            shared: moduleFederationShared(JSON.parse(readFileSync('./package.json').toString())),
        }),
        react(),
        commonjs(),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        port: 3000,
    },
    base: './',
    build: {
        target: 'chrome89',
        outDir: './build',
    },
};

export default config;
