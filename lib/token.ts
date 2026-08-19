import crypto from "crypto";

const SECRET_KEY = process.env.TOKEN_SECRET || "mbti-xiaohongshu-secret-2026";
export const EXPIRE_HOURS = 48; // 48小时有效
export const MAX_USAGE_COUNT = 2; // 最多测试2次作废

// 内存已付款订单手机号白名单数据库 (模拟记录小红书已付单买家)
const paidOrderStore: Record<string, { phone: string; token: string; createdAt: number }> = {};

// 内存/KV使用次数记录表 (按手机号追踪使用次数)
const usageStore: Record<string, { count: number; createdAt: number }> = {};

/**
 * 记录小红书已付款订单手机号白名单
 */
export function registerPaidOrder(phone: string, token: string) {
  if (!phone) return;
  const cleanPhone = phone.trim();
  paidOrderStore[cleanPhone] = {
    phone: cleanPhone,
    token,
    createdAt: Date.now(),
  };
}

/**
 * 检查手机号是否在已付款订单白名单中
 */
export function isPaidOrderPhone(phone: string): boolean {
  if (!phone) return false;
  return Boolean(paidOrderStore[phone.trim()]);
}

/**
 * 生成带 48 小时过期时间戳的加密 Token
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
 * 校验手机号、是否在付款白名单中、Token 防篡改、48小时过期时间及 2次使用上限
 */
export function verifyToken(phone: string, token?: string): VerifyResult {
  if (!phone) {
    return { valid: false, reason: "缺少手机号" };
  }

  const cleanPhone = phone.trim();

  // 1. 优先校验该手机号是否已在订单库中（防任意手机号未付款测试）
  // 注：如果在控制台生成过发货凭证，或带着合法 Token，则视为已购买
  const hasPaid = isPaidOrderPhone(cleanPhone);

  if (!token && !hasPaid) {
    return {
      valid: false,
      reason: `未查询到手机号 (${cleanPhone}) 的小红书付款订单！请先从小红书店铺下单购买测评。`,
    };
  }

  // 2. 如果带有 Token，进行 Token 的 HMAC 和 48小时过期校验
  if (token) {
    const parts = token.split(".");
    if (parts.length === 2) {
      const [tsStr, hash] = parts;
      const timestamp = parseInt(tsStr, 10);

      if (!isNaN(timestamp)) {
        // HMAC 校验
        const expectedHash = crypto
          .createHmac("sha256", SECRET_KEY)
          .update(`${cleanPhone}-${timestamp}`)
          .digest("hex")
          .substring(0, 10);

        if (hash.toLowerCase() !== expectedHash.toLowerCase()) {
          return { valid: false, reason: "凭证签名不匹配，已被非法篡改" };
        }

        // 48 小时过期校验
        const now = Date.now();
        const expireTimeMs = EXPIRE_HOURS * 60 * 60 * 1000;
        if (now - timestamp > expireTimeMs) {
          return {
            valid: false,
            reason: `该测评凭证已超过 ${EXPIRE_HOURS} 小时有效期限，已自动失效`,
          };
        }
      }
    }
  }

  // 3. 校验 2 次使用上限
  return checkUsageCount(cleanPhone);
}

function checkUsageCount(phone: string): VerifyResult {
  const record = usageStore[phone] || { count: 0, createdAt: Date.now() };

  if (record.count >= MAX_USAGE_COUNT) {
    return {
      valid: false,
      reason: `该测评凭证测试次数已达上限（${record.count}/${MAX_USAGE_COUNT} 次），已被作废`,
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
