import ajax from '@/lib/ajax';

export default class ReturnOrder {
  getList(params) {
    return ajax.post(`/return_orders/list`, params);
  }
}
