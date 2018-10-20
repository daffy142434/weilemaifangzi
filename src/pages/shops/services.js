import ajax from '@/lib/ajax';

export default class Shops {
  getShopListByCompanyId(companyId) {
    return ajax.post(`/shops/company/${companyId}/list`);
  }
  getAllShops() {
    return ajax.post(`/shops/list_all`);
  }
}
