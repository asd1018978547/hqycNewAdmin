<template>
  <div class="content_box">
    <div class="searchBox">
      <el-row>
        <!-- 退款方式 -->
        <el-col :span="4">
          <span class="timed">退款方式：</span>
          <el-select
            size="small"
            placeholder="请选择退款方式"
            v-model="search.RefundMethodCode"
            @change="changeMethod"
            clearable 
          >
            <el-option
              v-for="(item,index) in searchList"
              :key="index"
              :label="item.RefundMethodDesc"
              :value="item.RefundMethodCode"
            ></el-option>
          </el-select>
        </el-col>
        <!-- 退款原因 -->
        <el-col :span="7">
          <span class="timed">退款原因：</span>
          <el-select size="small" placeholder="请选择退款原因" clearable  v-model="search.RefundReasonCode">
            <el-option
              v-for="(item,index) in reasonsList"
              :key="index"
              :label="item.RefundReasonDesc"
              :value="item.RefundReasonCode"
            ></el-option>
          </el-select>
          <el-button
            size="small"
            type="primary"
            @click="searchRule"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            @click="jumpAdd(1)"
            class="pan-btn green-btn"
            type="success"
            size="mini"
            icon="el-icon-plus"
          >新增规则</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table border :data="tableDate">
      <el-table-column :show-overflow-tooltip="true" label="序号" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.Id }}</p>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" label="退款方式" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.RefundMethodDesc }}</p>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" label="退款原因" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.RefundReasonDesc}}</p>
        </template>
      </el-table-column>

      <el-table-column :show-overflow-tooltip="true" label="说明" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.RefundReasonExplain }}</p>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-button
            style="margin-bottom: 10px;"
            @click="jumpAdd(scope.row)"
            type="primary"
            size="small"
          >编辑</el-button>
          <br />
          <el-button
            style="margin-bottom: 10px;"
            @click="delRule(scope.row)"
            type="danger"
            size="small"
          >删除</el-button>
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
      :total="TotalRows"
    ></el-pagination>
  </div>
</template>

<script>
import {
  search,
  getRuleData,
  delRule
} from "../../api/afterSaleRuleManage/index";
export default {
  data() {
    return {
      search: {
        RefundMethodCode: "", //退款方式
        RefundReasonCode: "" //退款原因
      },
      searchList: [],
      tableDate: [],
      reasonsList: [],
      currentPage: 1,
      TotalRows: 0,
      TotalPage: 0,
      pageSize: 15,
      pageIndex: 1
    };
  },
  activated() {
    this.getAllData();
    this.getRuleData();
  },
  created() {
    this.getAllData();
    this.getRuleData();
  },
  methods: {
    //获取搜索数据
    getAllData() {
      const p = { refundType: 2 };
      search(p).then(res => {
        this.searchList = res;
      });
    },
    //获取规则数据
    getRuleData(p) {
      getRuleData(p).then(res => {
        this.tableDate = res.Data;
        this.pageIndex = res.PageIndex;
        this.TotalPage = res.TotalPage;
        this.TotalRows = res.TotalRows;
      });
    },
    //搜索
    searchRule() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        token: localStorage.Token
      });
      this.getRuleData(p);
    },
    searchAllRule() {    
      const p = { pageIndex: this.pageIndex, pageSize: this.pageSize, token: localStorage.Token }
      this.getRuleData(p);
    },
    //改变一级菜单状态联动二级
    changeMethod(e) {
      if(e == ''){
        this.reasonsList=[]
        this.search.RefundReasonCode = ""
      }
      this.search.refundMethod = e;
      this.searchList.map(item => {
        if (item.RefundMethodCode == e) {
          this.reasonsList = item.RefundOrderReasons;
        }
      });
    },
    // 分页相关
    handleSizeChange(v) {
      this.pageSize = v;
      this.getRuleData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getRuleData();
    },
    //删除
    delRule(row) {
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const p = { ruleId: row.Id, token: localStorage.Token };
          delRule(p).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getAllData();
            this.getRuleData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //跳转新增或编辑
    jumpAdd(data) {
      if (typeof data !== "object") {
        this.$router.push({
          path: "/addRule",
          query: {
            id: -1
          }
        });
      } else {
        this.$router.push({
          path: "/addRule",
          query: {
            id: data.Id
          }
        });
      }
    }
  },
  computed: {
    selection: function() {
      var that = this;
      return this.item.filter(item => {
      });
    }
  }
};
</script>

<style>
</style>