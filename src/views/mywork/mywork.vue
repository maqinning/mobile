<template>
  <div class='mywork background'>
    <van-nav-bar
  class="toutiao-nav-bar"
  title="黑马程序员"
  left-arrow
  @click-left="$router.go(-1)"
/>
<van-tabs color="#3296FA"
   title-active-color='#4F5053'>
  <van-tab title="作品">
     <van-list
      v-model="workListLoading"
      :finished="workFinished"
      finished-text="没有更多了"
      class="work-list"
      @load="loadMoreWork"
     >
    <newitem v-for="(item,index) in articles" toMoudle='mywork' :article="item" :key="index">
       <itembottom toMoudle='mywork'  :article="item" />
       <div class='split'></div>
    </newitem>
     </van-list>
  </van-tab>
  <van-tab title="公告">
     <van-list
      v-model="announceListLoading"
      :finished="announceFinished"
      finished-text="没有更多了"
      class="work-list"
      @load="loadMoreAnnounce"
     >
     <div class="announce" v-for="(item,index) in announce" :key="index">
        <span>{{item.title}}</span>
        <span>{{item.pubdate}}</span>
     </div>
      </van-list>
  </van-tab>
  <van-tab title="数据">
   <div class="figure">
     <div>
      <span>粉丝数</span>
      <span>{{figure.fans_count}}</span>
    </div>
     <div>
      <span>阅读数</span>
      <span>{{figure.read_count}}</span>
    </div>
   </div>
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
      workListLoading: false,
      announceListLoading: false
    }
  },
  components: { newitem, itembottom },
  computed: {
    ...mapState({
      articles: state => state.user.articles.list,
      articlesPage: state => state.user.articles.page,
      announce: state => state.user.announce.list,
      announcePage: state => state.user.announce.page,
      figure: state => state.user.figure
    }),
    ...mapGetters(['workFinished', 'announceFinished'])
  },
  methods: {
    ...mapActions(['getUserArticles', 'getAnnounce', 'getFigure']),
    async loadMoreWork () {
      await this.getUserArticles({ page: this.articlesPage + 1 })
      this.workListLoading = false
    },
    async loadMoreAnnounce () {
      await this.getAnnounce({ page: this.announcePage + 1 })
      this.announceListLoading = false
    }
  },
  async created () {
    this.$toast.loading()
    await this.getUserArticles() // 获取当前用户文章列表
    await this.getAnnounce() // 获取公告列表
    await this.getFigure() // 获取统计数据
    this.$toast.clear()
  }
}
</script>

<style lang="less" scoped>
.mywork {
   .work-list {
      padding-bottom: 100px;
    }
  .announce {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding:20px 10px;
    justify-content: space-between;
    height:60px;
    background-color: #FFFFFF;
    margin-top:10px;
    span:nth-child(1) {
      font-size:15px;
      color: #3a3a3a;
    }
    span:nth-child(2) {
      color: #cccccc;
      font-size:12px;
    }
  }
  .figure {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background:#FFFFFF;
   &>div {
     display: flex;
    flex-direction: column;
    flex-basis: 50%;
    margin:20px 10px;
    height:70px;
    justify-content: space-around;
    &>span:nth-child(2) {
     color:#3a3a3a;
     font-size:40px;
    }
   }
   &>div:nth-child(1) {
    border-right:1px solid #CCCCCC;
   }
  }
}
</style>
