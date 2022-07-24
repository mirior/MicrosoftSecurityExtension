const axios = require('axios');
//const fs = require('fs');
import { readFileSync } from 'fs';
import { getAllFilesSync } from 'get-all-files';
const fileType='.yaml';

export async function kubesec(){    
    var _files=await getFiles();
    var _kubesecResults=[];
    for(const file of _files){
        _kubesecResults.push(
            {
                'filePath':file,
                'kubesecResult':await sendFile(file)
            });
    }

    for(const fileWithKubesecResult of _kubesecResults){
        returnKubesecMessage(fileWithKubesecResult);
    }
    return _kubesecResults;
}

export async function getFiles() {
    var _files = [];
    for (const filename of getAllFilesSync('C:\\Users\\This_user\\Documents\\microsoft-security-gate')) {
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


function returnKubesecMessage(fileResult:any){    
    // fileResult.kubesecResult[0].valid===false?
    // console.log(fileResult.filePath + ': ' + fileResult.kubesecResult[0].message):
    // console.log(fileResult.filePath + ': valid');   
}



