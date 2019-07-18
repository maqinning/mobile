<template>
  <van-tabbar v-model="active" v-show='active!==5'  active-color="#3296FA">
  <van-tabbar-item icon="home-o" to='/'>主页</van-tabbar-item>
  <van-tabbar-item icon="comment-o" to='/ask' >问答</van-tabbar-item>
  <van-tabbar-item icon="tv-o" to='/video' >视频</van-tabbar-item>
  <van-tabbar-item icon="user-o" to='/user' >我的</van-tabbar-item>
</van-tabbar>
</template>
<script>
export default {
  computed: {
    active: {
      get () {
        return this.getActive()
      },
      set () {

      }
    }
  },
  methods: {
    getActive () {
      if (this.$route.path === '/') {
        return 0
      } else if (this.$route.path === '/ask') {
        return 1
      } else if (this.$route.path === '/video') {
        return 2
      } else if (this.$route.path === '/user') {
        return 3
      }
      return 5
    }
  }
}
</script>

<style>

</style>
