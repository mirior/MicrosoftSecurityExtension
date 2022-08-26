"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhispersGate = void 0;
const customer_gate_1 = require("../../customGate/customer-gate");
const gate_functions_1 = require("../../customGate/gate-functions");
const gate_data_1 = require("../../customGate/gate-data");
const FormData = require("form-data");
const fs = require('fs');
// const formData = require('form-data');
const axios = require('axios');
class WhispersGate extends customer_gate_1.CustomGate {
    constructor() {
        super("whispers");
        //Labels of treeItems in hierarchy of gate
        this.labels = ["secrets"];
        //The name of the gate
        this.label = "whispers";
        //Description of gate
        this.description = "Whispers is a static code analysis tool designed for parsing various common data formats in search of hardcoded credentials and dangerous functions.";
    }
    async scanData() {
        const form = new FormData(); //Data to be sent to the api
        const filePaths = await this.getFiles(new gate_functions_1.GetFileSettings([".yaml"])); //the appropriate file paths
        filePaths.forEach(path => {
            let fileStream = fs.createReadStream(path);
            form.append(path, fileStream);
        });
        let whispersResult = await this.sendFileToWhispers(form);
        //  let secrets:GateData[]=[];
        // whispersResult.forEach((res:any) => {
        //     const fileName=res['name'].split('.')[0];
        //     let data=new GateData();
        //     data.data=[new ResultsList("secrets",[new FileMessages(res['name'],fileName,[new GateResult(new Location(0,0), res['secrets'])])])];
        //     secrets.push(data);
        // });
        let secrets = new gate_data_1.GateData();
        secrets.data = [new gate_data_1.ResultsList("secrets", [new gate_data_1.FileMessages("res['name']", "fileName", [new gate_data_1.GateResult(new gate_data_1.Location(0, 0), whispersResult)])])];
        // return secrets[0];
        return secrets;
    }
    async sendFileToWhispers(data) {
        const response = await axios({
            //sending to the api
            method: "post",
            url: 'https://whisper-gate.azurewebsites.net/api/whispersGate',
            data: data,
            headers: {
                "Content-type": "multipart/form-data"
            }
        });
        return response.data;
        return [{ 'name': 'a.yaml', 'secrets': { 'apikey': 'YXNkZmZmZmZm_HARDcoded', 'TRAVEL_API_KEY': 'YXNkZmZmZmZm_HARDcoded', 'PRIVATE_API_TOKEN': 'YXNkZmZmZmZm_HARDcoded', 'slackKey': 'YXNkZmZmZmZm_HARDcoded', 'GITLAB_KEY': 'YXNkZmZmZmZm_HARDcoded', 'Google_token': 'YXNkZmZmZmZm_HARDcoded', 'GITHUBKEY': 'YXNkZmZmZmZm_HARDcoded', 'license_key': 'YXNkZmZmZmZm_HARDcoded', 'NUMERIC_APIKEY': '1925483168813050783076' } }, { 'name': 'y.yaml', 'secrets': { 'apikey': 'YXNkZmZmZmZm_HARDcoded', 'TRAVEL_API_KEY': 'YXNkZmZmZmZm_HARDcoded', 'Google_token': 'YXNkZmZmZmZm_HARDcoded', 'GITHUBKEY': 'YXNkZmZmZmZm_HARDcoded', 'license_key': 'YXNkZmZmZmZm_HARDcoded', 'NUMERIC_APIKEY': '1925483168813050783076' } }, { 'name': 'misc3.yml', 'secrets': {} }];
        // )])])];
        // vscode.window.showInformationMessage(response.data);
        // return response.data;
        // return data;
    }
}
exports.WhispersGate = WhispersGate;
//# sourceMappingURL=whispers-gate.js.map