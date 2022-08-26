import { TreeDataProvider, TreeItemCollapsibleState } from "vscode";
import { File } from "../tree item classes/file";
import { TreeItem } from "../tree item classes/tree-item";


export class KubesecCategory extends TreeItem {
    public files: {  filePath: string; kubesecResult: any }[] = [];
  
    constructor(
      public readonly label: string,
      public readonly collapsibleState: TreeItemCollapsibleState,
      public data: {  filePath: string; kubesecResult: any; }[]//|undefined
  
    ) {
      super(label, collapsibleState);
      this.files = data;
    }
  
    async getYamlFiles(label: string): Promise<TreeItem[]> {
      //let files = (await kubesec());
      switch (label) {
        case 'Critical': //files = files.filter((element) => { return element.kubesecResult[0].scoring?.critical?.length > 0; });
          return this.files?.map((obj) => {
            return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), TreeItemCollapsibleState.Collapsed,
            obj.kubesecResult[0].scoring.critical);
          });
        case 'Passed': //files = files.filter((element) => { return element.kubesecResult[0].scoring?.passed?.length > 0; });
          return this.files?.map(function (obj) {
            return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), TreeItemCollapsibleState.Collapsed,
              obj.kubesecResult[0].scoring.passed);
          });
        case 'Advise': //files = files.filter((element) => { return element.kubesecResult[0].scoring?.advise?.length > 0; });
          return this.files?.map(function (obj) {
            return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), TreeItemCollapsibleState.Collapsed,
              obj.kubesecResult[0].scoring.advise);
          });
      }
      return [];
      // return this.files?.map(function (obj) {
      //   return new File(obj.filePath, obj.filePath.slice(obj.filePath.lastIndexOf('\\') + 1), vscode.TreeItemCollapsibleState.Collapsed,
      //     obj.kubesecResult[0].scoring.critical);
      // });
  
    }
  
    public getMoreChildren(element?: TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {
      return Promise.resolve(this.files?.map((file) => {
        return new File(file.filePath,file.filePath.slice(file.filePath.lastIndexOf('\\') + 1),TreeItemCollapsibleState.None,file.kubesecResult);
      }));
    }
  };