"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhispersGate = void 0;
const customer_gate_1 = require("../../customGate/customer-gate");
const gate_functions_1 = require("../../customGate/gate-functions");
const gate_data_1 = require("../../customGate/gate-data");
const vscode = require("vscode");
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
        // const configFilePath=vscode.workspace.workspaceFolders![0].uri.path+"/src/gates/whispers/config.yaml";
        // form.append(configFilePath,fs.createReadStream(configFilePath));   
        const filePaths = await this.getFiles(new gate_functions_1.GetFileSettings([".yaml", ".json"])); //the appropriate file paths
        filePaths.forEach(path => {
            let fileStream = fs.createReadStream(path);
            form.append(path, fileStream);
        });
        try {
            let whispersResult = await this.sendFilesToWhispers(form);
            let whispersResultArr = JSON.parse(whispersResult.replaceAll("'", '"'));
            let secrets = new gate_data_1.GateData();
            secrets.data = [new gate_data_1.ResultsList("secrets", [])];
            let resultNumber = 0;
            whispersResultArr.forEach((res) => {
                const filePath = res['name'];
                const fileName = filePath.slice(filePath.lastIndexOf('\\'), filePath.length).slice(1);
                secrets.data[0].result.push(new gate_data_1.FileMessages(filePath, fileName, []));
                res['secrets'].forEach((sec) => {
                    secrets.data[0].result[resultNumber].messages.push(new gate_data_1.GateResult(new gate_data_1.Location(1, 0), sec));
                });
                resultNumber++;
            });
            vscode.window.showInformationMessage("Whispers is ready!");
            return secrets;
        }
        catch (ex) {
            (0, gate_functions_1.displayErrorMessage)("some files are invalid");
            return new gate_data_1.GateData();
        }
    }
    async sendFilesToWhispers(data) {
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
    }
}
exports.WhispersGate = WhispersGate;
//# sourceMappingURL=whispers-gate.js.map