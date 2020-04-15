<template>
  <div class="content_box roleadd goodsManage sku">
    <div class="box">
      <div class="box_right">
        <div class="title addSku">SKU类别属性
          <el-button v-if='checkBtn("func_sku_attribute_add")' @click='addMoreAttr' class="addskubtn" type="text" size="mini">新增SKU属性</el-button>
        </div>
        <div class="searchBox">
          <div class="desc">
            <div class="prop" v-for='item in attrlist' :key='item.Id'>
              <div class="prop_title">{{item.Name}} [{{item.ValType == 0 ? "单选" : "多选"}}]
                <el-button v-if='checkBtn("func_sku_attribute_remove")' @click.stop='delSkuAttr(item)' class="addskubtn red" type="text" size="mini">删除SKU属性</el-button>
              </div>
              <div class="prop_box">
                <el-tag @close.stop='delSkuAttrVal(ite)' class="prop_tag" type="success" close='' closable :key='ite.Id' v-for='ite in item.PropVals'>{{ ite.Val }}</el-tag>
                <el-button  v-if='checkBtn("func_sku_attributevalue_add")' @click.stop='addAttrVal(item)' type="text" size="mini">添加属性值</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="searchBox">
          <div class="boxbox">
            <el-tag @close.stop='delSkuSpec(item)' class="prop_tag" type="success" close='' closable :key='item.Id' v-for='item in speclist'>{{ item.StandardName }}</el-tag>
          </div>
        </div>
      </div>
      <!--新增sku属性-->
      <el-dialog :close-on-click-modal='false' title="新增SKU类别属性" :visible.sync="addAttrVisible" width='30%'>
        <div class="infoBox">
          <div class="info_item">
            <div class="info_title">
              <span class="red">*</span>属性名称：</div>
            <div class="info_right">
              <el-input class="inputClass" v-model='addAttr.Name' placeholder="请输入属性名称" size='mini'></el-input>
            </div>
          </div>
          <div class="info_item">
            <div class="info_title">
              <span class="red">*</span>属性类型：</div>
            <div class="info_right">
              <el-select size='mini' v-model="addAttr.ValType" placeholder="请选择">
                <el-option v-for="item in addAttrOptions" :key="item.value" :label="item.label" :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size='mini' @click="addAttrVisible = false">取 消</el-button>
          <el-button size='mini' type="primary" @click="addAttrs">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :close-on-click-modal='false' title="新增SKU属性值" :visible.sync="addAttrValVisible" width='30%'>
        <div class="infoBox">
          <div class="info_item">
            <div class="info_title">
              <span class="red">*</span>属性值名称：</div>
            <div class="info_right">
              <el-input class="inputClass" v-model='addAttrValName' placeholder="请输入属性值名称" size='mini'></el-input>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size='mini' @click="addAttrValVisible = false">取 消</el-button>
          <el-button size='mini' type="primary" @click="addAttrsVal">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { getAttr, addAttr, delAttr, addAttrProp, delAttrProp } from '@/api/sku/prop'
  export default {
    data() {
      return {
        checkedAddSpecList: [],
        addSpecList: [],
        addAttrValInfo: {},
        addSkuSpecVisible: false,
        addAttrValName: '',
        addAttrValVisible: false,
        addAttrVisible: false,
        addAttr: {
          Name: '',
          CateCode: '',
          ValType: 0
        },
        addAttrOptions: [{
          value: 1,
          id: 0,
          label: '单选'
        }, {
          value: 2,
          id: 1,
          label: '多选'
        }],
        CurCode: '',
        typelist: [],
        attrlist: [],
        roleBtn: [],
        speclist: [],
        defaultProps: {
          children: 'ChildMenu',
          label: 'Name',
          isLeaf: 'IsLeaf'
        }
      }
    },
    created() {
      this.typelist = []
      this.attrlist = []
      this.speclist = []
      this.getAttr()
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
      // 新增sku属性值
      addAttrVal(item) {
        this.addAttrValVisible = true
        this.addAttrValInfo = item
      },
      addAttrsVal() {
        if (this.addAttrValName === '') {
          this.$message.error('请输入属性值名称！')
          return
        } else {
          addAttrProp({
            CateCode: this.addAttrValInfo.CateCode,
            PropId: this.addAttrValInfo.Id,
            Name: this.addAttrValInfo.Name,
            Val: this.addAttrValName
          }).then(() => {
            this.$message.success('新增成功')
            this.getAttr(this.addAttrValInfo.CateCode)
            this.addAttrValName = ''
            this.addAttrValVisible = false
          })
        }
      },
      // 新增sku属性
      addMoreAttr() {
        this.addAttrVisible = true
      },
      addAttrs() {
        if (this.addAttr.Name === '') {
          this.$message.error('请输入属性名称')
          return
        } else {
          addAttr(this.addAttr).then(() => {
            this.$message.success('新增成功')
            this.getAttr(this.addAttr.CateCode)
            this.addAttrVisible = false
            this.addAttr.Name = ''
            this.addAttr.ValType = 0
          })
        }
      },
      delSkuAttrVal(item) {
        if (!this.checkBtn('func_sku_attributevalue_add')) return
        this.$confirm('确定要删除这个属性值吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.ValId = item.Id
          delAttrProp(item).then(() => {
            this.$message.success('删除成功')
            this.getAttr(item.CateCode)
          })
        })
      },
      delSkuAttr(item) {
        this.$confirm('确定要删除这个属性吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAttr({
            PropId: item.Id,
            Name: item.Name,
            CateCode: item.CateCode
          }).then(() => {
            this.$message.success('删除成功')
            this.getAttr(item.CateCode)
          })
        })
      },
      edit(data, node) {
        if (node.level === 3) {
          this.getSpec(data.Code)
          this.getAttr(data.Code)
        }
      },
      getAttr() {
        getAttr().then(res => {
          this.attrlist = res
        })
      }
    }
  }
</script>
<style scoped>
  .checkBox {
    margin-bottom: 10px !important;
    margin-left: 0 !important;
    margin-right: 10px !important;
  }

  .addSku {
    justify-content: flex-start !important;
  }

  .addskubtn {
    margin-left: 10px;
  }

  .prop_tag {
    margin-right: 10px;
  }

  .prop_box {
    padding: 15px
  }

  .prop:nth-child(1)>.prop_title {
    border-top: none !important;
  }

  .prop_title {
    border-bottom: 1px solid #eaeaea;
    border-top: 1px solid #eaeaee;
    font-weight: bold;
    font-size: 12px;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    color: #333;
  }

  .nf {
    display: block !important;
  }

  .blue {
    color: #409EFF;
    line-height: 35px;
    cursor: pointer;
  }

  .searchBox {
    padding: 0 !important
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
    color: #F56C6C !important;
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


  .boxbox {
    padding: 15px;
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

  .box_left .title,
  .box_right .title {
    background-color: hsla(220, 4%, 58%, .1) !important;
    padding: 0 15px;
    color: #333;
    font-size: 14px !important;
    border-bottom: 1px solid #eaeaea !important;
  }

  .box_right {
    flex: 1;
    border: 1px solid #e6e6e6;
    margin-left: 10px;
  }
</style>