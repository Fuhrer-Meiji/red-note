import fs from "fs";
import path from "path";

export const EXPIRE_HOURS = 48; // 48小时有效
export const MAX_USAGE_COUNT = 2; // 最多测试 2 次

export type OrderRecord = {
  phone: string;
  paid: boolean;
  usedCount: number;
  createdAt: number;
  expireAt: number;
};

// 本地持久化文件路径 (支持 Serverless/本地开发持久化)
const DB_FILE_PATH = path.join(process.cwd(), "data", "paid-orders-db.json");

// 内存数据库 (多节点缓存)
let orderCache: Record<string, OrderRecord> = {};

// 初始化加载本地持久化文件
function initDb() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const fileData = fs.readFileSync(DB_FILE_PATH, "utf-8");
      orderCache = JSON.parse(fileData || "{}");
    }
  } catch (e) {
    console.error("加载订单数据库失败:", e);
  }
}

// 保持保存到文件
function saveDb() {
  try {
    const dataDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(orderCache, null, 2), "utf-8");
  } catch (e) {
    console.error("保存订单数据库失败:", e);
  }
}

// 初始化数据库
initDb();

/**
 * 1. 商家/小红书发货：登记手机号到白名单数据库
 */
export function addPaidOrder(phone: string): OrderRecord {
  initDb();
  const cleanPhone = phone.trim();
  const now = Date.now();
  const expireAt = now + EXPIRE_HOURS * 60 * 60 * 1000;

  const record: OrderRecord = {
    phone: cleanPhone,
    paid: true,
    usedCount: 0,
    createdAt: now,
    expireAt,
  };

  orderCache[cleanPhone] = record;
  saveDb();
  return record;
}

export type CheckResult = {
  valid: boolean;
  reason?: string;
  record?: OrderRecord;
  remainingUses?: number;
  usedCount?: number;
};

/**
 * 2. 买家输入手机号校验：查询云端白名单
 */
export function checkPaidOrder(phone: string): CheckResult {
  initDb();
  if (!phone) {
    return { valid: false, reason: "请输入手机号" };
  }

  const cleanPhone = phone.trim();
  const record = orderCache[cleanPhone];

  // 拦截一：手机号未在已付款白名单中
  if (!record || !record.paid) {
    return {
      valid: false,
      reason: `未查询到手机号 (${cleanPhone}) 的小红书付款订单！请先从小红书店铺下单购买。`,
    };
  }

  // 拦截二：超过 48 小时有效期
  const now = Date.now();
  if (now > record.expireAt) {
    return {
      valid: false,
      reason: `手机号 (${cleanPhone}) 的测评凭证已超过 ${EXPIRE_HOURS} 小时有效期，已自动失效`,
      record,
    };
  }

  // 拦截三：使用次数超过 2 次
  if (record.usedCount >= MAX_USAGE_COUNT) {
    return {
      valid: false,
      reason: `该手机号测试次数已达上限（${record.usedCount}/${MAX_USAGE_COUNT} 次），已被安全作废`,
      record,
      usedCount: record.usedCount,
      remainingUses: 0,
    };
  }

  return {
    valid: true,
    record,
    usedCount: record.usedCount,
    remainingUses: MAX_USAGE_COUNT - record.usedCount,
  };
}

/**
 * 3. 消费 1 次测试额度
 */
export function consumeOrderUse(phone: string): number {
  initDb();
  const cleanPhone = phone.trim();
  const record = orderCache[cleanPhone];

  if (record) {
    record.usedCount += 1;
    saveDb();
    return record.usedCount;
  }
  return 0;
}
