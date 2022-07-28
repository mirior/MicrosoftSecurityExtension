import * as vscode from 'vscode';
import { TreeItem } from './tree-item';

export class Gate extends TreeItem {
  private _isActive = this.isActive;
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    //public readonly cmd: string,
    public context: string,
    public isActive: boolean = true,
    public readonly command?: vscode.Command,
  ) {
    // command = {
    //   "title": "",
    //   "command": cmd,
    //   //arguments:[path],
    //   tooltip: ' '
    // };
    super(label, collapsibleState);
    //this.command = command;
    this.contextValue = context;
    this.setIsActive(isActive);  
  }

  public getIsActive() {
    return this._isActive;
  }

  public setIsActive(value: boolean) {
    this._isActive = value;
    vscode.commands.executeCommand('setContext', this.contextValue + 'Active', value);
  }

  public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {
    return Promise.resolve([]);
  }

}
