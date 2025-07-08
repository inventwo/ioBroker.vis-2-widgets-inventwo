const { existsSync } = require("node:fs");
const adapterName = require("./package.json").name.replace("iobroker.", "");
const {
  deleteFoldersRecursive,
  copyFiles,
  npmInstall,
  buildReact,
} = require("@iobroker/build-tools");

const SRC_JSV = "src-widgets/";
const src_jsv = `${__dirname}/${SRC_JSV}`;

function jsvClean() {
  deleteFoldersRecursive(`${src_jsv}build`);
  deleteFoldersRecursive(`${__dirname}/widgets`);
}

function jsvCopyAllFiles() {
  copyFiles([`${SRC_JSV}build/customWidgets.js`], `widgets/${adapterName}`);
  copyFiles([`${SRC_JSV}build/assets/*.*`], `widgets/${adapterName}/assets`);
  copyFiles([`${SRC_JSV}build/img/*`], `widgets/${adapterName}/img`);
}

if (process.argv.includes("--javascript-vite") || process.argv.length === 2) {
  jsvClean();
  let npmPromise;
  if (existsSync(`${src_jsv}/node_modules`)) {
    npmPromise = Promise.resolve();
  } else {
    npmPromise = npmInstall(src_jsv);
  }
  npmPromise
    .then(() => buildReact(src_jsv, { rootDir: __dirname, vite: true }))
    .then(() => jsvCopyAllFiles())
    .catch((e) => console.error(`Cannot build: ${e}`));
}
