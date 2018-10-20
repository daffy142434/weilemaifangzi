import ajax from '@/lib/ajax';
export default class AmaOnlineProductOutlier {
  getAllStorage() {
    return ajax.post(`/ama_product_outliers/processed_list`, params);
  }
}
