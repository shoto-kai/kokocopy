from flask import Flask, request, send_file
from datetime import datetime
import subprocess
import json

app = Flask(__name__)

data = {}  # データを保持する辞書

@app.route('/')
def get_count():
    return 'Hello, World!'

@app.route('/update', methods=['POST'])
def update():
    data = json.loads(request.data.decode('utf-8'))
    copy_num = int(data['copy_num'])
    type_num = int(data['type_num'])

    # 受け取ったデータを処理（例：ファイルに保存）
    with open('kokocopy.log', 'w') as f:
        f.write(f"{copy_num} {type_num}")

    return 'データの受け取りが成功しました'

@app.route('/get_img', methods=['GET'])
def get_img():
    result = subprocess.run(['sh', 'script.sh'])
    if result.returncode == 0:
        print("シェルスクリプト実行成功")
        return send_file('output_images/copy_amount.png', mimetype='image/png')
    else:
        print("シェルスクリプト実行エラー:")
        print(result.stderr)
    
    return 

if __name__ == '__main__':
    app.run(debug=True)