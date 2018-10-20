/***********业务常量定义在该文件 ********/
const AMA_ORDER_STATUS = {
  // "10": "未授权",
  // "11": "无需配送",
  // "20": "待发货",
  // "21": "已下物流单",
  // "22": "部分发货",
  // "23": "取消中",
  // "24": "发货中",
  // "25": "延迟待发",
  // "30": "已发货",
  // "31": "待寄发票",
  // "32": "退款中",
  // "33": "虚拟发货",
  // "40": "已完成",
  // "50": "已取消",
  // "51": "已退款",
  "10": "已支付未授权",
  "11": "已支付无需配送",
  "20": "待发货",
  "21": "已下物流单",
  "22": "已部分发货",
  "23": "取消处理中",
  "24": "发货处理中",
  "25": "延迟待发",
  "30": "已发货",
  "31": "已发货待确认发票寄出",
  "32": "退款处理中",
  "33": "虚拟发货",
  "40": "已完成",
  "50": "已取消",
  "51": "已退款",
};
const AMA_PRODUCT_STATUS = {
  "0": "未发货",
  "1": "取消中",
  "2": "发货中",
  "10": "已发货",
  "11": "退款中",
  "20": "已取消",
  "21": "已退款",
};
const AMA_ORDER_TYPE = {
  "StandardOrder": "库存商品",
  "Preorder": "预售商品",
};
const AMA_PAYMENT_TYPE = {
  "COD": "货到付款",
  "CVS": "便利店",
  "Other": "其它",
};

const AMA_CHANNEL = {
  "AFN": "亚马逊配送",
  "MFN": "卖家自行配送",
};

const AMA_INVOICE_REQUIREMENT = {
  "Individual": "Individual(买家要求对订单中的每件订单商品单独开具发票)",
  "Consolidated": "Consolidated(买家要求对订单中的所有订单商品开具一张发票)",
  "MustNotSend": "MustNotSend(买家不要求开具发票)",
};
const AMA_INVOICE_TYPE = {
  "1": "每件商品单独开发票",
  "2": "所有商品开一张发票",
  "3": "不开发票"
};

const AMA_INVOICE_INFORMATION_TYPE = {
  "1": "无需发票",
  "2": "发票类目作为发票信息",
  "3": "商品名作为发票信息"
};

const YES_OR_NO = {
  "0": "否",
  "1": "是",
};

const CURRENCY=["USD","CAD","JPY","GBP","EUR"];

export default {
  AMA_ORDER_STATUS,
  AMA_PRODUCT_STATUS,
  AMA_ORDER_TYPE,
  AMA_PAYMENT_TYPE,
  AMA_CHANNEL,
  AMA_INVOICE_REQUIREMENT,
  AMA_INVOICE_TYPE,
  AMA_INVOICE_INFORMATION_TYPE,
  YES_OR_NO,
  CURRENCY
};