<template>
  <div class="home">
    <div class="home-left">
      <div class="home-video">
        <videoPlayer :video-info="videoInfo" />
      </div>
      <el-card class="home-list" shadow="hover">
        <el-table
          :data="catalogList"
          style="width: 100%"
          row-key="id"
          border
          lazy
          default-expand-all
          @row-click="lookClick"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="title.value" label="审核标题" width="450">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip
                v-if="taskStatus === 4"
                class="item"
                effect="light"
                content="审核"
                placement="left"
              >
                <el-button
                  v-if="scope.row.edit === false"
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click.stop="editItem(scope.row)"
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
          <el-form-item label="正题名" class="exame-style">
            <span>{{ form.title.value }}</span>
            <span
              class="exame-select"
              :class="{ 'exame-select-false': form.title.exame === 'false' }"
              >{{ form.title.exame }}</span
            >
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.title.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="首播日期" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.premiereDate.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.premiereDate.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.premiereDate.exame === 'false',
              }"
              >{{ form.premiereDate.exame }}</span
            >
          </el-form-item>
          <el-form-item label="节目类型" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.programType.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.programType.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.programType.exame === 'false',
              }"
              >{{ form.programType.exame }}</span
            >
          </el-form-item>
          <el-form-item label="内容描述" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.contentDescription.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.contentDescription.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.contentDescription.exame === 'false',
              }"
              >{{ form.contentDescription.exame }}</span
            >
          </el-form-item>
          <el-form-item label="字幕形式" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.subtitleForm.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.subtitleForm.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.subtitleForm.exame === 'false',
              }"
              >{{ form.subtitleForm.exame }}</span
            >
          </el-form-item>
          <el-form-item label="创建者名称">
            <h3>{{ form.taskName }}</h3>
          </el-form-item>
          <el-form-item label="其他责任者" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.groupMembers.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.groupMembers.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.groupMembers.exame === 'false',
              }"
              >{{ form.groupMembers.exame }}</span
            >
          </el-form-item>
          <el-form-item label="节目形态" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.programForm.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.programForm.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.programForm.exame === 'false',
              }"
              >{{ form.programForm.exame }}</span
            >
          </el-form-item>
          <el-form-item label="栏目" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.column.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.column.value }}</span>
            <span
              class="exame-select"
              :class="{ 'exame-select-false': form.column.exame === 'false' }"
              >{{ form.column.exame }}</span
            >
          </el-form-item>
          <el-form-item label="色彩" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.color.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.color.value }}</span>
            <span
              class="exame-select"
              :class="{ 'exame-select-false': form.color.exame === 'false' }"
              >{{ form.color.exame }}</span
            >
          </el-form-item>
          <el-form-item label="制式" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.standard.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.standard.value }}</span>
            <span
              class="exame-select"
              :class="{ 'exame-select-false': form.standard.exame === 'false' }"
              >{{ form.standard.exame }}</span
            >
          </el-form-item>
          <el-form-item label="声道格式" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.channelFormat.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.channelFormat.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.channelFormat.exame === 'false',
              }"
              >{{ form.channelFormat.exame }}</span
            >
          </el-form-item>
          <el-form-item label="画面宽高比" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.AspectRatio.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.AspectRatio.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.AspectRatio.exame === 'false',
              }"
              >{{ form.AspectRatio.exame }}</span
            >
          </el-form-item>
          <el-form-item label="入点" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.entryPoint.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.entryPoint.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.entryPoint.exame === 'false',
              }"
              >{{ form.entryPoint.exame }}</span
            >
          </el-form-item>
          <el-form-item label="时长" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.duration.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.duration.value }}</span>
            <span
              class="exame-select"
              :class="{ 'exame-select-false': form.duration.exame === 'false' }"
              >{{ form.duration.exame }}</span
            >
          </el-form-item>
          <el-form-item label="资料获取方式" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.AcquisitionMethod.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.AcquisitionMethod.value }}</span>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.AcquisitionMethod.exame === 'false',
              }"
              >{{ form.AcquisitionMethod.exame }}</span
            >
          </el-form-item>
          <el-form-item label="资料提供者" class="exame-style">
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.provider.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span>{{ form.provider.value }}</span>
            <span
              class="exame-select"
              :class="{ 'exame-select-false': form.provider.exame === 'false' }"
              >{{ form.provider.exame }}</span
            >
          </el-form-item>
          <el-form-item
            label="图片截取"
            v-model="form.imageList.value"
            class="right-card-screenshot"
          >
            <el-select
              class="exame-select"
              v-show="this.editAndView"
              v-model="form.imageList.exame"
              placeholder="请选择活动区域"
            >
              <el-option label="合格" value="true"></el-option>
              <el-option label="不合格" value="false"></el-option>
            </el-select>
            <span
              class="exame-select"
              :class="{
                'exame-select-false': form.imageList.exame === 'false',
              }"
              >{{ form.imageList.exame }}</span
            >
            <div class="screenshot-list" v-show="this.editAndView">
              <div
                class="list-items"
                v-for="item in form.imageList.value"
                :key="item.src"
              >
                <div class="item-delete">
                  <img
                    src="@/assets/images/close.png"
                    alt="图片加载失败"
                    @click="deleteClick(item.src)"
                  />
                </div>
                <img class="item-image" :src="item.src" alt="" />
                <el-input
                  placeholder="请输入内容"
                  v-model="item.title"
                  size="mini"
                  clearable
                >
                </el-input>
              </div>
            </div>
            <div class="screenshot-list" v-show="!this.editAndView">
              <div
                class="list-items"
                v-for="item in form.imageList.value"
                :key="item.src"
              >
                <img class="item-image" :src="item.src" alt="" />
                <span>{{ item.title === "" ? "请编辑" : item.title }}</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="onload">
      <el-button type="warning" size="small" @click="repulse()">打回</el-button>
      <el-button type="success" size="small" @click="complete()"
        >通过</el-button
      >
    </div>
  </div>
