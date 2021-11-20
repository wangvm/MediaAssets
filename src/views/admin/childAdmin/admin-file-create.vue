<template>
  <div class="project-create">
    <el-input v-model="projectName" placeholder="请输入项目名称"></el-input>
    <el-button @click="createProject">创建项目</el-button>
  </div>
</template>

<script>
import { debounce } from "lodash-es";
import $api from "@/network/api";
export default {
  name: "adminFileCreate",
  data() {
    return {
      projectName: "",
    };
  },
  methods: {
    createProject: debounce(function () {
      if (this.projectName === "") {
        this.$message.error("项目名不能为空");
        return;
      } else {
        let res = $api.createProject(this.projectName);
        this.projectName = "";
      }
      //TODO 项目创建
    }, 300),
  },
};
</script>

<style scoped>
.project-create {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
