import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, incrementUsageCount, EXPIRE_HOURS, MAX_USAGE_COUNT } from "../../../lib/token";

type Data = {
  valid: boolean;
  message?: string;
  reason?: string;
  remainingUses?: number;
  usedCount?: number;
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
  const isConsume = req.query.consume === "true" || req.body?.consume === true;

  if (!phone || !token) {
    return res.status(200).json({
      valid: false,
      message: "缺少手机号或验证凭证 Token",
    });
  }

  const result = verifyToken(phone, token);

  if (!result.valid) {
    return res.status(200).json({
      valid: false,
      message: result.reason || "凭证无效",
      reason: result.reason,
      remainingUses: result.remainingUses || 0,
      usedCount: result.usedCount || 0,
    });
  }

  // 如果请求带 consume=true，扣减一次可用次数
  let currentUsedCount = result.usedCount || 0;
  if (isConsume) {
    currentUsedCount = incrementUsageCount(phone);
  }

  return res.status(200).json({
    valid: true,
    message: "凭证校验成功",
    remainingUses: Math.max(0, MAX_USAGE_COUNT - currentUsedCount),
    usedCount: currentUsedCount,
  });
}
