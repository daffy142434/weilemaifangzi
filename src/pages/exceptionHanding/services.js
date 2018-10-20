import ajax from '@/lib/ajax';

export default class Service {
  orderCancellation(params) {
    return ajax.post(`/storages/order_cancellation`, params);
  }
  orderCancellationSolve(params){
    return ajax.post(`/storages/order_cancellation_solve`, params);
  }
  orderCancellationSolveBatch(params){
    return ajax.post(`/storages/order_cancellation_solve_batch`, params);
  }
  storageInfo(params){
    return ajax.post(`/storages/storage_info`, params);
  }
}
