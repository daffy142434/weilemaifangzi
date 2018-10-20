import ajax from '@/lib/ajax';
export default class AmaOnlineProductOutlier {
  getExceptionList(params = {pageNumber: 1, pageSize: 10}) {
    return ajax.post(`/ama_product_outliers/list`, params);
  }
  getRestoreList(params = {pageNumber: 1, pageSize: 10}) {
    return ajax.post(`/ama_product_outliers/processed_list`, params);
  }
  getRemarkList(id) {
    return ajax.post(`/ama_product_outliers/${id}/remarks/list`);
  }
  operation(id, params) {
    return ajax.post(`/ama_product_outliers/${id}/process`, params);
  }
}
