<!---退款金额组件--->
<template>
  <div class="root-ty">
    <el-dialog :visible.sync="dialogVisible" width="36%">
      <div class="title_div">保税与直邮商品退款金额标准（退货退款）</div>
      <div class="std_div">
        <div class="tkyy_div">退款原因</div>
        <div class="tkyy_div_r">退款金额标准</div>
      </div>
      <div class="std_div">
        <div class="common_div" style="line-height: 37px;">爆罐（仅奶粉）</div>
        <div class="common_div_r">
          <p>商品售价+商品税金，无需退回，不补发货</p>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="line-height: 37px;">包装破损</div>
        <div class="common_div_r">
          <p>商品售价+商品税金+退回运费，不补发货</p>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="line-height: 37px;">商品瑕疵</div>
        <div class="common_div_r">
          <p>商品售价+商品税金+退回运费，不补发货</p>
        </div>
      </div>

      <div class="std_div">
        <div class="common_div" style="line-height: 20px;">
          <p>商品保质期</p>
          <p>与平台描述不符</p>
        </div>
        <div class="common_div_r" style="line-height: 40px;">
          <p>商品售价+商品税金+退回运费，不补发货</p>
        </div>
      </div>
      <div class="std_div">
        <div class="common_div" style="line-height: 15px;">
          <p>错发</p>
        </div>
        <div class="common_div_r">
          <p>商品售价+商品税金+退回运费，不补发货</p>
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
.title_div {
  margin: -30px 0 20px 0;
  color: black;
  font-size: 18px;
  text-align: center;
}
</style>
<style lang="scss">
.root-ty {
  .el-dialog__body {
    padding: 20px 20px;
  }
}
</style>