import extend from 'extend';
import store from '@/store/index';
import ajax from '@/lib/ajax';
import { Message } from 'element-ui';

const initGoodsInfoData = {
  relateSkuId: '',
  loading: false,
  hasSkuRelationModify: '1',
  skuId: '',
  name: '',
  enName: '',
  frName: '',
  deName: '',
  esName: '',
  itName: '',
  ptName: '',
  cnCargoInfo: '',
  enCargoInfo: '',
  frCargoInfo: '',
  deCargoInfo: '',
  esCargoInfo: '',
  itCargoInfo: '',
  ptCargoInfo: '',
  categoryId: '',
  categoryTreePath: '',
  purchasePrice: '',
  enName: '',
  skuStatus: "1",
  color: '',
  originSku: '',
  brand: '',
  developer: '',
  size: '',
  declareCnName: '',
  declareEnName: '',
  declareCode: '',
  declarePrice: '',
  declareCurrency: '',
  sizeWeight: '',
  batteryType: '',
  unitaryWeightUnit: '',
  unitaryWeight: '',
  unitarySizeUnit: '',
  unitarySizeLength: '',
  unitarySizeWidth: '',
  unitarySizeHeight: '',
  packageWeightUnit: '',
  packageWeight: '',
  packageSizeUnit: '',
  packageSizeLength: '',
  packageSizeWidth: '',
  packageSizeHeight: '',
  costPrice: '',
  packageSizeWeightRate: '',
  cnBulletPoint:[],
  enBulletPoint:[],
  frBulletPoint:[],
  deBulletPoint:[],
  esBulletPoint:[],
  itBulletPoint:[],
  ptBulletPoint:[],
  imgs: [],
  skuInfos: [],
  descriptions: {
    "cnDescription": "",
    "enDescription": "",
    "frDescription": "",
    "deDescription": "",
    "esDescription": "",
    "itDescription": "",
    "ptDescription": "",
  },
}

