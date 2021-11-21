export default () => ({
  // 首页部分
  loginType: localStorage.getItem("loginType") * 1 ?? "",
  uid: '',
  currentMenu: '',
  // token: '',
  // 管理部分
  projectList: [],
  userList: [],
  taskList: [],
  feedbackList: [],
  fileList: [],
  projectName: localStorage.getItem("projectName") !== "" ? localStorage.getItem("projectName") : "",
  taskName: localStorage.getItem("taskName") !== "" ? localStorage.getItem("taskName") : "",
  taskStatus: 2,
  titleStatus: false,
  // 视频播放组件
  videoSrc: "http://121.196.100.229/vod/test.mp4",
  screenshotList: [],
  // 编目信息列表
  catalogList: [],
})