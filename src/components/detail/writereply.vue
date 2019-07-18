<template>
  <div class='reply-operate'>
    <div class='input-content'>
      <form @submit="sumitReply">
         <input  v-model="content" type="text" placeholder="写评论" >
      </form>
    </div>
    <van-icon  @click="scrollView" color='#777777' class="operate-icon" name="comment-o" size="22px"  >
      <span v-if="commentsLength">{{commentsLength}}</span>
    </van-icon>
    <van-icon v-if="!this.inReply" @click="collectOrCancel" :color='!iscollect ? "#777777" : "#FFC545"' class="operate-icon" :name="iscollect ? 'star' : 'star-o'" size="22px"  />
    <van-icon v-if="!this.inReply" @click="share" color='#777777' class="operate-icon" name="share" size="22px"  />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Toast } from 'vant'
import events from '@/utils/event'
export default {
  data () {
    return {
      content: ''
    }
  },
  props: ['getMyArticle', 'iscollect', 'articleId', 'setComments', 'inReply', 'currentReplyId', 'commentsLength'],
  methods: {
    ...mapActions(['collectArticle', 'cancelCollect']),
    sumitReply (event) {
      event.preventDefault()
      // 提交评论
      if (this.content && this.setComments) {
        let data = this.inReply ? { target: this.currentReplyId, content: this.content } : { content: this.content }
        let result = this.setComments(data) // 对文章进行评论
        if (result) {
          this.content = '' // 如果提交成功 则清空回复框内的内容
          this.inReply || events.$emit('scrollComment') // 将评论视图滚动到当前视图
        }
      }
    },
    async collectOrCancel () {
      if (!this.iscollect) {
        await this.collectArticle({ target: this.articleId }) // 这里应该根据状态判定取消还是确定
        Toast.success('收藏成功!')
      } else {
        await this.cancelCollect({ target: this.articleId }) // 这里应该根据状态判定取消还是确定
        Toast.success('取消收藏!')
      }
      this.getMyArticle && this.getMyArticle()
    },
    share () {
      Toast('当前分享功能暂不支持')
    },
    scrollView () {
      // 滚动视图
      this.inReply || events.$emit('scrollComment') // 将评论视图滚动到当前视图
    }
  }
}
</script>

<style lang="less" scoped>
 .reply-operate {
   position:fixed;
   bottom:0;
   left:0;
   background-color: #FFFFFF;
   width:100%;
   height:50px;
   border-top:1px solid #CCCCCC;
   box-sizing: border-box;
   padding: 5px 10px;
   display: flex;
   justify-content: space-around;
   align-items: center;
   .operate-icon {
     span{
       background-color: #e22829;
       color:#FFFFFF;
       font-size:11px;
       height:13px;
       width:13px;
       line-height: 13px;
       border-radius: 50%;
       display: inline-block;
       position: absolute;
       right:-9px;
       top:-6px;
       padding:2px;
       text-align: center;
     }
   }
   .input-content {
      flex-basis: 55%;
      border-radius: 40px;
      border:1px solid #eeeeee;;
      input {
        border:none;
        line-height:32px;
        height:32px;
        width:80%;
     }
   }
 }
</style>
