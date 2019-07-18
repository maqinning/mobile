<template>
  <div class='ask'>
      <van-nav-bar
  class="toutiao-nav-bar"
  title="问答"
  left-arrow
  @click-left="$router.go(-1)"
/>
<van-list
 v-model="loading"
 :finished="finished"
  finished-text="没有更多了"
  class="ask-list"
  @load="loadMoreAsk"
>
<div class='ask-item' v-for="(item,index) in videos" :key="index">
  <div class='ask-content'>
    黑马问答
  </div>
  <div class='ask-info'>
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
    loadMoreAsk () {
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
 .ask {
    .ask-list {
      padding-bottom:100px;
      margin-top:50px;
      .ask-content {
        height:200px;
        width:90%;
        color:#FFFFFF;
        background-color:#3E9DF8;
        margin:5px auto;
        line-height: 200px;
        font-size:30px;
        border-radius: 4px;
      }
      .ask-info {
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
