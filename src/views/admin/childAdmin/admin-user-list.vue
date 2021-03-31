<template>
  <div id="admin-user-list">
    <div class="top">
      <div class="top_add_btn">
        <el-button type="primary">添加用户</el-button>
        <el-button type="danger" @click="deleteSelect()">删除用户</el-button>
      </div>
      <div class="top_find">
        <el-input
          placeholder="请输入搜索内容"
          v-model="input">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="content">
      <div class="content_table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="100%"
          :default-sort = "{prop: 'num', order: 'ascending'}"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="80">
          </el-table-column>
          <el-table-column
            prop="num"
            label="序号"
            sortable
            width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="账号"
            width="200">
            <el-input
              placeholder="请输入内容"
              v-model="inputName"
              v-show="edit == true"
              clearable>
            </el-input>
            <span v-show="edit == false">{{tableData.name}}</span>
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码"
            width="250">
          </el-table-column>
          <el-table-column
            prop="power"
            label="权限"
            width="200">
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="small"
                type="danger"
                @click.native.prevent="deleteRow(scope.$index, tableData)">删除</el-button>
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
      currentPage: 4,
      input: '',
      edit: false,
      inputName: '',

      tableData: [
        {num: 1,name: '王小虎',password: '******', power: '创建任务'},
        {num: 2,name: '王小虎',password: '******', power: '创建任务'},
        {num: 3,name: '王小虎',password: '******', power: '创建任务'},
        {num: 4,name: '王小虎',password: '******', power: '编目'},
        {num: 5,name: '王小虎',password: '******', power: '审核'},
        {num: 6,name: '王小虎',password: '******', power: '审核'},
        {num: 7,name: '王小虎',password: '******', power: '编目'},
        {num: 8,name: '王小虎',password: '******', power: '创建任务'},
        {num: 9,name: '王小虎',password: '******', power: '编目'},
        {num: 10,name: '王小虎',password: '******', power: '编目'},
        {num: 11,name: '王小虎',password: '******', power: '创建任务'},
        {num: 12,name: '王小虎',password: '******', power: '创建任务'},
        {num: 13,name: '王小虎',password: '******', power: '创建任务'},
      ],
      multipleSelection: []
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    deleteSelect(index, rows) {
      orws.splice(index, this.multipleSelection)
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