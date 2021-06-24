export default {
  updateLoginType(state, pre) {
    state.loginType = pre
  },
  updateCurrentMenu(state, pre) {
    state.currentMenu = pre
  },
  setToken(state, token) {
    state.token = token
  },
  delToken(state) {
    state.token = ''
  }
}
