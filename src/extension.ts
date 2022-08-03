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

	vscode.commands.registerCommand('showTextDocument', async (arg: any) => {
		const filePath = arg.toString();
		let textDocument = await vscode.workspace.openTextDocument(filePath);
		await vscode.window.showTextDocument(textDocument);
	});
}
export function deactivate() { }





