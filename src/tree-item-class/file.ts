import * as vscode from 'vscode';
import { kubesec } from '../kubesec/kubesec';
import {  ScoringItem } from './scoring';
import { TreeItem } from './tree-item';

export class File extends TreeItem {
    constructor(
      public readonly path: string,
      public readonly fileName: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState,
      public scoringRes:[],
      public readonly command?: vscode.Command,

    ) {
      command = {
        "title": "",
        "command": "kubesec.showData",
        arguments:[path],
        tooltip:' '
    };
      super(fileName, collapsibleState);
      this.command=command; 
      //public children:TreeItem[]= | undefined;
      //this.resourceUri=new Uri(path,true);          
    }   
    public scoring:[]=this.scoringRes;

    
    async getYamlFiles(label:string){
        let files=(await kubesec());
        switch(label){
        case 'Critical':files=files.filter((element)=>{return element.kubesecResult[0].scoring?.critical?.length>0;});break;
        case 'Passed':files=files.filter((element)=>{return element.kubesecResult[0].scoring?.passed?.length>0;});break;
        case 'Advise':files=files.filter((element)=>{return element.kubesecResult[0].scoring?.advise?.length>0;});
      }
        return files.map(function (obj) {
          return new File(obj.filePath,obj.filePath.slice(obj.filePath.lastIndexOf('\\')+1),vscode.TreeItemCollapsibleState.None,
          obj.kubesecResult[0]);
      });    
      }

    public getMoreChildren(element?: vscode.TreeDataProvider<TreeItem>|undefined):Thenable<TreeItem[]> {
        return Promise.resolve(this.scoring.map(function (obj) {
          return new ScoringItem(obj['id'],obj['selector'],obj['reason']);
      }));
      }
};