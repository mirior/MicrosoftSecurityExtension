import * as vscode from 'vscode';


export function hierarchySearchInFile(fileToSearchIn: string[], searchSentence: string[]) {
	let searchSentenceIndex = 0;
	let requestedLine = -1;
	let lineNumber = 0;
	let numOfTabs = 0;
	for (; lineNumber < fileToSearchIn.length; lineNumber++) {
		let currentSentence = fileToSearchIn[lineNumber].split(':')[0];//only for kubesec?-The hierarchical search result includes only the first word in the sentence
		let currentNumOfTabs = numberOfTabs(currentSentence);

		// Search for a word only in descendants of the previous word found.
		if (currentNumOfTabs < numOfTabs) {
			//If it came out of the descendants of the previous word found.
			searchSentenceIndex = 0;//Re-search begins by reset searchSentenceIndex.
			requestedLine = -1;
		}
		let currentSearchWord = searchSentence[searchSentenceIndex];
		if (currentSentence.includes(currentSearchWord)) {
			numOfTabs = currentNumOfTabs;
			searchSentenceIndex++;
			requestedLine = lineNumber;
			if (searchSentenceIndex === searchSentence.length) {
				break;
			}
		}
	}
	const res = { requestedLine, numOfTabs };
	return res;
}


function numberOfTabs(text: string) {
	var count = 0;
	var index = 0;
	while (text.charAt(index++) === ' ') {
		count += 0.5;
		if (text.charAt(index) !== ' ') {//If next character is not part of tab
			break;
		}
	}
	return count;
}

export async function jumpSpecifiedLine(lineNumber: number, filePath: string) {
	var pos1 = new vscode.Position(lineNumber, 0);
	var openPath = vscode.Uri.file(filePath);
	vscode.workspace.openTextDocument(openPath).then((doc: any) => {
		vscode.window.showTextDocument(doc).then((editor: any) => {
			// Line added - by having a selection at the same position twice, the cursor jumps there
			editor.selections = [new vscode.Selection(pos1, pos1)];
			// And the visible range jumps there too
			var range = new vscode.Range(pos1, pos1);
			editor.revealRange(range);
		});
	});
}
