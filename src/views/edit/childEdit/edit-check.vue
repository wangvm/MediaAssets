<template>
  <div class="home">
    <div class="home-left">
      <div class="home-video">
        <videoPlayer :video-info="videoInfo" />
      </div>
      <el-card class="home-list" shadow="hover">
        <el-table
          :data="tableData"
          style="width: 100%"
          row-key="id"
          border
          lazy
          default-expand-all
          @row-click="lookClick"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="title" label="标题" width="450">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.edit === false"
                class="item"
                effect="light"
                content="编辑"
                placement="left"
              >
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editItem(scope.row)"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.state === '节目'"
                class="item"
                effect="light"
                content="增加"
                placement="top"
              >
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-plus"
                  @click="addItem()"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.state === '片段'"
                class="item"
                effect="light"
                content="删除"
                placement="right"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteItem(scope.row)"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="home-right">
      <el-card class="home-right-card" shadow="hover">
        <el-form ref="form" :model="form" size="small" label-width="110px">
          <el-form-item class="right-card-btns">
            <el-button type="primary" v-show="editAndView" @click="saveClick"
              >保存</el-button
            >
            <el-button @click="cancleClick" v-show="editAndView"
              >取消</el-button
            >
          </el-form-item>
          <el-form-item label="正题名">
            <el-input
              v-model="form.edit_title"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{ form.title }}</span>
          </el-form-item>
          <el-form-item label="首播日期">
            <el-date-picker
              v-model="form.edit_premiereDate"
              type="date"
              placeholder="选择日期"
              v-show="this.editAndView"
            >
            </el-date-picker>
            <span v-show="!this.editAndView">{{ form.premiereDate }}</span>
          </el-form-item>
          <el-form-item label="节目类型">
            <el-select
              v-model="form.edit_programType"
              placeholder="请选择活动区域"
              v-show="this.editAndView"
            >
              <el-option label="新闻" value="1"></el-option>
              <el-option label="综艺" value="2"></el-option>
            </el-select>
            <span v-show="!this.editAndView">{{ form.programType }}</span>
          </el-form-item>
          <el-form-item label="内容描述">
            <el-input
              type="textarea"
              v-model="form.edit_contentDescription"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{
              form.contentDescription
            }}</span>
          </el-form-item>
          <el-form-item label="字幕形式">
            <el-input
              v-model="form.edit_subtitleForm"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{ form.subtitleForm }}</span>
          </el-form-item>
          <el-form-item label="创建者名称">
            <el-input
              v-model="form.edit_taskName"
              v-show="this.editAndView"
            ></el-input>
            <h3 v-show="!this.editAndView">{{ form.taskName }}</h3>
          </el-form-item>
          <el-form-item label="其他责任者">
            <el-input
              v-model="form.edit_groupMembers"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{ form.groupMembers }}</span>
          </el-form-item>
          <el-form-item label="节目形态">
            <el-select
              v-show="this.editAndView"
              v-model="form.edit_programForm"
              placeholder="请选择活动区域"
            >
              <el-option label="综合" value="1"></el-option>
              <el-option label="内容" value="2"></el-option>
              <el-option label="主题" value="3"></el-option>
              <el-option label="形式" value="4"></el-option>
            </el-select>
            <span v-show="!this.editAndView">{{ form.programForm }}</span>
          </el-form-item>
          <el-form-item label="栏目">
            <el-input
              v-model="form.edit_column"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{ form.column }}</span>
          </el-form-item>
          <el-form-item label="色彩">
            <el-radio-group v-model="form.edit_color" v-show="this.editAndView">
              <el-radio label="彩色" value="1"></el-radio>
              <el-radio label="黑白" value="2"></el-radio>
            </el-radio-group>
            <span v-show="!this.editAndView">{{ form.color }}</span>
          </el-form-item>
          <el-form-item label="制式">
            <el-radio-group
              v-model="form.edit_standard"
              v-show="this.editAndView"
            >
              <el-radio label="PAL" value="1"></el-radio>
              <el-radio label="NTSC" value="2"></el-radio>
              <el-radio label="SECAM" value="3"></el-radio>
            </el-radio-group>
            <span v-show="!this.editAndView">{{ form.standard }}</span>
          </el-form-item>
          <el-form-item label="声道格式">
            <el-radio-group
              v-model="form.edit_channelFormat"
              v-show="this.editAndView"
            >
              <el-radio label="单声道" value="1"></el-radio>
              <el-radio label="双声道" value="2"></el-radio>
              <el-radio label="立体声" value="3"></el-radio>
            </el-radio-group>
            <span v-show="!this.editAndView">{{ form.channelFormat }}</span>
          </el-form-item>
          <el-form-item label="画面宽高比">
            <el-radio-group
              v-model="form.edit_AspectRatio"
              v-show="this.editAndView"
            >
              <el-radio label="4:3" value="1"></el-radio>
              <el-radio label="16:9" value="2"></el-radio>
              <el-radio label="14:9" value="3"></el-radio>
            </el-radio-group>
            <span v-show="!this.editAndView">{{ form.AspectRatio }}</span>
          </el-form-item>
          <el-form-item label="入点">
            <el-time-picker
              v-model="form.edit_entryPoint"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
              placeholder="任意时间点"
              v-show="this.editAndView"
            >
            </el-time-picker>
            <span v-show="!this.editAndView">{{ form.entryPoint }}</span>
          </el-form-item>
          <el-form-item label="时长">
            <el-time-picker
              v-model="form.edit_duration"
              :picker-options="{
                selectableRange: '18:30:00 - 20:30:00',
              }"
              placeholder="任意时间点"
              v-show="this.editAndView"
            >
            </el-time-picker>
            <span v-show="!this.editAndView">{{ form.duration }}</span>
          </el-form-item>
          <el-form-item label="资料获取方式">
            <el-input
              v-model="form.edit_AcquisitionMethod"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{ form.AcquisitionMethod }}</span>
          </el-form-item>
          <el-form-item label="资料提供者">
            <el-input
              v-model="form.edit_provider"
              v-show="this.editAndView"
            ></el-input>
            <span v-show="!this.editAndView">{{ form.provider }}</span>
          </el-form-item>
          <el-form-item
            label="图片截取"
            v-model="form.imageList"
            class="right-card-screenshot"
          >
            <div class="screenshot-list">
              <span>iewubfhu</span>
              <div v-for="item in form.imageList" :key="item.url"></div>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="onload">
      <el-button type="success" size="small" @click="uploadEdit()"
        >上传</el-button
      >
    </div>
  </div>
