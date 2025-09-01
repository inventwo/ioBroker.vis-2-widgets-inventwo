import react from '@vitejs/plugin-react';
import commonjs from 'vite-plugin-commonjs';
import vitetsConfigPaths from 'vite-tsconfig-paths';
import { federation } from '@module-federation/vite';
import { moduleFederationShared } from '@iobroker/types-vis-2/modulefederation.vis.config';
import { readFileSync } from 'node:fs';
const pack = JSON.parse(readFileSync('./package.json').toString());

const config = {
    plugins: [
        federation({
            manifest: true,
            name: 'vis2Inventwo',
            filename: 'customWidgets.js',
            exposes: {
                './index': './src/index',
                './InventwoWidgetUniversal': './src/InventwoWidgetUniversal',
                './InventwoWidgetSlider': './src/InventwoWidgetSlider',
                './InventwoWidgetSwitch': './src/InventwoWidgetSwitch',
                './InventwoWidgetCheckbox': './src/InventwoWidgetCheckbox',
                './InventwoWidgetTable': './src/InventwoWidgetTable',
                './translations': './src/translations',
            },
            remotes: {},
            shared: moduleFederationShared(pack),
        }),
        react(),
        vitetsConfigPaths(),
        commonjs(),
    ],
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
            output: {
                banner: `
                    (function() {
    if(!window.inventwoDebugLog) {
        window.inventwoDebugLog = true;
        const orig = {
            log:   console.log,
            warn:  console.warn,
            error: console.error,
            debug: console.debug
        };
        window.mylog = []
        let isWriting = false;

        function appendLog(type, args, location) {
            // Zeile bauen
            const msg = Array.from(args).map(a => {
                // Objekt? Dann JSON serialisieren.
                if (typeof a === 'object' && a !== null) {
                    try {
                        return JSON.stringify(a);
                    } catch { return '[object]'; }
                }
                return String(a);
            }).join(' ');
            mylog.push({type, msg, location})
        }

        // Funktionen überschreiben
        ['log', 'warn', 'error', 'debug'].forEach(function(type) {
            console[type] = function(...args) {
                // Stacktrace direkt hier holen, damit die Aufruferstelle korrekt ist
                let location = '';
                try {
                    const stack = new Error().stack;
                    if (stack) {
                        const lines = stack.split('\\n');
                        // Die dritte Zeile ist die Aufruferstelle außerhalb dieser Funktion
                        const relevant = lines[2] || lines[1];
                        if (relevant) {
                            location = relevant.trim();
                        }
                    }
                } catch {}
                appendLog(type, args, location);
                orig[type].apply(console, args);
            };
        });

        setInterval(function () {
            const $log = $('.mylog');
            if(!$log || isWriting) return;
            isWriting = true;

            const lines = mylog.splice(0, mylog.length);
            lines.forEach((line) => {
                $log.append($('<div>').addClass(line.type).text('[' + line.type + '] ' + line.msg + (line.location ? ' @ ' + line.location : '')));
            });
            if (lines.length) {
                $log.scrollTop($log[0].scrollHeight);
            }
            isWriting = false;
        }, 1000)
    }

})();
                `
            }
        },
    },
};

export default config;