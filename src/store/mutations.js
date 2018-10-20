// todo, store.js有点问题，等作者回复
//var store = require('store');
export default {
  updateTitle(state, {title}) {
    state.title = title
  },
  setUser(state, payload) {
    debugger;
    state.user = payload;
    window.localStorage.setItem('loginName', payload.loginName);
  },
  setUserInfo(state, payload) {
    state.userInfo = payload;
  },
  setPowers(state, payload) {
    state.powers = payload;
  },
  setActiveMenuIndex(state, payload) {
    state.activeMenu = payload;
  },
  setToken(state, payload) {
    state.token = payload;
  }
}
