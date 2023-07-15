import requests

url = 'http://localhost:5000/'

response = requests.get(url)
if response.status_code == 200:
    print(response.text)
else:
    print('Failed to retrieve the message.')
