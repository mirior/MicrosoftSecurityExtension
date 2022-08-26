"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomGate = void 0;
const vscode_1 = require("vscode");
const category_1 = require("../tree item classes/category");
const gate_1 = require("../tree item classes/gate");
const gate_functions_1 = require("./gate-functions");
//After implementing the gate, a name and path must be added to the file gateList.json
//abstract class for generic gates
class CustomGate extends gate_1.Gate {
    constructor(label = "custom", isActive = false, contextValue = "gate") {
        const con = isActive ? "anyGate" : "gate";
        super(label, vscode_1.TreeItemCollapsibleState.Collapsed, con, isActive);
        //Files to send to gate
        this.files = [];
        //Set functions for generic gate
        this.functions = new gate_functions_1.GateFunctions();
    }
    //This function runs when the gate is enabled
    async activate() {
        this.setIsActive(true);
        this.scanData().then(data => this.gateScanData = data).then(() => {
            this.myProvider?.refresh();
        });
        this.listenerSaveEvent();
    }
    //This function runs when the gate is disabled
    async deactivate() {
        this.setIsActive(false);
        this.gateScanData.data.splice(0, this.gateScanData.data.length);
        this.myProvider?.refresh();
    }
    //This function happens when there are changes in the files
    listenerSaveEvent() {
        vscode_1.workspace.onDidSaveTextDocument((document) => {
            document.uri.scheme === "file" ?
                this.files.push(document.fileName) :
                this.files;
            this.files.length > 0 ?
                this.refresh() :
                console.log('no file has changes');
        });
    }
    //This function refreshes the information and UI
    async refresh() {
        if (this.files.length > 0) {
            const results = this.gateScanData.data.filter((element) => {
                element.result.map((item) => {
                    let arr = this.files;
                    arr = arr.filter(file => {
                        return file.slice(file.indexOf(':')) === item.filePath.slice(file.indexOf(':'));
                    });
                    return arr.length === 0;
                });
            });
            this.gateScanData.data = results;
            this.scanData().then((data) => {
                this.gateScanData.data.concat(data.data);
            });
            this.files = [];
            this.myProvider?.refresh();
        }
    }
    //This function return the hierarchy of the gate
    getMoreChildren(element) {
        this.myProvider = element;
        let resultArr = [];
        this.labels.map((l) => {
            resultArr.push(new category_1.Category(l, vscode_1.TreeItemCollapsibleState.Collapsed, this.gateScanData.data.find((e) => e.label === l)));
        });
        return Promise.resolve(resultArr);
    }
    //This function returns files according to the data sent
    async getFiles(searchSettings) {
        const _files = this.functions.getFiles(searchSettings, this.files);
        this.files = [];
        return _files;
    }
    //This function create output channel
    createOutputChannel(name) {
        return this.functions.createOutputChannel(name);
    }
    //This function write to output channel
    appendLineToOutputChannel(outputChannel, message) {
        this.functions.appendLineToOutputChannel(outputChannel, message);
    }
    writeResultsToOutput(results, outputChannel) {
        this.functions.writeResultsToOutput(results, outputChannel);
    }
}
exports.CustomGate = CustomGate;
//# sourceMappingURL=customer-gate.js.map