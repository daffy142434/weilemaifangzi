import ajax from '@/lib/ajax';

export default class FbaList {
  setWarnType(id, params) {
    return ajax.post(`/online_stock/${id}/set_warn_type`, params);
  }
  getList(params) {
    return ajax.post('/online_stock/stock/list', params);
  }
}
