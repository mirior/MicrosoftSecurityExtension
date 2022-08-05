import * as vscode from 'vscode';
import { TextDocument, Uri, workspace } from 'vscode';
import { GatesProvider } from '../../gate-provider';
import { TreeItem } from '../../tree-item';
import { Gate } from '../gate';


export class TemplateAnalyzerGate extends Gate {

    public myProvider: GatesProvider | undefined;

    constructor(public isActive: boolean) {
        super("Template Analyzer", vscode.TreeItemCollapsibleState.Collapsed, 'templateAnalyzer', isActive);
        this.listenerSaveEvent();

    }

    getTreeItem(element: TreeItem): vscode.TreeItem {
        return element;
    }


    public async getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Promise<TreeItem[]> {
        this.myProvider = <GatesProvider>element;
        return Promise.resolve([]);
    }

    public async refresh() {
        this.myProvider?.refresh(this);
    }

    public async activate() {
        super.activate();
        this.myProvider?.refresh(this);
    }

    public async deactivate() {
        super.deactivate();
        this.myProvider?.refresh(this);
    }

    public listenerSaveEvent() {
        workspace.onDidSaveTextDocument((document: TextDocument) => {
           
        });
    }



}
