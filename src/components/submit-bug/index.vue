<template>
  <div class="submit-bug" v-if="!isHome">
    <el-tooltip class="item" effect="dark" content="提交bug" placement="left">
      <i class="bug-icon el-icon-question" @click="showDialog" />
    </el-tooltip>

    <el-dialog title="bug反馈" append-to-body :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item>
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
            v-model="form.message"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitBug">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SubmitBug",
  data() {
    return {
      dialogFormVisible: false,
      form: {
        message: "",
      },
    };
  },
  computed: {
    isHome() {
      return this.$route.path === "/";
    },
  },
  methods: {
    showDialog() {
      this.dialogFormVisible = true;
    },
    submitBug() {
      console.log(this.form.message);
      this.dialogFormVisible = false;
      this.$message.success("感谢提交反馈");
    },
  },
};
</script>

<style scoped lang="less">
.submit-bug {
  position: fixed;
  z-index: 10;
  bottom: 20px;
  right: 20px;

  .bug-icon {
    font-size: 40px;
    color: rgb(102, 177, 255);
    opacity: 0.5;
    cursor: pointer;
  }

  .bug-icon:hover {
    animation: changeOpacity 0.5s ease forwards;
  }
}

@keyframes changeOpacity {
  form {
    opacity: 0.5;
  }
  to {
    opacity: 1;
  }
}
</style>
