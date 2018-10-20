import ajax from '@/lib/ajax';
export default class OrderMap {
  orderMap(params) {
    return ajax.post(`/ama_orders/order_map`,params);
  }
  
}
