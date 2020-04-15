<template>
  <div class="content_box roleadd goodsManage sku">
    <div class="box">
      <div class="box_left">
        <div class="title">
          SKU规格
          <el-button
            v-if="checkBtn('func_sku_specification_add')"
            type="text"
            size="mini"
            @click="showAdd"
          >新增SKU规格</el-button>
        </div>
        <ul class="sepcList">
          <li @click="showList(item.Vals,item)" v-for="item in specList" :key="item.Id" :class="{'border':add.StdId == item.Id}">
            {{item.StandardName}}
            <span>
              <el-button
                v-if="checkBtn('func_sku_specification_remove')"
                @click.stop="delSpecItem(item)"
                type="text"
                size="mini"
              >删除</el-button>
            </span>
            <el-checkbox
              v-if="item.IsDuration"
              v-model="item.IsDuration"
              class="check"
              disabled
              @click.stop.native
            >效期</el-checkbox>
          </li>

          <li v-if="specList.length == 0">暂无数据</li>
        </ul>
      </div>
      <div class="box_right">
        <div class="title addSku">
          SKU规格值
          <el-button
            v-if="add.StdId != '' && checkBtn('func_sku_specificationvalue_add')"
            class="addskubtn"
            type="text"
            size="mini"
            @click="showAddItem"
          >新增SKU规格值</el-button>
        </div>
        <div class="boxbox">
          <el-tag
            type="success"
            @close="delskuspecitem(item,index)"
            closable
            class="tags"
            :key="item.Id"
            v-for="(item,index) in list"
          >{{ item.Val }}</el-tag>
          <span v-if="list.length == 0">暂无数据</span>
        </div>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU规格"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title lh40">规格类型：</div>
          <div class="info_right">
            <el-select
              v-model="spec.standardType"
              placeholder="请选择"
              size="mini"
              style="margin-top:4px;width:200px"
            >
              <el-option label="普通规格" value="1"></el-option>
              <el-option label="日期" value="2"></el-option>
              <el-option label="数量" value="3"></el-option>
            </el-select>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title lh40">规格名称：</div>
          <div class="info_right">
            <el-input class="inputClass lh40" v-model="spec.name" placeholder="请输入规格名称" size="mini"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeSpec">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSpec">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU规格值"
      :visible.sync="addVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item" v-if="add.standardType=='3'">
          <div class="info_title">数量：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              @keyup.native="number"
              v-model="add.standardQuantity"
              placeholder="请输入数量"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item" v-if="add.standardType=='1'||add.standardType=='3'" style="margin-top:20px">
          <div class="info_title">规格值：</div>
          <div class="info_right">
            <el-input class="inputClass" v-model="add.Val" placeholder="请输入规格值" size="mini"></el-input>
          </div>
        </div>

        <div class="info_item" v-if="add.standardType=='2'">
          <div class="info_title lh40">效期格式：</div>
          <div class="info_right">
            <el-radio-group class="lh40" v-model="add.valDateType" style="margin-top:4px">
              <el-radio :label="0">年月日</el-radio>
              <el-radio :label="1">年月</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="info_item" v-if="add.standardType=='2' && add.valDateType!==null ">
          <div class="info_title">规格值日期：</div>
          <div class="info_right">
            <el-date-picker
              :value-format=" add.valDateType == 1?'yyyy-MM':'yyyy-MM-dd' "
              class="inputClass"
              v-model="add.Val"
              :type="add.valDateType == 1?'month':'date'"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAdd">取 消</el-button>
        <el-button size="mini" type="primary" @click="addItem">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSkuSpecList,
  delSkuSpec,
  delSkuSpecItem,
  addSkuSpec,
  addSkuSpecItem
} from "@/api/sku/skuspec";
export default {
  data() {
    return {
      specList: [],
      list: [],
      dialogVisible: false,
       addVisible: false,
      spec: {
        name: "",
        standardType: ""
      },
      roleBtn: [],
      add: {
        StdId: "",
        standardQuantity: null,
        standardType: "",
        StdName: "",
        Val: "",
        valDateType: null
      },
      specification: false //日期规格
    };
  },
  activated() {
    this.getList();
  },
  created() {
    this.getList();
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
  },
  methods: {
    number() {
      this.add.standardQuantity = this.add.standardQuantity.replace(
        /[^\.\d]/g,
        ""
      );
      this.add.standardQuantity = this.add.standardQuantity.replace(".", "");
    },
    checkBtn(str) {
      let f = false;
      this.roleBtn.forEach(item => {
        if (item.FunctionCode === str) {
          f = true;
        }
      });
      return f;
    },
    showAddItem() {
      console.log("this.add.StandardType: ", this.add.standardType);
      this.addVisible = true;
    },
    addItem() {
      if (this.specification) {
        //日期验证
        if (this.add.valDateType === null) {
          this.$message.error("请选择规格日期格式");
          return;
        }
        if (this.add.Val === "") {
          this.$message.error("请输入规格日期");
          return;
        }
      }
      if (!this.specification) {
        if (this.add.Val === "") {
          this.$message.error("请输入规格名称");
          return;
        }
      }
      if (this.add.standardType=='3') {
        if (this.add.standardQuantity == ""||this.add.standardQuantity == null) {
          this.$message.error("请输入数量");
          return;
        }
      }
      this.add.standardQuantity=Number(this.add.standardQuantity)
      addSkuSpecItem(this.add).then(res => {
        this.$message.success("新增成功");
        this.add.Val = "";
        this.add.standardQuantity = "";
        this.add.valDateType = null;
        this.list.push(res);
        this.addVisible = false;
      });
    },
    closeAdd() {
      this.addVisible = false;
      this.add.Val = "";
      this.add.valDateType = null;
    },
    addSpec() {
      if (this.spec.name === "") {
        this.$message.error("请输入规格名称");
        return;
      }
      if (this.spec.standardType == "") {
        this.$message.error("请选择规格类型");
        return;
      }
      addSkuSpec(this.spec).then(res => {
        this.$message.success("新增成功");
        this.dialogVisible = false;
        this.spec = { name: "", standardType: "" };
        this.getList();
      });
    },
    closeSpec() {
      this.dialogVisible = false;
      this.spec = { name: "", standardType: "" };
    },
    delskuspecitem(item, index) {
      if (!this.checkBtn("func_sku_specificationvalue_remove")) return;
      this.$confirm("确定要删除这个规格值吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delSkuSpecItem({
          StdId: item.StandardId,
          ValId: item.Id,
          Val: item.Val
        }).then(res => {
          this.$message.success("删除成功");
          this.list.splice(index, 1);
          this.getList();
        });
      });
    },
    showAdd() {
      this.dialogVisible = true;
    },
    showList(vals, item) {
      console.log("item: ", item);
      console.log("vals: ", vals);

      this.add.Val = "";
      this.add.standardType = item.StandardType;
      this.add.StdId = item.Id;
      this.add.StdName = item.StandardName;
      this.list = vals;
      this.specification = item.IsDuration;
    },
    delSpecItem(item) {
      this.$confirm("确定要删除这个规格吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delSkuSpec({
          id: item.Id,
          Name: item.StandardName
        }).then(res => {
          this.$message.success("删除成功");
          this.getList();
        });
      });
    },
    getList() {
      getSkuSpecList().then(res => {
        res.map(v => {
          v.IsDuration = v.IsDuration == 1 ? true : false;
        });
        this.specList = res;
        console.log("this.specList: ", this.specList);
      });
    }
  }
};
</script>
<style scoped>
.border{
  border:#409eff 1px solid !important;
}
.check {
  float: right;
  font-size: 12px;
  margin-right: 10px;
}
.addSku {
  justify-content: flex-start !important;
}

