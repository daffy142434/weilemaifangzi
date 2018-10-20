<template lang="html">
  <div class="explore-keyword-result" v-loading="loading">
    <div class="result-header">
      关键字：{{keyWord}}
      <el-button
        type="primary"
        size="small"
        @click="handleReExplore"
        v-if="$store.state.powers.includes('explore_keyword:add')"
      >重新探索该源词</el-button>
    </div>
    <div class="result-sell-point">
      <list
        class="st-list"
        ref="list"
        :list="stList"
        @change="handleStChange"
      >
        <template slot-scope="props">
          <div class="text">
            卖点{{props.index + 1}}：{{props.item}}
          </div>
          <div :class="{total: true, danger: props.item.length > 200}">
            {{props.item.length}}/200
          </div>
        </template>
      </list>
      <div class="keywords">
        <el-checkbox-group v-model="currentSt" @change="handleWordChange">
          <word
            v-for="word in allWordList"
            :word="word"
            :data="data"
            :key="word"
          ></word>
        </el-checkbox-group>
      </div>
      <div v-if="!allWordList || allWordList.length !== 0">
        <el-button
          type="primary"
          @click="handleSave"
          v-if="$store.state.powers.includes('explore_keyword:add')"
        >保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import extend from 'extend';
import List from '@/components/list';
import Word from './word';
import ExploreKeyword from '../services';

const exploreKeyword = new ExploreKeyword();

export default {
  components: {
    List,
    Word
  },
  data() {
    return {
      loading: false,
      isInit: false,
      st: 'st1',
      keyWord: '',
      currentSt: [],
      allWord: '',
      allWordList: [],
      data: {},
      keyWordPuller: {}
    }
  },
  computed: {
    stList() {
      return [
        this.data.st1 || '',
        this.data.st2 || '',
        this.data.st3 || '',
        this.data.st4 || '',
        this.data.st5 || '',
      ]
    }
  },
  methods: {
    getEmptyData() {
      return {
        st: 'st1',
        currentSt: [],
        allWord: '',
        allWordList: [],
        keyWord: ''
      }
    },
    loadData(data) {
      this.keyWord = data.keyWord;
      if (this.keyWordPuller[data.keyWord]) {
        this.addPuller(data.keyWord);
      } else {
        this.pullData(data.keyWord);
      }
    },
    pullData(keyWord) {
      if (this.keyWord === keyWord) {
        this.loading = true;
      }
      exploreKeyword.getKeyWordDetail(keyWord).then((res) => {
        if (!this.keyWordPuller[keyWord]) {
          this.loading = false;
        }
        const list = (res.data.data || []);
        if (list && list.length) {
          const [data] = list;
          data.st1 = data.st1 || '';
          data.st2 = data.st2 || '';
          data.st3 = data.st3 || '';
          data.st4 = data.st4 || '';
          data.st5 = data.st5 || '';
          this.bindData(data);
          if (data.status === 1) {
            this.removePuller(keyWord);
            this.loading = false;
          }
        } else {
          if (this.keyWord === keyWord) {
            this.bindData(this.getEmptyData())
          }
        }
      }).catch(() => {
        this.loading = false;
      });
    },
    bindData(data) {
      this.st = 'st1';
      if (data[this.st]) {
        this.currentSt = data[this.st].split(',');
      } else {
        this.currentSt = [];
      }
      if (data.allWordList && data.allWordList.length) {
        this.allWordList = data.allWordList;
      } else {
        this.allWordList = [];
      }
      this.keyWord = data.keyWord;
      this.data = data;
    },
    bindEmptyData(keyWord) {
      this.bindData({
        keyWord,
        st1: '',
        st2: '',
        st3: '',
        st4: '',
        st5: '',
        allWord: '',
        allWordList: []
      });
    },
    createKeyWord(keyWord) {
      this.bindEmptyData(keyWord);
      this.addPuller(keyWord);
    },
    addPuller(keyWord) {
      const SLEEP = 5000;
      const TIME_LIMIT = 60000;

      const timer = setInterval(() => {
        const {beginTimestamp} = this.keyWordPuller[keyWord];
        if (Date.now() - beginTimestamp > TIME_LIMIT) {
          clearInterval(timer);
          delete this.keyWordPuller[keyWord];

        }

        this.pullData(keyWord);

      }, SLEEP);

      if (!this.keyWordPuller[keyWord]) {
        this.keyWordPuller[keyWord] = {
          beginTimestamp: Date.now(),
          timer
        }

      } else {
        clearInterval(this.keyWordPuller[keyWord].timer);
        this.keyWordPuller[keyWord].timer = timer;

      }

      this.pullData(keyWord);
    },
    removePuller(keyWord) {
      const {timer} = this.keyWordPuller[keyWord];
      clearInterval(timer);
      delete this.keyWordPuller[keyWord];
    },
    handleStChange(value, index) {
      if (this.data[`st${index + 1}`]) {
        this.currentSt = this.data[`st${index + 1}`].split(',');
      } else {
        this.currentSt = [];
      }
      this.st = `st${index + 1}`;
    },
    handleWordChange(values) {
      this.data[this.st] = values.join(',');
    },
    handleSave() {
      const data = extend(true, {}, this.data);
      delete data.allWord;
      delete data.allWordList;
      exploreKeyword.saveKeyWord(data);
    },
    handleReExplore() {
      this.loading = true;
      exploreKeyword.beginExplore(this.keyWord).then(() => {
        this.loading = false;
        this.bindEmptyData(this.keyWord);
        this.addPuller(this.keyWord);
      }).catch(() => {
        this.loading = false;
      });
    }
  }
}
</script>

<style lang="less">
  .result-header {
    padding: 11px;
    line-height: 40px;
    margin-bottom: 15px;
    .el-button {
      margin-left: 10px;
    }
  }
  .explore-keyword-result {
    .keywords {
      margin: 20px 0;
    }
    .el-checkbox {
      margin-left: 0;
      margin-right: 30px;
    }
  }
  .st-list {
    &>li {
      display: flex;
      &.active {
        color: #000;
        background: #efefef;
      }
      .text {
        flex: 1;
        margin-right: 10px;
      }
      .total {
        width: 60px;
      }
    }
  }
  .keywords {
    border: #cdcdcd 1px solid;
    height: 200px;
    padding: 10px;
    overflow: auto;
    .already-select {
      .el-checkbox__label {
        text-decoration: underline;
      }
    }
  }
</style>
