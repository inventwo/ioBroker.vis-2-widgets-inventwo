/**
 * Dev helper, called by `npm run start` before the Vite dev server starts.
 *
 * In development the widgets are loaded from the Vite dev server, but the vis-2 editor loads the
 * preview images (`visPrev`) relative to vis-2 from the ioBroker file store
 * (`vis-2/widgets/vis-2-widgets-inventwo/img/`). There the images of the installed adapter version are lying.
 * This script uploads every image from `public/img` that differs from the served one into the file store.
 *
 * Environment variables (optional):
 *   IOBROKER_DIR      ioBroker installation directory (default: two levels above this file)
 *   IOBROKER_VIS_URL  web server of vis-2 (default: http://localhost:8082)
 *
 * If no local ioBroker installation is found, the script does nothing.
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IMG_DIR = path.join(__dirname, 'public', 'img');
const IOBROKER_DIR = process.env.IOBROKER_DIR || path.resolve(__dirname, '..', '..');
const VIS_URL = (process.env.IOBROKER_VIS_URL || 'http://localhost:8082').replace(/\/$/, '');
const TARGET = '/vis-2/widgets/vis-2-widgets-inventwo/img/';
const CLI = path.join(IOBROKER_DIR, 'node_modules', 'iobroker.js-controller', 'iobroker.js');

async function isUpToDate(file) {
    try {
        const res = await fetch(`${VIS_URL}/vis-2/widgets/vis-2-widgets-inventwo/img/${file}?t=${Date.now()}`);
        if (!res.ok) {
            return false;
        }
        const served = Buffer.from(await res.arrayBuffer());
        return served.equals(fs.readFileSync(path.join(IMG_DIR, file)));
    } catch {
        return false;
    }
}

function upload(file) {
    return new Promise(resolve => {
        // The CLI may exit with a non-zero code although the file was stored, so check its output
        execFile(
            process.execPath,
            [CLI, 'file', 'write', path.join(IMG_DIR, file), TARGET + file],
            { cwd: IOBROKER_DIR },
            (error, stdout, stderr) => resolve(/stored as/.test(`${stdout}${stderr}`)),
        );
    });
}

async function main() {
    if (!fs.existsSync(CLI)) {
        console.log(`[dev-upload-img] No ioBroker installation found in ${IOBROKER_DIR}, skipping preview images.`);
        return;
    }
    const files = fs.readdirSync(IMG_DIR).filter(f => /\.(png|jpe?g|svg|gif|webp)$/i.test(f));
    const changed = [];
    for (const file of files) {
        if (!(await isUpToDate(file))) {
            changed.push(file);
        }
    }
    if (!changed.length) {
        console.log('[dev-upload-img] Preview images are up to date.');
        return;
    }
    console.log(`[dev-upload-img] Uploading ${changed.length} preview image(s) to ioBroker: ${changed.join(', ')}`);
    const results = await Promise.all(changed.map(upload));
    const failed = changed.filter((_, i) => !results[i]);
    if (failed.length) {
        console.warn(`[dev-upload-img] Upload failed: ${failed.join(', ')}`);
    }
}

main().catch(e => console.warn(`[dev-upload-img] ${e.message}`));
