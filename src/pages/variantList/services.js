import ajax from '@/lib/ajax';

export default class FbaList {
  getList(params) {
    return ajax.post(`/online_product/variant/list`, params);
  }
  variantChange(tansferProductId, parentProductId) {
    return ajax.post(`/online_product/variant/change`, {tansferProductId, parentProductId});
  }
}
