
import axios from "axios";
import { readFileSync } from "fs";
import {  CustomGate } from "../customGate/customer-gate";
import { FileMessages, GateData, GateResult, Location, ResultsList } from "../customGate/gate-data";
import { GetFileSettings } from "../customGate/gate-functions";




export class MyGate extends CustomGate {
    
    label: string = "kubesec gate";
    description: string = "gate for yaml files";
    private outputChannel = this.createOutputChannel("kubesec-output-channel");
    labels: string[] = ["critical", "passed", "advise"];
    private myData!: GateData;
    public changedContext="myKubesecGate";
    public contextValue?: string | undefined="gate";
  

    public async scanData(): Promise<GateData> {
        this.myData?.data?.splice(0, this.myData.data.length);
        let arr: { filePath: string; kubesecResult: any }[] = [];
        //writeKubesecResultsToOutput(_kubesecResults,MDCOutputChannel);   
        await this.getKubesec().then((data) => {
            arr = data;
        }).then(() => {
            arr.map((value) => {
                let labelGate: string = "";

                value.kubesecResult[0]?.scoring?.critical?.length > 0 ? labelGate = this.labels[0] : labelGate;
                value.kubesecResult[0]?.scoring?.passed?.length > 0 ? labelGate = this.labels[1] : labelGate;
                value.kubesecResult[0]?.scoring?.advise?.length > 0 ? labelGate = this.labels[2] : labelGate;

                // this.myData.data.push(  { fileName: value.filePath.slice(value.filePath.lastIndexOf('\\') + 1), filePath: value.filePath, result: value.kubesecResult });
            });
        });
        this.myData = new GateData();
        this.myData.data = [];
        this.myData.data.push(new ResultsList("critical", [new FileMessages("C:/Users/user1/.vscode/extensions/MicrosoftSecurityExtension/src/yaml files/criti.yaml", "criti.yaml", [new GateResult(new Location(4),"very bad problem")])]));
        return this.myData;
    }

    public async getKubesec(): Promise<{ filePath: string; kubesecResult: any }[]> {
        let _kubesecResults: { filePath: string; kubesecResult: any[] }[] = [];
        let myFiles: string[] = [];
        myFiles = await this.getFiles(new GetFileSettings([".yaml"]));
        for (const file of myFiles) {
            //  appendLineToOutputChannel(MDCOutputChannel,"send "+file+" file for checking");
            const myFile = readFileSync(file, 'utf-8');
            const response = await
                axios({
                    method: "post",
                    url: 'https://v2.kubesec.io/scan',
                    data: Buffer.from(myFile),
                    headers:
                    {
                        "Content-Type": `text/yaml`
                    }
                });
            _kubesecResults.push(
                {
                    'filePath': file,
                    'kubesecResult': response.data
                });
        }

        return _kubesecResults;
    }

}







