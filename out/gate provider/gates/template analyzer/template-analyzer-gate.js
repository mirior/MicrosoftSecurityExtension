"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateAnalyzerGate = void 0;
const vscode = require("vscode");
const vscode_1 = require("vscode");
const gate_1 = require("../gate");
class TemplateAnalyzerGate extends gate_1.Gate {
    constructor(isActive) {
        super("Template Analyzer", vscode.TreeItemCollapsibleState.Collapsed, 'templateAnalyzer', isActive);
        this.isActive = isActive;
        this.listenerSaveEvent();
    }
    getTreeItem(element) {
        return element;
    }
    async getMoreChildren(element) {
        this.myProvider = element;
        return Promise.resolve([]);
    }
    async refresh() {
        this.myProvider?.refresh(this);
    }
    async activate() {
        super.activate();
        this.myProvider?.refresh(this);
    }
    async deactivate() {
        super.deactivate();
        this.myProvider?.refresh(this);
    }
    listenerSaveEvent() {
        vscode_1.workspace.onDidSaveTextDocument((document) => {
        });
    }
}
exports.TemplateAnalyzerGate = TemplateAnalyzerGate;
//# sourceMappingURL=template-analyzer-gate.js.map