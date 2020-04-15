<template>
  <div class="content_box roleadd goodsManage">
    <m-title title='商品级别管理'></m-title>
    <div class="box">
      <el-button v-if='checkBtn("func_goods_firstcategory_add")' @click="append({PCode:'',Code:'',Name:'------'})" class="pan-btn green-btn" type="success" size="mini" icon="el-icon-plus">新增一级类别</el-button>
      <el-tree accordion :default-expanded-keys='expKeys' node-key='Code' :highlight-current='1 === 1' :data="list" :load="loadNode"
        lazy :props="defaultProps" ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span class="btn_list">
            <el-button v-if='node.level !== 3 && checkBtn("func_common_add")' type="text" size="mini" @click="() => append(data, node)">新增</el-button>
            <el-button type="text" v-if='checkBtn("func_common_edit")' size="mini" @click="() => edit(data, node)">修改</el-button>
            <el-button type="text" v-if='checkBtn("func_common_delete")' size="mini" @click="() => remove(data, node)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog :close-on-click-modal='1 == 0' v-if="dialogVisible" :title="isedit ? '编辑类别' : '新增下级类别'" :visible.sync="dialogVisible"
      width='30%'>
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">当前类别：</div>
          <div class="info_right">{{ info.pName }}</div>
        </div>
        <div class="info_item">
          <div class="info_title">{{ isedit ? '当前类别名称' : '下级类别名称' }}：</div>
          <div class="info_right">
            <el-input v-model='info.name' placeholder="请输入下级类别名称" size='mini'></el-input>
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
  import { getList, add, del } from '@/api/merchandisecategories/index'
  export default {
    components: { MTitle },
    data() {
      return {
        list: [],
        expKeys: [],
        dialogVisible: false,
        info: {
          name: '',
          pCode: '',
          pName: ''
        },
        isedit: false,
        openCode: [],
        CurCode: '',
        roleBtn: [],
        defaultProps: {
          children: 'ChildMenu',
          label: 'Name',
          isLeaf: 'IsLeaf'
        }
      }
    },
    activated() {
      this.CurCode = ''
      this.getData().then(res => {
        this.list = res
      })
    },
    created() {
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
      this.CurCode = ''
      this.getData().then(res => {
        this.list = res
      })
    },
    watch: {
      dialogVisible: function(n, o) {
        if (!n) {
          this.info.name = ''
          this.info.pCode = ''
          this.info.pName = ''
        }
      }
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
      edit(data, node) {
        // delete this.info.pCode
        if (data.Level === 2) {
          this.openCode[0] = data.PCode
          this.openCode[1] = data.Code
        } else if (data.Level === 3) {
          this.openCode[0] = node.parent.parent.data.Code
          this.openCode[1] = data.PCode
          this.openCode[2] = data.Code
        } else {
          this.openCode[0] = data.Code
        }
        this.isedit = true
        this.info.Code = data.Code
        this.info.name = data.Name
        this.info.pName = data.Name
        this.info.pCode = data.PCode
        this.dialogVisible = true
      },
      append(data) {
        delete this.info.Code
        if (data.Level === 2) {
          this.openCode[0] = data.PCode
          this.openCode[1] = data.Code
        } else {
          this.openCode[0] = data.Code
        }
        this.isedit = false
        this.info.pCode = data.Code
        this.info.pName = data.Name
        this.dialogVisible = true
      },
      add() {
        if (this.info.name !== '') {
          add(this.info).then(res => {
            this.$message.success(this.isedit ? '编辑成功！' : '新增成功！')
            this.CurCode = ''
            this.dialogVisible = false
            this.expKeys = this.openCode
            this.getData().then(res => {
              this.list = res
            })
          })
        } else {
          this.$message.error('请输入名称')
        }
      },
      remove(data, node) {
        const _this = this
        this.$confirm('确定删除这个类别吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(r => {
          if (data.Level === 2) {
            _this.openCode[0] = data.PCode
            _this.openCode[1] = data.Code
          } else if (data.Level === 3) {
            _this.openCode[0] = node.parent.parent.data.Code
            _this.openCode[1] = data.PCode
            _this.openCode[2] = data.Code
          } else {
            _this.openCode[0] = data.Code
          }
          del({ code: data.Code }).then(res => {
            _this.$message.success('删除成功！')
            _this.CurCode = ''
            _this.expKeys = _this.openCode
            _this.getData().then(res => {
              _this.list = res
            })
          })
        })
      },
      loadNode(node, resolve) {
        if (node.level === 0) return
        this.CurCode = node.data.Code
        this.getData().then(res => {
          resolve(res)
        })
      },
      getData() {
        return new Promise((rs, rj) => {
          getList({
            CurCode: this.CurCode
          }).then(res => {
            rs(res)
          })
        })
      }
    }
  }
</script>
<style scoped>
  .box {
    border: 1px solid #e6e6e6;
    width: 450px;
    margin: 0 auto;
    margin-top: 15px;
    padding: 15px
  }

  .box * {
    font-size: 12px;
  }
  .custom-tree-node {
    display: flex;
    width: 100%;
    justify-content: space-between
  }

  .custom-tree-node span {
    display: block;
    line-height: 29px;
  }

  .info_item {
    display: flex;
    height: 40px;
    line-height: 40px;
  }

  .info_item .info_title {
    flex: 0 0 100px;
    text-align: right;
  }

  .info_item .info_right {
    flex: 0 0 200px;
  }
  
</style>