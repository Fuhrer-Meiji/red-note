import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../lib/token";

type Data = {
  valid: boolean;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ valid: false, message: "Method Not Allowed" });
  }

  const phone = (req.query.phone || req.body?.phone) as string;
  const token = (req.query.token || req.body?.token) as string;

  if (!phone || !token) {
    return res.status(200).json({
      valid: false,
      message: "缺少手机号或验证凭证 Token",
    });
  }

  const isValid = verifyToken(phone, token);

  if (isValid) {
    return res.status(200).json({
      valid: true,
      message: "凭证校验成功",
    });
  } else {
    return res.status(200).json({
      valid: false,
      message: "凭证无效或已被篡改，请从正确的短信链接打开",
    });
  }
}
