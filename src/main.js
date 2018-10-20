// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Element from 'element-ui';
import moment from 'moment';
import VueQuillEditor from 'vue-quill-editor';
import 'element-ui/lib/theme-chalk/index.css';
import '@/less/common.less';
import App from './App';
import router from './router';
import store from './store/index';
import AsinLink from '@/components/asin-link';
import ContriesSelect from '@/components/contries-select';
import CurrencySelect from '@/components/currency-select';
import Member from '@/pages/member/services';

const member = new Member();

Vue.config.productionTip = false

// 检查用户登录状态，不是100%可信，但也解决了很大问题
var loginName_Form_LocalStroage = localStorage.getItem('loginName');

router.beforeEach((to,from,next)=>{
  if(location.pathname !== '/') {
    location.pathname = "/";
    return;
  }
  if(to.matched.some( m => m.meta.auth)){
      // 对路由进行验证
      if( store.state.user.loginName || loginName_Form_LocalStroage) { // 已经登陆
          next()
      }else{
          // 未登录, 跳转到登录页面，并且带上将要去的路由名称（路径的斜杠会被转义，蛋疼）。
          next({path:'/login', query:{ referrer: to.name} })
      }
      
  }else{
      next()
  }
});

Vue.use(Element);
Vue.use(VueQuillEditor);
Vue.component('asin-link', AsinLink);
Vue.component('contries-select', ContriesSelect);
Vue.component('currency-select', CurrencySelect);
Vue.mixin({
  methods: {
    permissions(v) {
      return this.$store.state.powers.includes(v);
    }
  },
})
Vue.directive('datetime', (el, binding) => {
  const {value} = binding;
  if (value) {
    el.innerHTML = moment(value).format('YYYY-MM-DD HH:mm:ss');
  }
});

sessionStorage.setItem('pageLoadTime', Date.now());
Vue.directive('date', (el, binding) => {
  const {value} = binding;
  if (value) {
    el.innerHTML = moment(value).format('YYYY-MM-DD');
  }
});
Vue.directive('percent', (el, binding) => {
  const {value} = binding;
  if (value !== null && value !== undefined) {
    el.innerHTML = `${(+value * 100).toFixed(2)}%`;
  }
});

function keepHeartBeat() {
  const SLEEP_TEN_MINUTES = 600000;
  setInterval(() => {
    member.keepHeartBeat();
  }, SLEEP_TEN_MINUTES);
};
if (localStorage.getItem('userInfo')) {
  member.getMemberDetail().then((res) => {
    if (res.data.data.sessionKeepFlag === 1) {
      keepHeartBeat();
    }
    if (location.hash.indexOf('#/login') !== -1) {
      location.hash = '/workbench';
    }
    window.userType = res.data.data.userType;
    const app = mountApp();
  }).catch(() => {
    const app = mountApp();
    app.$router.push({name: 'login'});
  });
} else {
  mountApp();
}

function mountApp() {
  return new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
  });
}
