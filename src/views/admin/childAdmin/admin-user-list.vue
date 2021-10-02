<template>
  <AdminList
    :init-project-list="initUserList"
    :list="userList"
    @change-show-list="changeShowList"
    title="用户列表"
    placeholder="请输入用户名称"
  >
    <div class="content_table">
      <el-table :data="showList" tooltip-effect="dark" v-loading="loading">
        <el-table-column prop="index" label="序号" />
        <el-table-column prop="username" label="姓名">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">
              {{ scope.row.username }}
            </span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_username"
                placeholder="请输入用户名"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="密码">
          <template slot-scope="scope">
            <span v-if="!scope.row.edit">
              {{ "********" }}
            </span>
            <span v-else>
              <el-input
                v-model="scope.row.edit_oldpassword"
                placeholder="请输入原密码"
                clearable
              />
              <el-input
                v-model="scope.row.edit_newpassword"
                placeholder="请输入新密码"
                clearable
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template slot-scope="scope">
            {{ dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column prop="authority" label="权限">
          <template slot-scope="scope">
            <span
              v-if="!scope.row.edit"
              class="user-role"
              :class="['user-role-' + scope.row.authority]"
            >
              {{ userType[scope.row.authority].label }}
            </span>
            <span v-else>
              <el-select v-model="scope.row.authority">
                <el-option
                  v-for="item in userType"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              v-show="!scope.row.edit"
              @click="EditUser(scope.row)"
              >编辑
            </el-button>
            <el-button
              size="small"
              type="text"
              v-show="!scope.row.edit"
              @click.native.prevent="deleteUser(scope.row)"
              >删除
            </el-button>
            <el-button
              size="small"
              type="text"
              v-show="scope.row.edit"
              @click="deterMine(scope.$index, scope.row)"
              >确定
            </el-button>
            <el-button
              size="small"
              type="text"
              v-show="scope.row.edit"
              @click="resetClick(scope.$index, scope.row)"
              >重置
            </el-button>
            <el-button
              size="small"
              type="text"
              v-show="scope.row.edit"
              @click="cancelClick(scope.$index, scope.row)"
              >取消
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </AdminList>
</template>

<script>
import AdminList from "@/components/admin-list";
import $api from "@/network/api";
import { debounce } from "lodash-es";
import { userType } from "@/constants/common";
import { mapState, mapActions } from "vuex";

export default {
  name: "adminUserList",
  components: {
    AdminList,
  },
  data() {
    return {
      edit: "", //是否点击编辑，Boolean
      loading: false, //表格loading

      showList: [], //每页显示的数组
      //权限选项
      value: "",
      userType,
    };
  },
  async created() {
    await this.initUserList(); //初始化数组信息
  },
  watch: {
    userList: "updateUserList",
  },
  computed: {
    ...mapState("common", ["userList"]),
  },
  methods: {
    ...mapActions("common", ["getUserList"]),
    //获取到信息
    initUserList: debounce(async function () {
      let content = {
        state: "all",
        searchValue: "",
      };
      this.loading = true; //开始缓冲
      await this.getUserList(content);
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    }, 300),
    changeShowList(val) {
      this.showList = val;
    },
    updateUserList() {
      this.loading = true; //开始缓冲
      this.handleSizeChange(5);
      this.loading = false; //结束缓冲
    },
    // //添加(属性)信息项
    // addAttr(list) {
    //   console.log(111);
    //   this.loading = true;
    //   let resUserList = [];
    //   list.map((val, index) => {
    //     val["edit"] = false;
    //     val["index"] = index + 1;
    //     val["edit_username"] = "";
    //     val["edit_oldpassword"] = "";
    //     val["edit_newpassword"] = "";
    //     val["edit_password"] = "";
    //     val["edit_authority"] = "";
    //     resUserList.push(val);
    //   });
    //   this.userList = resUserList;
    //   console.log(this.userList);
    //   this.loading = false; //结束缓冲
    // },
    //每页显示多少条
    handleSizeChange(val) {
      let show = [];
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.userList.length <= val
        ? (show = this.userList)
        : (show = this.userList.slice(this.currentPage - 1, val));
      this.pageSize = val; //此时需更新每页显示多少条
      this.showList = show;
    },
    //编辑任务
    EditUser(row) {
      row.edit = true;
      // let name = row.username;
      // row.edit_username = name;
    },
    //删除任务
    async deleteUser(currentUser) {
      let id = currentUser.id;
      let resDeleteUser = await $api.deleteUser(id);
      if (resDeleteUser.code === 200) {
        this.initUserList();
      }
    },
    //确认修改任务
    deterMine(index, row) {
      if (
        row.username !== row.edit_username &&
        row.edit_username !== undefined
      ) {
        let resUsername = $api.updateUsername(row.id, row.edit_username);
      }
      if (
        row.edit_newpassword !== undefined &&
        row.edit_newpassword !== undefined
      ) {
        let resPassword = $api.updateUserPassword(
          row.id,
          row.edit_oldpassword,
          row.edit_newpassword
        );
      }
      if (row.edit_authority !== row.authority) {
        let resAuthority = $api.updateAuthority(row.id, row.edit_authority);
      }
      row.edit = false;
      this.getUserList();
    },
    resetClick(index, row) {
      let resetPwd = $api.resetPassword(row.id, "123");
      row.password = "123";
      row.edit_password = row.password;
      row.edit = false;
    },
    //取消修改任务
    cancelClick(index, row) {
      row.edit_password = row.password;
      row.edit = false;
    },
  },
};
</script>

<style scoped lang="less">
.user-role {
  padding: 5px 10px;
  border-radius: 10px;
  color: #ffffff;
  font-weight: lighter;
  cursor: default;
  user-select: none;
}

.user-role-0 {
  background: #f56c6c;
}

.user-role-1 {
  background: #909399;
}

.user-role-2 {
  background: #e6a23c;
}

.user-role-3 {
  background: #67c23a;
}

.user-role-4 {
  background: #b14b67;
}
</style>
