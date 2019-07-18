<template>
  <div class='article-item' @click="toDetail">
     <div class='header'>
       <span class='title'>{{article.title}}</span>
       <div class='cover-one' v-if='article.cover && article.cover.type == 1'>
         <img :src="article.cover.images[0]" alt="" onerror='this.src="img/default.jpg"'>
       </div>
       </div>
     <div class='cover-three' v-if='article.cover && article.cover.type == 3'>
        <img v-for="img in article.cover.images" :src="img" :key="img" alt="" onerror='this.src="img/default.jpg"' />
     </div>
     <div class='operate'>
        <div class='left'>
          <span class='popup' v-if='article.is_top'>置顶</span>
          <span >{{article.aut_name}}</span>
          <span class='set'>{{`${article.comm_count}评论`}}</span>
          <span class='set'>{{publishDate}}</span>
        </div>
        <div v-if="showCloseIcon" class='right' @click="assign">×</div>
     </div>
     <slot v-bind:article="article"></slot>
  </div>
</template>

<script>
// 需要注意的是 toMoudle 这个属性 由于此组件在多个页面中公用 多半是采用嵌套路由的方式 来保证返回时 主页内容不销毁
// 所以需要配置多个详情页的嵌套路由 所以该组件需要知道跳转到哪一个嵌套路由
import { formatDate } from '@/utils/date'
export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    toMoudle: {
      type: String,
      required: true
    },
    showAssignModal: {
      type: Function
    },
    showCloseIcon: {
      type: Boolean
    }
  },
  computed: {
    publishDate () {
      return formatDate(this.article.pubdate)
    }
  },
  methods: {
    // 到详情页
    toDetail () {
      this.$router.push({
        path: '/' + this.toMoudle + '/detail/' + this.article.art_id,
        query: { ...this.article.trace } })
    },
    assign (event) {
      event.stopPropagation() // 停止事件冒泡
      this.showAssignModal && this.showAssignModal(this.article)
    }
  }
}
</script>

<style lang='less' scopted>
.article-item {
  display: flex;
  flex-direction: column;
  background-color:#FFFFFF;
  .header {
     display: flex;
     flex-direction: row;
     align-items: baseline;
     justify-content: space-between;
     .title {
       font-size:16px;
       font-weight: 500;
       color: #3a3a3a;
       letter-spacing: 1px;
       font-stretch: normal;
       padding:8px 12px;
       flex-basis: 70%;
       text-align: left;
     }
  }
  .cover-one {
     align-self: flex-end;
     display: flex;
     flex-direction: row;
     justify-content: space-around;
     width: 116px;
     height:73px;
     margin: 10px 10px;
    img {
        width: 116px;
        height:73px;
        border-radius: 2px;
     }
  }
  .cover-three {
     display: flex;
     flex-direction: row;
     justify-content: space-around;
     img {
       flex-basis: 33%;
       width: 116px;
        height:73px;
        border-radius: 2px;
     }
  }
  .operate {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:8px 12px;
    border-bottom: 0.5px solid #edeff3;
    color:#CFCFCF;
    box-sizing:border-box;
    .left {
       font-size:12px;
       span {
        color: #999999;
      &.set {
       margin-left:10px;
      }
       &.popup {
        color: #e22829;
        font-weight: 600;
      }
     }
    }
    .right {
      border:0.5px solid #edeff3;
      padding:0 5px;
      height:14px;
      line-height: 14px;
      border-radius: 2px;
    }
  }
}
</style>
