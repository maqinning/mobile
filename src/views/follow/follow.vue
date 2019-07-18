<template>
<div class="follow">
   <van-nav-bar
  class="toutiao-nav-bar"
  title="关注/粉丝"
  left-arrow
  @click-left="$router.go(-1)"
/>
<van-tabs  color="#3296FA"
   title-active-color='#4F5053'
   v-model="active"
   >
  <van-tab title="关注">
     <van-list
      v-model="followLoading"
      :finished="followFinished"
      finished-text="没有更多了"
      class="collect-list"
      @load="loadMoreFollow"
     >
    <div class="follow-item" v-for="(item,index) in follows" :key="index">
      <div class='left'>
       <img @click="goUser(item.id)" :src="item.photo" alt="">
       <div class="info">
         <span>{{item.name}}</span>
         <span>{{`粉丝数:${item.fans_count}`}}</span>
       </div>
      </div>
       <van-button @click="updateFollowUser(item)" :type="!item.cancelFollow ? 'default' : 'danger'">
         {{item.cancelFollow ? '关注' : item.mutual_follow ? '相互关注' : '已关注'}}
        </van-button>
    </div>
     </van-list>
  </van-tab>
  <van-tab title="粉丝">
    <van-list
      v-model="followerLoading"
      :finished="followerFinished"
      finished-text="没有更多了"
      class="collect-list"
      @load="loadMoreFollower"
     >
    <div class="follow-item" v-for="(item,index) in followers" :key="index">
      <div class='left'>
       <img @click="goUser(item.id)" :src="item.photo" alt="">
       <div class="info">
         <span>{{item.name}}</span>
         <span>{{`粉丝数${item.fans_count}`}}</span>
       </div>
      </div>
       <van-button @click="updateFollowerUser(item)" :type="item.mutual_follow ? 'default' : 'danger'">
         {{item.mutual_follow ? '相互关注':'关注' }}
         </van-button>
    </div>
   </van-list>
  </van-tab>
</van-tabs>
</div>

</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      followLoading: false,
      followerLoading: false
    }
  },
  computed: {
    ...mapState({
      follows: state => state.user.follows.list,
      followsPage: state => state.user.follows.page,
      followers: state => state.user.followers.list,
      followersPage: state => state.user.followers.page
    }),
    ...mapGetters(['followFinished', 'followerFinished']),
    active: {
      // 用来控制那个tab页显示
      get () {
        if (this.$route.query.type === 'c') {
          return 0
        }
        return 1
      },
      set () {

      }
    }
  },
  methods: {
    ...mapActions(['getFollows', 'getFollowers', 'updateFollowUser', 'updateFollowerUser']),
    async loadMoreFollow () {
      await this.getFollows({ page: this.followsPage + 1 })
      this.followLoading = false
    },
    async loadMoreFollower () {
      await this.getFollowers({ page: this.followersPage + 1 })
      this.followerLoading = false
    },
    goUser (userid) {
      this.$router.push({ path: '/people', query: { userid } })
    }
  },
  created () {
    this.getFollows() // 拉取关注列表
    this.getFollowers() // 拉取粉丝列表
  }
}
</script>

<style lang="less" scoped>
.follow {
  .follow-item {
     display: flex;
     flex-direction: row;
     justify-content: space-between;
     margin:20px 0;
     padding:0 20px;
     img {
       width:50px;
       height:50px;
       border-radius: 25px;
     }
     .left {
       display: flex;
       flex-direction: row;
       .info {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          margin-left:10px;
          align-items: baseline;
       }
     }
  }
}
</style>
