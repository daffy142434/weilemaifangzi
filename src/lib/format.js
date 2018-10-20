/***********业务常量定义在该文件 ********/
import constvar from './const';
import moment from 'moment';

// 格式化时间为：YYYY-MM-DD
let toDate = function(row, col, val) {
  return (val||row) ? moment(val||row).format('YYYY-MM-DD') : '';
};

// 格式化时间为：YYYY-MM-DD HH:mm:ss
let toDateTime = function(row, col, val) {
  if (arguments.length === 1) {
    val = row;
  }
  return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
};

// 格式化显示亚马逊订单状态
let formatAmaOrderStatus = function(row, col, val) {
  return constvar.AMA_ORDER_STATUS[(val||row)] || '';
};

// 格式化显示亚马逊商品状态---常量定义中存在 0 code，所以麻烦一点处理
let formatAmaProductStatus = function(row, col, val) {
  if(val || val=='0') {
    return constvar.AMA_PRODUCT_STATUS[val] || '';
  }else if(row || row=='0') {
    return constvar.AMA_PRODUCT_STATUS[row] || '';
  }
};

// 格式化显示亚马逊商品类型
let formatAmaOrderType = function(row, col, val) {
  return constvar.AMA_ORDER_TYPE[(val||row)] || '';
};

// 格式化显示亚马逊订单付款方式
let formatAmaPaymentType = function(row, col, val) {
  return constvar.AMA_PAYMENT_TYPE[(val||row)] || '';
};

// 格式化显示亚马逊配送方式
let formatAmaChannel = function(row, col, val) {
  return constvar.AMA_CHANNEL[(val||row)] || '';
};

// 格式化显示亚马逊商品买家发票要求
let formatAmaInvoiceRequirement = function(row, col, val) {
  return constvar.AMA_INVOICE_REQUIREMENT[(val||row)] || '';
};

// 格式化显示亚马逊商品发票要求
let formatAmaInvoiceType = function(row, col, val) {
  return constvar.AMA_INVOICE_TYPE[(val||row)] || '';
};

// 格式化显示亚马逊商品发票类型
let formatAmaInvoiceInformationType = function(row, col, val) {
  return constvar.AMA_INVOICE_INFORMATION_TYPE[(val||row)] || '';
};
// 格式化显示是否---常量定义中存在 0 code，所以麻烦一点处理
let formatYesOrNo = function(row, col, val) {
  if(val || val=='0') {
    return constvar.YES_OR_NO[val] || '';
  }else if(row || row=='0') {
    return constvar.YES_OR_NO[row] || '';
  }
};

// 格式化显示百分比
let formatPercent = function(row, col, val) {
  if (arguments.length === 1) {
    val = row;
  }
  val *= 100;
  if (val || val=='0') {
    return `${val.toFixed(2)}%`;
  }
}

let voiceNotify = function(row, col, val) {
  return ['否', '是'][val] || '';
}

export default {
  toDate,
  toDateTime,
  formatAmaOrderStatus,
  formatAmaProductStatus,
  formatAmaOrderType,
  formatAmaPaymentType,
  formatAmaChannel,
  formatAmaInvoiceRequirement,
  formatAmaInvoiceType,
  formatAmaInvoiceInformationType,
  formatYesOrNo,
  formatPercent,
  voiceNotify
};
