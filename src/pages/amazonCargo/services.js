import ajax from '@/lib/ajax';

export default class Service {
  getList(params) {
    return ajax.post(`/storages/outbound_info`, params);
  }
  getRemark(id,params) {
    return ajax.post(`/storages/${id}/remark`,params);
  }
}
