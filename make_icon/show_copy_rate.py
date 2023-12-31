from PIL import Image, ImageDraw, ImageFont

# kokocopy.log からデータを読み込む
num_of_copied_text, num_of_not_copied_text = list(map(int, open('kokocopy.log', 'r').read().split()))
copy_rate = num_of_copied_text / (num_of_copied_text + num_of_not_copied_text) * 100
print("コピー率: {:.2f}%".format(copy_rate))

# アイコンのサイズと外枠のサイズを設定
icon_width = 100
icon_height = 100
frame_radius = 10
frame_thickness = 1
padding_height = 3
padding_width = 40

# タイトルの設定
title_text = "Copy Rate"
title_font = ImageFont.truetype("fonts/arial_bold.ttf", 20)  # フォントとサイズを適切なものに変更してください
title_color = (255, 255, 255)  # タイトルの色を適切なものに変更してください

# グラフのサイズと色
graph_size = (100, 100)
graph_color = (0, 255, 0)  # グラフの色を適切なものに変更してください

# ディスクリプションの設定
description_text = "Too much!!"
description_font = ImageFont.truetype("fonts/arial.ttf", 12)  # フォントとサイズを適切なものに変更してください
description_color = (255, 255, 255)  # ディスクリプションの色を適切なものに変更してください

# ポイントの設定
point_text = str(int(copy_rate)) + "%"
point_font = ImageFont.truetype("fonts/arial.ttf", 12)  # フォントとサイズを適切なものに変更してください
point_color = (255, 255, 255)  # ポイントの色を適切なものに変更してください

# ゲージバーの設定
gauge_width = 100
gauge_height = 10
gauge_fill_color = (0, 255, 0)  # ゲージの色を適切なものに変更してください
gauge_fill_percentage = 20

# 外枠となる長方形のサイズを計算
frame_width = icon_width + 2 * padding_width
frame_height = frame_width

# アイコンを結合するキャンバスを作成
canvas = Image.new('RGB', (frame_width, frame_height), (255, 255, 255))

# 外枠を描画
draw = ImageDraw.Draw(canvas)
rounded_rectangle = [(0, 0), (frame_width, frame_height)]
draw.rounded_rectangle(rounded_rectangle, fill=(0, 0, 0), outline=(0, 0, 0), width=frame_thickness, radius=frame_radius)

# タイトルを描画
title_width, title_height = draw.textsize(title_text, font=title_font)
title_position = ((frame_width - title_width) // 2, padding_height)
draw.text(title_position, title_text, font=title_font, fill=title_color)

# 円グラフを描画
start_angle = 0
end_angle = copy_rate / 100 * 360
draw.pieslice([(padding_width + icon_width // 2 - graph_size[0] // 2, padding_height + title_height + icon_height // 2 - graph_size[1] // 2), 
               (padding_width + icon_width // 2 + graph_size[0] // 2, padding_height + title_height + icon_height // 2 + graph_size[1] // 2)], 
              start_angle, end_angle, fill=graph_color)

# ディスクリプションを描画
description_width, description_height = draw.textsize(description_text, font=description_font)
description_position = ((frame_width - description_width) // 2, padding_height + title_height + padding_height + icon_height + padding_height)
draw.text(description_position, description_text, font=description_font, fill=description_color)

# 文字列 "10pt" のサイズを取得
point_width, point_height = draw.textsize(point_text, font=point_font)

# 文字列 "10pt" の描画位置を計算
point_position = ((frame_width - point_width) // 2, description_position[1] + description_height + padding_height * 2)

# 文字列 "10pt" を描画
draw.text(point_position, point_text, font=point_font, fill=point_color)

# # ゲージバーを描画
# gauge_position = (padding_width, point_position[1] + point_height + padding_height)
# gauge_fill_width = int(gauge_width * gauge_fill_percentage / 100)
# gauge_bar = Image.new('RGB', (gauge_width, gauge_height), (255, 255, 255))
# draw_gauge = ImageDraw.Draw(gauge_bar)
# draw_gauge.rectangle([(0, 0), (gauge_fill_width, gauge_height)], fill=gauge_fill_color)
# canvas.paste(gauge_bar, gauge_position)

# 画像を保存
canvas.save('output_images/copy_rate.png')
