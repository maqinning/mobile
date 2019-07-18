<template>
  <div class='video'>
      <van-nav-bar
  class="toutiao-nav-bar"
  title="视频"
  left-arrow
  @click-left="$router.go(-1)"
/>
<van-list
 v-model="loading"
 :finished="finished"
  finished-text="没有更多了"
  class="video-list"
  @load="loadMoreVideo"
>
<div class='video-item' v-for="(item,index) in videos" :key="index">
  <div class='video-content'>
    黑马视频
  </div>
  <div class='video-info'>
    <img src="img/robot.jpg" alt="">
    <span>搞笑的奇葩坊</span>
  </div>
</div>
</van-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      videos: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    loadMoreVideo () {
      let newData = Array.from(Array(5), (value, index) => ({ title: '黑马视频' }))
      this.videos = [...this.videos, ...newData]
      this.loading = false
    }
  },
  created () {
    this.videos = Array.from(Array(5), (value, index) => ({ title: '黑马视频' }))
  }
}
</script>
<style lang="less" scoped>
 .video {
    .video-list {
      padding-bottom:100px;
      margin-top:50px;
      .video-content {
        height:200px;
        width:90%;
        color:#FFFFFF;
        background-color:#3E9DF8;
        margin:5px auto;
        line-height: 200px;
        font-size:30px;
        border-radius: 4px;
      }
      .video-info {
        height:80px;
        display: flex;
        flex-direction: row;
        padding:5px 20px;
        align-items: center;

        img {
          width:40px;
          height:40px;
          border-radius: 20px;
          margin-right: 10px;
        }
      }
    }
 }
</style>
