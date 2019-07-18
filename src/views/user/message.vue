<template>
  <div class='message'>
 <van-nav-bar
  class="toutiao-nav-bar"
  title="消息"
  left-arrow
  @click-left="$router.go(-1)"
/>
<div class='notify-item' v-for="(item,index) in  notifyList" :key="index">
 <img :src="item.user_photo" alt="">
 <div class='info'>
    <div class='content'>
      <span>{{item.item.user_name}}</span>
      <span v-if='item.type === "comment"'>评论了你的<em>{{item.art_title}}</em></span>
      <span v-if='item.type === "follow"'>关注了你</span>
      <span v-if='item.type === "like"'>点赞了你的<em>{{item.art_title}}</em></span>
    </div>
    <span>2019-09-20</span>
 </div>
</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      notifyList: state => state.chat.notifyList
    })
  }
}
</script>
<style lang="less" scoped>
 .message {
   .notify-item {
      display: flex;
      flex-direction: row;
      border-bottom: 0.5px solid #edeff3;
      box-sizing: border-box;
      padding:10px 20px;
      img {
        width:36px;
        height:36px;
        border-radius: 18px;
      }
      .info {
         display: flex;
         flex-direction: column;
         justify-content:space-between;
         margin-left:10px;
      }
   }
 }
</style>
