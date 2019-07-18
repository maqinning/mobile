<template>
<div class="article-detail">
<van-nav-bar
@click-left="$router.go(-1)"
  left-arrow
 >
 <span class='title' slot="title">{{articleInfo.title}}</span>
  <van-icon size="20px" name="ellipsis" slot="right" color="#FFFFFF"/>
  <van-icon size="20px" name="arrow-left"  slot="left" color="#FFFFFF"/>
</van-nav-bar>
  <div class="article-info">
    <div class="article-title">{{articleInfo.title}}</div>
    <div class='article-author'>
      <div class='left-info'>
      <img @click="goUser(articleInfo.aut_id)" :src="articleInfo.aut_photo" alt="">
      <div class="author-info">
       <span>{{articleInfo.aut_name}}</span>
       <span>{{publishDate}}</span>
      </div>
      </div>
       <van-button type="info" :loading="following" @click="followOrCancel" >
        <van-icon name="plus" v-show="!following && !articleInfo.is_followed"   class='follow-icon' />
         {{articleInfo.is_followed ? '已关注' : '关注'}}
         </van-button>
    </div>
    <div class="ariticle-content" v-html="articleInfo.content">
    </div>
    <div class="operate">
      <van-button @click="admireOrCancel" round plain :type="admireSelect ? 'danger' : 'default'">
          <van-icon class="operate-icon" name="like" size='20px'  :color="admireSelect ? '#FF4444':'#636363'"/>
        点赞</van-button>
      <van-button @click="dislikeOrCancel" round plain :type="dislikeSelect ? 'danger' : 'default'">
          <van-icon class="operate-icon" name="delete" size='20px'  :color="dislikeSelect ?'#FF4444' :'#636363' "/>
        不喜欢</van-button>
    </div>
    <recomment :recomments="articleInfo.recomments ? articleInfo.recomments : []"/>
    <reply
    :getMyComments="getMyComments"
    :replyFinished="replyFinished"
    :loadMoreReply="loadMoreComments"
    :showReplies="showReplies"
    :comments="comments"
    :likeOrdislikeComment="likeOrdislikeComment"/>
    <writereply
    :getMyArticle="getMyArticle"
    :iscollect="articleInfo.is_collected"
    :articleId="artid"
    :commentsLength="commentsTotal"
    :setComments="setComments" />
    <popreply :commentsLength="commentReplies.length">
      <reply
       slot='content'
      :likeOrdislikeComment="likeOrdislikeComment"
      :getMyComments="getMyComments"
      :currentReplyId="currentReplyId"
      :replyFinished="currentFinished"
      :loadMoreReply="loadMoreReply"
      :comments="commentReplies" :inReply="true" />
      <writereply
       slot="write"
      :commentsLength="currentReplies.total"
      :currentReplyId="currentReplyId"
      :setComments="setComments"
      :inReply="true" />
    </popreply>
  </div>
</div>

</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { articleType } from '@/constants/consttype'
import reply from '@/components/detail/reply.vue'
import writereply from '@/components/detail/writereply.vue'
import recomment from '@/components/detail/recomment.vue'
import popreply from '@/components/detail/popreply.vue'
import { formatDate } from '@/utils/date'
export default {
  components: { reply, writereply, recomment, popreply },
  created () {
    this.getMyArticle() // 获取文章
    this.getMyComments() // 获取评论

    // 获取文章评论 会将原有的缓存数据覆盖掉
  },
  data () {
    return {
      artid: null,
      trace: null,
      following: false
    }
  },
  computed: {
    publishDate () {
      return formatDate(this.articleInfo.pubdate)
    },
    ...mapState({
      articleInfo: state => state.article.articleInfo,
      comments: state => state.article.comments,
      lastId: state => state.article.lastId,
      endId: state => state.article.endId,
      currentReplies: state => state.article.currentReplies, // 当前弹层的评论及回复
      commentsTotal: state => state.article.commentsTotal // 当前回复记录总数
    }),
    ...mapGetters(['currentFinished', 'replyFinished', 'currentReplyId', 'admireSelect', 'dislikeSelect', 'commentReplies', 'repliesLoadMore', 'commentsLoadMore'])
  },
  methods: {
    ...mapActions(['showReplies', 'likeOrdislikeComment', 'setComments', 'getArticleById', 'getComments', 'followUser', 'cancelFollow', 'admireOrCancel', 'dislikeOrCancel']),
    async followOrCancel () {
      this.following = true // 显示按钮的进度
      // 关注或者取消关注
      if (this.articleInfo.is_followed) {
        // 取消关注
        await this.cancelFollow(this.articleInfo.aut_id) // 关注
      } else {
        // 关注
        await this.followUser(this.articleInfo.aut_id) // 关注
      }
      this.following = false // 显示按钮的进度
    },
    async loadMoreComments () {
      // 加载更多评论
      await this.getComments({ source: this.artid, type: articleType.ARTICLE, offset: this.lastId })
    },
    async loadMoreReply () {
      // 加载更多回复
      await this.getComments({ source: this.artid, type: articleType.COMMENT, offset: this.currentReplies.lastId })
    },
    goUser (userid) {
      this.$router.push({ path: '/people', query: { userid } })
    },
    getMyArticle () {
      this.artid = this.$route.params.id // 获取当前的文章id
      this.trace = this.$route.query // 获取埋点数据
      this.getArticleById({ artid: this.artid, trace: this.trace.click }) // 要传入埋点参数
    },
    getMyComments (source, type) {
      this.artid = this.$route.params.id // 获取当前的文章id
      this.getComments({ source: source || this.artid, type: type || articleType.ARTICLE }) // 有可能是同样调用的方法
    }
  }
}
</script>

<style lang="less" scoped>
 .article-detail {
   width:100%;
   height:100%;
   overflow-y: auto;
   background: #FFFFFF;
   position: fixed;
   left:0;
   top:0;
   z-index: 99;
   .title {
     color:#FFFFFF;
     font-size:18px;
   }
   .article-info {
     box-sizing: border-box;
     padding:  10px;
     .article-title {
        font-size:30px;
        margin:20px 0;
     }
     .article-author {
        z-index: 2;
        position:sticky;
        left:0;
        top:0;
        padding:10px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #FFFFFF;
        img {
          width:50px;
          height:50px;
          border-radius: 50%;
          margin-right:10px;
        }
        .left-info {
          display: flex;
          flex-direction: row;
        }
        .author-info {
          display: flex;
          flex-direction: column;
          align-items: baseline;
          justify-content: space-around;
        }
        .follow-icon {
          vertical-align: sub;
        }
     }
     .ariticle-content {
      box-sizing: border-box;
      margin:30px 0;
      text-align:left;
      white-space:normal;
      overflow: hidden;
     }
   }
   .operate {
     display: flex;
     flex-direction: row;
     justify-content: space-around;
     .operate-icon {
       vertical-align:sub;
     }
   }
 }
 .van-nav-bar {
   background-color: #3194FF;
 }
</style>
