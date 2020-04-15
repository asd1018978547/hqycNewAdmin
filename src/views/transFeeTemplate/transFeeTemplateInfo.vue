<template>
  <div class="content_box tftt">
    <m-title title="运费模版详情"></m-title>
    <div class="desc">
      <div class="item">
        <div class="title">贸易类型：</div>
        <div class="item_desc">
          <el-select
            v-model="info.OrderTypeId"
            clearable
            class="search_title"
            size="mini"
            placeholder="请选择模版类型"
          >
            <el-option label="保税备货" value="2"></el-option>
            <el-option label="跨境直邮" value="1"></el-option>
            <el-option label="一般贸易" value="3"></el-option>
          </el-select>
        </div>
      </div>
      <div class="item">
        <div class="title">运费模版名称：</div>
        <div class="item_desc">
          <el-input
            style="width:175px;"
            class="info_address"
            v-model="info.Name"
            placeholder="请输入运费模版名称"
            size="mini"
          ></el-input>
        </div>
      </div>
      <!-- <div class="item">
        <div class="title">宝贝地址：</div>
        <div class="item_desc">
          <el-select
            v-model="info.Country"
            size="mini"
            placeholder="请选择仓库地址"
            @change="chooseContryDetail"
          >
            <el-option
              v-for="(item,index) in storeAddress"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <el-cascader
            size="mini"
            v-if="info.Country == '中国' || info.Country == '澳大利亚'"
            v-model="info.addressCode"
            separator="-"
            placeholder="请选择地址"
            :props="areaOptions"
            :options="address"
            filterable
            clearable
          ></el-cascader>
        </div>
      </div>-->
      <div class="item">
        <div class="title">是否包邮：</div>
        <div class="item_desc">
          <el-radio class="rd" v-model="info.IsCharge" label="1">自定义运费</el-radio>
          <el-radio class="rd" v-model="info.IsCharge" label="0">卖家承担运费</el-radio>
        </div>
      </div>
      <div class="item">
        <div class="title">计价方式：</div>
        <div class="item_desc">
          <el-radio class="rd" v-model="info.ChargeMode" label="1">按件计</el-radio>
          <el-radio class="rd" v-model="info.ChargeMode" label="2">按重量</el-radio>
          <!-- <el-radio class="rd" v-model="radio" label="2">按体积</el-radio> -->
          <span  v-if="info.IsCharge != 0" style="margin-left:15px;color:#ff0000">(切换计价方式会导致下方运费模版运费全部清空)</span>
        </div>
      </div>
      <div class="item">
        <div class="title">运送方式：</div>
        <div class="item_desc">
          <p v-if="info.IsCharge != 0">除指定地区外，其余地区的运费采用“默认运费”</p>
          <div class="yf" :key="index" v-for="(item,index) in info.items">
            <p>
              <el-checkbox v-model="item.IsDefault == 1">快递运输</el-checkbox>
            </p>
            <div v-if="info.IsCharge != 0">默认运费
            <el-input
              @change="(val) => { numChange(val, item, 'FirstNumber') }"
              style="width:100px;"
              class="info_address"
              v-model="item.FirstNumber"
              size="mini"
            ></el-input>
            {{ info.ChargeMode == 1 ? '件' : 'Kg' }}/内
            <el-input
              @change="(val) => { priceChange(val, item, 'FirstTransFee') }"
              style="width:100px;"
              class="info_address"
              v-model="item.FirstTransFee"
              size="mini"
            ></el-input>元，
            每增加
            <el-input
              @change="(val) => { numChange(val, item, 'SecondNumber') }"
              style="width:100px;"
              class="info_address"
              v-model="item.SecondNumber"
              size="mini"
            ></el-input>
            {{ info.ChargeMode == 1 ? '件' : 'Kg' }}，增加运费
            <el-input
              @change="(val) => { priceChange(val, item, 'SecondTransFee') }"
              style="width:100px;"
              class="info_address"
              v-model="item.SecondTransFee"
              size="mini"
            ></el-input>元
            </div>
          </div>
          <el-table id="tables" :data="list" border fit highlight-current-row style="width: 70%">
            <el-table-column label="运送到" prop="Name" align="center" width="240">
              <template slot-scope="scope">
                {{ getCityStr(scope.row.Areas) }}
                <el-button type="text" @click="editCityCol(scope)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column
              :label="info.ChargeMode == 1 ? '首件(件)' : '首重(Kg)'"
              prop="FirstNumber"
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.FirstNumber"
                  size="mini"
                  @change="(val) => { numChange(val, scope.row, 'FirstNumber') }"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="首费(元)" prop="FirstTransFee" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.FirstTransFee"
                  size="mini"
                  @change="(val) => { priceChange(val, scope.row, 'FirstTransFee') }"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              :label="info.ChargeMode == 1 ? '续件(件)' : '续重(Kg)'"
              prop="SecondNumber"
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.SecondNumber"
                  size="mini"
                  @change="(val) => { numChange(val, scope.row, 'SecondNumber') }"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="续费(元)" prop="SecondTransFee" align="center">
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.SecondTransFee"
                  size="mini"
                  @change="(val) => { priceChange(val, scope.row, 'SecondTransFee') }"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="Name" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="delCity(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="item" style="margin-top:10px;">
        <div class="title"></div>
        <div class="item_desc">
          <el-button
            style="margin-bottom:15px;"
            @click="showdig"
            size="small"
            type="success"
            icon="el-icon-plus"
          >为指定地区城市设置运费</el-button>
          <el-button @click="add" size="small" type="success" icon="el-icon-plus">提交保存</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="选择城市" :visible.sync="dialogVisible" width="800px" :show-close="false">
      <div class="citybox">
        <el-row>
          <el-col
            style="margin-bottom:10px;"
            :key="index"
            v-for="(item,index) in citylist"
            :span="6"
          >
            <el-checkbox
              :disabled="item.isCheck || calcCityCheckNum(item)"
              :indeterminate="item.val.length > 0 && item.val.length < item.Children.length"
              class="mr10"
              @change="selectAll(item)"
              size="mini"
              v-model="item.isSelectedAll"
            ></el-checkbox>
            <el-popover placement="bottom" width="400" trigger="click">
              <el-checkbox-group v-model="item.val" @change="handleCheckedCitiesChange(item)">
                <el-checkbox
                  :disabled="(item.isCheck || city.isCheck)"
                  style="width:50%;margin-bottom:10px;margin-right:0;margin-left:0"
                  v-for="(city,index) in item.Children"
                  :label="city.Code"
                  :key="index"
                >{{ city.Name }}</el-checkbox>
              </el-checkbox-group>
              <div slot="reference">
                <el-button
                  :disabled="(item.isCheck) || calcCityCheckNum(item)"
                  class="fcolor"
                  type="text"
                >
                  <span style="font-size:14px;">{{ item.Name }}</span>
                  <i v-if="item.Children" style="margin-left:5px;" class="el-icon-arrow-down"></i>
                  <span
                    v-if="item.val.length > 0"
                    class="Danger"
                    style="font-size:14px;"
                  >({{ item.val.length }})</span>
                </el-button>
              </div>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-checkbox v-model="isCity" @change="selectAllCity">全选</el-checkbox>
        <span style="margin-right:15px;">已选择{{ citynum }}个区域</span>
        <el-button @click="closeCity">取 消</el-button>
        <el-button type="primary" @click="editcity">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import MTitle from "@/components/MTitle";
