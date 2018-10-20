import ajax from '@/lib/ajax';
export default class Member {
  getCompanyListByUserNo(userNo) {
    const params = {
      userNo
    }
    return ajax.post('/members/companys/alloted/list', params);
  }
  getCompanyList() {
    return ajax.post('/members/companys/list');
  }
  getCompanyListByCurrentMember() {
    return ajax.post('/members/companys/list_own');
  }
  getDepartmentList() {
    return ajax.post(`/members/department/list_all`);
  }
  getAllMember() {
    return ajax.post(`/members/list_all`);
  }
  getMemberDetail() {
    return ajax.post('/members/show');
  }
  keepHeartBeat() {
    return ajax.post('/members/heartbeat');
  }
  getPermissions() {
    return ajax.post('/members/own_permissions/list');
  }
  saveMember() {
    let powers, userInfo;

    return this.getPermissions().then((res) => {
      powers = res.data.data;
      if (process.env.NODE_ENV === 'development') {
        powers.push('storage:manage');
        powers.push('product_devp_main_word:manage');
        powers.push('product_devp_estimate_again:manage');
      }
      localStorage.setItem('powers', JSON.stringify(powers));
      return this.getMemberDetail();
    }).then((res) => {
      userInfo = res.data.data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      return {powers, userInfo};
    });
  }
}
