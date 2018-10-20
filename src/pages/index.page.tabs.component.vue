<template lang="html">
  <el-tabs
    class="page-tabs"
    type="border-card"
    :closable="true"
    :activeName="activeName"
    @tab-click="handleTabChange"
    @tab-remove="handleTabRemove"
  >
    <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.name" :key="tab.name">
      <component
        :is="tab.componentName || null"
        @requestRemoveComponentCache="handleRequestRemoveComponentCache"
      ></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import ajax from '@/lib/ajax';
import addContextMenu from '@/lib/addContextMenu';
import events from '@/lib/events';
import menuExt from './index.menu.ext.data';

let tabsSaveKey;
export default {
  data() {
    return {
      tabs: [],
      hashs: {},
      routerNameMap: {},
      routerComponentMap: {},
      activeName: '',
      triggerRouterChangeType: 'browser',
      activeShopCount: ''
    }
  },
  created() {
    this.loadSavedTabs();
    this.checkShopActive();
    this.routerEach();
  },
  mounted() {
    events.addEventListener('createNewTab', (route) => {
      this.addTab(route);
    });
    events.addEventListener('addPageTab', (route) => {
      this.addTab(route);
    });
    addContextMenu((tab, action) => {
      switch(action) {
        case "closeAllTabs":
          this.tabs = [];
          this.saveTabs();
          break;
        case "closeOtherTabs":
          this.tabs = this.tabs.filter(t => t.name === tab.name);
          this.saveTabs();
          if (this.$router.currentRoute.name !== tab.name) {
            this.$router.push({name: tab.name});
          }
          break;
        case "refreshCurrentTabs":
          const selectTab = this.getTabByTabName(tab.name);
          selectTab.componentName = null;
          delete this.$options.components[tab.name];
          this.loadComponentByName(tab.name);
          break;
      }
    });
  },
  methods: {
    loadSavedTabs() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (userInfo) {
        tabsSaveKey = `tabs_${userInfo.id}`;
        const tabs = JSON.parse(sessionStorage.getItem(tabsSaveKey) || '[]');
        this.tabs = tabs.map((tab) => {
          return {
            label: tab.label,
            name: tab.name,
            componentName: null
          }
        })
      }
    },
    checkShopActive() {
      ajax.post(`/shops/count_active`).then((res) => {
        this.activeShopCount = res.data.data;
        this.triggerRouterChangeType = 'borwser';
        if (this.activeShopCount === 0) {
          switch(this.$router.currentRoute.name) {
            case 'company': case 'modifyPwd':
              break;
            default:
              this.$router.push({name: 'company'});
              this.$alert('您没有成功连线的店铺，请至少成功连线一个店铺。操作路径：系统设置-ERP总控-公司管理', '提示', {
                type: 'warning',
                center: true,
              });
          };
        }
      });
    },
    checkShopActiveOnRouterEach(name) {
      if (this.activeShopCount === 0) {
        switch(name) {
          case 'company': case 'modifyPwd':
            break;
          default:
            this.$router.push({name: 'company'});
            setTimeout(() => {
              this.$alert('您没有成功连线的店铺，请至少成功连线一个店铺。操作路径：系统设置-ERP总控-公司管理', '提示', {
                type: 'warning',
                center: true,
              });
            });
            return;
        }
      }
    },
    routerEach() {
      this.$router.beforeEach((to, form, next) => {
        const name = to.name;
        const parentName = this.findParent(name);
        if (to.name === form.name) {
          return;
        }else if(to.name !== form.name && Object.keys(to.params).length > 0 && to.params.toNewTab=='YES') {
          setTimeout(() => {
            const selectTab = this.getTabByTabName(to.name);
            selectTab.componentName = null;
            delete this.$options.components[to.name];
            this.loadComponentByName(to.name);
          });
        }
        this.checkShopActiveOnRouterEach(name);
        this.routerEachCheckTab(name, parentName);
        next();
      });
    },
    routerEachCheckTab(name, parentName) {
      switch(this.triggerRouterChangeType) {
        case 'newTab':  // 区分手动添加新页签和浏览器监控路由改变
          this.triggerRouterChangeType = 'browser';
          break;
        default:
          if (this.isNewPage(name)) {
            const newTab = this.getTabByTabName(this.activeName);
            if (newTab) {
              newTab.label = this.routerNameMap[parentName].label;
              newTab.name = parentName;
              newTab.componentName = null;
              this.loadComponentByName(name);
            }
          } else {
            this.loadComponentByName(name);
          }
          setTimeout(() => {
            this.activeName = parentName;
            this.saveTabs();
          });
      }
    },
    addTab(route) {
      if (typeof route !== 'object') {
        route = {
          name: route,
        };
      }
      const name = route.name;
      if (!isNaN(name)) {
        return;
      }

      if (this.activeShopCount === 0) {
        switch(name) {
          case 'company': case 'modifyPwd':
            break;
          default:
            this.$alert('您没有成功连线的店铺，请至少成功连线一个店铺。操作路径：系统设置-ERP总控-公司管理', '提示', {
              type: 'warning',
              center: true,
              callback: () => {
                this.$router.push({name: 'company', query: {}});
              }
            });
            return;
        }
      }


      let tabName = this.findParent(name);
      const menu = this.routerNameMap[tabName];

      const curTab = this.getTabByTabName(tabName);

      if (curTab) {
        const {componentName} = curTab;
        curTab.componentName = null;
        if (this.activeName === tabName && tabName !== componentName) {
          route.name = tabName;
          this.$router.push(route);
          return;
        } else {
          delete this.$options.components[tabName];
        }
      }

      let tab;

      if (this.isNewPage(tabName)) {
        this.createNewTab(menu.label, tabName);
        this.triggerRouterChangeType = 'newTab';
      }
      setTimeout(() => {
        this.loadComponentByName(name);
        this.$router.push(route);
        this.activeName = tabName;
      });
    },
    createNewTab(label, tabName) {
      const tab = {
        label: label,
        name: tabName,
        componentName: null
      };
      this.tabs.push(tab);
      this.saveTabs();
    },
    getTabByTabName(name) {
      const tab = this.tabs.filter(tab => tab.name === name)[0];
      return tab;
    },
    loadComponentByName(name) {
      const tabName = this.findParent(name);
      const tab = this.getTabByTabName(tabName);
      if (!this.$options.components[name]) {
        this.routerComponentMap[name]().then((component) => {
          this.$options.components[name] = component.default;
          tab.componentName = name;
        });
      } else {
        tab.componentName = name;
      }
    },
    isNewPage(name) {
      const ret = !!!this.tabs.filter((tab) => this.findParent(tab.name) === this.findParent(name)).length;
      return ret;
    },
    setRouterNameMap(routerNameMap) {
      this.routerNameMap = {
        ...routerNameMap,
        ...menuExt
      };
    },
    setRouterComponentMap(routerComponentMap) {
      this.routerComponentMap = routerComponentMap;
      setTimeout(() => {
        const currentName = this.$router.currentRoute.name;
        const parentName = this.findParent(currentName);
        if (!this.tabs.length) {
          this.addTab(currentName);
        }
        if (this.routerNameMap[currentName]) {
          if (currentName !== parentName) {
            this.$router.push({name: parentName});
          } else {
            this.loadComponentByName(currentName);
          }
          this.activeName = parentName;
        }
      });
    },
    saveTabs() {
      if (tabsSaveKey) {
        const tabs = this.tabs.map((tab) => {
          return {
            label: tab.label,
            name: tab.name
          }
        });
        sessionStorage.setItem(tabsSaveKey, JSON.stringify(tabs));
      }
    },
    findParent(name) {
      let parentName = name;
      let tmpParentName;
      const {routerNameMap} = this;

      while((tmpParentName = routerNameMap[parentName].parent)) {
        parentName = tmpParentName;
        if (!routerNameMap[parentName]) {
          console.error(`invalid parent ${parentName}`);
        }
      }
      return parentName;
    },
    setActiveTabOnTabRemove(newTabs, closeTabIndex) {
      let nextTab;

      if (this.tabs.length > 1) {
        if (closeTabIndex == 0) {
          nextTab = newTabs[0];
        } else {
          nextTab = newTabs[closeTabIndex - 1];
        }
        this.activeName = nextTab.name;
        this.$router.push({name: nextTab.name});
      }
    },
    handleTabChange(tab) {
      const curTab = this.tabs.filter(t => t.name === tab.name)[0];
      const newRouterName = curTab.componentName || curTab.name;
      const curRouterName = this.$router.currentRoute.name;
      const curHash = location.hash;
      const hash = this.hashs[newRouterName];
      this.hashs[curRouterName] = curHash;
      if (hash) {
        location.hash = hash.substring(1);
      } else {
        this.$router.push({name: newRouterName});
      }
    },
    handleTabRemove(name) {
      let closeTabIndex;

      const newTabs = this.tabs.filter((tab, index) => {
        if (tab.name === name) {
          closeTabIndex = index;
        }
        return tab.name !== name;
      });

      if (name === this.activeName) {
        this.setActiveTabOnTabRemove(newTabs, closeTabIndex);
      }
      this.tabs = newTabs;
      this.saveTabs();
    },
    handleRequestRemoveComponentCache(name) {
      const parentName = this.findParent(name);
      const tab = this.getTabByTabName(parentName);
      tab.componentName = null;
      delete this.$options.components[name];
    },
  }
}
</script>

<style lang="less">
.page-main {
  overflow: hidden;
}
.page-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-submenu {
    padding: 0 !important;
  }
  &>.el-tabs__header {
    height: 38px;
  }
  &>.el-tabs__content {
    flex: 1;
    overflow: auto;
    &>.el-tab-pane {
      height: 100%;
    }
  }
}
</style>
