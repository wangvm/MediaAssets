import $api from "@/network/api";
import { setUserToken, setLoginType } from "@/config/storage";

export default {
  // 用户登录
  async userLogin({ commit, state }, params) {
    // commit('setToken', '')
    try {
      const { id: id, password } = params
      let resLogin = await $api.login(id, password);
      if (resLogin.code === 200) {
        // let token = resLogin.data.token;
        let loginType = resLogin.data.authority;
        // setUserToken(token);
        setLoginType(loginType);
        commit('updateLoginType', loginType)
        // commit('setToken', token)
      }
    } catch (e) {
      this.$catch = e
    }
  },

  // 获取项目列表
  async getProjectList({ commit, state }, content) {
    try {
      let res;
      // let res = await $api.getProjectList();
      if (content.state === "all" || content.searchValue === '') {
        res = await $api.getProjectList();
      } else if (content.state === "name") {
        res = await $api.getProjectByName(content.searchValue);
      } else if (content.state === "category") {
        res = await $api.getProjectByCategory(content.searchValue);
      } else if (content.state === "status") {
        res = await $api.getProjectByStatus(content.searchValue);
      } else if (content.state === "start") {
        res = await $api.getProjectByStart(content.searchValue);
      } else if (content.state === "end") {
        res = await $api.getProjectByEnd(content.searchValue);
      } else if (content.state === "leader") {
        res = await $api.getProjectByLeader(content.searchValue);
      }
      let projectList = []
      res.data.forEach((val, index) => {
        let options = {
          "edit": false,
          "index": index + 1,
          "edit_projectName": '',
          "edit_leaderId": '',
          "edit_category": '',
          "edit_status": '',
        }
        projectList.push({ ...val, ...options })
      })
      commit('setProjectList', projectList)
    } catch (e) {
      this.$catch = e
    }
  },

  // 获取用户列表
  async getUserList({ commit, state }, content) {
    try {
      let res;
      // let res = await $api.getUserList();
      if (content.state === "all" || content.searchValue === '') {
        res = await $api.getUserList();
      } else if (content.state === "id") {
        res = await $api.getUserById(content.searchValue);
      } else if (content.state === "name") {
        res = await $api.getUserByName(content.searchValue);
      } else if (content.state === "authority") {
        res = await $api.getUserByAuthority(content.searchValue);
      }
      let userList = []
      res.data.forEach((val, index) => {
        let options = {
          "edit": false,
          "index": index + 1,
          "edit_username": '',
          "edit_oldpassword": '',
          "edit_newpassword": '',
          "edit_password": '',
          "edit_authority": '',
        }
        userList.push({ ...val, ...options })
      })
      commit('setUserList', userList)
    } catch (e) {
      this.$catch = e
    }
  },

  // 获取任务列表
  async getTaskList({ commit, state }, content) {
    try {
      let res;
      // let res = await $api.getUserList();
      if (content.state === "all" || content.searchValue === '') {
        res = await $api.getTaskAllList();
      } else if (content.state === "project") {
        res = await $api.getTaskById(content.searchValue);
      } else if (content.state === "name") {
        res = await $api.getTaskByName(content.searchValue);
      } else if (content.state === "status") {
        res = await $api.getTaskByStatus(content.searchValue);
      } else if (content.state === "cataloger") {
        res = await $api.getTaskByCataloger(content.searchValue);
      } else if (content.state === "auditor") {
        res = await $api.getTaskByAuditor(content.searchValue);
      }
      let taskList = []
      res.data.forEach((val, index) => {
        let options = {
          "edit": false,
          "index": index + 1,
          "edit_status": '',
          "edit_cataloger": '',
          "edit_auditor": '',
          "edit_videoId": '',
          "edit_catalogId": '',
        }
        taskList.push({ ...val, ...options })
      })
      commit('setTaskList', taskList)
    } catch (e) {
      this.$catch = e
    }
  },

  // 获取反馈列表
  async getFeedbackList({ commit, state }, content) {
    try {
      let res;
      if (content.state === "all") {
        res = await $api.QueryFeedback("");
      } else if (content.state === "completed") {
        res = await $api.QueryFeedback("completed");
      } else if (content.state === "pending") {
        res = await $api.QueryFeedback("pending");
      }
      let feedbackList = []
      res.data.forEach((val, index) => {
        let options = {
          "index": index + 1,
        }
        feedbackList.push({ ...val, ...options })
      })
      commit('setFeedbackList', feedbackList)
    } catch (e) {
      this.$catch = e
    }
  },

  // 获取编目列表
  getCatalogList({ commit, state }, catalogList) {
    console.log(111);
    try {
      let list = _.cloneDeep(catalogList);
      console.log(list);
      list.id = 1;
      list.edit = false;
      list.state = '节目';
      // list.edit_title = _.cloneDeep(list.title);
      // list.edit_premiereDate = _.cloneDeep(list.premiereDate);
      // list.edit_programType = _.cloneDeep(list.programType);
      // list.edit_contentDescription = _.cloneDeep(list.contentDescription);
      // list.edit_subtitleForm = _.cloneDeep(list.subtitleForm);
      // list.edit_taskName = _.cloneDeep(list.taskName);
      // list.edit_groupMembers = _.cloneDeep(list.groupMembers);
      // list.edit_programForm = _.cloneDeep(list.programForm);
      // list.edit_column = _.cloneDeep(list.column);
      // list.edit_color = _.cloneDeep(list.color);
      // list.edit_standard = _.cloneDeep(list.standard);
      // list.edit_channelFormat = _.cloneDeep(list.channelFormat);
      // list.edit_AspectRatio = _.cloneDeep(list.AspectRatio);
      // list.edit_entryPoint = _.cloneDeep(list.entryPoint);
      // list.edit_duration = _.cloneDeep(list.duration);
      // list.edit_AcquisitionMethod = _.cloneDeep(list.AcquisitionMethod);
      // list.edit_provider = _.cloneDeep(list.provider);
      // list.edit_imageList = _.cloneDeep(list.imageList);
      if (list.children.length !== 0) {
        for (let i in list.children) {
          list.children[i].id = i * 1 + 10;
          list.children[i].edit = false;
          list.children[i].state = '片段';
          // list.children[i].edit_title = _.cloneDeep(list.children[i].title);
          // list.children[i].edit_premiereDate = _.cloneDeep(list.children[i].premiereDate);
          // list.children[i].edit_programType = _.cloneDeep(list.children[i].programType);
          // list.children[i].edit_contentDescription = _.cloneDeep(list.children[i].contentDescription);
          // list.children[i].edit_subtitleForm = _.cloneDeep(list.children[i].subtitleForm);
          // list.children[i].edit_taskName = _.cloneDeep(list.children[i].taskName);
          // list.children[i].edit_groupMembers = _.cloneDeep(list.children[i].groupMembers);
          // list.children[i].edit_programForm = _.cloneDeep(list.children[i].programForm);
          // list.children[i].edit_column = _.cloneDeep(list.children[i].column);
          // list.children[i].edit_color = _.cloneDeep(list.children[i].color);
          // list.children[i].edit_standard = _.cloneDeep(list.children[i].standard);
          // list.children[i].edit_channelFormat = _.cloneDeep(list.children[i].channelFormat);
          // list.children[i].edit_AspectRatio = _.cloneDeep(list.children[i].AspectRatio);
          // list.children[i].edit_entryPoint = _.cloneDeep(list.children[i].entryPoint);
          // list.children[i].edit_duration = _.cloneDeep(list.children[i].duration);
          // list.children[i].edit_AcquisitionMethod = _.cloneDeep(list.children[i].AcquisitionMethod);
          // list.children[i].edit_provider = _.cloneDeep(list.children[i].provider);
          // list.children[i].edit_imageList = _.cloneDeep(list.children[i].imageList);
        }
      }
      console.log(list);
      let newList = [list];
      console.log(newList);
      commit('setCatalogList', newList);
    } catch (e) {
      this.$catch = e
    }
  },

  //获取截图并更新
  updateScreenshotList({ commit, state }, val) {
    let imageList = _.cloneDeep(state.screenshotList);
    imageList.push({
      title: "",
      src: val
    })
    console.log(imageList);
    commit('setscreenshotList', imageList);
  }
}