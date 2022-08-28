import { CustomGate } from '../../customGate/customer-gate';
import { readFileSync } from 'fs';
import { displayErrorMessage, GetFileSettings } from '../../customGate/gate-functions';
import { FileMessages, GateData, GateResult, Location, ResultsList } from '../../customGate/gate-data';
import * as vscode from 'vscode';
import FormData = require('form-data');
import { AxiosRequestConfig } from 'axios';
const fs = require('fs');
// const formData = require('form-data');
const axios = require('axios');

export class WhispersGate extends CustomGate {
    contextValue?: string | undefined;

    //Labels of treeItems in hierarchy of gate
    labels: string[] = ["secrets"];

    //The name of the gate
    label: string = "whispers";

    //Description of gate
    description: string = "Whispers is a static code analysis tool designed for parsing various common data formats in search of hardcoded credentials and dangerous functions.";

    constructor() {
        super("whispers");
    }

    public async scanData(): Promise<GateData> {

        const form:FormData = new FormData(); //Data to be sent to the api

        const filePaths = await this.getFiles(new GetFileSettings([".yaml"])); //the appropriate file paths
        filePaths.forEach(path => {
            let fileStream=fs.createReadStream(path);
            form.append(path,fileStream);
        });
try{

 let whispersResult=await this.sendFilesToWhispers(form);
 let whispersResultArr= JSON.parse(whispersResult.replaceAll("'",'"'));
 let secrets=new GateData();
 secrets.data=[new ResultsList("secrets",[])];
 let resultNumber=0;

 whispersResultArr.forEach((res:any) => {
        const filePath=res['name'];
        const fileName=filePath.slice(filePath.lastIndexOf('\\'),filePath.length).slice(1);
        secrets.data[0].result!.push(new FileMessages(filePath,fileName,[]));

        res['secrets'].forEach((sec:any) => {
            secrets.data[0].result[resultNumber].messages!.push(new GateResult(new Location(1,0),sec ));
        });

        resultNumber++;
    });
  vscode.window.showInformationMessage("Whispers is ready!");
        return secrets;
    }catch(ex){
        displayErrorMessage("error");
        return new GateData();
    }
    }

    async sendFilesToWhispers(data: FormData):Promise<any> {
      
        const response = await axios({
            //sending to the api
            method: "post",
            url: 'https://whisper-gate.azurewebsites.net/api/whispersGate',
            data: data,//new formData(fs.createReadStream(filePath)),
            headers:
            {
                "Content-type": "multipart/form-data"
            }
        });

        return response.data;
      
        }

}
