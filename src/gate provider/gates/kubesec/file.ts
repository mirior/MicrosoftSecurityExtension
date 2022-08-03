import * as vscode from 'vscode';
import { kubesec } from './kubesec';
import { ScoringItem } from './scoring';
import { TreeItem } from '../../tree-item';

export class File extends TreeItem {
  private scoring: [] = this.scoringRes;

  constructor(
    public readonly path: string,
    public readonly fileName: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public scoringRes: [],
    public readonly command?: vscode.Command,
  ) {
    command = {
      "title": "",
      "command": "showTextDocument",
      arguments: [path],
    };
    super(fileName, collapsibleState);
    this.command = command;
  }


  public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {
    let cmdOpenFile = this.command;
    return Promise.resolve(this.scoring.map(function (obj) {
      return new ScoringItem(obj['id'], obj['selector'], obj['reason'], cmdOpenFile);
    }));
  }
};