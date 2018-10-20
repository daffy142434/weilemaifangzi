import ajax from 'lib/ajax';
export default {
  setUsername({commit}, payload){
    commit('SET_USER', payload)
  },
  getUsername({commit},payload){
    commit('GET_USER',payload)
  },
  getToken({commit}) {
    ajax.get('/token').then((response) => {
      if(response.data.code == '200') {
        commit('setToken', response.data.data)
      }
    });
  },
  getActiveShopCount({commit}) {
    ajax.post(`/shops/count_active`).then((res) => {
      // commit('setActiveShopCount', res.data.data);
    });
  }
}
