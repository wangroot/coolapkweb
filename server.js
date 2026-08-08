const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = 3000;

// ==========================================
// 1. 酷安鉴权与设备信息伪装配置 (基于 Coolapk-Lite 源码)
// ==========================================
const DEVICE_UUID = crypto.randomUUID(); // 生成固定设备的 UUID
const BASE64_DEVICE_ID = Buffer.from(DEVICE_UUID).toString('base64'); // Header 需要 Base64 后的设备 ID

// 伪装的客户端版本必须一致
const APP_VERSION = '11.4.5';
const APP_CODE = '2111161';
const FAKE_UA = `Dalvik/2.1.0 (Linux; U; Android 10; M2007J391C Build/QP1A.190711.020) (#Build; Xiaomi; M2007J391C; QP1A.190711.020; 10) +CoolMarket/${APP_VERSION}-${APP_CODE}`;

/**
 * 完全复刻 Coolapk-Lite 的 X-App-Token 生成算法
 */
function getAppToken(deviceId) {
    // 1. 获取当前时间的秒级时间戳
    const timestamp = Math.round(Date.now() / 1000);
    const timeStr = timestamp.toString();
    const hexTime = timestamp.toString(16); // 转换为 16 进制，后续需要拼接

    // 2. 将时间戳 MD5
    const md5Timestamp = crypto.createHash('md5').update(timeStr).digest('hex');

    // 3. 构建魔法字符串 Payload 
    // 盐值: c67ef5943784d09750dcfbb31020f0ab
    const payload = `token://com.coolapk.market/c67ef5943784d09750dcfbb31020f0ab?${md5Timestamp}$${deviceId}&com.coolapk.market`;

    // 4. 将 Payload 先 Base64 编码，再进行 MD5 加密
    const base64Payload = Buffer.from(payload).toString('base64');
    const md5Payload = crypto.createHash('md5').update(base64Payload).digest('hex');

    // 5. 最终拼装 Token = MD5(Base64(Payload)) + DeviceID + 0x + 16进制时间戳
    const token = `${md5Payload}${deviceId}0x${hexTime}`;
    return token;
}

// ==========================================
// 2. 服务器中间件配置
// ==========================================
// 解决跨域限制
app.use(cors());

// 公开当前目录下的所有文件 (如 HTML/CSS/JS)，解决本地打开文件时的 CORS 报错
// 启动服务后，直接在浏览器访问 http://localhost:3000/coolapk_lite_web.html
app.use(express.static(__dirname)); 

// ==========================================
// 新增：图片防盗链代理路由
// ==========================================
app.get('/api/image', async (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) {
        return res.status(400).send('Missing image url');
    }

    try {
        // 通过后端向酷安 CDN 请求图片，并强制带上合法的 Referer 绕过防盗链
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer', // 必须指定为二进制流
            headers: {
                'Referer': 'https://www.coolapk.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // 透传图片的 Content-Type（如 image/jpeg, image/png, image/webp 等）
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.send(response.data);

    } catch (error) {
        console.error('[Image Proxy Error]:', error.message);
        res.status(500).send('Failed to load image');
    }
});

// ==========================================
// 3. 酷安 V6/V8 API 核心反向代理路由
// ==========================================
app.use('/api', async (req, res) => {
    // req.url 会自动去掉 /api 前缀，例如：/v6/main/indexV8
    const targetPath = req.url;
    const targetUrl = `https://api.coolapk.com${targetPath}`;
    
    // 每次请求动态生成最新时间戳的 Token
    const dynamicToken = getAppToken(DEVICE_UUID);

    console.log(`[Proxy Request] -> ${targetUrl}`);

    try {
        const response = await axios.get(targetUrl, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-App-Id': 'com.coolapk.market',
                'X-App-Token': dynamicToken,
                'X-App-Device': BASE64_DEVICE_ID, // 必须为 Base64 编码
                'X-App-Version': APP_VERSION,
                'X-App-Code': APP_CODE,
                'X-Api-Version': '11',
                'User-Agent': FAKE_UA
            },
            // 如果后续你需要支持 POST 请求，需要引入 body-parser 并在此处加上 data: req.body
        });

        // 成功获取数据，透传给前端
        res.json(response.data);

    } catch (error) {
        // 捕获酷安服务器返回的拒绝信息 (通常是 403 Forbidden)
        console.error(`[API Error] ${error.response?.status} : ${error.response?.statusText}`);
        console.error(`[Error Data]:`, error.response?.data);
        
        res.status(error.response?.status || 500).json(
            error.response?.data || { error: 'Coolapk Proxy Request Failed. Possible Token/IP block.' }
        );
    }
});

// ==========================================
// 4. 启动服务
// ==========================================
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`🚀 Coolapk Proxy Server is running!`);
    console.log(`🌍 Local HTML Access: http://localhost:${PORT}/index.html`);
    console.log(`🔗 API Proxy Base: http://localhost:${PORT}/api/`);
    console.log('====================================');
});