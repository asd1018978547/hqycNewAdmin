<template>
  <div class="content_box roleadd goodsManage">
    <div class="box_top">
      <el-button type="success" size="mini" @click="jumpAdd">新增</el-button>
      <el-button
        type="warning"
        :disabled="multipleList.length != 1"
        size="mini"
        @click="jumpedit"
      >编辑</el-button>
      <el-button type="danger" :disabled="multipleList.length == 0 " size="mini" @click="delsku">删除</el-button>
      <el-button
        type="success"
        :disabled="multipleList.length == 0"
        v-show="search.Status == 0"
        size="mini"
        @click="setSku"
      >上架</el-button>
      <el-button
        type="danger"
        :disabled="multipleList.length == 0"
        v-show="search.Status == 1"
        size="mini"
        @click="setSku"
      >下架</el-button>
    </div>
    <div class="box" style="padding-top:0">
      <div class="box_left">
        <div class="title">
          商品分类
          <el-button type="text" size="mini" @click="jump">管理</el-button>
        </div>
        <div class="chebox_list">
          <el-radio-group @change="getGoodsData" v-model="search.CategoryId" size="mini">
            <p>
              <el-radio class="chebox_radio" label border size="mini">全部分类</el-radio>
            </p>
            <p v-for="(item,index) in cateList" :key="index">
              <el-radio class="chebox_radio" :label="item.Id" border size="mini">{{ item.Name }}</el-radio>
            </p>
          </el-radio-group>
        </div>
      </div>
      <div class="box_right">
        <div class="title mb">SKU列表</div>
        <div class="searchBox">
          <el-row>
            <el-col :span="5">
              <span class="timed">SKU状态：</span>
              <el-select class="search_title" v-model="search.Status" size="mini">
                <el-option label="上架" :value="1"></el-option>
                <el-option label="下架" :value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="timed">关键字/品牌：</span>
              <el-input
                clearable
                v-model="search.keys"
                class="search_title"
                size="mini"
                placeholder="请输入关键字/品牌"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <span class="timed">SN：</span>
              <el-input
                clearable
                v-model="search.sn"
                class="search_title"
                size="mini"
                placeholder="请输入备货SN"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <span class="timed">贸易类型：</span>
              <el-select class="search_title" v-model="search.tradeType" size="mini">
                <el-option label="全部" :value="''"></el-option>
                <el-option label="跨境直邮" :value="1"></el-option>
                <el-option label="保税备货" :value="2"></el-option>
                <el-option label="一般贸易" :value="3"></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button class="search_btn" @click="getGoodsData" type="success" size="mini">查询</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox" style="padding-top:0 !important;">
          <el-table
            ref="tables"
            @row-click="rowClick"
            @selection-change="changeFun"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
            :span-method="objectSpanMethod"
          >
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column label="商品信息" prop="FullCategoryName" align="center" width="650">
              <template slot-scope="scope">
                <div class="skuItem">
                  <img :src="scope.row.Images[0]" />
                  <p>
                    商品名称：{{scope.row.Title}}
                    <el-tag
                      size="mini"
                      style="margin-left:10px;"
                    >{{ scope.row.TradeType == 1 ? '跨境直邮' : scope.row.TradeType == 2 ? '保税备货' : '一般贸易' }}</el-tag>
                    <br />
                    <span class="inb_120">商品品牌：{{ scope.row.Brand }}</span>
                    商品分类：{{ scope.row.Category }}
                    <br />
                    <span class="inb_120">
                      今日热销：
                      <el-tag size="mini" v-if="scope.row.IsRecommended == 1" type="success">是</el-tag>
                      <el-tag size="mini" v-if="scope.row.IsRecommended == 0" type="danger">否</el-tag>
                    </span>
                    <span class="inb_120">
                      商品状态：
                      <el-tag size="mini" v-if="scope.row.Status == 1" type="success">上架</el-tag>
                      <el-tag size="mini" v-if="scope.row.Status == 0" type="danger">下架</el-tag>
                    </span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="条码" prop="SN" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="贸易类型" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <div v-if="scope.row.TradeType==1">跨境直邮</div>
                <div v-if="scope.row.TradeType==2">保税备货</div>
                <div v-if="scope.row.TradeType==3">一般贸易</div>
              </template>
            </el-table-column>
            <el-table-column label="规格名称" prop="std.Name" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column
              label="虚拟库存"
              prop="std.Amount"
              align="center"
              width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="零售价"
              prop="std.Price4Retail"
              align="center"
              width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="佣金类型"
              prop="std.CommissionTypeDesc"
              align="center"
              width="80"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="佣金"
              prop="std.Commission"
              align="center"
              width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="关联库房商品" align="center">
              <template slot-scope="scope">
                <p
                  v-for="(item,index) in scope.row.std.ProInfos"
                  :key="index"
                >{{ item.ProName }} × {{ item.ProCount }}</p>
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
              :total="totalRows"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      class="skulistdig"
      title="商品分类管理"
      :visible.sync="catemanagervis"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
    >
      <el-alert title="分类名称最多4个字，最多可增加5个分类" type="warning" :closable="false"></el-alert>
      <div style="margin-top:10px">
        <el-input
          v-model="add_catename"
          placeholder="请输入分类名称"
          size="mini"
          style="width:200px;margin-right:10px;"
        ></el-input>
        <el-button
          type="primary"
          @click="addcate"
          size="mini"
          :disabled="add_catename == '' || cateList.length > 4 "
        >添加</el-button>
        <el-table
          ref="tables"
          :data="cateList"
          border
          fit
          highlight-current-row
          style="margin-top:10px;"
        >
          <el-table-column label="分类名称" prop="Name" align="center">
            <template slot-scope="scope">
              <span v-if="!scope.row.edit">{{ scope.row.Name }}</span>
              <el-input v-else v-model="scope.row.Name" placeholder="请输入内容"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="scope.row.edit = true" v-if="!scope.row.edit">编辑</el-button>
              <el-button class="Success" type="text" @click="editcate(scope.row)" v-else>保存</el-button>
              <el-button class="Danger" type="text" @click="delcate(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="catemanagervis = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="catemanagervis = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
