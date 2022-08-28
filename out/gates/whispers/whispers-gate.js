"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhispersGate = void 0;
const customer_gate_1 = require("../../customGate/customer-gate");
const gate_functions_1 = require("../../customGate/gate-functions");
const gate_data_1 = require("../../customGate/gate-data");
const vscode = require("vscode");
const FormData = require("form-data");
const fs = require('fs');
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
        const configFilePath = vscode.workspace.workspaceFolders[0].uri.fsPath + "\\src\\gates\\whispers\\config.yaml"; //my configuration file
        form.append(configFilePath, fs.createReadStream(configFilePath)); //The config file should be sent first   
        const filePaths = await this.getFiles(new gate_functions_1.GetFileSettings([".yaml", ".json"])); //the appropriate file paths
        filePaths.forEach(path => {
            let fileStream = fs.createReadStream(path); // create file stream from file path
            form.append(path, fileStream); //Append all files to the data
        });
        try {
            let whispersResult = await this.sendFilesToWhispers(form); //Sending the files to whispers api
            let whispersResultArr = JSON.parse(whispersResult.replaceAll("'", '"')); // parse the result to JSON object
            let secrets = new gate_data_1.GateData(); // Init secrets of files for the function response
            secrets.data = [new gate_data_1.ResultsList("secrets", [])]; //Init secrets data with label: secrets
            let resultNumber = 0;
            whispersResultArr.forEach((res) => {
                const filePath = res['name']; // Path of the file
                const fileName = filePath.slice(filePath.lastIndexOf('\\'), filePath.length).slice(1); //Name of the file
                secrets.data[0].result.push(new gate_data_1.FileMessages(filePath, fileName, [])); //Init FileMessages of the current file
                res['secrets'].forEach((sec) => {
                    secrets.data[0].result[resultNumber].messages.push(new gate_data_1.GateResult(new gate_data_1.Location(1, 0), sec)); //Push secret with default location
                });
                resultNumber++; //next file
            });
            vscode.window.showInformationMessage("Whispers is ready!");
            return secrets;
        }
        catch (ex) {
            (0, gate_functions_1.displayErrorMessage)(ex.message);
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