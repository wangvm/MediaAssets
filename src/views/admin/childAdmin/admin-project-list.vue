<template>
  <el-card class="admin-project-list">
    <div class="top">
      <div class="top_title">
        <span>项目列表</span>
      </div>
      <div class="top_find">
        <el-input
          size="medium"
          placeholder="请输入搜索项目的ID"
          v-model="input"
          @keydown.enter.native="searchClick"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="mini" @click="searchClick">搜索</el-button>
      </div>
    </div>
    <div class="content">
      <div class="content_table">
        <el-table
          :data="showList"
          tooltip-effect="dark"
          style="width: 100%"
          v-loading="loading">
          <el-table-column
            prop="index"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称">
          </el-table-column>
          <el-table-column
            prop="pid"
            label="项目ID">
          </el-table-column>
          <el-table-column
            prop="status"
            label="进度">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.status === '1' ? '创建任务' :
                    scope.row.status === '2' ? '编目' :
                      scope.row.status === '0' ? '审核' : '未设置'
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                @click="enterProject(scope.row)">进入项目
              </el-button>
              <el-button
                size="small"
                type="text"
                @click.native.prevent="deleteProject(scope.row)">删除项目
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
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ProjectList.length">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
import $api from "@/network/api";

export default {
  name: "adminProjectList",
  data() {
    return {
      currentPage: 1,//默认显示第几页
      input: '',//搜索康输入的值
      pageSize: 2,//默认每页显示多少条
      pageSizes: [2, 3, 4, 6],//每页显示多少条有哪些选项
      loading: false,//表格loading

      ProjectList: [
        {index: 1, pid: 202101, projectName: '项目1 ',status: '1'},
        {index: 2, pid: 202101, projectName: '项目2 ',status: '2'},
        {index: 3, pid: 202101, projectName: '项目3 ',status: '1'},
        {index: 4, pid: 202101, projectName: '项目4 ',status: '3'},
        {index: 5, pid: 202101, projectName: '项目5 ',status: '2'},
        {index: 6, pid: 202101, projectName: '项目6 ',status: '2'},
        {index: 7, pid: 202101, projectName: '项目7 ',status: '1'},
        {index: 8, pid: 202101, projectName: '项目8 ',status: '3'},
        {index: 9, pid: 202101, projectName: '项目9 ',status: '3'},
        {index: 10, pid: 202101, projectName: '项目10 ',status: '1'},
        {index: 11, pid: 202101, projectName: '项目11 ',status: '2'},
        {index: 12, pid: 202101, projectName: '项目12 ',status: '1'},
      ],//从api.js中获取到的数组
      showList: [],//每页显示的数组
      //权限选项
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
    this.getProjectList()//初始化数组信息
    this.handleSizeChange(this.pageSize)
  },
  methods: {
    //获取到信息
    async getProjectList() {
      // this.loading = true//开始缓冲
      let res = await $api.getProjectList()
      console.log(res)
      let ProjectList = res.data
      this.addAttr(ProjectList)
      this.handleSizeChange(this.pageSize)
    },
    //添加(属性)信息项
    addAttr(list) {
      let resProjectList = []
      list.map((val, index) => {
        val['index'] = index + 1
        resProjectList.push(val)
      })
      // this.ProjectList = resProjectList
      // this.loading = false//结束缓冲
    },
    //每页显示多少条
    handleSizeChange(val) {
      let show = []
      //判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
      this.ProjectList.length <= val ? show = this.ProjectList : show = this.ProjectList.slice(this.currentPage - 1, val)
      this.pageSize = val//此时需更新每页显示多少条
      this.showList = show
    },
    //切换到第几页
    handleCurrentChange(val) {
      let pageList = []
      let num = Math.ceil(this.ProjectList.length / this.pageSize)//向上取整（取请求数组长度/每页显示的条数）= 第几页
      if(val === num) {//若页数=最后一页
        if (this.ProjectList.length % this.pageSize !== 0) {//若最后一页不满，则显示剩余条数
          pageList = this.ProjectList.slice((val - 1) * this.pageSize, this.ProjectList.length - (val - 1) * this.pageSize)
        }
      }
      pageList = this.ProjectList.slice((val - 1) * this.pageSize, val * this.pageSize)
      this.showList = pageList
    },
    //进入项目
    enterProject() {
      // task = 任务 check = 审核 video = 编目
      this.$router.push({name: 'task', params: {projectName: 'aa'}})
    },
    //删除项目
    async deleteProject(currentProject) {
      console.log(currentProject)
      let pid = currentProject.pid
      let resDeleteProject = await $api.deleteProject(pid)
      console.log(resDeleteProject)
    },
    //点击搜索
    async searchClick() {
      let searchList = []
      // let search = []
      // let res = await $api.getProjectById(this.input)//将通过用户行搜索到的对应的对象拿到
      // if (res.code === 200) {//判断返回是否成功：200->请求成功；3->用户不存在
      //   searchList.push(res.data)//先将对象放进数组中
      //   searchList.map((val, index) => {//在对数组里进行补充，这样就可以进行编辑
      //     val['index'] = index+1
      //     val['edit'] = false
      //     val['edit_password'] = ''
      //     val['edit_role'] = ''
      //     search.push(val)
      //   })
      // }else {
      //   searchList = []//若不成功则数组为空，用户可点击分页序号返回默认显示列表
      // }
      this.showList = searchList//这时显示搜索的数组
    },
  },
}
</script>

<style scoped lang="less">
.admin-project-list {
  width: 100%;

  .top {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(235, 235, 235);

    .top_title {
      margin-left: 1%;
    }

    .top_find {
      margin-right: 5%;
      display: flex;
    }
  }

  .content {
    width: 100%;
  }

  .bottom {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>