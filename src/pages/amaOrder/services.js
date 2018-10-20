import ajax from '@/lib/ajax';

export default class AmaOrder {
  setClickFarmingFlag(orderId, clickFarmingAmount, clickFarmingCurrency) {
    return ajax.post(`/ama_orders/${orderId}/click_farming`, {clickFarmingAmount, clickFarmingCurrency});
  }
  getOrderDetail(orderId) {
    return ajax.post(`/ama_orders/${orderId}/show`);
  }
  getOrderDetailForCustomer(params) {
    return ajax.post(`/ama_orders/email/show`,params);
  }
  farmingNew(orderId,params) {
    return ajax.post(`/ama_orders/${orderId}/click_farming_new`,params);
  }
}
