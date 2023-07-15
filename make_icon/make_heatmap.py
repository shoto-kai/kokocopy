import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime, timedelta

import subprocess
import requests
import calendar

# Generate random data for demonstration
num_days = 365
start_date = datetime.now() - timedelta(days=365)  # 1年前の日付を開始日とする
print(start_date)
# data = np.random.randint(low=0, high=20, size=(num_days,))
data = []

url = 'http://localhost:5000/get'

# Get data from the server
for i in range(num_days):
    # response = subprocess.run(['python', 'add_count_to_date.py'], stdout=subprocess.PIPE)
    # data.append(int(response.text))
    # print(response.text)
    
    current_date = start_date + timedelta(days=i)
    date_only = current_date.date()
    print(date_only)

    date = {
        'date': date_only  # 取得したい日付を指定
    }
    response = requests.post(url, data=date)

    if response.status_code == 200:
        total = response.text
        print("Total number:", total)
        # data.append(int(total))
        data.append(i % 20)
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

# Configure x-axis labels
month_labels = []
month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
prev_month = start_date.month
month_labels.append(month_names[prev_month - 1])
for i in range(1, num_days // 7):
    date = start_date + timedelta(weeks=i)
    month = date.month
    if month != prev_month:
        month_labels.append(month_names[month - 1])
        prev_month = month
    else:
        month_labels.append('')
ax.set_xticks(np.arange(num_days // 7))
ax.set_xticklabels(month_labels)

ax.set_yticks(np.arange(7))
week_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
ax.set_yticklabels(['', week_names[(start_date + timedelta(days=1)).weekday()], '', week_names[(start_date + timedelta(days=3)).weekday()], '', week_names[(start_date + timedelta(days=5)).weekday()], ''])
ax.set_title('kokoCopy Heatmap')

plt.colorbar(heatmap, ticks=np.arange(calendar.min(), calendar.max() + 1))
plt.show()
