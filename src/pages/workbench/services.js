import ajax from '@/lib/ajax';
export default class Workbench {
  getCustomerQuesitionStatistics() {
    return ajax.post('/workbench/email_jobs/inquiry/summary').then((r) => {
      return r.data.data;
    });
  }
  getPerformanceSales(stationCode) {
    return ajax.post('/workbench/performance_sales', {stationCode});
  }
  getPerformanceSalesBy30Day(stationCode) {
    return ajax.post('/workbench/performance_sales/30_amount', {stationCode});
  }
  getCustomerUnitPriceBy30Day(stationCode) {
    return ajax.post('/workbench/performance_sales/30_price', {stationCode});
  }
  getCount() {
    return ajax.post('/workbench/data_count');
  }
  productSummary(params) {
    return ajax.post('/workbench/product_summary',params);
  }
  getShopRank(params){
    return ajax.post('/workbench/shop_rank',params);
  }
  getShopInfo(){
    return ajax.post('/workbench/shop_info');
  }
}
