<template>
  <div class="edit-task">
    <el-menu default-active="1" class="el-menu-vertical-demo" @select="menuSelect" :collapse="true">
      <el-menu-item index="1">
        <i class="el-icon-menu"></i>
        <span slot="title" class="defaultClass">任务列表</span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-upload"></i>
        <span slot="title" class="defaultClass">任务创建</span>
      </el-menu-item>
    </el-menu>
    <div class="edit-task-content">
      <div v-if="currentMenuIndex==='1'">任务列表</div>
      <div v-else>创建任务</div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "editTask",
        data() {
            return {
                currentMenuIndex: '1',
            }
        },
        methods: {
            menuSelect(key) {
                this.currentMenuIndex = key
            }
        }
    }
</script>

<style scoped lang="less">
  .edit-task {
    display: flex;
    justify-content: center;

    .el-menu-vertical-demo {
      box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    }

    .edit-task-content {
      width: 100%;
      margin: 10px 20px;
      height: 100px;
    }
  }

  .defaultClass {
    user-select: none;
    cursor: default;
  }
</style>