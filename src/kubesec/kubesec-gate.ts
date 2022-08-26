import * as vscode from 'vscode';
import { TextDocument, Uri, workspace } from 'vscode';
import { GatesProvider } from '../gate-provider';
import { Category } from '../tree item classes/category';
import { File } from '../tree item classes/file';
import { Gate } from '../tree item classes/gate';
import { TreeItem } from '../tree item classes/tree-item';
import { getFiles, kubesec, sendFile } from './kubesec';
import { KubesecCategory } from './kubesecCategory';

//const kubesecData= kubesec();


export class KubesecGate extends Gate {
  public myProvider: GatesProvider | undefined;
  public data:{ filePath: string; kubesecResult: any[]; }[]=[];
  
  constructor(public isActive: boolean = false) {

    super("Kubesec", vscode.TreeItemCollapsibleState.Collapsed, 'kubesec', isActive);
    kubesec().then(data=>this.data=data);
    this.listenerSaveEvent();
  }
  getTreeItem(element: File): vscode.TreeItem {
    return element;
  }

  public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {    
    this.myProvider = <GatesProvider>element;

    let criticalData=this.data.filter((element) => { return element.kubesecResult[0].scoring?.critical?.length > 0; });
    let passedData=this.data.filter((element) => { return element.kubesecResult[0].scoring?.passed?.length > 0; });
    let adviseData=this.data.filter((element) => { return element.kubesecResult[0].scoring?.advise?.length > 0; });

    return this.getIsActive() === true ?
      Promise.resolve([new KubesecCategory("Critical", vscode.TreeItemCollapsibleState.Collapsed,criticalData),
      new KubesecCategory("Passed", vscode.TreeItemCollapsibleState.Collapsed,passedData),
      new KubesecCategory("Advise", vscode.TreeItemCollapsibleState.Collapsed,adviseData)]) :
      Promise.resolve([]);
  }

  public async refresh(changeFiles: string[]|undefined) {
    if (changeFiles){
      this.data=this.data.filter((element) => {
         let arr= changeFiles;
         arr=arr.filter(file=>{
          // return file===element.filePath;
          return file.slice(file.indexOf(':'))===element.filePath.slice(file.indexOf(':'));

        });
         return arr.length===0;
        });
        for(const file of changeFiles){
          this.data.push(
              {
                  'filePath':file,
                  'kubesecResult':await sendFile(file)
              });}
      // changeFiles.forEach(element=>{
      //   sendFile(element).then(fileResult=>{
      //     this.data.push({
      //       'filePath':element,
      //       'kubesecResult':fileResult
      //   })
      //     ;}).then( ()=>{this.myProvider?.refresh();}   
      //     );
      // });
      this.myProvider?.refresh();

    }
    // this.myProvider?.refresh();
    // this.myProvider?.getChildren(undefined);

  }

  public async activate() {
    this.setIsActive(true);
    kubesec().then(data=>this.data=data).then(()=>{this.myProvider?.refresh();
    });
    this.listenerSaveEvent();
    //this.myProvider?.getChildren(undefined);

  }

  public async deactivate() {
    this.setIsActive(false);
    this.myProvider?.refresh();
    //this.myProvider?.getChildren(undefined);

  }

  public listenerSaveEvent() {
    let arrResult: string[] = [];
    workspace.onDidSaveTextDocument((document: TextDocument) => {
      arrResult = [];
      console.log(document.fileName);
      document.languageId === "yaml" && document.uri.scheme === "file" ?
        arrResult.push(document.fileName) :
        arrResult;


      arrResult.length > 0 ?
        //this.myProvider?.refresh() :
        this.refresh(arrResult):
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
