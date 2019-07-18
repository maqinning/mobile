<template>
  <div class='searchResult'>
     <van-nav-bar
  class="toutiao-nav-bar"
  title="搜索结果"
  left-arrow
  @click-left="$router.go(-1)"
/>
<van-list
      v-model="searchLoading"
      :finished="searchFinished"
      finished-text="没有更多了"
      class="search-list"
      @load="loadMoreSearch"
     >
     <newitem v-for="(item,index) in  searchResult" toMoudle='searchResult' style='margin-top:10px;' :article="item" :key="index">
      <itembottom :article="item" toMoudle='searchResult' />
      <div class='split'></div>
     </newitem>
   </van-list>
     <router-view></router-view>
  </div>
</template>

<script>
import newitem from '@/components/main/newitem.vue'
import itembottom from '@/components/collect/itembottom.vue'
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      searchLoading: false
    }
  },
  components: { newitem, itembottom },
  computed: {
    ...mapState({
      searchResult: state => state.search.searchResult.list,
      searchpage: state => state.search.searchResult.page,
      keyWord: state => state.search.keyWord
    }),
    ...mapGetters(['searchFinished'])
  },
  methods: {
    ...mapActions(['getSearchResult']),
    async loadMoreSearch () {
      await this.getSearchResult({ page: this.searchpage + 1 }) // 拉取下一页数据
      this.searchLoading = false
    }
  },
  created () {
    this.keyWord ? this.getSearchResult() : this.$router.replace({ path: 'search' }) // 拉取数据
  }
}
</script>

<style lang="less" scoped>
  .search-list {
    padding-bottom: 100px;
    background-color: #f9f9f9;
  }
</style>
