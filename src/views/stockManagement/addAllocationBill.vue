<template>
  <div class="content_box">
    <m-title title="商品调拨开单"></m-title>
    <div class="searchBox">
      <p class="font">调拨单基本信息</p>
      <el-row>
        <el-col :span="4">
          <span class="timed">调拨单号：</span>
          <!-- <el-input v-model="add.allocationNo" clearable class="search_title" size="small" placeholder="请输入内部编号"  maxlength="30" ></el-input> -->
          <span>自动生成</span>
        </el-col>

        <el-col :span="4">
          <span class="timed">调出渠道：</span>
          <el-select
            class="search_title"
            clearable
            size="small"
            placeholder="请选择调出渠道"
            v-model="add.outPartnerId"
          >
            <el-option
              v-for="item in WarehouseList"
              :key="item.PartnerId"
              :label="item.Name"
              :value="item.PartnerId"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <span class="timed">调入渠道：</span>
          <el-select
            class="search_title"
            clearable
            size="small"
            placeholder="请选择调入渠道"
            v-model="add.enterPartnerId"
          >
            <el-option
              v-for="item in WarehouseList"
              :key="item.PartnerId"
              :label="item.Name"
              :value="item.PartnerId"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <span class="timed">申请人：</span>
          <span>{{ nickName }}</span>
        </el-col>

        <el-col :span="4">
          <span class="timed">调拨原因：</span>
          <el-input
            clearable
            class="search_title"
            size="small"
            placeholder="请输入调拨原因"
            maxlength="30"
            v-model="add.allocationReason"
          ></el-input>
        </el-col>
      </el-row>
    </div>
    <hr />
    <div>
      <p class="font">调拨商品信息</p>
      <el-col class="marginBottom">
        <el-button
          type="primary"
          :disabled="add.outPartnerId==''?true:false"
          @click="goodsVisible=true"
        >添加调拨商品</el-button>
        <el-button type="primary" :disabled="multipleList.length < 1" @click="delGood">删除调拨商品</el-button>
        <!-- <el-button  type="primary" >批量导入</el-button>
        <span class="blue"> 导入模板下载 </span>-->
      </el-col>
      <p>总商品数：{{ tableData.length }}</p>

      <el-table
        @row-click="rowClick"
        ref="multipleTable"
        :data="tableData"
        border
        fit
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :summary-method="getSummaries"
        show-summary
        sum-text="合计"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="贸易类型" align="center" prop="TradeTypeDesc"></el-table-column>
        <el-table-column label="商品条码" align="center" prop="SN"></el-table-column>
        <el-table-column label="商品名称" align="center" prop="Name"></el-table-column>
        <el-table-column label="规格" align="center" prop="Standard"></el-table-column>
        <el-table-column label="效期" align="center" prop="ExpireDate"></el-table-column>
        <el-table-column label="批次号" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.BatchNo">{{ scope.row.BatchNo }}</p>
            <p v-else>合计</p>
          </template>
        </el-table-column>
        <el-table-column label="锁定可售批次库存" align="center">
          <template slot-scope="scope">
            <p v-if="scope.row.AvailableQty">{{ scope.row.AvailableQty }}</p>
          </template>
        </el-table-column>
        <el-table-column label="调拨数量" align="center">
          <template slot-scope="scope">
            <el-input
              oninput="value=value.replace(/[^\d]/g,'')"
              v-model="scope.row.count"
              class="edit-input"
              size="mini"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-col class="marginTop">
      <el-button type="primary" :disabled="tableData.length < 1" @click="save">保存</el-button>
    </el-col>
    <GoodsDialog
      @close="onclose"
      @choice="choiceGoods"
      :goodsVisible="goodsVisible"
      :partnerId="add.outPartnerId"
    ></GoodsDialog>
  </div>
</template>