</template>

<script>
/*
 * 目前处于点击左侧显示右侧对应信息
 * */
import videoPlayer from "@/components/video-player/video-player";
import { mapState } from "vuex";

export default {
  name: "editCheck",
  data() {
    return {
      // 限制只能编辑一个
      isEdit: false,
      // 查看与编辑模式切换
      editAndView: false,
      // 寻找保存的那一个item
      count: null,
      state: "",
      // 标记子元素id
      index: 10,
      //播放器
      videoInfo: {
        url: "http://121.196.100.229/vod/test.mp4",
        frameRate: 25,
      },
      tableData: [],

      //
      form: {
        title: "",
        premiereDate: "",
        programType: "",
        contentDescription: "",
        subtitleForm: "",
        taskName: "",
        groupMembers: "",
        programForm: "",
        column: "",
        color: "",
        standard: "",
        channelFormat: "",
        AspectRatio: "",
        entryPoint: "",
        duration: "",
        AcquisitionMethod: "",
        provider: "",
        imageList: [],
      },
    };
  },

  created() {
    this.initEditList();
  },

  components: {
    videoPlayer,
  },
  computed: {
    ...mapState("common", []),
  },
  methods: {
    // 点击查看详情
    lookClick(row, column, event) {
      this.form = row;
    },
    // 保存更改
    saveClick() {
      if (this.state === "节目") {
        this.tableData[0].title = this.tableData[0].edit_title;
        this.tableData[0].premiereDate = this.tableData[0].edit_premiereDate;
        this.tableData[0].programType = this.tableData[0].edit_programType;
        this.tableData[0].contentDescription =
          this.tableData[0].edit_contentDescription;
        this.tableData[0].subtitleForm = this.tableData[0].edit_subtitleForm;
        this.tableData[0].taskName = this.tableData[0].edit_taskName;
        this.tableData[0].groupMembers = this.tableData[0].edit_groupMembers;
        this.tableData[0].programForm = this.tableData[0].edit_programForm;
        this.tableData[0].column = this.tableData[0].edit_column;
        this.tableData[0].color = this.tableData[0].edit_color;
        this.tableData[0].standard = this.tableData[0].edit_standard;
        this.tableData[0].channelFormat = this.tableData[0].edit_channelFormat;
        this.tableData[0].AspectRatio = this.tableData[0].edit_AspectRatio;
        this.tableData[0].entryPoint = this.tableData[0].edit_entryPoint;
        this.tableData[0].duration = this.tableData[0].edit_duration;
        this.tableData[0].AcquisitionMethod =
          this.tableData[0].edit_AcquisitionMethod;
        this.tableData[0].provider = this.tableData[0].edit_provider;
        this.tableData[0].edit = false;
      } else {
        for (let i in this.tableData[0].children) {
          if (this.count === this.tableData[0].children[i].id) {
            this.tableData[0].children[i].title =
              this.tableData[0].children[i].edit_title;
            this.tableData[0].children[i].premiereDate =
              this.tableData[0].children[i].edit_premiereDate;
            this.tableData[0].children[i].programType =
              this.tableData[0].children[i].edit_programType;
            this.tableData[0].children[i].contentDescription =
              this.tableData[0].children[i].edit_contentDescription;
            this.tableData[0].children[i].subtitleForm =
              this.tableData[0].children[i].edit_subtitleForm;
            this.tableData[0].children[i].taskName =
              this.tableData[0].children[i].edit_taskName;
            this.tableData[0].children[i].groupMembers =
              this.tableData[0].children[i].edit_groupMembers;
            this.tableData[0].children[i].programForm =
              this.tableData[0].children[i].edit_programForm;
            this.tableData[0].children[i].column =
              this.tableData[0].children[i].edit_column;
            this.tableData[0].children[i].color =
              this.tableData[0].children[i].edit_color;
            this.tableData[0].children[i].standard =
              this.tableData[0].children[i].edit_standard;
            this.tableData[0].children[i].channelFormat =
              this.tableData[0].children[i].edit_channelFormat;
            this.tableData[0].children[i].AspectRatio =
              this.tableData[0].children[i].edit_AspectRatio;
            this.tableData[0].children[i].entryPoint =
              this.tableData[0].children[i].edit_entryPoint;
            this.tableData[0].children[i].duration =
              this.tableData[0].children[i].edit_duration;
            this.tableData[0].children[i].AcquisitionMethod =
              this.tableData[0].children[i].edit_AcquisitionMethod;
            this.tableData[0].children[i].provider =
              this.tableData[0].children[i].edit_provider;
            this.tableData[0].children[i].state =
              this.tableData[0].children[i].edit_state;
            this.tableData[0].children[i].edit = false;
          }
        }
      }

      this.state = "";
      this.count = null;
      this.editAndView = false;
      this.isEdit = false;
    },
    cancleClick() {
      if (this.state === "节目") {
        this.tableData[0].edit = false;
      } else {
        for (let i in this.tableData[0].children) {
          if (this.count === this.tableData[0].children[i].id) {
            this.tableData[0].children[i].edit = false;
          }
        }
      }

      this.state = "";
      this.count = null;
      this.editAndView = false;
      this.isEdit = false;
    },
    //
    // 初始化数据
    initEditList() {
      // 后续将id写成添加项中的index
      this.tableData = [
        {
          id: 1,
          title: "默认数据",
          premiereDate: "",
          programType: "",
          contentDescription: "",
          subtitleForm: "",
          taskName: "",
          groupMembers: "",
          programForm: "",
          column: "",
          color: "",
          standard: "",
          channelFormat: "",
          AspectRatio: "",
          entryPoint: "",
          duration: "",
          AcquisitionMethod: "",
          provider: "",
          state: "节目",
          imageList: [],
          edit: false,
          edit_title: "",
          edit_premiereDate: "",
          edit_programType: "",
          edit_contentDescription: "",
          edit_subtitleForm: "",
          edit_taskName: "",
          edit_groupMembers: "",
          edit_programForm: "",
          edit_column: "",
          edit_color: "",
          edit_standard: "",
          edit_channelFormat: "",
          edit_AspectRatio: "",
          edit_entryPoint: "",
          edit_duration: "",
          edit_AcquisitionMethod: "",
          edit_provider: "",
          children: [],
        },
      ];
    },
    // 添加子行
    addItem() {
      // 后续将id写成添加项中的index
      this.tableData[0].children.push({
        id: this.index,
        title: "默认数据" + this.index,
        premiereDate: "",
        programType: "",
        contentDescription: "",
        subtitleForm: "",
        taskName: "",
        groupMembers: "",
        programForm: "",
        column: "",
        color: "",
        standard: "",
        channelFormat: "",
        AspectRatio: "",
        entryPoint: "",
        duration: "",
        AcquisitionMethod: "",
        provider: "",
        imageList: [],
        state: "片段",
        edit: false,
        edit_title: "",
        edit_premiereDate: "",
        edit_programType: "",
        edit_contentDescription: "",
        edit_subtitleForm: "",
        edit_taskName: "",
        edit_groupMembers: "",
        edit_programForm: "",
        edit_column: "",
        edit_color: "",
        edit_standard: "",
        edit_channelFormat: "",
        edit_AspectRatio: "",
        edit_entryPoint: "",
        edit_duration: "",
        edit_AcquisitionMethod: "",
        edit_provider: "",
      });
      this.index++;
    },
    // 删除行
    deleteItem(row) {
      for (let i in this.tableData[0].children) {
        if (row.id === this.tableData[0].children[i].id) {
          this.tableData[0].children.splice(i, 1);
        }
      }
    },
    // 编辑内容
    editItem(row) {
      if (this.isEdit === false) {
        this.isEdit = true;
        row.edit = true;
        this.count = row.id;
        this.form = row;
        this.state = row.state === "节目" ? "节目" : "片段";
        this.editAndView = true;
      } else {
        this.$message("请保存或取消上一编辑内容");
      }
    },
    // 上传至后端保存数据
    uploadEdit() {
      console.log(this.tableData);
      let uploadList = _.cloneDeep(this.tableData);
    },
  },
};
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
    }
  }

  .home-right {
    width: 55%;
    height: 100%;
    min-width: 50%;

    .home-right-card {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      .right-card-btns {
        position: sticky;
        top: 0.8em;
        z-index: 5;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .right-card-screenshot {
        width: 100%;
        height: auto;
        .screenshot-list {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 26em;
          overflow-y: scroll;
          border: 1px solid #dcdfe6;
          border-radius: 0.5em;
        }
      }
    }
  }
  .onload {
    position: fixed;
    top: 1em;
    right: 1em;
    width: 5em;
    height: 3em;
  }
}
</style>