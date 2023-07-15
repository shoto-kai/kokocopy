import requests
import json

url = 'http://localhost:5000/add'
data = {
    'num': 10,
    'date': '2023-07-15'  # 日付を指定
}
headers = {'Content-Type': 'application/json'}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response)