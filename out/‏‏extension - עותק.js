"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require('fs');
const gate_provider_1 = require("./gate provider/gate-provider");
const kubesec_1 = require("./gate provider/gates/kubesec/kubesec");
const search_1 = require("./gate provider/search");
async function activate(context) {
    let gates = new gate_provider_1.GatesProvider();
    let activeTextDocument; //correct?
    vscode.window.registerTreeDataProvider('package-gates', gates);
    vscode.commands.registerCommand('gates.refreshEntry', () => gates.refresh());
    vscode.commands.registerCommand('gates.activate', () => {
        gates.activeAllGates();
    });
    vscode.commands.registerCommand('gate.activate', async (arg) => {
        arg.activate();
    });
    vscode.commands.registerCommand('gate.deactivate', async (arg) => {
        arg.deactivate();
    });
    vscode.commands.registerCommand('showTextDocument', async (arg) => {
        const filePath = arg.path;
        const textDocument = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(textDocument);
        activeTextDocument = await (0, kubesec_1.readKubesecFileByLines)(arg.path);
        await (0, kubesec_1.showTextDocumentWithErrors)(arg, activeTextDocument);
    });
    vscode.commands.registerCommand('kubesec.showScoring', async (arg) => {
        const textDocument = await vscode.workspace.openTextDocument(arg.filePath);
        await vscode.window.showTextDocument(textDocument);
        const searchSentenceReadyToSearch = (0, kubesec_1.arrangeKubesecSelectorBeforeSearch)(activeTextDocument, arg.selector);
        const searchResult = (0, search_1.hierarchySearchInFile)(activeTextDocument, searchSentenceReadyToSearch);
        (0, search_1.jumpSpecifiedLine)(searchResult.requestedLine, arg.filePath);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=%E2%80%8F%E2%80%8Fextension%20-%20%D7%A2%D7%95%D7%AA%D7%A7.js.map