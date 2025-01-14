const path = require('path');
const vscode = require('vscode');
const fs = require('fs');

const { LSLIB, getFormats, moveFileAcrossDevices, compatRootModPath } = require('./lslib_utils');
const { pak } = getFormats();

const { CREATE_LOGGER, raiseError, raiseInfo } = require('./log_utils');
var bg3mh_logger = CREATE_LOGGER();

const { getConfig } = require('./config.js');
const { rootModPath, modName, modDestPath } = getConfig();
const rootParentPath = path.dirname(rootModPath);

const temp_folder = "\\temp_folder";
const temp_path = path.join(rootParentPath, temp_folder);
const modFinalDestPath = path.join(modDestPath, modName + pak);
const modTempDestPath = path.join(temp_path, modName + pak);


function prepareTempDir(movedPak = false) {
    if (!(fs.existsSync(temp_path))) {
        console.log("making temp_path");
        fs.mkdirSync(temp_path, { recursive: true});
        return;
    }
    // this is being finicky :starege:
    /*
    else if (movedPak) {
        console.log("deleting temp_path %s", modTempDestPath);
        console.log(fs.existsSync(modTempDestPath))
        fs.unlinkSync(modTempDestPath);
        fs.rmSync(temp_path, { recursive: true, force: true });
  
        return;
    }
    */
}


// btw, sometimes this will log things before others because it's async.
async function processPak(modPath) {
    var build = new LSLIB.PackageBuildData();
    var Packager = new LSLIB.Packager();

    try {
        await Packager.CreatePackage(modTempDestPath, modPath, build);

        raiseInfo(modName + pak + " packed", false);
        vscode.window.showInformationMessage(`${modName + pak} packed`);

        // move files to chosen path and [in progress] clean up the empty directory
        moveFileAcrossDevices(modTempDestPath, modFinalDestPath);
        prepareTempDir(true);
    }
    catch (Error) {
        raiseError(Error);
    }
}


module.exports = { processPak, prepareTempDir };