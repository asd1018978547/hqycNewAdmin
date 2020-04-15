<template>
  <div class="main content_box orderdetail roleadd od">
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
      style="margin-top:20px"
    >
      <el-collapse-item title="PO单基本信息" name="1">
        <el-row :gutter="20" class="mb0">
          <el-col :span="8">
            <p class="nm">
              编号：
              <span class="Warning">{{ baseInfo.SysNo }}</span>
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              状态：
              <span v-if="baseInfo.Status === 0">待申报</span>
              <span v-if="baseInfo.Status === 1">完成</span>
              <span v-if="baseInfo.Status === 2">取消</span>
              <span v-if="baseInfo.Status === -1">失败</span>
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              备货方式：
              <span v-if="baseInfo.GoodsStockUpWay === 2">海外仓集货</span>
              <span v-if="baseInfo.GoodsStockUpWay === 1">商户自行备货</span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0">
          <el-col :span="8">
            <p class="nm">
              入库仓库： 成都澳蓉金二仓
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              创建时间：
              {{ baseInfo.DateAdded }}
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              创建人：
              {{ baseInfo.CreateUserName }}
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0">
          <el-col :span="8">
            <p class="nm">
              报关方式： 一体化报关
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              提运单号：
              {{ baseInfo.AssBillNo }}
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              运输方式： 公路运输
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0">
          <el-col :span="8">
            <p class="nm">
              航次(班)号：
              {{ baseInfo.VoyageNo }}
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              件数：
              {{ baseInfo.PackQty }}
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              净重合计(kg)：
              {{ baseInfo.TotalNetWeight }}
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0">
          <el-col :span="8">
            <p class="nm">
              毛重合计(kg)：
              {{ baseInfo.TotalGrossWeight }}
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              审核时间：
              {{ baseInfo.DateModified }}
            </p>
          </el-col>
          <el-col :span="8">
            <p class="nm">
              审核用户名：
            </p>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="PO单商品信息" name="2">
        <el-table
          class="gdInfo"
          :data="baseInfo.POMaintainDetailList"
          border
          ref="multipleTable"
          style="width: 100%"
        >
          <el-table-column align="center" label="商品ID">
            <template slot-scope="scope">
              <span>{{ scope.row.ProductID }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <span>{{ scope.row.Name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="条形码">
            <template slot-scope="scope">
              <span>{{ scope.row.SN }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购价">
            <template slot-scope="scope">
              <el-input
                disabled
                size="mini"
                v-model="scope.row.OrderPrice"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="采购量">
            <template slot-scope="scope">
              <el-input
                disabled
                size="mini"
                v-model="scope.row.PurchaseQty"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="申报货币">
            <template slot-scope="scope">
              <el-select
                size="mini"
                disabled
                v-model="scope.row.Currency"
                placeholder="请选择"
              >
                <el-option label="人民币" value="CNY"> </el-option>
                <el-option label="澳大利亚元" value="AUD"> </el-option>
                <el-option label="其他" value=""> </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" label="清点数量">
            <template slot-scope="scope">
              <span>{{ scope.row.Quantity }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
      <el-collapse-item title="PO单清关资料" name="3">
        <el-table
          class="gdInfo"
          :data="fileArray"
          border
          ref="multipleTable"
          style="width: 100%"
        >
          <el-table-column align="center" label="附件名称">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <span
                v-if="scope.row"
                title="点击查看"
                style="color:#00b0ff;cursor:pointer"
                @click="jump(scope.row.url)"
                >查看</span
              >
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { POlistDetail } from "../../api/stockManagement/PO";
let OSS = require("ali-oss");
import moment from "moment";
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "refundOrderManage/" +
  moment().format("YYYYMM") +
  "/img/";

export default {
  data() {
    return {
      sysNo: "",
      baseInfo: "",
      activeNames: "1",
      fileArray: [],
      activedDatas: [1, 2]
    };
  },
  activated() {
    this.activeNames = "1";
    this.activedDatas = [1];
  },
  mounted() {
    this.getData();
  },

  methods: {
    jump(url) {
      window.open(url, "_black");
    },
    getData() {
      POlistDetail({ id: this.$route.query.id }).then(res => {
        this.baseInfo = res;
        this.fileArray = [
          {
            name: "合同",
            url: res.POAttachments.Contract
          },
          {
            name: "发票",
            url: res.POAttachments.Invoice
          },
          {
            name: "箱单",
            url: res.POAttachments.BoxList
          },
          {
            name: "提运单",
            url: res.POAttachments.BillOfLoading
          }
        ];
      });
    },
    //切换table
    handleChange(val) {
      // let obj = "";
      // val.map(v => {
      //   let flag = false;
      //   this.activedDatas.map(item => {
      //     if (parseInt(v) === parseInt(item)) {
      //       flag = true;
      //     }
      //   });
      //   if (!flag) {
      //     obj = v;
      //   }
      // });
      // if (obj !== "") {
      //   switch (parseInt(obj)) {
      //     case 2:
      //       this.getGoodsInfo();
      //       this.getRefundAmount();
      //       break;
      //     case 3:
      //       this.getAfterSaleInfo();
      //       break;
      //     case 4:
      //       this.getImageInfo();
      //       break;
      //     case 5:
      //       this.getExpInfo();
      //       break;
      //     case 6:
      //       this.getHistoryInfo();
      //       break;
      //   }
      //   this.activedDatas.push(obj);
      // }
    }
  }
};
</script>
<style scoped>
.bottom0 {
  margin-bottom: 0;
}
.spanLeft {
  margin-left: 10px;
}
img {
  width: 200px;
  height: 250px;
}
.btnRight {
  text-align: right;
}
.pm {
  width: 150px;
  margin: 0;
}
.historyNew {
  color: #f56c6c;
  font-weight: 500;
}
.addskuupload {
  display: flex;
  width: 100%;
}
.elheight {
  height: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.flex1000 {
  flex: 0 0 900px !important;
  display: flex;
}

.flex1000 .dzinfo {
  width: 300px;
}

.flex1000 .dz,
.flex1000 .dzinfo {
  display: inline-block !important;
}

.addres .nm span {
  display: block;
}

.addres .nm span:nth-child(1) {
  flex: 0 0 120px;
  text-align: right;
}

.addres .nm span:nth-child(2) {
  flex: 0 0 1;
}

.addres p.nm {
  display: flex;
  height: 36px;
  width: 100%;
  line-height: 36px;
}

.goodsInfoBox {
  display: flex;
  position: relative;
}

.changeGoods {
  position: absolute;
  right: 0;
  bottom: 0;
}

.goodsInfoBox img {
  width: 90px;
  height: 90px;
  flex: 0 0 80px;
  display: block;
}

.gdInfo {
  margin-top: 20px;
}

.gdInfo p {
  margin: 0;
}

.goodsCon {
  text-align: left;
  padding: 0 15px;
}

.new {
  margin-left: 10px;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  padding: 3px 5px;
  font-weight: 500;
}
.infoDesc {
  padding: 18px;
  padding-bottom: 0;
}
.nm {
  margin: 0;
}
.addskuuploadItem {
  display: inline-block;
  width: 130px;
  position: relative;
  border: 1px dashed #eeeeee;
}
.mb0 {
  margin-bottom: 0 !important;
}
.upload h5 {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  color: #666;
}
.fwb {
  font-weight: bolder;
}

.expinfo {
  border: 1px solid #1c1c1c;
  padding: 5px;
  border-radius: 5px;
  width: 800px;
}

.expinfo li {
  list-style: none;
  line-height: 28px;
  border-bottom: 1px solid #eee;
  padding-left: 10px;
}

.expinfo li:nth-last-child(1) {
  border-bottom: none;
}
</style>
