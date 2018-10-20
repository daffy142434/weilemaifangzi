import ajax from '@/lib/ajax';

export default class ProductBudget {
  getList(params = {}) {
    return ajax.post('/product_budget/list', params);
  }
  getPriceAnalysisData(id) {
    return ajax.post(`/product_budget/2/${id}/asin_char`);
  }
  getCapacityClusterText(id) {
    return ajax.post(`/product_budget/1/${id}/cluster`);
  }
  getPriceAnalysisClusterText(id) {
    return ajax.post(`/product_budget/2/${id}/cluster`);
  }
  getAsinRanking(params) {
    return ajax.post(`/product_budget/permeate_level/asin_details`, params);
  }
  secondBudget(params) {
    return ajax.post(`/product_budget/second_explore_begin`, params);
  }
  wordsBudget(id) {
    return ajax.get(`/product_budget/${id}/second_budget_result`);
  }
  budgetMainResult(id) {
    return ajax.get(`/product_budget/${id}/main_words_budget`);
  }
  getSecondBudgetKeyWords(id) {
    return ajax.post(`/product_budget/second_explore_words`, { id });
  }
  exploreIteration(params){
    return ajax.post(`/product_budget/explore_iteration`, params);
  }
}
