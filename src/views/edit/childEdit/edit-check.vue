<template>
  <div class="home">
    <div class="home-left">
      <div class="home-video">
        <videoPlayer :video-info="videoInfo"/>
      </div>
      <el-card class="home-list" shadow="hover">
        <el-tree
            v-if="!this.edit"
            :data="data"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false">
          <span
              class="list-tree-node"
              @click="listClick(node, data)"
              slot-scope="{ node, data }"
          >
            <span v-if="!data.listEdit">{{ node.label }}</span>
            <span v-else>
              <el-input
                  v-model="data.list_edit_label"
                  size="mini"
                  placeholder="请输入编辑内容">
              </el-input>
            </span>
            <span>
              <el-button
                  icon="el-icon-plus"
                  type="success" size="mini"
                  circle
                  @click="() => append(data)"
              ></el-button>
              <el-button
                  v-if="!data.listEdit"
                  icon="el-icon-edit"
                  type="primary"
                  size="mini"
                  circle
                  @click="() => handleEdit(data, node)"
              ></el-button>
              <el-button
                  v-else
                  icon="el-icon-check"
                  type="primary"
                  size="mini"
                  circle
                  @click="() => handleDefine(node, data)"
              ></el-button>
              <el-button
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  circle
                  @click="() => remove(node, data)"
              ></el-button>
            </span>
          </span>
        </el-tree>
        <el-table
            v-else
            :data="tableData1"
            border
            style="width: 100%"
            row-key="id"
            height="180"
            default-expand-all
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column
              prop="name"
              label="名称">
          </el-table-column>
          <el-table-column
              prop="state"
              label="层次"
              width="60">
          </el-table-column>
          <el-table-column
              prop="result"
              label="审核结果"
              width="100">
            <template slot-scope="scope">
              <span v-if="!scope.edit">
                <!--{{ editResult[scope.row.result].label }}-->
                111111
              </span>
              <span v-else>
              <el-select v-model="scope.row.value" placeholder="" clearable>
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
        </el-table>
      </el-card>
    </div>
    <el-card class="home-right" shadow="hover">
      <div class="home-right-btn">
        <el-button class="btn-item">取消</el-button>
        <el-button type="primary" class="btn-item">保存</el-button>
      </div>
      <div class="home-right-text">
        <el-table
            v-if="!this.edit"
            :data="EditData0"
            style="width: 100%"
            :show-header="false"
            border
            :cell-style="rowStyle">
          <el-table-column prop="date" width="150">
          </el-table-column>
          <el-table-column prop="name">
          </el-table-column>
        </el-table>
        <el-table
            v-else
            :data="tableData0"
            style="width: 100%"
            :show-header="false"
            border
            :cell-style="rowStyle">
          <el-table-column prop="date" width="150">
          </el-table-column>
          <el-table-column prop="name">
          </el-table-column>
        </el-table>
      </div>
      <div class="home-right-img">
        <el-card class="img-item"
                 v-for="item in CatalogImages"
                 shadow="hover">
          <img :src="item.img" alt="图片加载错误，请检查网络" class="img">
          <span>{{item.title}}</span>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
  import videoPlayer from "@/components/video-player/video-player";

  let id = 2;
  export default {
    name: "editCheck",
    data() {
      const data = [{
        id: 1,
        label: '请输入内容',
        listEdit:false,
        list_edit_label:'',
        Catalog: [
          {title: '杭州新闻题目..', img: require('@/assets/images/logo.png')},
        ],
        EditData:[
          {date: "正题名", name: '杭州新闻 1991-05-12'},
        ],
      }];


      return {
        data: JSON.parse(JSON.stringify(data)),


        //播放器
        videoInfo: {
          url: null,
          frameRate: 25
        },
        loading: true,//实现从后端得到数据时的异步缓冲
        edit: false,//是否为编辑者，true为编辑，false为审核

        //左侧信息
        tableList: [],

        //右侧文字表格
        tableData: [],
        //编辑优策文字表格
        EditData:[],

        //右侧图片文字信息
        CatalogImages: [],

        options: [{
          value: '0',
          label: '合格'
        }, {
          value: '1',
          label: '不合格'
        }],
        value: ''
      }
    },

    created() {
      this.getList();
    },

    components: {
      videoPlayer
    },

    computed: {
      //因为数据用到了dataform中的数据，所以写在了computed中,具体内容可在methods中的getList里更换
      tableData0() {
        return this.tableData;
      },
      EditData0() {
        return this.EditData;
      }
    },

    methods: {
      //点击左侧显示右侧列表信息
      listClick(node, data) {
        console.log(data.id);
        this.EditData = data.EditData;
      },
      //点击编辑
      handleEdit(data, node) {
        data.listEdit = true;
      },
      //确认编辑
      handleDefine(node, data) {
        data.list_edit_label === '' ? data.label = data.label : data.label = data.list_edit_label;
        data.listEdit = false;
      },
      //增加行
      append(data) {
        const newChild = {
          id: id++,
          label: '编辑内容',
          listEdit:false,
          list_edit_label:'',
          Catalog: [],
          EditData:[],
          children: []
        };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      //删除行
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },



      // 定义右侧列背景色
      rowStyle({rowIndex, columnIndex}) {
        if (columnIndex == 0 && rowIndex == 0) {
          return "background-color:rgb(122, 150, 233);";
        } else if (columnIndex == 0) {
          return "background-color:rgb(231, 233, 242);";
        } else {
          return "";
        }
      },

      //左下角节目信息
      //数组嵌套数组数据，左侧为父，右侧为子
      getList: async function () {
        this.loading = true;
        let newTableList = [
          {
            id: 1,
            name: '浙江之声 1990-09-24',
            state: '节目',
            result: '合格',
            children: [
              {
                id: 11,
                name: '杭州农药厂依靠科技进步',
                state: '片段',
                result: '合格',
              },
              {
                id: 12,
                name: '杭州市无偿献血活动日',
                state: '片段',
                result: '合格',
              },
              {
                id: 11,
                name: '杭州农药厂依靠科技进步',
                state: '片段',
                result: '合格',
              },
              {
                id: 12,
                name: '杭州市无偿献血活动日',
                state: '片段',
                result: '合格',
              },
              {
                id: 11,
                name: '杭州农药厂依靠科技进步',
                state: '片段',
                result: '合格',
              },
              {
                id: 12,
                name: '杭州市无偿献血活动日',
                state: '片段',
                result: '合格',
              },
            ]
          }
        ];
        let newTableData = [
          {date: "正题名", name: '杭州新闻 1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
          {date: "首播日期", name: '1991-5-12'},
          {date: "正题名", name: '杭州新闻1991-05-12'},
        ];
        let newCatalogImages = [
          {title: '杭州新闻题目..', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
        ];
        this.tableList = newTableList;
        this.tableData = newTableData;
        this.CatalogImages = newCatalogImages;
        this.loading = false;
      }
    }
  }
</script>

<style scoped lang="less">
  .home {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 85.5vh;

    .home-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      width: 43%;
      height: 90vh;

      .home-video {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 635px;
      }

      .home-list {
        width: 98%;
        height: 35%;
        overflow-y: scroll;

        .list-tree-node{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: 1.5em;
        }
      }
    }

    .home-right {
      width: 55%;
      height: 90vh;

      .home-right-btn {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 100%;
        height: 3em;

        .btn-item {
          display: table-cell;
          width: auto;
          height: 100%;
        }
      }

      .home-right-text {
        display: block;
        width: 100%;
        height: 34em;
        overflow: scroll;
        overflow-x: hidden;
      }

      .home-right-img {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        height: 15em;
        overflow-y: scroll;
        border-top: black .2em dashed;
        box-sizing: border-box;

        .img-item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          margin: 10px 50px;
          width: 18%;
          height: 45%;
          font-size: .8em;

          .img {
            display: block;
            height: 6em;
            width: auto;
          }
        }
      }
    }
  }
</style>