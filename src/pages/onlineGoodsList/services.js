import ajax from '@/lib/ajax';

export default class OnlineGoodsList {
  getList(params) {
    return ajax.post('/online_product/sku/info', params);
  }
}
