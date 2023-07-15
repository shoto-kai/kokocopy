import * as vscode from "vscode";

function detectInputLanguage(inputString: string): string {
    if (/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]*$/u.test(inputString)) {
        return "Japanese";
    } else {
        return "NotJapanese";
    }
}

export function activate(context: vscode.ExtensionContext) {
	console.log("読み込み完了");

	const highlightDecoration = vscode.window.createTextEditorDecorationType({
		backgroundColor: "yellow",
	});

	vscode.workspace.onDidChangeTextDocument((event) => {
		const editor = vscode.window.activeTextEditor;

		// 現在アクティブなエディタが存在し、そのドキュメントが変更されたものと一致する場合にのみ処理を進める。
		if (editor && editor.document === event.document) {
			let changes = event.contentChanges;
            let decorationsArray: vscode.DecorationOptions[] = [];

			for (const change of changes) {
				if (changes[0].text.length > 1 && detectInputLanguage(change.text) === "NotJapanese") {
					const start = change.range.start;

					// addedTextLinesには追加されたテキストを改行で分割したものが格納される
					const addedTextLines = change.text.split('\n');
					// 追加された行数は、addedTextLinesの長さから1を引くことで得られる（初めの行は元の行を含むため）
					const addedLines = addedTextLines.length - 1;
					// 最後の行の長さは、addedTextLinesの最後の要素の長さになる
					const lastLineLength = addedTextLines[addedTextLines.length - 1].length;

					const endLine = start.line + addedLines;
					const endChar = addedLines > 0 ? lastLineLength : start.character + lastLineLength;

					const end = new vscode.Position(endLine, endChar);

					console.log(`追加されたテキストの開始行: ${start.line}, 列: ${start.character}`);
					console.log(`追加されたテキストの終了行: ${end.line}, 列: ${end.character}`);

					const decoration = { range: new vscode.Range(start, end) };

                    decorationsArray.push(decoration);
				}
			}
			// デコレーションをエディタに適用します
            editor.setDecorations(highlightDecoration, decorationsArray);
		}
	});
}

export function deactivate() { }
