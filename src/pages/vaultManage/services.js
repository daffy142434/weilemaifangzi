import ajax from '@/lib/ajax';

export default class service {
  add(params) {
    return ajax.post(`/financial_warehouse/add`, params);
  }
  list(params) {
    return ajax.post(`/financial_warehouse/list`, params);
  }
  rechecked(params) {
    return ajax.post(`/financial_warehouse/rechecked`, params);
  }
  cashier(params) {
    return ajax.post(`/financial_warehouse/cashier`, params);
  }
  delete(params) {
    return ajax.post(`/financial_warehouse/delete`, params);
  }
  details(id) {
    return ajax.post(`/financial_warehouse/${id}/transaction_details`);
  }
  warehouseList() {
    return ajax.post(`/financial_warehouse/warehouse_list`);
  }
  getMember(params){
    return ajax.post(`/members/department/list_all`, params);
  }
  // downloadFile(params){
  //   return ajax.post(`/financial_warehouse/download_file`, params);
  // }
}
