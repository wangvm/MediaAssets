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
            <el-upload
              class="upload-demo"
              action="http://121.196.100.229:8080/mam/file/videoUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :on-error="handleError"
              :before-remove="beforeRemove"
              :on-progress="handleProgress"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传mp4文件，且不超过500M
              </div>
            </el-upload>
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
        <el-button type="primary" @click="createTask()" size="small" plain
          >确认</el-button
        >
        <el-button size="small" @click="noEnterClick()" plain>取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import $api from "@/network/api";
import { debounce } from "lodash-es";
export default {
  name: "EditWindow",
  data() {
    return {
      createList: [],
      catalogList: [],
    };
  },
  created() {
    this.initTaskList();
  },
  watch: {
    catalogList: "updateCatalog",
  },
  methods: {
    initTaskList() {
      this.createList = [{ taskName: "", videoId: "", id: "", list: [] }];
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
    createTask: _.debounce(async function () {
      if (
        this.createList.length === 1 &&
        (this.createList[0].taskName === "" ||
          this.createList[0].videoId === "")
      ) {
        this.$message.error("注册信息为空");
        return;
      }
      let repeatIndex = this.repeatItem(this.createList);
      if (repeatIndex[0] !== repeatIndex[1])
        return this.$message.error(
          `任务${repeatIndex[0] + 1}与任务${repeatIndex[1] + 1}名子重复`
        );
      let taskList = this.filterItem(this.createList).map((val) => {
        return {
          taskName: val.taskName,
          videoId: val.videoId,
        };
      });
      let catalogList = this.filterItem(this.createList).map((val) => {
        return {
          list: val.list,
        };
      });
      // this.catalogList = catalogList;
      try {
        let res = await $api.addTask(taskList);
        console.log(res);
        if (res.code === 200) {
          this.catalogList = catalogList;
          this.$emit("operation", false);
        }
      } catch (e) {
        this.$catch(e);
        this.$emit("operation", false);
      }
    }, 300),
    updateCatalog: _.debounce(async function () {
      for (let i in this.catalogList) {
        this.catalogList[i].list.title = { value: "默认数据", exame: true };
        this.catalogList[i].list.premiereDate = { value: "", exame: true };
        this.catalogList[i].list.programType = { value: "", exame: true };
        this.catalogList[i].list.contentDescription = { value: "", exame: true };
        this.catalogList[i].list.subtitleForm = { value: "", exame: true };
        this.catalogList[i].list.groupMembers = { value: "", exame: true };
        this.catalogList[i].list.programForm = { value: "", exame: true };
        this.catalogList[i].list.column = { value: "", exame: true };
        this.catalogList[i].list.color = { value: "", exame: true };
        this.catalogList[i].list.standard = { value: "", exame: true };
        this.catalogList[i].list.channelFormat = { value: "", exame: true };
        this.catalogList[i].list.AspectRatio = { value: "", exame: true };
        this.catalogList[i].list.entryPoint = { value: "", exame: true };
        this.catalogList[i].list.duration = { value: "", exame: true };
        this.catalogList[i].list.AcquisitionMethod = { value: "", exame: true };
        this.catalogList[i].list.provider = { value: "", exame: true };
        this.catalogList[i].list.imageList = { value: [], exame: true };
        this.catalogList[i].list.children = [];
        this.catalogList[i].list.exame = false;
        console.log(this.catalogList[i].list);
        let res = await $api.setCatalog(this.catalogList[i].list);
        console.log(res);
      }
    }, 500),
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
    // 上传中的钩子
    // handleProgress(event, file, fileList) {
    //   console.log(event, file, fileList);
    // },
    // 上传成功时的钩子
    handleSuccess(response, file) {
      let index = 0;
      let i = 0;
      while (index !== 1) {
        if (this.createList[i].videoId === "") {
          this.createList[i].videoId = response.data.position;
          this.createList[i].id = file.uid;
          this.createList[i].list = response.data;
          this.createList[i].list["taskName"] = this.createList[i].taskName;
          index = 1;
        }
        i++;
      }
      console.log(this.createList);
    },
    // 上传失败时的钩子
    handleError(err, file, fileList) {
      this.handleRemove(file, fileList);
      this.$message("上传失败，请重新上传");
    },
    // 文件列表移除文件时的钩子
    handleRemove(file) {
      for (let i in this.createList) {
        if (this.createList[i].id === file.uid) {
          this.createList[i].videoId = "";
          this.createList[i].id = "";
        }
      }
    },
    // 点击文件列表中已上传的文件时的钩子
    // handlePreview(file) {
    //   console.log(file);
    // },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
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
      justify-content: space-around;
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