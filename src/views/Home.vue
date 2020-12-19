<template>
    <div class="home">
      <div class="home_video">
          <videoPlayer :video-url="videoUrl"></videoPlayer>
      </div>
    </div>
</template>

<script>
    import videoPlayer from "../components/videoPlayer/videoPlayer"

    export default {
        name: 'Home',
        data(){
            return {
                videoUrl:"http://47.98.131.223/video/test.mp4"
            }
        },
        components: {
            videoPlayer
        }
    }
</script>

<style scoped lang="less">
    .home{
        .home_video{
            width: 500px;
        }
    }
</style>