</template>

<script>
/*
 * 目前处于点击左侧显示右侧对应信息
 * */
import videoPlayer from "@/components/video-player/video-player";
import { mapState, mapMutations } from "vuex";
import $api from "@/network/api";

export default {
  name: "editExame",
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

      form: {
        title: { value: "", exame: "true" },
        premiereDate: { value: "", exame: "true" },
        programType: { value: "", exame: "true" },
        contentDescription: { value: "", exame: "true" },
        subtitleForm: { value: "", exame: "true" },
        taskName: this.taskNamef,
        groupMembers: { value: "", exame: "true" },
        programForm: { value: "", exame: "true" },
        column: { value: "", exame: "true" },
        color: { value: "", exame: "true" },
        standard: { value: "", exame: "true" },
        channelFormat: { value: "", exame: "true" },
        AspectRatio: { value: "", exame: "true" },
        entryPoint: { value: "", exame: "true" },
        duration: { value: "", exame: "true" },
        AcquisitionMethod: { value: "", exame: "true" },
        provider: { value: "", exame: "true" },
        imageList: { value: [], exame: "true" },
      },
    };
  },

  components: {
    videoPlayer,
  },
  computed: {
    ...mapState("common", [
      "taskName",
      "videoSrc",
      "catalogList",
      "taskStatus",
    ]),
  },
  methods: {
    // 点击查看详情
    lookClick(row, column, event) {
      if (this.editAndView === true) {
        this.$message("请结束修改再进行查看");
      } else {
        this.form = row;
      }
    },
    // 保存更改
    saveClick() {
      if (this.state === "节目") {
        this.catalogList[0].title = this.form.title;
        this.catalogList[0].premiereDate = this.form.premiereDate;
        this.catalogList[0].programType = this.form.programType;
        this.catalogList[0].contentDescription = this.form.contentDescription;
        this.catalogList[0].subtitleForm = this.form.subtitleForm;
        this.catalogList[0].taskName = this.form.taskName;
        this.catalogList[0].groupMembers = this.form.groupMembers;
        this.catalogList[0].programForm = this.form.programForm;
        this.catalogList[0].column = this.form.column;
        this.catalogList[0].color = this.form.color;
        this.catalogList[0].standard = this.form.standard;
        this.catalogList[0].channelFormat = this.form.channelFormat;
        this.catalogList[0].AspectRatio = this.form.AspectRatio;
        this.catalogList[0].entryPoint = this.form.entryPoint;
        this.catalogList[0].duration = this.form.duration;
        this.catalogList[0].AcquisitionMethod = this.form.AcquisitionMethod;
        this.catalogList[0].provider = this.form.provider;
        this.catalogList[0].edit = false;
        // // this.state = "节目";
        this.catalogList[0].imageList = this.form.imageList;
      } else {
        for (let i in this.catalogList[0].children) {
          if (this.count === this.catalogList[0].children[i].id) {
            // this.state = "片段";
            this.catalogList[0].children[i].title = this.form.title;
            this.catalogList[0].children[i].premiereDate =
              this.form.premiereDate;
            this.catalogList[0].children[i].programType = this.form.programType;
            this.catalogList[0].children[i].contentDescription =
              this.form.contentDescription;
            this.catalogList[0].children[i].subtitleForm =
              this.form.subtitleForm;
            this.catalogList[0].children[i].taskName = this.form.taskName;
            this.catalogList[0].children[i].groupMembers =
              this.form.groupMembers;
            this.catalogList[0].children[i].programForm = this.form.programForm;
            this.catalogList[0].children[i].column = this.form.column;
            this.catalogList[0].children[i].color = this.form.color;
            this.catalogList[0].children[i].standard = this.form.standard;
            this.catalogList[0].children[i].channelFormat =
              this.form.channelFormat;
            this.catalogList[0].children[i].AspectRatio = this.form.AspectRatio;
            this.catalogList[0].children[i].entryPoint = this.form.entryPoint;
            this.catalogList[0].children[i].duration = this.form.duration;
            this.catalogList[0].children[i].AcquisitionMethod =
              this.form.AcquisitionMethod;
            this.catalogList[0].children[i].provider = this.form.provider;
            this.catalogList[0].children[i].edit = false;
            this.catalogList[0].children[i].imageList = this.form.imageList;
          }
        }
      }
      this.count = null;
      this.editAndView = false;
      this.isEdit = false;
    },
    cancleClick() {
      if (this.state === "节目") {
        this.catalogList[0].edit = false;
      } else {
        for (let i in this.catalogList[0].children) {
          if (this.count === this.catalogList[0].children[i].id) {
            this.catalogList[0].children[i].edit = false;
          }
        }
      }
      this.count = null;
      this.editAndView = false;
      this.isEdit = false;
    },
    // 编辑内容
    editItem(row) {
      if (this.isEdit === false) {
        this.isEdit = true;
        row.edit = true;
        this.count = row.id;
        this.form = _.cloneDeep(row);
        this.state = row.state === "节目" ? "节目" : "片段";
        this.editAndView = true;
      } else {
        this.$message("请保存或取消上一编辑内容");
      }
    },
    // 上传至后端保存数据(打回)
    async uploadExame() {
      let uploadList = _.cloneDeep(this.catalogList);
      delete uploadList[0].id;
      delete uploadList[0].edit;
      delete uploadList[0].state;
      if (uploadList[0].children.length !== 0) {
        for (let i in uploadList[0].children) {
          delete uploadList[0].children[i].id;
          delete uploadList[0].children[i].edit;
          delete uploadList[0].children[i].state;
        }
      }
      uploadList[0].taskName = this.taskName;
    },
    // 完成
    async complete() {
      this.uploadExame();
      let res = await $api.setUploadExame(this.taskName, 3);
      if (res.code === 200) {
        this.$router.push("/edit/task");
      }
    },
    // 打回
    async repulse() {
      this.uploadExame();
      let res = await $api.setUploadExame(this.taskName, 2);
      if (res.code === 200) {
        this.$router.push("/edit/task");
      }
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
      display: flex;
      flex-direction: column;
      align-items: stretch;
      .right-card-btns {
        position: sticky;
        top: 0.8em;
        z-index: 5;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .exame-style {
        width: 100%;
        position: relative;
        .exame-select {
          position: absolute;
          top: -0.2em;
          right: 0;
          width: 25%;
          color: #409eff;
        }
        .exame-select-false {
          position: absolute;
          top: -0.2em;
          right: 0;
          width: 25%;
          color: #e6a23c;
        }
      }
      .right-card-screenshot-false {
        width: 100%;
        height: auto;
        background-color: antiquewhite;
      }
      .right-card-screenshot {
        width: 100%;
        height: auto;
        .screenshot-list {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 1%;
          width: 100%;
          height: 26em;
          overflow-y: scroll;
          border-radius: 0.5em;
          box-sizing: border-box;
          padding: 1em 0 0 1em;
          border: 0.1em solid rgb(204, 206, 211);
          .list-items {
            width: 13em;
            height: 10em;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;
            margin: 0.5em 1em 0 0;
            padding: 0.3em;
            border: 0.1em solid rgb(204, 206, 211);
            box-sizing: border-box;
            border-radius: 0.5em;
            .item-image {
              width: 80%;
              height: auto;
            }
            .item-delete {
              width: 100%;
              height: 10%;
              display: flex;
              justify-content: flex-end;
              img {
                height: 100%;
                width: auto;
                cursor: pointer;
              }
            }
          }
          .list-items:hover {
            background-color: rgb(235, 238, 245);
          }
        }
      }
    }
  }
  .onload {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    top: 1em;
    right: 1em;
    width: 15em;
    height: 3em;
  }
}
</style>