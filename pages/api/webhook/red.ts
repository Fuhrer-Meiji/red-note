import type { NextApiRequest, NextApiResponse } from "next";
import { addPaidOrder } from "../../../lib/db";
import { generateToken } from "../../../lib/token";

type ResponseData = {
  success: boolean;
  message: string;
  data?: {
    orderId: string;
    phone: string;
    token: string;
    quizLink: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "仅支持 POST 请求" });
  }

  try {
    const { orderId, phone, testType = "mbti" } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "必填参数缺失：买家手机号 (phone)" });
    }

    const cleanPhone = String(phone).trim();
    
    // 1. 将买家手机号写入已付款订单白名单数据库！
    const orderRecord = addPaidOrder(cleanPhone);

    // 2. 生成安全验证凭证
    const token = generateToken(cleanPhone, orderRecord.createdAt);

    // 3. 获取动态主机地址
    let origin = req.body.customOrigin;
    if (!origin && req.headers.referer) {
      try {
        const url = new URL(req.headers.referer);
        origin = url.origin;
      } catch (e) {}
    }
    if (!origin) {
      const host = req.headers.host || "localhost:3000";
      origin = `http://${host}`;
    }

    if (origin.startsWith("https://") && (origin.includes("192.168.") || origin.includes("127.0.0.1") || origin.includes("localhost"))) {
      origin = origin.replace("https://", "http://");
    }

    const quizLink = `${origin}/test?phone=${cleanPhone}&token=${token}`;

    console.log(`[小红书订单自动发货成功] 手机号:${cleanPhone} 已入库白名单。链接: ${quizLink}`);

    return res.status(200).json({
      success: true,
      message: "发货成功，买家手机号已写入白名单，短信凭证已下发！",
      data: {
        orderId: orderId || `DEMO_${Date.now()}`,
        phone: cleanPhone,
        token,
        quizLink,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: `发货逻辑异常: ${error?.message || "系统错误"}`,
    });
  }
}
