const { existsSync } = require('node:fs');
const adapterName = require('./package.json').name.replace('iobroker.', '');
const { deleteFoldersRecursive, copyFiles, npmInstall, buildReact } = require('@iobroker/build-tools');

const SRC_TS = 'src-widgets/';
const src_ts = `${__dirname}/${SRC_TS}`;
// Custom components of the adapter settings (admin/jsonConfig.json)
const SRC_ADMIN = 'src-admin/';
const src_admin = `${__dirname}/${SRC_ADMIN}`;

function tsClean() {
    deleteFoldersRecursive(`${src_ts}build`);
    deleteFoldersRecursive(`${src_admin}build`);
    deleteFoldersRecursive(`${__dirname}/widgets`);
    deleteFoldersRecursive(`${__dirname}/admin/custom`);
}

function tsCopyAllFiles() {
    copyFiles([`${SRC_TS}build/customWidgets.js`], `widgets/${adapterName}`);
    copyFiles([`${SRC_TS}build/assets/*.*`], `widgets/${adapterName}/assets`);
    copyFiles([`${SRC_TS}build/img/*`], `widgets/${adapterName}/img`);
}

function adminCopyAllFiles() {
    copyFiles([`${SRC_ADMIN}build/customComponents.js`], 'admin/custom');
    // The admin reads this manifest to see which component library the build was made against
    copyFiles([`${SRC_ADMIN}build/mf-manifest.json`], 'admin/custom');
    copyFiles([`${SRC_ADMIN}build/assets/*.*`], 'admin/custom/assets');
    // Loaded by the admin, because the custom item has `i18n: true`
    copyFiles([`${SRC_ADMIN}src/i18n/*.json`], 'admin/custom/i18n');
}

tsClean();
let npmPromise;
if (existsSync(`${src_ts}/node_modules`)) {
    npmPromise = Promise.resolve();
} else {
    npmPromise = npmInstall(src_ts);
}
npmPromise
    .then(() => buildReact(src_ts, { rootDir: __dirname, vite: true }))
    .then(() => tsCopyAllFiles())
    .then(() => (existsSync(`${src_admin}node_modules`) ? Promise.resolve() : npmInstall(src_admin)))
    .then(() => buildReact(src_admin, { rootDir: __dirname, vite: true }))
    .then(() => adminCopyAllFiles())
    .catch(e => console.error(`Cannot build: ${e}`));
