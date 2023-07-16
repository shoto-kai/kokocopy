"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_1 = require("canvas");
var fs = require("fs");
// kokocopy.log からデータを読み込む
var _a = fs
    .readFileSync('kokocopy.log', 'utf8')
    .split(' ')
    .map(Number), copy_num = _a[0], type_num = _a[1];
var copy_rate = (copy_num / (copy_num + type_num)) * 100;
console.log("\u30B3\u30D4\u30FC\u7387: ".concat(copy_rate.toFixed(2), "%"));
// アイコンのサイズと外枠のサイズを設定
var icon_width = 100;
var icon_height = 100;
var frame_radius = 10;
var frame_thickness = 1;
var padding_height = 3;
var padding_width = 40;
// タイトルの設定
var title_text = 'Typing';
var title_font_size = 20;
var title_color = '#ffffff';
// アイコンの設定
var icon_path = '';
if (type_num < 1000) {
    icon_path = 'input_images/beginner.png';
}
else if (type_num < 10000) {
    icon_path = 'input_images/intermediate.png';
}
else if (type_num < 100000) {
    icon_path = 'input_images/advanced.png';
}
else {
    icon_path = 'input_images/expert.png';
}
// ディスクリプションの設定
var description_text = '';
if (type_num < 1000) {
    description_text = 'Beginner';
}
else if (type_num < 10000) {
    description_text = 'Intermediate';
}
else if (type_num < 100000) {
    description_text = 'Advanced';
}
else {
    description_text = 'Expert';
}
var description_font_size = 12;
var description_color = '#ffffff';
// ポイントの設定
var point_text = "".concat(type_num, "pt");
var point_font_size = 10;
var point_color = '#ffffff';
// ゲージバーの設定
var gauge_width = 100;
var gauge_height = 10;
var gauge_fill_color = '#00ff00';
var gauge_fill_percentage = 0;
if (type_num < 1000) {
    gauge_fill_percentage = type_num / 1000 * 100;
}
else if (type_num < 10000) {
    gauge_fill_percentage = type_num / 10000 * 100;
}
else if (type_num < 100000) {
    gauge_fill_percentage = type_num / 100000 * 100;
}
else {
    gauge_fill_percentage = 100;
}
// 外枠となる長方形のサイズを計算
var frame_width = icon_width + 2 * padding_width;
var frame_height = frame_width;
// Canvasを作成
var canvas = (0, canvas_1.createCanvas)(frame_width, frame_height);
var context = canvas.getContext('2d');
// 外枠を描画
context.fillStyle = '#000000';
context.lineWidth = frame_thickness;
roundRect(context, 0, 0, frame_width, frame_height, frame_radius);
context.fill();
context.stroke();
// タイトルを描画
context.font = "".concat(title_font_size, "px Arial Bold");
context.fillStyle = title_color;
context.textAlign = 'center';
context.fillText(title_text, frame_width / 2, padding_height + title_font_size);
// ディスクリプションを描画
context.font = "".concat(description_font_size, "px Arial");
context.fillStyle = description_color;
context.textAlign = 'center';
context.fillText(description_text, frame_width / 2, padding_height + title_font_size + padding_height + icon_height + padding_height + description_font_size);
// ポイントを描画
context.font = "".concat(point_font_size, "px Arial");
context.fillStyle = point_color;
context.textAlign = 'center';
context.fillText(point_text, frame_width / 2, padding_height + title_font_size + padding_height + icon_height + padding_height + description_font_size + padding_height + point_font_size);
// ゲージバーを描画
var gauge_position = {
    x: padding_width,
    y: padding_height +
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
var gauge_fill_width = (gauge_width * gauge_fill_percentage) / 100;
context.fillStyle = gauge_fill_color;
context.fillRect(gauge_position.x, gauge_position.y, gauge_fill_width, gauge_height);
// アイコンを読み込み
function load_Image() {
    return __awaiter(this, void 0, void 0, function () {
        var icon, out, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, canvas_1.loadImage)(icon_path)];
                case 1:
                    icon = _a.sent();
                    context.drawImage(icon, padding_width, padding_height + title_font_size + padding_height, icon_width, icon_height);
                    out = fs.createWriteStream('output_images/copy_amount.png');
                    stream = canvas.createPNGStream();
                    stream.pipe(out);
                    out.on('finish', function () {
                        console.log('Image saved successfully');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
load_Image();
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
