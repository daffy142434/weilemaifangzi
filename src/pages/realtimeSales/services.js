import ajax from '@/lib/ajax';

export default class RealtimeSales {
  getList(params) {
    return ajax.post(`/data_analysis/shop_prduce_sales`, params);
  }
  getProductListByShopId(shopId, params) {
    return ajax.get(`/data_analysis/${shopId}/prduce_sales`, {params});
  }
  getShopTrendByShopId(shopId) {
    return ajax.get(`/data_analysis/${shopId}/shop_prduce_sales/trend`);
  }
  getProductTrend(sku, shopId) {
    return ajax.get(`/data_analysis/prduce_sales/trend`, {params: {sku, shopId}})
  }
  getUpdateDate() {
    return ajax.post(`/data_analysis/prduce_sales/update_date`);
  }
}
