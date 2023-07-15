import requests

url = 'http://localhost:5000/get'

data = {
    'date': '2023-07-15'  # 取得したい日付を指定
}
response = requests.post(url, data=data)

if response.status_code == 200:
    text = response.text
    copy_num, type_num = text.split(',')
    print("Copy num:", copy_num)
    print("Type num:", type_num)
else:
    print("Error: " + str(response))
    print('Failed to retrieve the number.')
