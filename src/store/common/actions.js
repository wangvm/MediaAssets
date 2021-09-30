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
  }
}