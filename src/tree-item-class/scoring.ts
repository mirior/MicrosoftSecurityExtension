import * as vscode from 'vscode';
import { TreeItem } from './tree-item';

export class ScoringItem extends TreeItem {
    constructor(
      public readonly name: string,
      public readonly selector: string,
      public readonly reason: string,      
    ) {
    
      super(reason, vscode.TreeItemCollapsibleState.None);
      
          
    }   
    
    // async getYamlFiles(label:string){
    //     let files=(await kubesec());
    //     switch(label){
    //     case 'Critical':files=files.filter((element)=>{return element.kubesecResult[0].scoring?.critical?.length>0;});break;
    //     case 'Passed':files=files.filter((element)=>{return element.kubesecResult[0].scoring?.passed?.length>0;});break;
    //     case 'Advise':files=files.filter((element)=>{return element.kubesecResult[0].scoring?.advise?.length>0;});
    //   }
    //     return files.map(function (obj) {
    //       return new File(obj.filePath,obj.filePath.slice(obj.filePath.lastIndexOf('\\')+1),vscode.TreeItemCollapsibleState.None,
    //       obj.kubesecResult[0]);
    //   });    
    //   }
      
    
};