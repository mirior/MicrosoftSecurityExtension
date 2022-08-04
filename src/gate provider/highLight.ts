import * as vscode from 'vscode';

export function highLightTextInFile(lineNumber:number,numOfTabs:number){
let wordDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration:'underline red',
    overviewRulerColor: 'red',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
        // this color will be used in light color themes
        borderColor: 'black'
    },
    dark: {
        // this color will be used in dark color themes
        borderColor: 'white'
    }
});
  const text = vscode.window.activeTextEditor?.document.getText();
  let lineToHighLight: vscode.DecorationOptions[]=[]  ;
    if(text){
    const line = vscode.window.activeTextEditor?.document.lineAt(lineNumber);
if(line )
{
    const numOfCharacters=numOfTabs*2;
          const decoration = { range: new vscode.Range(new vscode.Position(line.lineNumber,numOfCharacters), line.range.end) };//, hoverMessage: 'Number **' + start + '**'
            lineToHighLight.push(decoration);//line.range.start
  }
  vscode.window.activeTextEditor?.setDecorations(wordDecorationType, lineToHighLight);
}


}