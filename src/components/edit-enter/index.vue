<template>
  <div class="edit-enter" @click="noEnterClick()">
    <el-card class="enter-table" @click.native.stop="stopClick()">
      <div class="table-close">
        <h2>提示</h2>
        <img
          src="@/assets/images/close.png"
          alt="图片加载失败"
          @click="noEnterClick()"
        />
      </div>
      <div class="table-content">
        <span>请选择进入任务-{{ taskName }}-的方式：</span>
      </div>
      <div class="table-operation">
        <el-button type="primary" @click.native="editClick()" size="medium"
          >编写</el-button
        >
        <el-button type="warning" size="medium" @click.native="examClick()"
          >审核</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "EditEnter",
  props: {
    taskName: String,
  },
  created() {
    console.log(this.taskName);
  },
  methods: {
    ...mapMutations("common", ["setTaskName", "setTitleStats"]),
    //   编写界面
    editClick() {
      this.$router.push({
        path: "/edit/check",
        //跳转路由时传递编目名称和edit状态true(审核)
        query: {
          edit: false,
          //   state: "edit",
          editName: this.taskName,
        },
      });
      this.setTaskName(this.taskName);
      this.setTitleStats(true);
    },
    // 审核界面
    examClick() {
      this.$router.push({
        path: "/edit/check",
        //跳转路由时传递编目名称和edit状态true(审核)
        query: {
          edit: true,
          //   state: "edit",
          editName: this.taskName,
        },
      });
      this.setTaskName(this.taskName);
      this.setTitleStats(true);
    },
    //   阻止点击冒泡事件
    stopClick() {},
    noEnterClick() {
      this.$emit("enterIn", false);
    },
  },
};
</script>
<style scoped lang="less">
.edit-enter {
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
  .enter-table {
    width: 30%;
    height: 30%;
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
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 10vh;
      font-size: 1.5em;
      font-weight: bold;
    }
    .table-operation {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      height: 10vh;
    }
  }
}
</style>