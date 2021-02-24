<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

    export default {
        name: 'App',
        created() {
            console.log('%c媒资管理系统对你说：f12进来瞅啥，快出去', "background:black;color:white;border-radius:10px;padding:5px 10px;")
        }
    }
</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }
</style>
