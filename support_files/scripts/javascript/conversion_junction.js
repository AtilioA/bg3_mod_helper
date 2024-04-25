// what's your function
const path = require('path')
const fs = require('fs');
const vscode = require('vscode');

const { FIND_FILES, getFormats } = require('./lslib_utils');
const { lsx, lsf, lsfx, xml, loca } = getFormats();

const { getConfig } = require('../../config.js');
const { rootModPath } = getConfig();

const { isLoca, processLoca, getLocaOutputPath } = require('./loca_convert');
const { isLsf, processLsf, getLsfOutputPath, to_lsf } = require('./lsf_convert');


function getActiveTabPath() {
    return vscode.window.activeTextEditor.document.fileName;
}


function convert(convertPath = getActiveTabPath(), targetExt = path.extname(convertPath)) {
    if (isLoca(targetExt)) {
        if (fs.lstatSync(convertPath).isDirectory()) {
            var filesToConvert = FIND_FILES(convertPath, targetExt);

            for (var i = 0; i < filesToConvert.length; i++) {
                processLoca(filesToConvert[i], targetExt);
            }
        }
        else if (fs.lstatSync(convertPath).isFile()) {
            processLoca(convertPath, targetExt);
        }
        else {
            console.error("%s is not a recognized directory or loca file.", convertPath);
            return;
        }
    }
    else if (isLsf(targetExt)) {
        if (fs.lstatSync(convertPath).isDirectory()) {
            var filesToConvert = FIND_FILES(convertPath, targetExt);

            for (var i = 0; i < filesToConvert.length; i++) {
                processLsf(filesToConvert[i], targetExt);
            }
        }
        else if (fs.lstatSync(convertPath).isFile()) {
            processLsf(convertPath, targetExt);
        }
        else {
            console.error("%s is not a recognized directory or lsf file.", convertPath);
            return;
        }
    }
}


module.exports = { convert }