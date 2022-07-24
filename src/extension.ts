import * as vscode from 'vscode';
const fs=require('fs');
import { kubesec, sendFile } from './kubesec/kubesec';
import { GatesProvider } from './gate-provider';
import { KubesecProvider } from './kubesec/kubesec-provider';



export async function activate(context: vscode.ExtensionContext) {
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
  const filePath=arg.toString();
  const result=await sendFile(filePath);  
  //console.log(filePath+' : '+result.scoring.advise);
  // let textDocument = await vscode.workspace.openTextDocument(filePath);
  // await vscode.window.showTextDocument(textDocument);});
  var openPath = vscode.Uri.file(filePath);
vscode.workspace.openTextDocument(openPath).then(doc => {
vscode.window.showTextDocument(doc).then(editor => {
    var range = new vscode.Range(new vscode.Position(10, 4), new vscode.Position(11, 0));
    editor.revealRange(range);
   });
});
});}

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





