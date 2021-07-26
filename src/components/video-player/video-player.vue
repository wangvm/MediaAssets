<template>
  <el-card shadow="hover">
    <div
      class="videoPlayer"
      contenteditable="true"
      @keydown="videoPlayerKeyEvent"
      onselectstart="return false;"
    >
      <div class="video_content">
        <video
          class="player"
          ref="player"
          :src="url"
          width="100%"
          height="100%"
          :preload="preload"
          @canplaythrough="videoEvent('canplaythrough')"
          @playing="videoEvent('playing')"
          @pause="videoEvent('pause')"
          @ended="videoEvent('end')"
          @mouseover="videoEvent('mouseover')"
          @mouseout="videoEvent('mouseout')"
        />
      </div>
      <div class="video_btn">
        <template v-for="(item, index) in playBtnConfig">
          <i
            :key="index"
            class="playerBtn"
            :class="item.icon"
            :title="item.title"
            @click="item.fn(self)"
          />
        </template>
        <div class="time-box">
          <span class="time" title="时:分:秒:帧" ref="time">00:00:00:00</span>
        </div>
        <div class="progress">
          <progress
            ref="progress"
            class="progress_content"
            value="0"
            :max="getPlayerDuration"
            v-if="ifLoad"
            @mousedown="progressMouseDown"
            @mousemove="progressMouseMove"
            @mouseup="progressMouseUp"
            @click="progressClick"
            @mouseenter="progressMouseEnter"
            @mouseleave="progressMouseLeave"
          >
          </progress>
          <span class="login" ref="login" />
          <span class="logout" ref="logout" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import timeFormat from "./utils/timeFormat";
import { playBtnConfig } from "./constants/video.config";
export default {
  name: "videoPlayer",
  data() {
    return {
      self: null,
      playBtnConfig,
      player: null, //视频播放器
      isPlay: false,
      ifLoad: false, //视频是否加载完成
      timer: null, //播放器定时器
      ifPreviewMouseDown: false, //进度条实时变化
    };
  },
  props: {
    url: {
      required: true,
      type: String,
    },
    frameRate: {
      required: true,
      type: Number,
    },
    preload: {
      type: String,
      default: "auto",
    },
  },
  mounted() {
    this.player = this.$refs.player;
    this.self = this;
    this.player.addEventListener("keydown", this.videoPlayerKeyEvent);
  },
  destroyed() {
    //离开页面假如视频再播放，销毁定时器
    clearInterval(this.timer);
    this.timer = null;
    document.removeEventListener("keydown", this.videoPlayerKeyEvent);
  },
  computed: {
    getPlayerDuration() {
      return this.player.duration;
    },
  },
  methods: {
    videoPlayerKeyEvent(event) {
      switch (event.key) {
        case " ":
          !this.isPlay
            ? playBtnConfig.play.fn(this)
            : playBtnConfig.pause.fn(this);
          break;
        case "Enter":
          playBtnConfig.stop.fn(this);
          break;
        case "ArrowLeft":
          playBtnConfig.backward.fn(this);
          break;
        case "ArrowRight":
          playBtnConfig.forward.fn(this);
          break;
      }
    },
    videoEvent(status) {
      switch (status) {
        case "canplaythrough":
          //视频加载完成
          this.ifLoad = true;
          break;
        case "playing":
          //判断播放器正在播放
          if (this.ifLoad) {
            this.timer = setInterval(() => {
              this.$refs.time.innerText = timeFormat(
                this.player.currentTime,
                this.frameRate
              );
              this.$refs.progress.value = this.player.currentTime;
            }, this.frameRate);
          }
          break;
        case "pause":
          //播放器暂停
          clearInterval(this.timer);
          this.timer = null;
          this.$refs.time.innerText = timeFormat(
            this.player.currentTime,
            this.frameRate
          );
          break;
        case "end":
          //视频播放完成
          this.player.currentTime = 0;
          this.$refs.progress.value = this.player.currentTime;
          this.$refs.time.innerText = timeFormat(
            this.player.currentTime,
            this.frameRate
          );
          break;
      }
    },
    logEvent(status) {
      let logIndex = (this.player.currentTime / this.player.duration) * 100;
      switch (status) {
        case "login":
          ifLoginSmall(this.$refs.login, this.$refs.logout, true, logIndex);
          break;
        case "logout":
          ifLoginSmall(this.$refs.login, this.$refs.logout, false, logIndex);
          break;
        case "logRemove":
          this.$refs.login.style.left = 0;
          this.$refs.logout.style.right = 0;
          break;
        case "toLogin":
          let left = isNaN(parseFloat(this.$refs.login.style.left))
            ? 0
            : parseFloat(this.$refs.login.style.left);
          this.player.currentTime = (this.player.duration * left) / 100;
          this.$refs.progress.value = this.player.currentTime;
          this.$refs.time.innerText = timeFormat(
            this.player.currentTime,
            this.frameRate
          );
          this.player.pause();
          break;
        case "toLogout":
          let right = isNaN(parseFloat(this.$refs.logout.style.right))
            ? 0
            : parseFloat(this.$refs.logout.style.right);
          this.player.currentTime =
            this.player.duration - (this.player.duration * right) / 100;
          this.$refs.progress.value = this.player.currentTime;
          this.$refs.time.innerText = timeFormat(
            this.player.currentTime,
            this.frameRate
          );
          this.player.pause();
          break;
      }
      function ifLoginSmall(login, logout, ifLogin, value) {
        let leftLog = isNaN(parseFloat(login.style.left))
          ? 0
          : parseFloat(login.style.left);
        let rightLog = isNaN(parseFloat(logout.style.right))
          ? 0
          : parseFloat(logout.style.right);
        if (ifLogin) {
          if (value <= 100 - rightLog) {
            login.style.left = value + "%";
          } else {
            login.style.left = value + "%";
            logout.style.right = 100 - value + "%";
          }
        } else {
          if (value > leftLog) {
            logout.style.right = 100 - value + "%";
          } else {
            login.style.left = value + "%";
            logout.style.right = 100 - value + "%";
          }
        }
      }
    },
    progressClick(event) {
      this.player.currentTime =
        (this.player.duration * event.offsetX) /
        this.$refs.progress.offsetWidth;
      this.$refs.progress.value = this.player.currentTime;
      this.$refs.time.innerText = timeFormat(
        this.player.currentTime,
        this.frameRate
      );
    },
    progressMouseDown() {
      this.ifPreviewMouseDown = true;
    },
    progressMouseMove(event) {
      if (this.ifPreviewMouseDown) {
        this.player.currentTime =
          (this.player.duration * event.offsetX) /
          this.$refs.progress.offsetWidth;
        this.$refs.progress.value = this.player.currentTime;
        this.$refs.time.innerText = timeFormat(
          this.player.currentTime,
          this.frameRate
        );
      }
    },
    progressMouseUp() {
      this.ifPreviewMouseDown = false;
    },
  },
};
</script>

