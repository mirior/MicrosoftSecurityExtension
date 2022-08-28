import * as vscode from 'vscode';
import { TreeItem } from '../../../treeItemClasses/tree-item';

export class ReasonItem extends TreeItem {
  constructor(
    public readonly location: any,
    public readonly massage: string,
    public readonly command?: vscode.Command,
  ) {
    super(massage, vscode.TreeItemCollapsibleState.None);
    this.command = command;
  }
};