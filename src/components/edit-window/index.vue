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
              :action="item.taskName"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-progress="test"
              :on-success="handleSuccess"
              :before-remove="beforeRemove"
              :http-request="uploadFile"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
              name="file"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传mp4文件，且不超过500kb
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
      uploadList: [],
    };
  },
  created() {
    this.initTaskList();
  },
  methods: {
    initTaskList() {
      this.createList = [{ taskName: "" }];
    },
    // 增加创建用户 +号按钮
    addItem() {
      this.createList.push({
        taskName: "",
      });
    },
    // 删除创建的任务 - 号按钮
    reduceItem() {
      if (this.createList.length > 1) {
        this.createList.pop();
        this.uploadList.pop();
      } else {
        this.$message("不能再删了");
      }
    },

    // 创建任务
    createTask: debounce(async function () {
      if (this.createList.length === 1 && this.createList[0].taskName === "") {
        this.$message.error("注册信息为空");
        return;
      }
      let repeatIndex = this.repeatItem(this.createList);
      console.log(repeatIndex);
      if (repeatIndex[0] !== repeatIndex[1])
        return this.$message.error(
          `任务${repeatIndex[0] + 1}与任务${repeatIndex[1] + 1}名子重复`
        );
      let taskList = this.filterItem(this.createList).map((val) => {
        console.log(val);
        return {
          taskName: val.taskName,
        };
      });
      await this.flieUpload(taskList, this.uploadList);
    }, 300),
    // 判断任务名是否重复
    repeatItem(list) {
      let idList = [];
      let repeatIndex = [-1, -1];
      Object.keys(list).forEach((val) => {
        if (list[val].taskName === "") return;
        let index = idList.findIndex((name) => name === list[val].taskName);
        console.log(index);
        index === -1
          ? idList.push(list[val].taskName)
          : (repeatIndex = [index, parseInt(val)]);
      });
      return repeatIndex;
    },
    // 过滤任务名为空的信息
    filterItem(list) {
      return list.filter((val) => val.taskName !== "");
    },
    flieUpload: _.debounce(function (taskList, uploadList) {
      console.log(uploadList);
      let allList = [];
      let index = 0;
      while (index < taskList.length) {
        for (let i in uploadList) {
          if ((uploadList[i].taskName = taskList[index])) {
            allList.push({
              taskName: uploadList[i].taskName.taskName,
              file: uploadList[i].file,
            });
            index++;
          }
        }
      }
      let sum = 0;
      for (let j in allList) {
        let uploadRes = $api.fileUpload(allList[j].file, allList[j].taskName);
        if (uploadRes.data.code === 200) sum++;
      }
      if (sum === allList.length) {
        try {
          let res = $api.addTask(taskList);
          if (res.code === 200) {
            this.$emit("operation", false);
          }
        } catch (e) {
          this.$catch(e);
          this.$emit("operation", false);
        }
      }
    }, 500),
    //   阻止点击冒泡事件
    stopClick() {},
    noEnterClick() {
      this.initTaskList();
      this.$emit("operation", false);
    },
    // 添加任务上传视频相关操作
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadFile(params) {
      console.log(params);
      this.uploadList.push({ taskName: params.action, file: params.file });
    },
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
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