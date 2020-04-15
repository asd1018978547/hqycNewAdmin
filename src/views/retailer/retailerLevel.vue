<template>
  <div class="content_box">
    <m-title title='商户级别管理'></m-title>
    <el-button @click='showmodel(1)' v-if='checkBtn("func_common_add")' class="pan-btn green-btn addbtn" type="primary" size="mini" icon="el-icon-plus">新增商户级别</el-button>
    <el-table :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label='ID' prop='Id' align='center' width='100'></el-table-column>
      <el-table-column label='级别名称' prop='Name' align='center'></el-table-column>
      <el-table-column label='级别说明' prop='Summary' align='center'></el-table-column>
      <el-table-column label='操作' align='center' width='220'>
        <template slot-scope="scope">
          <el-button v-if='checkBtn("func_common_edit")' class="pan-btn blue-btn" type="success" @click="showmodel(scope.row)" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button v-if='checkBtn("func_common_delete")' class="pan-btn red-btn" type="primary" @click='deleteLevel(scope.row)' size="mini" icon="el-icon-close">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal='1 == 0' v-if="dialogVisible" :title="dialogTitle" :visible.sync="dialogVisible" width='30%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">级别名称：</div>
          <div class="info_right">
            <el-input v-model='info.name' placeholder="请输入级别名称" size='mini'></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">级别说明：</div>
          <div class="info_right">
            <el-input v-model='info.summary' placeholder="请输入级别说明" size='mini'></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size='mini' @click="dialogVisible = false">取 消</el-button>
        <el-button size='mini' type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import MTitle from '@/components/MTitle'
  import { getLevel, delLevel, addLevel, editLevel } from '@/api/retailer'
  export default {
    components: { MTitle },
    data() {
      return {
        list: [],
        dialogTitle: '新增级别',
        dialogVisible: false,
        isedit: false,
        roleBtn: [],
        info: {
          name: '',
          summary: '',
          id: ''
        }
      }
    },
    activated() {
      this.getData()
    },
    created() {
      this.getData()
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
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
      add() {
        if (this.info.name === '') {
          this.$message.error('请输入级别名称')
          return
        }
        if (this.info.summary === '') {
          this.$message.error('请输入级别说明')
          return
        }
        if (this.isedit) {
          editLevel(this.info).then(res => {
            this.hideModel()
          })
        } else {
          addLevel(this.info).then(res => {
            this.hideModel()
          })
        }
      },
      hideModel() {
        this.$message.success(this.isedit ? '修改成功' : '新增成功')
        this.dialogVisible = false
        this.getData()
      },
      showmodel(data) {
        if (typeof data === 'object') {
          this.info.name = data.Name
          this.info.summary = data.Summary
          this.info.id = data.Id
          this.isedit = true
        } else {
          this.info.name = ''
          this.info.summary = ''
          this.info.id = ''
          this.isedit = false
        }
        this.dialogVisible = true
      },
      deleteLevel(row) {
        this.$confirm('确定删除这个级别吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delLevel({
            id: row.Id
          }).then(res => {
            this.$message.success('删除成功')
            this.getData()
          })
        }).catch()
      },
      getData() {
        getLevel({ pageSize: 9999 }).then(res => {
          this.list = res.Data
        })
      }
    }
  }
</script>
<style scoped>
  .addbtn {
    margin-top: 15px;
    margin-bottom: 15px;
  }

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