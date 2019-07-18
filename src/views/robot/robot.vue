<template>
<div class="robot">
   <van-nav-bar
  class="toutiao-nav-bar"
  title="小智同学"
  left-arrow
  @click-left="$router.go(-1)"
/>
<div class='chat-list'>
<div class='chat-item' v-for="(item,index) in list" :key="index">
  <div :class="item.robot ? 'roboter' :'user'">
    <img :src="item.robot ? '/img/robot.jpg' : headImg" alt="">
    <div class='msg'>{{item.msg}}</div>
  </div>
</div>
</div>
  <div class='send-content'>
    <input v-model="msg" type="text" class='send-input' />
    <span @click="sendMsg" :class='msg ? "can-send" : "no-send" '>发送</span>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      msg: ''
    }
  },
  computed: {
    ...mapState({
      list: state => state.chat.list,
      headImg: state => state.user.userInfo.photo
    })
  },
  methods: {
    ...mapActions(['sendMessage']),
    sendMsg () {
      if (this.msg) {
        // 发送消息
        this.sendMessage({ msg: this.msg })
        this.msg = ''
      }
    }
  },
  created () {
    this.sendMessage({ msg: '你好,小智机器人' }) // 进入页面后首先给机器人发个消息 不计入消息记录
  }
}
</script>

<style lang="less" scoped>
 .robot  {
   padding-bottom: 100px;
   background-color: #FFFFFF;
   min-height: 100%;
   .toutiao-nav-bar {
     position:absolute;
     left:0;
     top:0;
     width:100%;
   }
   .chat-list {
     padding-top:100px;
   }
 .chat-item {
   padding: 0 16px;
   width:100%;
   height:100%;
   background-color: #FFFFFF;
   .roboter,.user {
      margin:40px 0;
      display: flex;
      flex-direction: row;
      max-width: 100%;
      img {
        width:36px;
        height: 36px;
        border-radius: 18px;
        margin-right:10px;
      }
      .msg {
        background-color: #e0effb;
        border: solid 1px #c2d9ea;
        font-size:15px;
        border-radius: 5px;
        padding:0 10px;
        line-height: 36px;
        color: #222222;
        max-width: 70%;
        word-wrap : break-word ;
        text-align: left;
      }
   }
   .user {
      flex-direction:row-reverse;
      margin-right:20px;
      .msg {
        margin-right:10px;
      }
   }
 }
.send-content {
     height:50px;
     width:100%;
     background-color: #F4F5F6;
     position: fixed;
     bottom:0;
     left:0;
     z-index:99;
     .send-input {
        height:36px;
        line-height: 36px;
        padding:0 10px;
        border-radius: 20px;
        width:76%;
        border:none;
        vertical-align:baseline;
     }
     .can-send,.no-send {
       font-size:16px;
       height:50px;
       line-height: 50px;
       display: inline-block;
       text-align: center;
       width:15%;
       color:#3E9DF8;
     }
     .no-send {
       color:#CACACA;
     }
   }
 }

</style>
