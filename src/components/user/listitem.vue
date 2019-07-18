<template>
    <van-cell class='listitem' :title="title" :to="path" size="large" is-link />
</template>
<script>
export default {
  props: ['title', 'path']
}
</script>

<style lang="less" scoped>
.listitem{
  text-align: left;
}
</style>
