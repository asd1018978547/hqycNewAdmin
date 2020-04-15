<!--商品批次库存管理 -->
<template>
  <div class="adv content_box">
    <m-title title="商品批次库存管理"></m-title>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="2">保税备货</el-menu-item>
      <el-menu-item index="1">跨境直邮</el-menu-item>
    </el-menu>
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">商品ID：</span>
          <el-input
            class="search_title"
            v-model="search.outRecordProductId"
            size="small"
            placeholder="请输入商品ID"
            clearable
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">商品条码：</span>
          <el-input
            class="search_title"
            v-model="search.sn"
            size="small"
            placeholder="请输入商品条码"
            clearable
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">商品名称：</span>
          <el-input
            class="search_title"
            v-model="search.name"
            size="small"
            placeholder="请输入商品名称"
            clearable
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">批次号：</span>
          <el-input
            class="search_title"
            v-model="search.batchNo"
            size="small"
            placeholder="请输入批次号"
            clearable
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="4">
          <el-button
            size="small"
            type="primary"
            @click="getsearch"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            size="small"
            type="primary"
            @click="getExcel"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-download"
          >导出</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table border :data="tableData">
      <el-table-column prop="OutRecordProductId" label="商品ID" align="center"></el-table-column>
      <el-table-column prop="SN" label="商品条码" align="center"></el-table-column>
      <el-table-column prop="Name" label="商品名称" align="center"></el-table-column>
      <el-table-column prop="OccupyQty" label="订单占用批次库存" align="center"></el-table-column>
      <el-table-column prop="BatchQty" label="批次库存" align="center"></el-table-column>
      <el-table-column prop="BatchNo" label="批次号" align="center"></el-table-column>
      <el-table-column label="效期" align="center">
        <template slot-scope="scope">
          <div class="time">{{scope.row.ExpireDate}}</div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <div class="time">{{scope.row.DateAdded}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align='center' width="180" >
        <template slot-scope="scope">
          <span  @click="detail(scope.row)" class="blue" >查看详情</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:right;margin-top:10px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15, 50, 100, 200]"
      :page-size="15"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow"
    ></el-pagination>
    <div class="clearfix"></div>
  </div>
</template>
<script>
import MTitle from "@/components/MTitle";
import {getPCList,getPCExcelList} from "@/api/goodsStockManage/goodsStockManage";
export default {
  components: { MTitle },
  data() {
    return {
      defaultActive: "2",
      tableData: [],
      search: {
        outRecordProductId: "",
        sn: "",
        name: "",
        batchNo: ""
      },
      currentPage: 1,
      totalRow: 0,
      totalPage: 0,
      pageSize: 15,
      pageIndex: 1,
      status: 2,
      roleBtn: [],
    };
  },
  activated() {
    this.getData();
  },
  created() {
    // this.search.outRecordProductId = this.$route.query.id;
    this.search.outRecordProductId = this.$route.params.id;
  },
  methods: {
    getsearch() {
      this.pageIndex = 1;
      this.getData();
    },
    // 分页相关
    handleSizeChange(v) {
      this.pageSize = v;
      this.getData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getData();
    },
    // 标签选择
    handleSelect(v) {
      this.status = v;
      this.getData();
    },
    //导出Excel
    getExcel() {
      const Loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0.7)"
      });
      let par = {
        outRecordProductId: this.search.outRecordProductId,
        tradeType: this.status,
        sn: this.search.sn,
        name: this.search.name,
        batchNo: this.search.batchNo
      };
      getPCExcelList(par)
        .then(res => {
          Loading.close();
          const href = window._config.fileServer + res.fileName;
          window.open(href);
        })
        .catch(() => {
          Loading.close();
        });
    },
    //获取数据
    getData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        tradeType: this.status
      });
      getPCList(p).then(res => {
        console.log(res);
        this.currentPage = res.PageIndex;
        this.totalPage = res.TotalPages;
        this.totalRow = res.TotalRows;
        this.tableData = res.Data;
      });
    },
    detail(row){
      //跳转批次库存管理
      this.$router.push({
        path: '/batchStockDetail',
        query: {
          id:row.Id
        }
      })
    }
  }
};
</script>

<style scoped>
.blue {
  color: #409eff;
  cursor: pointer;
}
</style>