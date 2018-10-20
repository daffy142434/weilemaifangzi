<template lang="html">
  <div class="explore-keyword">
    <explore-keyword-list
      @select="handleSelect"
      @createKeyWord="handleCreateKeyWord"
    ></explore-keyword-list>
    <explore-keyword-result ref="exploreKeywordResult"></explore-keyword-result>
  </div>
</template>

<script>
import ExploreKeywordList from './components/exploreKeywordList';
import ExploreKeywordResult from './components/exploreKeywordResult';
export default {
  components: {
    'explore-keyword-list': ExploreKeywordList,
    'explore-keyword-result': ExploreKeywordResult
  },
  methods: {
    handleSelect(data) {
      this.$refs.exploreKeywordResult.loadData(data);
    },
    handleCreateKeyWord(keyWord) {
      this.$refs.exploreKeywordResult.createKeyWord(keyWord);
    }
  }
}
</script>

<style lang="less">
  .explore-keyword {
    display: flex;
    &-list {
      width: 350px;
      margin-right: 20px;
      .fr {
        margin-top: 4px;
      }
    }
    &-result {
      flex: 1;
    }
  }
</style>
