// @ts-expect-error no types
import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';

const pack = JSON.parse(readFileSync('./package.json').toString());

/**
 * @iobroker/adapter-react-v5 (peer: MUI 6) still imports `Grid2`, which does not exist in MUI 9 anymore (renamed to `Grid`).
 * Only unused components (ObjectBrowser, Tab*) are affected, but the bundler fails on the missing export.
 * Remove as soon as adapter-react-v5 supports MUI 9.
 */
const adapterReactMui9Compat = {
    name: 'adapter-react-v5-mui9-compat',
    enforce: 'pre' as const,
    transform(code: string, id: string): { code: string; map: null } | null {
        if (!id.split('\\').join('/').includes('/@iobroker/adapter-react-v5/') || !code.includes('Grid2')) {
            return null;
        }
        return { code: code.replace(/Grid2/g, 'Grid'), map: null };
    },
};

const config = {
    // vis-2 ships the production build of React 19, whose `react/jsx-dev-runtime` has no `jsxDEV` export.
    // So the dev server must not emit `jsxDEV` calls either.
    oxc: {
        jsx: {
            development: false,
        },
    },
    // The dev server pre-bundles adapter-react-v5, so the patch has to be applied there as well
    optimizeDeps: {
        include: ['@iobroker/adapter-react-v5'],
        rolldownOptions: {
            plugins: [adapterReactMui9Compat],
        },
    },
    plugins: [
        adapterReactMui9Compat,
        federation({
            manifest: true,
            name: 'vis2Inventwo',
            filename: 'customWidgets.js',
            exposes: {
                './InventwoWidgetUniversal': './src/InventwoWidgetUniversal',
                './InventwoWidgetSlider': './src/InventwoWidgetSlider',
                './InventwoWidgetRadialSlider': './src/InventwoWidgetRadialSlider',
                './InventwoWidgetSwitch': './src/InventwoWidgetSwitch',
                './InventwoWidgetCheckbox': './src/InventwoWidgetCheckbox',
                './InventwoWidgetTable': './src/InventwoWidgetTable',
                './InventwoWidgetDropdown': './src/InventwoWidgetDropdown',
                './InventwoWidgetMarquee': './src/InventwoWidgetMarquee',
                './InventwoWidgetValueList': './src/InventwoWidgetValueList',
                './InventwoWidgetCalendar': './src/InventwoWidgetCalendar',
                './InventwoWidgetEventCalendar': './src/InventwoWidgetEventCalendar',
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
        }),
        react(),
        commonjs(),
    ],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        port: 3000,
        proxy: {
            '/_socket': 'http://localhost:8082',
            '/vis.0': 'http://localhost:8082',
            '/adapter': 'http://localhost:8082',
            '/habpanel': 'http://localhost:8082',
            '/vis': 'http://localhost:8082',
            '/widgets': 'http://localhost:8082/vis',
            '/widgets.html': 'http://localhost:8082/vis',
            '/web': 'http://localhost:8082',
            '/state': 'http://localhost:8082',
        },
    },
    base: './',
    build: {
        target: 'chrome89',
        outDir: './build',
        rollupOptions: {
            onwarn(warning: { code: string }, warn: (warning: { code: string }) => void): void {
                // Suppress "Module level directives cause errors when bundled" warnings
                if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
                    return;
                }
                warn(warning);
            },
        },
    },
};

export default config;
