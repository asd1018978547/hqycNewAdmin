<template>
  <div class="adv content_box">
    <m-title title='运费模版管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">模版名称：</span>
          <el-input v-model='search.name' clearable class="search_title" size='small' placeholder="请输入模版名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">贸易类型：</span>
          <el-select v-model="search.orderTypeId" clearable class='search_title' size="small" placeholder="请选择贸易类型">
            <el-option label="全部" value="0"></el-option>
            <el-option label="保税备货" value="2"></el-option>
            <el-option label="跨境直邮" value="1"></el-option>
            <el-option label="一般贸易" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <el-button @click='getSearch' size="small" type="primary" class="search_btn pan-btn blue-btn" icon="el-icon-search">查询</el-button>
          <el-button @click='add' size="small" type="success" class="search_btn pan-btn green-btn" icon="el-icon-plus">新增</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table border :data="tableData">
      <el-table-column label='模版列表' class="hsbg">
        <template slot-scope="scope">
          <p>{{ scope.row.Name }}<el-tag style="margin-left:10px;">{{ scope.row.OrderType }}</el-tag><span class="tr">修改时间：{{
              scope.row.DateModified }}
              <el-button @click='jumpDesc(scope.row)' style="margin-left:10px" type="primary" size="small" class="pan-btn blue-btn" icon="el-icon-edit">编辑</el-button>
              <el-button @click='del(scope.row)' type="Danger" size="small" class="pan-btn red-btn" icon="el-icon-close">删除</el-button>
            </span></p>
          <el-table border :data='scope.row.items'>
            <template v-for='(item, index) in scope.row.tftt'>
              <el-table-column :prop="item.key" :label="item.value" align='center' :key='index'>
                <template slot-scope="row">
                  <span v-if="item.key != 'ExpressTo'">{{ row.row[item.key] }}</span>
                  <span v-else-if="row.row.Areas.length == 0">{{ row.row[item.key] }}</span>
                  <template v-else>
                    <span>
                      {{ getCityStr(row.row.Areas) }}
                    </span>
                  </template>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="search.pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="search.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="TotalRows">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import MTitle from '@/components/MTitle'
  import { getTransFeeTemplateList, delTransFeeTemplate } from '@/api/transFeeTemplate/transFeeTemplate'
  export default {
    components: { MTitle },
    data() {
      return {
        tableData: [],
        TotalRows: 0,
        search: {
          pageIndex: 1,
          pageSize: 15,
          name: '',
          orderTypeId: '0'
        }
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.getData()
    },
    methods: {
      getCityStr(row) {
        let str = ''
        row.map(v => {
          if (v.IsAllSelect) {
            str += v.Name + ' , '
          } else {
            v.ChildArea.map(item => {
              str += item.Name + ' , '
            })
          }
          
        })
        return str.substring(0, str.length - 3)
      },
      add() {
        this.$router.push({
          path: '/transFeeTemplateInfo',
          query: {
            id: -1
          }
        })
      },
      del(row) {
        this.$confirm('确定要删除这个模版吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTransFeeTemplate({
            id: row.Id,
            OrderTypeId: row.OrderTypeId
          }).then(() => {
            this.$message.success('删除成功')
            this.getSearch()
          })
        })
      },
      jumpDesc(row) {
        this.$router.push({
          path: '/transFeeTemplateInfo',
          query: {
            id: row.Id
          }
        })
      },
      handleSizeChange(v) {
        this.search.pageSize = v
        this.getData()
      },
      handleCurrentChange(v) {
        this.search.pageIndex = v
        this.getData()
      },
      getSearch() {
        this.search.pageIndex = 1
        this.getData()
      },
      getData() {
        getTransFeeTemplateList(this.search).then(res => {
          res.Data.map(v => {
            v.tftt = []
            for (const k in v.TransFeeTemplateTitle) {
              const x = v.TransFeeTemplateTitle[k]
              v.tftt.push({
                key: k,
                value: x
              })
            }
          })
          this.tableData = res.Data
          this.TotalRows = res.TotalRows
        })
      }
    }
  }
</script>
<style scoped>
  .tr {
    float: right;
  }
</style>