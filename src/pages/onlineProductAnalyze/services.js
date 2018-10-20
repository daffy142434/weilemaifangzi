import ajax from '@/lib/ajax';

export default class ShopServiceMail {
  getOnlineProductPerformance(params) {
    return ajax.post('/product_performance/list', params);
  }
}
