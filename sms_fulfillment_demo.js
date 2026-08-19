/**
 * 小红书订单自动发货 & 短信触发示例脚本
 * 
 * 业务流程：
 * 1. 接收小红书订单推送（包含买家手机号、订单号、商品SKU）
 * 2. 生成对应的 H5 专属测试链接
 * 3. 调用阿里云/腾讯云短信 API 将链接发送至买家手机
 */

const crypto = require('crypto');

// 模拟部署上线后的公网 H5 测试域名 (发布至 Vercel 后替换为真实域名)
const BASE_H5_URL = 'https://quiz-h5-demo.vercel.app';

/**
 * 核心逻辑：模拟处理小红书订单
 * @param {string} orderId 小红书订单号
 * @param {string} userPhone 买家手机号
 * @param {string} testType 测试题类型 (如: 'mbti' 或 'daily_pass_rate')
 */
async function processXiaohongshuOrder(orderId, userPhone, testType = 'mbti') {
    console.log(`\n==================================================`);
    console.log(`[1] 收到小红书新订单推送!`);
    console.log(`    订单号: ${orderId}`);
    console.log(`    买家手机号: ${userPhone}`);
    console.log(`    购买测试项: ${testType}`);

    // 生成专属加密防篡改 Token
    const token = crypto.createHash('md5').update(`${orderId}-${userPhone}-secret-key`).digest('hex').substring(0, 10);
    
    // 拼装唯一的 H5 测试链接
    const quizLink = `${BASE_H5_URL}/test?phone=${userPhone}&token=${token}`;
    console.log(`[2] 已自动生成买家专属 H5 测试链接:`);
    console.log(`    ${quizLink}`);

    // 触发短信发送
    console.log(`[3] 正在调用 SMS 短信 API 发送至买家手机...`);
    const smsResult = await sendSmsNotification(userPhone, quizLink);

    if (smsResult.success) {
        console.log(`[4] ✅ 发货完成! 短信已成功下发至用户手机。`);
    } else {
        console.log(`[4] ❌ 短信发送失败: ${smsResult.error}`);
    }
    console.log(`==================================================\n`);
}

/**
 * 模拟调用 SMS API 发送短信 (可替换为真实的阿里云/腾讯云/短信宝 SDK)
 */
async function sendSmsNotification(phone, link) {
    // 短信模板报备文案示例：
    // 【心灵测评】您在店铺购买的心理/性格测评题已就绪，请点击专属链接进行测试：${link} (请勿泄露)
    
    return new Promise((resolve) => {
        setTimeout(() => {
            // 真实生产环境对接参考:
            // const client = new Dysmsapi20170525(config);
            // client.sendSms({ phoneNumbers: phone, signName: "店铺签名", templateCode: "SMS_123456", templateParam: JSON.stringify({ link }) });

            resolve({
                success: true,
                messageId: `msg_${Date.now()}`,
                sentTo: phone,
                link: link
            });
        }, 800);
    });
}

// 运行测试用例模拟
if (require.main === module) {
    console.log('>>> 正在运行小红书订单自动发短信模拟测试...');
    processXiaohongshuOrder('RED_ORD_88992021', '13812345678', 'mbti_personality');
}
