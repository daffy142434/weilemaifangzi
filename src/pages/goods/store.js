import ajax from '@/lib/ajax';
import Vuex from 'vuex';

const store = new Vuex.Store({
  namespace: 'goods',
  state: {
    categoryList: [],
    developers: [],
    statusMap: {
      "10": "待确认",
      "11": "已发送操作请求",
      "20": "已确认未支付",
      "10,11,20": "全部",
    },
    goodsList: [],

    tableLoading: false,
    totalRecord: 0,
    pageSize: 10,
    searchData: {
      category: '',
      productName: '',
      sku: '',
      connectSku: '',
      developer: '',
      status: ''
    }
  },
  mutations: {
  },
  getters: {
  },
  actions: {
    getDevelopers(state) {
      // ajax.post('/members/list_all')
      // .then((response) => {
      //   if(response.data.code == 200) {
      //     state.developers = response.data.data || [];
      //   }
      // });
    },
    getGoods(state, params = {pageNumber: 1}) {
      state.tableLoading = true;
      ajax.post('/products/list', {pageNumber, pageSize, ...this.searchData})
      .then((response) => {
        state.tableLoading = false;
        if(response.data.code == 200) {
          state.goodsList = response.data.data.data || [];
          state.totalRecord = response.data.data.totalRecord;
        }
      })
      .catch((error) => {
        state.tableLoading = false;
      });
    }
  }
});

export default store;
