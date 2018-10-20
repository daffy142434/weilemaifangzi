import ajax from '@/lib/ajax';

export default class ProductAds {
  getList(params) {
    return ajax.post(`/product_ads/ads_report/list`, params);
  }
  getShopAdsReport(shopId, params) {
    return ajax.post(`/product_ads/ads_report_detail`, {shopId, ...params});
  }
  getShopTrendBySku(sku, shopId) {
    return ajax.post(`/product_ads/ads_report_detail/trend`, {sku, shopId});
  }
  getShopAdsTrend(shopId) {
    return ajax.post(`/product_ads/ads_report/trend`, {shopId})
  }
}
