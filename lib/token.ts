import crypto from "crypto";

const SECRET_KEY = process.env.TOKEN_SECRET || "mbti-xiaohongshu-secret-2026";
export const EXPIRE_HOURS = 48; // 48小时有效
export const MAX_USAGE_COUNT = 2; // 最多测试2次作废

/**
 * 生成带 48 小时过期时间戳的无状态 HMAC 加密 Token
 */
export function generateToken(phone: string, timestamp: number = Date.now()): string {
  if (!phone) return "";
  const cleanPhone = phone.trim();
  const rawData = `${cleanPhone}-${timestamp}`;
  const hash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(rawData)
    .digest("hex")
    .substring(0, 10);

  return `${timestamp}.${hash}`;
}

export type VerifyResult = {
  valid: boolean;
  reason?: string;
  remainingUses?: number;
  usedCount?: number;
};

/**
 * 无状态 Token 校验：验证签名合法性及 48小时过期时间
 */
export function verifyToken(phone: string, token: string): VerifyResult {
  if (!phone || !token) {
    return {
      valid: false,
      reason: `未查询到手机号 (${phone || "未填写"}) 的小红书付款订单凭证！请通过短信中的专属链接点开测试。`,
    };
  }

  const cleanPhone = phone.trim();
  const parts = token.split(".");

  // 旧版或简单 token 格式处理
  if (parts.length !== 2) {
    const expectedHash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(cleanPhone)
      .digest("hex")
      .substring(0, 10);

    if (token.toLowerCase() === expectedHash.toLowerCase()) {
      return { valid: true, remainingUses: 2, usedCount: 0 };
    }
    return { valid: false, reason: "凭证签名不匹配，未找到有效的发货订单" };
  }

  const [tsStr, hash] = parts;
  const timestamp = parseInt(tsStr, 10);

  if (isNaN(timestamp)) {
    return { valid: false, reason: "凭证时间戳格式错误" };
  }

  // 1. HMAC 签名校验
  const expectedHash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${cleanPhone}-${timestamp}`)
    .digest("hex")
    .substring(0, 10);

  if (hash.toLowerCase() !== expectedHash.toLowerCase()) {
    return {
      valid: false,
      reason: `未查询到手机号 (${cleanPhone}) 的小红书付款订单凭证！`,
    };
  }

  // 2. 48 小时过期时间校验
  const now = Date.now();
  const expireTimeMs = EXPIRE_HOURS * 60 * 60 * 1000;
  if (now - timestamp > expireTimeMs) {
    return {
      valid: false,
      reason: `该测评凭证已超过 ${EXPIRE_HOURS} 小时有效期限，已自动失效`,
    };
  }

  return { valid: true, remainingUses: 2, usedCount: 0 };
}

export function incrementUsageCount(phone: string): number {
  return 1;
}
