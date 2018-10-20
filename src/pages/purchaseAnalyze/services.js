import ajax from '@/lib/ajax';
export default class StorageAnalyze {
  getOrders() {
    return ajax.post(`/purchase_report/orders`);
  }
  getSkus() {
    return ajax.post(`/purchase_report/skus`);
  }
  ordersPlanSettle(){
    return ajax.post(`/purchase_report/orders_plan_settle`);
  }
}
