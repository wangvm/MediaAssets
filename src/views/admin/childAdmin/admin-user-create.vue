<template>
  <el-card class="create-user">
    <div slot="header" class="clearfix">
      <span>创建用户</span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="createUser">创建用户</el-button>
    </div>
    <template v-for="(item,index) in createList">
      <el-divider content-position="center"><p class='item-title'>用户{{index+1}}</p></el-divider>
      <div class="create-item">
        <el-input class='item-input'
                  v-model="item.username"
                  clearable placeholder="请输入用户名"
                  prefix-icon="el-icon-user"
        />
        <el-input class='item-input'
                  type="password"
                  v-model="item.password"
                  clearable
                  show-password
                  placeholder="请输入密码"
                  prefix-icon="el-icon-warning-outline"
        />
        <el-input class='item-input'
                  v-model="item.role"
                  clearable placeholder="请选择用户权限"
        />
      </div>
    </template>
    <div class="add-item">
      <el-button type="primary" icon="el-icon-plus" circle @click="addItem"></el-button>
    </div>
  </el-card>
</template>

<script>
	export default {
		name: "admin-user-create",
		data() {
			return {
				createList: [
					{username: '1', password: '', role: ''},
					{username: '2', password: '', role: ''},
					{username: '3', password: '', role: ''},
					{username: '', password: '', role: ''},
					{username: '3', password: '', role: ''},
				]
			}
		},
		created() {
			this.createUser()
		},
		methods: {
			addItem() {
				this.createList.push(
					{username: '', password: '', role: ''}
				)
			},
			createUser() {
				let usernameList = []
				this.createList.map(val => {
					if (val.username !== '') {
						usernameList.push(val.username)
					}
				})
				let repeatIndex = this.repeatItem(usernameList)
			},
			repeatItem(list) {
				console.log(list)
				return -1
			}
		}
	}
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
    }

    .add-item {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
