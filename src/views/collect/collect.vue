<template>
  <div class='collect background'>
    <van-nav-bar
  class="toutiao-nav-bar"
  title="收藏/历史"
  left-arrow
  @click-left="$router.go(-1)"
/>
<van-tabs
   color="#3296FA"
   title-active-color='#4F5053'
    v-model="active"
 >
  <van-tab title="我的收藏" class="collect-page">
     <van-list
      v-model="collectListLoading"
      :finished="collectFinished"
      finished-text="没有更多了"
      class="collect-list"
      @load="loadMoreCollect"
     >
       <newitem v-for="(item,index) in collect"  :article="item" :key="index" toMoudle='collect'>
         <itembottom  :article="item" toMoudle='collect' />
         <div class='split'></div>
      </newitem>
    </van-list>
  </van-tab>
  <van-tab title="我的历史">
     <van-list
      v-model="historyListLoading"
      :finished="historyFinished"
      finished-text="没有更多了"
      class="collect-list"
      @load="loadMoreHistory"
     >
       <newitem v-for="(item,index) in history" :article="item" :key="index" toMoudle='collect'>
         <itembottom  :article="item" toMoudle='history' />
         <div class='split'></div>
      </newitem>
     </van-list>
  </van-tab>
</van-tabs>
  <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import newitem from '@/components/main/newitem.vue'
import itembottom from '@/components/collect/itembottom.vue'
export default {
  data () {
    return {
      collectLoading: false,
      collectListLoading: false,
      historyLoading: false,
      historyListLoading: false
    }
  },
  components: { newitem, itembottom },
  computed: {
    ...mapState({
      collect: state => state.user.collect.list,
      history: state => state.user.history.list,
      collectPage: state => state.user.collect.page, // 收藏
      historyPage: state => state.user.history.page // 历史
    }),
    ...mapGetters(['collectFinished', 'historyFinished']),
    active: {
      // 用来控制那个tab页显示
      get () {
        if (this.$route.query.type === 'c') {
          return 0
        }
        return 1
      },
      set () {

      }
    }
  },
  methods: {
    ...mapActions(['getUserCollect', 'getUserHistory']),
    async  onCollectRefresh () {
      // 收藏分页
      await this.getUserCollect() // 更新
      this.collectLoading = false // 更新状态
    },
    async onHistoryRefresh () {
      // 历史分页
      await this.getUserHistory() // 更新
      this.historyLoading = false // 更新状态
    },
    async loadMoreHistory () {
      // 分页加载历史
      await this.getUserHistory({ page: this.historyPage + 1 })
      this.historyListLoading = false
    },
    async loadMoreCollect () {
      // 分页加载收藏
      await this.getUserCollect({ page: this.collectPage + 1 })
      this.collectListLoading = false
    }
  },
  created () {
    this.getUserCollect() // 拉取收藏列表数据
    this.getUserHistory() // 拉取历史数据
  }
}
</script>

<style lang="less" scoped>
.collect {
   .collect-list {
         padding-bottom:100px;
   }
}
</style>
