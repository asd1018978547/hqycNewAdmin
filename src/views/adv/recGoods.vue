<template>
  <div class="content_box recgoods">
    <m-title title='品牌管理'></m-title>
    <div class="searchBox">
      <el-button v-if='checkBtn("func_common_add")' @click="goodsVisible = true" class="pan-btn green-btn" icon='el-icon-plus'
        size="small" type="success">新增推荐商品</el-button>
    </div>
    <el-table border :data="tableData">
      <el-table-column prop="Name" label="SKU信息" align='center'></el-table-column>
      <el-table-column prop="Weight" label="权重" align='center'>
        <template slot-scope="scope">
          <template v-if='scope.row.edit'>
            <el-input class="edit-input" size="mini" v-model="scope.row.Weight"></el-input>
          </template>
          <span v-else>{{ scope.row.Weight }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="BrandName" label="品牌信息" align='center' width='300'></el-table-column>
      <el-table-column prop="FullCategoryName" label="品类信息" align='center' width='250'></el-table-column>
      <el-table-column label="操作" width="250" align='center'>
        <template slot-scope="scope">
          <el-button v-if='!scope.row.edit' class="pan-btn blue-btn" @click="editRec(scope.row)" type="primary" icon='el-icon-edit'
            size="small">编辑</el-button>
          <el-button v-if='scope.row.edit' class="pan-btn green-btn" @click="subEdit(scope.row)" type="success" icon='el-icon-check'
            size="small">提交</el-button>
          <el-button v-if='checkBtn("func_common_delete")' @click="deleteRec(scope.row)" class="pan-btn red-btn" icon='el-icon-close'
            type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="text-align:right;padding:10px 0;" @size-change='recSizeChange' @current-change='recCurrentChange'
      :page-sizes='[10,20,30,50]' :page-size="recPageSize" layout="total, sizes, prev, pager, next, jumper" :total="recPageTotal">
    </el-pagination>
    <el-dialog v-if="goodsVisible" title="选择商品" :visible.sync="goodsVisible" width='70%' :close-on-click-modal='false'>
      <div class="goods">
        <div class="goods_left">
          <el-tree accordion :render-content="goodsRenderContent" :data="cateData" :props="cateOpt" :load="lazyCateData"
            lazy>
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
          <el-table :data="goodsData" border cell-class-name="brand_td">
            <el-table-column prop='Id' label="SKU编码" align='center' width='80'></el-table-column>
            <el-table-column prop='Name' label="SKU名称" align='center'></el-table-column>
            <el-table-column prop='BrandName' label="品牌名称" align='center' width='150'></el-table-column>
            <el-table-column label="操作" width="80" align='center'>
              <template slot-scope="scope">
                <el-button @click="choiceGoods(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination style="text-align:right;padding:10px 0;" @current-change='goodsCurrentChange' :page-sizes='[10,20,30,50]'
            :page-size="goodsPageSize" layout="prev, pager, next, jumper" :total="goodsTotal">
          </el-pagination>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="goodsVisible = false">取 消</el-button>
        <el-button type="primary" @click="goodsVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getRecGoodsList, delRecGoods, getSkuList, getSkuForId, setRecGoods, editRecGoods } from '@/api/adv/recGoods'
  import MTitle from '@/components/MTitle'
  export default {
    components: { MTitle },
    data() {
      return {
        recPageSize: 10,
        recPageIndex: 1,
        recPageTotal: 0,
        tableData: [],
        goodsInfo: null,
        goodsVisible: false,
        goodsData: [],
        goods_skuname: '',
        goodsPageSize: 10,
        goodsTotal: 0,
        roleBtn: [],
        goodsPageIndex: 1,
        goods_skucode: '',
        cateCode: '',
        cateData: [],
        cateOpt: {
          label: 'Name'
        }
      }
    },
    watch: {
      goodsVisible(newVal, oldVal) {
        if (newVal) {
          this.getCate()
        }
      }
    },
    methods: {
      subEdit(row) {
        editRecGoods({
          id: row.Id,
          Weight: row.Weight
        }).then(res => {
          this.$message.success('修改成功')
          this.getData()
        })
      },
      editRec(row) {
        this.tableData = this.tableData.map(v => {
          if (v.Id !== row.Id) {
            this.$set(v, 'edit', false)
          } else {
            this.$set(v, 'edit', true)
          }
          return v
        })
      },
      checkBtn(str) {
        let f = false
        this.roleBtn.forEach(item => {
          if (item.FunctionCode === str) {
            f = true
          }
        })
        return f
      },
      choiceGoods(row) {
        setRecGoods({
          skuid: row.Id
        }).then(res => {
          this.goodsVisible = false
          this.getData()
        })
      },
      choiceCateForGoods(row) {
        this.cateCode = row.Code
        this.getGoods()
      },
      recSizeChange(val) {
        this.recPageSize = val
        this.getData()
      },
      recCurrentChange(val) {
        this.recPageIndex = val
        this.getData()
      },
      goodsCurrentChange(val) {
        this.goodsPageIndex = val
        this.getGoods()
      },
      getGoods() {
        getSkuForId({
          skuId: this.goods_skucode,
          name: this.goods_skuname,
          pageIndex: this.goodsPageIndex,
          pageSize: this.goodsPageSize,
          cateCode: this.cateCode,
          status: '1'
        }).then(res => {
          this.goodsTotal = res.TotalRows
          this.goodsPageIndex = res.PageIndex
          this.goodsData = res.Data
        })
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
      },
      getCate() {
        getSkuList().then(res => {
          this.cateData = res
        })
      },
      // 添加推荐商品
      addRec() { },
      // 删除推荐商品
      deleteRec(row) {
        this.$confirm('确定删除该推荐商品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRecGoods({
            id: row.Id
          }).then(res => {
            this.$message.success('删除成功！')
            this.getData()
          })
        })
      },
      goodsRenderContent(h, { node, data, store }) {
        return (
          <span class='custom-tree-node'>
            <span>{node.label}</span>
            <span class='tree_font'>
              <el-button size='mini' type='text' on-click={() => this.choiceCateForGoods(data)}>选择</el-button>
            </span>
          </span>
        )
      },
      getData() {
        getRecGoodsList({
          pageIndex: this.recPageIndex,
          pageSize: this.recPageSize
        }).then(res => {
          res.Data.map(v => {
            v.edit = false
          })
          this.tableData = res.Data
          this.recPageIndex = res.PageIndex
          this.recPageTotal = res.TotalRows
        })
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.getData()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
    }
  }
</script>

<style scoped>
  .goods {
    display: flex;
  }

  .goods_left {
    flex: 0 0 200px;
  }

  .goods_right {
    flex: 1;
  }
</style>