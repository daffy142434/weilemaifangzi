import ajax from '@/lib/ajax';

export default class Service {
  getList() {
    return ajax.post(`/product_budget/explore_iteration_list`);
  }
  greatViewAngle(params) {
    return ajax.post(`/product_budget/great_view_angle`, params);
  }
  sensitiveViewAngle(params) {
    return ajax.post(`/product_budget/sensitive_view_angle`, params);
  }
}
