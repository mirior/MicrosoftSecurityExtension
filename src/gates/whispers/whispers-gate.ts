import { CustomGate } from '../../customGate/customer-gate';
import { readFileSync } from 'fs';
import { GetFileSettings } from '../../customGate/gate-functions';
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

 let whispersResult=await this.sendFileToWhispers(form);
//  const { data } = whispersResult; // make sure we can get data
// let toJSON = JSON.parse(data);
 let secrets:GateData[]=[];
//  whispersResult=whispersResult.replace('[','').replace(']','').split('}, ')
    whispersResult.forEach((res:any) => {
        const fileName=res['name'].split('.')[0];
        let data=new GateData();
        data.data=[new ResultsList("secrets",[new FileMessages(res['name'],fileName,[new GateResult(new Location(0,0), res['secrets'])])])];
        secrets.push(data);
    });
    // let secrets:GateData=new GateData();

    // secrets.data=[new ResultsList("secrets",[new FileMessages("res['name']","fileName",[new GateResult(new Location(0,0), whispersResult)])])];

    //     // return secrets[0];
        return secrets[0];
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
        // const response=await axios.post("https://whisper-gate.azurewebsites.net/api/whispersGate",data,data.getHeaders());
        return response.data;
      
        }

}
export interface AxiosResponse<T = any>  {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: AxiosRequestConfig;
    request?: any;
  }
