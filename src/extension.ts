import * as vscode from 'vscode';
import { GatesProvider } from './gate-provider';
import { KubesecGate } from './kubesec/kubesec-gate';
import { jumpSpecifiedLine, showTextDocumentWithErrors } from './ShowFileYaml';
import { MessageItem } from './tree item classes/message';




export async function activate(context: vscode.ExtensionContext) {

  var myGates = new GatesProvider();
  let activeTextDocument: string[] | undefined;

  vscode.window.registerTreeDataProvider(
    'package-gates',
    myGates
  );


  vscode.commands.registerCommand('gates.refreshEntry', () =>
    myGates.refresh()
 
  );

  vscode.commands.registerCommand('gates.activate', () => {
    myGates.activeAllGates();
  });

  vscode.commands.registerCommand('kubesec.showData', async (arg: any[]) => {
    const filePath = arg.toString();
    //const kubesecResult=await sendFile(filePath);  
    let textDocument = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(textDocument);
  });

  vscode.commands.registerCommand('customGate.showData', async (arg,item) => {
    const filePath = arg;
    const textDocument = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(textDocument);
    await showTextDocumentWithErrors(item, activeTextDocument!);
  });

  vscode.commands.registerCommand('kubesec.activate', async (arg: KubesecGate) => {
    arg.activate();
    vscode.window.showInformationMessage('kubesec.activate');
  });

  vscode.commands.registerCommand('customGate.activate', async (arg) => {
    arg.activate();
    arg.contextValue ="anyGate";
    vscode.commands.executeCommand('setContext','anyGateActive', true);
    myGates.refresh();
    vscode.window.showInformationMessage(arg.label + '.activate');
  });

  vscode.commands.registerCommand('kubesec.deactivate', async (arg: KubesecGate) => {
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

  vscode.commands.registerCommand('customGate.showFileData', async (args, arg: MessageItem) => {
    const textDocument = await vscode.workspace.openTextDocument(vscode.workspace.workspaceFolders![0].uri.path+args);
    await vscode.window.showTextDocument(textDocument);
    jumpSpecifiedLine(arg.location.lineNumber - 1, args);

  });


}



export function deactivate() { }






