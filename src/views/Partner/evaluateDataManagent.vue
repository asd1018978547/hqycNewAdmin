<template>
  <div class="content_box roleadd goodsManage">
    <div class="box" style="padding-top:0">
      <div class="box_right">
        <div class="title mb">商品评价管理</div>
        <div class="searchBox">
          <el-row>
            <el-col :span="5">
              <span class="timed">评价标签：</span>
              <el-select class="search_title" v-model="search.IsIncludeImage" size="mini">
                <el-option label="全部" :value="0"></el-option>
                <el-option label="有图" :value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="10">
              <span class="timed">商品名称：</span>
              <el-input
                style="margin-left:10px;"
                clearable
                v-model="search.keys"
                class="search_title"
                size="mini"
                placeholder="请输入商品名称"
              ></el-input>
              <el-button class="search_btn" @click="getdata" type="success" size="mini">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox" style="padding-top:0 !important;">
          <el-table ref="tables" :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
            <el-table-column label="订单编号" prop="OrderCode" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="商品名称" prop="SKUName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名" prop="CustomerName" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="是否匿名" prop="FinalMoney" align="center" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.IsAnonymous == 1 ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column label="评分" prop="Stars" align="center" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.Stars }}星</template>
            </el-table-column>
            <el-table-column label="评价内容" prop="Comment" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column
              label="图片信息"
              prop="Images"
              align="center"
              show-overflow-tooltip
              width="300"
            >
              <template slot-scope="scope">
                <img
                  @click="jumpbigimg(item)"
                  class="img_item"
                  v-for="(item,index) in scope.row.Images"
                  :src="item"
                  :key="index"
                />
              </template>
            </el-table-column>
            <el-table-column label="评价时间" prop="DateAdded" align="center" show-overflow-tooltip></el-table-column>
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
              :total="totalRows"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import { getSkuCommentList } from "@/api/Partner/SupplierCustomer";
import { formatDateTime } from "@/utils/index";
export default {
  data() {
    return {
      search: {
        keys: "",
        IsIncludeImage: 0
      },
      list: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0
    };
  },
  activated() {
    this.getdata();
  },
  methods: {
    jumpbigimg(row) {
      window.open(row, "_blank");
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getdata();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getdata();
    },
    getdata() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      getSkuCommentList(p).then(res => {
        res.Data.map(v => {
          v.DateAdded = formatDateTime(v.DateAdded);
        });
        this.list = res.Data;
        this.list.forEach(element => {
          element.Images = element.Images.map(item => {
            if (item.indexOf("/u/") != -1) {
              let newImage = item.substring(item.indexOf("/u/"), item.length);
              let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
              return (item = signUrl);
            } else if (item.indexOf("http") != -1) {
              return item;
            } else {
              let signUrl = window.ali_oss_data.URL_IMG_SHOW + item;
              return (item = signUrl);
            }
          });
        });
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    }
  }
};
</script>
<style>
.skulistdig .el-dialog__body {
  padding: 10px 20px !important;
}
</style>
<style scoped lang="scss">
.img_item {
  width: 30px;
  height: 40px;
  cursor: pointer;
  margin-right: 10px;
}
.chebox_list {
  padding: 0 10px;
}
.chebox_list p,
.el-radio-group,
.chebox_list .chebox_radio {
  width: 100%;
}
.inb_120 {
  display: inline-block;
  width: 120px;
}
.box_top {
  height: 50px;
  line-height: 50px;
}
.a_load {
  color: #00abff;
  padding: 0 15px;
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
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.box {
  min-height: calc(100vh - 84px);
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
  margin-top: 10px;
}

.box_left {
  flex: 0 0 150px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}
.content_box {
  width: 100%;
  box-sizing: border-box;
}
.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  box-sizing: border-box;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
  box-sizing: border-box;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
}

.skuItem {
  display: flex;
}

.skuItem img {
  width: 80px;
  height: 80px;
  border: 1px solid #eee;
}

.skuItem p {
  line-height: 25px;
  padding-left: 10px;
  text-align: left;
  margin: 0;
}

.mb {
  margin-bottom: 5px;
}
</style>