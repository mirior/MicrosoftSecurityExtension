"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const gate_provider_1 = require("./gate-provider");
const ShowFileYaml_1 = require("./ShowFileYaml");
async function activate(context) {
    var myGates = new gate_provider_1.GatesProvider();
    let activeTextDocument;
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
        await (0, ShowFileYaml_1.showTextDocumentWithErrors)(item, activeTextDocument);
    });
    vscode.commands.registerCommand('kubesec.activate', async (arg) => {
        arg.activate();
        vscode.window.showInformationMessage('kubesec.activate');
    });
    vscode.commands.registerCommand('customGate.activate', async (arg) => {
        arg.activate();
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
        const textDocument = await vscode.workspace.openTextDocument(vscode.workspace.workspaceFolders[0].uri.path + args);
        await vscode.window.showTextDocument(textDocument);
        (0, ShowFileYaml_1.jumpSpecifiedLine)(arg.location.lineNumber - 1, args);
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map