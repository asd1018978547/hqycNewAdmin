<template>
  <div class="content_box">
    <m-title title="商户认证管理"></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">商户编号：</span>
          <el-input
            v-model="search.number"
            class="search_title"
            clearable
            size="mini"
            placeholder="请输入商户编号"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">认证类型：</span>
          <el-select
            class="search_title"
            v-model="search.authType"
            size="mini"
            placeholder="请选择认证状态"
          >
            <el-option
              v-for="item in authTypeList"
              :key="item.id"
              :label="item.desc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span='4'>
          <span class="timed">联系人手机：</span>
          <el-input v-model='search.phone' class="search_title" clearable size='mini' placeholder="请输入联系人手机">
          </el-input>
        </el-col>-->
        <el-col :span="4">
          <span class="timed">认证状态：</span>
          <el-select class="search_title" v-model="search.status" size="mini" placeholder="请选择认证状态">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.desc"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="timed">认证时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.dateRange1"
            class="search_time"
            size="mini"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button
            v-if="checkBtn('func_common_search')"
            class="search_btn"
            @click="getData"
            type="success"
            size="mini"
          >查 询</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="list_box">
      <el-table :data="list" border fit highlight-current-row style="width: 100%">
        <el-table-column label="申请时间" prop="DateAdded" align="center" width="250"></el-table-column>
        <el-table-column label="商户编号" prop="UserAdded" align="center" width="130"></el-table-column>
        <!-- <el-table-column label='联系人手机' prop='Phone' align='center'></el-table-column> -->
        <el-table-column label="认证类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.AuthType==1">微商代购</span>
            <span v-if="scope.row.AuthType==2">网络店铺</span>
            <span v-if="scope.row.AuthType==3">实体门店</span>
            <span v-if="scope.row.AuthType==4">网络平台</span>
            <span v-if="scope.row.AuthType==7">批采企业</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="130" align="center">
          <template slot-scope="scope">
            <el-tag :type="getTag(scope.row.Status)">{{scope.row.StatusDesc}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              class="pan-btn green-btn"
              type="success"
              @click="jumpDesc(scope.row)"
              size="mini"
              icon="el-icon-view"
            >查看</el-button>
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
          :total="totalRow"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import MTitle from "@/components/MTitle";
import { PKoptions } from "@/assets/pickerOptions";
import { getAuthList } from "@/api/retailer";
export default {
  components: { MTitle },
  data() {
    return {
      pickerOptions: PKoptions,
      pageSize: 15,
      totalRow: 0,
      pageIndex: 1,
      list: [],
      authTypeList: [
        { id: -1, desc: "全部" },
        { id: 1, desc: "微商代购" },
        { id: 2, desc: "网络店铺" },
        { id: 3, desc: "实体门店" },
        { id: 4, desc: "网络平台" },
        { id: 7, desc: "批采企业" }
      ],
      statusList: [
        { id: -1, desc: "全部" },
        { id: 0, desc: "待审核" },
        { id: 1, desc: "审核通过" },
        { id: 2, desc: "拒绝" }
      ],
      roleBtn: [],
      search: {
        authType: -1,
        number: "",
        phone: "",
        status: 0,
        dateRange1: ""
      }
    };
  },
  activated() {
    this.getData();
  },
  created() {
    this.getData();
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    this.roleBtn.map(v => {});
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
    jumpDesc(row) {
      this.$router.push({
        path: "/retailerAuthDesc/" + row.Id
      });
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getData();
    },
    getTag(code) {
      if (code === 0) {
        return "warning";
      } else if (code === 1) {
        return "success";
      } else if (code === 2) {
        return "danger";
      } else {
        return "";
      }
    },
    getData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      if (
        p.dateRange1 &&
        p.dateRange1.length === 2 &&
        p.dateRange1[1].indexOf("23:59:59") === -1
      ) {
        p.dateRange1[1] += " 23:59:59";
      }
      getAuthList(p).then(res => {
        this.list = res.Data.map(v => {
          v.DateAdded = v.DateAdded.replace("T", " ");
          v.Status = parseInt(v.Status);
          return v;
        });
        this.totalRow = res.TotalRows;
        this.pageIndex = res.PageIndex;
      });
    }
  }
};
</script>