<template>
  <div class="title">{{title}}</div>
</template>
<script>
    export default {
      props: {
        title: {
          type: String
        }
      }
    }
</script>
<style scoped>
  .title{
    font-size: 16px;
    height: 45px;
    line-height: 45px;
    border-bottom: 1px solid #909399;
    color: #333;
    font-weight: bolder
  }
</style>