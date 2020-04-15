<template>
  <div class="content_box roleadd goodsManage sku">
    <div class="box">
      <div class="box_left">
        <div class="title">分销商SKU类别
        </div>
        <el-tree @node-click='edit' accordion :highlight-current='true' :data="typelist" :load="loadNode" lazy :props="defaultProps"
          ref="tree">
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="box_right">
        <div class="title">分销商SKU类别编辑</div>
        <div class="searchBox">
          <div class="desc">
            <div class="info_item">
              <div class="info_title">上级类别：</div>
              <div class="info_right">
                <el-input disabled class="inputClass" v-model='base.pstr' size='mini'></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">类别名称：</div>
              <div class="info_right">
                <el-input disabled placeholder='请输入类别名称' class="inputClass" v-model='base.Name' size='mini'></el-input>
              </div>
            </div>
             <div class="info_item">
              <div class="info_title">规格数量：</div>
              <div class="info_right">
                <el-input placeholder='请输入规格数量，以逗号分隔' class="inputClass" v-model='base.StandardQuantity' size='mini'></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title"></div>
              <div class="info_right">
                <el-row>
                  <el-col :span='4'>
                    <el-button :disabled="base.StandardQuantity.length < 1 || base.Name == ''" @click='save' size="mini" type="success" class="nm">保存SKU规格</el-button>
                     <el-button :disabled="base.StandardQuantity.length < 1 || base.Name == ''" @click='del' size="mini" type="danger" class="nm">清空SKU规格</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getSkuList } from '@/api/adv/recGoods'
  import { editSKUType, delSKUType,getReSkuTypeList,editSkuTypeList,delSkuTypeList } from '@/api/sku/skucategorymanage'
  export default {
    data() {
      return {
        CurCode: '',
        typelist: [],
        isAdd: true,
        base: {
          PCode: '',
          Code: '',
          Name: '',
          Icon: '',
          Id: '',
          PName: '',
          Weight: '',
          StandardQuantity: '',
          pstr: ''
        },
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
      this.getList().then(res => {
        this.typelist = res
      })
    },
    created() {
      this.CurCode = ''
      this.roleBtn = this.$store.getters.getMenuForId(this.$route.path)
      this.getList().then(res => {
        this.typelist = res
      })
    },
    methods: {
      del() {
        this.$confirm('确定要清空这个规格吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSkuTypeList({
            id: this.base.Id,
            categoryCode: this.base.Code
          }).then(() => {
            this.$message.success('清空成功')
            this.CurCode = ''
            this.getList().then(res => {
              this.typelist = res
              this.clearBase()
            })
          })
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
      add() {
        this.clearBase()
      },
      clearBase() {
        this.base = {
          PCode: '',
          Code: '',
          Name: '',
          Weight: '',
          Id: '',
          Icon: '',
          PName: '',
          pstr: '',
          StandardQuantity: ''
        }
      },
      save() {
        if (this.base.StandardQuantity.length < 1) {
          this.$message.error('请输入规格数量')
          return
        }
        editSkuTypeList({
          categoryCode: this.base.Code,
          standardQuantitys: this.base.StandardQuantity
        }).then(res => {
          this.$message.success('操作成功')
          this.CurCode = ''
          this.getList().then(res => {
            this.typelist = res
            this.clearBase()
          })
        })
      },
      getList() {
        return new Promise((rs, rj) => {
          getReSkuTypeList({ categoryCode: this.CurCode }).then(res => {
            rs(res)
          })
        })
      },
      edit(data) {
        let o = JSON.parse(JSON.stringify(data))
        let str = []
        o.StandardQuantity.map(v => {
          str.push(v.StandardQuantitys)
        })
        o.pstr = o.PName + "-" + o.PCode
        o.StandardQuantity = str.join(',')
        this.base = o
        this.$forceUpdate()
      },
      loadNode(node, resolve) {
        if (node.level === 0) return
        this.CurCode = node.data.Code
        this.getList({ CurCode: this.CurCode }).then(res => {
          resolve(res)
        })
      }
    }
  }
</script>
<style scoped>
  .nf {
    display: block !important;
  }

  .blue {
    color: #409EFF;
    line-height: 35px;
    cursor: pointer;
  }

  .inputClass {
    flex: 0 0 200px;
    margin-right: 10px;
  }

  .box_left .title,
  .box_right>.title {
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    font-weight: bold;
    border-bottom: 1px solid #909399;
    display: flex;
    justify-content: space-between
  }


  .red {
    color: #F56C6C;
  }

  .desc .item {
    line-height: 45px;
    display: flex;
    font-size: 14px;
  }

  .desc .item .title {
    flex: 0 0 120px;
    text-align: right;
    padding-right: 10px
  }

  .desc .item .item_desc {
    flex: 0 0 300px;
  }

  .info_item {
    display: flex;
    height: 40px;
  }

  .info_title span {
    color: #ff0000;
    padding-right: 5px
  }

  .upload {
    height: 180px !important;
  }

  .info_item .info_title {
    flex: 0 0 120px;
    line-height: 29px;
    text-align: right;
  }

  .info_item .info_right {
    flex: 1;
    display: flex;
  }

.box {
    display: flex;
    min-height: calc(100vh - 84px);
    padding: 20px 0
  }
  .box_left {
    flex: 0 0 250px;
    box-sizing: border-box;
    border: 1px solid #e6e6e6
  }
  .box_left .title,.box_right .title{
    background-color: hsla(220,4%,58%,.1) !important;
    padding:0 15px;
    color: #333;
    font-size: 14px !important;
    border-bottom: 1px solid #eaeaea !important;
  }
  .searchBox{
    padding:15px !important
  }
  .box_right {
    flex: 1;
    border: 1px solid #e6e6e6;
    margin-left: 10px;
  }
</style>