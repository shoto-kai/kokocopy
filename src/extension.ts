import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	
	let disposable = vscode.commands.registerCommand(
		"vscode-detect-snippet.helloWorld",
		() => {
			vscode.window.showInformationMessage(
				"Hello World from vscode-detect_snippet!"
			);
			console.log("test");
		}
	);

	vscode.workspace.onDidChangeTextDocument(event => {
        let changes = event.contentChanges;
		console.log(changes);
    });

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
