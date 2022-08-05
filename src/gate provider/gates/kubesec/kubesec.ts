import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { getAllFilesSync } from 'get-all-files';
import { fileKubesecResultToOutputChannel } from '../../output-channel';
import { hierarchySearchInFile } from '../../search';
import { highLightTextInFile } from '../../highLight';

const axios = require('axios');
const fs = require('fs');

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




export function removeInvalidCharctersInSentence(searchSentence: string, invalidCharcters: string[]) {
    invalidCharcters.forEach(ch => {
        const indexOfInvalidCharacter = searchSentence.indexOf(ch);
        if (indexOfInvalidCharacter !== -1) {
            searchSentence = searchSentence.slice(0, indexOfInvalidCharacter);
        }
    });
    return searchSentence;
}




async function arrangeKubesecFileBeforeSearch(fileToSearchInPath: string, searchSentence: string) {
    try {
        const document = await fs.readFileSync(fileToSearchInPath, "utf8");
        const documentStringLines = document.trim().split('\n');
        if (searchSentence[0] === '.') {
            searchSentence = searchSentence.slice(1, searchSentence.length);
        }

        //Examples of kubesec results that need character removal before sending to search.
        //To get a correct search result:
        //".spec .serviceAccountName" 
        //"containers[] .securityContext .capabilities .drop | index(\"ALL\")"
        //"containers[] .securityContext .readOnlyRootFilesystem == true"
        //"containers[] .securityContext .runAsUser -gt 10000"
        searchSentence = removeInvalidCharctersInSentence(searchSentence, ['|', '==', '-']);
        
        let searchSentenceSplit = searchSentence.replaceAll(' ', '').split('.');
        if (searchSentenceSplit[0].includes("containers[]")) {
            searchSentenceSplit[0] = searchSentenceSplit[0].trim().slice(0, -2);
        }
        if (searchSentenceSplit[0].includes("metadata")) {
            searchSentenceSplit = ["metadata"];
        }
        const itemsReadyToSearch={documentStringLines,searchSentenceSplit};
        return itemsReadyToSearch;
    } catch (Error) {
        displayErrorMessage("There is no such file!");
    }
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


export async function showTextDocumentWithErrors(kubesecResult:any) 
{
    kubesecResult.forEach(async (res: any) => {
        const searchSentence=res['selector'];
        const readyToSearch = await arrangeKubesecFileBeforeSearch(kubesecResult.filePath, searchSentence);
        const searchResult = hierarchySearchInFile(readyToSearch!.documentStringLines, readyToSearch!.searchSentenceSplit);
        if (searchResult) {
            const requestedLine = searchResult.requestedLine;
            const numOfTabs = searchResult.numOfTabs;
            if (requestedLine === -1) {
                displayErrorMessage(searchSentence + " not found!");
            }
            else 
            {
                // if (requestedLine) {
                    // jumpSpecifiedLine(requestedLine, KubesecResult.filePath);
                    highLightTextInFile(requestedLine, numOfTabs);
                // }
            }
        }
    });
}


function displayErrorMessage(message:string){
    vscode.window.showErrorMessage(message);

}


