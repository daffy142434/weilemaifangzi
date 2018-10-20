import ajax from '@/lib/ajax';

export default class Index {
  allDetection() {
    return ajax.get('/auto_detection/detection_all');
  }
  shopDetection() {
    return ajax.get('/auto_detection/shop');
  }
  emailDetection() {
    return ajax.get('/auto_detection/email');
  }
  onlineDetection() {
    return ajax.get('/auto_detection/online_sku');
  }
  orderDetection() {
    return ajax.post('/ama_orders/list/all', {
      amaOrderId: '',
      buyerName: '',
      clickFarmingFlag: '',
      createEndDate: '',
      createStartDate: '',
      exceptionReturnFlag: '',
      fbaFlag: '',
      orderStatus: '',
      pageNumber:1,
      pageSize:10,
      receiverName: '',
      shopId: '',
      sku: '',
    });
  }
  getSolveShops() {
    return ajax.get('/auto_detection/online_sku_solve');
  }
}
