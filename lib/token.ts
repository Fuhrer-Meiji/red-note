import crypto from "crypto";

const SECRET_KEY = process.env.TOKEN_SECRET || "mbti-xiaohongshu-secret-2026";

/**
 * 根据手机号及秘钥生成防篡改的签名 Token
 * @param phone 买家手机号
 * @returns 10 位加密 Token
 */
export function generateToken(phone: string): string {
  if (!phone) return "";
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(phone.trim())
    .digest("hex")
    .substring(0, 10);
}

/**
 * 校验手机号与 Token 是否匹配
 * @param phone 手机号
 * @param token 客户端传入的 token
 * @returns boolean
 */
export function verifyToken(phone: string, token: string): boolean {
  if (!phone || !token) return false;
  const expectedToken = generateToken(phone);
  return expectedToken.toLowerCase() === token.toLowerCase();
}
