import * as vscode from 'vscode';
import { Gate } from './gate';

export class GatesProvider implements vscode.TreeDataProvider<Gate> {
    constructor() {
      this.getChildren();
    }
  
    
  
    getTreeItem(element: Gate): vscode.TreeItem {
      return element;
    }
  
    getChildren(element?: Gate): Thenable<Gate[]> {    
      return Promise.resolve([new Gate("Gate1", vscode.TreeItemCollapsibleState.None),
      new Gate("Gate2",vscode.TreeItemCollapsibleState.None),
      new Gate("Gate3", vscode.TreeItemCollapsibleState.None),
      new Gate("Gate4", vscode.TreeItemCollapsibleState.None)]);
             
    }
  
    public setAllViewAsErrors(value?:boolean){
  
      // this.getChildren().forEach(element => {
        
      // });   
    }
  }