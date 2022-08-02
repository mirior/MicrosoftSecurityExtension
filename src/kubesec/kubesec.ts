import * as vscode from 'vscode';
const axios = require('axios');
import { readFileSync } from 'fs';
import { getAllFilesSync } from 'get-all-files';
const fileType='.yaml';

export async function kubesec(){    
    const MDCOutputChannel=createOutputChannel("MDC-Microsoft Security Gate");

    var _files=await getFiles();
    appendLineToOutputChannel(MDCOutputChannel,"get all files");

    var _kubesecResults=[];
    for(const file of _files){
        _kubesecResults.push(
            {
                'filePath':file,
                'kubesecResult':await sendFile(file)
            });
            appendLineToOutputChannel(MDCOutputChannel,"send "+file+" file for checking");
            appendLineToOutputChannel(MDCOutputChannel,"kubesec result:"+_kubesecResults[_kubesecResults.length-1].kubesecResult[0].message);
    
    }

    return _kubesecResults;
}

export function createOutputChannel(outputChannelName:string){
    //Create output channel
    let outputChannel = vscode.window.createOutputChannel(outputChannelName);
    return outputChannel;
}
export function appendLineToOutputChannel(outputChannel:vscode.OutputChannel,message:string){
    outputChannel.appendLine(message);
}


export async function getFiles() {
    
    //const path='C:\\Users\\This_user\\Documents\\microsoft-security-gate';
    const path=vscode.workspace.workspaceFolders![0].uri.fsPath;
    var _files = [];
    for (const filename of getAllFilesSync(path)) {
        if (filename.endsWith(fileType)) {
            _files.push(filename);
        }
    }
    return _files;
}

export async function sendFile(filePath:string){
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




