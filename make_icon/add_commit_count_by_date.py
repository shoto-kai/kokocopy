import requests
import json

url = 'http://localhost:5000/add'
data = {
    'copy_num': 10,
    'type_num': 20,
    'date': '2023-01-01'  # 日付を指定
}
headers = {'Content-Type': 'application/json'}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response)

data = {
    'copy_num': 40,
    'type_num': 20,
    'date': '2022-07-16'  # 日付を指定
}
headers = {'Content-Type': 'application/json'}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response)

data = {
    'copy_num': 10,
    'type_num': 20,
    'date': '2022-07-17'  # 日付を指定
}
headers = {'Content-Type': 'application/json'}
response = requests.post(url, data=json.dumps(data), headers=headers)
print(response)