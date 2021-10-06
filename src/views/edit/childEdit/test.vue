<template>
  <div class="home">
    <div class="home-left">
      <div class="home-video">
        <videoPlayer :video-info="videoInfo"/>
      </div>
      <el-card class="home-list" shadow="hover">
        <!--编目-->
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
            <span v-if="!data.listEdit"
            >
              {{ node.label }}
            </span>
            <span v-else>
              <input
                  v-model="data.list_edit_label"
                  class="list-tree-node-input"
                  placeholder="请输入编辑内容"
              />
            </span>
            <span class="list-tree-node-buttons">
              <div
                  @click="() => append(data)"
                  class="list-tree-node-btn"
              >
                <i class="el-icon-plus"></i>
              </div>
              <div
                  @click="() => handleEdit(data, node)"
                  class="list-tree-node-btn"
                  v-if="!data.listEdit"
              >
                <i class="el-icon-edit"></i>
              </div>
              <div
                  @click="() => handleDefine(node, data)"
                  class="list-tree-node-btn"
                  v-else
              >
                <i class="el-icon-check"></i>
              </div>
              <div
                  class="list-tree-node-btn"
                  @click="() => remove(node, data)"
              >
                <i class="el-icon-delete"></i>
              </div>
            </span>
          </span>
        </el-tree>
        <!--审核-->
        <el-table
            v-else
            :data="tableList"
            border
            style="width: 100%"
            row-key="id"
            @row-click="openDetails"
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
            <span slot-scope="scope" v-if="!scope.row.saveEdit">
                {{ scope.row.result }}
            </span>
            <span slot-scope="scope" v-else>
                <el-select v-model="scope.row.value" placeholder="" size="mini" clearable>
                  <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
            </span>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="home-right">
      <el-card class="home-right-card" shadow="hover">
        <div class="home-right-btn">
          <el-button class="btn-item">取消</el-button>
          <!--编目-->
          <el-button
              type="primary"
              class="btn-item"
              v-if="!this.edit"
          >
            <span @click="saveClick">确定</span>
          </el-button>
          <!--审核-->
          <el-button
              type="primary"
              class="btn-item"
              v-else
          >
            <span v-if="!this.saveEdit" @click="modifyClick">审核</span>
            <span v-else @click="saveClick">确定</span>
          </el-button>
        </div>
        <div class="home-right-text">
          <!--编目-->
          <el-table
              v-if="!this.edit"
              :data="EditData"
              style="width: 100%"
              :show-header="false"
              border
              :cell-style="rowStyle">
            <el-table-column prop="date" width="150">
            </el-table-column>
            <el-table-column prop="name">
              <template slot-scope="scope">
                <span v-if="!scope.row.list_right_edit">{{scope.row.name}}</span>
                <el-input
                    v-else
                    type="请求出错"
                    autosize
                    placeholder="请输入内容"
                    v-model="scope.row.textarea">
                </el-input>
              </template>
            </el-table-column>
          </el-table>
          <!--审核-->
          <el-table
              v-else
              :data="tableData"
              style="width: 100%"
              :show-header="false"
              border
              :cell-style="rowStyle">
            <el-table-column prop="date" width="150">
            </el-table-column>
            <el-table-column prop="name" class="home-right-text-wrap">
            </el-table-column>
          </el-table>
        </div>
        <div class="home-right-img">
          <el-card class="img-item"
                   v-for="item in CatalogImages"
                   :key="item.id"
                   shadow="hover">
            <img :src="item.img" alt="图片加载错误，请检查网络" class="img">
            <span>{{item.title}}</span>
          </el-card>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  /*
  * 目前处于点击左侧显示右侧对应信息
  * */
  import videoPlayer from "@/components/video-player/video-player";

  //右上表格默认开始id
  let id = 2;
  export default {
    name: "editCheck",
    data() {
      //定义右上表格默认信息
      const data = [{
        id: 1,
        label: '请输入内容',
        listEdit:false,//左下列表是否处于编辑状态
        list_edit_label:'',
        Catalog: [
          {title: '杭州新闻题目..', img: require('@/assets/images/logo.png')},
        ],
        EditData:[
          {date: "正题名", name: '请编辑内容', textarea:'', list_right_edit:false},
          {date: "首播日期", name: '1991-5-12', textarea:'', list_right_edit:false},
          {date: "节目类型", name: '新闻', textarea:'', list_right_edit:false},
          {date: "内容描述", name: '1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益', textarea:'', list_right_edit:false},
          {date: "字幕形式", name: '只有画面叠加字幕', textarea:'', list_right_edit:false},
          {date: "创建者名称", name: '杭州电视台', textarea:'', list_right_edit:false},
          {date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台', textarea:'', list_right_edit:false},
          {date: "节目形态", name: '综合', textarea:'', list_right_edit:false},
          {date: "栏目", name: '杭州新闻', textarea:'', list_right_edit:false},
          {date: "色彩", name: '彩色', textarea:'', list_right_edit:false},
          {date: "制式", name: 'PAL', textarea:'', list_right_edit:false},
          {date: "声道格式", name: '单声道', textarea:'', list_right_edit:false},
          {date: "画面宽高比", name: '4:3', textarea:'', list_right_edit:false},
          {date: "入点", name: '00:00:00:19', textarea:'', list_right_edit:false},
          {date: "时长", name: '00:11:10:12', textarea:'', list_right_edit:false},
          {date: "资料获取方式", name: '自制', textarea:'', list_right_edit:false},
          {date: "资料提供者", name: '杭州电视台', textarea:'', list_right_edit:false},
        ],
      }];


      return {
        //编目：用作左下列表增删改查
        data: JSON.parse(JSON.stringify(data)),

        //播放器
        videoInfo: {
          url: null,
          frameRate: 25
        },

        loading: true,//实现从后端得到数据时的异步缓冲
        edit: true,//是否为编辑者，true为审核，false为编目
        saveEdit: false,//右上角是否确定更改

        //左侧信息
        tableList: [],
        //右侧文字表格
        tableData: [],
        //编目：编辑右上文字表格
        EditData:[],
        //右下图片文字信息
        CatalogImages: [],

        //审核：选择框
        options: [{
          value: '合格',
          label: '合格'
        }, {
          value: '不合格',
          label: '不合格'
        }],
        //审核：选择框绑定的值
        value: ''
      }
    },

    created() {
      this.getList();//初始化页面数据
      this.getQuery();//监听路由传递的edit使true(审核)还是false(编目)

      //初始化 编目/审核 及确定按钮
      this.modifyClick();
      this.saveClick();
    },

    components: {
      videoPlayer
    },

    watch: {
      //监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getQuery'
    },

    methods: {
      //初始化监听路由传递的edit使true(审核)还是false(编目)
      getQuery:function() {
        let queryEdit = this.$route.query.edit;
        this.edit = queryEdit;
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

      //编目：点击编辑左下内容以及右上表格信息
      handleEdit(data, node) {
        data.listEdit = true;
        console.log(data.listEdit);
        data.EditData.forEach(function(item, index) {
          item.list_right_edit = true;
        });
        this.EditData = data.EditData;
      },
      //编目：确认编辑
      handleDefine(node, data) {
        //当确定后，左下列表中list_edit_label中的值会覆盖默认显示label的值
        data.list_edit_label === '' ? data.label = data.label : data.label = data.list_edit_label;
        //当确定后，右上列表编辑框中的textarea的值会覆盖默认显示的name的值
        data.listEdit = false;
        data.EditData.forEach(function(item, index) {
          item.list_right_edit = false;
          item.name = item.textarea;
        })
      },
      //编目：增加行
      append(data) {
        const newChild = {
          id: id++,
          label: '编辑内容',
          listEdit:false,
          list_edit_label:'',
          Catalog: [],
          imageData:[],
          EditData:[
            {date: "正题名1111", name: '1111', textarea:'', list_right_edit:false},
            {date: "首播日期", name: '1991-5-12', textarea:'', list_right_edit:false},
            {date: "节目类型", name: '新闻', textarea:'', list_right_edit:false},
            {date: "内容描述", name: '1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益', textarea:'', list_right_edit:false},
            {date: "字幕形式", name: '只有画面叠加字幕', textarea:'', list_right_edit:false},
            {date: "创建者名称", name: '杭州电视台', textarea:'', list_right_edit:false},
            {date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台', textarea:'', list_right_edit:false},
            {date: "节目形态", name: '综合', textarea:'', list_right_edit:false},
            {date: "栏目", name: '杭州新闻', textarea:'', list_right_edit:false},
            {date: "色彩", name: '彩色', textarea:'', list_right_edit:false},
            {date: "制式", name: 'PAL', textarea:'', list_right_edit:false},
            {date: "声道格式", name: '单声道', textarea:'', list_right_edit:false},
            {date: "画面宽高比", name: '4:3', textarea:'', list_right_edit:false},
            {date: "入点", name: '00:00:00:19', textarea:'', list_right_edit:false},
            {date: "时长", name: '00:11:10:12', textarea:'', list_right_edit:false},
            {date: "资料获取方式", name: '自制', textarea:'', list_right_edit:false},
            {date: "资料提供者", name: '杭州电视台', textarea:'', list_right_edit:false},
          ],
          children: []
        };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      //编目：删除行
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },

      //审核：点击查看对应右上信息列表
      openDetails(row) {
        this.tableData = row.tableData;
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
            result: '',
            saveEdit: false,
            tableData: [
              {id: 1, date: "正题名", name: '杭州新闻 1991-05-12'},
              {id: 2, date: "首播日期", name: '1991-5-12'},
              {id: 3, date: "节目类型", name: '新闻'},
              {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
              {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
              {id: 6, date: "创建者名称", name: '杭州电视台'},
              {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
              {id: 8, date: "节目形态", name: '综合'},
              {id: 9, date: "栏目", name: '杭州新闻'},
              {id: 10, date: "色彩", name: '彩色'},
              {id: 11, date: "制式", name: 'PAL'},
              {id: 12, date: "声道格式", name: '单声道'},
              {id: 13, date: "画面宽高比", name: '4:3'},
              {id: 14, date: "入点", name: '00:00:00:19'},
              {id: 15, date: "时长", name: '00:11:10:12'},
              {id: 16, date: "资料获取方式", name: '自制'},
              {id: 17, date: "资料提供者", name: '杭州电视台'},
            ],
            imageData:[],
            children: [
              {
                id: 11,
                name: '杭州农药厂依靠科技进步',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '杭州农药厂依靠科技进步'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 12,
                name: '杭州市无偿献血活动日',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '杭州市无偿献血活动日'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 13,
                name: '本市医卫工作者开展“5.1”劳动节活动',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '本市医卫工作者开展“5.1”劳动节活动'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 14,
                name: '杭州户使学校培养合格护士',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '杭州户使学校培养合格护士'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 15,
                name: '我市举行小发明家成果发布会',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '我市举行小发明家成果发布会'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 16,
                name: '杭州西湖加斯总厂重视新发展',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '杭州西湖加斯总厂重视新发展'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 17,
                name: '斯迈尔到临安考察生态农业',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '斯迈尔到临安考察生态农业'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
              {
                id: 18,
                name: '龙翔桥农副产品时长抓好',
                state: '片段',
                result: '',
                saveEdit: false,
                tableData: [
                  {id: 1, date: "正题名", name: '龙翔桥农副产品时长抓好'},
                  {id: 2, date: "首播日期", name: '1991-5-12'},
                  {id: 3, date: "节目类型", name: '新闻'},
                  {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
                  {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
                  {id: 6, date: "创建者名称", name: '杭州电视台'},
                  {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
                  {id: 8, date: "节目形态", name: '综合'},
                  {id: 9, date: "栏目", name: '杭州新闻'},
                  {id: 10, date: "色彩", name: '彩色'},
                  {id: 11, date: "制式", name: 'PAL'},
                  {id: 12, date: "声道格式", name: '单声道'},
                  {id: 13, date: "画面宽高比", name: '4:3'},
                  {id: 14, date: "入点", name: '00:00:00:19'},
                  {id: 15, date: "时长", name: '00:11:10:12'},
                  {id: 16, date: "资料获取方式", name: '自制'},
                  {id: 17, date: "资料提供者", name: '杭州电视台'},
                ],
                imageData:[],
              },
            ]
          }
        ];
        let newTableData = [
          {id: 1, date: "正题名", name: '杭州新闻 1991-05-12'},
          {id: 2, date: "首播日期", name: '1991-5-12'},
          {id: 3, date: "节目类型", name: '新闻'},
          {id: 4, date: "内容描述", name: '1、向科技要效益————杭州农药厂依靠科技进步，提高经济效益 1、向科技要效益——杭州农药厂依靠科技进步，提高经济效益'},
          {id: 5, date: "字幕形式", name: '只有画面叠加字幕'},
          {id: 6, date: "创建者名称", name: '杭州电视台'},
          {id: 7, date: "其他责任者项", name: '编辑：赵良，行首电视台；编辑：孟丽，杭州电视台；播音：闫倩，杭州电视台'},
          {id: 8, date: "节目形态", name: '综合'},
          {id: 9, date: "栏目", name: '杭州新闻'},
          {id: 10, date: "色彩", name: '彩色'},
          {id: 11, date: "制式", name: 'PAL'},
          {id: 12, date: "声道格式", name: '单声道'},
          {id: 13, date: "画面宽高比", name: '4:3'},
          {id: 14, date: "入点", name: '00:00:00:19'},
          {id: 15, date: "时长", name: '00:11:10:12'},
          {id: 16, date: "资料获取方式", name: '自制'},
          {id: 17, date: "资料提供者", name: '杭州电视台'},
        ];
        let newCatalogImages = [
          {id: 0, title: '杭州新闻题目..', img: require('@/assets/images/logo.png')},
          {id: 1, title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {id: 2, title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {id: 3, title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {id: 4, title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {id: 5, title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {id: 6, title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {id: 7, title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {id: 8, title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
          {id: 9, title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
          {id: 10, title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
        ];
        this.tableList = newTableList;
        this.tableData = newTableData;
        this.CatalogImages = newCatalogImages;
        this.loading = false;
      },

      //开始 操作（审核或编目）
      modifyClick() {
        this.saveEdit = true;
        //审核
        this.tableList[0].saveEdit = true;
        this.tableList[0].children.forEach(function(item, index) {
          item.saveEdit = true;
        })
      },
      //点击确认保存按钮
      saveClick() {
        this.saveEdit = false;
        //审核
        this.tableList[0].saveEdit = false;
        this.tableList[0].result = this.tableList[0].value;
        this.tableList[0].children.forEach(function(item, index) {
          item.result = item.value;
          item.saveEdit = false;
        })
      },
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
      height: 100%;
      min-width: 635px;

      .home-video {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 635px;
      }

      .home-list {
        width: 635px;
        height: 35%;
        overflow-y: scroll;

        .list-tree-node{
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: 1.2em;

          .list-tree-node-input{
            width: 13em;
            height: 1.3em;
            border-radius: 3px;
            border: .5px solid lightgray;
          }
          .list-tree-node-input:focus{
            outline: none;
            border: .5px solid rgb(64,158,255);
          }

          .list-tree-node-buttons{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 8em;

            .list-tree-node-btn{
              width: 1.7em;
              height: 1.7em;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: rgb(64,158,255);
            }
            .list-tree-node-btn:nth-child(1){
              background-color: rgb(103,194,58);
            }
            .list-tree-node-btn:nth-child(3){
              background-color: rgb(245,108,108);
            }
          }
        }
      }
    }

    .home-right {
      width: 55%;
      height: 100%;

      .home-right-card{
        width: 100%;
        height: 100%;
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
          height: 31.7em;
          overflow: scroll;
          overflow-x: hidden;
          //设置文本换行
          .home-right-text-wrap{
            white-space: pre-wrap;
          }
        }

        .home-right-img {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          min-width: 690px;
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
  }
</style>