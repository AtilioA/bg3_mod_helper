const vscode = require('vscode');
const fs = require('fs');
const os = require('os');

const { Worker, isMainThread, parentPort } = require('worker_threads');
const path = require('path');
const { getConfig } = require('../support_files/config');

const { CREATE_LOGGER, raiseError, raiseInfo } = require('../support_files/log_utils.js');
const bg3mh_logger = CREATE_LOGGER();

const { FIND_FILES_v2, getFormats } = require('../support_files/lslib_utils.js');

const debug2 = vscode.commands.registerCommand('bg3-mod-helper.debug2Command', async function () {
    const config = getConfig();
    const localizationPath = path.join(config.rootModPath, 'Localization');
    let halfCoreCount = os.availableParallelism() / 2;

    raiseInfo(`half of your cpu's cores: ${halfCoreCount}`);

    try {
        console.log(FIND_FILES_v2(".lsx"));
    }
    catch (err) {
        console.error(err);
    }


    // after you are through with this command, the following line must be uncommented and the only thing left for this file to be considered cleaned up.
    // raiseInfo("hi dipshit :)");


});

module.exports = debug2;
