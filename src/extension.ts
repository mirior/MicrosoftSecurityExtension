import * as vscode from 'vscode';
const fs = require('fs');
import { GatesProvider } from './gate provider/gate-provider';
import path = require('path');
import { Gate } from './gate provider/gates/gate';
import { showTextDocumentWithErrors } from './gate provider/gates/kubesec/kubesec';

export async function activate(context: vscode.ExtensionContext) {

	let gates = new GatesProvider();

	vscode.window.registerTreeDataProvider(
		'package-gates',
		gates
	);

	vscode.commands.registerCommand('gates.refreshEntry', () =>
		gates.refresh()
	);

	vscode.commands.registerCommand('gates.activate', () => {
		gates.activeAllGates();
	});

	vscode.commands.registerCommand('gate.activate', async (arg: Gate) => {
		arg.activate();
	});

	vscode.commands.registerCommand('gate.deactivate', async (arg: Gate) => {
		arg.deactivate();
	});

	vscode.commands.registerCommand('showTextDocument', async (arg: any) => {
		const filePath = arg.toString();
		const textDocument = await vscode.workspace.openTextDocument(filePath);
		await vscode.window.showTextDocument(textDocument);		
	});
}
export function deactivate() { }





