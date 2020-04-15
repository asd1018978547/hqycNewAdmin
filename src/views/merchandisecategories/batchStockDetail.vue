<template>
  <div class="main content_box orderdetail roleadd od">
    <h2 class="big_title"> 批次库存详情</h2>

    <el-collapse v-model="activeNames">
      <el-collapse-item title="商品基本信息" name="1">
        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">商品ID：{{ baseInfo.OutRecordProductId }} </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">商品条码：{{ baseInfo.SN }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">商品名称：{{ baseInfo.Name }}</p>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">订单占用批次库存：{{ baseInfo.OccupyQty }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">可售批次库存：{{ baseInfo.AvailableQty }}   </p>
          </el-col>
          <el-col :span="6">
            <p class="nm">总批次库存：{{ baseInfo.BatchQty }}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20" class="mb0">
          <el-col :span="6">
            <p class="nm">批次号：{{ baseInfo.BatchNo }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">效期：{{ baseInfo.ExpireDate }}</p>
          </el-col>
          <el-col :span="6">
            <p class="nm">创建时间：{{ baseInfo.DateAdded }}</p>
          </el-col>
        </el-row>
      </el-collapse-item>

      <el-collapse-item title="商品信息" name="2">
        <el-table class="gdInfo" :data="dataInfo" border >
          <el-table-column align="center" label="渠道" prop="PartnerName"></el-table-column>

          <el-table-column align="center" label="锁定可售批次库存" prop="AvailableQty">
          </el-table-column>

          <el-table-column align="center" label="订单占用批次库存" prop="OccupyQty">
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import MTitle from "@/components/MTitle";
import {getBase,getData} from "@/api/goodsStockManage/goodsStockManage";
export default {
  components: { MTitle },
  data() {
    return {
      activeNames: ["1",'2'],
      baseInfo: {},
      dataInfo: [],
    };
  },
  created() {
    this.getBaseInfo();
    this.getDataInfo()
  },
  methods: {
    getBaseInfo() {
      getBase({id:this.$route.query.id}).then(res=>{
        this.baseInfo=res
      })
    },
    getDataInfo(){
      getData({id:this.$route.query.id}).then(res=>{
          console.log(res)
        this.dataInfo = res
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