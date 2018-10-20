import ajax from '@/lib/ajax';

export default class service {
  s_add(params) {
    return ajax.post(`/admin/menu/add`, params);
  }
  s_list(params) {
    return ajax.get(`/admin/menu/list`, {params:params});
  }
  s_delete(params) {
    return ajax.post(`/admin/menu/delete`, params);
  }
  s_detail(params) {
    return ajax.get(`/admin/menu/detail`,{params:params});
  }
  s_modify(params) {
    return ajax.post(`/admin/menu/modify`,params);
  }
  mn_add(params) {
    return ajax.post(`/admin/menu/relate_nav`, params);
  }
  mn_list(params) {
    return ajax.get(`/admin/menu/nav/list`, {params:params});
  }
  mn_delete(params) {
    return ajax.get(`/admin/menu/nav/delete`, {params:params});
  }
  mn_modify(params) {
    return ajax.post(`/admin/menu/nav/modify`,params);
  }
}