.addSku .addskubtn {
  margin-left: 10px;
}

.tags {
  margin-right: 10px;
  margin-bottom: 10px;
}

.inputClass {
  flex: 0 0 200px;
  margin-right: 10px;
}

.sepcList li {
  line-height: 45px;
  border-bottom: 1px solid #e6e6e6;
  list-style: none;
  box-sizing: border-box;
  padding: 0 10px;
  cursor: pointer;
}

.sepcList {
  padding-left: 0 !important;
  margin: 0;
}

.sepcList li span {
  float: right;
  text-align: right;
}

.nf {
  display: block !important;
}

.blue {
  color: #409eff;
  line-height: 35px;
  cursor: pointer;
}

.inputClass {
  flex: 0 0 200px;
  margin-right: 10px;
}

.box_left .title,
.box_right > .title {
  height: 45px;
  line-height: 45px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #909399;
  display: flex;
  justify-content: space-between;
}

.desc {
  padding: 0 15px;
  padding-top: 10px;
}

.red {
  color: #f56c6c;
}

.desc .item {
  line-height: 45px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 120px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 0 0 300px;
}

.info_item {
  display: flex;
}

.info_title span {
  color: #ff0000;
  padding-right: 5px;
}

.upload {
  height: 180px !important;
}

.info_item .info_title {
  flex: 0 0 100px;
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
  padding: 20px 0;
}

.box_left {
  flex: 0 0 250px;
  box-sizing: border-box;
  border: 1px solid #e6e6e6;
}

.box_left .title,
.box_right .title {
  background-color: hsla(220, 4%, 58%, 0.1) !important;
  padding: 0 15px;
  color: #333;
  font-size: 14px !important;
  border-bottom: 1px solid #eaeaea !important;
}

.boxbox {
  padding: 15px;
}

.box_right {
  flex: 1;
  border: 1px solid #e6e6e6;
  margin-left: 10px;
}
</style>