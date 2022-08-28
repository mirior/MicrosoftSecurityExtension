import * as vscode from 'vscode';
import { TreeItem } from '../../../treeItemClasses/tree-item';

export class ReasonItem extends TreeItem {
  constructor(
    public readonly location: any,
    public readonly massege: string,
    public readonly command?: vscode.Command,
  ) {
    super(massege, vscode.TreeItemCollapsibleState.None);
    this.command=command;
  }
};