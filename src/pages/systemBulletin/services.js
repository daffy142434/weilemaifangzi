import ajax from '@/lib/ajax';

export default class SystemBulletin {
  getList(params) {
    return ajax.post('/bulletin/system', params);
  }
  doAdd(params) {
    return ajax.post('/bulletin/add', params);
  }
  doDelete(bulletinId) {
    return ajax.post('/bulletin/delete', {bulletinId});
  }
  getUnRead() {
    return ajax.post('/bulletin/prompt');
  }
  setReadStatus(params) {
    return ajax.post('/bulletin/modify_state', params);
  }
}
