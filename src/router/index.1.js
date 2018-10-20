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
          path: '/workbench',
          name: 'workbench',
          component: () => System.import('@/pages/workbench/index')
        },
        {
          path: '/amaOrder',
          name: 'amaOrder',
          component: () => System.import('@/pages/amaOrder/index')
        },
        {
          path: '/power',
          name: 'power',
          component: () => System.import('@/pages/power')
        },
        {
          path: '/member',
          name: 'member',
          component: () => System.import('@/pages/member/index')
        },
        {
          path: '/company',
          name: 'company',
          component: () => System.import('@/pages/company')
        },
        {
          path: '/submember',
          name: 'submember',
          component: () => System.import('@/pages/member/submember')
        },
        {
          path: '/goods',
          name: 'goods',
          component: () => System.import('@/pages/goods/index')
        },
        {
          path: '/goodsManager/add',
          name: 'goodsAdd',
          component: () => System.import('@/pages/goodsManager/index')
        },
        {
          path: '/goodsManager/addWithRelate/:relateSkuId',
          name: 'goodsAddWithRelate',
          component: () => System.import('@/pages/goodsManager/index')
        },
        {
          path: '/goodsManager/edit/:skuId',
          name: 'goodsEdit',
          component: () => System.import('@/pages/goodsManager/index')
        },
        {
          path: '/goodsManager/clone/:skuId',
          name: 'goodsClone',
          component: () => System.import('@/pages/goodsManager/index')
        },
        {
          path: '/sku',
          name: 'sku',
          component: () => System.import('@/pages/sku')
        },
        {
          path: '/onlineGoods',
          name: 'onlineGoods',
          component: () => System.import('@/pages/onlineGoods')
        },
        {
          path: '/onlineGoodsList',
          name: 'onlineGoodsList',
          component: () => System.import('@/pages/onlineGoodsList/index')
        },
        {
          path: '/variant',
          name: 'variant',
          component: () => System.import('@/pages/onlineGoods')
        },
        {
          path: '/variantList',
          name: 'variantList',
          component: () => System.import('@/pages/variantList/index.chart')
        },
        {
          path: '/createOnlineSku',
          name: 'createOnlineSku',
          component: () => System.import('@/pages/createOnlineSku')
        },
        {
          path: '/onlineShopsList/fba',
          name: 'fbaShopsList',
          component: () => System.import('@/pages/onlineGoods')
        },
        {
          path: '/purchaseManage',
          name: 'purchaseManage',
          component: () => System.import('@/pages/purchaseManage/index')
        },
        {
          path: '/operateLog',
          name: 'operateLog',
          component: () => System.import('@/pages/operateLog/index')
        },
        {
          path: '/fbaList',
          name: 'fbaList',
          component: () => System.import('@/pages/fbaList/index')
        },
        {
          path: '/modifyPwd',
          name: 'modifyPwd',
          component: () => System.import('@/pages/modifyPwd')
        },
        {
          path: '/developer',
          name: 'developer',
          component: () => System.import('@/pages/developer')
        },
        {
          path: '/shopServiceMail',
          name: 'shopServiceMail',
          component: () => System.import('@/pages/shopServiceMail/index')
        },
        {
          path: '/officialList',
          name: 'officialList',
          component: () => System.import('@/pages/shopServiceMail/officialList')
        },
        {
          path: '/currentExchange',
          name: 'currentExchange',
          component: () => System.import('@/pages/currentExchange')
        },
        {
          path: '/exchangeLog',
          name: 'exchangeLog',
          component: () => System.import('@/pages/exchangeLog')
        },
        {
          path: '/productAds',
          name: 'productAds',
          component: () => System.import('@/pages/productAds/index')
        },
        {
          path: '/feedback',
          name: 'feedback',
          component: () => System.import('@/pages/feedback')
        },
        {
          path: '/amaOnlineProductOutlier',
          name: 'amaOnlineProductOutlier',
          component: () => System.import('@/pages/amaOnlineProductOutlier')
        },
        {
          path: '/exploreKeyword',
          name: 'exploreKeyword',
          component: () => System.import('@/pages/exploreKeyword/index')
        },
        {
          path: '/reverseSell',
          name: 'reverseSell',
          component: () => System.import('@/pages/reverseSell/index')
        },
        {
          path: '/review',
          name: 'review',
          component: () => System.import('@/pages/review')
        },
        {
          path: '/exceptionHanding',
          name: 'exceptionHanding',
          component: () => System.import('@/pages/exceptionHanding')
        },
        {
          path: '/budget',
          name: 'budget',
          component: () => System.import('@/pages/productBudget/index')
        },
        {
          path: '/budgetMain',
          name: 'budgetMain',
          component: () => System.import('@/pages/productBudget/budgetMain')
        },
        {
          path: '/budgetMainResult',
          name: 'budgetMainResult',
          component: () => System.import('@/pages/productBudget/budgetMainResult')
        },
        {
          path: '/budgetAgain',
          name: 'budgetAgain',
          component: () => System.import('@/pages/productBudget/budgetAgain')
        },
        {
          path: '/budgetAgainResult',
          name: 'budgetAgainResult',
          component: () => System.import('@/pages/productBudget/budgetAgainResult')
        },
        {
          path: '/operationMonitoring',
          name: 'operationMonitoring',
          component: () => System.import('@/pages/operationMonitoring/index')
        },
        {
          path: '/iterativePrediction',
          name: 'iterativePrediction',
          component: () => System.import('@/pages/iterativePrediction/index')
        },
        {
          path: '/priceModel',
          name: 'priceModel',
          component: () => System.import('@/pages/priceModel/index')
        },
        {
          path: '/newProductionAll',
          name: 'newProductionAll',
          component: () => System.import('@/pages/newProductionBar/index')
        },
        {
          path: '/newProductionBetter',
          name: 'newProductionBetter',
          component: () => System.import('@/pages/newProductionBar/better')
        },
        {
          path: '/modelDraft',
          name: 'modelDraft',
          component: () => System.import('@/pages/modelDraft/index')
        },
        {
          path: '/catchComment',
          name: 'catchComment',
          component: () => System.import('@/pages/catchComment/index')
        },
        {
          path: '/realtimeSales',
          name: 'realtimeSales',
          component: () => System.import('@/pages/realtimeSales/index')
        },
        {
          path: '/orderMap',
          name: 'orderMap',
          component: () => System.import('@/pages/orderMap/index')
        },
        {
          path: '/onlineProductAnalyze',
          name: 'onlineProductAnalyze',
          component: () => System.import('@/pages/onlineProductAnalyze/index')
        },
        {
          path: '/purchaseAnalyze',
          name: 'purchaseAnalyze',
          component: () => System.import('@/pages/purchaseAnalyze/index')
        },
        {
          path: '/storageAnalyze',
          name: 'storageAnalyze',
          component: () => System.import('@/pages/storageAnalyze/index')
        },
        {
          path: '/corporateReport',
          name: 'corporateReport',
          component: () => System.import('@/pages/corporateReport/index')
        },
        {
          path: '/returnOrder',
          name: 'returnOrder',
          component: () => System.import('@/pages/returnOrder/index')
        },
        {
          path: '/amazonProfit',
          name: 'amazonProfit',
          component: () => System.import('@/pages/amazonProfit/index')
        },
        {
          path: '/customerQuesition',
          name: 'customerQuesition',
          component: () => System.import('@/pages/customerQuesition/index')
        },
        {
          path: '/systemBulletin',
          name: 'systemBulletin',
          component: () => System.import('@/pages/systemBulletin/index')
        },
        {
          path: '/warehouse',
          name: 'warehouse',
          component: () => System.import('@/pages/warehouse/index')
        },
        {
          path: '/warehouse/goods/:id',
          name: 'warehouseGoodsList',
          component: () => System.import('@/pages/warehouse/productList')
        },
        {
          path: '/vaultManage',
          name: 'vaultManage',
          component: () => System.import('@/pages/vaultManage/index')
        },
        {
          path: '/amazonCargo',
          name: 'amazonCargo',
          component: () => System.import('@/pages/amazonCargo/index')
        },
      ]
    },
    {
      path: '/',
      redirect: { name: 'workbench' }
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
