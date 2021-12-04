export default {
  setUid(state, val) {
    state.uid = val
  },
  updateLoginType(state, val) {
    state.loginType = val;
  },
  updateCurrentMenu(state, val) {
    state.currentMenu = val;
  },
  setProjectList(state, val) {
    state.projectList = val;
  },
  setUserList(state, val) {
    state.userList = val;
  },
  setTaskList(state, val) {
    state.taskList = val;
  },
  setTaskStatus(state, val) {
    state.taskStatus = val;
  },
  setFeedbackList(state, val) {
    state.feedbackList = val;
  },
  setFileList(state, val) {
    state.fileList = val;
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
    console.log(state.catalogList);
  },

  // 设置入点时间
  setLoginTime(state, val) {
    state.loginTime = val;
    console.log(state.loginTime);
  },
  // 设置时长
  setLogTime(state, val) {
    state.logTime = val;
    console.log(state.logTime);
  }
}
