import ajax from '@/lib/ajax';
export default class PurchaseManage {
  addPurchase(params) {
    return ajax.post(`/purchase/orders/add`, params);
  }
  getPurchaseList(params) {
    return ajax.post(`/purchase/orders/list`, params);
  }
  getPurchaseDetail(params) {
    return ajax.post(`/purchase/orders/${params.id}/show`, params);
  }
  modifyPurchase(params) {
    return ajax.post(`/purchase/orders/${params.id}/modify`, params);
  }
  deletePurchase(params) {
    return ajax.post(`/purchase/orders/${params.id}/delete`);
  }
  inboudPurchase(params) {
    return ajax.post(`/purchase/orders/${params.id}/inboud`, params);
  }
  modifySettledAmount(params) {
    return ajax.post(`/purchase/orders/${params.id}/edit_settled_amount`, params);
  } 
  getInboundRecords(params) {
    return ajax.post(`/purchase/orders/${params.orderId}/items/${params.skuId}/list_delivery_log`);
  } 
  getSkuList(){
    return ajax.post(`/products/product_sku/list`);;
  }
}
