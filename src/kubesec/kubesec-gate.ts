import * as vscode from 'vscode';
import { TextDocument, Uri, workspace } from 'vscode';
import { GatesProvider } from '../gate-provider';
import { Category } from '../tree item models/category';
import { File } from '../tree item models/file';
import { Gate } from '../tree item models/gate';
import { TreeItem } from '../tree item models/tree-item';
import { kubesec, sendFileToKubesec } from './kubesec';

export class KubesecGate extends Gate {

  public myProvider: GatesProvider | undefined;
  public data: { filePath: string; kubesecResult: any; }[] = [];

  constructor(public isActive: boolean) {
    super("Kubesec", vscode.TreeItemCollapsibleState.Collapsed, 'kubesec', isActive);
    this.listenerSaveEvent();

  }

  getTreeItem(element: File): vscode.TreeItem {
    return element;
  }


  public async getMoreChildren(element?: vscode.TreeDataProvider<TreeItem> | undefined): Promise<TreeItem[]> {
    this.myProvider = <GatesProvider>element;
    if (this.getIsActive() === true) {
      this.data.length === 0 ? this.data = await kubesec() : this.data;
      let criticalData = this.data.filter((element) => { return element.kubesecResult[0].scoring?.critical?.length > 0; });
      let passedData = this.data.filter((element) => { return element.kubesecResult[0].scoring?.passed?.length > 0; });
      let adviseData = this.data.filter((element) => { return element.kubesecResult[0].scoring?.advise?.length > 0; });
      return Promise.resolve([new Category("Critical", vscode.TreeItemCollapsibleState.Collapsed, criticalData),
      new Category("Passed", vscode.TreeItemCollapsibleState.Collapsed, passedData),
      new Category("Advise", vscode.TreeItemCollapsibleState.Collapsed, adviseData)]);

    }
    else {
      return Promise.resolve([]);
    }

  }

  public async refresh(changeFiles: string[] | undefined) {

    if (changeFiles) {
      this.data = this.data.filter(elem => !changeFiles?.includes(elem.filePath));
      for (const file of changeFiles) {
        this.data.push(
          {
            'filePath': file,
            'kubesecResult': await sendFileToKubesec(file)
          });
      }
      this.myProvider?.refresh(this);

    }
  }

  public async activate() {
    super.activate();
    this.data = [];
    this.myProvider?.refresh(this);
  }

  public async deactivate() {
    super.deactivate();
    this.myProvider?.refresh(this);
  }

  public listenerSaveEvent() {
    let arrResult: string[] = [];
    workspace.onDidSaveTextDocument((document: TextDocument) => {
      arrResult = [];
      document.uri.scheme === "file" && document.languageId === "yaml" ?
        arrResult.push(document.fileName) :
        arrResult;

      arrResult.length > 0 ?
        this.refresh(arrResult) :
        console.log('no yaml file has changes');
    });
  }



}
