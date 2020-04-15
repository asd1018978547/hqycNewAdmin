<template>
  <div class="adv content_box">
    <m-title title="商品库存管理"></m-title>
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
          <span class="timed">品牌：</span>
          <el-select
            v-model="search.brandCode"
            class="search_title"
            size="small"
            placeholder="请选择品牌"
            clearable
          >
            <el-option
              v-for="(item,index) in brandList"
              :key="index"
              :label="item.Name"
              :value="item.Code"
            ></el-option>
          </el-select>
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
      <el-table-column prop="BrandName" label="品牌" align="center"></el-table-column>
      <el-table-column prop="AvailableQty" label="可售库存" align="center"></el-table-column>
      <el-table-column prop="OrderOccupyQty" label="订单占用库存" align="center"></el-table-column>
      <el-table-column prop="SPOrderOccupyQty" label="SP订单占用库存" align="center"></el-table-column>
      <!-- <el-table-column prop="Plateform" label="渠道锁定库存" align='center'></el-table-column> -->
      <el-table-column label="财务库存" align="center">
        <template slot-scope="scope">
          <span @click="jump(scope.row)" class="blue">{{ scope.row.FinanceQty }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ShortsQty" label="短装库存" align="center"></el-table-column>
      <el-table-column prop="OverQty" label="溢装库存" align="center"></el-table-column>
      <el-table-column prop="DamageQty" label="破损库存" align="center"></el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <div class="time">{{scope.row.DateAdded}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align='center' width="180" >
        <template slot-scope="scope">
          <el-button  @click="edit(scope.row)" type="primary" size="small" class="pan-btn blue-btn" icon="el-icon-edit">设置渠道锁定库存</el-button>
        </template>
      </el-table-column>-->
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
import { getList, getExcel } from "@/api/goodsStockManage/goodsStockManage";
import { getBrandList } from "@/api/brand/index";
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
        brandCode: "",
        tradeType: ""
      },
      options2: [],
      currentPage: 1,
      totalRow: 0,
      roleBtn: [],
      totalPage: 0,
      status: 2,
      pageSize: 15,
      pageIndex: 1,
      brandList: []
    };
  },
  created() {
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  activated() {
    this.getBrand();
    this.getData();
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
        brandCode: this.search.brandCode
      };
      getExcel(par)
        .then(res => {
          Loading.close();
          const href = window._config.fileServer + res.fileName;
          window.open(href);
        })
        .catch(() => {
          Loading.close();
        });
    },
    //跳转批次库存管理
    jump(data) {
      this.$router.push({
        name: "goodsBatchStockManage",
        params: { id: data.OutRecordProductId }
      });
      // this.$router.push({
      //   path: "/goodsBatchStockManage",
      //   query: {
      //     id: data.OutRecordProductId
      //   }
      // });
    },
    //获取数据
    getData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        tradeType: this.status
      });
      getList(p).then(res => {
        this.currentPage = res.PageIndex;
        this.totalPage = res.TotalPages;
        this.totalRow = res.TotalRows;
        this.tableData = res.Data;
      });
    },
    //品牌列表
    getBrand() {
      getBrandList({ InUse: 1, pageSize: 9999 }).then(res => {
        this.brandList = res.Data;
      });
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