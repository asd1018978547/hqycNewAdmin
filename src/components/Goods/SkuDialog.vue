<template>
  <div v-if='goodsVisible'>
    <el-dialog title="选择SKU" :visible.sync="gv" width='70%' :close-on-click-modal='false' @close='onclose'>
      <div class="goods recgoods goodsdialog">
        <div class="goods_left">
          <el-tree @node-click='getnodedata' accordion :data="cateData" :props="cateOpt" :load="lazyCateData" lazy>
          </el-tree>
        </div>
        <div class="goods_right">
          <div class="searchBox">
            <el-row>
              <el-col :span='10'>
                <span class="timed">SKU名称：</span>
                <el-input v-model='goods_skuname' class="search_title" size='small' placeholder="输入SKU名称">
                </el-input>
              </el-col>
              <el-col :span='10'>
                <span class="timed">SKU编码：</span>
                <el-input v-model='goods_skucode' class="search_title" size='small' placeholder="输入SKU编码">
                </el-input>
              </el-col>
              <el-col :span='4'>
                <el-button class="search_btn pan-btn green-btn" @click='getGoods' type="success" size='mini' icon='el-icon-search'>查询</el-button>
              </el-col>
            </el-row>
          </div>
          <el-table :data="goodsData" border cell-class-name="brand_td" :span-method="objectSpanMethod" @row-dblclick='choiceGoods'>
            <el-table-column prop='Code' label="SKU编码" align='center' width='120'></el-table-column>
            <el-table-column prop='Name' label="SKU名称" align='center'></el-table-column>
            <el-table-column prop='BrandName' label="品牌" align='center' width='150'></el-table-column>
            <el-table-column prop='Unit' label="单位" align='center' width='150'></el-table-column>
            <el-table-column prop='goodsItems.StandardInfo' label="规格" align='center' width='200'></el-table-column>
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
  // import { getSkuGoods, getSkuGoodsList } from '@/api/sku/addsku'
  import { getSkuInfoList } from '@/api/order/add'
  import { getSkuList } from '@/api/adv/recGoods'
  export default {
    data() {
      return {
        goods_skuname: '',
        goods_skucode: '',
        goodsPageIndex: 1,
        gv: false,
        goodsPageSize: 15,
        cateData: [],
        goodsData: [],
        cateOpt: {
          label: 'Name'
        },
        goodsTotal: 0
      }
    },
    props: {
      goodsVisible: Boolean
    },
    watch: {
      goodsVisible: function(v) {
        if (v) {
          getSkuList().then(res => {
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
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3) {
          if (rowIndex === 0) {
            return {
              rowspan: row.Childs.length === 0 ? 1 : row.Childs.length,
              colspan: 1
            }
          } else if (this.goodsData[rowIndex - 1].SkuId === row.SkuId) {
            return [0, 0]
          } else {
            return {
              rowspan: row.Childs.length === 0 ? 1 : row.Childs.length,
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
        getSkuInfoList({
          code: this.goods_skucode,
          name: this.goods_skuname,
          cateCode: this.cateCode,
          pageIndex: this.goodsPageIndex,
          pageSize: this.goodsPageSize,
          status: '1'
        }).then(res => {
          this.goodsTotal = res.TotalRows
          this.goodsPageIndex = res.PageIndex
          const arr = []
          for (let x = 0; x < res.Data.length; x++) {
            res.Data[x].ProCount = 1
            res.Data[x].ProCount1 = 1
            if (res.Data[x].Childs.length === 0) {
              let o = {}
              o = res.Data[x]
              o.Childs = []
              o.Childs[0] = res.Data[x]
              o.goodsItems = res.Data[x]
              arr.push(o)
            } else {
              res.Data[x].Childs.map(v => {
                let o = {}
                o = JSON.parse(JSON.stringify(res.Data[x]))
                o.goodsItems = v
                o.goodsItems.StandardInfo = v.StandardInfo
                arr.push(o)
              })
            }
          }
          this.goodsData = arr
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
        getSkuList({
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