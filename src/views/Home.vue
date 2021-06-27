<template>
  <div class="home">
    <div class="home_video">
      <videoPlayer :video-info="videoInfo"></videoPlayer>
    </div>
  </div>
</template>

<script>
import videoPlayer from "../components/video-player/video-player";

export default {
  name: "Home",
  data() {
    return {
      videoInfo: {
        url: null,
        frameRate: 25,
      },
    };
  },
  components: {
    videoPlayer,
  },
  methods: {},
};
</script>

<style scoped lang="less">
.home {
  .home_video {
    margin: 0 auto;
    width: 600px;
  }
}
</style>
