import * as vscode from 'vscode';
const fs = require('fs');
import { kubesec, sendFile } from './kubesec/kubesec';
import { GatesProvider } from './gate-provider';
import { KubesecGate } from './kubesec/kubesec-gate';
import path = require('path');
import { Gate } from './tree item classes/gate';

export async function activate(context: vscode.ExtensionContext) {

  var myGates = new GatesProvider();

  vscode.window.registerTreeDataProvider(
    'package-gates',
    myGates
  );

  // vscode.commands.registerCommand('gates.refreshEntry', () =>
  //   myGates.refresh()
  // );

  // vscode.commands.registerCommand('gates.activate', () => {
  //   myGates.activeAllGates();
  // });

  // vscode.commands.registerCommand('kubesec.showData', async (arg: any) => {
  //   const filePath = arg.toString();
  //   let textDocument = await vscode.workspace.openTextDocument(filePath);
  //   await vscode.window.showTextDocument(textDocument);
  // });

  // vscode.commands.registerCommand('kubesec.activate', async (arg: KubesecGate) => {
  //   arg.activate();
  //   vscode.window.showInformationMessage('kubesec.activate');  
   
  // });

  // vscode.commands.registerCommand('kubesec.deactivate', async (arg: KubesecGate) => {
  //   arg.deactivate();
  //   vscode.window.showInformationMessage('kubesec.deactivate');
  // });

  // Example: Reading Window scoped configuration
	const configuredView = vscode.workspace.getConfiguration().get('MSG.gates.active_settings');
	
	// Example: Updating Resource scoped Configuration for current file
	vscode.commands.registerCommand('kubesec.deactivate', async (arg:Gate) => {
		
		// await vscode.workspace.getConfiguration().update('activity.settings',{"gate1":true},vscode.ConfigurationTarget.Global);
		// await vscode.workspace.getConfiguration().update('activity.settings',{"gate2":true},vscode.ConfigurationTarget.Workspace);

		// const val1=vscode.workspace.getConfiguration().get('activity.settings');

		//await vscode.workspace.getConfiguration().update('try', {'gate3':false}, vscode.ConfigurationTarget.Workspace);
		const val=vscode.workspace.getConfiguration().get('try',{});
		var value = { ...val, ...{'gate3':true} };
		value = { ...value, ...{'gate3':false} };
		await vscode.workspace.getConfiguration().update('try', value, vscode.ConfigurationTarget.Workspace);
		const configuredView =await vscode.workspace.getConfiguration().get('try');
		const target_copy:any = Object.assign({}, configuredView);

		console.log(target_copy["gate1"]);
		console.log(target_copy["gate3"]);

		

		
		// await vscode.workspace.getConfiguration().update('activity.settings1', {'gate3':false}, vscode.ConfigurationTarget.Workspace);
		// const val=vscode.workspace.getConfiguration().get('activity.settings1',{});
		// const value = { ...val, ...{'gate3':true} };
		// await vscode.workspace.getConfiguration().update('activity.settings1', value, vscode.ConfigurationTarget.Workspace);
		// const configuredView =await vscode.workspace.getConfiguration().get('activity.settings1');
		// const target_copy:any = Object.assign({}, configuredView);

		// console.log(target_copy);
		// console.log(typeof(target_copy));


		if (vscode.window.activeTextEditor) {
			const currentDocument = vscode.window.activeTextEditor.document;
      		const gate=arg.label;

			// 1) Get the configuration for the current document
			const configuration = vscode.workspace.getConfiguration('', currentDocument.uri);

			// 2) Get the configiuration value
			const currentValue = configuration.get('activity.settings', {});
      

			// 3) Choose target to Global when there are no workspace folders
			const target = vscode.workspace.workspaceFolders ? vscode.ConfigurationTarget.WorkspaceFolder : vscode.ConfigurationTarget.Global;

			// const value = { ...currentValue, ...{ [currentDocument.fileName]: true } };
      const value = { ...currentValue, ...{ [gate]: false } };


			// 4) Update the configuration
			await configuration.update('activity.settings', value, target);

			//activity.settings1
			// 2) Get the configuration
			const configuration2 = vscode.workspace.getConfiguration();

			// 3) Get the current value
			const currentValue2 = configuration2.get<{}>('activity.settings1');

			const newValue = { ...currentValue2, ...(value ? { "gate2": true } : {}) };

			// 4) Update the value in the User Settings
			await vscode.workspace.getConfiguration().update('activity.settings1', newValue, vscode.ConfigurationTarget.Workspace);
		
			// 1) Get the configuration for the current document
			const configuration1 = vscode.workspace.getConfiguration('widgetSamples', currentDocument.uri);

			// 2) Get the configiuration value
			var currentValue1 = configuration1.get('activity.settings1', undefined);
      
			//const current = currentValue1?.get('gate','');

			// 3) Choose target to Global when there are no workspace folders
			//const target = vscode.workspace.workspaceFolders ? vscode.ConfigurationTarget.WorkspaceFolder : vscode.ConfigurationTarget.Global;

			// const value = { ...currentValue, ...{ [currentDocument.fileName]: true } };
      //const value1 = { ...currentValue1, ...{ [gate]: true } };


			// 4) Update the configuration
			//await configuration.update('activity.settings1', value1, target);

		}
	});

	// Example: Updating Resource scoped Configuration
	vscode.commands.registerCommand('kubesec.activate', async () => {
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


export function deactivate() {}





