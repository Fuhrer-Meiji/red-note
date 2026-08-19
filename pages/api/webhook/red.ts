import type { NextApiRequest, NextApiResponse } from "next";
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
    const token = generateToken(cleanPhone);

    // 获取动态主机地址，优先取 customOrigin / referer / origin
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

    // 局域网 IP (192.168.x.x / 10.x.x / 127.0.0.1 / localhost) 强制使用 http 协议
    if (origin.startsWith("https://") && (origin.includes("192.168.") || origin.includes("127.0.0.1") || origin.includes("localhost") || origin.includes("10."))) {
      origin = origin.replace("https://", "http://");
    }

    const quizLink = `${origin}/test?phone=${cleanPhone}&token=${token}`;

    // 模拟调用 SMS 短信发送
    console.log(`[小红书订单自动发货] 订单号:${orderId || "模拟订单"} 手机号:${cleanPhone}`);
    console.log(`[小红书订单自动发货] 下发短信专属链接: ${quizLink}`);

    return res.status(200).json({
      success: true,
      message: "发货处理成功，短信凭证已下发！",
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
