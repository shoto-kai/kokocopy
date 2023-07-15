import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

interface Position {
    line: number;
    character: number;
}

interface Highlight {
    start: Position;
    end: Position;
}

function createHighlight(startLine: number, startChar: number, endLine: number, endChar: number) {
	let createdHighlight: Highlight = {
		start: {line: startLine, character: startChar},
		end: {line: endLine, character: endChar},
	};
	highlights.push(createdHighlight);
}

function editHighlight(highlights: Highlight[], editedLine: number, editedCharacter: number) {
    for (let i = 0; i < highlights.length; i++) {
        let highlight = highlights[i];
        let startLine = highlight.start.line;
        let startChar = highlight.start.character;
        let endLine = highlight.end.line;
        let endChar = highlight.end.character;
        
        // Check if the edit is inside this highlight
        if (startLine <= editedLine && editedLine <= endLine) {
            if ((startLine != editedLine || startChar < editedCharacter) &&
                (endLine != editedLine || endChar > editedCharacter)) {
                // Edit is inside this highlight, split it into two
                let firstHighlight: Highlight = {
                    start: {line: startLine, character: startChar},
                    end: {line: editedLine, character: editedCharacter},
                };
                let secondHighlight: Highlight = {
                    start: {line: editedLine, character: editedCharacter + 1},
                    end: {line: endLine, character: endChar+ 1 },
                };
                highlights.splice(i, 1, firstHighlight, secondHighlight);
                continue;
            } else if(startLine == editedLine && startChar == editedCharacter){
				let changedHighlight: Highlight = {
                    start: {line: startLine, character: startChar + 1},
                    end: {line: endLine, character: endChar +1},
                };
				highlights.splice(i, 1, changedHighlight);
                continue;
			}
        }
    }
}

// Given highlights
let highlights: Highlight[] = [];

function decorate(editor: vscode.TextEditor, decorationType: vscode.TextEditorDecorationType, ranges: { start: { line: number, character: number }, end: { line: number, character: number } }[]) {
		const decorations = ranges.map(range => {
            // ハイライトを適用する範囲をVS CodeのRangeオブジェクトに変換
            const start = new vscode.Position(range.start.line, range.start.character);
            const end = new vscode.Position(range.end.line, range.end.character);
            return { range: new vscode.Range(start, end) };
        });

        // 装飾をエディタに適用
        editor.setDecorations(decorationType, decorations);
}

function detectInputLanguage(inputString: string): string {
	if (
		/^[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]*$/u.test(
			inputString
		)
	) {
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
				if (
					changes[0].text.length > 1 &&
					detectInputLanguage(change.text) === "NotJapanese"
				) {
					const start = change.range.start;

					// addedTextLinesには追加されたテキストを改行で分割したものが格納される
					const addedTextLines = change.text.split("\n");
					// 追加された行数は、addedTextLinesの長さから1を引くことで得られる（初めの行は元の行を含むため）
					const addedLines = addedTextLines.length - 1;
					// 最後の行の長さは、addedTextLinesの最後の要素の長さになる
					const lastLineLength =
						addedTextLines[addedTextLines.length - 1].length;

					const endLine = start.line + addedLines;
					const endChar =
						addedLines > 0 ? lastLineLength : start.character + lastLineLength;

					const end = new vscode.Position(endLine, endChar);

					console.log(start.line);
					console.log(start.character);
					console.log(endLine);
					console.log(endChar);

					createHighlight(start.line,start.character,endLine,endChar);
					console.log("これっっっ",highlights);

					// const fileName = "example.json";
					// const filePath = path.join(vscode.workspace.rootPath || "", fileName);

					// // 書き込む内容を指定します
					// const jsonData = {
					// 	start: {
					// 		line: start.line,
					// 		character: start.character
					// 	},
					// 	end: {
					// 		line: endLine,
					// 		character: endChar
					// 	}
					// };

					// const content = JSON.stringify(jsonData, null, 2);

					// // ファイルを書き込みモードでオープンします
					// fs.writeFile(filePath, content, (err) => {
					// 	if (err) {
					// 		vscode.window.showErrorMessage("Failed to create text file.");
					// 	} else {
					// 		vscode.window.showInformationMessage(
					// 			"Text file created successfully."
					// 		);
					// 	}
					// });

				} else {
					editHighlight(highlights, change.range.start.line, change.range.start.character);
					console.log("うわあああああ",highlights);
				}
			}
			// デコレーションをエディタに適用します
			editor.setDecorations(highlightDecoration, []);
			decorate(editor,highlightDecoration, highlights);
		}
	});
}

export function deactivate() { }
