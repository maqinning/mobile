<template>
  <div class='people background'>
 <van-nav-bar
  class="toutiao-nav-bar"
  :title="peopleInfo.name"
  left-arrow
  @click-left="$router.go(-1)"
>
  <van-icon @click="showOperate = true"  size="20px" name="ellipsis" slot="right" />
 </van-nav-bar>
<div class="header">
  <img :src="peopleInfo.photo" alt="" @click="showImg">
  <div class='user-info'>
    <div class='user-info-tong'>
      <div>
        <span>{{peopleInfo.art_count}}</span>
        <span>发布</span>
      </div>
      <div>
        <span>{{peopleInfo.follow_count}}</span>
        <span>关注</span>
      </div>
      <div>
        <span>{{peopleInfo.fans_count}}</span>
        <span>粉丝</span>
      </div>
      <div>
        <span>{{peopleInfo.like_count}}</span>
        <span>获赞</span>
      </div>
    </div>
    <van-button @click="followOrUnFollow" :class='peopleInfo.is_following?"btn-followed":"btn-follow"' >{{peopleInfo.is_following?'已关注':'关注'}}</van-button>
  </div>
</div>
<div class='split'></div>
<div class='user-set'>
  <span><em>认证:</em>{{peopleInfo.certi}}</span>
  <span><em>简介:</em>{{peopleInfo.intro}}</span>
</div>
<div class='split'></div>
  <van-list class='work-list'
   :finished="peopleFinished"
   v-model="loading"
   @load="loadMoreWork"
   >
    <div class='user-work' v-for="(item,index) in dateList" :key="index">
      <div class='user-pip'>
        <img :src="peopleInfo.photo" alt="">
        <div>
          <span>{{peopleInfo.name}}</span>
          <span>{{item.pubdate}}</span>
        </div>
      </div>
      <newitem toMoudle="people" :article="item">
        <itembottom  toMoudle="people" :article="item">
        </itembottom>
      </newitem>
       <div class='split'></div>
     </div>
   </van-list>
   <van-actionsheet
  v-model="showOperate"
  :actions="[{name:'举报 '},{name:'分享'},{name:peopleInfo.is_blacklist ? '取消拉黑' : '拉黑'}]"
  @select="onSelectSex"
/>
  <router-view></router-view>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import newitem from '@/components/main/newitem.vue'
import itembottom from '@/components/collect/itembottom.vue'
import { formatDate } from '@/utils/date'
import { ImagePreview, Toast, Dialog } from 'vant'
export default {
  data () {
    return {
      loading: false,
      showOperate: false
    }
  },
  components: { newitem, itembottom },
  computed: {
    ...mapState({
      peopleInfo: state => state.user.peopleInfo,
      worklist: state => state.user.peopleWork.list,
      page: state => state.user.peopleWork.page
    }),
    ...mapGetters(['peopleFinished']),
    dateList () {
      return this.worklist.map(item => ({ ...item, pubdate: formatDate(item.pubdate) }))
    }
  },
  methods: {
    ...mapActions(['blackUser', 'cancelBlackUser', 'cancelFollow', 'followUser', 'getPeopleInfo', 'getPeopleArticles']),
    async loadMoreWork () {
      let { userid } = this.$route.query // 获取用的userid
      await this.getPeopleArticles({ target: userid, params: { page: this.page + 1 } }) // 拉取个人的作品
      this.loading = false // 关闭状态
    },
    showImg () {
      ImagePreview({
        images: [this.peopleInfo.photo],
        showIndex: false
      })
    },
    async onSelectSex (item, index) {
      if (index === 2) {
        if (!this.peopleInfo.is_blacklist) {
          Dialog.confirm({
            title: '确认拉黑该用户？',
            message: '拉黑后将不再推荐此用户的文章，此用户无法给您发送任何信息'
          }).then(async () => {
            Toast.loading()
            await this.blackUser({ target: this.peopleInfo.id })
            this.showOperate = false
            let { userid } = this.$route.query
            await this.getPeopleInfo(userid) // 获取个人用户信息
            Toast.clear()
          }).catch()
        } else {
          Toast.loading()
          await this.cancelBlackUser({ target: this.peopleInfo.id })
          this.showOperate = false
          let { userid } = this.$route.query
          await this.getPeopleInfo(userid) // 获取个人用户信息
          Toast.clear()
        }
      }
    },
    async  followOrUnFollow () {
      // 关注或者取消关注
      Toast.loading()
      if (this.peopleInfo.is_following) {
        // 取消关注
        await this.cancelFollow(this.peopleInfo.id)
      } else {
        // 关注
        await this.followUser(this.peopleInfo.id)
      }
      let { userid } = this.$route.query
      await this.getPeopleInfo(userid) // 获取个人用户信息
      Toast.clear()
    }
  },
  created () {
    let { userid } = this.$route.query
    this.getPeopleInfo(userid) // 获取个人用户信息
    this.getPeopleArticles({ target: userid }) // 拉取个人的作品
  }
}
</script>

<style lang="less" scoped>
 .people {
   .header {
     display: flex;
     flex-direction: row;
     padding:10px;
     background-color:#FFFFFF;
     img {
       width:60px;
       height:60px;
       border-radius: 30px;
       margin:10px 10px;

     }
     .user-info {
       display: flex;
       flex-direction: column;
       align-items: center;
       flex-grow: 1;
       height:150px;
       justify-content: space-around;
       .user-info-tong {
         width:100%;
         display: flex;
         flex-direction: row;
         justify-content: space-around;
         &>div {
           display:flex;
           flex-direction: column;
           span:nth-child(1) {
             font-size:20px;
             margin-bottom:4px;
           }
           span:nth-child(2) {
             color:#9C989D;
           }
         }
       }
       .btn-follow,.btn-followed {
           width:145px;
           height:28px;
           line-height: 28px;
           background-color: #6bb5ff;
           color:#FFFFFF;
           border-radius: 5px;
        }
        .btn-followed {
          background-color: #ededed;
          color: #666666;
        }
     }
   }
   .user-set {
     display: flex;
     flex-direction: column;
     align-items: flex-start;
     padding:0 10px;
     padding-bottom: 20px;
     height:80px;
     background-color:#FFFFFF;
     justify-content: space-around;
   }
   .work-list {
      padding-bottom: 100px;
      .user-work {
        background-color: #FFFFFF;
        .user-pip {
          padding:10px;
          display: flex;
          flex-direction: row;
          img {
            width:50px;
            height:50px;
            border-radius: 50%;
             margin-right:10px;

          }
          >div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            font-size:14px;
            padding:3px 0;
            span:nth-child(2) {
              color:#9C989D;
            }
          }
        }
      }
   }
 }
</style>
