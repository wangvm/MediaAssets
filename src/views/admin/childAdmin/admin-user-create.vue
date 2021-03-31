<template>
  <el-card class="create-user">
    <div slot="header" class="clearfix">
      <span>创建用户<span style="color: red;font-weight: bold;margin-left: 20px;">注：账号为空不会创建用户</span></span>
      <el-button style="float: right; padding: 3px 0" type="text" @click="createUser">创建用户</el-button>
    </div>
    <template v-for="(item,index) in createList">
      <el-divider content-position="center"><p class='item-title'>用户{{index+1}}</p></el-divider>
      <div class="create-item">
        <el-input class='item-input'
                  v-model="item.username"
                  clearable placeholder="请输入账号"
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
        <el-select v-model="item.role"
                   placeholder="请选择权限"
                   filterable
                   class="item-select"
        >
          <el-option
            v-for="selectItem in selectOptions"
            :key="selectItem.value"
            :label="selectItem.label"
            :value="selectItem.value">
          </el-option>
        </el-select>
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
        {username: '', password: '', role: ''},
      ],
      selectOptions: [{
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
  },
  methods: {
    addItem() {
      this.createList.push(
        {username: '', password: '', role: ''}
      )
    },
    createUser() {
      let repeatIndex = this.repeatItem(this.createList)
      if (repeatIndex[0] !== repeatIndex[1]) return this.$message.error(`用户${repeatIndex[0] * 1 + 1}与用户${repeatIndex[1] * 1 + 1}账号重复`)
      let emptyPasswordIndex = this.emptyPassword(this.createList)
      if (emptyPasswordIndex !== -1) return this.$message.error(`用户${emptyPasswordIndex * 1 + 1}密码为空`)
      let resList = this.filterItem(this.createList)
      //todo
      // 深拷贝一次，删除不必要的隐士函数
      console.log('创建用户数据',resList)
    },
    repeatItem(list) {
      let usernameList = []
      let repeatIndex = [-1, -1]
      Object.keys(list).forEach(val => {
        if (list[val].username === '') return
        let index = usernameList.findIndex(name => name === list[val].username)
        index === -1 ? usernameList.push(list[val].username)
          : repeatIndex = [index.toString(), val]
      })
      return repeatIndex
    },
    filterItem(list) {
      let res = list.filter(val => val.username !== '')
      return res
    },
    emptyPassword(list) {
      let emptyList = []
      Object.keys(list).forEach(val => {
        list[val].username !== '' && list[val].password === '' && emptyList.push(val)
      })
      return emptyList[0] || -1
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

    .item-select{
      width: 600px;
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