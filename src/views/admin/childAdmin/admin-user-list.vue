<template>
  <el-card class="admin-user-list">
    <div class="top">
      <div class="top_title">
        <span>用户列表</span>
      </div>
      <div class="top_find">
        <el-input
            size="medium"
            placeholder="请输入搜索用户的账号"
            v-model="input"
            @keydown.enter.native="searchClick"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="mini">搜索</el-button>
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
            <template slot-scope="scope">
              {{scope.row.index - (page - 1) * pageSize}}
            </template>
          </el-table-column>
          <el-table-column
              prop="username"
              label="账号">
          </el-table-column>
          <el-table-column
              prop="createTime"
              label="创建时间">
            <template slot-scope="scope">
              {{changeDate(scope.row.createTime)}}
            </template>
          </el-table-column>
          <el-table-column
              prop="password"
              label="密码">
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
              prop="role"
              label="权限">
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">
                {{
                  scope.row.role === 1 ? '创建任务' :
                    scope.row.role === 2 ? '编目' :
                      scope.row.role === 3 ? '审核': '未设置'
                }}
              </span>
              <span v-else>
                <el-select v-model="scope.row.role" clearable placeholder="请选择">
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                  size="small"
                  type="text"
                  v-if="!scope.row.edit"
                  @click="EditUser(scope.row)">编辑
              </el-button>
              <el-button
                  size="small"
                  type="text"
                  v-if="!scope.row.edit"
                  @click.native.prevent="deleteUser(scope.row)">删除
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
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userList.length">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
	import $api from "@/network/api"

	export default {
		name: "adminUserList",
		data() {
			return {
				currentPage: 1,//默认显示第几页
				page: '1',//目前是第几页
				input: '',//搜索康输入的值
				edit: '',//是否点击编辑，Boolean
				pageSize: 2,//默认每页显示多少条
				pageSizes: [2, 3, 4, 6],//每页显示多少条有哪些选项
				loading: false,//表格loading

				userList: [],//从api.js中获取到的数组
				showList: [],//每页显示的数组
				//权限选项
				value: '',
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
			}
		},
		created() {
			this.getUserList()//初始化数组信息
		},
		methods: {
			//获取到信息
			async getUserList() {
				this.loading = true//开始缓冲
				let res = await $api.getUserList()
				let userList = res.data
				this.addAttr(userList)
				this.handleSizeChange(this.pageSize)
			},
			//添加(属性)信息项
			addAttr(list) {
				let resUserList = []
				list.map((val, index) => {
					val['edit'] = false
					val['index'] = index + 1
					val['edit_password'] = ''
					val['edit_role'] = ''
					resUserList.push(val)
				})
				this.userList = resUserList
				this.loading = false//结束缓冲
			},
			//每页显示多少条
			handleSizeChange(val) {
				let show = []
				//判断请求到的数组长度是否小于等于每页显示的数组条数：是->显示的数组=请求道的数组；否->显示的数组=请求的数组slice（第几页-1， 显示多少组）
				this.userList.length <= val ? show = this.userList : show = this.userList.slice(this.currentPage - 1, val)
				this.pageSize = val//此时需更新每页显示多少条
				this.showList = show
			},
			//切换到第几页
			handleCurrentChange(val) {
				this.page = val
				let pageList = []
				let num = Math.ceil(this.userList.length / this.pageSize)//向上取整（取请求数组长度/每页显示的条数）= 第几页
				if (val === num) {//若页数=最后一页
					if (this.userList.length % this.pageSize !== 0) {//若最后一页不满，则显示剩余条数
						pageList = this.userList.slice((val - 1) * this.pageSize, this.userList.length - (val - 1) * this.pageSize)
					}
				}
				pageList = this.userList.slice((val - 1) * this.pageSize, val * this.pageSize)
				this.showList = pageList
			},
			//编辑任务
			EditUser(row) {
				row.edit = true
			},
			//删除任务
			async deleteUser(currentUser) {
				let uid = currentUser.uid
				let resDeleteUser = await $api.deleteUser(uid)
				console.log(resDeleteUser)
			},
			//确认修改任务
			deterMine(index, row) {
				row.edit_password !== '' ?
					row.password = row.edit_password
					: row.edit_password = row.password
				row.edit_role = row.role
				$api.updateUser(row.uid, row.password, row.edit_role)
				row.edit = false
			},
			//取消修改任务
			cancelClick(index, row) {
				row.edit_password = row.password
				row.edit = false
			},
			//点击搜索
			async searchClick() {
				let searchList = []
				let search = []
				let res = await $api.getUserByName(this.input)//将通过用户行搜索到的对应的对象拿到
				if (res.code === 200) {//判断返回是否成功：200->请求成功；3->用户不存在
					searchList.push(res.data)//先将对象放进数组中
					searchList.map((val, index) => {//在对数组里进行补充，这样就可以进行编辑
						val['index'] = index + 1
						val['edit'] = false
						val['edit_password'] = ''
						val['edit_role'] = ''
						search.push(val)
					})
				} else {
					searchList = []//若不成功则数组为空，用户可点击分页序号返回默认显示列表
				}
				this.showList = searchList//这时显示搜索的数组
			},
			//创建时间戳
			changeDate(time) {
				let date = new Date(time)
				let showTime = date.getFullYear() + '-' + (date.getMonth() * 1 + 1) + '-' + date.getDate()
				return showTime
			}
		},
	}
</script>

<style scoped lang="less">
  .admin-user-list {
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