let OSS = require("ali-oss");
import {
  getskulist,
  getCategoryAll,
  setSkuOnOffLine,
  delsku,
  delcate,
  updatecate
} from "@/api/Partner/sku";
export default {
  data() {
    return {
      add_catename: "",
      multipleList: [],
      search: {
        sn: "",
        Status: 1,
        tradeType: "",
        keys: "",
        CategoryId: ""
      },
      catemanagervis: false,
      list: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      cateList: [],
      roleBtn: [],
      defaultProps: {
        children: "ChildMenu",
        label: "Name",
        isLeaf: "IsLeaf"
      }
    };
  },
  activated() {
    this.CurCode = "";
    this.getGoodsData();
    this.getcate();
  },
  methods: {
    jumpAdd() {
      let name;
      this.cateList.map(item => {
        if (item.Id == this.search.CategoryId) {
          name = item.Name;
        }
      });
      this.$router.push({
        path: "/partneraddsku",
        query: {
          name
        }
      });
    },
    jumpedit() {
      this.$router.push({
        path: "/partneraddsku",
        query: {
          id: this.multipleList[0].Id,
          name: this.multipleList[0].Category
        }
      });
    },
    delcate(row) {
      this.$confirm("确定要删除这个分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        delcate({
          id: row.Id
        }).then(() => {
          this.$message.success("删除成功");
          this.getcate();
        });
      });
    },
    editcate(row) {
      if (row.Name.length > 4) {
        this.$message.error("分类名称超长");
        return;
      }
      updatecate({
        pid: row.Pid,
        id: row.Id,
        name: row.Name
      }).then(res => {
        this.$message.success("修改成功");
        this.getcate();
      });
    },
    addcate() {
      if (this.add_catename.length > 4) {
        this.$message.error("分类名称超长");
        return;
      }
      updatecate({
        pid: 0,
        id: 0,
        name: this.add_catename
      }).then(res => {
        this.$message.success("新增成功");
        this.add_catename = "";
        this.getcate();
      });
    },
    setSku() {
      let ids = [];
      this.multipleList.map(v => {
        ids.push(v.Id);
      });
      ids = ids.join(",");
      setSkuOnOffLine({
        Ids: ids
      }).then(() => {
        this.$message.success("设置成功");
        this.getGoodsData();
      });
    },
    delsku() {
      this.$confirm("确定要删除这些商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        let ids = [];
        this.multipleList.map(v => {
          ids.push(v.Id);
        });
        ids = ids.join(",");
        delsku({ ids }).then(() => {
          this.$message.success("删除成功");
          this.getGoodsData();
        });
      });
    },
    getcate() {
      getCategoryAll().then(res => {
        this.cateList = res;
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 || columnIndex == 1) {
        if (rowIndex == 0) {
          return {
            rowspan: row.Standards.length,
            colspan: 1
          };
        } else if (this.list[rowIndex - 1].Id === row.Id) {
          return [0, 0];
        } else {
          return {
            rowspan: row.Standards.length,
            colspan: 1
          };
        }
      }
    },
    rowClick(row) {
      this.$refs.tables.toggleRowSelection(row);
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
    changeFun(val) {
      this.multipleList = val;
    },
    reSearch() {
      this.getGoodsData();
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getGoodsData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getGoodsData();
    },
    jump() {
      this.catemanagervis = true;
    },
    getGoodsData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      });
      getskulist(p).then(res => {
        let arr = [];
        res.Data.map(v => {
          v.Standards.map(vs => {
            let o = JSON.parse(JSON.stringify(v));
            o.std = vs;
            arr.push(o);
          });
        });
        this.list = arr;
        this.list.forEach(element => {
          if (element.Images[0].indexOf("/u/") != -1) {
            let newImage = element.Images[0].substring(
              element.Images[0].indexOf("/u/"),
              element.Images[0].length
            );
            let signUrl = window.ali_oss_data.URL_IMG_SHOW + newImage;
            element.Images[0] = signUrl;
          } else {
            let signUrl = window.ali_oss_data.URL_IMG_SHOW + element.Images[0];
            element.Images[0] = signUrl;
          }
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
  display: flex;
  min-height: calc(100vh - 84px);
  padding: 20px 0;
  box-sizing: border-box;
  width: 100%;
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
  border-left: none;
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