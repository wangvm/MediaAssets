import $api from "@/network/api";

export default {
  // 获取编目列表
  async getEditList({ commit, state }) {
    try {
      let res = await $api.getEditList();
      let editList = []
      res.data.forEach((val, index) => {
        editList.push({ ...val, index: index + 1 })
      })
      edit('seteditList', editList)
    } catch (e) {
      this.$catch = e
    }
  },
}