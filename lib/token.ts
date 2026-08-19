import crypto from "crypto";

const SECRET_KEY = process.env.TOKEN_SECRET || "mbti-xiaohongshu-secret-2026";
export const EXPIRE_HOURS = 48; // 48小时有效
export const MAX_USAGE_COUNT = 2; // 最多测试2次作废

// 内存/KV使用次数记录表 (按手机号追踪使用次数)
const usageStore: Record<string, { count: number; createdAt: number }> = {};

/**
 * 生成带 48 小时过期时间戳的加密 Token
 * @param phone 手机号
 * @param timestamp 创建时间戳 (默认为当前时间)
 * @returns 组合 Token 格式: `${timestamp}_${hash}`
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
 * 校验手机号、Token 防篡改、48小时过期时间及 2次使用上限
 */
export function verifyToken(phone: string, token: string): VerifyResult {
  if (!phone || !token) {
    return { valid: false, reason: "缺少手机号或凭证 Token" };
  }

  const cleanPhone = phone.trim();

  // 解析 Token 结构: `${timestamp}.${hash}`
  const parts = token.split(".");
  if (parts.length !== 2) {
    // 兼容老版本没有 timestamp 的 10位 hash 凭证
    const expectedHash = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(cleanPhone)
      .digest("hex")
      .substring(0, 10);

    if (token.toLowerCase() === expectedHash.toLowerCase()) {
      return checkUsageCount(cleanPhone);
    }
    return { valid: false, reason: "凭证格式无效或已被篡改" };
  }

  const [tsStr, hash] = parts;
  const timestamp = parseInt(tsStr, 10);

  if (isNaN(timestamp)) {
    return { valid: false, reason: "凭证时间戳无效" };
  }

  // 1. 校验 HMAC 防篡改
  const expectedHash = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${cleanPhone}-${timestamp}`)
    .digest("hex")
    .substring(0, 10);

  if (hash.toLowerCase() !== expectedHash.toLowerCase()) {
    return { valid: false, reason: "凭证签名不匹配，已被非法篡改" };
  }

  // 2. 校验 48 小时过期时效
  const now = Date.now();
  const expireTimeMs = EXPIRE_HOURS * 60 * 60 * 1000;
  if (now - timestamp > expireTimeMs) {
    return {
      valid: false,
      reason: `该测评凭证已超过 ${EXPIRE_HOURS} 小时有效期限，已自动失效`,
    };
  }

  // 3. 校验 2 次使用上限
  return checkUsageCount(cleanPhone);
}

/**
 * 检查并返回使用次数
 */
function checkUsageCount(phone: string): VerifyResult {
  const record = usageStore[phone] || { count: 0, createdAt: Date.now() };

  if (record.count >= MAX_USAGE_COUNT) {
    return {
      valid: false,
      reason: `该测评凭证测试次数已达上限（${record.count}/${MAX_USAGE_COUNT} 次），已被安全作废`,
      usedCount: record.count,
      remainingUses: 0,
    };
  }

  return {
    valid: true,
    usedCount: record.count,
    remainingUses: MAX_USAGE_COUNT - record.count,
  };
}

/**
 * 增加该手机号的使用次数 (+1)
 */
export function incrementUsageCount(phone: string): number {
  if (!phone) return 0;
  const cleanPhone = phone.trim();
  if (!usageStore[cleanPhone]) {
    usageStore[cleanPhone] = { count: 1, createdAt: Date.now() };
  } else {
    usageStore[cleanPhone].count += 1;
  }
  return usageStore[cleanPhone].count;
}

/**
 * 查询已使用次数
 */
export function getUsageCount(phone: string): number {
  if (!phone) return 0;
  return usageStore[phone?.trim()]?.count || 0;
}