<script>
import MTitle from "@/components/MTitle";
import { getWarehouseList } from "../../api/stockManagement/goodsAllocationBill";
import { addAllocate } from "@/api/stockManagement/addAllocationBill.js";
import GoodsDialog from "@/components/Goods/AllocateGoodsDialog.vue";
export default {
  components: { MTitle, GoodsDialog },
  data() {
    return {
      nickName: window.localStorage.getItem("NickName"),
      WarehouseList: [], //仓库选项
      tableData: [],
      multipleList: [], //选中的列表数据
      goodsVisible: false,
      flag: false,
      add: {
        outPartnerId: "",
        enterPartnerId: "",
        allocationReason: "",
        skuList: []
      }
    };
  },
  created() {
    this.getWarehouseList();
  },
  methods: {
    //获取仓库选项数据
    getWarehouseList() {
      getWarehouseList().then(res => {
        this.WarehouseList = res;
      });
    },
    handleSelectionChange(val) {
      this.multipleList = val;
    },
    getSummaries(param) {
      const { columns, data } = param;
      let sums = [],
        stock = 0,
        allcount = 0;
      data.map(v => {
        stock += v.AvailableQty;
        allcount += Number(v.count);
      });
      columns.forEach((column, index) => {
        sums[6] = "合计";
        sums[7] = stock;
        if (Number.isNaN(allcount)) {
          sums[8] = 0;
        } else {
          sums[8] = allcount;
        }
      });
      return sums;
    },
    delGood() {
      this.$confirm("确定要删除这些商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
          this.tableData.forEach((item, index) => {
            this.multipleList.forEach((v,i)=>{
              if (item == v ) {
              delete this.tableData[index];
            }
            })
          });
          this.tableData = this.tableData.filter( val => val)
        })
        .then(() => {
          this.$refs.multipleTable.clearSelection();
        });
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      console.log(this.multipleList, this.tableData);
    },
    //保存
    save() {
      let fl = true;
      if (this.add.outPartnerId == this.add.enterPartnerId) {
        this.$message.error("调出调入渠道不能相同");
        fl = false;
      }
      if (this.add.outPartnerId == "") {
        this.$message.error("请选择调出渠道");
        fl = false;
      }
      if (this.add.enterPartnerId == "") {
        this.$message.error("请选择调入渠道");
        fl = false;
      }
      this.tableData.map((v, i) => {
        if (v.count > v.AvailableQty) {
          this.$message.error(`第${i + 1}条数据，调拨数量不能大于库存总数`);
          fl = false;
        }
        if (v.count <= 0) {
          this.$message.error(`第${i + 1}条数据，调拨数量不能小于等于0`);
          fl = false;
        }
      });
      let par = JSON.parse(JSON.stringify(this.add));
      this.tableData.map(v => {
        var s = {
          sn: v.SN,
          tradeType: Number(v.TradeType),
          batchNo: v.BatchNo,
          count: Number(v.count),
          expireDate: v.ExpireDate
        };
        par.skuList.push(s);
      });
      console.log(par);
      if (fl) {
        addAllocate(par).then(res => {
          console.log(res);
          this.$message.success("操作成功");
          this.tableData = [];
          this.add = {
            outPartnerId: "",
            enterPartnerId: "",
            allocationReason: "",
            skuList: []
          };
          this.$store
            .dispatch("delVisitedViews", {
              name: "addAllocationBill",
              path: "/addAllocationBill",
              title: "商品调拨开单"
            })
            .then(res => {
              this.$router.push("/goodsAllocationBill");
            });
          // this.$router.back(-1);
        });
      }
    },
    //子组件显隐控制
    onclose() {
      this.goodsVisible = false;
    },
    //子组件选择的数据
    choiceGoods(data) {
      let d = JSON.parse(JSON.stringify(data));
      let fl = true;
      d.map(v => {
        this.tableData.map(value => {
          if (v.Id == value.Id) {
            this.$message.error(
              `商品名为${v.Name}的数据已经存在，不能重复添加`
            );
            fl = false;
          }
        });
        if (fl) {
          v.AvailableQty = Number(v.AvailableQty);
          v.count = 0;
          this.tableData.push(v);
        }
      });
      this.goodsVisible = false;
    }
  }
};
</script>

<style scoped>
.font {
  font-size: 16px;
  font-weight: bolder;
}
.blue {
  color: #409eff;
  cursor: pointer;
  margin-left: 10px;
}

.marginBottom {
  margin-bottom: 20px;
}
.marginTop {
  margin-top: 20px;
}
</style>