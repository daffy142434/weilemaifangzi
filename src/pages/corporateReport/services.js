import ajax from '@/lib/ajax';
import format from '@/lib/format';

export default class CorporateReport {
  getReportPeriodByShopId(shopId) {
    return ajax.post(`/data_analysis/${shopId}/rport_period_all`);
  }
  getReportDetail(shopId, financialEventGroupId) {
    return ajax.post(`/data_analysis/${shopId}/financial_report`, {financialEventGroupId});
  }
  getReportList(params) {
    return ajax.post('/data_analysis/newest_financial_report', params);
  }
  getNewReportList(params) {
    // return ajax.post('/data_analysis/newest_financial_report_new', params);
    return ajax.post(`/data_analysis/financial_report_all_new`, params);
  }
  getReportListByShopId(shopId, params) {
    return ajax.post(`/data_analysis/${shopId}/financial_report_all`, params);
  }
  getNewReportListByShopId(shopId, params) {
    return ajax.post(`/data_analysis/${shopId}/financial_report_all_new`, params);
  }
  getHistory(shopId) {
    return ajax.post(`/data_analysis/${shopId}/report_period_all`);
  }
  
  formatData(d) {
    const {modifyTime, startDate, endDate} = d;

    d.modifyTimeText = format.toDateTime(d.modifyTime);
    d.reportRangeText = `${format.toDate(startDate)}<br />${format.toDate(endDate)}`;

    return d;
  }
}
