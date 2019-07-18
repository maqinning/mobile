<template>
  <div class="item-bottom" @click="topClick">
    <div @click="toComment">
      <van-icon  class="item-icon" name='comment-o' size="18px" color="#333333"></van-icon>
      <span>{{article.comm_count ? article.comm_count : '评论'}}</span>
    </div>
    <div @click="admire">
       <van-icon
        class="item-icon"
        :name=" article.is_liking ? 'like' : 'like-o'"
        size="18px"
        :color="article.is_liking ? '#FF4444' : '#333333'">
        </van-icon>
       <span>{{article.like_count ? article.like_count : '点赞'}}</span>
    </div>
    <div @click="share">
       <van-icon  class="item-icon" name='share' size="18px" color="#333333"></van-icon>
       <span>分享</span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast } from 'vant'
export default {
  props: ['article', 'toMoudle'],
  methods: {
    ...mapActions(['collectArticle', 'admireOrCancelList']),
    toComment (event) {
      event.stopPropagation() // 停止事件冒泡
      // 去评论页面 收藏和历史 跳转详情是一样的 但是操作的数据不同 所以跳转是同一个
      let moudle = this.toMoudle === 'history' ? 'collect' : this.toMoudle
      this.$router.push({ path: '/' + moudle + '/detail/' + this.article.art_id })
    },
    async admire (event) {
      event.stopPropagation() // 停止事件冒泡
      Toast.loading()
      // 取消点赞 或者点赞
      this.admireOrCancelList && await this.admireOrCancelList({
        target: this.article.art_id, // 文章id
        listtype: this.toMoudle, // 类型
        canceloradmire: !this.article.is_liking // 取消或者点赞
      })
      Toast.clear()
    },
    share (event) {
      event.stopPropagation() // 顶层的事件停止冒泡
      Toast('分享功能未实现')
    },
    topClick (event) {
      event.stopPropagation() // 顶层的事件停止冒泡
    }
  }

}
</script>
<style lang="less" scoped>
 .item-bottom {
   display: flex;
   flex-direction: row;
   justify-content: space-around;
   background-color: #FFFFFF;
   color: #333333;
   font-size:14px;
   &>div{
    cursor: pointer;
    flex-basis: 33%;
    height:45px;
    align-items: center;
    line-height: 45px;
    border-right: 0.5px solid #ececec;;
    .item-icon {
       vertical-align: sub;
       margin-right:5px;
    }
    &:nth-last-child(1) {
      border-right: none;
    }
   }
 }

</style>
