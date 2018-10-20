import ajax from '@/lib/ajax';

export default class ExploreKeyword {
  beginExplore (keyWord) {
    return ajax.post('/explore_keyword/begin_explore', {keyWord});
  }
  saveKeyWord (params = {}) {
    return ajax.post('/explore_keyword/add_five_st', params);
  }
  getList (keyWord) {
    return ajax.post('/explore_keyword/key_word_history', {keyWord});
  }
  getKeyWordDetail(keyWord) {
    return this.getList(keyWord);
  }
}
