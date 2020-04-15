<!---退款金额组件--申请补偿--->
<template>
  <div class="root-t">
    <el-dialog :visible.sync="dialogVisible" width="36%">
      <div class="title_div">保税与直邮商品退款金额标准（补偿）</div>
      <div class="std_div">
        <div class="tkyy_div">退款原因</div>
        <div class="tkyy_div_r">退款金额标准</div>
      </div>
      <div class="std_div">
        <div class="common_div" style="line-height: 350px;">瘪罐（仅奶粉）</div>
        <div class="common_div_r" style="line-height: 23px;">
          <p style="text-align: left;">10%一下，赔付5元/件；</p>
          <p style="text-align: left;">10%-30%，赔付10元/件；</p>
          <p style="text-align: left;">30%-50%，赔付20元/件；</p>
          <div style="display: flex">
            <div class="border_TK">
              <img class="temImg" src="../../assets/img/payback/bieguan2.png" alt="环球云仓" />
              <div class="bgimg_clss">瘪罐＜10%以下</div>
            </div>
            <div class="border_TK">
              <img class="temImg" src="../../assets/img/payback/bieguan3.png" alt="环球云仓" />
              <div class="bgimg_clss">10%＜瘪罐＜30%</div>
            </div>
            <div class="border_TK">
              <img class="temImg" src="../../assets/img/payback/bieguan3.png" alt="环球云仓" />
              <div class="bgimg_clss">30%＜瘪罐＜50%</div>
            </div>
          </div>
          <p>亲，请根据照片示例给出的奶粉瘪罐程度，合理填写退款金额，</p>
          <p>客服处理更快哦</p>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="line-height: 99px;">包装破损</div>
        <div class="common_div_r">
          <ul style="line-height:25px;list-style-type: none;margin-left: -40px;">
            <li>轻微破损，不影响售卖，赔付5元/件</li>
            <li>中度破损，影响售卖，赔付10元/件</li>
            <li>严重破损，严重影响售卖，赔付20元/件</li>
          </ul>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="line-height: 72px;">商品瑕疵</div>
        <div class="common_div_r" style="line-height: 24px">
          <p>根据商品受损比例，判断商品残值，与客户协商补偿金额，补偿金额=商品售卖价-商品残值</p>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="padding: 62px 0 0 0;">
          <ul style="line-height:20px;list-style-type: none;margin: 0 0 0 -32px;">
            <li>商品保质期</li>
            <li>与平台描述不符</li>
          </ul>
        </div>
        <div class="common_div_r">
          <ul style="line-height:25px;list-style-type: none;margin-left: -40px;">
            <li>1.实际商品保质期超过平台描述保质期，不赔付</li>
            <li>2.实际商品保质期低于平台描述保质期，未低于总有效期的</li>
            <li>1/3，赔付商品金额的5%</li>
            <li>3.实际商品保质期低于总有效期1/3，赔付商品金额20%</li>
          </ul>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="line-height: 70px;">订单发货超时</div>
        <div class="common_div_r" style="    line-height: 24px;">
          <p>付款成功的订单两个工作日内（以订单支付成功时间为节点）出物流信息，超时赔款</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Bus from "@/components/common/bus.js";
export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {},
  //生命周期 - 创建完成
  created() {
    //显示弹窗
    Bus.$on("showStd", data => {
      this.dialogVisible = data;
    });
  },

  //DOM挂载完毕
  mounted() {},
  beforeDestroy() {
    // Bus.$off("showStd");
  }
};
</script>
<style scoped>
.std_div {
  display: flex;
}

.tkyy_div {
  width: 30%;
  background-color: #f05454;
  border-style: solid;
  text-align: center;
  border-width: 0;
  margin: 0 5px 0 0;
  padding: 10px;
  color: white;
}
.tkyy_div_r {
  padding: 10px;
  width: 70%;
  color: white;
  background-color: #f05454;
  border-style: solid;
  text-align: center;
  border-width: 0;
  margin: 0 0 0 0;
}
.common_div {
  display: table-cell;
  width: 30%;
  margin: 5px 5px 0 0;
  background-color: #efefef;
  border-style: solid;
  text-align: center;
  border-width: 0;
  padding: 20px;
}
.common_div_r {
  padding: 20px;
  width: 70%;
  margin: 5px 0 0 0;
  background-color: #efefef;
  border-style: solid;
  text-align: left;
  border-width: 0;
}
.temImg {
  border-radius: 5px;
  width: 113px;
  height: 115px;
}
.bgimg_clss {
  color: #999999;
  text-align: center;
  margin-top: 0;
}
.border_TK {
  margin: 0 5px 0 0;
  width: auto;
  height: auto;
  border-style: solid;
  border-width: 0.5px;
  border-color: #eee;
  padding: 5px 5px 0 5px;
  border-radius: 5px;
}
.title_div {
  margin: -30px 0 20px 0;
  color: black;
  font-size: 18px;
  text-align: center;
}
</style>
<style lang="scss">
.root-t {
  .el-dialog__body {
    padding: 20px 20px;
  }
}
</style>
