<template>
  <div id="app">
    <keep-alive>
      <transition name="fade">
        <router-view />
      </transition>
    </keep-alive>
    <SubmitBug />
  </div>
</template>

<script>
import SubmitBug from "@/components/submit-bug";
export default {
  name: "App",
  components: {
    SubmitBug,
  },
  created() {
    console.log(
      "%c\u2615这是一条后台的消息：f12进来瞅啥，快出去",
      "background:black;color:white;border-radius:10px;padding:5px 10px;cursor:default;"
    );
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}

.fade-enter-active,
.fade-leave-avtive {
  transition: opacity 1.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0.1%;
}
</style>
