import path = require('path');
import * as vscode from 'vscode';
import { Gate } from './gates/gate';
import { KubesecGate } from './gates/kubesec/kubesec-gate';
import { TemplateAnalyzerGate } from './gates/template analyzer/template-analyzer-gate';
import { TreeItem } from './tree-item';



export class GatesProvider implements vscode.TreeDataProvider<TreeItem> {
  public gates: Gate[];
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {
    const configuredView = vscode.workspace.getConfiguration().get('microsoft.security.gate.gates.activity.settings');
    const gates_activity_settings: any = Object.assign({}, configuredView);

    this.gates = [new KubesecGate(gates_activity_settings["kubesec"]),
    new TemplateAnalyzerGate(gates_activity_settings["templateAnalyzer"])];
  }

  getTreeItem(element: Gate): vscode.TreeItem {
    return element;
  }

  getChildren(element?: TreeItem | undefined): Thenable<TreeItem[]> {
    return element === undefined ?
      Promise.resolve(this.gates) :
      element.getMoreChildren(this);
  }

  activeAllGates() {
    this.gates.forEach((gate) => { return gate.activate(); });
    this.refresh();
  }

  refresh(treeItem?: TreeItem): void {
    treeItem ?
      this._onDidChangeTreeData.fire(treeItem) :
      this._onDidChangeTreeData.fire();
  }


}