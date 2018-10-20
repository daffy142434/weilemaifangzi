import ajax from '@/lib/ajax';

export default class Warehouse {
  getList(params) {
    return ajax.post('/storages/list', params);
  }
  search(params) {
    return ajax.post('/storages/search', params);
  }
  add(params) {
    return ajax.post('/storages/add', params);
  }
  edit(id, params) {
    return ajax.post(`/storages/${id}/modify`, params);
  }
  getShops(id) {
    return ajax.post(`/storages/${id}/shops`);
  }
  relateShops(id, shopId) {
    return ajax.post(`/storages/${id}/shops/relate`, {shopId: shopId.join(',')});
  }
  getGoodsList(id, params) {
    return ajax.post(`/storages/${id}/goods/list`, params);
  }
  getGoodsBill(id) {
    return ajax.post(`/storages/goods/${id}/bill/list`);
  }
  getGoodsInventory(id) {
    return ajax.post(`/storages/goods/${id}/inventory/list`);
  }
  inbound(id, params) {
    return ajax.post(`/storages/${id}/goods/inbound`, params);
  }
  outbound(id, params) {
    return ajax.post(`/storages/${id}/goods/outbound`, params);
  }
  getTransfersList(id, params) {
    return ajax.post(`/storages/${id}/operate_goods/list_wait_process`, params);
  }
  transfersConfirm(id, transferId, params) {
    return ajax.post(`/storages/${id}/transfers_operates/${transferId}/confirm_receive`, params);
  }
  transfersReject(id, transferId, params) {
    return ajax.post(`/storages/${id}/transfers_operates/${transferId}/return`, params);
  }
  getLocalSkus() {
    return ajax.post(`/products/sku/list`);
  }
  verificationCount(id,params){
    return ajax.post(`/storages/${id}/goods/verification_count`, params);
  }
  verificationList(id,params){
    return ajax.post(`/storages/${id}/goods/verification_list`, params);
  }
  verification(id,params){
    return ajax.post(`/storages/${id}/goods/verification`, params);
  }
  skuAll(id,params){
    return ajax.post(`/storages/${id}/goods/sku_all`, params);
  }
  getOnlineSku(params){
    return ajax.post(`/products/sku_relation_product`,params);
  }
  getShopList(id) {
    return ajax.post(`/storages/${id}/shop_info`);
  }
};
