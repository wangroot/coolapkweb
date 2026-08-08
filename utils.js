const crypto = require('crypto');

/**
 * 生成酷安 X-App-Token (基于广泛开源的 V8 算法)
 * @param {string} deviceId - 设备的唯一标识，建议固定为一个随机 UUID
 * @returns {string} 完整的 Token
 */
function getAppToken(deviceId) {
    // 1. 获取当前时间戳（秒）
    const timestamp = Math.round(Date.now() / 1000);
    const timestampStr = timestamp.toString();
    
    // 2. 将时间戳转换为 Base64
    const base64Timestamp = Buffer.from(timestampStr).toString('base64');
    
    // 3. 将时间戳计算 MD5
    const md5Timestamp = crypto.createHash('md5').update(timestampStr).digest('hex');
    
    // 4. 酷安 App 内部的魔法字符串（通常是一个固定的包名+特定MD5串）
    // 这里的 c67ef5943784d09750dcfbb31020f0ab 是社区已知的固定盐值
    const magicString = `token://com.coolapk.market/c67ef5943784d09750dcfbb31020f0ab?${md5Timestamp}$${deviceId}&com.coolapk.market`;
    
    // 5. 对魔法字符串进行 Base64 编码，然后再求 MD5
    const base64Magic = Buffer.from(magicString).toString('base64');
    const md5Magic = crypto.createHash('md5').update(base64Magic).digest('hex');
    
    // 6. 最终拼装: 魔法字符串MD5 + 设备ID + 时间戳Base64
    const token = `${md5Magic}${deviceId}${base64Timestamp}`;
    
    return token;
}

module.exports = { getAppToken };