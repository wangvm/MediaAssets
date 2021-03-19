<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>

    export default {
        name: 'App',
        created() {
            console.log('%c这是一条后台的消息：f12进来瞅啥，快出去',
                "background:black;color:white;border-radius:10px;padding:5px 10px;cursor:default;")
        }
    }
</script>

<style lang="less">
  * {
    margin: 0;
    padding: 0;
  }

  a {
    text-decoration: none;
  }
</style>
