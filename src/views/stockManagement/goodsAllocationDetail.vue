<template>
  <div class="main content_box orderdetail roleadd od">
    <h2 class="big_title"> 商品调拨单详情
      <span style="padding-left:15px;"></span>
      <el-button v-if="baseInfo.AuditStatus==0" type="primary" size="mini" @click="Reviewdialog = true">审核</el-button>
    </h2>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="基本信息" name="1">
        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">调拨单号：{{ baseInfo.AllocationNo }} </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">调拨原因：{{ baseInfo.AllocationReason }}</p>
          </el-col>
          <!-- <el-col :span="6">
            <p class="nm">商品名称：{{ baseInfo.OutPartnerName }}</p>
          </el-col> -->
          <el-col :span="6">
            <p class="nm">调出渠道：{{ baseInfo.OutPartnerName }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">调入渠道：{{ baseInfo.EnterPartnerName }}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">申请人：{{ baseInfo.ApplyName }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">申请时间：<span class="historyNew"> {{ baseInfo.ApplyDate }} </span>  </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">审核人：{{ baseInfo.AuditName }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">审核时间： <span class="historyNew"> {{ baseInfo.AuditDate }} </span> </p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">关闭原因：{{ baseInfo.RefuseReason }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">审核状态：{{ baseInfo.AuditStatusDesc }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">出库状态：{{ baseInfo.OutStockStatusDesc }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">入库状态：{{ baseInfo.EnterStockStatusDesc }}</p>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="商品信息" name="2">
        <el-table class="gdInfo" :data="goodsInfo" border ref="multipleTable">
          <el-table-column align="center" label="商品信息">
            <template slot-scope="scope">
              <div class="goodsInfoBox">
                <img v-if="scope.row.Image != ''" :src="scope.row.Image" />
                <img v-else src="/static/img/no_goods_image.jpg" />
                <div class="goodsCon">
                  <p><span class="historyNew">  {{ scope.row.TradeTypeDesc }} </span> &emsp; &emsp;  条码：{{ scope.row.SN }}</p>
                  <p>{{scope.row.Name }}</p>
                  <p>规格：{{ scope.row.StandardInfo }}</p>
                  <p>效期：{{ scope.row.ExpireDate }}</p>
                  <p>入仓批次号：{{ scope.row.BatchNo }}</p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" label="出库数量" prop="OutStockQty">
          </el-table-column>

          <el-table-column align="center" label="入库数量" prop="EnterStockQty">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>


    <el-dialog title="审核" width="500px" center :visible.sync="Reviewdialog">
      <el-form>
        <el-form-item style="text-align: center">
          <el-radio-group v-model="ReviewInfo.status">
            <el-radio v-model="ReviewInfo.status" :label="1">通过</el-radio>
            <el-radio v-model="ReviewInfo.status" :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="ReviewInfo.status ==2" label="拒绝理由" label-width="70px">
          <el-input v-model="ReviewInfo.refuseReason" style="padding-left:15px;" placeholder="请输入拒绝理由" autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="Reviewdialog = false">取 消</el-button>
        <el-button type="primary" @click="serviceReview">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MTitle from "@/components/MTitle";
import { getBase, getGoods ,getReview } from "../../api/stockManagement/goodsAllocationDetail";
export default {
  components: { MTitle },
  data() {
    return {
      allocationNo: this.$route.query.allocationNo,
      activeNames: ["1",'2'],
      baseInfo: {},
      goodsInfo: [],
      Reviewdialog: false, //客服弹出框
      ReviewInfo:{
        status:'', //审核，
        refuseReason:'',
        allocationNo: this.$route.query.allocationNo,
      }
    };
  },
  created() {
    this.getBaseInfo();
    this.getGoodsInfo()
  },
  methods: {
    getBaseInfo() {
      var p = {allocationNo:this.allocationNo}
      getBase(p).then(res=>{
        this.baseInfo=res
      })
    },
    getGoodsInfo(){
      var p = {allocationNo:this.allocationNo}
      getGoods(p).then(res=>{
        this.goodsInfo = res
      })
    },
    //切换table
    handleChange(val) {
      let obj = "";
      val.map(v => {
        let flag = false;
        this.activedDatas.map(item => {
          if (parseInt(v) === parseInt(item)) {
            flag = true;
          }
        });
        if (!flag) {
          obj = v;
        }
      });
      if (obj !== "") {
        switch (parseInt(obj)) {
          case 2:
            // this.getGoodsInfo();
            break;
        }
        this.activedDatas.push(obj);
      }
    },
    //审核
    serviceReview() {
      if (this.ReviewInfo.status == "") {
        this.$message.error("请选择通过或拒绝");
        return;
      }
      if (this.ReviewInfo.refuseReason == "" && this.ReviewInfo.status == 2) {
        this.$message.error("拒绝理由不能为空");
        return;
      }
      getReview(this.ReviewInfo).then(res=>{
        setTimeout(()=>{
        this.$message.success("操作成功！");
        this.getBaseInfo();
        this.getGoodsInfo()
        },500)
        this.ReviewInfo={
          status:'', 
          refuseReason:'',
          allocationNo: this.$route.query.allocationNo,
        }
        this.$router.back(-1);
        this.Reviewdialog = false;
      })
    },
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

.nm {
  margin: 0;
}

.mb0 {
  margin-bottom: 0 !important;
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