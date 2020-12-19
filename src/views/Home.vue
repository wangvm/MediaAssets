<template>
    <div class="home">
      <videoPlayer></videoPlayer>
    </div>
</template>

<script>
    import videoPlayer from "../components/videoPlayer/videoPlayer"

    export default {
        name: 'Home',
        components: {
            videoPlayer
        }
    }
</script>
