import * as vscode from 'vscode';
import { KubesecGate } from './kubesec/kubesec-gate';
import { Gate } from './tree-item-class/gate';

export class GateManager{
    public gates:Gate[];
    constructor() {  
            this.gates=[new KubesecGate(),
            new Gate("Gate2",vscode.TreeItemCollapsibleState.None,''),
            new Gate("Gate3", vscode.TreeItemCollapsibleState.None,''),
            new Gate("Gate4", vscode.TreeItemCollapsibleState.None,'')];      
    }
    
}