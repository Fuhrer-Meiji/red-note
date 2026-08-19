import type { NextApiRequest, NextApiResponse } from "next";
import { checkPaidOrder, consumeOrderUse, EXPIRE_HOURS, MAX_USAGE_COUNT } from "../../../lib/db";

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
  const isConsume = req.query.consume === "true" || req.body?.consume === true;

  if (!phone) {
    return res.status(200).json({
      valid: false,
      message: "请输入在小红书下单的手机号",
    });
  }

  // 1. 查询数据库白名单状态
  const checkResult = checkPaidOrder(phone);

  if (!checkResult.valid) {
    return res.status(200).json({
      valid: false,
      message: checkResult.reason || "校验未通过",
      reason: checkResult.reason,
      remainingUses: checkResult.remainingUses || 0,
      usedCount: checkResult.usedCount || 0,
    });
  }

  // 2. 如果页面指定扣减次数
  let usedCount = checkResult.usedCount || 0;
  if (isConsume) {
    usedCount = consumeOrderUse(phone);
  }

  return res.status(200).json({
    valid: true,
    message: "订单白名单核销成功",
    remainingUses: Math.max(0, MAX_USAGE_COUNT - usedCount),
    usedCount,
  });
}
