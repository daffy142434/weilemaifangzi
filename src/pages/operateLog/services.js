import ajax from '@/lib/ajax';

export default class operateLog {
  getList(id,params) {
    return ajax.post(`/storages/${id}/operate_log/list`, params);
  }
}
