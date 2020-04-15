<template>
  <div v-if='goodsVisible'>
    <el-dialog title="选择商品" :visible.sync="gv" width='70%' :close-on-click-modal='false' @close='onclose'>
      <div class="goods recgoods goodsdialog">
        <div class="goods_right">
          <div class="searchBox">
            <el-row>
               <el-col :span='6'>
                <span class="timed">商品条码：</span>
                <el-input v-model='search.sn' class="search_title" size='small' placeholder="输入商品条码"></el-input>
              </el-col>
              <el-col :span='6'>
                <span class="timed">商品名称：</span>
                <el-input v-model='search.name' class="search_title" size='small' placeholder="输入商品名称"></el-input>
              </el-col>
              <el-col :span='6'>
                <span class="timed">批次号：</span>
                <el-input v-model="search.batchNo" class="search_title" size='small' placeholder="输入批次号"></el-input>
              </el-col>
              <el-col :span='6'>
                <el-button class="search_btn pan-btn green-btn" @click='getSearch' type="success" size='mini' icon='el-icon-search'>查询</el-button>
              </el-col>
            </el-row>
          </div>
          <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal" @select="handleSelect" >
            <el-menu-item index="2">保税备货</el-menu-item>
            <el-menu-item index="1">跨境直邮</el-menu-item>
          </el-menu>
          <el-table  @row-click='rowClick' ref="multipleTable"  :data="goodsData" border fit style="width: 100%"  @selection-change="handleSelectionChange">
           <el-table-column type="selection" width="50" align="center"></el-table-column>
            <el-table-column label="商品ID" align="center" prop="OutRecordProductId"></el-table-column>
            <el-table-column label="商品条码" align="center" prop="SN"></el-table-column>
            <el-table-column label="商品名称" align="center" prop="Name"></el-table-column>
            <el-table-column label="批次库存" align="center" prop="AvailableQty"></el-table-column>
            <el-table-column label="批次号" align="center" prop="BatchNo"></el-table-column>
            <el-table-column label="效期" align="center" prop="ExpireDate"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="DateAdded"></el-table-column>
      </el-table>
          <el-pagination style="text-align:right;padding:10px 0;" @size-change='SizeChange' @current-change='CurrentChange'
            :current-page="pageIndex" :page-sizes='[10,20,30,50]' :page-size="pageSize" layout="prev, pager, next, jumper" :total="totalRows">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click=" check " :disabled="choiceList.length < 1"  type="primary">确 定</el-button>
        <el-button @click="gv = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import{ getList }from '@/api/stockManagement/addAllocationBill.js'
  export default {
    data() {
      return {
        defaultActive: '2',
        status:2,
        gv: false,
        TradeType:'1',
        goodsData: [],
        search:{
          sn:'',
          partnerId:'',
          batchNo:'',
          name:''
        },
        pageIndex:1,
        pageSize:15,
        totalRows: 0,
        choiceList:[]
      }
    },
    activated() {
    },
    props: [
      'partnerId',
      'goodsVisible'
    ],
    watch:{
      partnerId: function(v) {
        this.search.partnerId = v
      },
      goodsVisible: function(v) {
        this.gv = true
        this.getGoods()
      },
      gv: function(v) {
        if (!v) {
          this.onclose
        }
      }
    },
   methods:{
     rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      },
      //当前选择中的商品
      handleSelectionChange(val){
      this.choiceList = val;
      },
       // 标签选择
      handleSelect(v) {
        this.status = v
        this.getGoods()
      },
      SizeChange(val) {
        this.pageSize = val
        this.getGoods()
      },
      CurrentChange(val) {
        this.pageIndex = val
        this.getGoods()
      },
      getSearch(){
        this.pageIndex = 1
        this.choiceList=[]
        this.getGoods()
      },
      getGoods(){
        // if(this.search.partnerId=='') return
        let par = Object.assign(this.search,{
          pageIndex:this.pageIndex,
          pageSize:this.pageSize,
          tradeType:this.status
        })
        getList(par).then(res=>{
          this.goodsData = res.Data
          this.pageIndex = res.PageIndex;
          this.totalRows = res.TotalRows;
        })
      },
      //确定
      check(){
        this.$emit('choice', this.choiceList)
          this.search.sn='',
          this.search.batchNo='',
          this.search.name=''
        
      },
      //关闭对话框
       onclose() {
          this.search.sn='',
          this.search.batchNo='',
          this.search.name=''
        this.$emit('close')
      },
   }
  }   
</script>
<style scoped>
.el-menu-demo{
    margin-bottom: 10px;
}
  .goods {
    display: flex;
    justify-content: flex-end
  }

  .goods_left {
    flex: 0 0 200px;
  }

  .goods_right {
    flex: 1
  }

  .imgBox {
    padding-left: 120px;
  }

  .imgBox img {
    border: 1px solid #eee;
    width: 400px;
    height: 400px;
  }
</style>