import { getStoreAddress } from "@/api/storeManage";
import { getCityForCode, getCodeForCity } from "@/utils/city.js";
import { getAddressData } from "@/api/address/index";
import {
  getTransFeeTemplateInfo,
  addTransFeeTemplate,
  editTransFeeTemplate
} from "@/api/transFeeTemplate/transFeeTemplate";
export default {
  components: { MTitle },
  data() {
    return {
      isEditCity: false,
      editIndex: -1,
      cityoptions: {
        multiple: true,
        value: "Code",
        label: "Name",
        children: "Children"
      },
      list: [],
      storeAddress: [
        {
          name: "中国",
          code: "142"
        },
        {
          name: "澳大利亚",
          code: "601"
        }
      ],
      defCityList: [],
      address: [],
      areaOptions: {
        value: "Code",
        label: "Name",
        children: "Children"
      },
      citylist: [],
      radio: 1,
      dialogVisible: false,
      isF: true,
      citynum: 0,
      isCity: false,
      info: {
        Name: "",
        addressCode: [],
        OrderTypeId: "",
        // Country: "",
        // Province: "",
        // City: "",
        Desc: "",
        // District: "",
        // AreaCode: "",
        IsCharge: "1",
        ChargeMode: "2",
        items: []
      }
    };
  },
  watch: {
    // "info.Country": function(val) {
    //   if (this.isF) return;
    //   if (val === "142") {
    //     this.info.addressCode = [];
    //     this.info.Desc = "";
    //   }
    // },
    "info.IsCharge": function(val) {
      if (this.isF) return;
      if (val === "0") {
        this.info.items.map(v => {
          v.FirstNumber = 0;
          v.FirstTransFee = 0;
          v.SecondNumber = 0;
          v.SecondTransFee = 0;
        });
      }
    },
    "info.ChargeMode": function(val) {
      if (this.isF) return;
      this.info.items.map(v => {
        v.FirstNumber = 0;
        v.FirstTransFee = 0;
        v.SecondNumber = 0;
        v.SecondTransFee = 0;
      });
    }
  },
  activated() {
    this.getAddressData(() => {
      if (parseInt(this.$route.query.id) !== -1) {
        getTransFeeTemplateInfo({
          Id: this.$route.query.id
        }).then(res => {
          switch (res.Country) {
            case "中国":
              // this.info.addressCode = [];
              getAddressData({ CountryCode: "142" }).then(res1 => {
                res1.map(a => {
                  a.Children.map(b => {
                    b.Children.map(c => {
                      delete c.Children;
                    });
                  });
                });

                let a = JSON.parse(JSON.stringify(res1));
                a.map(v => {
                  v.val = [];
                  v.isSelectedAll = false;
                  v.isCheck = false;
                  v.Children.map(item => {
                    delete item.Children;
                    item.isCheck = false;
                  });
                });
                this.defCityList = JSON.parse(JSON.stringify(a));
                this.address = res1;
                // this.info.addressCode = getCodeForCity(
                //   [res.Province, res.City, res.District],
                //   res.AreaCode,
                //   this.address
                // );
                this.citylist = a;
              });
              break;
            case "澳大利亚":
              // this.info.addressCode = [];
              getAddressData({ CountryCode: "601" }).then(res1 => {
                let array = [];
                res1.forEach(a => {
                  array.push({
                    Name: a.Name,
                    Code: a.Code
                  });
                });

                // let a = JSON.parse(JSON.stringify(res1));
                // a.map(v => {
                //   v.val = [];
                //   v.isSelectedAll = false;
                //   v.isCheck = false;
                //   delete v.Children;
                // });
                // this.defCityList = JSON.parse(JSON.stringify(a));

                this.address = array;
                // this.info.addressCode = getCodeForCity(
                //   [res.Province, res.City, res.District],
                //   res.AreaCode,
                //   this.address
                // );
                // this.citylist = a;
              });
              break;
          }
          let a = JSON.parse(JSON.stringify(res.items));
          delete res.items;
          let b = [];
          a.map(v => {
            if (v.IsDefault == 1) {
              res.items = [];
              res.items[0] = v;
            } else {
              v.Areas.map(item => {
                if (item.IsAllSelect) {
                  item.isSelectedAll = true;
                }
              });
              b.push(v);
            }
          });
          res.IsCharge = res.IsCharge.toString();
          res.ChargeMode = res.ChargeMode.toString();
          res.OrderTypeId = res.OrderTypeId.toString();
          this.info = JSON.parse(JSON.stringify(res));
          this.list = b;
          this.$nextTick(() => {
            this.isF = false;
          });
        });
      } else {
        this.isF = false;
        this.info.items = [];
        this.info.items.push({
          IsDefault: 1,
          expressMode: "",
          expressTo: "中国",
          expressToAreaCodes: "142",
          FirstNumber: 0,
          FirstTransFee: 0,
          SecondNumber: 0,
          SecondTransFee: 0,
          Areas: []
        });
      }
      // this.getStoreAddress()
    });
  },
  methods: {
    chooseContryDetail(val) {
      switch (val) {
        case "中国":
          // this.info.addressCode = [];
          getAddressData({ CountryCode: "142" }).then(res => {
            res.map(a => {
              a.Children.map(b => {
                b.Children.map(c => {
                  delete c.Children;
                });
              });
            });
            let a = JSON.parse(JSON.stringify(res));
            a.map(v => {
              v.val = [];
              v.isSelectedAll = false;
              v.isCheck = false;
              v.Children.map(item => {
                delete item.Children;
                item.isCheck = false;
              });
            });
            this.defCityList = JSON.parse(JSON.stringify(a));
            this.address = res;
            this.citylist = a;
            console.log("this.citylist : ", this.citylist);
          });
          break;
        case "澳大利亚":
          // this.info.addressCode = [];
          this.info.City = "";
          this.info.District = "";
          getAddressData({ CountryCode: "601" }).then(res => {
            let array = [];
            res.forEach(a => {
              array.push({
                Name: a.Name,
                Code: a.Code
              });
            });
            // let a = JSON.parse(JSON.stringify(res));
            // a.map(v => {
            //   v.val = [];
            //   v.isSelectedAll = false;
            //   v.isCheck = false;
            //   delete v.Children;
            // });
            // this.defCityList = JSON.parse(JSON.stringify(a));
            this.address = array;
            // this.citylist = a;
          });
          break;
      }
    },
    getCityStr(row) {
      let str = "";
      row.map(v => {
        if (v.IsAllSelect) {
          str += v.Name + " , ";
        } else {
          v.ChildArea.map(item => {
            str += item.Name + " , ";
          });
        }
      });
      return str.substring(0, str.length - 3);
    },
    selectAllCity(v) {
      let a = JSON.parse(JSON.stringify(this.citylist));
      if (v) {
        a.map(v => {
          if (!v.isCheck) {
            v.val = [];
            v.Children.map(item => {
              if (!item.isCheck) {
                v.val.push(item.Code);
              }
            });
            if (v.val.length == v.Children.length) {
              v.isSelectedAll = true;
            }
          }
        });
      } else {
        a.map(v => {
          v.isSelectedAll = false;
          v.val = [];
        });
      }
      this.citylist = a;
      this.calcSelectArea();
    },
    calcSelectArea() {
      this.citynum = 0;
      this.citylist.map(v => {
        this.citynum += v.val.length;
      });
    },
    delCity(scope) {
      this.$confirm("确定要删除这个运费配置吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(res => {
        this.list.splice(scope.$index, 1);
      });
    },
    // 计算省份下禁用城市数量
    calcCityCheckNum(item) {
      let a = 0;
      if (item.Children) {
        item.Children.map(v => {
          if (v.isCheck) a += 1;
        });
        if (a == item.Children.length) {
          return true;
        } else {
          return false;
        }
      }
    },
    editcity() {
      let a = [];
      this.citylist.map(v => {
        if (v.val.length > 0) {
          if (v.isSelectedAll) {
            let obj = {
              Level: 1,
              Pcode: 142,
              Code: v.Code,
              Name: v.Name,
              ChildArea: [],
              IsAllSelect: true
            };
            v.Children.map(item => {
              obj.ChildArea.push({
                Level: 2,
                Pcode: v.Code,
                Code: item.Code,
                Name: item.Name,
                IsAllSelect: false
              });
            });
            a.push(obj);
          } else {
            let obj = {
              Level: 1,
              Pcode: 142,
              Code: v.Code,
              Name: v.Name,
              ChildArea: [],
              IsAllSelect: false
            };
            v.val.map(vs => {
              v.Children.map(item => {
                if (vs == item.Code) {
                  obj.ChildArea.push({
                    Level: 2,
                    Pcode: v.Code,
                    Code: item.Code,
                    Name: item.Name,
                    IsAllSelect: false
                  });
                }
              });
            });
            a.push(obj);
          }
        }
      });
      if (a.length < 1) {
        this.$message.error("请选择城市");
        return;
      }
      if (this.isEditCity) {
        this.list[this.editIndex].Areas = a;
      } else {
        this.list.push({
          IsDefault: 0,
          expressMode: "",
          expressTo: "中国",
          expressToAreaCodes: "142",
          FirstNumber: 0,
          FirstTransFee: 0,
          SecondNumber: 0,
          SecondTransFee: 0,
          Areas: a
        });
      }
      this.closeCity();
    },
    closeCity() {
      let b = JSON.parse(JSON.stringify(this.defCityList));
      this.list.map(l => {
        l.Areas.map(la => {
          b.map(item => {
            if (la.Code == item.Code) {
              item.isCheck = true;
            } else {
              item.Children.map(citem => {
                if (la.Code == citem.Code) {
                  citem.isCheck = true;
                }
              });
            }
          });
        });
      });
      this.citylist = b;
      this.dialogVisible = false;
      this.isCity = false;
      this.isEditCity = false;
      this.editIndex = -1;
    },
    showdig() {
      let a = JSON.parse(JSON.stringify(this.defCityList));
      this.list.map((v, i) => {
        v.Areas.map(va => {
          if (va.Level == 1 && va.IsAllSelect) {
            a.map(item => {
              if (item.Code == va.Code) {
                item.isCheck = true;
              }
            });
          } else {
            a.map(item => {
              if (item.Code == va.Code) {
                item.Children.map(ic => {
                  va.ChildArea.map(vcm => {
                    if (ic.Code == vcm.Code) {
                      ic.isCheck = true;
                    }
                  });
                });
              }
            });
          }
        });
      });
      this.citylist = a;
      this.dialogVisible = true;
      this.calcSelectArea();
    },
    editCityCol(row) {
      this.editIndex = row.$index;
      this.editCityInfoFunc(row.row, row.$index);
      this.dialogVisible = true;
      this.calcSelectArea();
      this.isEditCity = true;
    },
    editCityInfoFunc(row, index) {
      let a = JSON.parse(JSON.stringify(this.defCityList));
      row.Areas.map(v => {
        if (v.Level == 1 && v.IsAllSelect) {
          a.map(item => {
            if (item.Code == v.Code) {
              item.isSelectedAll = true;
              item.Children.map(ic => {
                item.val.push(ic.Code);
              });
            }
          });
        } else {
          a.map(item => {
            if (item.Code == v.Code) {
              item.Children.map(ic => {
                v.ChildArea.map(vc => {
                  if (ic.Code == vc.Code) {
                    item.val.push(ic.Code);
                  }
                });
              });
            }
          });
        }
      });
      this.list.map((v, i) => {
        if (i != index) {
          v.Areas.map(va => {
            if (va.Level == 1 && va.IsAllSelect) {
              a.map(item => {
                if (item.Code == va.Code) {
                  item.isCheck = true;
                }
              });
            } else {
              a.map(item => {
                if (va.Code == item.Code) {
                  console.log(va);
                  va.ChildArea.map(vcm => {
                    item.Children.map(icm => {
                      if (vcm.Code == icm.Code) {
                        icm.isCheck = true;
                      }
                    });
                  });
                }
              });
            }
          });
        }
      });
      this.citylist = a;
    },
    handleCheckedCitiesChange(item) {
      if (item.val.length == item.Children.length) {
        item.isSelectedAll = true;
      } else {
        item.isSelectedAll = false;
      }
      this.citylist.map((v, index) => {
        if (v.Code == item.Code) {
          this.citylist[index] = item;
        }
      });
      this.calcSelectArea();
    },
    selectAll(item) {
      console.log(item);

      if (item.isSelectedAll) {
        item.val = [];
        if (item.Children) {
          item.Children.map(v => {
            if (!v.isCheck) {
              item.val.push(v.Code);
            } else {
              item.isSelectedAll = false;
            }
          });
        }
      } else {
        item.val = [];
      }
      this.citylist.map((v, index) => {
        if (v.Code == item.Code) {
          this.citylist[index] = item;
        }
      });
      this.calcSelectArea();
    },
    getAddressData(cb) {
      getAddressData().then(res => {
        res.map(a => {
          a.Children.map(b => {
            b.Children.map(c => {
              delete c.Children;
            });
          });
        });
        let a = JSON.parse(JSON.stringify(res));
        a.map(v => {
          v.val = [];
          v.isSelectedAll = false;
          v.isCheck = false;
          v.Children.map(item => {
            delete item.Children;
            item.isCheck = false;
          });
        });
        this.defCityList = JSON.parse(JSON.stringify(a));
        // this.address = res
        this.citylist = a;
        cb();
      });
    },
    numChange(val, item, key) {
      let value = val;
      if (this.info.ChargeMode === "1") {
        if (value.length === 1) {
          value = value.replace(/[^1-9]/g, "");
        } else {
          value = value.replace(/\D/g, "");
        }
        if (value > 9999) {
          value = 9999;
        }
        if (value < 1) {
          value = 1;
        }
      } else {
        if (isNaN(value)) {
          value = 0.0;
        } else if (!/^d*(?:.d{0,1})?$/.test(value)) {
          value = parseFloat(value).toFixed(1);
        }
        if (value > 9999.9) {
          value = 9999.9;
        }
        if (value < 0.1) {
          value = 0.1;
        }
      }
      item[key] = value === "" ? 0 : value;
    },
    priceChange(val, item, key) {
      let value = val;
      if (isNaN(value)) {
        value = 0.0;
      } else if (!/^d*(?:.d{0,2})?$/.test(value)) {
        value = parseFloat(value).toFixed(2);
      }
      if (value > 9999.99) {
        value = 9999.99;
      }
      if (value < 0) {
        value = 0;
      }
      item[key] = value === "" ? 0 : value;
    },
    add() {
      const p = JSON.parse(JSON.stringify(this.info));
      if (p.OrderTypeId === "") {
        this.$message.error("请选择贸易类型");
        return;
      } else if (p.Name.trim() === "") {
        this.$message.error("请填写模版名称");
        return;
        // } else if (p.addressCode.length === 0) {
        //   this.$message.error("请完善地址信息");
        //   return;
      }
      if (p.Name.trim().length > 30) {
        this.$message.error("运费模板名称长度不能超过30个字");
      }
      // if (p.Country === "中国") {
      //   const c = getCityForCode(p.addressCode, this.address);
      //   p.AreaCode = p.addressCode[2];
      //   p.District = c[2];
      //   p.City = c[1];
      //   p.Province = c[0];
      // } else {
      //   console.log(1111, p.addressCode);

      //   const c = getCityForCode(p.addressCode, this.address);
      //   p.AreaCode = p.addressCode[0];
      //   // p.District = c[2]
      //   // p.City = c[1]
      //   p.Province = c[0];
      // }
      if (p.IsCharge != 0) {
        if (this.list.length > 0) {
          let clist = JSON.parse(JSON.stringify(this.list));
          clist.map(v => {
            p.items.push(v);
          });
        }
        let f = false;
        let errmsg = "";
        p.items.map(v => {
          if (p.ChargeMode == 1) {
            if (v.FirstNumber < 1 || v.SecondNumber < 1) {
              errmsg = "件数至少要求1件";
              f = true;
            }
            if (v.FirstTransFee < 0.01 || v.SecondTransFee < 0.01) {
              errmsg = "运费不能为0";
              f = true;
            }
          } else {
            if (v.FirstNumber < 0.1 || v.SecondNumber < 0.1) {
              errmsg = "重量至少要求0.1Kg";
              f = true;
            }
            if (v.FirstTransFee < 0.01 || v.SecondTransFee < 0.01) {
              errmsg = "运费不能为0";
              f = true;
            }
          }
        });
        if (f) {
          this.$message.error(errmsg);
          return;
        }
      } else {
        if (this.list.length > 0) {
          let clist = JSON.parse(JSON.stringify(this.list));
          clist.map(v => {
            p.items.push(v);
          });
        }
        let f = false;
        let errmsg = "";
        if (f) {
          this.$message.error(errmsg);
          return;
        }
      }
      if (parseInt(this.$route.query.id) === -1) {
        addTransFeeTemplate(p).then(res => {
          this.$message.success("新增成功！");
          this.$router.push("/transFeeTemplate");
        });
      } else {
        editTransFeeTemplate(p).then(res => {
          this.$message.success("编辑成功！");
          this.$router.push("/transFeeTemplate");
        });
      }
    }
    // getStoreAddress() {
    //   getStoreAddress({ pageSize: 9999, InUse: 1 }).then(res => {
    //     this.storeAddress = res.Data.map(v => {
    //       v.name = v.NameCN + ' ( ' + v.NameEN + ' ) '
    //       return v
    //     })
    //   })
    // }
  },
  beforeRouteLeave(to, from, next) {
    let f = false;
    let view = {};
    this.$store.state.tagsView.visitedViews.map(v => {
      if (v.path === from.path) {
        f = true;
        view = v;
      }
    });
    if (f) {
      this.$destroy();
      this.$store.dispatch("delVisitedViews", view).then(views => {});
    }
    next();
  }
};
</script>
<style scoped>
.red_txt {
  font-size: 14px;
}
.red_txt::before {
  content: "(";
}
.red_txt::after {
  content: ")";
}
.flex_left {
  flex: 0 0 120px;
  text-align: right;
  padding-right: 10px;
}
.flex_right {
  flex: 0 0 250px;
}
.flex_box {
  display: flex;
}
.yf .info_address {
  margin: 0 10px;
}

.item_desc p {
  margin: 0;
}

.role {
  width: 100%;
  display: flex;
}

.rmr {
  margin-right: 10px;
}

.lsnone {
  list-style: none;
}

.role .r {
  flex: 0 0 50%;
}

.role .r h3 {
  font-size: 16px;
}

.role .r ul {
  padding-left: 15px;
}

.role .r li {
  line-height: 35px;
}

.maxImg {
  max-width: 500px;
}

table {
  width: 100%;
}

a {
  color: #558fe3 !important;
}

.desc {
  padding: 0 15px;
  padding-top: 20px;
}

.desc > .item {
  line-height: 40px;
  display: flex;
  font-size: 14px;
}

.desc .item .title {
  flex: 0 0 150px;
  text-align: right;
  padding-right: 10px;
}

.desc .item .item_desc {
  flex: 1;
}

.desc .item .item_desc img {
  max-width: 500px;
  border: 1px solid #e6e6e6;
}
</style>
<style >
.mr10 {
  margin-right: 5px !important;
}
#tables thead {
  line-height: 24px !important;
}
.fcolor {
  color: #606266;
}
</style>