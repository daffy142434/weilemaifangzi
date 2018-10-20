const STORAGE_TYPE = {
  1: '虚拟库',
  2: '实体库',
};

const STATUS = {
  0: '禁用',
  1: '启用',
};

const GOODS_STATUS = {
  1: '新品',
  2: '类新品',
  3: '二手',
};

const OPERATE_TYPE = {
  '1': '入库',
  '2': '出库',
  '3': '确认接受货物',
};

const OPERATE_STATUS = {
  '0': '未完成',
  '1': '已完成',
};
const INVENTORY_STATUS = {
  '1': '可售',
  '2': '在途锁定',
  '3': '差项核销',
  '4': '销售核销',
  '5': '销毁核销',
  '6': '客户损毁',
};

export default {
  STORAGE_TYPE,
  STATUS,
  GOODS_STATUS,
  OPERATE_TYPE,
  OPERATE_STATUS,
  INVENTORY_STATUS,
}
