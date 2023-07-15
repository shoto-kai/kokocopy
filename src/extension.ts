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

function createHighlight(highlights: Highlight[], newStartLine: number, newStartChar: number, newEndLine: number, newEndChar: number) {
	let doCreate = true;
	
	for (let i = highlights.length - 1; i >= 0; i--) {
		let highlight = highlights[i];
        let startLine = highlight.start.line;
        let startChar = highlight.start.character;
        let endLine = highlight.end.line;
        let endChar = highlight.end.character;

		let newTextHeight = newEndLine - newStartLine;
		if(startLine == endLine && startLine == newStartLine) {
			if(newTextHeight == 0){
				let newTextLength = newEndChar - newStartChar;
				if(startChar >= newStartChar) {
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar + newTextLength},
						end: {line: endLine, character: endChar + newTextLength},
					};
					highlights.splice(i, 1, changedHighlight);
					continue;
				} else if(endChar >= newStartChar){
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar},
						end: {line: endLine, character: endChar + newTextLength},
					};
					highlights.splice(i, 1, changedHighlight);
					doCreate = false;
					continue;
				}
			} else if(newTextHeight > 0){
				if(startChar >= newStartChar) {
					let changedHighlight: Highlight = {
						start: {line: startLine + newTextHeight, character: startChar + newEndChar},
						end: {line: endLine + newTextHeight, character: endChar + newEndChar},
					};
					highlights.splice(i, 1, changedHighlight);
					continue;
				} else if(endChar >= newStartChar){
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar},
						end: {line: endLine + newTextHeight, character: endChar - newStartChar + newEndChar},
					};
					highlights.splice(i, 1, changedHighlight);
					doCreate = false;
					continue;
				}
			}
		} else if(startLine != endLine && startLine <= newStartLine && endLine >= newStartLine){
			if(newTextHeight == 0){
				let newTextLength = newEndChar - newStartChar;
				if(startLine == newStartLine) {
					if(startChar >= newStartChar) {
						let changedHighlight: Highlight = {
							start: {line: startLine, character: startChar + newTextLength},
							end: {line: endLine, character: endChar},
						};
						highlights.splice(i, 1, changedHighlight);
						continue;
					} else {
						doCreate = false;
						continue;
					}
				} else if(endLine == newStartLine) {
					if(endChar >= newStartChar) {
						let changedHighlight: Highlight = {
							start: {line: startLine, character: startChar},
							end: {line: endLine, character: endChar + newTextLength},
						};
						highlights.splice(i, 1, changedHighlight);
						continue;
					} else {
						doCreate = false;
						continue;
					}
				} else {
					doCreate = false;
					continue;
				}
			}else if(newTextHeight > 0) {
				if(startLine == newStartLine) {
					if(startChar >= newStartChar) {
						let changedHighlight: Highlight = {
							start: {line: startLine + newTextHeight, character: newEndChar + startChar - newStartChar},
							end: {line: endLine + newTextHeight, character: endChar},
						};
						highlights.splice(i, 1, changedHighlight);
						continue;
					} else {
						let changedHighlight: Highlight = {
							start: {line: startLine, character: startChar},
							end: {line: endLine + newTextHeight, character: endChar},
						};
						highlights.splice(i, 1, changedHighlight);
						doCreate = false;
						continue;
					}
				} else if(endLine == newStartLine) {
					if(endChar >= newStartChar) {
						let changedHighlight: Highlight = {
							start: {line: startLine, character: startChar},
							end: {line: endLine + newTextHeight, character: endChar + newEndChar},
						};
						highlights.splice(i, 1, changedHighlight);
						doCreate = false;
						continue;
					}
				} else {
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar},
						end: {line: endLine + newTextHeight, character: endChar},
					};
					highlights.splice(i, 1, changedHighlight);
					doCreate = false;
					continue;
				}
			}
		} else if(startLine > newStartLine) {
			let changedHighlight: Highlight = {
				start: {line: startLine+ newTextHeight, character: startChar},
				end: {line: endLine + newTextHeight, character: endChar},
			};
			highlights.splice(i, 1, changedHighlight);
			continue;
		}
	}

	if(doCreate) {
		let createdHighlight: Highlight = {
			start: {line: newStartLine, character: newStartChar},
			end: {line: newEndLine, character: newEndChar},
		};
		highlights.push(createdHighlight);
	}
}

