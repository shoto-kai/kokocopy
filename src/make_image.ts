import { createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';

export async function generateCopyAmountImage() {
  // kokocopy.log からデータを読み込む
  const [copy_num, type_num] = fs
    .readFileSync('kokocopy.log', 'utf8')
    .split(' ')
    .map(Number);
  const copy_rate = (copy_num / (copy_num + type_num)) * 100;
  console.log(`コピー率: ${copy_rate.toFixed(2)}%`);

  // アイコンのサイズと外枠のサイズを設定
  const icon_width = 100;
  const icon_height = 100;
  const frame_radius = 10;
  const frame_thickness = 1;
  const padding_height = 3;
  const padding_width = 40;

  // タイトルの設定
  const title_text = 'Typing';
  const title_font_size = 20;
  const title_color = '#ffffff';

  // アイコンの設定
  let icon_path = '';
  if (type_num < 1000) {
    icon_path = 'input_images/beginner.png';
  } else if (type_num < 10000) {
    icon_path = 'input_images/intermediate.png';
  } else if (type_num < 100000) {
    icon_path = 'input_images/advanced.png';
  } else {
    icon_path = 'input_images/expert.png';
  }

  // ディスクリプションの設定
  let description_text = '';
  if (type_num < 1000) {
    description_text = 'Beginner';
  } else if (type_num < 10000) {
    description_text = 'Intermediate';
  } else if (type_num < 100000) {
    description_text = 'Advanced';
  } else {
    description_text = 'Expert';
  }

  const description_font_size = 12;
  const description_color = '#ffffff';

  // ポイントの設定
  const point_text = `${type_num}pt`;
  const point_font_size = 10;
  const point_color = '#ffffff';

  // ゲージバーの設定
  const gauge_width = 100;
  const gauge_height = 10;
  const gauge_fill_color = '#00ff00';
  let gauge_fill_percentage = 0;
  if (type_num < 1000) {
    gauge_fill_percentage = (type_num / 1000) * 100;
  } else if (type_num < 10000) {
    gauge_fill_percentage = (type_num / 10000) * 100;
  } else if (type_num < 100000) {
    gauge_fill_percentage = (type_num / 100000) * 100;
  } else {
    gauge_fill_percentage = 100;
  }

  // 外枠となる長方形のサイズを計算
  const frame_width = icon_width + 2 * padding_width;
  const frame_height = frame_width;

  // Canvasを作成
  const canvas = createCanvas(frame_width, frame_height);
  const context = canvas.getContext('2d');

  // 外枠を描画
  context.fillStyle = '#000000';
  context.lineWidth = frame_thickness;
  roundRect(context, 0, 0, frame_width, frame_height, frame_radius);
  context.fill();
  context.stroke();

  // タイトルを描画
  context.font = `${title_font_size}px Arial Bold`;
  context.fillStyle = title_color;
  context.textAlign = 'center';
  context.fillText(title_text, frame_width / 2, padding_height + title_font_size);

  // ディスクリプションを描画
  context.font = `${description_font_size}px Arial`;
  context.fillStyle = description_color;
  context.textAlign = 'center';
  context.fillText(
    description_text,
    frame_width / 2,
    padding_height + title_font_size + padding_height + icon_height + padding_height + description_font_size
  );

  // ポイントを描画
  context.font = `${point_font_size}px Arial`;
  context.fillStyle = point_color;
  context.textAlign = 'center';
  context.fillText(
    point_text,
    frame_width / 2,
    padding_height + title_font_size + padding_height + icon_height + padding_height + description_font_size + padding_height + point_font_size
  );

  // ゲージバーを描画
  const gauge_position = {
    x: padding_width,
    y:
      padding_height +
      title_font_size +
      padding_height +
      icon_height +
      padding_height +
      description_font_size +
      padding_height +
      point_font_size +
      padding_height
  };

  // ゲージバーの塗りつぶし
  const gauge_fill_width = (gauge_width * gauge_fill_percentage) / 100;
  context.fillStyle = gauge_fill_color;
  context.fillRect(gauge_position.x, gauge_position.y, gauge_fill_width, gauge_height);

  // アイコンを読み込み
  const icon = await loadImage(icon_path);
  context.drawImage(icon, padding_width, padding_height + title_font_size + padding_height, icon_width, icon_height);

  // 画像を保存
  const out = fs.createWriteStream('output_images/copy_amount.png');
  const stream = canvas.createPNGStream();
  stream.pipe(out);
  out.on('finish', () => {
    console.log('Image saved successfully');
  });

  // roundRectメソッドを定義
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

generateCopyAmountImage();
