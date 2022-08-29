import * as vscode from 'vscode';
const fs = require('fs');
import { GatesProvider } from './gate provider/gate-provider';
import path = require('path');
import { showTextDocumentWithErrors } from './gate provider/gates/kubesec/kubesec';
import { KubesecGate } from './gate provider/gates/kubesec/kubesec-gate';
import { MessageItem } from './treeItemClasses/message';
import { readFileByLines } from './gate provider/customGate/gate-functions';
import { jumpSpecifiedLine } from './gate provider/showFileYaml';
import { Context } from 'mocha';
import { Location } from './gate provider/customGate/gate-data';

export async function activate(context: vscode.ExtensionContext) {

	var myGates = new GatesProvider();
	let activeTextDocument: string[] | undefined;
	const extensionPath=context.asAbsolutePath("src");

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
		activeTextDocument=await readFileByLines(textDocument.fileName);
		await showTextDocumentWithErrors(item, activeTextDocument!);
	  });

	vscode.commands.registerCommand('kubesec.activate', async (arg: KubesecGate) => {
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
		const textDocument = await vscode.workspace.openTextDocument(args);
		await vscode.window.showTextDocument(textDocument);
		if (typeof (arg.location) === typeof (Location)) {
			jumpSpecifiedLine((arg.location as Location).lineNumber - 1, args);
		}
		else {
			vscode.env.openExternal(vscode.Uri.parse(arg.location.toString()));
		}
	});

	vscode.commands.registerCommand('showTextDocument', async (arg: any, lineNumber: any) => {
		const filePath = arg.toString();
		let textDocument = await vscode.workspace.openTextDocument(filePath);
		await vscode.window.showTextDocument(textDocument);
		jumpSpecifiedLine(lineNumber, filePath);
	});
}



export function deactivate() { }










