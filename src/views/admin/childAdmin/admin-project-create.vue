<template>
  <div class="project-create">
    <div class="project-input">
      <span>项目名称:</span>
      <el-input
        class="input-style"
        v-model="projectName"
        placeholder="请输入项目名称"
      ></el-input>
    </div>
    <div class="project-input">
      <span>组长账号:</span>
      <el-select
        class="project-select"
        v-model="leaderId"
        :multiple="false"
        :filterable="true"
        :remote="true"
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>

    <el-button @click="createProject">创建项目</el-button>
  </div>
</template>

<script>
import { debounce } from "lodash-es";
import $api from "@/network/api";
export default {
  name: "adminProjectCreate",
  data() {
    return {
      projectName: "",
      leaderId: "",
      options: [],
      list: [],
      loading: false,
    };
  },
  methods: {
    async remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let res = await $api.getUserById(query);
        this.loading = false;
        this.list = res.data.map((item) => {
          return {
            value: `${item.id}`,
            label: `${item.id}`,
          };
        });
        this.options = this.list.filter((item) => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.options = [];
      }
    },
    createProject: debounce(function () {
      if (this.projectName === "") {
        this.$message.error("项目名不能为空");
        return;
      } else if (this.leaderId === "") {
        this.$message.error("组长账号不能为空");
        return;
      } else {
        let res = $api.createProject(this.projectName, this.leaderId);
        console.log(res);
        this.projectName = "";
        this.leaderId = "";
      }
      //TODO 项目创建
    }, 300),
  },
};
</script>

<style scoped lang="less">
.project-create {
  width: 100%;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .project-input {
    width: 50%;
    height: 50%;
    display: flex;
    align-items: center;
    span {
      width: 20%;
      font-size: 1rem;
      font-weight: bold;
    }
    .input-style /deep/ .el-input__inner {
      margin-left: 4%;
      width: 96%;
    }
    .project-select /deep/ .el-input__inner {
      width: 170%;
    }
  }
}
</style>
