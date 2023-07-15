import * as vscode from "vscode";

function detectInputLanguage(inputString: string): string {
    if (/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(inputString)) {
        return 'Japanese';
    } else {
        return 'NotJapanese';
    }
}

export function activate(context: vscode.ExtensionContext) {
	console.log("読み込み完了");
	let disposable = vscode.commands.registerCommand(
		"vscode-detect-snippet.helloWorld",
		() => {
			vscode.window.showInformationMessage(
				"Hello World from vscode-detect_snippet!"
			);
		}
	);

	vscode.workspace.onDidChangeTextDocument(event => {
        let changes = event.contentChanges;
		if(changes[0].text.length > 1) {
			if(detectInputLanguage(changes[0].text) === 'NotJapanese'){
				console.log("コピペしたね！");
			}
		}
    });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
