<template>
  <div class="content_box roleadd goodsManage">
    <div class="box">
      <div class="box_left">
        <div class="title">
          商品类别
          <el-button type="text" size="mini" @click="jump">新增类别</el-button>
        </div>
        <el-tree
          accordion
          @node-click="getGoodsData"
          :highlight-current="1 === 1"
          :data="typelist"
          :load="loadNode"
          lazy
          :props="defaultProps"
          ref="tree"
        ></el-tree>
      </div>
      <div class="box_right">
        <div class="title">商品管理</div>
        <div class="searchBox">
          <el-row>
            <el-col :span="5">
              <span class="timed">商品编码：</span>
              <el-input
                clearable
                v-model="search.goodsCode"
                class="search_title"
                size="small"
                placeholder="请输入商品编码"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <span class="timed">商品条码：</span>
              <el-input
                clearable
                v-model="search.sn"
                class="search_title"
                size="small"
                placeholder="请输入商品条码"
              ></el-input>
            </el-col>
            <el-col :span="5">
              <span class="timed">商品名称：</span>
              <el-input
                clearable
                v-model="search.name"
                class="search_title"
                size="small"
                placeholder="请输入商品名称"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5">
              <span class="timed">品牌：</span>
              <el-select
                class="search_title"
                filterable
                clearable
                v-model="search.brandCode"
                size="small"
                placeholder="请选择品牌"
              >
                <el-option
                  v-for="(item,index) in brandList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="5">
              <span class="timed">原产地：</span>
              <el-select
                class="search_title"
                filterable
                clearable
                v-model="search.originCode"
                size="small"
                placeholder="请选择原产地"
              >
                <el-option
                  v-for="item in originList"
                  :key="item.Code"
                  :label="item.NameCN"
                  :value="item.Code"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button
                v-if="checkBtn('func_common_search')"
                class="search_btn pan-btn green-btn"
                @click="searchData"
                type="success"
                size="mini"
                icon="el-icon-search"
              >查询</el-button>
              <el-button
                v-if="checkBtn('func_common_reset')"
                class="search_btn pan-btn tiffany-btn"
                @click="reSearch"
                type="info"
                size="mini"
                icon="el-icon-refresh"
              >重置搜索条件</el-button>
              <el-button
                v-if="checkBtn('func_common_add')"
                @click="jumpAdd(1)"
                class="pan-btn green-btn"
                type="success"
                size="mini"
                icon="el-icon-plus"
              >添加商品</el-button>
              <el-button
                v-if="checkBtn('func_common_export')"
                @click="exportGoods"
                class="pan-btn blue-btn"
                type="primary"
                size="mini"
                icon="el-icon-download"
              >导出商品</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="searchBox">
          <el-table :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column
              label="ID"
              prop="Id"
              align="center"
              width="90"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="商品条码"
              prop="SN"
              align="center"
              width="120"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="HSCode"
              prop="HSCode"
              align="center"
              width="120"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="商品中文名称"
              prop="NameCN"
              align="center"
              width="220"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="商品英文名称"
              prop="NameEN"
              align="center"
              width="220"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="商品类别"
              prop="FullCategoryName"
              align="center"
              width="150"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="原产地"
              prop="OriginName"
              align="center"
              width="100"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              label="品牌"
              prop="BrandName"
              align="center"
              width="100"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="规格型号" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.Childs.length > 1" class="goods_tag">
                  <el-tag
                    v-for="item in scope.row.Childs"
                    :key="item.Id"
                    size="mini"
                  >{{ item.Standard }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="200">
              <template slot-scope="scope">
                <div>
                  保税备货（
                  <span v-if="scope.row.BondedEntryStatus == -1">未备案</span>
                  <span v-if="scope.row.BondedEntryStatus == 0">备案中</span>
                  <span v-if="scope.row.BondedEntryStatus == 1">已备案</span>
                  <span v-if="scope.row.BondedEntryStatus == 2">备案失败</span>）
                  <span
                    title="点击备案"
                    v-if="scope.row.BondedEntryStatus == -1||scope.row.BondedEntryStatus == 2"
                    style="color:#00b0ff;cursor:pointer"
                    @click="Filing(scope.row.Id,'2')"
                  >备案</span>
                </div>
                <div>
                  跨境直邮（
                  <span v-if="scope.row.DMEntryStatus == -1">未备案</span>
                  <span v-if="scope.row.DMEntryStatus == 0">备案中</span>
                  <span v-if="scope.row.DMEntryStatus == 1">已备案</span>
                  <span v-if="scope.row.DMEntryStatus == 2">备案失败</span>）
                  <span
                    v-if="scope.row.DMEntryStatus == -1||scope.row.DMEntryStatus == 2"
                    title="点击备案"
                    style="color:#00b0ff;cursor:pointer"
                    @click="Filing(scope.row.Id,'1')"
                  >备案</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
              <template slot-scope="scope">
                <el-button
                  v-if="checkBtn('func_common_edit')"
                  class="pan-btn blue-btn"
                  type="primary"
                  @click="jumpAdd(scope.row)"
                  size="mini"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  v-if="checkBtn('func_common_delete')"
                  class="pan-btn red-btn"
                  type="warning"
                  @click="deleteGoods(scope.row)"
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
              :total="totalRows"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MTitle from "@/components/MTitle";
import { getList } from "@/api/merchandisecategories/index";
import {
  getGoodsList,
  delGoods,
  exportGoods,
  FilingGoods
} from "@/api/merchandisecategories/list";
import { getOriginList } from "@/api/brand/origin";
import { getBrandList } from "@/api/brand/index";
export default {
  components: { MTitle },
  data() {
    return {
      search: {
        goodsCode: "",
        sn: "",
        name: "",
        brandCode: "",
        originCode: ""
      },
      baseSearch: {},
      list: [],
      brandList: [],
      originList: [],
      typelist: [],
      pageIndex: 1,
      pageSize: 15,
      totalRows: 0,
      CurCode: "",
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
    this.baseSearch = JSON.parse(JSON.stringify(this.search));
    this.getGoodsData();
    this.getOrigin();
    this.getBrand();
    this.getData().then(res => {
      this.typelist = res;
    });
  },
  created() {
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    this.CurCode = "";
    this.baseSearch = JSON.parse(JSON.stringify(this.search));
    this.getGoodsData();
    this.getOrigin();
    this.getBrand();
    this.getData().then(res => {
      this.typelist = res;
    });
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
    jumpAdd(data) {
      if (typeof data !== "object") {
        this.$router.push({
          path: "/addGoods",
          query: {
            id: -1
          }
        });
      } else {
        window.sessionStorage.setItem(data.Id, JSON.stringify(data));
        this.$router.push({
          path: "/addGoods",
          query: {
            id: data.Id
          }
        });
      }
    },
    exportGoods() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: 99999,
        cateCode: this.$refs.tree.getCurrentNode()
          ? this.$refs.tree.getCurrentNode().Code
          : ""
      });
      exportGoods(p).then(res => {
        const href = window._config.fileServer + res.fileName;
        window.open(href);
      });
    },
    reSearch() {
      this.search = JSON.parse(JSON.stringify(this.baseSearch));
      this.getGoodsData();
    },
    deleteGoods(row) {
      this.$confirm("是否删除该商品？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(r => {
        delGoods({ goodsIds: row.Id }).then(res => {
          this.$message.success("删除成功！");
          this.getGoodsData();
        });
      });
    },
    Filing(id, type) {
      FilingGoods({ id: id, tradeType: type, Token: localStorage.Token }).then(
        res => {
          this.$message.success("备案成功！");
          this.getGoodsData();
        }
      );
    },
    handleSizeChange(v) {
      this.pageSize = v;
      this.getGoodsData();
    },
    handleCurrentChange(v) {
      this.pageIndex = v;
      this.getGoodsData();
    },
    loadNode(node, resolve) {
      if (node.level === 0) return;
      this.CurCode = node.data.Code;
      this.getData().then(res => {
        resolve(res);
      });
    },
    jump() {
      this.$router.push("/merchandisecategories");
    },
    getGoodsData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        cateCode: this.$refs.tree
          ? this.$refs.tree.getCurrentNode()
            ? this.$refs.tree.getCurrentNode().Code
            : ""
          : ""
      });
      getGoodsList(p).then(res => {
        //备案状态修改
        let newList = JSON.parse(JSON.stringify(res.Data));
        for (const key of newList) {
          switch (key.Status) {
            case 0:
              key.Status = "备案中";
              break;
            case 1:
              key.Status = "已备案";
              break;
            case 2:
              key.Status = "备案失败";
              break;
            default:
              key.Status = "未备案";
          }
        }
        this.list = newList;
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    },
    searchData() {
      this.pageIndex = 1;
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        cateCode: this.$refs.tree
          ? this.$refs.tree.getCurrentNode()
            ? this.$refs.tree.getCurrentNode().Code
            : ""
          : ""
      });
      getGoodsList(p).then(res => {
        //备案状态修改
        let newList = JSON.parse(JSON.stringify(res.Data));
        for (const key of newList) {
          switch (key.Status) {
            case 0:
              key.Status = "备案中";
              break;
            case 1:
              key.Status = "已备案";
              break;
            case 2:
              key.Status = "备案失败";
              break;
            default:
              key.Status = "未备案";
          }
        }
        this.list = newList;
        this.pageIndex = res.PageIndex;
        this.totalRows = res.TotalRows;
      });
    },
    getBrand() {
      getBrandList({ InUse: 1, pageSize: 9999 }).then(res => {
        this.brandList = res.Data;
      });
    },
    getOrigin() {
      getOriginList({ InUse: 1, pageSize: 9999 }).then(res => {
        this.originList = res.Data;
      });
    },
    getData() {
      return new Promise((rs, rj) => {
        getList({
          CurCode: this.CurCode
        }).then(res => {
          rs(res);
        });
      });
    }
  }
};
</script>
<style scoped>
.title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

/* .title .add {} */

.box {
  display: flex;
  min-height: calc(100vh - 84px);
  padding: 20px 0;
}

.box_left {
  flex: 0 0 250px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}

.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  border-bottom: 1px solid #eaeaea !important;
}

.searchBox {
  padding: 15px !important;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  margin-left: 10px;
}
</style>