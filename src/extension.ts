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

function createHighlight(fsPath: string, newStartLine: number, newStartChar: number, newEndLine: number, newEndChar: number):Highlight[] {
	let doCreate = true;
	let highlights = readHighlightsLog(fsPath);
	
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
					writeHighlightsLog(fsPath, "splice", i, changedHighlight);
					// highlights.splice(i, 1, changedHighlight);
					continue;
				} else if(endChar >= newStartChar){
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar},
						end: {line: endLine, character: endChar + newTextLength},
					};
					writeHighlightsLog(fsPath, "splice", i, changedHighlight);
					// highlights.splice(i, 1, changedHighlight);
					doCreate = false;
					continue;
				}
			} else if(newTextHeight > 0){
				if(startChar >= newStartChar) {
					let changedHighlight: Highlight = {
						start: {line: startLine + newTextHeight, character: startChar + newEndChar},
						end: {line: endLine + newTextHeight, character: endChar + newEndChar},
					};
					writeHighlightsLog(fsPath, "splice", i, changedHighlight);
					// highlights.splice(i, 1, changedHighlight);
					continue;
				} else if(endChar >= newStartChar){
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar},
						end: {line: endLine + newTextHeight, character: endChar - newStartChar + newEndChar},
					};
					writeHighlightsLog(fsPath, "splice", i, changedHighlight);
					// highlights.splice(i, 1, changedHighlight);
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
						writeHighlightsLog(fsPath, "splice", i, changedHighlight);
						// highlights.splice(i, 1, changedHighlight);
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
						writeHighlightsLog(fsPath, "splice", i, changedHighlight);
						// highlights.splice(i, 1, changedHighlight);
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
						writeHighlightsLog(fsPath, "splice", i, changedHighlight);
						// highlights.splice(i, 1, changedHighlight);
						continue;
					} else {
						let changedHighlight: Highlight = {
							start: {line: startLine, character: startChar},
							end: {line: endLine + newTextHeight, character: endChar},
						};
						writeHighlightsLog(fsPath, "splice", i, changedHighlight);
						// highlights.splice(i, 1, changedHighlight);
						doCreate = false;
						continue;
					}
				} else if(endLine == newStartLine) {
					if(endChar >= newStartChar) {
						let changedHighlight: Highlight = {
							start: {line: startLine, character: startChar},
							end: {line: endLine + newTextHeight, character: endChar + newEndChar},
						};
						writeHighlightsLog(fsPath, "splice", i, changedHighlight);
						// highlights.splice(i, 1, changedHighlight);
						doCreate = false;
						continue;
					}
				} else {
					let changedHighlight: Highlight = {
						start: {line: startLine, character: startChar},
						end: {line: endLine + newTextHeight, character: endChar},
					};
					writeHighlightsLog(fsPath, "splice", i, changedHighlight);
					// highlights.splice(i, 1, changedHighlight);
					doCreate = false;
					continue;
				}
			}
		} else if(startLine > newStartLine) {
			let changedHighlight: Highlight = {
				start: {line: startLine+ newTextHeight, character: startChar},
				end: {line: endLine + newTextHeight, character: endChar},
			};
			writeHighlightsLog(fsPath, "splice", i, changedHighlight);
			// highlights.splice(i, 1, changedHighlight);
			continue;
		}
	}

	if(doCreate) {
		let createdHighlight: Highlight = {
			start: {line: newStartLine, character: newStartChar},
			end: {line: newEndLine, character: newEndChar},
		};
		writeHighlightsLog(fsPath, "push", 0, createdHighlight);
		// highlights.push(createdHighlight);
	}

	return readHighlightsLog(fsPath);
}

function editHighlight(fsPath: string, editedLine: number, editedCharacter: number) {
	let highlights = readHighlightsLog(fsPath);

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
				writeHighlightsLog(fsPath, "splice", i, firstHighlight, secondHighlight);
                // highlights.splice(i, 1, firstHighlight, secondHighlight);
                continue;
            } else if(startLine == editedLine && startChar >= editedCharacter){
				let changedHighlight: Highlight = {
                    start: {line: startLine, character: startChar + 1},
                    end: {line: endLine, character: endChar +1},
                };
				writeHighlightsLog(fsPath, "splice", i, changedHighlight);
				// highlights.splice(i, 1, changedHighlight);
                continue;
			}
        }
    }
}

function pressEnterKey(fsPath: string, enterLine: number, enterChar: number) {
	let highlights = readHighlightsLog(fsPath);

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
			writeHighlightsLog(fsPath, "splice", i, changedHighlight);
			// highlights.splice(i, 1, changedHighlight);
		} else if((startLine == enterLine && startChar < enterChar) || (startLine < enterLine && endLine > enterLine)) {
			let changedHighlight: Highlight = {
				start: {line: startLine, character: startChar},
				end: {line: endLine + 1, character: endChar},
			};
			writeHighlightsLog(fsPath, "splice", i, changedHighlight);
			// highlights.splice(i, 1, changedHighlight);
		} else if(endLine == enterLine && endChar >=  enterChar) {
			let changedHighlight: Highlight = {
				start: {line: startLine, character: startChar},
				end: {line: endLine + 1, character: endChar - enterChar},
			};
			writeHighlightsLog(fsPath, "splice", i, changedHighlight);
			// highlights.splice(i, 1, changedHighlight);
		}
		
	}
}

// let highlights: [] = [];

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

