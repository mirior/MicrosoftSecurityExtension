import * as vscode from 'vscode';
import { TreeItem } from '../../tree-item';

export class ScoringItem extends TreeItem {
  constructor(
    public readonly name: string,
    public readonly selector: string,
    public readonly reason: string,
    public readonly command?: vscode.Command,

  ) {
    super(reason, vscode.TreeItemCollapsibleState.None);
    this.command=command;
  }
};