store.registerModule('goodsManager', {
  state: {
    title: '添加产品',
    goodsAction: '',
    shops: [],
    relateGoodsInfo: {
      isRelate: false,
      ...extend(true, {}, initGoodsInfoData)
    },
    goodsInfo: {
      isAdd: false,
      ...extend(true, {}, initGoodsInfoData)
    }
  },
  mutations: {
    resetGoodsInfo(state) {
      state.goodsInfo = {
        ...extend(true, {}, initGoodsInfoData),
        isAdd: false,
      };
    },
    resetRelateGoodsInfo(state) {
      state.relateGoodsInfo = {
        ...extend(true, {}, initGoodsInfoData),
        isRelate: false,
      };
    },
    changeAddStatus(state, status) {
      state.goodsInfo.isAdd = status;
    },
    changeRelateStatus(state, status) {
      state.relateGoodsInfo.isRelate = status;
    },
    setGoodsInfoItem(state, {name, value}) {
      state.goodsInfo[name] = value;
    },
    setGoodsInfo(state, {goodsInfo}) {
      goodsInfo.skuStatus = goodsInfo.skuStatus ? goodsInfo.skuStatus.toString() : '';
      goodsInfo.packageType = goodsInfo.packageType ? goodsInfo.packageType.toString() : '';
      goodsInfo.batteryType = goodsInfo.batteryType ? goodsInfo.batteryType.toString() : '';
      state.goodsInfo = goodsInfo;
    },
    setRelateGoodsInfo(state, {goodsInfo}) {
      goodsInfo.skuStatus = goodsInfo.skuStatus ? goodsInfo.skuStatus.toString() : '';
      goodsInfo.packageType = goodsInfo.packageType ? goodsInfo.packageType.toString() : '';
      goodsInfo.batteryType = goodsInfo.batteryType ? goodsInfo.batteryType.toString() : '';
      state.relateGoodsInfo = goodsInfo;
    },
    setAction(state, {action}) {
      state.goodsAction = action;
    }
  },
  actions: {
    getCategoriesList({parentId = 0, isTop = false}) {
      const params = {
        parentId,
        isTop
      }
      ajax.get('/categories/list', {params}).then(() => {
      });
    },

    getOnlineGoodsInfo(store, {skuId, shops = this.state.shops}) {
      let goodsInfo = extend(true, {}, this.state.goodsManager.relateGoodsInfo);

      goodsInfo.skuId = skuId;
      goodsInfo.imgs = [];
      goodsInfo.loading = true;
      this.state.shops = shops;
      ajax.post(`/online_product/${goodsInfo.skuId}/show`)
      .then((response) => {
        goodsInfo.loading = false;
        if(response.data.code == 200) {
          let data = response.data.data;

          goodsInfo.name = data.title;
          goodsInfo.enName = data.title;
          goodsInfo.skuStatus = 1;
          goodsInfo.costPrice = data.costPrice;
          goodsInfo.weight = data.weight;
          goodsInfo.weightUnit = data.weightUnit;
          goodsInfo.originSku = data.sku;
          goodsInfo.size = data.sku;
          goodsInfo.brand = data.brand;
          goodsInfo.imgs = [{name: '', url: data.mainPic}];
          goodsInfo.descriptions.cnDescription = data.fullDescription;

          // 处理关联sku
          const shop = shops.filter(s => s.id === data.shopId)[0];
          goodsInfo.skuInfos = [{
            originSku: data.sku,
            relationSku: data.sku,
            ecPlatformCode: shop.shopPlatform,
            shopId: shop.id,
          }];

          // 处理长宽高
          let packageSize = data.packageSize;

          if (packageSize) {
            packageSize = packageSize.split('*');
            goodsInfo.unitarySizeLength = packageSize[0];
            goodsInfo.unitarySizeWidth = packageSize[1];
            goodsInfo.unitarySizeHeight = packageSize[2];
            goodsInfo.unitarySizeUnitText = data.sizeUnit;
          }

          goodsInfo.purchasePrice = data.salePrice;

          // 处理重量
          goodsInfo.unitaryWeight = data.packageWeight;
          if (data.weightUnit === 'pounds') {
            data.weightUnit = 'lb';
          }
          goodsInfo.unitaryWeightUnit = data.weightUnit || 'lb';
          goodsInfo.unitarySizeUnit = data.unitarySizeUnit || 'inches';

          // 五个关键点
          const bulletPoint = [];

          for(let bulletPointIndex = 1; bulletPointIndex < 6; bulletPointIndex++) {
            let bulletPointKey = `bulletPoint${bulletPointIndex}`;
            let value = data[bulletPointKey];

            if (value) {
              bulletPoint.push(value);
            }
          }

          this.cnBulletPoint = bulletPoint;

          store.commit('setRelateGoodsInfo', {goodsInfo});
        }else {

          Message({
            showClose: true,
            message:'查询产品信息失败，请刷新重试',
            type: 'warning'
          });
        }
      })
      .catch((error) => {
        goodsInfo.loading = false;
        Message({
          showClose: true,
          message:'查询产品信息失败，请刷新重试',
          type: 'warning'
        });
      });
    },
    getGoodsInfo(state, {skuId}) {
      const {goodsManager} = this.state;
      let goodsInfo;
      if (this.state.action === 'addWithRelate' && !goodsManager.resetGoodsInfo.isRelate) {
        goodsInfo = extend(true, {}, goodsManager.relateGoodsInfo);
      } else {
        goodsInfo = extend(true, {}, goodsManager.goodsInfo);
      }
      if (skuId) {
        goodsInfo.skuId = skuId;
      }
      goodsInfo.imgs = [];
      goodsInfo.loading = true;
      ajax.get(`/products/${goodsInfo.skuId}/show`)
      .then((response) => {
        goodsInfo.loading = false;
        if(response.data.code == 200) {
          let data = response.data.data;
          for(let key of Object.keys(data)) {
            let obj = data[key];
            if(key=="mainImg" || key=="imgs") {
              if(goodsInfo.imgs.length <= 0) {
                goodsInfo.imgs.push({name: '', url: data.mainImg});
                for(let img of JSON.parse(data.imgs)) {
                  goodsInfo.imgs.push({name: '', url: img});
                }
              }
            }else if(key=="skuExtend") {
              let desKeys = [
                'cnDescription',
                'enDescription',
                'frDescription',
                'deDescription',
                'esDescription',
                'itDescription',
                'ptDescription',
              ];
              for(let desKey of desKeys) {
                goodsInfo['descriptions'][desKey] = obj[desKey].replace(/\<.*?\>/g, '');
              }

              let declareKeys = [
                'declareCnName',
                'declareEnName',
                'declareCode',
                'declareCurrency',
                'declarePrice',
              ];
              for(let declareKey of declareKeys) {
                goodsInfo[declareKey] = obj[declareKey];
              }
              for(let i=1;i<=5;i++) {
                (function (arg) {
                  obj['cnBulletPoint'+arg] && goodsInfo['cnBulletPoint'].push(obj['cnBulletPoint'+arg]);
                  obj['deBulletPoint'+arg] && goodsInfo['deBulletPoint'].push(obj['deBulletPoint'+arg]);
                  obj['enBulletPoint'+arg] && goodsInfo['enBulletPoint'].push(obj['enBulletPoint'+arg]);
                  obj['esBulletPoint'+arg] && goodsInfo['esBulletPoint'].push(obj['esBulletPoint'+arg]);
                  obj['frBulletPoint'+arg] && goodsInfo['frBulletPoint'].push(obj['frBulletPoint'+arg]);
                  obj['itBulletPoint'+arg] && goodsInfo['itBulletPoint'].push(obj['itBulletPoint'+arg]);
                  obj['ptBulletPoint'+arg] && goodsInfo['ptBulletPoint'].push(obj['ptBulletPoint'+arg]);
                })(i);
              }

            }else if(key=="relationList") {
              if(goodsInfo.action == 'clone') {
                goodsInfo['skuInfos'] = [];
              }else {
                for(let item of obj) {
                  item.originSku = goodsInfo.originSku;
                }
                goodsInfo['skuInfos'] = obj;
              }
            }else if(key == 'id') {
              if(goodsInfo.action == 'add' || goodsInfo.action == 'clone') {
                goodsInfo['skuId'] = '';
              }else if(location.hash.includes('edit')) {
                goodsInfo['skuId'] = obj;
              }
            }else if(key == 'originSku') {
              if(goodsInfo.action == 'clone') {
                goodsInfo['originSku'] = '';
              }else {
                goodsInfo['originSku'] = obj;
              }
            }else {
              goodsInfo[key] = obj;
            }
          }
          store.commit('setGoodsInfo', {goodsInfo});
        }else {

          Message({
            showClose: true,
            message:'查询产品信息失败，请刷新重试',
            type: 'warning'
          });
        }
      })
      .catch((error) => {
        goodsInfo.loading = false;
        Message({
          showClose: true,
          message:'查询产品信息失败，请刷新重试',
          type: 'warning'
        });
      });
    },
    saveGoods() {
      let goodsInfo;
      const {goodsAction} = this.state.goodsManager;
      switch (goodsAction) {
        case 'goodsAddWithRelate':
          goodsInfo = extend(true, {}, this.state.goodsManager.relateGoodsInfo);
          break;
        default:
          goodsInfo = extend(true, {}, this.state.goodsManager.goodsInfo);

      }
      if(!goodsInfo.originSku) {
        this.activeName = 'goodsInfo';
        Message({
          showClose: true,
          message:'保存商品信息，至少需要输入主SKU',
          type: 'warning'
        });
				return;
			}
      let url = "/products/add_temp";

      let data = {};
      for(let key of Object.keys(goodsInfo)) {
        let obj = goodsInfo[key];
        if(key == 'imgs') {
          let imgs = obj;
          for(let index =0;index<imgs.length;index++) {
            data['imgs['+index+']'] = imgs[index]['url'];
          }
        }else if(key == 'skuInfos') {
          let skuInfos = obj;
          for(let index =0;index<skuInfos.length;index++) {
            let tempKey = 'relationList['+index+'].';
            let nameArray = ['skuRelationId', 'shopId', 'ecPlatformCode', 'relationSku'];
            for(let name of nameArray) {
              data[tempKey + name] = skuInfos[index][name];
            }
          }
        }else if(key == 'descriptions') {
          let descriptions = obj;
          for(let key3 of Object.keys(descriptions)) {
            data['skuExtend.'+key3] = descriptions[key3];
          }
        }else {
          data[key] = obj;
        }
      }

      // 发送请求
      goodsInfo.loading = true;
      ajax.post(url, data)
      .then((response) => {
        goodsInfo.loading = false;
        if(response.data.code == 200) {
          goodsInfo.skuId = response.data.data.skuId;
          goodsInfo.action = 'edit';
					Message({
            showClose: true,
            message: response.data.msg || '操作成功',
            type: 'success'
          });
        }
      })
      .catch((error) => {
        goodsInfo.loading = false;
      });
    },
    submitGoods() {
      const {goodsAction} = this.state.goodsManager;
      let goodsInfo;
      let url = '/products/add';

      switch (goodsAction) {
        case 'goodsAddWithRelate':
          goodsInfo = extend(true, {}, this.state.goodsManager.relateGoodsInfo);
          if (goodsInfo.isRelate) {
            goodsInfo = extend(true, {}, this.state.goodsManager.goodsInfo);
          }
          url = '/products/add_with_relate';
          break;
        case 'goodsEdit':
          url = `/products/${this.state.goodsManager.goodsInfo.skuId}/modify`;
        default:
          goodsInfo = extend(true, {}, this.state.goodsManager.goodsInfo);

      }
      if (goodsInfo.isAdd) {
        url = `/products/${this.state.goodsManager.goodsInfo.skuId}/modify`;
      }
      let $route = this.$route;
      if(!goodsInfo.originSku) {
        this.activeName = 'goodsInfo';
        Message({
          showClose: true,
          message:'保存商品信息，至少需要输入主SKU',
          type: 'warning'
        });
				return;
      }

      let data = {};
      for(let key of Object.keys(goodsInfo)) {
        let obj = goodsInfo[key];
        if(key == 'imgs') {
          let imgs = obj;
          for(let index =0;index<imgs.length;index++) {
            data['imgs['+index+']'] = imgs[index]['url'];
          }
        }else if(key == 'skuInfos') {
          let skuInfos = obj;
          for(let index =0;index<skuInfos.length;index++) {
            let tempKey = 'relationList['+index+'].';
            let nameArray = ['skuRelationId', 'shopId', 'ecPlatformCode', 'relationSku'];
            for(let name of nameArray) {
              if(name == 'skuRelationId') {
                data[tempKey + name] = skuInfos[index]['id'] || '';
              }else  {
                data[tempKey + name] = skuInfos[index][name];
              }
            }
          }
        }else if(key == 'descriptions') {
          let descriptions = obj;
          for(let key2 of Object.keys(descriptions)) {
            data['skuExtend.'+key2] = descriptions[key2];
          }
        }else if(key == 'declareCnName'
          || key == 'declareEnName'
          || key == 'declareCode'
          || key == 'declarePrice'
          || key == 'declareCurrency') {
          data['skuExtend.'+key] = obj;
        }else if(key == 'cnBulletPoint'
          || key == 'deBulletPoint'
          || key == 'enBulletPoint'
          || key == 'esBulletPoint'
          || key == 'frBulletPoint'
          || key == 'itBulletPoint'
          || key == 'ptBulletPoint') {

          for(let i=1;i<=5;i++) {
            (function (arg) {
              data['skuExtend.'+key+arg] = '';
              if(obj && typeof obj == 'object' && obj.length>=1) {
                data['skuExtend.'+key+arg] = obj[arg-1] || '';
              }
            })(i);
          }
        }else {
          data[key] = obj;
        }

      }

      goodsInfo.loading = true;
      // 发送请求
      ajax.post(url, data)
      .then((response) => {
        goodsInfo.loading = false;
        if(response.data.code == 200) {
          goodsInfo.skuId = response.data.data.skuId;
          switch(goodsAction) {
            case 'goodsAddWithRelate':
              this.commit('changeRelateStatus', true);
              break;
          }
          this.commit('changeAddStatus', true);
          // 关联产品库成功后，就查询关联后的本地产品
          // 新增，编辑，克隆成功后，重新拉取数据
          this.dispatch('getGoodsInfo', {skuId: goodsInfo.skuId});
          Message({
            showClose: true,
            message: response.data.msg || '操作成功',
            type: 'success'
          });
        }
      })
      .catch((error) => {
        goodsInfo.loading = false;
      });
    },
  },
});
