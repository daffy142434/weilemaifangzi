import ajax from '@/lib/ajax';

export default class Service {
  getList() {
    return ajax.get(`/oeration_monitoring/list`);
  }
}
