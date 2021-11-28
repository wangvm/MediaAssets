<template>
  <div class="edit-task-create" @click="noEnterClick()">
    <el-card class="create-table" @click.native.stop="stopClick()">
      <div class="table-close">
        <h2>添加任务</h2>
        <img
          src="@/assets/images/close.png"
          alt="图片加载失败"
          @click="noEnterClick()"
        />
      </div>
      <div class="table-content">
        <template v-for="(item, index) in createList">
          <el-divider :key="index" content-position="center">
            <p class="item-title">任务{{ index + 1 }}</p>
          </el-divider>
          <div :key="index" class="create-item">
            <el-input
              class="item-input"
              v-model="item.taskName"
              clearable
              placeholder="请输入任务名"
              prefix-icon="el-icon-s-order"
            />
            <el-select
              v-model="item.videoId"
              :multiple="false"
              :filterable="true"
              :remote="true"
              placeholder="请输入视频名称"
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
        </template>
        <div class="add-item">
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click="addItem"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-minus"
            circle
            @click="reduceItem"
          ></el-button>
        </div>
      </div>
      <div class="table-operation">
        <el-button type="primary" @click="createTask" size="small" plain
          >确认</el-button
        >
        <el-button size="small" @click="noEnterClick" plain>取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import $api from "@/network/api";
import { mapState } from "vuex";
import { debounce } from "lodash-es";

export default {
  name: "EditWindow",
  data() {
    return {
      createList: [],
      catalogList: [],
      // 选择videoid所需参数
      options: [],
      list: [],
      loading: false,
    };
  },
  created() {
    this.initTaskList();
  },
  watch: {
    catalogList: "updateCatalog",
  },
  computed: {
    ...mapState("common", ["projectName"]),
  },
  methods: {
    initTaskList() {
      this.createList = [
        {
          taskName: "",
          videoId: "",
          project: this.projectName,
          id: "",
          list: [],
        },
      ];
    },
    // 增加创建用户 +号按钮
    addItem() {
      let sum = 0;
      for (let i = 0; i < this.createList.length; i++) {
        if (this.createList[i].videoId === "") {
          sum++;
        }
      }
      if (sum === 0) {
        this.createList.push({
          taskName: "",
          videoId: "",
          project: this.projectName,
          id: "",
          list: [],
        });
      } else {
        this.$message("请依次上传视频");
      }
    },
    // 删除创建的任务 - 号按钮
    reduceItem() {
      if (this.createList.length > 1) {
        this.createList.pop();
      } else {
        this.$message("不能再删了");
      }
    },

    // 创建任务
    createTask: debounce(async function () {
      if (
        this.createList.length === 1 &&
        (this.createList[0].taskName === "" ||
          this.createList[0].videoId === "")
      ) {
        this.$message.error("注册信息为空");
        return;
      }
      try {
        let res = await $api.addTask(this.createList);
        this.updateCatalog();
        this.$emit("success");
      } catch (err) {
        this.$message.error(err);
      }
    }, 300),
    async updateCatalog() {
      for (let i = 0; i < this.createList.length; i++) {
        let res = await $api.getCatalog(
          "taskName",
          this.createList[i].taskName
        );
        this.catalogList[i] = res.data;
      }
      for (let i in this.catalogList) {
        this.catalogList[i].title = { value: "默认数据", exame: true };
        this.catalogList[i].premiereDate = { value: "", exame: true };
        this.catalogList[i].programType = { value: "", exame: true };
        this.catalogList[i].contentDescription = {
          value: "",
          exame: true,
        };
        this.catalogList[i].subtitleForm = { value: "", exame: true };
        this.catalogList[i].groupMembers = { value: "", exame: true };
        this.catalogList[i].programForm = { value: "", exame: true };
        this.catalogList[i].column = { value: "", exame: true };
        this.catalogList[i].color = { value: "", exame: true };
        this.catalogList[i].standard = { value: "", exame: true };
        this.catalogList[i].channelFormat = { value: "", exame: true };
        this.catalogList[i].AspectRatio = { value: "", exame: true };
        this.catalogList[i].entryPoint = { value: "", exame: true };
        this.catalogList[i].duration = { value: "", exame: true };
        this.catalogList[i].AcquisitionMethod = { value: "", exame: true };
        this.catalogList[i].provider = { value: "", exame: true };
        this.catalogList[i].taskType = { value: "", exame: true };
        this.catalogList[i].imageList = { value: [], exame: true };
        this.catalogList[i].children = [];
        this.catalogList[i].exame = false;
        let res = await $api.updateCatalog(this.catalogList[i]);
        res = await $api.getCatalog(
          "taskName",
          this.catalogList[i].taskName
        );
      }
    },
    // 判断任务名是否重复
    repeatItem(list) {
      let idList = [];
      let repeatIndex = [-1, -1];
      Object.keys(list).forEach((val) => {
        if (list[val].taskName === "") return;
        let index = idList.findIndex((name) => name === list[val].taskName);
        index === -1
          ? idList.push(list[val].taskName)
          : (repeatIndex = [index, parseInt(val)]);
      });
      return repeatIndex;
    },
    // 过滤任务名为空的信息
    filterItem(list) {
      return list.filter((val) => val.taskName !== "" || val.videoId !== "");
    },
    //   阻止点击冒泡事件
    stopClick() {},
    noEnterClick() {
      this.initTaskList();
      this.$emit("operation", false);
    },
    async remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        let res = await $api.getFileListByName(query);
        this.loading = false;
        this.list = res.data.map((item) => {
          return {
            value: item.fileName,
            label: item.fileName,
          };
        });
        this.options = this.list.filter((item) => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
        });
      } else {
        this.options = [];
      }
    },
  },
};
</script>
<style scoped lang="less">
.edit-task-create {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(95, 93, 93, 0.7);
  .create-table {
    width: 70%;
    height: 70%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .table-close {
      width: 100%;
      height: 5vh;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        height: 60%;
        width: auto;
        cursor: pointer;
      }
    }
    .table-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      overflow-y: scroll;
      width: 100%;
      height: 54vh;
      .create-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .item-input {
          margin-bottom: 1em;
        }
        .upload-demo {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
      .add-item {
        margin-top: 0.5em;
      }
    }
    .table-operation {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      height: 6vh;
    }
  }
}
</style>