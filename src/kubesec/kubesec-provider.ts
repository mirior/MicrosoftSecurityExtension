import * as vscode from 'vscode';
import { getFiles } from './kubesec';

export class KubesecProvider implements vscode.TreeDataProvider<File> {
    constructor(){
        //getChildren();
    }
        
  
    getTreeItem(element: File): vscode.TreeItem {
      return element;
    }
  
    getChildren(element?: File|undefined): Thenable<File[]> {
      return element === undefined?   
      Promise.resolve(this.getYamlFiles()):
      Promise.resolve([
        // new File("critical",vscode.TreeItemCollapsibleState.None),
        // new File("passed",vscode.TreeItemCollapsibleState.None),
        // new File("advise",vscode.TreeItemCollapsibleState.None),
      ]);    
  }

  async getYamlFiles(){
    const files=await getFiles();
    return files.map(function (path:string) {
        return new File(path,path.slice(path.lastIndexOf('\\')+1),vscode.TreeItemCollapsibleState.None);
    });
  }
}


class File extends vscode.TreeItem {
    constructor(
      public readonly path: string,
      public readonly fileName: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      public readonly command?: vscode.Command

    ) {
      command = {
        "title": "",
        "command": "kubesec.showData",
        arguments:[path],
        tooltip:' '
    };
      super(fileName, collapsibleState);
      this.id=path;
      this.command=command;  
          
    }    
};


//   class TreeItem extends vscode.TreeItem {
//     children: TreeItem[] | undefined;
//     constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, children?: TreeItem[]) {
//       super(
//         label,
//         children === undefined ? vscode.TreeItemCollapsibleState.None :
//           vscode.TreeItemCollapsibleState.Expanded
//       );
//       this.children = children;
//     }
//   }‏
  