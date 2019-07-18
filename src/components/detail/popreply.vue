<template>
  <van-popup
  class='popup-reply'
  v-model='show'
  :lock-scroll="true"
  :close-on-click-overlay="false"
  overlay position='bottom'>
   <div class="header">
    <van-icon @click="hidePopReplies" name="cross" size="30px"></van-icon>
    <span class='title'>{{`${commentsLength}条回复`}}</span>
    <span></span>
   </div>
   <div class='content'>
     <slot name='content'></slot>
   </div>
   <slot name='write'></slot>
  </van-popup>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  props: ['commentsLength'],
  computed: {
    show: {
      get () {
        return this.$store.state.article.showPopReply
      },
      set (value) {
        value ? this.$store.commit('showPopReplies') : this.hidePopReplies()
      }
    }
  },
  methods: {
    ...mapMutations(['hidePopReplies'])
  }
}
</script>
<style lang="less" scoped>
.popup-reply {
  width:100%;
  height:70%;
  padding:0 10px;
  .header {
    height:40px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding:0 10px;
    .title {
     font-size:20px;
     margin-left:-30px;
    }
  }
  .content {
    padding:0 10px;
  }
}
</style>
