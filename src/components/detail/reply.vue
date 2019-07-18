<template>
  <div class='comments' ref="myComment">
    <van-list
      v-model="replyLoading"
      :finished="replyFinished"
      finished-text="没有更多了"
      class="reply-list"
      @load="loadMore"
    >
     <div class='item' v-for="(item,index) in dealCommonets" :key="index">
      <div class='title'>
          <img :src="item.aut_photo" alt="">
          <span class='username'>{{item.aut_name}}</span>
          <span class='admire'>
          <van-icon @click="likeOrdislike(item)" class="admire-icon" name="like" size="25px"  :color="item.is_liking ? '#FF4444' : '#544D4F'"/>
           {{item.like_count}}
          </span>
      </div>
      <div class='content'>
        <div class='info'>{{item.content}}</div>
        <div class='tips'>
          <span>{{item.pubdate}}</span>
          <span v-if="!inReply" @click="showReplies(item.com_id)" class='reply'>{{`回复${item.reply_count}`}}</span>
        </div>
      </div>
    </div>
    </van-list>
  </div>
</template>

<script>
import { formatDate } from '@/utils/date'
import event from '@/utils/event'
import { Toast } from 'vant'
import { articleType } from '@/constants/consttype'
export default {
  // inReply 属性为true时  说明此时该组件在回复弹窗内 其一些功能受到限制 比如不再显示多少回复
  props: ['currentReplyId', 'getMyComments', 'replyFinished', 'loadMoreReply', 'comments', 'likeOrdislikeComment', 'showReplies', 'inReply'],
  data () {
    return {
      replyLoading: false
    }
  },
  computed: {
    dealCommonets () {
      return this.comments.map(item => ({ ...item, pubdate: formatDate(item.pubdate) }))
    }
  },
  created () {
    this.inReply || event.$on('scrollComment', () => {
      // 滚动到当前视窗
      this.$refs.myComment && this.$refs.myComment.scrollIntoView(false)
    })
  },
  methods: {
    async likeOrdislike (item) {
      Toast.loading()
      this.likeOrdislikeComment && await this.likeOrdislikeComment({ target: item['com_id'], islike: item.is_liking })
      let type = this.inReply ? articleType.COMMENT : articleType.ARTICLE
      let source = this.currentReplyId || null
      this.getMyComments(source, type) // 重新拉取
      Toast.clear()
    },
    async loadMore () {
      // 为什么这里不直接绑定props方法呢 因为调用完毕之后还要手动关闭加载状态 所以需要中间加一个方法
      await this.loadMoreReply()
      this.replyLoading = false // 手动关闭状态
    }
  }
}
</script>
<style lang="less" scoped>
   .comments {
     box-sizing: border-box;
     margin: 20px 0;
     width:100%;
     margin-bottom: 100px;
     .reply-list {
       padding-bottom:100px;
     .item {
       .title {
         display: flex;
         flex-direction: row;
         position:relative;
          img {
            width:40px;
            height:40px;
            border-radius:50%;
          }
          .username {
            margin-left:10px;
            color:#708AB6;
            margin-top:5px;
          }
          .admire {
              position: absolute;
              right:10px;
              cursor: pointer;
            .admire-icon {
              vertical-align: sub;
            }
          }
       }
       .content {
          .info {
            text-align: left;
            margin-left:50px;
            font-size:16px;
            font-weight: 500;
          }
          .tips {
            text-align: left;
            margin:10px 0;
            margin-left:50px;
          }
          .reply {
            padding:5px 18px;
            background-color: #EFF7F8;
            border-radius: 40px;
            margin-left:10px;
          }
       }
     }
    }
   }
</style>
