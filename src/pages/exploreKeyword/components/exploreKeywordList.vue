<template lang="html">
  <div class="explore-keyword-list" v-loading="loading">
    <div class="search-bar top-bar">
      <el-button
        size="small"
        type="success"
        @click="handleShowKeyWord"
        v-if="$store.state.powers.includes('explore_keyword:add')"
      >新增源词</el-button>
    </div>
    <div class="search-bar">
      <el-form
        :inline="true"
        label-width="80"
        class="fl"
        v-if="$store.state.powers.includes('explore_keyword:list')"
      >
        <el-form-item>
          <el-input size="small" placeholder="请输入历史源词" v-model="searchData.keyWord"></el-input>
        </el-form-item>
      </el-form>
      <div class="fr">
        <div>
          <el-button
            size="small"
            type="primary"
            @click="handleSearch"
            v-if="$store.state.powers.includes('explore_keyword:list')"
          >查找</el-button>
        </div>
      </div>
    </div>
    <list
      class="keyword-list"
      ref="list"
      :list="list"
      @change="handleChange"
      v-if="$store.state.powers.includes('explore_keyword:list')"
    >
      <li slot="prepend" v-if="isShowKeyWord">
        <div class="el-input el-input--small el-input-group el-input-group--append">
          <input id="keyWord" type="text" class="el-input__inner" v-model="keyWord" @keyup="handleKeyWordKeyup">
          <div class="el-input-group__append">
            <button type="button" class="el-button el-button--primary" @click="handleCreatekeyWord">
              <i class="el-icon-plus"></i>
            </button>
          </div>
        </div>
      </li>
      <li slot="prepend" v-if="list.length === 0 || list === null" style="text-align:center;">
        暂无数据
      </li>
      <template slot-scope="props">
        {{props.item.keyWord}}
      </template>
    </list>
  </div>
</template>

<script>
import extend from 'extend';
import List from '@/components/list';
import ExploreKeyword from '../services';

const exploreKeyword = new ExploreKeyword();

export default {
  components: {
    'list': List
  },
  data() {
    return {
      loading: false,
      keyWord: '',
      isShowKeyWord: false,
      list: [],
      searchData: {
        keyWord: ''
      }
    }
  },
  created() {
    exploreKeyword.getList().then((res) => {
      const list = (res.data.data || []);
      this.list = list;
      this.handleChange(list[0]);
    });
  },
  methods: {
    handleChange(data) {
      this.$emit('select', extend(true, {}, data));
    },
    handleKeyWordKeyup(e) {
      switch(e.keyCode) {
        case 27: // esc
          this.handleHideKeyWord();
          break;
        case 13: // entry
          this.handleCreatekeyWord();
          break;
      }
    },
    handleShowKeyWord() {
      this.keyWordFocus();
      if (this.isShowKeyWord) {
        return;
      }
      this.keyWord = '';
      this.isShowKeyWord = true;
    },
    handleSearch() {
      this.loading = true;
      exploreKeyword.getList(this.searchData.keyWord).then((res) => {
        this.loading = false;
        const list = res.data.data;
        this.list = list;
      }).catch(() => {
        this.loading = false;
      });
    },
    keyWordFocus() {
      setTimeout(() => {
        document.getElementById('keyWord').focus();
      }, 200);
    },
    keyWordBlur() {
      document.getElementById('keyWord').blur();
    },
    handleHideKeyWord() {
      this.isShowKeyWord = false;
    },
    handleCreatekeyWord() {
      this.loading = true;
      this.keyWordBlur();
      exploreKeyword.beginExplore(this.keyWord).then(() => {
        this.loading = false;
        this.createKeyWord();
      }).catch(() => {
        this.loading = false;
      });
    },
    createKeyWord() {
      let active = 0;
      let isKeyWordExists = false;
      const emptyData = {
        keyWord: this.keyWord,
        st1: '',
        st2: '',
        st3: '',
        st4: '',
        st5: '',
        allWord: ''
      };
      this.list.map((item, index) => {
        if (item.keyWord === this.keyWord) {
          active = index;
          isKeyWordExists = true;
        }
      });
      this.isShowKeyWord = false;
      if (!isKeyWordExists) {
        this.list.unshift(emptyData);
      }
      this.$emit('createKeyWord', this.keyWord);
      setTimeout(() => {
        this.$refs.list.setActive(active);
      });
    }
  }
}
</script>

<style lang="less">
.explore-keyword-list {
  .search-bar {
    .el-input__inner {
      width: 255px;
    }
  }
  .top-bar {
    .el-button {
      width: 100%;
    }
  }
}
</style>