<style scoped lang="less">
.videoPlayer {
  @icon-color: rgba(0, 0, 0, 1);
  @font-size: 20px;
  @line-height: 20px;
  width: 100%;
  height: 100%;
  min-width: 500px;
  outline: none;
  /*更改1：给整个div标签外套入一个卡片样式，以下的样式先注释*/
  /*box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);*/
  /*padding: 10px;*/
  /*position: relative;*/
  /*outline: none;*/
  /*cursor: default;*/
  /*background-color: white;*/

  .video_btn {
    .playerBtn {
      color: @icon-color;
      font-size: @font-size;
      line-height: @line-height;
      padding: 8px;
      user-select: none;
      cursor: pointer;
    }

    input[type="range"] {
      width: 100px;
      border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 10px;
      border-radius: 10px; /*将轨道设为圆角的*/
      box-shadow: 0 1px 1px #def3f8, inset 0 0.125em 0.125em #0d1112; /*轨道内置阴影效果*/
    }

    input[type="range"]:focus {
      outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
      /*-webkit-appearance: none;*/
      height: 25px;
      width: 25px;
      margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/
      background: #ffffff;
      border-radius: 50%; /*外观设置为圆形*/
      border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
      box-shadow: 0 0.125em 0.125em #3b4547; /*添加底部阴影*/
    }

    .time-box {
      //给原有的span秒数标签嵌套进一个内敛块样式（可调节宽高的内联样式），解决原有后面的元素快会根据秒数宽度改变的小bug
      height: auto;
      width: 8rem;
      display: inline-block;
    }

    .time {
      //background-color: #f56c6c;
      color: @icon-color;
      font-size: @font-size;
      font-weight: lighter;
      line-height: @line-height;
      padding: 5px;
    }

    .progress {
      position: relative;

      progress {
        width: 100%;
        height: 15px;
        background-color: #fff;
      }

      /* 表示总长度背景色 */

      progress::-webkit-progress-bar {
        background-color: #eee;
      }

      /* 表示已完成进度背景色 */

      progress::-webkit-progress-value {
        background: lightsalmon;
      }

      .login,
      .logout {
        height: 16px;
        width: 2px;
        background: black;
      }

      .login {
        position: absolute;
        left: 0;
      }

      .logout {
        position: absolute;
        right: 0;
      }

      .login::after {
        content: "入点";
        width: 30px;
        text-align: center;
        font-size: 1px;
        position: absolute;
        top: -15px;
        left: -14px;
      }

      .logout::after {
        content: "出点";
        width: 30px;
        text-align: center;
        font-size: 1px;
        position: absolute;
        top: 15px;
        left: -14px;
      }
    }
  }
}
</style>
