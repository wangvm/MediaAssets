<template>
  <div>
    项目列表
    <el-button @click="enterProject">进入项目</el-button>
  </div>
</template>

<script>
    export default {
        name: "adminProjectList",
        methods: {
            enterProject() {
                // task = 任务 check = 审核 video = 编目
                this.$router.push({name: 'task', params: {projectName: 'aa'}})
            }
        }
    }
</script>

<style scoped>

</style>