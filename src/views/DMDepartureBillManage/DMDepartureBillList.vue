<template>
  <div class="content_box">
    <el-button
      type="primary"
      @click="toCreated"
      size="small"
      style="float:right;margin-top:10px"
    >新增直邮打包单</el-button>
    <m-title title="直邮打包单管理"></m-title>
    <!-- 搜索盒子 -->
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">报关订单号：</span>
          <el-input
            v-model="search.OutTradeNo"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入报关订单号"
            maxlength="30"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">总运单号：</span>
          <el-input
            v-model="search.AlwaysAwbstring"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入总运单号"
            maxlength="30"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <span class="timed">航班航次号：</span>
          <el-input
            v-model="search.VoyageNo"
            clearable
            class="search_title"
            size="small"
            placeholder="请输入航班航次号"
            maxlength="30"
          ></el-input>
        </el-col>
        <el-button
          type="primary"
          @click="Search"
          icon="el-icon-search"
          size="small"
          style="margin-left:20px"
        >查询</el-button>
      </el-row>
    </div>

    <!-- 表单盒子 -->
    <div class="list_box">
      <el-table border :data="tableData">
        <el-table-column prop="id" label="直邮打包单编号" align="center"></el-table-column>
        <el-table-column prop="CustomsCode" label="关区代码" align="center"></el-table-column>
        <el-table-column prop="StartCountry" label="起运国" align="center"></el-table-column>
        <el-table-column prop="AlwaysAwb" label="总运单号" align="center"></el-table-column>
        <el-table-column prop="VoyageNo" label="航班航次号" align="center"></el-table-column>
        <el-table-column prop="DateAdded" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="StatusDesc" label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="scope">
            <span @click="jumpToSB(scope.row)" class="blue">申报</span>
            <span
              @click="jump(scope.row)"
              class="blue"
              v-if="scope.row.StatusDesc=='初始'||scope.row.StatusDesc=='申报失败'"
            >编辑</span>
            <span @click="jumpToDetail(scope.row)" class="blue">详情</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页器 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.pageIndex"
        :page-sizes="[15,30,50,100]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  getDMList,
  createDM,
  delDM,
  editDMList,
  getDMDetail
} from "../../api/order/DMDeparture";
import MTitle from "@/components/MTitle";
import moment from "moment";
export default {
  components: { MTitle },
  data() {
    return {
      tableData: [],
      search: {
        //报关订单号
        OutTradeNo: "",
        AlwaysAwbstring: "",
        VoyageNo: "",
        pageIndex: 1,
        pageSize: 15
      },
      TotalRows: 0,
      TotalPage: 0
    };
  },
  methods: {
    jumpToSB() {},
    jumpToDetail(val) {
      this.$router.push({ path: "/DMDetail", query: { id: val.Id } });
    },
    toCreated() {
      this.$router.push({ path: "/createDM" });
    },
    jump(val) {
      this.$router.push({ path: "/createDM", query: { id: val.Id } });
    },
    Search() {
      this.search.pageIndex = 1;
      this.getData();
    },

    //获取全部数据
    getData() {
      getDMList(this.search).then(res => {
        this.tableData = res.Data;
        this.PageIndex = res.PageIndex;
        this.TotalRows = res.TotalRows;
        this.TotalPage = res.TotalPage;
      });
    },

    //分页相关
    handleSizeChange(v) {
      this.search.pageSize = v;
      this.getData();
    },
    handleCurrentChange(v) {
      this.search.pageIndex = v;
      this.getData();
    }
  },
  mounted() {
    //获取全部数据
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