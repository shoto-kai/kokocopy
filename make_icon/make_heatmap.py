import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

import subprocess
import requests

# Generate random data for demonstration
num_days = 365
start_date = datetime(2022, 1, 1)
print(start_date)
# data = np.random.randint(low=0, high=20, size=(num_days,))
data = []

url = 'http://localhost:5000/get'

# Get data from the server
for i in range(num_days):
    # response = subprocess.run(['python', 'add_count_to_date.py'], stdout=subprocess.PIPE)
    # data.append(int(response.text))
    # print(response.text)

    data_per_day = {
        'date': '2023-07-15'  # 取得したい日付を指定
    }
    response = requests.post(url, data=data_per_day)

    if response.status_code == 200:
        total = response.text
        print("Total number:", total)
        data.append(int(total))
    else:
        print("Error: " + str(response))
        print('Failed to retrieve the total number.')

# Create a calendar grid
calendar = np.zeros((7, num_days // 7))

# Fill the calendar grid with data
for i, value in enumerate(data):
    date = start_date + timedelta(days=i)
    day_of_week = date.weekday()
    week_of_year = date.isocalendar()[1]
    calendar[day_of_week, week_of_year - 1] += value

# Plot the heatmap
fig, ax = plt.subplots(figsize=(10, 6))
heatmap = ax.imshow(calendar, cmap='YlGn')
ax.set_xticks(np.arange(num_days // 7))
ax.set_xticklabels([str(i + 1) for i in range(num_days // 7)])
ax.set_yticks(np.arange(7))
ax.set_yticklabels(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])
ax.set_title('GitHub Contributions Heatmap')
plt.colorbar(heatmap)

plt.show()