function editHighlight(highlights: Highlight[], editedLine: number, editedCharacter: number) {
	for (let i = highlights.length - 1; i >= 0; i--) {
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
            } else if(startLine == editedLine && startChar >= editedCharacter){
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

function pressEnterKey(highlights: Highlight[], enterLine: number, enterChar: number) {
	for (let i = highlights.length - 1; i >= 0; i--) {
        let highlight = highlights[i];
        let startLine = highlight.start.line;
        let startChar = highlight.start.character;
        let endLine = highlight.end.line;
        let endChar = highlight.end.character;

		if(startLine > enterLine || (startLine == enterLine && startChar >= enterChar)) {
			let changedHighlight: Highlight = {
				start: {line: startLine + 1, character: startChar},
				end: {line: endLine + 1, character: endChar},
			};
			highlights.splice(i, 1, changedHighlight);
		} else if((startLine == enterLine && startChar < enterChar) || (startLine < enterLine && endLine > enterLine)) {
			let changedHighlight: Highlight = {
				start: {line: startLine, character: startChar},
				end: {line: endLine + 1, character: endChar},
			};
			highlights.splice(i, 1, changedHighlight);
		} else if(endLine == enterLine && endChar >=  enterChar) {
			let changedHighlight: Highlight = {
				start: {line: startLine, character: startChar},
				end: {line: endLine + 1, character: endChar - enterChar},
			};
			highlights.splice(i, 1, changedHighlight);
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

// function getRandomColorCode(): string {
// 	const letters = "0123456789ABCDEF";
// 	let colorCode = "#";

// 	for (let i = 0; i < 6; i++) {
// 	  colorCode += letters[Math.floor(Math.random() * 16)];
// 	}

// 	return colorCode;
// }

const highlightDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: "#C7B2D6"
});

export function activate(context: vscode.ExtensionContext) {
	const editor = vscode.window.activeTextEditor;

	let isButtonActive = false;

    let myCommandId = 'myExtension.toggleMyCommand';

    // ステータスバーにボタンを追加
    let myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    myStatusBarItem.command = myCommandId;
    myStatusBarItem.text = 'コピペを隠す';
    myStatusBarItem.tooltip = 'コピペされたコードの表示・非表示を切り替えます';
    myStatusBarItem.show();
    context.subscriptions.push(myStatusBarItem);

    // コマンドの登録
    let disposable = vscode.commands.registerCommand(myCommandId, () => {
		if(editor) {
			// ボタンがクリックされたときの処理
			isButtonActive = !isButtonActive; // ボタンの状態を反転させる
			if(isButtonActive){
				myStatusBarItem.text = "ここコピー！";
				vscode.window.showInformationMessage("コピペを隠しました");
				editor.setDecorations(highlightDecoration, []);
			} else {
				myStatusBarItem.text = "コピペを隠す";
				vscode.window.showInformationMessage("ここコピーです！！");
				editor.setDecorations(highlightDecoration, []);
				decorate(editor,highlightDecoration, highlights);
			}
		}
    });

    context.subscriptions.push(disposable);

	console.log("読み込み完了");

	vscode.workspace.onDidChangeTextDocument((event) => {
		// 現在アクティブなエディタが存在し、そのドキュメントが変更されたものと一致する場合にのみ処理を進める。
		if (editor && editor.document === event.document) {
			let changes = event.contentChanges;

			
			

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
					const lastLineLength = addedTextLines[addedTextLines.length - 1].length;
					const endLine = start.line + addedLines;
					const endChar = addedLines > 0 ? lastLineLength : start.character + lastLineLength;

					createHighlight(highlights, start.line,start.character,endLine,endChar);
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

				} else if(changes[0].text.length != 0) {
					if(changes[0].text=="\n"){
						pressEnterKey(highlights, change.range.start.line, change.range.start.character);
					} else {
						editHighlight(highlights, change.range.start.line, change.range.start.character);
						console.log("うわあああああ",highlights);
					}
				}
			}
			// デコレーションをエディタに適用します
			editor.setDecorations(highlightDecoration, []);
			decorate(editor,highlightDecoration, highlights);
		}
	});
}

export function deactivate() { }
