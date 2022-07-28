import * as vscode from 'vscode';
import { TreeItem } from './tree-item';
import { File } from './file';
import { kubesec } from '../kubesec/kubesec';

export class Category extends TreeItem {
  public files:{ filePath: string; kubesecResult: any; }[]=[];

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public data:{ filePath: string; kubesecResult: any; }[]//|undefined

  ) {
    super(label, collapsibleState);
    this.files=data;
  }

  async getYamlFiles(label: string):Promise<TreeItem[]>{
    //let files = (await kubesec());
    switch (label) {
      case 'Critical': //files = files.filter((element) => { return element.kubesecResult[0].scoring?.critical?.length > 0; });
        return this.files?.map(function (obj) {
          return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), vscode.TreeItemCollapsibleState.None,
            obj.kubesecResult[0].scoring.critical);
        });
        case 'Passed': //files = files.filter((element) => { return element.kubesecResult[0].scoring?.passed?.length > 0; });
        return this.files?.map(function (obj) {
          return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), vscode.TreeItemCollapsibleState.Collapsed,
            obj.kubesecResult[0].scoring.passed);
        });
        case 'Advise': //files = files.filter((element) => { return element.kubesecResult[0].scoring?.advise?.length > 0; });
        return this.files?.map(function (obj) {
          return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), vscode.TreeItemCollapsibleState.Collapsed,
            obj.kubesecResult[0].scoring.advise);
        });
    }
    return [];
    // return this.files?.map(function (obj) {
    //   return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), vscode.TreeItemCollapsibleState.Collapsed,
    //     obj.kubesecResult[0].scoring.critical);
    // });
    
  }

  public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {
    return Promise.resolve(this.getYamlFiles(this.label));
  }
};
