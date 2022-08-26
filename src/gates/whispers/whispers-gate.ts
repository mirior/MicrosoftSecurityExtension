import { CustomGate } from '../../customGate/customer-gate';
import { readFileSync } from 'fs';
import { GetFileSettings } from '../../customGate/gate-functions';
import { FileMessages, GateData, GateResult, Location, ResultsList } from '../../customGate/gate-data';
import * as vscode from 'vscode';
import FormData = require('form-data');
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

 let whispersResult=await this.sendFileToWhispers(form);
//  let secrets:GateData[]=[];

    // whispersResult.forEach((res:any) => {
    //     const fileName=res['name'].split('.')[0];
    //     let data=new GateData();
    //     data.data=[new ResultsList("secrets",[new FileMessages(res['name'],fileName,[new GateResult(new Location(0,0), res['secrets'])])])];
    //     secrets.push(data);
    // });
    let secrets:GateData=new GateData();

    secrets.data=[new ResultsList("secrets",[new FileMessages("res['name']","fileName",[new GateResult(new Location(0,0), whispersResult)])])];

        // return secrets[0];
        return secrets;
    }

    async sendFileToWhispers(data: FormData):Promise<any> {
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
        return [{'name': 'a.yaml', 'secrets': {'apikey': 'YXNkZmZmZmZm_HARDcoded', 'TRAVEL_API_KEY': 'YXNkZmZmZmZm_HARDcoded', 'PRIVATE_API_TOKEN': 'YXNkZmZmZmZm_HARDcoded', 'slackKey': 'YXNkZmZmZmZm_HARDcoded', 'GITLAB_KEY': 'YXNkZmZmZmZm_HARDcoded', 'Google_token': 'YXNkZmZmZmZm_HARDcoded', 'GITHUBKEY': 'YXNkZmZmZmZm_HARDcoded', 'license_key': 'YXNkZmZmZmZm_HARDcoded', 'NUMERIC_APIKEY': '1925483168813050783076'}}, {'name': 'y.yaml', 'secrets': {'apikey': 'YXNkZmZmZmZm_HARDcoded', 'TRAVEL_API_KEY': 'YXNkZmZmZmZm_HARDcoded', 'Google_token': 'YXNkZmZmZmZm_HARDcoded', 'GITHUBKEY': 'YXNkZmZmZmZm_HARDcoded', 'license_key': 'YXNkZmZmZmZm_HARDcoded', 'NUMERIC_APIKEY': '1925483168813050783076'}}, {'name': 'misc3.yml', 'secrets': {}}];
            // )])])];
 
        // vscode.window.showInformationMessage(response.data);
        // return response.data;
        // return data;
        }


    // public async scanData(): Promise<GateData> {

    //     // const form = new formData(); //Data to be sent to the api

    //     const filePaths = await this.getFiles(new GetFileSettings(".yml")); //the appropriate file paths
    //     let filesSecrets:GateData=new GateData();
    //     // filePaths.forEach(async (path: any) => {
    //         filesSecrets=await this.sendFileToWhispers(filePaths[1]);
    //     // });
    //     return filesSecrets;

    // }
    // async sendFileToWhispers(filePath: string):Promise<any> {
    //     let dataToSend=new formData();
    //     dataToSend.append(fs.createReadStream("config.yml"));
    //     dataToSend.append(fs.createReadStream(filePath));
    // const response = await axios({
    //     //sending to the api
    //     method: "post",
    //     url: 'https://whisper-gate.azurewebsites.net/api/whispersGate',
    //     data:dataToSend ,
    //     headers:
    //     {
    //         "Content-type": "multipart/form-data"
    //     }
    // });
    
    // // let data=new GateData();
    // // data.data=[new ResultsList("secrets",[new FileMessages("...","misc",[new GateResult(new Location(1,2),"hiiiiiiiiiiiiiiiii")])])];
    // return response.data;
    // // return data;
    // }

}
