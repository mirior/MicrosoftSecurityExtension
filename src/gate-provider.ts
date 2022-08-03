import path = require('path');
import * as vscode from 'vscode';
import { KubesecGate } from './kubesec/kubesec-gate';
import { Gate } from './tree item models/gate';
import { TreeItem } from './tree item models/tree-item';


export class GatesProvider implements vscode.TreeDataProvider<TreeItem> {
  public gates: Gate[];
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

 

  constructor() {
    const configuredView =vscode.workspace.getConfiguration().get('microsoft.security.gate.gates.activity.settings');
		const gates_activity_settings:any = Object.assign({}, configuredView);

    this.gates = [new KubesecGate(gates_activity_settings["Kubesec"]),
    new Gate("Gate2", vscode.TreeItemCollapsibleState.Collapsed,'',gates_activity_settings["Kubesec"]),
    new Gate("Gate3", vscode.TreeItemCollapsibleState.None,'',gates_activity_settings["Kubesec"]),
    new Gate("Gate4", vscode.TreeItemCollapsibleState.None,'',gates_activity_settings["Kubesec"])];    
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
    this.gates.forEach((gate) => { return gate.setIsActive(true); });
    this.refresh();
  }

  refresh(treeItem?:TreeItem): void {
    treeItem?
    this._onDidChangeTreeData.fire(treeItem):
    this._onDidChangeTreeData.fire();
  }

  
}