import ajax from '@/lib/ajax';
export default class StorageAnalyze {
  getAllStorage() {
    return ajax.post(`/stock_report/list`);
  }
  getOverview() {
    return ajax.post(`/stock_report/overview`);
  }
  getDetailList(params) {
    return ajax.post(`/stock_report/detail`, params);
  }
  getDetailSummary(params) {
    return ajax.post(`/stock_report/detail_Summary`, params);
  }
  detailSummary(params) {
    return ajax.post(`/stock_report/detail_Summary`,params);
  }
}
