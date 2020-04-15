<template>
  <div class="content_box">
    <m-title title="云仓快报管理"></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">新闻标签：</span>
          <el-select
            class="search_title"
            clearable
            v-model="labelId"
            size="small"
            placeholder="请选择订单来源"
          >
            <el-option v-for="item in labelList" :key="item.Id" :label="item.Name" :value="item.Id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <span class="timed">新闻标题：</span>
          <el-input
            v-model="title"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入新闻标题"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            v-if="checkBtn('func_common_search')"
            type="primary"
            @click="getData()"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            v-if="checkBtn('func_common_add')"
            type="info"
            @click="addNews"
            class="search_btn pan-btn green-btn"
            icon="el-icon-plus"
          >新增快报</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="标题" prop="Name" align="center">
        <template slot-scope="scope">
          <div class="align_left goods_con">
            <img :src="scope.row.Image" alt />
            <div class="info">
              <p>{{scope.row.Title}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="LableName" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="DateAdded" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button
            v-if="checkBtn('func_common_edit')"
            class="pan-btn blue-btn"
            type="success"
            @click="jumpDesc(scope.row)"
            size="mini"
            icon="el-icon-edit"
          >编辑</el-button>
          <el-button
            v-if="checkBtn('func_common_delete')"
            class="pan-btn red-btn"
            type="primary"
            @click="delNews(scope.row)"
            size="mini"
            icon="el-icon-close"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[15,30,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import MTitle from "@/components/MTitle";
import { getNewsList, getLabelList, delNews } from "@/api/news/news.js";
export default {
  components: { MTitle },
  data() {
    return {
      list: [],
      pageSize: 15,
      fu: window.ali_oss_data.URL_IMG_SHOW,
      pageIndex: 1,
      title: "",
      TotalRows: 0,
      labelId: null,
      labelList: [],
      roleBtn: []
    };
  },
  activated() {
    this.getData();
  },
  created() {
    this.getData();
    this.getLabelList();
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  methods: {
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    handleSizeChange(e) {
      this.pageSize = e;
      this.getData();
    },
    handleCurrentChange(e) {
      this.pageIndex = e;
      this.getData();
    },
    addNews() {
      this.$router.push({
        path: "/newsInfo",
        query: {
          id: -1
        }
      });
    },
    jumpDesc(row) {
      this.$router.push({
        path: "/newsInfo",
        query: {
          id: row.Id
        }
      });
    },
    delNews(row) {
      this.$confirm("确定删除这条快报吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delNews({
          id: row.Id
        }).then(res => {
          this.$message.success("删除成功");
          this.getData();
        });
      });
    },
    getLabelList() {
      getLabelList().then(res => {
        this.labelList = res;
      });
    },
    getData() {
      getNewsList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        title: this.title,
        labelId: this.labelId
      }).then(res => {
        this.TotalRows = res.TotalRows;
        this.list = res.Data;
        this.list.forEach(item => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + item.Image;
          item.Image = signUrl;
        });
      });
    }
  }
};
</script>
<style scoped>
.addbtn {
  margin-top: 15px;
  margin-bottom: 15px;
}

.info_item {
  display: flex;
  height: 40px;
  line-height: 40px;
}

.info_item .info_title {
  flex: 0 0 80px;
  text-align: right;
}

.info_item .info_right {
  flex: 0 0 200px;
}

.align_left {
  text-align: left;
}

.goods_con {
  display: flex;
  box-sizing: border-box;
  align-items: center;
}

.goods_con img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}
</style>