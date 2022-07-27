import * as vscode from 'vscode';
import { TreeItem } from './tree-item';


  
export class Gate extends TreeItem {
    constructor(
      public readonly label: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      public readonly cmd: string,
      public isActive:boolean=true,
      public context?:string,
      public readonly command?: vscode.Command,

    ) {
        command = {
            "title": "",
            "command": cmd,
            //arguments:[path],
            tooltip:' '
        };
      super(label, collapsibleState);
      this.command=command;
      this.contextValue=context;
      vscode.commands.executeCommand('setContext', this.contextValue + 'Active', isActive);
    }
    
    private _isActive = this.isActive;
    
    public getIsActive() {
      return this._isActive;
    }
    public setIsActive(value:boolean) {
      this._isActive =value;// ? value : (!this._isActive);
      vscode.commands.executeCommand('setContext', this.contextValue +'Active', value);
      //vscode.commands.executeCommand('setContext', 'remove', value);

    } 
  
    public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem>|undefined): Thenable<TreeItem[]>{
      return Promise.resolve([]);
    }
  
    // readonly _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
    // readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
  
    // public refresh(): void {
    //   this._onDidChangeTreeData.fire();
    // }
  }


// export class Gate extends vscode.TreeItem {
//     constructor(
//       public readonly label: string,
//       public readonly collapsibleState: vscode.TreeItemCollapsibleState,
//       private isActive:boolean=true
//     ) {
//       super(label, collapsibleState);      
//     }
//     private _isActive = this.isActive;    
//     public getIsActive() {
//       return this._isActive;
//     }
//     public setIsActive(value:boolean) {
//       this._isActive = value;
//     } 
//   }
