import * as vscode from 'vscode';
const fs=require('fs');
import { kubesec, sendFile } from './kubesec/kubesec';
import { GatesProvider } from './gate-provider';
import { KubesecProvider } from './kubesec/kubesec-provider';



export function activate(context: vscode.ExtensionContext) {
kubesec();

const myGates=new GatesProvider();
const myKubesec=new KubesecProvider();
vscode.window.registerTreeDataProvider(
	'package-kubesec',
  myKubesec
);
vscode.window.registerTreeDataProvider(
	'package-gates',
  myGates
);

vscode.commands.registerCommand('gate.activate',()=>{
    //this.setActive(true);
 });

vscode.commands.registerCommand('kubesec.showData',async (arg:any[])=>{
  const filrPath=arg.toString();
  const result=await sendFile(filrPath);  
  console.log(filrPath+' : '+result.scoring.advise);
  let textDocument = await vscode.workspace.openTextDocument(filrPath);
  await vscode.window.showTextDocument(textDocument);});
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


export function deactivate() {}





