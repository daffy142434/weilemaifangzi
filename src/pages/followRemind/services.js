import ajax from '@/lib/ajax';
import moment from 'moment';

export default class CustomerQuesition {
  setNotNeedReply(id, remark) {
    return ajax.post(`/shop_email/receive/${id}/no_need_reply`, {remark});
  }
  ignoreAllEmail(remark) {
    return ajax.post(`/shop_email/receive/batch_no_need_reply`, {remark});
  }
  getReplyList(id) {
    return ajax.post(`/shop_email/receive/${id}/show`);
  }
  replyQuesition(id, params) {
    return ajax.post(`/shop_email/receive/${id}/reply`, params);
  }
  getQuesitionList(params) {
    return ajax.post(`/shop_email/receive/list`, params)
  }
}
