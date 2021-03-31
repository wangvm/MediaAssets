<template>
  <div id="admin-user-list">
    <div class="top">
      <div class="top_add_btn">
        <el-button size="mini" type="danger" @click="deleteSelect()">删除用户</el-button>
      </div>
      <div class="top_find">
        <el-input
          placeholder="请输入搜索内容"
          v-model="input">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="mini" @click="addUser">添加用户</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_table">
        <el-table
          ref="multipleTable"
          :data="userList"
          tooltip-effect="dark"
          style="width: 100%"
          height="100%"
          :default-sort="{prop: 'index', order: 'ascending'}"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            prop="index"
            label="序号"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="username"
            label="账号"
            width="200">
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码"
            width="250">
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">******</span>
              <span v-else>
                <el-input :placeholder="scope.row.password"
                          v-model="scope.row.edit_password"
                          show-password>
                </el-input>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="power"
            label="权限"
            width="200">
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">
                {{
                  scope.row.power === '1' ? '创建任务' :
                    scope.row.power === '2' ? '编目' :
                      '审核'
                }}
              </span>
              <span v-else>
                <el-select v-model="scope.row.power" clearable placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                v-if="!scope.row.edit"
                @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button
                size="small"
                type="text"
                v-if="!scope.row.edit"
                @click.native.prevent="deleteRow(scope.$index, userList)">删除
              </el-button>
              <el-button
                size="small"
                type="text"
                v-if="scope.row.edit"
                @click="deterMine(scope.$index, scope.row)">确定
              </el-button>
              <el-button
                size="small"
                type="text"
                v-if="scope.row.edit"
                @click="cancelClick(scope.$index, scope.row)">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "adminUserList",
  data() {
    return {
      currentPage: 1,
      input: '',
      edit: '',
      inputName: '',

      userList: [],
      multipleSelection: [],
      options: [{
        value: '1',
        label: '创建任务'
      }, {
        value: '2',
        label: '编目'
      }, {
        value: '3',
        label: '审核'
      }],
    };
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {//获取到信息
      let userList = [
        {username: '王小虎', password: '123456', power: '1'},
        {username: '王小虎', password: '234567', power: '1'},
        {username: '王小虎', password: '345678', power: '1'},
        {username: '王小虎', password: '456789', power: '1'},
        {username: '王小虎', password: '123456', power: '2'},
        {username: '王小虎', password: '234567', power: '2'},
        {username: '王小虎', password: '345678', power: '2'},
        {username: '王小虎', password: '456789', power: '2'},
        {username: '王小虎', password: '123425', power: '3'},
        {username: '王小虎', password: '345267', power: '3'},
        {username: '王小虎', password: '345267', power: '3'},
        {username: '王小虎', password: '234156', power: '3'},
        {username: '王小虎', password: '546745', power: '3'},
      ]
      this.addAttr(userList)
    },
    addAttr(list) {//添加信息项
      let resUserList = []
      list.map((val, index) => {
        val['edit'] = false
        val['index'] = index + 1
        val['edit_password'] = ''
        val['edit_power'] = ''
        resUserList.push(val)
      })
      this.userList = resUserList
    },
    handleSizeChange(val) {//每页显示多少条
      console.log(`每页 ${val} 条`);

    },
    handleCurrentChange(val) {//切换到第几页
      console.log(`当前页: ${val}`);
    },


    handleSelectionChange(val) {//多选任务
      this.multipleSelection = val;
    },
    handleEdit(row) {//编辑任务
      row.edit = true
    },
    deleteRow(index, rows) {//删除任务
      rows.splice(index, 1);
    },
    deterMine(index, row) {//确认修改任务
      row.edit_password !== '' ?
        row.password = row.edit_password
        : row.edit_password = row.password
      row.edit = false
    },
    cancelClick(index, row) {//取消修改任务
      row.edit_password = row.password
      row.edit = false
    },
    addUser() {//添加用户
      this.userList.push(
        {username: '', password: '', power: '', edit: 'true', edit_password: '', edit_power: ''}
      )
    },
    deleteSelect(index, rows) {//删除多选的任务
      rows.splice(this.multipleSelection, index)
    }
  },
}
</script>

<style scoped lang="less">
#admin-user-list {
  width: 100%;
  height: 86vh;

  .top {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .top_add_btn {
      margin-left: 1%;
    }

    .top_find {
      margin-right: 5%;
    }
  }

  .content {
    width: 100%;
    height: 80%;
    overflow: hidden;
    overflow-y: scroll;
    background-color: cadetblue;
  }

  .bottom {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>