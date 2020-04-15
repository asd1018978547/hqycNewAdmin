<template>
  <div v-if='goodsVisible'>
    <el-dialog title="请选择调拨商品" :visible.sync="gv" width='70%' :close-on-click-modal='false' @close='onclose'>
      <div class="goods recgoods goodsdialog">
        <div class="goods_left">
          <el-tree @node-click='getnodedata' accordion :data="cateData" :props="cateOpt" :load="lazyCateData" lazy>
          </el-tree>
        </div>
        <div class="goods_right">
          <div class="searchBox">
            <el-row>
              <el-col :span='10'>
                <span class="timed">关键字：</span>
                <el-input v-model='goods_skuname' class="search_title" size='small' placeholder="输入商品名称/条码">
                </el-input>
              </el-col>
<!--              <el-col :span='10'>-->
<!--                <span class="timed">商品编码：</span>-->
<!--                <el-input v-model='goods_skucode' class="search_title" size='small' placeholder="输入商品编码">-->
<!--                </el-input>-->
<!--              </el-col>-->
              <el-col :span='6'>
                <span class="timed">贸易类型：</span>
                <el-select size="mini" v-model="TradeType" placeholder="请选择" clearable>
                      <el-option label="跨境直邮" value="1"></el-option>
                      <el-option label="保税备货" value="2"></el-option>
                      <el-option label="一般贸易" value="3"></el-option>
                </el-select>           
              </el-col>
              <el-col :span='4'>
                <el-button class="search_btn pan-btn green-btn" @click='getGoods' type="success" size='mini' icon='el-icon-search'>查询</el-button>
              </el-col>
            </el-row>
          </div>
          <!-- :span-method="objectSpanMethod" @row-dblclick='choiceGoods' -->
          <el-table :data="goodsData" border cell-class-name="brand_td" >
            <el-table-column prop='Id' label="商品编码" align='center' width='80' :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop='ProName' label="商品中文名称" align='center' width='150' :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop='RetailPrice' label="成本价" align='center' width='80' :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop='BrandName' label="品牌" align='center' width='150'></el-table-column>
            <el-table-column prop='SN' label="商品条码" align='center' width='100'  :show-overflow-tooltip="true"></el-table-column>
            <!-- <el-table-column prop='Standard' label="规格" align='center' width='150'></el-table-column> -->
            <!-- <el-table-column prop='cd.Code' label="子商品编码" align='center' width='150'></el-table-column> -->
            <!-- <el-table-column prop='cd.Standard' label="子商品规格" align='center' width='150'></el-table-column> -->
            <el-table-column label="操作" width="80" align='center'>
              <template slot-scope="scope">
                <el-button @click="choiceGoods(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="text-align:right;padding:10px 0;" @size-change='goodsSizeChange' @current-change='goodsCurrentChange'
            :page-sizes='[10,20,30,50]' :page-size="goodsPageSize" layout="prev, pager, next, jumper" :total="goodsTotal">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="gv = false">取 消</el-button>
        <!-- <el-button type="primary" @click="gv = false">确 定</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { getSkuGoods,gethHQYCSKU, getSkuGoodsList } from '@/api/sku/addsku'
  export default {
    data() {
      return {
        goods_skuname: '',
        goods_skucode: '',
        goodsPageIndex: 1,
        gv: false,
        goodsPageSize: 15,
        cateData: [],
        ot: '',
        TradeType:'1',
        goodsData: [],
        cateOpt: {
          label: 'Name'
        },
        goodsTotal: 0
      }
    },
    activated() {
      this.ot = this.orderType
    },
    props: {
      goodsVisible: Boolean,
      orderType: Number,

    },
    watch: {
      
      orderType: function(v) {
        this.ot = v
      },
      goodsVisible: function(v) {
        if (v) {
          getSkuGoodsList().then(res => {
            this.cateData = res
            this.gv = true
          })
          this.getGoods()
        } else {
          this.gv = false
          this.goodsPageIndex = 1
          this.goodsPageSize = 15
          this.goods_skuname = ''
          this.cateData = []
          this.cateCode = ''
          this.goods_skucode = ''
        }
      },
      gv: function(v) {
        if (!v) {
          this.onclose
        }
      }
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
          if (rowIndex === 0) {
            return {
              rowspan: row.Childs.length,
              colspan: 1
            }
          } else if (this.goodsData[rowIndex - 1].Id === row.Id) {
            return [0, 0]
          } else {
            return {
              rowspan: row.Childs.length,
              colspan: 1
            }
          }
        }
      },
      onclose() {
        this.$emit('close')
      },
      goodsSizeChange(val) {
        this.goodsPageSize = val
        this.getGoods()
      },
      goodsCurrentChange(val) {
        this.goodsPageIndex = val
        this.getGoods()
      },
      choiceGoods(data) {
        this.$emit('choice', data)
      },
      choiceCateForGoods(data) {
        this.cateCode = data.Code
        this.getGoods()
      },
      getGoods() {
        gethHQYCSKU({
          tradeType: sessionStorage.getItem('tradeTypeGoodDialog'),
          keys: this.goods_skuname,
          // sn: this.goods_skucode,
        //   name: this.goods_skuname,
          categoryCode: this.cateCode,
          tradeType:this.TradeType,
          pageIndex: this.goodsPageIndex,
          pageSize: this.goodsPageSize,
        //   orderType: this.ot,
        //   status: '1'
        }).then(res => {
          console.log(res)
          this.goodsTotal = res.TotalRows
          this.goodsPageIndex = res.PageIndex
          this.goodsData = res.Data;
        //   const arr = []
        //   for (let x = 0; x < res.Data.length; x++) {
        //     for (let i = 0; i < res.Data[x].Childs.length; i++) {
        //       let o = {}
        //       o = res.Data[x]
        //       o.cd = res.Data[x].Childs[i]
        //       arr.push(JSON.parse(JSON.stringify(o)))
        //     }
        //   }
        //   this.goodsData = arr
        })
      },
      getnodedata(data) {
        this.cateCode = data.Code
        this.getGoods()
      },
      lazyCateData(node, resolve) {
        if (node.level >= 1) {
          this.getMoreCate(node.data.Code, resolve)
        } else {
          resolve(this.cateData)
        }
      },
      getMoreCate(val, resolve) {
        getSkuGoodsList({
          curCode: val
        }).then(res => {
          resolve(res)
        })
      }
    }
  }
</script>
<style scoped>
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
