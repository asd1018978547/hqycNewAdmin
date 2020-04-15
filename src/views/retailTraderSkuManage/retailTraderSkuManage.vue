<template>
  <div class="adv content_box">
    <div class="searchBox">
      <el-row>
        <el-col :span="4">
          <span class="timed">分销商名称：</span>
          <el-input
            class="search_title"
            clearable
            v-model="search.description"
            size="mini"
            placeholder="请输入分销商名称"
          ></el-input>
        </el-col>
        <el-col :span='4'>
              <span class="timed">供货类型：</span>
              <el-select class="search_title" filterable clearable v-model='search.supplyType' size="small" placeholder="请选择供货类型">
                <el-option  label="全部" value="-1"></el-option>
                <el-option  label="裸价" value="1"></el-option>
                <el-option  label="包邮价" value="2"></el-option>
              </el-select>
            </el-col>
        <el-col :span="4">
          <el-button
            size="small"
            type="primary"
            class="search_btn pan-btn blue-btn"
            icon="el-icon-search"
            @click="getsearch"
          >查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table border :data="tableData">
      <el-table-column prop="Description" label="分销商名称" align="center"></el-table-column>
      <el-table-column prop="DateAdded" label="添加时间" align="center"></el-table-column>
      <el-table-column prop="supplyTypeDesc" label="供货类型" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            @click="edit(scope.row)"
            type="primary"
            size="small"
            class="pan-btn blue-btn"
            icon="el-icon-edit"
          >SKU列表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:right;margin-top:10px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[15, 50, 100, 200]"
      :page-size="15"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRow"
    ></el-pagination>
    <div class="clearfix"></div>
  </div>
</template>
<script>
import { getRetailTraderList } from '@/api/retailTraderSkuManage/retailTraderSkuManage'
export default {
  data() {
    return {
      search: {
        description: '',
        supplyType: '-1',
      },
      tableData: [],
      currentPage: 1,
      totalRow: 0,
      totalPage: 0,
      pageSize: 15,
      pageIndex: 1,
    }
  },
  created() {
    this.getData()
  },
  methods: {
    edit(row) {
      this.$router.push({
        path: '/retailTraderSkuManageInfo',
        query: {
          id: row.PartnerId,
          name: row.Description
        }
      })
    },
    getsearch() {
      this.pageIndex = 1;
      this.getData();
    },
    getData() {
      const p = Object.assign(this.search, {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      });
      getRetailTraderList(p).then(res => {
        console.log(res.Data.length)
        this.tableData = res.Data
        this.currentPage = res.PageIndex;
        this.totalPage = res.TotalPages;
        this.totalRow = res.TotalRows;
      })
    },
    handleSizeChange(v) {
      this.pageSize = v
      this.getData()
    },
    handleCurrentChange(v) {
      this.pageIndex = v
      this.getData()
    }
  }
}
</script>
