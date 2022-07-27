import * as vscode from 'vscode';
import { TextDocument, Uri, workspace } from 'vscode';
import { GatesProvider } from '../gate-provider';
import { Category } from '../tree-item-class/category';
import { File } from '../tree-item-class/file';
import { Gate } from '../tree-item-class/gate';
import { TreeItem } from '../tree-item-class/tree-item';
import { getFiles, kubesec } from './kubesec';

//const kubesecData= kubesec();


export class KubesecGate extends Gate
{

    public myProvider:GatesProvider|undefined;
    
      
    constructor(public isActive:boolean=false){

    
      super("Kubesec", vscode.TreeItemCollapsibleState.Collapsed, 'gates.refreshEntry', isActive, 'kubesec');
    //   command = {
    //     "title": "",
    //     "command": "kubesec.showData",
    //     arguments:[this],
    //     tooltip:' '
    // };
    // //super("Kubesec", vscode.TreeItemCollapsibleState.Collapsed, 'gates.refreshEntry', isActive, 'kubesec');
    // this.command=command; 

      // vscode.commands.executeCommand('setContext', 'kubesecActive', isActive);
      //this.setIsActive(isActive);
      this.listenerSaveEvent();
    }

    
  
    getTreeItem(element: File): vscode.TreeItem {
      return element;
    }

    public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem>|undefined):Thenable<TreeItem[]> {
      this.myProvider=<GatesProvider>element;
      return this.getIsActive()===true?
      Promise.resolve([new Category("Critical",vscode.TreeItemCollapsibleState.Collapsed),
      new Category("Passed",vscode.TreeItemCollapsibleState.Collapsed),
      new Category("Advise",vscode.TreeItemCollapsibleState.Collapsed)]):
      Promise.resolve([]);
    }

    public refresh(){
      this.myProvider?.refresh();
    }

    public listenerSaveEvent() {
      let arrResult: string[] = [];
      workspace.onDidSaveTextDocument((document: TextDocument) => {
          arrResult=[];
          console.log(document.fileName);
          document.languageId === "yaml" && document.uri.scheme === "file" ?
          arrResult.push(document.fileName):
          arrResult;


          arrResult.length>0?
          //console.log('change'):
          //this.command?.command:
          this.myProvider?.refresh():
          console.log('no yaml file has changes');
      });
  
    
      
      
  }
  

  //   readonly _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> = new vscode.EventEmitter<TreeItem | undefined | null | void>();
  // readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  // public refresh(): void {
  //   this._onDidChangeTreeData.fire();
  // }
  
  //   getChildren(element?: File|undefined): Thenable<File[]> {
  //     //return element === undefined?   
  //     return Promise.resolve(this.getYamlFiles());
  //     // Promise.resolve([
  //     //   new File("critical",vscode.TreeItemCollapsibleState.None),
  //     //   new File("passed",vscode.TreeItemCollapsibleState.None),
  //     //   new File("advise",vscode.TreeItemCollapsibleState.None),
  //     // ]);    
  // }

  // async getYamlFiles(){
  //   const files=await getFiles();
  //   return files.map(function (path:string) {
  //       return new File(path,path.slice(path.lastIndexOf('\\')+1),vscode.TreeItemCollapsibleState.None);
  //   });
  // }
}






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
//   }
  