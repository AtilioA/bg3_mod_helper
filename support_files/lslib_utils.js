/*
    job of this file is to expose LSLib and provide commonly-used functions and vars in conversion
    
    TODO: auto-update LSLib from github 
*/

const fs = require('fs');
const path = require('path');

const dotnet = require('node-api-dotnet/net8.0');

const LSLIB_DLL = 'LSLib.dll';
const TOOL_SUBDIR = 'Tools\\';
const { CREATE_LOGGER } = require('./log_utils.js')
const bg3mh_logger = CREATE_LOGGER();

const { getConfig }  = require('./config.js');
const divinePath = path.normalize(getConfig().divinePath + "\\");
const divineToolsPath = path.normalize(getConfig().divinePath + "\\" + TOOL_SUBDIR);
const BANNED_DLLS = ['ConverterApp.dll'];


// const DLLS = [LSLIB_DLL, LSLIBNATIVE_DLL, ZSTDSHARP_DLL, LZ4_DLL];
var DLLS = [];
var DLL_PATHS = [];


function getFormats() {
    return {
        dll: ".dll",
        loca: ".loca",
        xml: ".xml",
        lsb: ".lsb",
        lsf: ".lsf",
        lsj: ".lsj",
        lsfx: ".lsfx",
        lsbc: ".lsbc",
        lsbs: ".lsbs",
        lsx: ".lsx",
        pak: ".pak"
    }
}


function processDllPaths() {
    for (let i = 0; i < DLL_PATHS.length; i++) {
        var temp_path = path.normalize(DLL_PATHS[i]);
        var temp_name = path.basename(temp_path);

        try {
            if (fs.existsSync(temp_path) && (!BANNED_DLLS.includes(temp_name))) {
                DLLS.push(temp_path);
                bg3mh_logger.debug("%s found at %s", temp_name, temp_path);
            }
        }
        catch {
            console.error("Error!");
            console.error(Error);
        }
    }
}


function loadDlls() {
    for (let i = 0; i < DLLS.length; i++) {
        try {
            dotnet.load(DLLS[i]);
            bg3mh_logger.debug("%s loaded.", DLLS[i]);
        }
        catch {
            console.error("Error!");
            console.error(Error);
        }
    }
}


function LOAD_LSLIB() {
    var tempLSLIB;

    if (fs.existsSync(path.normalize(divinePath + LSLIB_DLL))) {
        DLL_PATHS = FIND_FILES(divinePath, getFormats().dll, false);
    }
    else if (fs.existsSync(path.normalize(divineToolsPath + LSLIB_DLL))) {
        DLL_PATHS = FIND_FILES(divineToolsPath, getFormats().dll, false);
    } 
    else {
        console.error("LSLib.dll not found at " + divinePath + ".");
        tempLSLIB = null;
        return;
    }
        processDllPaths();    
        loadDlls();
        
        // @ts-ignore
        // have to ignore this because the ts-linter doesn't know 'LSLib' exists :starege: 
        tempLSLIB = dotnet.LSLib.LS;

    return tempLSLIB;
}


function FIND_FILES(filesPath, targetExt = getFormats().lsf, isRecursive = true) {
    var filesToConvert = [];
    var filesList = fs.readdirSync(filesPath, {
        withFileTypes: false,
        recursive: isRecursive,
    });

    for (var i = 0; i < filesList.length; i++) {
        var temp = filesList[i].toString();
        if (path.extname(temp) == targetExt) {
            filesToConvert.push(filesPath + filesList[i]);
        }
    }

    return filesToConvert;
}


const LSLIB = LOAD_LSLIB();


module.exports = { LSLIB, FIND_FILES, getFormats };