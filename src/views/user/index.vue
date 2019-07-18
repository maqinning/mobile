<template>
  <div class='user-display background'>
     <div class="header blueBack">
       <div class='user'>
         <router-link class='weidenglu' v-if="!userToken" to="/login"><img  src="img/wd_weidl.png" alt=""></router-link>
         <router-link v-if="userToken" to="/personalinfo"><img :src="userInfo.photo" alt=""></router-link>
         <div class="username">
           <div>{{userInfo.name}}</div>
         </div>
         <div class='readtime'>
           <span>今日阅读</span>
           <span>{{long}}</span>
         </div>
       </div>
          <div class='fans-info' v-if="userToken">
            <div @click="openPage('mywork')">
              <span>{{userInfo.art_count}}</span>
              <span>动态</span>
            </div>
           <div @click="openPage('follow?type=c')">
              <span>{{userInfo.follow_count}}</span>
              <span>关注</span>
            </div>
            <div @click="openPage('follow')">
              <span>{{userInfo.fans_count}}</span>
              <span>粉丝</span>
            </div>
       </div>
     </div>
     <div class="tools">
       <div @click="openPage('collect?type=c')">
         <van-icon color="#FF4444" name="star-o" size="35px"></van-icon>
         <span>收藏</span>
       </div>
       <div @click="openPage('collect?type=a')">
          <van-icon color="#FF9E1F" name="underway-o" size="35px"></van-icon>
          <span>历史</span>
       </div>
       <div @click="openPage('mywork')">
          <van-icon color="#6A93FF" name="records" size="35px"></van-icon>
          <span>作品</span>
       </div>
     </div>
     <div class="setting">
       <div class='split' />
       <van-cell @click="openNoticy" class='listitem' title="消息通知"  size="large"  is-link="">
         <van-badge v-if="newNoticyCount"  slot="right-icon"  :info="newNoticyCount" />
       </van-cell>
      <van-cell class='listitem' title="用户反馈" to="robot" size="large" is-link />
      <van-cell class='listitem' title="小智同学" to="robot" size="large" is-link />

     </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { getReadTime } from '@/utils/date'
export default {
  data () {
    return {
      long: null
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    ...mapMutations(['updateNotifyState']),
    openPage (path) {
      this.$router.push({ path }) // 跳转到对应路由页面
    },
    openNoticy () {
      this.updateNotifyState({ read: true }) // 点击之后更新状态
      this.$router.push({ path: 'message' }) // 跳转到对应路由页面
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(['newNoticyCount', 'userToken'])
  },
  created () {
    this.userToken && this.getUserInfo() // 拉取用户信息
    this.long = getReadTime() // 每隔三十秒计算一次时间
    setInterval(() => {
      this.long = getReadTime() // 每隔三十秒计算一次时间
    }, 30000)
  }

}
</script>

<style lang="less" scoped>
.user-display {
  .listitem {
    text-align: left;
  }
  .tools {
    display:flex;
    flex-direction: row;
    padding:20px 10px;
    justify-content: space-around;
    background-color: #FFFFFF;
    &>div {
      display: flex;
      flex-direction: column;
      align-items: center;
      height:70px;
      flex-basis: 33%;
      justify-content: space-around;
      &:nth-child(1),&:nth-child(2) {
        border-right: 1px solid #CCCCCC;
      }
    }
  }
 .header {
   height:200px;
   .user {
     padding:0px 20px;
     padding-top:40px;
     color:#FFFFFF;
     display: flex;
     flex-direction: row;
      .weidenglu {
          margin: 0 auto;
          .img {
            margin-left:90px;
          }
       }
     img {
       width:75px;
       height:75px;
       border-radius:50%;
     }
     .username {
       margin-left:20px;
       display: flex;
       flex-direction: column;
       height:60px;
       justify-content: space-between;
       padding:3px 0;
       box-sizing: border-box;
       div {
         &:nth-child(1) {
           font-size:18px;
           font-weight: 500;
         }
       }
     }
     .readtime {
        position:absolute;
        background:rgba(0, 0, 0, 0.3);
        color:#FFFFFF;
        right:0;
        top:60px;
        height:40px;
        font-size:12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding:2px 15px;
        border-radius: 20px 0 0 20px;
     }
   }
   .fans-info {
     color:#FFFFFF;
     display: flex;
     flex-direction: row;
     justify-content: space-around;
     padding:10px 0;
     &>div {
        flex-basis: 33%;
        display: flex;
        flex-direction: column;
        align-items: center;
        height:50px;
        justify-content: space-around;
     }
   }
 }
}
</style>
