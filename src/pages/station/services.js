import ajax from '@/lib/ajax';

export default class service {
  s_add(params) {
    return ajax.post(`/admin/site/add`, params);
  }
  s_list(params) {
    return ajax.get(`/admin/site/list`, {params:params});
  }
  s_delete(params) {
    return ajax.post(`/admin/site/delete`, params);
  }
  s_detail(params) {
    return ajax.get(`/admin/site/detail`,{params:params});
  }
  s_modify(params) {
    return ajax.post(`/admin/site/modify`,params);
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
