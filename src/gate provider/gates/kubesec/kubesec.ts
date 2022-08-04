import * as vscode from 'vscode';
const axios = require('axios');
import { readFileSync } from 'fs';
import { getAllFilesSync } from 'get-all-files';
import { fileKubesecResultToOutputChannel } from '../../output-channel';

const fileType = '.yaml';

export async function kubesec() {

    const files = await getFiles();
    return await sendFilesToKubesec(files);
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



async function sendFileToKubesec(filePath: string) {
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
    fileKubesecResultToOutputChannel(filePath, response.data);
    return response.data;
}




export async function sendFilesToKubesec(files: string[]) {
    let kubesecResults = [];
    for (const file of files) {
        kubesecResults.push(
            {
                'filePath': file,
                'kubesecResult': await sendFileToKubesec(file)
            });
    }
    return kubesecResults;
}




