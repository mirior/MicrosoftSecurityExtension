import * as vscode from 'vscode';
const axios = require('axios');
import { readFileSync } from 'fs';
import { getAllFilesSync } from 'get-all-files';
const fileType = '.yaml';

export async function kubesec() {

    const MDCOutputChannel = createOutputChannel("MDC-Microsoft Security Gate");
    const files = await getFiles();
    appendLineToOutputChannel(MDCOutputChannel, "get all files");

    var kubesecResults = [];
    for (const file of files) {
        kubesecResults.push(
            {
                'filePath': file,
                'kubesecResult': await sendFileToKubesec(file)
            });
        writeKubesecResultsToOutput(kubesecResults, MDCOutputChannel);

    }

    return kubesecResults;
}

export function writeKubesecResultsToOutput(_kubesecResults: any[], MDCOutputChannel: vscode.OutputChannel) {
    const currentKubesecResult = _kubesecResults[_kubesecResults.length - 1].kubesecResult[0];
    const message = "message:" + currentKubesecResult.message + ',\n';
    const scoring = currentKubesecResult.scoring;
    const advise = currentKubesecResult.scoring.advise;
    const passed = currentKubesecResult.scoring.passed;
    const critical = currentKubesecResult.scoring.critical;
    let scoringResult = "";
    if (scoring != {}) {
        scoringResult = scoringResult.concat('scoring:');
        if (advise) {
            scoringResult = scoringResult.concat("advise-");
            advise.forEach((adv: any) => {
                scoringResult = scoringResult.concat("reason:" + adv.reason + ',\n' + "selector:" + adv.selector + ',\n');
            });
        }
        if (passed) {
            scoringResult = scoringResult.concat("passed-");
            passed.forEach((pass: any) => {
                scoringResult = scoringResult.concat("reason:" + pass.reason + ',\n' + "selector:" + pass.selector + ',\n');
            });
        }
        if (critical) {
            scoringResult = scoringResult.concat("critical-");
            critical.forEach((criti: any) => {
                scoringResult = scoringResult.concat("reason:" + criti.reason + ',\n' + "selector:" + criti.selector + ',\n');
            });
        }
    }
    appendLineToOutputChannel(MDCOutputChannel, "kubesec result:\n" + message + scoringResult);
}



function createOutputChannel(outputChannelName: string) {
    //Create output channel
    let outputChannel = vscode.window.createOutputChannel(outputChannelName);
    return outputChannel;
}
function appendLineToOutputChannel(outputChannel: vscode.OutputChannel, message: string) {
    outputChannel.appendLine(message);
}


async function getFiles() {
    let myPath = vscode.workspace.workspaceFolders?.map(elem => elem.uri.fsPath);
    myPath === undefined ? myPath = [] : null;
    let files = [];
    for (const path of myPath) {
        for (const filename of getAllFilesSync(path)) {
            if (filename.endsWith(fileType)) {
                files.push(filename);
            }
        }
    }
    return files;
}

export async function sendFileToKubesec(filePath: string) {
    const file = readFileSync(filePath, 'utf-8');
    const response = await axios({
        method: "post",
        url: 'https://v2.kubesec.io/scan',
        data: Buffer.from(file),
        headers:
        {
            "Content-Type": `text/yaml`
        }
    });
    return response.data;
}




