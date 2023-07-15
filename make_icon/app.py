from flask import Flask, request
from datetime import datetime

app = Flask(__name__)

data = {}  # データを保持する辞書

@app.route('/')
def get_count():
    return 'Hello, World!'

@app.route('/add', methods=['POST'])
def add_number():
    data_json = request.get_json()  # POSTリクエストからJSONデータを取得
    num = int(data_json['num'])  # JSONデータから整数を取得
    date = datetime.strptime(data_json['date'], '%Y-%m-%d').date()  # JSONデータから日付を取得

    if date not in data:
        data[date] = 0
    
    data[date] += num

    return 'Number added successfully'

@app.route('/get', methods=['POST'])
def get_number():
    date = datetime.strptime(request.form.get('date'), '%Y-%m-%d').date()
    
    if date not in data:
        return '0'
    
    return str(data[date])

if __name__ == '__main__':
    app.run(debug=True)
