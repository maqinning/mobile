<template>
  <div class="edit-pannel">
    <div class='my-channel'>
      <div class="my-title">
         <span>我的频道</span>
         <span @click="editChannel" class='my-title-edit'>{{editMessage}}</span>
      </div>
      <div class="my-channel-list">
        <template v-for="item in channels" >
         <van-tag class='channel-list-item' size="large"  :key="item.id" v-if="item.id !== 0">
            <van-icon @click="delUserChannel(item)" class="delete" v-if="edit" name="clear" size="14px" color="#CDCDCD" />
           {{item.name}}
           </van-tag>
           </template>
      </div>
    </div>
    <div class='out-channel'>
      <div class="my-title">
        <span>频道推荐</span>
      </div>
       <div class="my-channel-list">
         <van-tag @click="addUserChannel(item)" class='channel-list-item' size="large" v-for="item in outChannels" :key="item.id">
           <van-icon  name="plus" size="10px" color="#FFFFFF" />
           {{item.name}}
           </van-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      edit: false
    }
  },
  computed: {
    editMessage () {
      return this.edit ? '完成' : '编辑'
    },
    ...mapGetters(['outChannels']), // 剩余的频道
    ...mapState({
      'channels': state => state.index.channels
    }) // 用户的频道
  },
  methods: {
    ...mapActions(['delUserChannel', 'addUserChannel']),
    editChannel () {
      this.edit = !this.edit
    }
  }

}
</script>

<style lang="less" scoped>
.edit-pannel {
background-color: #FFFFFF;
overflow: hidden;
.my-title {
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   padding: 5px 10px;
   align-items: center;
   .my-title-edit {
     color:#F85A5A;
     font-size:12px;
     border-radius: 20px;
     border:1px solid #F85A5A;
     padding:2px 8px;
     cursor:pointer;
   }
 }
 .channel-list-item {
     margin-left:12px;
     padding: 5px 10px;
     margin-top:10px;
     position: relative;
     cursor: pointer;
     .delete {
       position: absolute;
       right:-8px;
       top:-8px;
     }
  }
 .my-channel-list {
   display: flex;
   flex-direction: row;
   flex-wrap: wrap;
   margin-top: 10px;
 }
 .out-channel {
   margin-top:40px;
 }
}
</style>
