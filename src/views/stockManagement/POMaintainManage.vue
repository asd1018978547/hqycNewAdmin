<template>
  <div class="content_box">
    <m-title title="PO单管理"></m-title>
    <!-- 搜索盒子 -->
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">系统编号：</span>
          <el-input
            v-model="search.SysNo"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入调拨单号"
            maxlength="30"
          ></el-input>
        </el-col>

        <el-col :span="4">
          <span class="timed">状态：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.Status"
            size="small"
            placeholder="请选择状态"
          >
            <el-option label="所有" :value="999"></el-option>
            <el-option label="初始" :value="0"></el-option>
            <el-option label="待审核" :value="1"></el-option>
            <el-option label="已审核" :value="2"></el-option>
            <el-option label="已清点" :value="3"></el-option>
            <el-option label="申报中" :value="4"></el-option>
            <el-option label="完成" :value="5"></el-option>
            <el-option label="取消" :value="-1"></el-option>
            <el-option label="审核拒绝" :value="-2"></el-option>
            <el-option label="申报失败" :value="-3"></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">备货方式：</span>
          <el-select
            class="search_title"
            clearable
            v-model="search.GoodsStockUpWay"
            size="small"
            placeholder="请选择备货方式"
          >
            <el-option label="所有" :value="-1"></el-option>
            <el-option label="商户自行备货" :value="1"></el-option>
            <el-option label="海外仓集货" :value="2"></el-option>
          </el-select>
        </el-col>

        <el-col :span="5">
          <span class="timed">创建时间：</span>
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="search.DateRange"
            class="search_time"
            size="small"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-col>
        <el-button
          style="margin-left:10px"
          size="mini"
          type="primary"
          @click="Search"
          icon="el-icon-search"
          >查询</el-button
        >
      </el-row>
      <el-button
        style="margin-left:10px"
        size="mini"
        type="primary"
        @click="creatPOList"
        icon="el-icon-plus"
        >新建PO单</el-button
      >
    </div>

    <!-- 表单盒子 -->
    <div class="list_box">
      <el-table border :data="tableData">
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row" class="blue" @click="jump(scope.row)"
              >编辑</span
            >
            <span
              v-if="
                scope.Status == 0 || scope.Status == -2 || scope.Status == -3
              "
              class="blue"
              @click="jump(scope.row)"
              >推送</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="SysNo"
          label="PO单编号"
          align="center"
        ></el-table-column>
        <el-table-column label="商户名称" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row">环球云仓</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" align="center"
          ><template slot-scope="scope">
            <span v-if="scope.row">成都澳蓉金二仓</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="SumQuantity"
          label="总数量"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="SumPrice"
          label="总金额"
          align="center"
        ></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.Status === 0">初始</span>
            <span v-if="scope.row.Status === 1">待审核</span>
            <span v-if="scope.row.Status === 2">已审核</span>
            <span v-if="scope.row.Status === 3">已清点</span>
            <span v-if="scope.row.Status === 4">申报中</span>
            <span v-if="scope.row.Status === 5">完成</span>
            <span v-if="scope.row.Status === -1">取消</span>
            <span v-if="scope.row.Status === -2">审核拒绝</span>
            <span v-if="scope.row.Status === -3">申报失败</span>
          </template>
        </el-table-column>
        <el-table-column label="备货方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.GoodsStockUpWay == '1'">商户自行备货</span>
            <span v-if="scope.row.GoodsStockUpWay == '2'">海外仓集货</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="AssBillNo"
          label="提运单号"
          align="center"
        ></el-table-column>
        <el-table-column label="库存核增时间" align="center">
          <template slot-scope="scope">
            <div class="time">{{ scope.row.DateModified }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="DateAdded"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="DateModified"
          label="审核时间"
          align="center"
        ></el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.pageIndex"
        :page-sizes="[15, 30, 50, 100]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { PKoptions } from "@/assets/pickerOptions";
import { getList } from "../../api/stockManagement/PO";
import { formatDateTime, parseTime } from "@/utils/index";
import MTitle from "@/components/MTitle";
import moment from "moment";
export default {
  components: { MTitle },
  data() {
    return {
      DateRange1: [], // 下单时间
      roleBtn: [],
      tableData: [],
      pickerOptions: PKoptions,
      WarehouseList: [],
      search: {
        SysNo: "",
        Status: 999,
        GoodsStockUpWay: -1,
        DateRange: [],
        pageIndex: 1,
        pageSize: 15
      },
      TotalRows: 0,
      TotalPage: 0
    };
  },
  methods: {
    creatPOList() {
      this.$router.push({ path: "/creatPOList" });
    },
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },

    //分页相关
    handleSizeChange(v) {
      this.search.pageSize = v;
      this.getData();
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v;
      this.getData();
    },
    Search() {
      this.search.pageIndex = 1;
      this.getData();
    },
    //跳转详情
    jump(row) {
      this.$router.push({
        path: "/PODetail",
        query: {
          id: row.Id
        }
      });
    },
    del(row) {
      this.$confirm("确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        del({ allocationNo: row.AllocationNo }).then(res => {
          this.$message.success("删除成功！");
          this.getData();
        });
      });
    },
    add() {
      this.$router.push({ path: "/addAllocationBill" });
    },
    //获取全部数据
    getData() {
      let par = JSON.parse(JSON.stringify(this.search));

      console.log(par, "par");
      getList(par).then(res => {
        this.tableData = res.Data;
        this.PageIndex = res.PageIndex;
        this.TotalRows = res.TotalRows;
        this.TotalPage = res.TotalPage;
      });
    }
  },
  created() {
    //获取全部数据
    this.getData();
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  activated() {
    this.getData();
  }
};
</script>
<style>
.order_top .el-tabs__nav-wrap {
  height: 60px;
}
.order_top .el-tabs__nav-scroll {
  margin-top: 10px;
  overflow: visible;
}
</style>

<style lang="scss" scoped>
.blue {
  color: #409eff;
  cursor: pointer;
}
.marginBottom {
  margin-bottom: 20px;
}
.fz14 {
  font-size: 14px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
}

.align_left {
  text-align: left;
}

.goods_con {
  display: flex;
  box-sizing: border-box;
  align-items: center;

  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.choice_group {
  width: 100%;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;

  .input_group {
    flex: 1;
  }

  #fileEl {
    position: absolute;
    width: 265px;
    height: 36px;
    left: 0;
    top: 0;
    z-index: 10;
    opacity: 0;
  }

  .file_text {
    width: 265px;
    height: 36px;
    border: 1px solid #eee;
    border-radius: 2px;
    margin-right: 10px;
    box-sizing: border-box;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon-circle-close {
    cursor: pointer;
    font-size: 15px;
    position: relative;
    left: -32px;
    color: #aaa;
    z-index: 10000;
  }

  .pan-btn {
    padding: 10px 20px;
  }
}

p {
  margin: 0;
  margin-top: 5px;
  margin-bottom: 5px;
}

.list_box {
  .btn_group {
    .btn_item {
      padding: 10px 0;
      border-top: 1px solid #eee;

      .pan-btn {
        line-height: 1.5;
      }
    }
  }
}

.text_center {
  text-align: center;
}

.size14 {
  font-size: 14px;
  line-height: 1.5;
}
</style>
