import * as vscode from 'vscode';
import { TextDocument, workspace } from 'vscode';
import { GateManager } from './gates-manager';
import { KubesecGate } from './kubesec/kubesec-gate';
import { Category } from './tree-item-class/category';
import { File } from './tree-item-class/file';
import { Gate } from './tree-item-class/gate';
import { TreeItem } from './tree-item-class/tree-item';

export class GatesProvider implements vscode.TreeDataProvider<TreeItem> {
  public gates:Gate[];
  // private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  // readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
  public _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  public onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {  
          this.gates=[new KubesecGate(),
          new Gate("Gate2",vscode.TreeItemCollapsibleState.None,''),
          new Gate("Gate3", vscode.TreeItemCollapsibleState.None,''),
          new Gate("Gate4", vscode.TreeItemCollapsibleState.None,'')];      
  }
  
    getTreeItem(element: Gate): vscode.TreeItem {
      return element;
    }
  
    getChildren(element?: TreeItem|undefined): Thenable<TreeItem[]> {    
      return element === undefined? 
      Promise.resolve(this.gates):      
      element.getMoreChildren(this);
    }

    activeAllGates(){
      this.gates.forEach((gate)=>{return gate.setIsActive(true);});
      this.refresh();
    }
 
  
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  
  }