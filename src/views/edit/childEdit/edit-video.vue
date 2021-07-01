<template>
  <div class="home">
    <div class="home-left">
      <div class="home-video">
        <videoPlayer :video-info="videoInfo" />
      </div>
      <el-card class="home-list" shadow="hover">
        <el-table
          :data="tableData1"
          border
          style="width: 100%"
          row-key="id"
          height="180"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" label="名称"> </el-table-column>
          <el-table-column prop="state" label="层次" width="60">
          </el-table-column>
          <el-table-column prop="result" label="审核结果" width="80">
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <el-card class="home-right">
      <div class="home-right-text">
        <el-table
          :data="tableData"
          style="width: 100%"
          :show-header="false"
          border
          :cell-style="rowStyle"
        >
          <el-table-column prop="date" width="150"> </el-table-column>
          <el-table-column prop="name"> </el-table-column>
        </el-table>
      </div>
      <div class="home-right-img">
        <el-card
          class="img-item"
          v-for="(item, index) in CatalogImages"
          :key="index"
          shadow="hover"
        >
          <!-- <img
            :v-lazy="require(item.img)"
            alt="图片加载错误，请检查网络"
            class="img"
          /> -->
          <span>{{ item.title }}</span>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import videoPlayer from "@/components/video-player/video-player";

export default {
  name: "editVideo",
  data() {
    return {
      //播放器
      videoInfo: {
        url: null,
        frameRate: 25,
      },
      loading: true, //实现从后端得到数据时的异步缓冲
      edit: false, //是否为编辑者，true为编辑，false为审核

      //左侧信息
      tableData1: [],

      //右侧图片文字信息
      CatalogImages: [],
    };
  },

  created() {
    this.getList();
  },

  components: {
    videoPlayer,
  },

  computed: {
    //因为数据用到了dataform中的数据，所以写在了computed中
    tableData() {
      return [
        { date: "正题名", name: "杭州新闻 1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
        { date: "首播日期", name: "1991-5-12" },
        { date: "正题名", name: "杭州新闻1991-05-12" },
      ];
    },
  },

  methods: {
    // 定义右侧列背景色
    rowStyle({ rowIndex, columnIndex }) {
      if (columnIndex == 0 && rowIndex == 0) {
        return "background-color:rgb(122, 150, 233);";
      } else if (columnIndex == 0) {
        return "background-color:rgb(231, 233, 242);";
      } else {
        return "";
      }
    },

    //左下角节目信息
    getList: async function() {
      this.loading = true;
      let newTableData1 = [
        {
          id: 1,
          name: "浙江之声 1990-09-24",
          state: "节目",
          result: "合格",
          children: [
            {
              id: 11,
              name: "杭州农药厂依靠科技进步",
              state: "片段",
              result: "合格",
            },
            {
              id: 12,
              name: "杭州市无偿献血活动日",
              state: "片段",
              result: "合格",
            },
            {
              id: 11,
              name: "杭州农药厂依靠科技进步",
              state: "片段",
              result: "合格",
            },
            {
              id: 12,
              name: "杭州市无偿献血活动日",
              state: "片段",
              result: "合格",
            },
            {
              id: 11,
              name: "杭州农药厂依靠科技进步",
              state: "片段",
              result: "合格",
            },
            {
              id: 12,
              name: "杭州市无偿献血活动日",
              state: "片段",
              result: "合格",
            },
          ],
        },
        {
          id: 2,
          name: "杭州新闻 1991-05-12",
          state: "节目",
          result: "合格",
          children: [
            {
              id: 21,
              name: "杭州农药厂依靠科技进步",
              state: "片段",
              result: "合格",
            },
            {
              id: 22,
              name: "杭州市无偿献血活动日",
              state: "片段",
              result: "合格",
            },
            {
              id: 11,
              name: "杭州农药厂依靠科技进步",
              state: "片段",
              result: "合格",
            },
            {
              id: 12,
              name: "杭州市无偿献血活动日",
              state: "片段",
              result: "合格",
            },
            {
              id: 11,
              name: "杭州农药厂依靠科技进步",
              state: "片段",
              result: "合格",
            },
            {
              id: 12,
              name: "杭州市无偿献血活动日",
              state: "片段",
              result: "合格",
            },
          ],
        },
      ];
      let photoText = [
        // {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目一', img: require('@/assets/images/logo.png')},
        // {title: '杭州新闻题目二', img: require('@/assets/images/logo.png')},
      ];
      this.tableData1 = newTableData1;
      this.CatalogImages = photoText;
      this.loading = false;
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
  background-color: bisque;

  .home-left {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 43%;
    height: 100%;

    .home-video {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 600px;
    }

    .home-list {
      width: 98%;
      height: 32%;
    }
  }

  .home-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 55%;
    height: 100%;

    .home-right-text {
      display: block;
      width: 100%;
      height: 26.5em;
      overflow: scroll;
      overflow-x: hidden;
    }

    .home-right-img {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      height: 13.2em;
      overflow-y: scroll;
      border-top: black 0.2em dashed;
      box-sizing: border-box;

      .img-item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 10px 50px;
        width: 20%;
        height: 45%;
        font-size: 0.8em;

        .img {
          display: block;
          height: 5.5em;
          width: auto;
        }
      }
    }
  }
}
</style>
