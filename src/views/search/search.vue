<template>
  <div class='search background'>
  <form action="/">
  <van-search
    class="searchBar"
    v-model="searchValue"
    placeholder=""
    show-action
    @onSearch="onSearch"
    @cancel="$router.go(-1)"
  />
</form>
<div class="split"></div>
<van-cell v-if="searchHistory.length" class="search-titlebar" title="历史记录"  >
  <van-icon @click="deleteHistory" slot="right-icon" name="delete" size="25px" />
</van-cell>
<div class='history-list'>
<div @click="selectKeyWord(item)" class='history-item' v-for="(item,index) in searchHistory" :key="index">
  {{item}}
</div>
</div>
<div class='suggestion' v-if="options.length">
   <van-cell  size="large"  icon='search' v-for="(item,index) in options" :title="item" :key="index" @click="selectKeyWord(item)">
  </van-cell>
</div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { Dialog } from 'vant'
import throttle from '@/utils/throttle'

export default {
  data () {
    return {
      searchValue: ''
    }
  },
  computed: {
    ...mapState({
      searchHistory: state => state.search.searchHistory,
      options: state => state.search.options,
      keyWord: state => state.search.keyWord
    })
  },
  watch: {
    searchValue (value) {
      this.updateKeyWord({ keyWord: value }) // 更新关键字
      throttle(this.suggestion, this, [value]) // 由于是值改变事件 所以需要节流函数 来优化搜索性能
    }
  },
  methods: {
    ...mapMutations(['updateKeyWord']),
    ...mapActions(['getUserSearchHistory', 'deleteSearchHistory', 'searchSuggestion']),
    onSearch () {
      this.updateKeyWord({ keyWord: this.searchValue }) // 更新关键字
      this.$router.push({ path: '/searchResult' }) // 跳转页面
    },
    suggestion (value) {
      this.searchSuggestion({ q: value }) // 搜索建议
    },
    selectKeyWord (item) {
      // 更新关键字
      this.updateKeyWord({ keyWord: item }) // 更新关键字
      this.$router.push({ path: '/searchResult' }) // 跳转页面
    },
    deleteHistory () {
      // 删除历史
      Dialog.confirm({
        title: '提示',
        message: '是否要删除搜索历史'
      }).then(() => {
        this.deleteSearchHistory() // 删除搜索历史
      }).catch(() => {
        console.log('取消')
      })
    }
  },
  created () {
    this.getUserSearchHistory() // 获取搜索历史
    if (this.keyWord) {
      this.searchValue = this.keyWord
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  width:100%;
  height:100%;
  position: fixed;
  left:0;
  top:0;
  z-index: 99;
  .searchBar {
     background-color:#3296FA !important;
     .van-search__action {
        color:#FFFFFF;
     }
  }
  .search-titlebar {
     text-align:left;
  }
  .history-list {
    display: flex;
    flex-direction: row;
    background-color:#FFFFFF;
    flex-wrap: wrap;
    .history-item {
      border-top: 0.5px solid #e8e8e8;
      flex-basis: calc(50% - 1px);
      height:45px;
      line-height: 45px;
      white-space:nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
   .history-item:nth-child(2n+1) {
     border-right: 0.5px solid #e8e8e8;
   }
  }
  .suggestion {
    position:absolute;
    top:50px;
    left:0;
    width:100%;
    height:100%;
    .van-cell__title {
      text-align: left;
    }
  }
}
</style>
