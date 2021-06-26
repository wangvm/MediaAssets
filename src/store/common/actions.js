import $api from "@/network/api";
import { setUserToken, setLoginType } from "@/config/storage";

export default {
  // 用户登录
  async userLogin({ commit, state }, params) {
    commit('setToken', '')
    try {
      const { username, password } = params
      let resLogin = await $api.login(username, password);
      if (resLogin.code === 200) {
        let token = resLogin.data.token;
        let loginType = resLogin.data.role;
        setUserToken(token);
        setLoginType(loginType)
        commit('updateLoginType', loginType)
        commit('setToken', token)
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
  }
}