import * as vscode from 'vscode';
const fs = require('fs');
import { GatesProvider } from './gate provider/gate-provider';
import path = require('path');
import { Gate } from './gate provider/gates/gate';
import { arrangeKubesecSelectorBeforeSearch, readKubesecFileByLines, showTextDocumentWithErrors } from './gate provider/gates/kubesec/kubesec';
import { ScoringItem } from './gate provider/gates/kubesec/scoring';
import { File } from './gate provider/gates/kubesec/file';
import { hierarchySearchInFile, jumpSpecifiedLine } from './gate provider/search';

export async function activate(context: vscode.ExtensionContext) {

	let gates = new GatesProvider();
	let activeTextDocument: string[];//correct?

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

	vscode.commands.registerCommand('showTextDocument', async (arg: File) => {
		const filePath = arg.path;
		const textDocument = await vscode.workspace.openTextDocument(filePath);
		await vscode.window.showTextDocument(textDocument);
		activeTextDocument = await readKubesecFileByLines(arg.path);
		await showTextDocumentWithErrors(arg, activeTextDocument);
	});

	vscode.commands.registerCommand('kubesec.showScoring', async (arg: ScoringItem) => {
		const textDocument = await vscode.workspace.openTextDocument(arg.filePath);
		await vscode.window.showTextDocument(textDocument);
		const searchSentenceReadyToSearch = arrangeKubesecSelectorBeforeSearch(activeTextDocument, arg.selector);
		const searchResult = hierarchySearchInFile(activeTextDocument, searchSentenceReadyToSearch);
		jumpSpecifiedLine(searchResult.requestedLine, arg.filePath);

	});
}
export function deactivate() { }





