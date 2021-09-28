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
  async getProjectList({ commit, state }) {
    try {
      let res = await $api.getProjectList();
      let projectList = []
      res.data.forEach((val, index) => {
        projectList.push({ ...val, index: index + 1 })
      })
      commit('setProjectList', projectList)
    } catch (e) {
      this.$catch = e
    }
  },

  // 获取用户列表
  async getUserList({ commit, state }) {
    try {
      let res = await $api.getUserList();
      let userList = []
      res.data.forEach((val, index) => {
        let options = {
          index: index + 1,
          "edit": false,
          "index": index + 1,
          "edit_password": val.password,
          "edit_authority": val.authority,
        }
        userList.push({ ...val, ...options })
      })
      commit('setUserList', userList)
    } catch (e) {
      this.$catch = e
    }
  }
}