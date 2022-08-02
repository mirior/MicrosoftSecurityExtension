import * as vscode from 'vscode';
import { TextDocument, Uri, workspace } from 'vscode';
import { GatesProvider } from '../gate-provider';
import { Category } from '../tree item classes/category';
import { File } from '../tree item classes/file';
import { Gate } from '../tree item classes/gate';
import { TreeItem } from '../tree item classes/tree-item';
import { getFiles, kubesec, sendFile } from './kubesec';

export class KubesecGate extends Gate {
  
  public myProvider: GatesProvider | undefined;
  public data: { filePath: string; kubesecResult: any; }[] = [];

  constructor(public isActive: boolean) {
    super("Kubesec", vscode.TreeItemCollapsibleState.Collapsed, 'kubesec', isActive);
    kubesec().then(data => this.data = data);
    this.listenerSaveEvent();
  }
  
  getTreeItem(element: File): vscode.TreeItem {
    return element;
  }

  public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Thenable<TreeItem[]> {
    this.myProvider = <GatesProvider>element;

    let criticalData = this.data.filter((element) => { return element.kubesecResult[0].scoring?.critical?.length > 0; });
    let passedData = this.data.filter((element) => { return element.kubesecResult[0].scoring?.passed?.length > 0; });
    let adviseData = this.data.filter((element) => { return element.kubesecResult[0].scoring?.advise?.length > 0; });

    return this.getIsActive() === true ?
      Promise.resolve([new Category("Critical", vscode.TreeItemCollapsibleState.Collapsed, criticalData),
      new Category("Passed", vscode.TreeItemCollapsibleState.Collapsed, passedData),
      new Category("Advise", vscode.TreeItemCollapsibleState.Collapsed, adviseData)]) :
      Promise.resolve([]);
  }

  public async refresh(changeFiles: string[] | undefined) {
    // if (changeFiles) {
    //   this.data = this.data.filter((element) => {
    //     let arr = changeFiles;
    //     arr = arr.filter(file => {
    //       return file.slice(file.indexOf(':')) === element.filePath.slice(file.indexOf(':'));
    //     });
    //     return arr.length === 0;
    //   });
    if (changeFiles) {
      this.data = this.data.filter((element) => {
        changeFiles.filter(file => {
          return file.slice(file.indexOf(':')) === element.filePath.slice(file.indexOf(':'));
        }).length === 0;
      });
      for (const file of changeFiles) {
        this.data.push(
          {
            'filePath': file,
            'kubesecResult': await sendFile(file)
          });
      }
      this.myProvider?.refresh();

    }    
  }

  public async activate() {
    this.setIsActive(true);
    kubesec().then(data => this.data = data).then(() => {
      this.myProvider?.refresh();
    });
    this.listenerSaveEvent();
  }

  public async deactivate() {
    this.setIsActive(false);
    this.myProvider?.refresh();    
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
        this.refresh(arrResult) :
        console.log('no yaml file has changes');
    });
  }


  
}
