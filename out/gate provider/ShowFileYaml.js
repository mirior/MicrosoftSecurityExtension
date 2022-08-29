"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jumpSpecifiedLine = exports.showTextDocumentWithErrors = void 0;
const vscode_1 = require("vscode");
const gate_data_1 = require("./customGate/gate-data");
const highLight_1 = require("./highLight");
const search_1 = require("./search");
async function showTextDocumentWithErrors(result, documentText) {
    result.forEach(async (res) => {
        if (typeof (res.location) === typeof (gate_data_1.Location)) {
            res.location.lineNumber = (0, search_1.hierarchySearchInFile)(documentText, [res.message.split(' ')[0]]).requestedLine;
            (0, highLight_1.highLightTextInFile)(res.location.lineNumber, res.location.columnNumber);
        }
    });
}
exports.showTextDocumentWithErrors = showTextDocumentWithErrors;
async function jumpSpecifiedLine(lineNumber, filePath) {
    var pos1 = new vscode_1.Position(lineNumber, 0);
    var openPath = vscode_1.Uri.file(filePath);
    vscode_1.workspace.openTextDocument(openPath).then((doc) => {
        vscode_1.window.showTextDocument(doc).then((editor) => {
            // Line added - by having a selection at the same position twice, the cursor jumps there
            editor.selections = [new vscode_1.Selection(pos1, pos1)];
            // And the visible range jumps there too
            var range = new vscode_1.Range(pos1, pos1);
            editor.revealRange(range);
        });
    });
}
exports.jumpSpecifiedLine = jumpSpecifiedLine;
//# sourceMappingURL=showFileYaml.js.map