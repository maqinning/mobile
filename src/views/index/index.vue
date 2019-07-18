<template>
<div class='main-content'>
  <div class='main-header'>
     <van-icon @click="showEditChannel" name="wap-nav" size="20px" color="#FFFFFF" />
    <van-search @focus="focusSearch" class='index-search'  placeholder="请输入搜索关键词"  />
    <van-icon  @focus="focusSearch" name="search" size="20px"  color="#FFFFFF" />
  </div>
   <van-pull-refresh
     v-model="pullLoading"
     @refresh="onRefresh">
  <van-tabs
  @change="changeChannel"
   color="#3296FA"
   title-active-color='#4F5053'
      swipeable
      animated
     ellipsis>
  <van-tab v-for="(item,index) in channels" :title="item.name" :key="index">

     <van-list
     :finished="articlesData[item.id] && articlesData[item.id].pre_timestamp === 0"
      finished-text="没有更多了"
      class="article-list"
      @load="loadMore"
     >
    <template v-if="articlesData[item.id]" >
          <newitem :showCloseIcon="true"  v-for="(article,index) in articlesData[item.id].data" toMoudle='index' :key="index" :article="article" :showAssignModal="showAssignModal" />
    </template>
    </van-list>
  </van-tab>
  </van-tabs>
  </van-pull-refresh>
  <van-popup class='pop-pannel' v-model="editPanel" position="left" >
    <div class="close" @click="showEditChannel">×</div>
     <editcata v-if="editPanel" />
  </van-popup>
   <van-dialog
  v-model="showAssign"
  :showConfirmButton="false"
  :lockScroll="true"
  :closeOnClickOverlay="true"
  className="head-assign"
>
<div class='assign-list' v-if='!showAssignList'>
<van-cell @click="dislike" icon="failure" class='btn' type="default">不感兴趣</van-cell>
<van-cell @click="showMoreAssign"  icon="warning-o" class='btn' type="default" is-link>反馈垃圾内容</van-cell>
<van-cell @click="blackUserById"  icon="delete" class='btn' type="default">拉黑作者</van-cell>
</div>
<van-cell v-if='showAssignList' @click="showAssignList = false" icon="arrow-left"   type="default"></van-cell>

<div class='assign-list' v-if='showAssignList'>
<van-cell @click="assginAricle(1)"  class='btn' type="default">标题夸张</van-cell>
<van-cell @click="assginAricle(2)"  class='btn' type="default">低俗色情</van-cell>
<van-cell @click="assginAricle(3)"  class='btn' type="default">错别字多</van-cell>
<van-cell @click="assginAricle(4)"  class='btn' type="default">旧闻重复</van-cell>
<van-cell @click="assginAricle(5)"  class='btn' type="default">广告软文</van-cell>
<van-cell @click="assginAricle(6)"  class='btn' type="default">内容不实</van-cell>
<van-cell @click="assginAricle(7)"  class='btn' type="default">涉嫌违法范围</van-cell>
<van-cell @click="assginAricle(8)"  class='btn' type="default">侵权</van-cell>
<van-cell @click="assginAricle(0)"  class='btn' type="default">其他问题</van-cell>

</div>
</van-dialog>
  <router-view></router-view>
</div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import newitem from '@/components/main/newitem.vue'
import editcata from '@/components/main/editcata.vue'
export default {
  data () {
    return {
      editPanel: false,
      listFinished: false,
      listLoading: true,
      pullLoading: false,
      showAssign: false,
      showAssignList: false,
      currentArticle: null
    }
  },
  components: { newitem, editcata },
  computed: {
    ...mapState({
      channels: state => state.index.channels,
      articlesData: state => state.index.articlesData, // 文章数据
      currentCata: state => state.index.currentCata // 当前分类
    })
  },
  created () {
    this.loadCata() // 拉取频道数据
  },
  methods: {
    ...mapActions(['dislikeArticleById', 'reportArticle', 'blackUser', 'loadMoreData', 'refreshData', 'loadCata', 'changeCata', 'loadChannel', 'getAllCata']),
    changeChannel (index) {
      // 分类切换
      if (this.channels[index]) {
        this.changeCata(this.channels[index]) // 触犯分类切换
      } else {
        console.log('不存在当前频道数据')
      }
    },
    async onRefresh () {
      await this.refreshData()
      this.pullLoading = false
    },
    async loadMore () {
      // 加载更多
      let result = await this.loadMoreData() // 加载更多
      if (result && result.finished) {
        // 结束
        this.listLoading = false
        this.listFinished = true // 结束
      }
    },
    showEditChannel () {
      // 编辑频道
      if (!this.editPanel) {
        // 更新全部频道
        this.getAllCata() // 调用全部频道列表的方法
      }
      this.editPanel = !this.editPanel // 编辑状态
    },
    focusSearch () {
      // 聚集搜索
      this.$router.push({ path: '/search' })
    },
    showAssignModal (article) {
      // 显示
      this.showAssign = true
      this.currentArticle = article
    },
    showMoreAssign () {
      this.showAssignList = true
    },
    async assginAricle (type) {
      await this.reportArticle({ target: this.currentArticle.art_id, type, article: this.currentArticle })
      this.$toast.success('举报成功')
      this.showAssignList = false
      this.currentArticle = null
      this.showAssign = false
    },
    async blackUserById () {
      await this.blackUser({ target: this.currentArticle.aut_id, article: this.currentArticle })
      this.$toast.success('拉黑成功')
      this.showAssignList = false
      this.currentArticle = null
      this.showAssign = false
    },
    async dislike () {
      await this.dislikeArticleById({ target: this.currentArticle.art_id, article: this.currentArticle })
      this.$toast.success('操作成功')
      this.showAssignList = false
      this.currentArticle = null
      this.showAssign = false
    }
  }
}
</script>

<style lang="less" scoped>
 .van-pull-refresh {
    &,
    &__track {
      height: calc(100vh - 100px);
      overflow-y: auto;
    }
  }
.main-content {
  width:100%;
  .head-assign {
   .assign-list {
      display: flex;
      flex-direction: column;
      .btn:not(:nth-last-child(1)) {
        border-bottom: 0.5px solid #edeff3;
      }
   }
  }
  .main-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    background-color: #3194FF !important;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    .index-search {
     background-color: #3194FF !important;
     flex-basis: 90%;
     .van-search__content {
       border-radius: 40px;
     }
   }
  }
  .article-list {
    padding-bottom: 50px;
  }
  .pop-pannel {
    background-color: #FFFFFF;
    width:85%;
    height:100%;
    .close {
      font-size:40px;
      text-align: left;
      padding-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
