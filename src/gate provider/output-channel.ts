import * as vscode from 'vscode';
const outputChannelName="MDC-Microsoft Security Gate";

const MDCOutputChannel = vscode.window.createOutputChannel(outputChannelName);

export function appendLineToOutputChannel(message: string) {
    MDCOutputChannel.appendLine(message);
}

export function writeKubesecResultsToOutput(_kubesecResults: any[], MDCOutputChannel: vscode.OutputChannel) {
    const currentKubesecResult = _kubesecResults[_kubesecResults.length - 1].kubesecResult[0];
    const message = "message:" + currentKubesecResult.message + ',\n';
    const scoring = currentKubesecResult.scoring;
    const advise = currentKubesecResult.scoring.advise;
    const passed = currentKubesecResult.scoring.passed;
    const critical = currentKubesecResult.scoring.critical;
    let scoringResult = "";
    if (scoring != {}) {
        scoringResult = scoringResult.concat('scoring:');
        if (advise) {
            scoringResult = scoringResult.concat("advise-");
            advise.forEach((adv: any) => {
                scoringResult = scoringResult.concat("reason:" + adv.reason + ',\n' + "selector:" + adv.selector + ',\n');
            });
        }
        if (passed) {
            scoringResult = scoringResult.concat("passed-");
            passed.forEach((pass: any) => {
                scoringResult = scoringResult.concat("reason:" + pass.reason + ',\n' + "selector:" + pass.selector + ',\n');
            });
        }
        if (critical) {
            scoringResult = scoringResult.concat("critical-");
            critical.forEach((criti: any) => {
                scoringResult = scoringResult.concat("reason:" + criti.reason + ',\n' + "selector:" + criti.selector + ',\n');
            });
        }
    }
    appendLineToOutputChannel("kubesec result:\n" + message + scoringResult);
}






