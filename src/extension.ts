import * as vscode from 'vscode';
const fs = require('fs');
import { GatesProvider } from './gate-provider';
import path = require('path');
import { Gate } from './tree item models/gate';

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

  vscode.commands.registerCommand('gate.activate', async (arg: Gate) => {
    arg.activate();
  });

  vscode.commands.registerCommand('gate.deactivate', async (arg: Gate) => {
    arg.deactivate();
  });

  vscode.commands.registerCommand('kubesec.showData', async (arg: any) => {
    const filePath = arg.toString();
    let textDocument = await vscode.workspace.openTextDocument(filePath);
    await vscode.window.showTextDocument(textDocument);
  });

  

 
}






	// vscode.commands.registerCommand('kubesec.cmd', async (arg:Gate) => {
		
	// 	const val=vscode.workspace.getConfiguration().get('try',{});
	// 	var value = { ...val, ...{'gate3':true} };
	// 	value = { ...value, ...{'gate3':false} };
	// 	await vscode.workspace.getConfiguration().update('try', value, vscode.ConfigurationTarget.Workspace);
	// 	const configuredView =await vscode.workspace.getConfiguration().get('try');
	// 	const target_copy:any = Object.assign({}, configuredView);

	// 	console.log(target_copy["gate1"]);
	// 	console.log(target_copy["gate3"]);

		
	// 	}
	// );


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





