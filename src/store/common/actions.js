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
      console.log(projectList);
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
      console.log(taskList);
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
      console.log(feedbackList);
      commit('setFeedbackList', feedbackList)
    } catch (e) {
      this.$catch = e
    }
  }
}