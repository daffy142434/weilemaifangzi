import ajax from '@/lib/ajax';

export default class Service {
  getList() {
    return ajax.post(`/product_budget/iterative_prediction`);
  }
  
}
