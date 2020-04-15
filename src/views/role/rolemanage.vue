<template>
  <div class="content_box">
    <m-title title='角色管理'></m-title>
    <div class="searchBox">
      <el-row>
        <el-col :span='4'>
          <span class="timed">角色名称：</span>
          <el-input v-model='search.name' class="search_title" size='small' placeholder="请输入角色名称">
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button class="search_btn pan-btn green-btn" @click='getData' type="success" size='mini' icon='el-icon-search'>查询</el-button>
          <el-button @click='jump(-1)' class="pan-btn green-btn addbtn" type="success" size="mini" icon="el-icon-plus">新增角色</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label='ID' prop='Id' align='center' width='100'></el-table-column>
      <el-table-column label='角色名称' prop='Role' align='center'></el-table-column>
      <el-table-column label='备注' prop='Desc' align='center'></el-table-column>
      <el-table-column label='操作' align='center' width='220'>
        <template slot-scope="scope">
          <el-button class="pan-btn blue-btn" type="primary" @click="jump(scope.row.Id)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button class="pan-btn red-btn" type="danger" @click='deleteRole(scope.row)' size="mini" icon="el-icon-close">删除</el-button>
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
  import { getRoleList, delRole } from '@/api/role/rolemanage'
  export default {
    components: { MTitle },
    data() {
      return {
        pageIndex: 1,
        pageSize: 15,
        totalRow: 0,
        list: [],
        search: {
          name: ''
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
      jump(id) {
        this.$router.push({
          path: '/roleadd',
          query: {
            id: id
          }
        })
      },
      deleteRole(row) {
        this.$confirm('确定删除该角色吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          delRole({ id: row.Id }).then(res => {
            this.$message.success('删除成功！')
            this.getData()
          })
        })
      },
      handleSizeChange(v) {
        this.pageSize = v
        this.getData()
      },
      handleCurrentChange(v) {
        this.pageIndex = v
        this.getData()
      },
      getData() {
        getRoleList({ pageSize: this.pageSize, pageIndex: this.pageIndex, name: this.search.name }).then(res => {
          this.pageIndex = res.PageIndex
          this.totalRow = res.TotalRows
          this.list = res
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