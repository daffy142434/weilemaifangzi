import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/index';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: Index,
      meta:{
        auth:true
      },
      children: [
        {
          title: '部门岗位管理',
          path: '/department',
          name: 'department',
          component: () => System.import('@/pages/department/index')
        },
        {
          title: '站点管理',
          path: '/station',
          name: 'station',
          component: () => System.import('@/pages/station/index'),
        },
        {
          title: '友情链接管理',
          path: '/fl/:siteId',
          name: 'stationFl',
          component: () => System.import('@/pages/station/components/fl'),
        },
        // 客户中心部分路由
        {
          title:'客户总览',
          path:'/customlist',
          name:'customlist',
          component: () => System.import('@/pages/customList')
        },
        {
          title:'已签约客户',
          path:'/customcontracted',
          name:'customcontracted',
          component: () => System.import('@/pages/customContracted')
        },
        {
          title:'跟进提醒',
          path:'/followremind',
          name:'followremind',
          component: () => System.import('@/pages/followRemind')
        },
        {
          title:'客户池',
          path:'/custompool',
          name:'custompool',
          component: () => System.import('@/pages/customPool')
        },
        {
          title:'待分配客户',
          path:'/followrecord',
          name:'followrecord',
          component: () => System.import('@/pages/followRecord')
        },
        {
          title:'待审核合同',
          path:'/pendingcontract',
          name:'pendingcontract',
          component: () => System.import('@/pages/pendingContract')
        },
        {
          title: '站点菜单管理',
          path: '/station-menu',
          name: 'stationMenu',
          component: () => System.import('@/pages/stationMenu/index')
        },
        {
          title: '菜单导航信息',
          path: '/station-menu-nav/:id',
          name: 'stationMenuNav',
          component: () => System.import('@/pages/stationMenu/components/stationMenuNav'),
        },
        {
          title: '站点导航管理',
          path: '/station-navigation',
          name: 'stationNavigation',
          component: () => System.import('@/pages/stationNavigation/index')
        },
        {
          title: '站点广告管理',
          path: '/station-ad',
          name: 'stationAd',
          component: () => System.import('@/pages/stationAd/index')
        },
      ]
    },
    {
      path: '/',
      redirect: { name: 'station' }
    },
    {
      path: '/login',
      name: 'login',
      component: () => System.import('@/pages/login')
    },
    {
      path: '*',
      name: '404',
      redirect: (to) => {
        return '/';
      }
    }
  ]
})
