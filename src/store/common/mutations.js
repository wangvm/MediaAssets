export default {
  updateLoginType(state, val) {
    state.loginType = val
  },
  updateCurrentMenu(state, val) {
    state.currentMenu = val
  },
  // setToken(state, val) {
  //   state.token = val
  // },
  setProjectList(state, val) {
    state.projectList = val
  },
  setUserList(state, val) {
    state.userList = val
  },
  setTaskList(state, val) {
    state.taskList = val
  },
  setFeedbackList(state, val) {
    state.feedbackList = val
  },
  // 保存编目名以及任务名
  setProjectName(state, val) {
    state.projectName = val;
  },
  setTaskName(state, val) {
    state.taskName = val;
  },
  setTitleStats(state, val) {
    state.titleStatus = val;
  },
  // 与视频播放相关
  setVideoSrc(state, val) {
    state.videoSrc = val;
    console.log(state.videoSrc);
  },
  setscreenshotList(state, val) {
    state.screenshotList = val;
  }
}
