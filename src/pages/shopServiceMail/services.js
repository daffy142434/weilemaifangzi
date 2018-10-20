import ajax from '@/lib/ajax';

export default class ShopServiceMail {
  getCompanyList() {
    return ajax.post('/members/companys/email_config/list');
  }
  mailConnectTest(id) {
    return ajax.post(`/customer_center/email_config/${id}/validate_active`);
  }
  getMailConfig(id) {
    return ajax.post(`/customer_center/email_config/${id}/show`)
  }
  getOffcialList(params) {
    return ajax.post('/shop_email/receive/official_list', {emailType: 1, ...params})
  }
  qaReplay(id){
    return ajax.post(`/shop_email/receive/${id}/qa_reply`);
  }
}
