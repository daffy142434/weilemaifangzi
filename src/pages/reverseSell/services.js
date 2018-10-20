import ajax from '@/lib/ajax';
export default class ReverseSell {
  getNowList(params) {
    return ajax.post(`/reverse_sell/now_list`, params);
  }
  getHistoryList(params) {
    return ajax.post(`/reverse_sell/history_list`, params);
  }
}
