import ajax from '@/lib/ajax';

export default class service {
  s_add(params) {
    return ajax.post(`/admin/nav/add`, params);
  }
  s_list(params) {
    return ajax.get(`/admin/nav/list`, {params:params});
  }
  s_delete(params) {
    return ajax.post(`/admin/nav/delete`, params);
  }
  s_detail(params) {
    return ajax.get(`/admin/nav/detail`,{params:params});
  }
  s_modify(params) {
    return ajax.post(`/admin/nav/modify`,params);
  }
  fl_add(params) {
    return ajax.post(`/admin/site/link/add`, params);
  }
  fl_list(params) {
    return ajax.get(`/admin/site/link/list`, {params:params});
  }
  fl_delete(params) {
    return ajax.post(`/admin/site/link/delete`, params);
  }
  fl_modify(params) {
    return ajax.post(`/admin/site/link/modify`,params);
  }
}
