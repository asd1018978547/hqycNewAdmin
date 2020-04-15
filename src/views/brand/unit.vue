<template>
  <div class="content_box">
    <m-title title='计量单位管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">单位名称：</span>
          <el-input v-model='search.UnitName' class="search_title" size='small' placeholder="请输入单位名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <span class="timed">状态：</span>
          <el-select class="search_title" v-model='search.InUse' size="small" placeholder="请选择状态">
            <el-option key="1" label="启用" value="1"></el-option>
            <el-option key="0" label="停用" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span='4'>
          <el-button v-if='checkBtn("func_common_search")' class="search_btn pan-btn green-btn" @click='getData' type="success" size='mini' icon='el-icon-search'>查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label='序号' prop='Id' align='center' width='100'></el-table-column>
      <el-table-column label='原产地名称-中文' prop='Name' align='center'></el-table-column>
      <el-table-column label='原产地名称-英文' prop='PinYin' align='center'></el-table-column>
      <el-table-column label='海关编码' prop='Code' align='center'></el-table-column>
      <el-table-column label='状态' align='center'>
        <template slot-scope="scope">
          <el-tag :type='getTag(scope.row.InUse)'>{{scope.row.InUse === 1 ? '正常' : '停用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label='操作' align='center' width='220'>
        <template slot-scope="scope">
          <el-button v-if='scope.row.InUse === 0 && checkBtn("func_common_disabled")' class="pan-btn green-btn" type="success" @click="editOrigin(scope.row)"
            size="mini" icon="el-icon-check">启用</el-button>
          <el-button v-if='scope.row.InUse === 1 && checkBtn("func_common_disabled")' class="pan-btn red-btn" type="danger" @click='editOrigin(scope.row)' size="mini" icon="el-icon-close">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
        :page-sizes="[15,30,50,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalRow">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { getUnitList, editUnit } from '@/api/brand/unit'
  export default {
    components: { MTitle },
    data() {
      return {
        pageIndex: 1,
        pageSize: 15,
        totalRow: 0,
        list: [],
        roleBtn: [],
        search: {
          UnitName: '',
          InUse: ''
        }
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
      this.getData()
    },
    methods: {
      checkBtn(str) {
        let f = false
        this.roleBtn.forEach(item => {
          if (item.FunctionCode === str) {
            f = true
          }
        })
        return f
      },
      editOrigin(row) {
        editUnit({
          id: row.Id
        }).then(res => {
          this.$message.success(row.InUse === 1 ? '停用成功' : '启用成功')
          this.getData()
        })
      },
      getTag(code) {
        if (code === 0) {
          return 'danger'
        } else if (code === 1) {
          return 'success'
        } else {
          return ''
        }
      },
      handleSizeChange(v) {
        this.pageSize = v
         getUnitList({ pageSize: this.pageSize, pageIndex: this.pageIndex, UnitName: this.search.UnitName, InUse: this.search.InUse }).then(res => {
          this.pageIndex = res.PageIndex
          this.totalRow = res.TotalRows
          this.list = res.Data
        })
      },
      handleCurrentChange(v) {
        this.pageIndex = v
         getUnitList({ pageSize: this.pageSize, pageIndex: this.pageIndex, UnitName: this.search.UnitName, InUse: this.search.InUse }).then(res => {
          this.pageIndex = res.PageIndex
          this.totalRow = res.TotalRows
          this.list = res.Data
        })
      },
      getData() {
        this.pageIndex = 1 
        getUnitList({ pageSize: this.pageSize, pageIndex: this.pageIndex, UnitName: this.search.UnitName, InUse: this.search.InUse }).then(res => {
          this.pageIndex = res.PageIndex
          this.totalRow = res.TotalRows
          this.list = res.Data
        })
      }
    }
  }
</script>
<style scoped>
  .info_item {
    display: flex;
    height: 40px;
    line-height: 40px;
  }

  .info_item .info_title {
    flex: 0 0 80px;
    text-align: right;
  }

  .info_item .info_right {
    flex: 0 0 200px;
  }
</style>