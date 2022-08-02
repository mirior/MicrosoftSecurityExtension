import * as vscode from 'vscode';
import { TreeItem } from './tree-item';
const { writeFileSync,readFileSync } = require('fs');


export class Gate extends TreeItem {
  private _isActive = this.isActive;
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public context: string,
    public isActive: boolean = true,
    public readonly command?: vscode.Command,
  ) {
    super(label, collapsibleState);
    this.contextValue = context;
    this.setIsActive(isActive);
  }

  public getIsActive() {
    return this._isActive;
  }

  public setIsActive(value: boolean) {
    this._isActive = value;
    vscode.commands.executeCommand('setContext', this.contextValue + 'Active', value);

    const path ="C:\\Users\\This_user\\Documents\\microsoft-security-gate\\.vscode\\activity-settings.json";
    const data = readFileSync(path);
    const activationData=JSON.parse(data);
    activationData[this.label]=value;

    try {
      writeFileSync(path, JSON.stringify(activationData, null, 2), 'utf8');
      console.log('Data successfully saved to disk');
    } catch (error) {
      console.log('An error has occurred ', error);
    }

  }

  public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {
    return Promise.resolve([]);
  }

}
