import * as vscode from 'vscode';
const fs = require('fs');
import { kubesec, sendFile } from './kubesec/kubesec';
import { GatesProvider } from './gate-provider';
import { KubesecGate } from './kubesec/kubesec-gate';

export async function activate(context: vscode.ExtensionContext) {

  var myGates = new GatesProvider();

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
  // vscode.commands.registerCommand("gate.setStatus",()=>{
  //  // vscode.commands.executeCommand('setContext', 'add', true);
  // }
  // );
  vscode.commands.registerCommand('kubesec.activate', async (arg: KubesecGate) => {
    arg.activate();
    //vscode.window.showInformationMessage('kubesec.activate');
  });

  vscode.commands.registerCommand('kubesec.deactivate', async (arg: KubesecGate) => {
    arg.deactivate();

    //vscode.window.showInformationMessage('kubesec.activate');
  });
}







// vscode.commands.registerCommand('gates.errors',()=>{
//   myGates.setAllViewAsErrors();
// });
// vscode.commands.registerCommand('gate.errors',()=>{
//   //   this.setViewAsErrors();
//  });
// console.log('Congratulations, your extension "microsoft-security-gate" is now active!');
// let disposable = vscode.commands.registerCommand('microsoft-security-gate.gates', () => {
// });
// context.subscriptions.push(disposable);


export function deactivate() { }





