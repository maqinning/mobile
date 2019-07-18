<template>
  <div class='recomment'>
    <div class='title'>猜你喜欢</div>
    <div class='content'>
       <div v-for='(item,index) in recomments' :key="index">{{item.title}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['recomments']
}
</script>

<style lang="less" scoped>
 .recomment {
   .title {
     text-align: left;
     font-size:16px;
     font-weight: 900;
     padding:10px 0;
     margin:10px 0;
     margin-bottom: 50px;
   }
   .content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      flex-basis: 45%;
      justify-content: space-around;
   }
 }
</style>
