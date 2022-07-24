import * as vscode from 'vscode';

export class Gate extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
      super(label, collapsibleState);
      // vscode.commands.registerCommand('gate.errors',()=>{
      //   this.setViewAsErrors();
      // });
  
    }
    private isActive:boolean=true;
    private viewAsErrors:boolean=false;
    iconPath = {
      light: '../resources/light',
      dark: '../resources/dark',
    
  };
  
  public setViewAsErrors(value?:boolean){
  
    this.viewAsErrors=value?value:!this.viewAsErrors;
    
  }
  
  public setActive(value:boolean){
    this.isActive=value;  
  }
  
  }
  