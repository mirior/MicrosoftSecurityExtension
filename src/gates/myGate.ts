import { CustomGate } from "../customGate/customer-gate";
import { GateData } from "../customGate/gate-data";


export class Gate2 extends CustomGate {
    
    contextValue?: string | undefined = "gate";
    public changedContext: string = "gate2";
    
    constructor() {
        super("22");

    }

    labels: string[] = ["oo"];
    label: string = "Gate2";
    description: string = "";

    public scanData(): Promise<GateData> {
        throw new Error("Method not implemented.");
    }

}