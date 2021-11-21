<template>
  <div class="file-create">
    <el-upload
      class="upload-demo"
      drag
      action="http://121.196.100.229:8080/mam/file/videoUpload"
      multiple
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-remove="beforeRemove"
      :on-progress="handleProgress"
      :limit="5"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传mp4文件，且不超过500M</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "adminFileCreate",
  data() {
    return {
      projectName: "",
    };
  },
  methods: {
    // 上传成功时的钩子
    handleSuccess(response, file) {
      if (file.response.code === 200) {
        this.$message({
          message: file.response.message,
          type: "success",
        });
      }
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

<style scoped>
.file-create {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
