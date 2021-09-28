<template>
  <el-card class="create-user">
    <div slot="header" class="clearfix">
      <span
        >创建用户
        <span class="user-create-tip"> 注：账号为空不会创建用户 </span>
      </span>
      <el-button
        style="float: right; padding: 3px 5px"
        type="primary"
        @click="createUser"
        >创建用户</el-button
      >
      <el-button
        style="float: right; padding: 3px 10px"
        type="text"
        @click="dialogVisible = true"
        >导入csv表格</el-button
      >
    </div>
    <template v-for="(item, index) in createList">
      <el-divider :key="index" content-position="center">
        <p class="item-title">用户{{ index + 1 }}</p>
      </el-divider>
      <div :key="index" class="create-item">
        <el-input
          class="item-input"
          v-model="item.id"
          clearable
          placeholder="请输入账号"
          prefix-icon="el-icon-paperclip"
        />
        <el-input
          class="item-input"
          v-model="item.username"
          clearable
          placeholder="请输入用户名"
          prefix-icon="el-icon-user"
        />
        <el-input
          class="item-input"
          type="password"
          v-model="item.password"
          clearable
          show-password
          placeholder="请输入密码"
          prefix-icon="el-icon-warning-outline"
        />
        <el-select
          v-model="item.authority"
          placeholder="请选择权限"
          filterable
          class="item-select"
          clearable
        >
          <el-option
            v-for="selectItem in userType"
            :key="selectItem.key"
            :label="selectItem.label"
            :value="selectItem.key"
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
    </div>
    <el-dialog title="导入csv表格" :visible.sync="dialogVisible" width="50%">
      <el-upload
        v-loading="ifUploadLoading"
        class="upload-demo"
        action="null"
        multiple
        :limit="1"
        :on-change="upload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><em>点击选择文件上传</em></div>
        <div class="el-upload__tip" slot="tip">
          <div>
            <p>只能上传csv文件，且第一列为账号，第二列为密码</p>
            <p>
              注：尽量避免通过修改后缀的形式生成csv文件，推荐打开excel保存为csv格式
            </p>
          </div>
        </div>
        <img v-lazy="require('@/assets/images/csvRules.jpg')" alt="" />
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import $api from "@/network/api";
import { debounce } from "lodash-es";
import { userType } from "@/constants/common";

export default {
  name: "admin-user-create",
  data() {
    return {
      createList: [],
      userType,
      dialogVisible: false,
      ifUploadLoading: false,
    };
  },
  created() {
    this.initUserList();
  },
  methods: {
    // 初始化创建列表
    initUserList() {
      this.createList = [{ id: "", username: "", password: "", authority: 4 }];
    },
    // 增加创建用户 +号按钮
    addItem() {
      this.createList.push({
        id: "",
        username: "",
        password: "",
        authority: 4,
      });
    },
    // 创建用户按钮
    createUser: debounce(async function () {
      if (
        this.createList.length === 1 &&
        (this.createList[0].id === "" && this.createList[0].username)
      ) {
        this.$message.error("注册信息为空");
        return;
      }
      let repeatIndex = this.repeatItem(this.createList);
      if (repeatIndex[0] !== repeatIndex[1])
        return this.$message.error(
          `用户${repeatIndex[0] + 1}与用户${repeatIndex[1] + 1}账号重复`
        );
      let emptyPasswordIndex = this.emptyPassword(this.createList);
      if (emptyPasswordIndex !== -1)
        return this.$message.error(`用户${emptyPasswordIndex * 1 + 1}密码为空`);
      let userList = this.filterItem(this.createList).map((val) => {
        return {
          id: val.id,
          username: val.username,
          password: val.password,
          authority: val.authority,
        };
      });
      try {
        let res = await $api.register(userList);
        if (res.code === 200) this.initUserList();
      } catch (e) {
        this.$catch(e);
      }
    }, 300),
    // 判断用户名是否重复
    repeatItem(list) {
      let idList = [];
      let repeatIndex = [-1, -1];
      Object.keys(list).forEach((val) => {
        if (list[val].id === "") return;
        let index = idList.findIndex((name) => name === list[val].id);
        index === -1
          ? idList.push(list[val].id)
          : (repeatIndex = [index, parseInt(val)]);
      });
      return repeatIndex;
    },
    // 过滤用户名为空的信息
    filterItem(list) {
      return list.filter((val) => val.id !== "" && val.username !== "");
    },
    // 判断密码是否为空
    emptyPassword(list) {
      let emptyList = [];
      Object.keys(list).forEach((val) => {
        list[val].id !== "" &&
          list[val].password === "" &&
          emptyList.push(parseInt(val));
      });
      return emptyList.length === 0 ? -1 : emptyList[0];
    },
    upload(file) {
      // TODO
      console.log(file);
      this.ifUploadLoading = false;
    },
  },
};
</script>

<style scoped lang="less">
.create-user {
  user-select: none;

  .item-title {
    font-size: 10px;
    font-weight: lighter;
  }

  .create-item {
    display: flex;

    .item-input {
      margin: 0 10px;
    }

    .item-select {
      width: 600px;
    }
  }

  .add-item {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upload-demo {
    text-align: center;
  }
}

.user-create-tip {
  color: red;
  font-weight: bold;
  margin-left: 20px;
}
</style>
