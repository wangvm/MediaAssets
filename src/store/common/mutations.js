export default {
  updateLoginType(state, val) {
    state.loginType = val
  },
  updateCurrentMenu(state, val) {
    state.currentMenu = val
  },
  setProjectList(state, val) {
    state.projectList = val
  },
  setUserList(state, val) {
    state.userList = val
  },
  setTaskList(state, val) {
    state.taskList = val
  },
  setTaskStatus(state, val) {
    state.taskStatus = val;
  },
  setFeedbackList(state, val) {
    state.feedbackList = val
  },
  // 保存编目名以及任务名
  setProjectName(state, val) {
    state.projectName = val;
    localStorage.setItem("projectName", state.projectName);
  },
  setTaskName(state, val) {
    state.taskName = val;
    localStorage.setItem("taskName", state.taskName);
  },
  setTitleStats(state, val) {
    state.titleStatus = val;
  },
  // 与视频播放相关
  setVideoSrc(state, val) {
    state.videoSrc = val;
  },
  setscreenshotList(state, val) {
    state.screenshotList = val;
  },
  // 编目信息
  setCatalogList(state, val) {
    state.catalogList = val;
  }
}
