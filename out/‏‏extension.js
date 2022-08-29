"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require('fs');
const gate_provider_1 = require("./gate provider/gate-provider");
const kubesec_1 = require("./gate provider/gates/kubesec/kubesec");
const gate_functions_1 = require("./gate provider/customGate/gate-functions");
const showFileYaml_1 = require("./gate provider/showFileYaml");
const gate_data_1 = require("./gate provider/customGate/gate-data");
async function activate(context) {
    var myGates = new gate_provider_1.GatesProvider();
    let activeTextDocument;
    const extensionPath = context.asAbsolutePath("src");
    vscode.window.registerTreeDataProvider('package-gates', myGates);
    vscode.commands.registerCommand('gates.refreshEntry', () => myGates.refresh());
    vscode.commands.registerCommand('gates.activate', () => {
        myGates.activeAllGates();
    });
    vscode.commands.registerCommand('kubesec.showData', async (arg) => {
        const filePath = arg.toString();
        //const kubesecResult=await sendFile(filePath);  
        let textDocument = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(textDocument);
    });
    vscode.commands.registerCommand('customGate.showData', async (arg, item) => {
        const filePath = arg;
        const textDocument = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(textDocument);
        activeTextDocument = await (0, gate_functions_1.readFileByLines)(textDocument.fileName);
        await (0, kubesec_1.showTextDocumentWithErrors)(item, activeTextDocument);
    });
    vscode.commands.registerCommand('kubesec.activate', async (arg) => {
        arg.activate();
        vscode.window.showInformationMessage('kubesec.activate');
    });
    vscode.commands.registerCommand('customGate.activate', async (arg) => {
        arg.activate(extensionPath);
        arg.contextValue = "anyGate";
        vscode.commands.executeCommand('setContext', 'anyGateActive', true);
        myGates.refresh();
        vscode.window.showInformationMessage(arg.label + '.activate');
    });
    vscode.commands.registerCommand('kubesec.deactivate', async (arg) => {
        arg.deactivate();
        //vscode.window.showInformationMessage('kubesec.activate');
    });
    vscode.commands.registerCommand('customGate.deactivate', async (arg) => {
        arg.deactivate();
        arg.contextValue = "gate";
        vscode.commands.executeCommand('setContext', 'gateActive', false);
        myGates.refresh();
        vscode.window.showInformationMessage(arg.label + '.deactivate');
    });
    vscode.commands.registerCommand('customGate.showFileData', async (args, arg) => {
        const textDocument = await vscode.workspace.openTextDocument(args);
        await vscode.window.showTextDocument(textDocument);
        if (typeof (arg.location) === typeof (gate_data_1.Location)) {
            (0, showFileYaml_1.jumpSpecifiedLine)(arg.location.lineNumber - 1, args);
        }
        else {
            vscode.env.openExternal(vscode.Uri.parse(arg.location.toString()));
        }
    });
    vscode.commands.registerCommand('showTextDocument', async (arg, lineNumber) => {
        const filePath = arg.toString();
        let textDocument = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(textDocument);
        (0, showFileYaml_1.jumpSpecifiedLine)(lineNumber, filePath);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=%E2%80%8F%E2%80%8Fextension.js.map