function createLogFile(copyTextLength: number, typeTextLength: number) {
	const fileName = "kokocopy.log";
	const filePath = path.join(vscode.workspace.rootPath || "", fileName);

	const newText = '0 0\n'; // 追記するテキスト

	// ファイルが存在しない場合は作成し、テキストを書き込む
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, newText);
		console.log('The file was created and the text was written.');
	} else {
		// ファイルが存在する場合は、1行目のテキストを取得
		const fileContent = fs.readFileSync(filePath, 'utf-8');
		const lines = fileContent.split('\n');

		const [pre1, pre2] = lines[0].split(' '); // ' '（空白）で文字列を分割して配列にする
		const copyCounts = parseInt(pre1); // parseInt関数を使って文字列を整数に変換
		const typeCounts = parseInt(pre2); // 同上
		
		// // 配列の最初の要素（1行目）を新しいテキストで上書き
		lines[0] = `${copyCounts+copyTextLength} ${typeCounts+typeTextLength}`;
		// // 配列を再び文字列に変換
		const newContent = lines.join('\n');
		// // 文字列をファイルに書き戻す
		fs.writeFileSync(filePath, newContent);
	}
	
}

function createHighlightsLog(fsPath: string):Highlight[] {
	const fileName = "kokocopy.json";
	const filePath = path.join(vscode.workspace.rootPath || "", fileName);

	// ファイルが存在しない場合は作成し、テキストを書き込む
	if (!fs.existsSync(filePath)) {
		const jsonData = {};
		const jsonString = JSON.stringify(jsonData, null, 2);
		fs.writeFileSync(filePath, jsonString, 'utf-8');
	} 
	
	// ファイルが存在する場合は内容を読み取る
	const fileData = fs.readFileSync(filePath, 'utf-8');
	let jsonData = JSON.parse(fileData);
	
	if(fsPath in jsonData) {
		return jsonData[fsPath];
	} else {
		jsonData[fsPath] = [];
		const jsonString = JSON.stringify(jsonData, null, 2);
		fs.writeFileSync(filePath, jsonString, 'utf-8');
		return [];
	}
}

function writeHighlightsLog(fsPath: string, pushOrSplice: string, i: number, newData: {}, newData2: {} = false) {
	const fileName = "kokocopy.json";
	const filePath = path.join(vscode.workspace.rootPath || "", fileName);
	if (!fs.existsSync(filePath)) {
		createHighlightsLog(fsPath);
	}

	// 値の読み取り
	const fileData = fs.readFileSync(filePath, 'utf-8');
	let jsonData = JSON.parse(fileData);

	if(pushOrSplice == "push") {
		jsonData[fsPath].push(newData);
	} else if(pushOrSplice == "splice") {
		if(!newData2){
			jsonData[fsPath].splice(i, 1, newData);
		} else {
			jsonData[fsPath].splice(i, 1, newData, newData2);
		}
	}
	
	const jsonString = JSON.stringify(jsonData, null, 2);
	fs.writeFileSync(filePath, jsonString, 'utf-8');
}

function readHighlightsLog(fsPath: string) {
	const fileName = "kokocopy.json";
	const filePath = path.join(vscode.workspace.rootPath || "", fileName);
	if (!fs.existsSync(filePath)) {
		createHighlightsLog(fsPath);
	}

	const fileData = fs.readFileSync(filePath, 'utf-8');
	let jsonData = JSON.parse(fileData);

	return jsonData[fsPath];	
}

const highlightDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: "#C7B2D6"
});

export function activate(context: vscode.ExtensionContext) {
	let editor = vscode.window.activeTextEditor;
	let highlights: Highlight[] = [];
	let filePath = "";

	vscode.window.onDidChangeActiveTextEditor(newEditor => {
        if (newEditor) {
			editor = newEditor;
		}
		if(editor){
			if (vscode.workspace.workspaceFolders) {
				let workspaceRootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
				filePath = path.relative(workspaceRootPath, editor.document.uri.fsPath); // 相対パスの計算
			} else {
				console.log('ワークスペースが開かれていません。');
			}
			highlights = createHighlightsLog(filePath);
			editor.setDecorations(highlightDecoration, []);
			decorate(editor,highlightDecoration, highlights);
		}
		
    });

	if(editor){
		createLogFile(0,0);	
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
				console.log("入力の検知",changes[0].text);
				if (
					changes[0].text.length > 1 &&
					detectInputLanguage(changes[0].text) === "NotJapanese"
				) {
					console.log("ペーストの検知");
					createLogFile(changes[0].text.length, 0); // タイプした文字数をカウント

						const start = changes[0].range.start;

						// addedTextLinesには追加されたテキストを改行で分割したものが格納される
						const addedTextLines = changes[0].text.split("\n");
						// 追加された行数は、addedTextLinesの長さから1を引くことで得られる（初めの行は元の行を含むため）
						const addedLines = addedTextLines.length - 1;
						// 最後の行の長さは、addedTextLinesの最後の要素の長さになる
						const lastLineLength = addedTextLines[addedTextLines.length - 1].length;
						const endLine = start.line + addedLines;
						const endChar = addedLines > 0 ? lastLineLength : start.character + lastLineLength;
						console.log("これっっfdfsdfsdfsdっ",highlights, start.line,start.character,endLine,endChar)
						highlights = createHighlight(filePath, start.line,start.character,endLine,endChar);
						console.log("これっっっ",highlights);

				} else if(changes[0].text.length != 0) {
					createLogFile(0, 1); // タイプした文字数をカウント
					for (const change of changes) {
						if(changes[0].text=="\n"){
							pressEnterKey(filePath, change.range.start.line, change.range.start.character);
						} else {
							editHighlight(filePath, change.range.start.line, change.range.start.character);
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
}

export function deactivate() { }
