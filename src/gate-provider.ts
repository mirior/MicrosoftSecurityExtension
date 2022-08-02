import path = require('path');
import * as vscode from 'vscode';
import { KubesecGate } from './kubesec/kubesec-gate';
import { Gate } from './tree item classes/gate';
import { TreeItem } from './tree item classes/tree-item';
const { readFileSync } = require('fs');

// const reg = new FinalizationRegistry((testament: TestTestament) => {
//   console.log(`Test #${testament.id} has been garbage collected`);
//   clearInterval(testament.intervalid);
// });

export class GatesProvider implements vscode.TreeDataProvider<TreeItem> {
  public gates: Gate[];
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

 

  constructor() {

    const path = "C:\\Users\\This_user\\Documents\\microsoft-security-gate\\.vscode\\activity-settings.json";
    

    //const path = "../.vscode/activity-settings.json";
    const data = readFileSync(path);
    const activationData=JSON.parse(data);

    this.gates = [new KubesecGate(activationData.Kubesec),
    new Gate("Gate2", vscode.TreeItemCollapsibleState.None, '',activationData.Gate2),
    new Gate("Gate3", vscode.TreeItemCollapsibleState.None, '',activationData.gate3),
    new Gate("Gate4", vscode.TreeItemCollapsibleState.None, '',activationData.Gate4)];    
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

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  
}