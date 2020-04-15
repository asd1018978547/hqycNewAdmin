<template>
  <div class="content_box roleadd addGoods addsku sku">
    <sticky class="subTitle">
      <h2 class="big_title">
        {{$route.meta.title}}
        <el-button
          v-if="ruleForm.selectedCateCode.length > 0"
          class="title_btn pan-btn green-btn"
          @click="onAdd"
          type="success"
          size="mini"
          icon="el-icon-check"
        >保存</el-button>
      </h2>
    </sticky>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="info mb10">
        <div class="infoTitle">SKU基本信息</div>
        <div class="infoDesc">
          <el-form-item size="mini" class="w200" label="SKU类别" prop="selectedCateCode">
            <el-cascader
              v-model="ruleForm.selectedCateCode"
              @change="itemchange"
              clearable
              placeholder="请选择类别"
              separator="-"
              size="mini"
              :options="options"
              @active-item-change="handleItemChange"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="关键词" prop="Labels">
            <el-select filterable v-model="ruleForm.Labels" multiple placeholder="请选择关键词">
              <el-option
                v-for="(item,index) in keywords"
                :key="index"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="品牌" prop="BrandCode">
            <el-select filterable v-model="ruleForm.BrandCode" placeholder="请选择品牌">
              <el-option
                v-for="(item,index) in brandList"
                :key="index"
                :label="item.Name"
                :value="item.Code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="原产地" prop="OriginCode">
            <el-select filterable v-model="ruleForm.OriginCode" placeholder="请选择原产地">
              <el-option
                v-for="(item,index) in originList"
                :key="index"
                :label="item.NameCN"
                :value="item.Code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="info mb10">
        <div class="infoTitle">SEO选项</div>
        <div class="infoDesc">
          <el-form-item size="mini" class="w200" label="SEO关键字" prop="SeoKeyWords">
            <el-input type="text" v-model="ruleForm.SeoKeyWords" placeholder="请输入关键词，以','号分割"></el-input>
          </el-form-item>
          <el-form-item size="mini" class="w200" label="SEO描述" prop="SeoDescription">
            <el-input
              type="text"
              v-model="ruleForm.SeoDescription"
              placeholder="请输入SEO描述"
              maxlength="120"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="info mb10" v-if="ruleForm.selectedCateCode.length > 0">
        <div class="infoTitle">SKU属性</div>
        <div class="infoDesc">
          <p style="margin-top:0;margin-bottom:18px;">
            <span style="display:inline-block;width:100px;text-align:right">选择属性：</span>
            <el-select
              collapse-tags
              class="w300"
              size="mini"
              @change="saveAtt"
              v-model="selectedAttr"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) in aList"
                :key="index"
                :label="item.Name"
                :value="item.Id"
              ></el-option>
            </el-select>
            <!-- <el-button :disabled='selectedAttr.length == 0' class="ml10" size='mini' type="success" @click='saveAtt'>保存属性</el-button> -->
            <el-button
              v-if="checkBtn('func_sku_attribute_add')"
              class="ml10"
              size="mini"
              type="primary"
              @click="newAttr"
            >新增属性</el-button>
          </p>
          <el-form-item
            v-for="(item,index) in ruleForm.baseAttrList"
            :key="index"
            size="mini"
            :label="item.Name"
            :prop="'baseAttrList.' + index + '.checked'"
            :rules="{ required: true, message: '请至少选择一项属性' }"
          >
            <div v-for="(i,index) in item.PropVals" :key="index">
              <template>
                <el-checkbox-group v-model="item.checked" v-if="item.ValType == 1">
                  <el-checkbox :label="i.Id">{{ i.Val }}</el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-model="item.checked" v-else>
                  <el-radio class="mr15" :label="i.Id">{{ i.Val }}</el-radio>
                </el-radio-group>
              </template>
            </div>
            <el-button
              v-if="checkBtn('func_sku_attributevalue_add')"
              class="ml10"
              size="mini"
              type="primary"
              @click="newAttrVal(item)"
            >新增属性值</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="info mb10" v-if="ruleForm.selectedCateCode.length > 0">
        <div class="infoTitle">SKU销售信息</div>
        <div class="infoDesc">
          <el-form-item size="mini" class="w200" label="销售单位" prop="Unit">
            <el-select filterable v-model="ruleForm.Unit" placeholder="请选择销售单位">
              <el-option
                v-for="(item,index) in unitList"
                :key="index"
                :label="item.Name"
                :value="item.Code"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="info mb10" v-if="ruleForm.selectedCateCode.length > 0">
        <div class="infoTitle">SKU规格</div>
        <div class="infoDesc">
          <div v-for="(pitem, index) in propList" :key="index">
            <template>
              <p style="margin-top:0;margin-bottom:18px;">
                <span style="display:inline-block;width:100px;text-align:right">请选择规格：</span>
                <el-select
                  class="w300"
                  @change="(val) => { changeProp(val,index) }"
                  size="mini"
                  v-model="pitem.propval"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in pitem.prop"
                    :key="index"
                    :label="item.StandardName"
                    :value="item.Id"
                  ></el-option>
                </el-select>
                <el-button class="ml10" size="mini" type="primary" @click="addProp(index)">新增规格</el-button>
                <el-button class="ml10" size="mini" type="danger" @click="delProp(index)">删除规格</el-button>
              </p>
              <p style="margin-top:0;margin-bottom:18px;">
                <span style="display:inline-block;width:100px;text-align:right">选择规格值：</span>
                <el-select
                  @change="propchildvalchange"
                  :disabled="pitem.propval == null"
                  class="w800"
                  size="mini"
                  multiple
                  v-model="pitem.propselectedval"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item,index) in pitem.propchildval"
                    :key="index"
                    :label="item.Val"
                    :value="item.Id"
                  ></el-option>
                </el-select>
                <el-button
                  class="ml10"
                  size="mini"
                  @click="showValDig(index)"
                  type="primary"
                  :disabled="pitem.propval == null"
                >新增规格值</el-button>
              </p>
            </template>
          </div>
          <p style="margin-top:0;margin-bottom:18px;">
            <el-button class="ml10" size="mini" type="primary" @click="addnewprop">添加规格</el-button>
            <el-button class="ml10" size="mini" type="success" @click="saveProp">保存规格</el-button>
          </p>
        </div>
      </div>
      <div class="info mb10" v-if="ruleForm.selectedCateCode.length > 0">
        <div class="infoTitle">SKU备货信息</div>
        <div class="infoDesc">
          <el-row>
            <el-col :span="4">
              <span class="timed">备货ID：</span>
              <el-input type="text" size="mini" v-model="ruleForm.Code"></el-input>
            </el-col>
            <!-- <el-col :span="4">
              <span class="timed">毛重：</span>
              <el-input type="text" size="mini" v-model.number="batch.GrossWeight"></el-input>
            </el-col>
            <el-col :span="4">
              <span class="timed">体积：</span>
              <el-input type="text" size="mini" v-model.number="batch.BoxVolume"></el-input>
            </el-col>
            <el-col :span="4">
              <span style="padding-left:15px;">
                <el-button type="primary" size="mini" @click="batchSetAmount">批量设置</el-button>
              </span>
            </el-col> -->
          </el-row>
          <el-table :data="bhlist" border fit highlight-current-row style="width: 100%">
            <el-table-column label="备货信息" align="center" width="170">
              <template slot-scope="scope">
                <el-button
                  @click="editBhInfo(scope)"
                  :disabled="showEdit"
                  class="pan-btn blue-btn"
                  style="margin-bottom:5px"
                  primary
                  size="mini"
                  icon="el-icon-edit"
                >编辑备货信息</el-button>
                <el-popover placement="right" trigger="hover">
                  <div>
                    <p>备货数量：{{ scope.row.OrderTypeInfo[1].Amount }}</p>
                    <p>成本价（元）：{{ scope.row.OrderTypeInfo[1].CostPrice }}</p>
                    <p>批发价（元）：{{ scope.row.OrderTypeInfo[1].Price }}</p>
                    <p>零售价（元）：{{ scope.row.OrderTypeInfo[1].RetailPrice }}</p>
                    <p>24H最大购买数量：{{ scope.row.OrderTypeInfo[1].MaxBuyNumber }}</p>
                    <p>税率：{{ scope.row.OrderTypeInfo[1].TaxRate }}</p>
                  </div>
                  <el-button
                    slot="reference"
                    style="margin-left:0;margin-bottom:5px"
                    class="pan-btn green-btn"
                    type="success"
                    size="mini"
                    icon="el-icon-search"
                  >查看保税备货信息</el-button>
                </el-popover>
                <el-popover placement="right" trigger="hover">
                  <div>
                    <p>备货数量：{{ scope.row.OrderTypeInfo[0].Amount }}</p>
                    <p>成本价（元）：{{ scope.row.OrderTypeInfo[0].CostPrice }}</p>
                    <p>批发价（元）：{{ scope.row.OrderTypeInfo[0].Price }}</p>
                    <p>零售价（元）：{{ scope.row.OrderTypeInfo[0].RetailPrice }}</p>
                    <p>24H最大购买数量：{{ scope.row.OrderTypeInfo[0].MaxBuyNumber }}</p>
                    <p>税率：{{ scope.row.OrderTypeInfo[0].TaxRate }}</p>
                  </div>
                  <el-button
                    slot="reference"
                    style="margin-left:0;margin-bottom:5px"
                    class="pan-btn green-btn"
                    type="success"
                    size="mini"
                    icon="el-icon-search"
                  >查看跨境直邮信息</el-button>
                </el-popover>
                <el-popover placement="right" trigger="hover">
                  <div>
                    <p>备货数量：{{ scope.row.OrderTypeInfo[2].Amount }}</p>
                    <p>成本价（元）：{{ scope.row.OrderTypeInfo[2].CostPrice }}</p>
                    <p>批发价（元）：{{ scope.row.OrderTypeInfo[2].Price }}</p>
                    <p>零售价（元）：{{ scope.row.OrderTypeInfo[2].RetailPrice }}</p>
                    <p>24H最大购买数量：{{ scope.row.OrderTypeInfo[2].MaxBuyNumber }}</p>
                  </div>
                  <el-button
                    slot="reference"
                    style="margin-left:0;margin-bottom:5px"
                    class="pan-btn green-btn"
                    type="success"
                    size="mini"
                    icon="el-icon-search"
                  >查看一般贸易信息</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="毛重" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.GrossWeight" class="edit-input" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="体积" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.BoxVolume" class="edit-input" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="关联商品" align="center">
              <template slot-scope="scope">
                <div style="display:flex">
                  <el-input
                    v-model="scope.row.NameCN"
                    @focus="getGoods(scope)"
                    size="mini"
                    placeholder="请选择商品"
                    suffix-icon="el-icon-search"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品条码" align="center" prop="SN"></el-table-column>
            <template v-for="item in backproplist">
              <el-table-column :key="item.propval" :label="item.propname" align="center">
                <template slot-scope="scope">
                  <template v-for="i in scope.row.StdDetail">
                    <span :key="i.Id" v-if="i.StandardName == item.propname">{{i.Val }}</span>
                  </template>
                </template>
              </el-table-column>
            </template>
            <el-table-column label="渠道商品编码：" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.ExtSN" class="edit-input" size="mini"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--sku备货信息管理-->
      <div class="info mb10" v-if="ruleForm.selectedCateCode.length > 0 && showEdit">
        <div class="infoTitle">
          编辑备货信息
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelIndo">取 消</el-button>
            <el-button size="mini" type="primary" @click="saveBhInfo">保 存</el-button>
          </span>
        </div>
        <div class="infoDesc">
          <el-tabs v-model="activeTab">
            <el-tab-pane
              :label="item.name"
              :name="item.name"
              v-for="(item,index) in orderStatusList"
              :key="index"
            ></el-tab-pane>
          </el-tabs>
          <div class="infoBox" v-if="activeTab == '保税备货'">
            <div class="info_item" style="margin-top:10px">
              <div class="info_title">
                <span style="color:red">*</span> SKU标题：
              </div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].Name"
                  placeholder="请输入SKU标题"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                 简短描述：
              </div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].ShortDesc"
                  placeholder="请输入简短描述"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 发货仓库：
              </div>
              <div class="info_right">
                <el-select
                  @change="chooseStore1"
                  class="search_title"
                  clearable
                  v-model="addbh.OrderTypeInfo[1].StoreCode"
                  size="small"
                  placeholder="请选择仓库"
                >
                  <el-option
                    v-for="item in storeList"
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="addbh.OrderTypeInfo[1].StoreCode">
              <div
                class="info_item"
                style="min-height:20px !important;padding-bottom: 8px; height:auto"
              >
                <div class="info_title" style="line-height:30px;">发货地：</div>
                <div class="info_right">
                  <span style="margin-left:4px;line-height: 32px;">{{bsbhAddress1}}</span>
                </div>
              </div>
            </template>
            <div class="info_item">
              <div class="info_title">备货数量：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].Amount"
                  placeholder="请输入备货数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <!-- <div class="info_item">
          <div class="info_title">库存数量：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              disabled
              v-model="addbh.OrderTypeInfo[1].BatchQty"
              placeholder
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">入仓批次号：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              disabled
              v-model="addbh.OrderTypeInfo[1].BatchNo"
              placeholder
              size="mini"
            ></el-input>
          </div>
            </div>-->
            <div class="info_item">
              <div class="info_title">成本价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].CostPrice"
                  placeholder="请输入成本价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">批发价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].Price"
                  placeholder="请输入批发价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">零售价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].RetailPrice"
                  placeholder="请输入零售价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">24H最大购买数量：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].MaxBuyNumber"
                  placeholder="请输入24H最大购买数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">税率：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].TaxRate"
                  placeholder="请输入税率"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">包装：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].PackgeInfo"
                  placeholder="请填写包装"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_right" style="margin:0 0 10px 91px">
              效期：
              <el-date-picker
                v-model="addbh.OrderTypeInfo[1].Expiration"
                type="date"
                value-format="yyyy-MM-dd"
                size="mini"
                :picker-options="pickerDisabled"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div class="info_item">
              <div class="info_title">是否混装：</div>
              <div class="info_right" style="margin-top: 5px;">
                <el-checkbox v-model="addbh.OrderTypeInfo[1].SkuRuleSettingInfo.IsMixedLoading">是</el-checkbox>
              </div>
            </div>
            <div class="info_item" v-if="!addbh.OrderTypeInfo[1].SkuRuleSettingInfo.IsMixedLoading">
              <div class="info_title">
                <span style="color:red">*</span> 下单数量：
              </div>
              <div class="info_right">
                <el-input
                  @keyup.native="proving1"
                  style="width:220px"
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[1].SkuRuleSettingInfo.SeparateBillVal"
                  placeholder="请输入下单数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">运费模版：</div>
              <div class="info_right">
                <el-select
                  style="width:220px"
                  filterable
                  @change="(val) => { getTmpInfo(val,1) }"
                  size="mini"
                  v-model="addbh.OrderTypeInfo[1].TransFeeTemplate"
                  placeholder="请选择保税进口运费模板"
                >
                  <el-option
                    v-for="(item,index) in expTempList2"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="addbh.OrderTypeInfo[1].expInfo">
              <div
                class="info_item"
                style="min-height:88px !important;padding-bottom: 8px; height:auto"
              >
                <div class="info_title" style="line-height:80px;">运费模版详情：</div>
                <div class="info_right" style="display:block">
                  <!-- <p>
                    发货地：
                    <span
                      style="color:#ff0000"
                    >{{ addbh.OrderTypeInfo[1].expInfo.Country + addbh.OrderTypeInfo[1].expInfo.Province + addbh.OrderTypeInfo[1].expInfo.City + addbh.OrderTypeInfo[1].expInfo.District }}</span>
                  </p>-->
                  <div style="width:100%" v-if=" addbh.OrderTypeInfo[1].expInfo">
                    <div :key="index" v-for="(i,index) in addbh.OrderTypeInfo[1].expInfo.items">
                      <p>
                        运送至：
                        <span
                          style="color:#ff0000"
                        >{{ i.Areas.length == 0 ? i.ExpressTo : getCityStr(i.Areas)}}</span>
                      </p>
                      <p>
                        {{ i.IsDefault ? '默认运费' : '运费' }}
                        <span
                          style="color:#ff0000"
                        >{{ i.FirstNumber }}{{ addbh.OrderTypeInfo[1].expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>/内
                        <span style="color:#ff0000">{{ i.FirstTransFee }}</span>元，每增加
                        <span
                          style="color:#ff0000"
                        >{{ i.SecondNumber }}{{ addbh.OrderTypeInfo[1].expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>，增加运费
                        <span style="color:#ff0000">{{ i.SecondTransFee }}</span>元
                      </p>
                    </div>
                  </div>
                  <div v-else style="line-height:80px;color: #ff0000">包邮</div>
                </div>
              </div>
            </template>

            <!-- <div class="info_item">
              <div class="info_title">快速预览选项：</div>
              <div class="info_right">
                <span style="color:#606266;line-height: 28px;">数量：</span>
                <el-input
                  size="mini"
                  type="text"
                  style="width:70px;"
                  v-model.number="previewsInfo.amount"
                ></el-input>
                <span style="color:#606266;line-height: 28px;margin-left: 5px;">描述：</span>
                <el-input size="mini" type="text" style="width:70px;" v-model="previewsInfo.Desc"></el-input>
                <span>
                  <el-button
                    :disabled="this.previewsInfo.amount === '' || this.previewsInfo.Desc === ''"
                    class="ml10"
                    size="mini"
                    @click="addPreviewsInfo(1)"
                    type="primary"
                  >添加</el-button>
                </span>
              </div>
            </div>-->
            <!-- <div class="info_item" v-if="addbh.OrderTypeInfo[1].PreviewsInfo.length > 0">
              <div class="info_title"></div>
              <div class="info_right">
                <el-tag
                  @close="deletePrview(1, index)"
                  closable
                  style="margin-right:10px;"
                  v-for="(item,index) in addbh.OrderTypeInfo[1].PreviewsInfo"
                  type="success"
                  :key="index"
                >{{ item.Amount + item.Desc }}</el-tag>
              </div>
            </div>-->

            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 商品图片：
              </div>
              <div
                class="info_right"
                style="padding-top: 8px;"
              >支持.jpg .jpeg .png格式图片，大小2M以内，最多上传5张图片</div>
            </div>
            <div class="infoDesc upload" style="margin-left:113px;margin-top:-20px">
              <div class="addskuupload">
                <div class="addskuuploadItem" style="margin-right: 8px;">
                  <el-upload
                    :ref="'upload_' + 1"
                    class="avatar-uploader"
                    action
                    accept="image/*"
                    :http-request="uploadImg"
                    :show-file-list="false"
                    :before-upload="(res) => {  return beforeAvatarUpload(res, 1) }"
                  >
                    <img
                      v-if="!addbh.OrderTypeInfo[1].Image == ''"
                      :src="addbh.OrderTypeInfo[1].showImg"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon">商品主图</i>
                  </el-upload>
                </div>
                <div
                  class="addskuuploadItem"
                  style="margin-right: 8px;"
                  v-for="(item, index) in addbh.OrderTypeInfo[1].MoreImage"
                  :key="index"
                >
                  <el-upload
                    accept="image/*"
                    :ref="'upload-1' + index"
                    class="avatar-uploader"
                    action
                    :http-request="uploadImg1"
                    :show-file-list="false"
                    :before-upload="(res) => { return beforeAvatarUpload1(res, index) }"
                  >
                    <template v-if="item != ''">
                      <img :src="addbh.OrderTypeInfo[1].showMoreImage[index]" class="avatar" />
                      <i class="delImage" @click.stop="delImage1(item, index)">删除图片</i>
                    </template>
                    <i v-else class="el-icon-plus avatar-uploader-icon">点击上传副图</i>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 商品详细描述：
              </div>
              <div
                class="info_right"
                style="padding-top: 8px;"
              >详细描述一般包含产品功能属性、产品细节图片、支付物流、售后服务、公司实力等内容</div>
            </div>
            <div class="editor-container" style="margin-left:132px">
              <Tinymce :height="400" ref="editor" v-model="addbh.OrderTypeInfo[1].DetailInfo" />
            </div>
            <el-button
              style="margin: 10px 0 10px 132px"
              size="mini"
              type="success"
              @click="copyDetail"
            >复 制</el-button>
          </div>
          <div class="infoBox" v-if="activeTab == '跨境直邮'">
            <div class="info_item" style="margin-top:10px">
              <div class="info_title">
                <span style="color:red">*</span> SKU标题：
              </div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].Name"
                  placeholder="请输入SKU标题"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
               简短描述：
              </div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].ShortDesc"
                  placeholder="请输入简短描述"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 发货仓库：
              </div>
              <div class="info_right">
                <el-select
                  @change="chooseStore0"
                  class="search_title"
                  clearable
                  v-model="addbh.OrderTypeInfo[0].StoreCode"
                  size="small"
                  placeholder="请选择仓库"
                >
                  <el-option
                    v-for="item in storeList"
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="addbh.OrderTypeInfo[0].StoreCode">
              <div
                class="info_item"
                style="min-height:20px !important;padding-bottom: 8px; height:auto"
              >
                <div class="info_title" style="line-height:30px;">发货地：</div>
                <div class="info_right">
                  <span style="margin-left:4px;line-height: 32px;">{{bsbhAddress0}}</span>
                </div>
              </div>
            </template>
            <!-- <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span>发货地：
              </div>
              <div class="info_right">
                <el-cascader
                  class="search_time"
                  v-model="addbh.OrderTypeInfo[0].DeliveryAddress"
                  :options="areaData"
                  :props="areaOptions"
                  size="small"
                  separator="-"
                  placeholder="请选择或搜索地址"
                  filterable
                  clearable
                ></el-cascader>
              </div>
            </div>-->
            <div class="info_item">
              <div class="info_title">备货数量：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].Amount"
                  placeholder="请输入备货数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <!-- <div class="info_item">
          <div class="info_title">库存数量：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              disabled
              v-model="addbh.OrderTypeInfo[0].BatchQty"
              placeholder
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">入仓批次号：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              disabled
              v-model="addbh.OrderTypeInfo[0].BatchNo"
              placeholder
              size="mini"
            ></el-input>
          </div>
            </div>-->
            <div class="info_item">
              <div class="info_title">成本价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].CostPrice"
                  placeholder="请输入成本价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">批发价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].Price"
                  placeholder="请输入批发价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">零售价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].RetailPrice"
                  placeholder="请输入零售价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">24H最大购买数量：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].MaxBuyNumber"
                  placeholder="请输入24H最大购买数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">税率：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].TaxRate"
                  placeholder="请输入税率"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">包装：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].PackgeInfo"
                  placeholder="请填写包装"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_right" style="margin:0 0 10px 91px">
              效期：
              <el-date-picker
                v-model="addbh.OrderTypeInfo[0].Expiration"
                type="date"
                value-format="yyyy-MM-dd"
                size="mini"
                :picker-options="pickerDisabled"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div class="info_item">
              <div class="info_title">是否混装：</div>
              <div class="info_right" style="margin-top: 5px;">
                <el-checkbox v-model="addbh.OrderTypeInfo[0].SkuRuleSettingInfo.IsMixedLoading">是</el-checkbox>
              </div>
            </div>
            <div class="info_item" v-if="!addbh.OrderTypeInfo[0].SkuRuleSettingInfo.IsMixedLoading">
              <div class="info_title">
                <span style="color:red">*</span> 下单数量：
              </div>
              <div class="info_right">
                <el-input
                  @keyup.native="proving0"
                  style="width:220px"
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[0].SkuRuleSettingInfo.SeparateBillVal"
                  placeholder="请输入下单数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">运费模版：</div>
              <div class="info_right">
                <el-select
                  style="width:220px"
                  filterable
                  size="mini"
                  @change="(val) => { getTmpInfo(val,0) }"
                  v-model="addbh.OrderTypeInfo[0].TransFeeTemplate"
                  placeholder="请选择直邮进口运费模板"
                >
                  <el-option
                    v-for="(item,index) in expTempList1"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="addbh.OrderTypeInfo[0].expInfo">
              <div
                class="info_item"
                style="min-height:88px !important;padding-bottom: 8px; height:auto"
              >
                <div class="info_title" style="line-height:80px;">运费模版详情：</div>
                <div class="info_right" style="display:block">
                  <!-- <p>
                    发货地：
                    <span
                      style="color:#ff0000"
                    >{{ addbh.OrderTypeInfo[0].expInfo.Country + addbh.OrderTypeInfo[0].expInfo.Province + addbh.OrderTypeInfo[0].expInfo.City + addbh.OrderTypeInfo[0].expInfo.District }}</span>
                  </p>-->
                  <div
                    v-if="addbh.OrderTypeInfo[0].expInfo.IsCharge != 0 && addbh.OrderTypeInfo[0].expInfo"
                  >
                    <div v-for="(i,index) in addbh.OrderTypeInfo[0].expInfo.items" :key="index">
                      <p>
                        运送至：
                        <span
                          style="color:#ff0000"
                        >{{ i.Areas.length == 0 ? i.ExpressTo : getCityStr(i.Areas)}}</span>
                      </p>
                      <p>
                        {{ i.IsDefault ? '默认运费' : '运费' }}
                        <span
                          style="color:#ff0000"
                        >{{ i.FirstNumber }}{{ addbh.OrderTypeInfo[0].expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>/内
                        <span style="color:#ff0000">{{ i.FirstTransFee }}</span>元，每增加
                        <span
                          style="color:#ff0000"
                        >{{ i.SecondNumber }}{{ addbh.OrderTypeInfo[0].expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>，增加运费
                        <span style="color:#ff0000">{{ i.SecondTransFee }}</span>元
                      </p>
                    </div>
                  </div>
                  <div v-else style="line-height:80px;color: #ff0000">包邮</div>
                </div>
              </div>
            </template>

            <!-- <div class="info_item">
              <div class="info_title">快速预览选项：</div>
              <div class="info_right">
                <span style="color:#606266;line-height: 28px;">数量：</span>
                <el-input
                  size="mini"
                  type="text"
                  style="width:70px;"
                  v-model.number="previewsInfo.amount"
                ></el-input>
                <span style="color:#606266;line-height: 28px;margin-left: 5px;">描述：</span>
                <el-input size="mini" type="text" style="width:70px;" v-model="previewsInfo.Desc"></el-input>
                <span>
                  <el-button
                    :disabled="this.previewsInfo.amount === '' || this.previewsInfo.Desc === ''"
                    class="ml10"
                    size="mini"
                    @click="addPreviewsInfo(0)"
                    type="primary"
                  >添加</el-button>
                </span>
              </div>
            </div>-->
            <!-- <div class="info_item" v-if="addbh.OrderTypeInfo[0].PreviewsInfo.length > 0">
              <div class="info_title"></div>
              <div class="info_right">
                <el-tag
                  @close="deletePrview(0, index)"
                  closable
                  style="margin-right:10px;"
                  v-for="(item,index) in addbh.OrderTypeInfo[0].PreviewsInfo"
                  type="success"
                  :key="index"
                >{{ item.Amount + item.Desc }}</el-tag>
              </div>
            </div>-->

            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 商品图片：
              </div>
              <div
                class="info_right"
                style="padding-top: 8px;"
              >支持.jpg .jpeg .png格式图片，大小2M以内，最多上传5张图片</div>
            </div>
            <div class="infoDesc upload" style="margin-left:113px;margin-top:-20px">
              <div class="addskuupload">
                <div class="addskuuploadItem" style="margin-right: 8px;">
                  <el-upload
                    :ref="'upload_' + 0"
                    class="avatar-uploader"
                    action
                    accept="image/*"
                    :http-request="uploadImg"
                    :show-file-list="false"
                    :before-upload="(res) => {  return beforeAvatarUpload(res, 0) }"
                  >
                    <img
                      v-if="!addbh.OrderTypeInfo[0].Image == ''"
                      :src="addbh.OrderTypeInfo[0].showImg"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon">商品主图</i>
                  </el-upload>
                </div>
                <div
                  class="addskuuploadItem"
                  style="margin-right: 8px;"
                  v-for="(item, index) in addbh.OrderTypeInfo[0].MoreImage"
                  :key="index"
                >
                  <el-upload
                    accept="image/*"
                    :ref="'upload-0' + index"
                    class="avatar-uploader"
                    action
                    :http-request="uploadImg0"
                    :show-file-list="false"
                    :before-upload="(res) => { return beforeAvatarUpload0(res, index) }"
                  >
                    <template v-if="item != ''">
                      <img :src="addbh.OrderTypeInfo[0].showMoreImage[index]" class="avatar" />
                      <i class="delImage" @click.stop="delImage0(item, index)">删除图片</i>
                    </template>
                    <i v-else class="el-icon-plus avatar-uploader-icon">点击上传副图</i>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 商品详细描述：
              </div>
              <div
                class="info_right"
                style="padding-top: 8px;"
              >详细描述一般包含产品功能属性、产品细节图片、支付物流、售后服务、公司实力等内容</div>
            </div>
            <div class="editor-container" style="margin-left:132px">
              <Tinymce1 :height="400" ref="editor1" v-model="addbh.OrderTypeInfo[0].DetailInfo" />
            </div>
          </div>
          <div class="infoBox" v-if="activeTab == '一般贸易'">
            <div class="info_item" style="margin-top:10px">
              <div class="info_title">
                <span style="color:red">*</span> SKU标题：
              </div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].Name"
                  placeholder="请输入SKU标题"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                简短描述：
              </div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].ShortDesc"
                  placeholder="请输入简短描述"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 发货仓库：
              </div>
              <div class="info_right">
                <el-select
                  @change="chooseStore2"
                  class="search_title"
                  clearable
                  v-model="addbh.OrderTypeInfo[2].StoreCode"
                  size="small"
                  placeholder="请选择仓库"
                >
                  <el-option
                    v-for="item in storeList"
                    :key="item.Code"
                    :label="item.Name"
                    :value="item.Code"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="addbh.OrderTypeInfo[2].StoreCode">
              <div
                class="info_item"
                style="min-height:20px !important;padding-bottom: 8px; height:auto"
              >
                <div class="info_title" style="line-height:30px">发货地：</div>
                <div class="info_right">
                  <span style="margin-left:4px;line-height: 32px;">{{bsbhAddress2}}</span>
                </div>
              </div>
            </template>
            <div class="info_item">
              <div class="info_title">备货数量：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].Amount"
                  placeholder="请输入备货数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <!-- <div class="info_item">
          <div class="info_title">库存数量：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              v-model="addbh.OrderTypeInfo[2].Amount"
              placeholder="请输入库存数量"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">入仓批次号：</div>
          <div class="info_right">
            <el-input
              class="inputClass"
              disabled
              v-model="addbh.OrderTypeInfo[2].BatchNo"
              placeholder
              size="mini"
            ></el-input>
          </div>
            </div>-->
            <div class="info_item">
              <div class="info_title">成本价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].CostPrice"
                  placeholder="请输入成本价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">批发价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].Price"
                  placeholder="请输入批发价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">零售价（元）：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].RetailPrice"
                  placeholder="请输入零售价"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">24H最大购买数量：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].MaxBuyNumber"
                  placeholder="请输入24H最大购买数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">包装：</div>
              <div class="info_right">
                <el-input
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].PackgeInfo"
                  placeholder="请填写包装"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_right" style="margin:0 0 10px 91px">
              效期：
              <el-date-picker
                v-model="addbh.OrderTypeInfo[2].Expiration"
                type="date"
                size="mini"
                :picker-options="pickerDisabled"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
            <div class="info_item">
              <div class="info_title">是否混装：</div>
              <div class="info_right" style="margin-top: 5px;">
                <el-checkbox v-model="addbh.OrderTypeInfo[2].SkuRuleSettingInfo.IsMixedLoading">是</el-checkbox>
              </div>
            </div>
            <div class="info_item" v-if="!addbh.OrderTypeInfo[2].SkuRuleSettingInfo.IsMixedLoading">
              <div class="info_title">
                <span style="color:red">*</span> 下单数量：
              </div>
              <div class="info_right">
                <el-input
                  @keyup.native="proving2"
                  style="width:220px"
                  class="inputClass"
                  v-model="addbh.OrderTypeInfo[2].SkuRuleSettingInfo.SeparateBillVal"
                  placeholder="请输入下单数量"
                  size="mini"
                ></el-input>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">运费模版：</div>
              <div class="info_right">
                <el-select
                  size="mini"
                  @change="(val) => { getTmpInfo(val,2) }"
                  filterable
                  v-model="addbh.OrderTypeInfo[2].TransFeeTemplate"
                  placeholder="请选择一般贸易运费模板"
                >
                  <el-option
                    v-for="(item,index) in expTempList3"
                    :key="index"
                    :label="item.Name"
                    :value="item.Id"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <template v-if="addbh.OrderTypeInfo[2].expInfo">
              <div
                class="info_item"
                style="min-height:88px !important;padding-bottom: 8px; height:auto"
              >
                <div class="info_title" style="line-height:80px;">运费模版详情：</div>
                <div class="info_right" style="display:block">
                  <!-- <p>
                    发货地：
                    <span
                      style="color:#ff0000"
                    >{{ addbh.OrderTypeInfo[2].expInfo.Country + addbh.OrderTypeInfo[2].expInfo.Province + addbh.OrderTypeInfo[2].expInfo.City + addbh.OrderTypeInfo[2].expInfo.District }}</span>
                  </p>-->
                  <div style="width:100%" v-if="addbh.OrderTypeInfo[2].expInfo.IsCharge != 0">
                    <div v-for="(i,index) in addbh.OrderTypeInfo[2].expInfo.items" :key="index">
                      <p>
                        运送至：
                        <span
                          style="color:#ff0000"
                        >{{ i.Areas.length == 0 ? i.ExpressTo : getCityStr(i.Areas)}}</span>
                      </p>
                      <p>
                        {{ i.IsDefault ? '默认运费' : '运费' }}
                        <span
                          style="color:#ff0000"
                        >{{ i.FirstNumber }}{{ addbh.OrderTypeInfo[2].expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>/内
                        <span style="color:#ff0000">{{ i.FirstTransFee }}</span>元，每增加
                        <span
                          style="color:#ff0000"
                        >{{ i.SecondNumber }}{{ addbh.OrderTypeInfo[2].expInfo.ChargeMode == 2 ? 'Kg' : '件' }}</span>，增加运费
                        <span style="color:#ff0000">{{ i.SecondTransFee }}</span>元
                      </p>
                    </div>
                  </div>
                  <div v-else style="line-height:80px;color: #ff0000">包邮</div>
                </div>
              </div>
            </template>

            <!-- <div class="info_item">
              <div class="info_title">快速预览选项：</div>
              <div class="info_right">
                <span style="color:#606266;line-height: 28px;">数量：</span>
                <el-input
                  size="mini"
                  type="text"
                  style="width:70px;"
                  v-model.number="previewsInfo.amount"
                ></el-input>
                <span style="color:#606266;line-height: 28px;margin-left: 5px;">描述：</span>
                <el-input size="mini" type="text" style="width:70px;" v-model="previewsInfo.Desc"></el-input>
                <span>
                  <el-button
                    :disabled="this.previewsInfo.amount === '' || this.previewsInfo.Desc === ''"
                    class="ml10"
                    size="mini"
                    @click="addPreviewsInfo(2)"
                    type="primary"
                  >添加</el-button>
                </span>
              </div>
            </div>-->
            <!-- <div class="info_item" v-if="addbh.OrderTypeInfo[2].PreviewsInfo.length > 0">
              <div class="info_title"></div>
              <div class="info_right">
                <el-tag
                  @close="deletePrview(2, index)"
                  closable
                  style="margin-right:10px;"
                  v-for="(item,index) in addbh.OrderTypeInfo[2].PreviewsInfo"
                  type="success"
                  :key="index"
                >{{ item.Amount + item.Desc }}</el-tag>
              </div>
            </div>-->

            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 商品图片：
              </div>
              <div
                class="info_right"
                style="padding-top: 8px;"
              >支持.jpg .jpeg .png格式图片，大小2M以内，最多上传5张图片</div>
            </div>
            <div class="infoDesc upload" style="margin-left:113px;margin-top:-20px">
              <div class="addskuupload">
                <div class="addskuuploadItem" style="margin-right: 8px;">
                  <el-upload
                    :ref="'upload_' + 2"
                    class="avatar-uploader"
                    action
                    accept="image/*"
                    :http-request="uploadImg"
                    :show-file-list="false"
                    :before-upload="(res) => {  return beforeAvatarUpload(res, 2) }"
                  >
                    <img
                      v-if="!addbh.OrderTypeInfo[2].Image == ''"
                      :src="addbh.OrderTypeInfo[2].showImg"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon">商品主图</i>
                  </el-upload>
                </div>
                <div
                  class="addskuuploadItem"
                  style="margin-right: 8px;"
                  v-for="(item, index) in addbh.OrderTypeInfo[2].MoreImage"
                  :key="index"
                >
                  <el-upload
                    accept="image/*"
                    :ref="'upload-2' + index"
                    class="avatar-uploader"
                    action
                    :http-request="uploadImg2"
                    :show-file-list="false"
                    :before-upload="(res) => { return beforeAvatarUpload2(res, index) }"
                  >
                    <template v-if="item != ''">
                      <img :src="addbh.OrderTypeInfo[2].showMoreImage[index]" class="avatar" />
                      <i class="delImage" @click.stop="delImage2(item, index)">删除图片</i>
                    </template>
                    <i v-else class="el-icon-plus avatar-uploader-icon">点击上传副图</i>
                  </el-upload>
                </div>
              </div>
            </div>
            <div class="info_item">
              <div class="info_title">
                <span style="color:red">*</span> 商品详细描述：
              </div>
              <div
                class="info_right"
                style="padding-top: 8px;"
              >详细描述一般包含产品功能属性、产品细节图片、支付物流、售后服务、公司实力等内容</div>
            </div>
            <div class="editor-container" style="margin-left:132px">
              <Tinymce2 :height="400" ref="editor2" v-model="addbh.OrderTypeInfo[2].DetailInfo" />
            </div>
          </div>
        </div>
      </div>
    </el-form>
    <GoodsDialog :goodsVisible="goodsVisible" @choice="choiceGoods" @close="onclose"></GoodsDialog>
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
              v-model="standardType"
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
            <el-input
              class="inputClass lh40"
              style="width:300px"
              v-model="propName"
              placeholder="请输入规格名称"
              size="mini"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSpec">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="提示"
      :center="true"
      :visible.sync="ppxqFlag"
      width="30%"
    >
      <div class="infoBox">
        <div style="margin:auto auto">
          <div style="text-align:center;font-size:26px">效期未匹配到商品库存</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="ppxqFlag = false">关 闭</el-button>
        <el-button size="mini" type="primary" @click="ppxqFlag = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU规格值"
      :visible.sync="ValdialogVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item" v-if="this.standardType=='3'">
          <div class="info_title">数量：</div>
          <div class="info_right">
            <el-input
              style="width:300px"
              class="inputClass"
              @keyup.native="number"
              v-model="standardQuantity"
              placeholder="请输入数量"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item" v-if="this.standardType=='1'||this.standardType=='3'">
          <div class="info_title lh40">规格值：</div>
          <div class="info_right">
            <el-input
              style="width:300px"
              class="inputClass lh40"
              v-model="propValName"
              placeholder="请输入规格值"
              size="mini"
            ></el-input>
          </div>
        </div>
        <div class="info_item" v-if="this.standardType=='2'">
          <div class="info_title lh40">效期格式：</div>
          <div class="info_right">
            <el-radio-group class="lh40" v-model="valDateType" style="margin-top:4px">
              <el-radio :label="0">年月日</el-radio>
              <el-radio :label="1">年月</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="info_item" v-if="this.standardType=='2' && valDateType!==null ">
          <div class="info_title">规格值日期：</div>
          <div class="info_right">
            <el-date-picker
              :value-format=" valDateType == 1?'yyyy-MM':'yyyy-MM-dd' "
              class="inputClass"
              v-model="propValName"
              :type="valDateType == 1?'month':'date'"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="ValdialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addSpecVal">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增sku属性-->
    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU属性"
      :visible.sync="addAttrVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">
            <span class="red">*</span>属性名称：
          </div>
          <div class="info_right">
            <el-input class="inputClass" v-model="addAttr.Name" placeholder="请输入属性名称" size="mini"></el-input>
          </div>
        </div>
        <div class="info_item">
          <div class="info_title">
            <span class="red">*</span>属性类型：
          </div>
          <div class="info_right">
            <el-select size="mini" v-model="addAttr.ValType" placeholder="请选择">
              <el-option
                v-for="(item,index) in addAttrOptions"
                :key="index"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addAttrVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addAttrs">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      title="新增SKU属性值"
      :visible.sync="addAttrValVisible"
      width="30%"
    >
      <div class="infoBox">
        <div class="info_item">
          <div class="info_title">
            <span class="red">*</span>属性值名称：
          </div>
          <div class="info_right">
            <el-input
              class="inputClass"
              v-model="addAttrValName"
              placeholder="请输入属性值名称"
              size="mini"
            ></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="addAttrValVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="addAttrsVal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import worldoptions from "../../../static/js/addressJson";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "sku/" +
  moment().format("YYYYMM") +
  "/img/";
import { StoreList } from "@/api/order/orderCenter";
import { getSkuList } from "@/api/adv/recGoods";
import { getBrandList } from "@/api/brand/index";
import { getUnitList } from "@/api/brand/unit";
import { getOriginList } from "@/api/brand/origin";
// getSkuSpec
import { getSkuSpecList, getStoreRest } from "@/api/sku/skuprop";
import { getAttr } from "@/api/sku/prop";
import { getKeyword } from "@/api/keyword/keyword.js";
import GoodsDialog from "@/components/Goods/GoodsDialog.vue";
import Tinymce from "@/components/Tinymce";
import Tinymce1 from "@/components/Tinymce_0";
import Tinymce2 from "@/components/Tinymce_1";
import { getTransFeeTemplateInfo } from "@/api/transFeeTemplate/transFeeTemplate";
import descartes from "@/utils/descartes";
import {
  getExpTemp,
  addSku,
  getSkuInfo,
  getQuoteBySkuId,
  getAttrBySkuId,
  editSku,
  editAttrBySkuid,
  delSkuImage
} from "@/api/sku/addsku";
import { addAttr, addAttrProp } from "@/api/sku/prop";
import { addSkuSpec, addSkuSpecItem } from "@/api/sku/skuspec";
import Sticky from "@/components/Sticky";
const orderTypeItem = (id, cp) => ({
  OrderType: id,
  Amount: 0,
  Price: 0,
  Image: "",
  Name: "",
  ShortDesc: "",
  MoreImage: ["", "", "", ""],
  CostPrice: cp,
  RetailPrice: 0,
  MaxBuyNumber: 0,
  PackgeInfo: "",
  DetailInfo: "",
  TransFeeTemplate: null,
  StoreCode: null,
  PreviewsInfo: [],
  SkuRuleSettingInfo: {
    IsMixedLoading: true,
    SeparateBillVal: null
  },
  expInfo: null,
  TaxRate: 0
});
const stdTpl = () => ({
  SN: "",
  NameCN: "",
  GoodsId: "",
  GoodsAmount: 1,
  GrossWeight: 0,
  BoxVolume: 0,
  Image: "",
  StdDetail: [],
  OrderTypeInfo: [
    //跨境直邮
    {
      MoreImage: ["", "", "", ""],
      OrderType: 1,
      Image: "",
      Name: "",
      ShortDesc: "",
      DetailInfo: "",
      // DeliveryAddress: [],
      Amount: 0,
      //SKU设置
      SkuRuleSettingInfo: {
        IsMixedLoading: true,
        SeparateBillVal: null
      },
      PackgeInfo: "",
      Price: 0,
      CostPrice: 0,
      RetailPrice: 0,
      StoreCode: null,
      Expiration: null,
      MaxBuyNumber: 0,
      TransFeeTemplate: null,
      PreviewsInfo: [],
      TaxRate: 0
    },
    //保税备货
    {
      OrderType: 2,
      MoreImage: ["", "", "", ""],
      Name: "",
      ShortDesc: "",
      PackgeInfo: "",
      SkuRuleSettingInfo: {
        IsMixedLoading: true,
        SeparateBillVal: null
      },
      DetailInfo: "",
      Image: "",
      Amount: 0,
      Price: 0,
      CostPrice: 0,
      RetailPrice: 0,
      StoreCode: null,
      Expiration: null,
      MaxBuyNumber: 0,
      PreviewsInfo: [],
      TransFeeTemplate: null,
      TaxRate: 0
    },
    //一般贸易
    {
      OrderType: 3,
      Name: "",
      ShortDesc: "",
      MoreImage: ["", "", "", ""],
      Image: "",
      DetailInfo: "",
      PackgeInfo: "",
      SkuRuleSettingInfo: {
        IsMixedLoading: true,
        SeparateBillVal: null
      },
      Amount: 0,
      Price: 0,
      CostPrice: 0,
      PreviewsInfo: [],
      RetailPrice: 0,
      StoreCode: null,
      Expiration: null,
      MaxBuyNumber: 0,
      TaxRate: 0,
      TransFeeTemplate: null
    }
  ]
});
export default {
  components: { GoodsDialog, Tinymce, Sticky, Tinymce1, Tinymce2 },
  data() {
    // 图片效验规格
    const checkImage = (rule, value, callback) => {
      if (this.ruleForm.Image === "") {
        callback(new Error("请至少上传一张商品主图"));
      } else {
        callback();
      }
    };
    const specValidator = (rule, val, callback) => {
      const o = {};
      val.map(v => {
        const f = v.split(",");
        this.ruleForm.baseSpecList.map(item => {
          if (parseInt(item.Id) === parseInt(f[0])) {
            item.Vals.map(i => {
              if (parseInt(i.Id) === parseInt(f[1])) {
                if (o[f[0]]) {
                  o[f[0]].push(i);
                } else {
                  o[f[0]] = [];
                  o[f[0]].push(i);
                }
              }
            });
          }
        });
      });
      if (Object.keys(o).length !== this.ruleForm.baseSpecList.length) {
        callback(new Error("请所有规格至少选择一个"));
      } else {
        callback();
      }
    };

    return {
      valDateType: null,
      standardQuantity: null,
      standardType: "",
      storeList: [],
      uploadfiles: [],
      timeVal: null,
      imgNames: [],
      uploadfiles1: [],
      imgNames1: [],
      uploadfiles2: [],
      imgNames2: [],
      uploadfiles20: [],
      imgNames20: [],
      picShow: "",
      spztIndex: [],
      ftIndex: "",
      ztIndex: "",
      isfff: false,
      ppxqFlag: false,
      IsDurationFlag: 0,
      addspecindex: -1,
      defprop: [],
      backproplist: [],
      propList: [],
      propcount: -1,
      orderStatusList: [
        { name: "保税备货", index: 1 },
        { name: "跨境直邮", index: 2 },
        { name: "一般贸易", index: 3 }
      ],
      pickerDisabled: {
        //验证时间范围
        disabledDate: time => {
          return time.getTime() < Date.now();
        }
      },
      addbh: {
        SN: "",
        NameCN: "",
        GoodsId: "",
        GoodsAmount: 1,
        GrossWeight: 0,
        BoxVolume: 0,
        Image: "",
        StdDetail: [],
        OrderTypeInfo: [
          //跨境直邮
          {
            MoreImage: ["", "", "", ""],
            OrderType: 1,
            Image: "",
            Name: "",
            ShortDesc: "",
            SkuRuleSettingInfo: {
              IsMixedLoading: true,
              SeparateBillVal: null
            },
            PackgeInfo: "",
            DetailInfo: "",
            // DeliveryAddress: [],
            Amount: 0,
            StoreCode: null,
            Price: 0,
            CostPrice: 0,
            RetailPrice: 0,
            Expiration: null,
            MaxBuyNumber: 0,
            TransFeeTemplate: null,
            PreviewsInfo: [],
            TaxRate: 0
          },
          //保税备货
          {
            OrderType: 2,
            MoreImage: ["", "", "", ""],
            Name: "",
            ShortDesc: "",
            PackgeInfo: "",
            DetailInfo: "",
            SkuRuleSettingInfo: {
              IsMixedLoading: true,
              SeparateBillVal: null
            },
            Image: "",
            Amount: 0,
            Price: 0,
            CostPrice: 0,
            StoreCode: null,
            RetailPrice: 0,
            Expiration: null,
            MaxBuyNumber: 0,
            PreviewsInfo: [],
            TransFeeTemplate: null,
            TaxRate: 0
          },
          //一般贸易
          {
            OrderType: 3,
            Name: "",
            ShortDesc: "",
            PackgeInfo: "",
            MoreImage: ["", "", "", ""],
            Image: "",
            DetailInfo: "",
            SkuRuleSettingInfo: {
              IsMixedLoading: true,
              SeparateBillVal: null
            },
            Amount: 0,
            Price: 0,
            StoreCode: null,
            CostPrice: 0,
            PreviewsInfo: [],
            RetailPrice: 0,
            Expiration: null,
            MaxBuyNumber: 0,
            TaxRate: 0,
            TransFeeTemplate: null
          }
        ]
      },
      addbhindex: null,
      activeTab: "保税备货",
      bhVisible: false,
      keywords: [],
      addAttrValName: "",
      addAttrValVisible: false,
      addAttrVisible: false,
      addAttrValInfo: null,
      addAttr: {
        Name: "",
        ValType: 0
      },
      addAttrOptions: [
        {
          value: 1,
          id: 0,
          label: "单选"
        },
        {
          value: 2,
          id: 1,
          label: "多选"
        }
      ],
      selectedSpec: "",
      selectedAttr: "",
      batch: {
        amount1: "",
        amount2: "",
        GrossWeight: "",
        BoxVolume: "",
        CostPrice: "",
        Price: "",
        RetailPrice: ""
      },
      selectedProp: "",
      dialogVisible: false,
      ValdialogVisible: false,
      areaOptions: {
        value: "name",
        label: "name",
        children: "children"
      },
      areaData: worldoptions,
      propValName: "",
      propName: "",
      deleteOssImages: [],
      sProp: {},
      pList: [],
      aList: [],
      sList: [],
      firstchange: false,
      amount1: "",
      bsbhAddress0: "",
      bsbhAddress1: "",
      bsbhAddress2: "",
      ftIndex0: "",
      ftIndex2: "",
      amount2: "",
      expTempList1: [],
      expTempList2: [],
      expTempList3: [],
      bhlist: [],
      showEdit: false,
      goodsVisible: false,
      brandList: [],
      roleBtn: [],
      originList: [],
      unitList: [],
      activeName: "t_1",
      options: [],
      bhIndex: -1,
      selectedCateCode: [],
      info: {
        CateCode: []
      },
      props: {
        value: "Code",
        children: "Childs",
        label: "Name"
      },
      MoreImage1: [],
      MoreImage2: [],
      MoreImage0: [],
      ruleForm: {
        selectedCateCode: [],
        SeoKeyWords: "",
        SeoDescription: "",
        Labels: "",
        specList: [],
        Unit: "",
        Image: "",
        CSTemplate: 0,
        Code: "",
        BrandCode: "",
        baseSpecList: [],
        baseAttrList: [],
        OriginCode: "",
        skuAttr: [],
        previewsInfo: []
      },
      previewsInfo: {
        amount: "",
        Desc: ""
      },
      isEdit: false,
      isF: false,
      rules: {
        proImage: [{ validator: checkImage }],
        specList: [
          { required: true, validator: specValidator, trigger: "change" }
        ],
        selectedCateCode: [
          {
            required: true,
            type: "array",
            message: "请先选择SKU类别",
            trigger: "change"
          }
        ],
        Labels: [],
        BrandCode: [
          { required: true, message: "请选择品牌", trigger: "change" }
        ],
        OriginCode: [
          { required: true, message: "请选择产地", trigger: "change" }
        ],
        Unit: [{ required: true, message: "请选择单位", trigger: "change" }]
      }
    };
  },
  watch: {
    options: function(nval, oval) {
      if (oval.length === 0 && this.isEdit) {
        new Promise(re => {
          this.getTypeList([this.ruleForm.selectedCateCode[0]]);
          re();
        }).then(() => {
          setTimeout(() => {
            this.getTypeList([
              this.ruleForm.selectedCateCode[0],
              this.ruleForm.selectedCateCode[1]
            ]);
            this.itemchange(this.ruleForm.selectedCateCode);
          }, 500);
        });
      }
    },
    selectedCateCode: function(val) {
      this.info.CateCode = val[2];
    },
    "ruleForm.specList": function(val) {
      if (val.length < 1) return;
      const o = {};
      val.map(v => {
        const f = v.split(",");
        this.ruleForm.baseSpecList.map(item => {
          if (parseInt(item.Id) === parseInt(f[0])) {
            item.Vals.map(i => {
              if (parseInt(i.Id) === parseInt(f[1])) {
                if (o[f[0]]) {
                  o[f[0]].push(i);
                } else {
                  o[f[0]] = [];
                  o[f[0]].push(i);
                }
              }
            });
          }
        });
      });
      let karr = [];
      for (const i in o) {
        karr.push(o[i]);
      }
      let bhobj = {};
      this.bhlist.map(v => {
        v.StdDetail.map(vstd => {
          let stdflag = false;
          for (let k in bhobj) {
            if (k == vstd.StandardId) {
              stdflag = true;
            }
          }
          if (stdflag) {
            let bhobjflag = false;
            bhobj[vstd.StandardId.toString()].map(vbhobj => {
              if (vbhobj.ValId == vstd.ValId && vbhobj.Val == vstd.Val) {
                bhobjflag = true;
              }
            });
            if (!bhobjflag) {
              bhobj[vstd.StandardId.toString()].push(vstd);
            }
          } else {
            bhobj[vstd.StandardId.toString()] = [];
            bhobj[vstd.StandardId.toString()].push(vstd);
          }
        });
      });
      let valnum = val[this.propcount].split(",")[0];
      if (bhobj[valnum] != undefined) {
        for (let bhk in bhobj) {
          if (bhk != valnum) {
            bhobj[bhk].map(bhkv => {
              const tpl = stdTpl();
              let bhkobj = JSON.parse(JSON.stringify(bhkv));
              bhkobj.SkuId = "";
              tpl.StdDetail.push(bhkobj);
              tpl.stdinfo = "";
              this.sList.map(v => {
                if (v.Id == valnum) {
                  v.Vals.map(vv => {
                    if (vv.Id == val[this.propcount].split(",")[1]) {
                      tpl.StdDetail.push({
                        Id: vv.Id,
                        SkuId: "",
                        StandardId: v.Id,
                        StandardName: vv.StandardName,
                        Val: vv.Val,
                        ValId: vv.Id
                      });
                    }
                  });
                }
              });
              tpl.StdDetail.map(item => {
                tpl.stdinfo += item.StandardId + "," + item.Id + "-";
              });
              this.bhlist.push(tpl);
            });
          }
        }
        return;
      }
      karr = descartes(karr);
      const rarr = [];
      karr.map(v => {
        const tpl = stdTpl();
        if (this.ruleForm.baseSpecList.length > 1) {
          tpl.StdDetail.push(...v);
        } else {
          tpl.StdDetail.push(v);
        }
        tpl.stdinfo = "";
        tpl.StdDetail.map(item => {
          tpl.stdinfo += item.StandardId + "," + item.Id + "-";
        });
        rarr.push(tpl);
      });
      const a = [];
      for (let x = 0; x < rarr.length; x++) {
        let item = {};
        for (let k = 0; k < this.bhlist.length; k++) {
          if (this.bhlist[k].stdinfo === rarr[x].stdinfo) {
            item = this.bhlist[k];
          }
        }
        if (Object.keys(item).length === 0) {
          a.push(rarr[x]);
        } else {
          a.push(item);
        }
      }
      this.bhlist = a;
    }
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
  },
  beforeDestroy() {
    this.ruleForm = {};
  },
  created() {
    this.options = [];
    this.roleBtn = this.$store.getters.getMenuForId(this.$route.path);
    new Promise(re => {
      this.getBrandList();
      this.getOriginList();
      this.getUnitList();
      this.getExpTemp();
      this.getKey();
      StoreList().then(res => {
        this.storeList = res.Data;
      });
      this.isF = true;
      re();
    }).then(() => {
      getSkuSpecList().then(res => {
        this.defprop = res;
        this.getSkuQuote().then(() => {
          this.$nextTick(() => {
            if (parseInt(this.$route.query.id) !== -1) {
              this.getData(this.$route.query.id).then(() => {
                this.getTypeList(false);
              });
            } else {
              this.getTypeList(false);
            }
            if (parseInt(this.$route.query.id) === -1) {
              this.bhlist[0] = stdTpl();
            }
            getAttr().then(res => {
              res.map(v => {
                if (parseInt(v.ValType) !== 1) {
                  v.checked = -1;
                } else {
                  v.checked = [];
                }
              });
              this.aList = res;
              this.$set(this.ruleForm, "baseAttrList", res);
              this.setCheckedAttr();
            });
          });
        });
      });
    });
  },
  methods: {
    //验证只能输入正整数--保税备货
    proving1() {
      this.addbh.OrderTypeInfo[1].SkuRuleSettingInfo.SeparateBillVal = this.addbh.OrderTypeInfo[1].SkuRuleSettingInfo.SeparateBillVal.replace(
        /[^\.\d]/g,
        ""
      );
      this.addbh.OrderTypeInfo[1].SkuRuleSettingInfo.SeparateBillVal = this.addbh.OrderTypeInfo[1].SkuRuleSettingInfo.SeparateBillVal.replace(
        ".",
        ""
      );
    },
    proving0() {
      this.addbh.OrderTypeInfo[0].SkuRuleSettingInfo.SeparateBillVal = this.addbh.OrderTypeInfo[0].SkuRuleSettingInfo.SeparateBillVal.replace(
        /[^\.\d]/g,
        ""
      );
      this.addbh.OrderTypeInfo[0].SkuRuleSettingInfo.SeparateBillVal = this.addbh.OrderTypeInfo[0].SkuRuleSettingInfo.SeparateBillVal.replace(
        ".",
        ""
      );
    },
    proving2() {
      this.addbh.OrderTypeInfo[2].SkuRuleSettingInfo.SeparateBillVal = this.addbh.OrderTypeInfo[2].SkuRuleSettingInfo.SeparateBillVal.replace(
        /[^\.\d]/g,
        ""
      );
      this.addbh.OrderTypeInfo[2].SkuRuleSettingInfo.SeparateBillVal = this.addbh.OrderTypeInfo[2].SkuRuleSettingInfo.SeparateBillVal.replace(
        ".",
        ""
      );
    },
    //跨境
    chooseStore0(val) {
      if (val) {
        let obj = this.storeList.find(item => {
          return item.Code == val;
        });
        this.bsbhAddress0 = obj.Country + obj.Address;
      }
    },
    //保税
    chooseStore1(val) {
      if (val) {
        let obj = this.storeList.find(item => {
          return item.Code == val;
        });
        this.bsbhAddress1 = obj.Country + obj.Address;
      }
    },
    //直邮
    chooseStore2(val) {
      if (val) {
        let obj = this.storeList.find(item => {
          return item.Code == val;
        });
        this.bsbhAddress2 = obj.Country + obj.Address;
      }
    },
    //sku展示副图上传--保税备货
    uploadImg1(option) {
      const preDelPic = JSON.parse(
        JSON.stringify(this.addbh.OrderTypeInfo[1].MoreImage)
      )[[this.ftIndex]];
      if (preDelPic) {
        this.deleteOssImages.push(preDelPic);
      }
      this.uploadfiles2 = [];
      this.imgNames2 = [];
      this.uploadfiles2.push(option.file);
      this.imgNames2.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames2.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles2.length; i++) {
        this.uploadImgToOSS(this.uploadfiles2[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          const a = JSON.parse(
            JSON.stringify(this.addbh.OrderTypeInfo[1].MoreImage)
          );
          a[this.ftIndex] = imgFileNameList[0];
          this.MoreImage1[this.ftIndex] = signUrl;
          this.addbh.OrderTypeInfo[1].MoreImage = a;

          if (this.addbh.OrderTypeInfo[1].showMoreImage) {
            this.addbh.OrderTypeInfo[1].showMoreImage[this.ftIndex] = signUrl;
          } else {
            this.$set(
              this.addbh.OrderTypeInfo[1],
              "showMoreImage",
              this.MoreImage1
            );
          }
        });
      }, 1000);
    },
    uploadImg0(option) {
      const preDelPic = JSON.parse(
        JSON.stringify(this.addbh.OrderTypeInfo[0].MoreImage)
      )[[this.ftIndex0]];
      if (preDelPic) {
        this.deleteOssImages.push(preDelPic);
      }
      this.uploadfiles20 = [];
      this.imgNames20 = [];
      this.uploadfiles20.push(option.file);
      this.imgNames20.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames20.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles20.length; i++) {
        this.uploadImgToOSS(this.uploadfiles20[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          const a = JSON.parse(
            JSON.stringify(this.addbh.OrderTypeInfo[0].MoreImage)
          );
          a[this.ftIndex0] = imgFileNameList[0];
          this.MoreImage0[this.ftIndex0] = signUrl;
          this.addbh.OrderTypeInfo[0].MoreImage = a;
          if (this.addbh.OrderTypeInfo[0].showMoreImage) {
            this.addbh.OrderTypeInfo[0].showMoreImage[this.ftIndex0] = signUrl;
          } else {
            this.$set(
              this.addbh.OrderTypeInfo[0],
              "showMoreImage",
              this.MoreImage0
            );
          }
        });
      }, 1000);
    },
    //一般贸易
    uploadImg2(option) {
      const preDelPic = JSON.parse(
        JSON.stringify(this.addbh.OrderTypeInfo[2].MoreImage)
      )[[this.ftIndex2]];
      if (preDelPic) {
        this.deleteOssImages.push(preDelPic);
      }
      this.uploadfiles2 = [];
      this.imgNames2 = [];
      this.uploadfiles2.push(option.file);
      this.imgNames2.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames2.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles2.length; i++) {
        this.uploadImgToOSS(this.uploadfiles2[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          const a = JSON.parse(
            JSON.stringify(this.addbh.OrderTypeInfo[2].MoreImage)
          );
          a[this.ftIndex2] = imgFileNameList[0];
          this.MoreImage2[this.ftIndex2] = signUrl;
          this.addbh.OrderTypeInfo[2].MoreImage = a;

          if (this.addbh.OrderTypeInfo[2].showMoreImage) {
            this.addbh.OrderTypeInfo[2].showMoreImage[this.ftIndex2] = signUrl;
          } else {
            this.$set(
              this.addbh.OrderTypeInfo[2],
              "showMoreImage",
              this.MoreImage2
            );
          }
        });
      }, 1000);
    },
    //自定義圖片上傳方法
    //商品主图上传 spztIndex
    uploadImg(option) {
      let self = this;
      //如果是编辑操作，执行图片删除
      const preDelPic = this.addbh.OrderTypeInfo[this.spztIndex].Image;
      if (preDelPic) {
        this.deleteOssImages.push(preDelPic);
      }
      this.uploadfiles = [];
      this.imgNames = [];
      this.uploadfiles.push(option.file);
      this.imgNames.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames.map(element => {
        let name = Math.floor(Math.random() * 1000) + new Date().getTime();
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles.length; i++) {
        this.uploadImgToOSS(this.uploadfiles[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        const a = this.addbh.OrderTypeInfo[this.spztIndex];
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          a.Image = imgFileNameList[0];
          this.$set(a, "showImg", signUrl);
        });
      }, 1000);
    },
    //上传到ali-OSS
    uploadImgToOSS(file, imgName) {
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      async function put() {
        try {
          let result = await client.put(imgName, file);
        } catch (e) {
          console.log(e);
        }
      }
      put();
    },
    //删除oss上的图片
    deleteOssPic(picArr) {
      let client = new OSS(window.ali_oss_data.PARAMS_OBJ);
      async function deleteMulti() {
        try {
          let result = await client.deleteMulti(picArr, {
            quiet: true
          });
          console.log(result);
        } catch (e) {
          console.log(e);
        }
      }

      deleteMulti();
    },
    propchildvalchange(v) {
      this.$forceUpdate();
    },
    addnewprop() {
      if (this.propList.length > 2) {
        this.$message.error("最多支持3组规格");
        return;
      }
      this.propList.push({
        prop: JSON.parse(JSON.stringify(this.defprop)),
        propval: null,
        propselectedval: [],
        propchildval: null
      });
    },
    getCityStr(row) {
      let str = "";
      row.map(v => {
        if (v.IsAllSelect) {
          str += v.Name + ",";
        } else {
          v.ChildArea.map(item => {
            str += item.Name + ",";
          });
        }
      });
      return str.substring(0, str.length - 1);
    },
    getTmpInfo(val, index) {
      getTransFeeTemplateInfo({
        Id: val
      }).then(res => {
        const a = JSON.parse(JSON.stringify(this.addbh));
        a.OrderTypeInfo[index].expInfo = res;
        this.addbh = a;
      });
    },
    getKey() {
      getKeyword({
        pageIndex: 1,
        pageSize: 999999
      }).then(res => {
        this.keywords = res.Data;
      });
    },
    cancelIndo() {
      this.showEdit = false;
    },
    saveBhInfo() {
      //判断是否都有库存
      let flag = this.addbh.OrderTypeInfo.every(element => {
        return element.BatchNo != "";
      });
      if (this.IsDurationFlag == "1" && this.propList.length > 0 && !flag) {
        this.ppxqFlag = true;
      } else {
        let f = true;
        // if (
        //   this.addbh.OrderTypeInfo[0].Amount > 0 &&
        //   this.addbh.OrderTypeInfo[0].DeliveryAddress == ""
        // ) {
        //   this.$message.error("请填写跨境直邮下的发货地");
        //   f = false;
        // }
        let tFlag = this.addbh.OrderTypeInfo.some(ele => {
          return ele.Price > 0 && ele.CostPrice > 0 && ele.RetailPrice > 0;
        });
        if (tFlag) {
        } else {
          f = false;
          this.$message.error("请至少设置一种贸易类型的备货信息");
        }
        this.addbh.OrderTypeInfo.map((v, index) => {
          if (v.OrderType == 3) {
            v.Amount = parseInt(v.Amount);
          } else {
            v.Amount = parseInt(v.Amount);
            // v.Amount = parseInt(v.BatchQty);
          }

          v.MaxBuyNumber = parseInt(v.MaxBuyNumber);
          v.Price = parseFloat(v.Price);
          v.CostPrice = parseFloat(v.CostPrice);
          v.RetailPrice = parseFloat(v.RetailPrice);
          v.Amount === "" ? (v.Amount = 0) : (v.Amount = v.Amount);
          // if (

          //   (v.CostPrice === 0 || v.Price === 0 || v.RetailPrice === 0)
          // ) {
          //   this.$message.error("请为备货数量大于1的贸易类型设置正确的价格");
          //   f = false;
          // }
          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            (v.TaxRate < 0 || v.TaxRate > 99.99)
          ) {
            this.$message.error("请为已填写价格的贸易类型设置正确的税率");
            f = false;
          }

          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            v.DetailInfo == ""
          ) {
            this.$message.error("请为已填写价格的贸易类型设置商品详情");
            f = false;
          }

          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            (v.SkuRuleSettingInfo.SeparateBillVal == null ||
              v.SkuRuleSettingInfo.SeparateBillVal == "" ||
              v.SkuRuleSettingInfo.SeparateBillVal == "0") &&
            !v.SkuRuleSettingInfo.IsMixedLoading
          ) {
            this.$message.error(
              "请为已填写价格的贸易类型设置正确的下单数量（必填且必须大于0）"
            );
            f = false;
          }

          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            v.Image == ""
          ) {
            this.$message.error("请为已填写价格的贸易类型设置商品主图");
            f = false;
          }
          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            v.Name == ""
          ) {
            this.$message.error("请为已填写价格的贸易类型设置SKU标题");
            f = false;
          }
          // if (
          //   v.CostPrice > 0 &&
          //   v.Price > 0 &&
          //   v.RetailPrice > 0 &&
          //   v.ShortDesc == ""
          // ) {
          //   this.$message.error("请为已填写价格的贸易类型设置简短描述");
          //   f = false;
          // }
          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            v.StoreCode == ""
          ) {
            this.$message.error("请为已填写价格的贸易类型设置发货地");
            f = false;
          }
          if (
            v.CostPrice > 0 &&
            v.Price > 0 &&
            v.RetailPrice > 0 &&
            v.TransFeeTemplate === null
          ) {
            this.$message.error("请为已填写价格的贸易类型设置正确的运费模版");
            f = false;
          }
          if (v.SkuRuleSettingInfo.IsMixedLoading) {
            v.SkuRuleSettingInfo.SeparateBillVal = null;
          }
          // if (f && v.DeliveryAddress) {
          //   v.DeliveryAddress = v.DeliveryAddress.join("-");
          // }
        });
        if (f) {
          this.showEdit = false;
          this.addbh.OrderTypeInfo.map((v, index) => {
            if (
              v.Amount > 0 &&
              (v.CostPrice > v.RetailPrice || v.CostPrice > v.Price)
            ) {
              this.$message({
                message: "警告：您设置的零售价或批发价小于成本价！！！",
                center: true,
                type: "warning",
                duration: 5000
              });
            }
          });

          const a = JSON.parse(JSON.stringify(this.bhlist));
          console.log(a);
          a[this.addbhindex] = this.addbh;
          this.bhlist = a;
          this.bhVisible = false;
          this.addbh = {
            SN: "",
            NameCN: "",
            GoodsId: "",
            GoodsAmount: 1,
            GrossWeight: 0,
            BoxVolume: 0,
            Image: "",
            StdDetail: [],
            OrderTypeInfo: [
              //跨境直邮
              {
                MoreImage: ["", "", "", ""],
                OrderType: 1,
                Image: "",
                Name: "",
                PackgeInfo: "",
                ShortDesc: "",
                DetailInfo: "",
                // DeliveryAddress: [],
                Amount: 0,
                Price: 0.0,
                StoreCode: null,
                CostPrice: 0.0,
                SkuRuleSettingInfo: {
                  IsMixedLoading: true,
                  SeparateBillVal: null
                },
                RetailPrice: 0.0,
                Expiration: null,
                MaxBuyNumber: 0,
                TransFeeTemplate: null,
                PreviewsInfo: [],
                TaxRate: 0
              },
              //保税备货
              {
                OrderType: 2,
                MoreImage: ["", "", "", ""],
                Name: "",
                ShortDesc: "",
                DetailInfo: "",
                Image: "",
                PackgeInfo: "",
                Amount: 0,
                Price: 0.0,
                StoreCode: null,
                CostPrice: 0.0,
                SkuRuleSettingInfo: {
                  IsMixedLoading: true,
                  SeparateBillVal: null
                },
                RetailPrice: 0.0,
                Expiration: null,
                MaxBuyNumber: 0,
                PreviewsInfo: [],
                TransFeeTemplate: null,
                TaxRate: 0
              },
              //一般贸易
              {
                OrderType: 3,
                Name: "",
                ShortDesc: "",
                MoreImage: ["", "", "", ""],
                Image: "",
                DetailInfo: "",
                Amount: 0,
                PackgeInfo: "",
                Price: 0.0,
                StoreCode: null,
                SkuRuleSettingInfo: {
                  IsMixedLoading: true,
                  SeparateBillVal: null
                },
                CostPrice: 0.0,
                PreviewsInfo: [],
                RetailPrice: 0.0,
                Expiration: null,
                MaxBuyNumber: 0,
                TaxRate: 0,
                TransFeeTemplate: null
              }
            ]
          };
          this.addbhindex = null;
          this.activeTab = "保税备货";
        }
      }
    },
    editBhInfo(row) {
      if (row.row.GoodsId === "") {
        this.$message.error("请先选择商品");
        return;
      }
      this.MoreImage0 = [];
      this.MoreImage1 = [];
      this.MoreImage2 = [];
      this.showEdit = true;
      this.addbhindex = row.$index;
      this.addbh = row.row;
      console.log(row.row);

      this.addbh.OrderTypeInfo.map(item => {
        if (item.SkuRuleSettingInfo) {
          if (item.SkuRuleSettingInfo.SeparateBillVal) {
            item.SkuRuleSettingInfo.SeparateBillVal = item.SkuRuleSettingInfo.SeparateBillVal.toString();
          }
        } else {
          item.SkuRuleSettingInfo = {
            IsMixedLoading: true,
            SeparateBillVal: null
          };
        }
        if (item.StoreCode) {
          let obj = this.storeList.find(ele => {
            return ele.Code == item.StoreCode;
          });
          if (item.OrderType == 1) {
            this.bsbhAddress0 = obj.Country + obj.Address;
          } else if (item.OrderType == 3) {
            this.bsbhAddress2 = obj.Country + obj.Address;
          } else if (item.OrderType == 2) {
            this.bsbhAddress1 = obj.Country + obj.Address;
          }
        }
        // if (item.DeliveryAddress) {
        //   if (item.DeliveryAddress instanceof Array) {
        //   } else {
        //     if (item.DeliveryAddress == "") {
        //       item.DeliveryAddress = [];
        //     } else {
        //       item.DeliveryAddress = item.DeliveryAddress.split("-");
        //     }
        //   }
        // }
        // if (item.DeliveryAddress == "") {
        //   item.DeliveryAddress = [];
        // }
        if (!item.MoreImage) {
          item.MoreImage = ["", "", "", ""];
        }
      });
      // getStoreRest({
      //   tradeType: 1,
      //   sn: this.addbh.SN,
      //   expiration: this.addbh.OrderTypeInfo[0].Expiration || "",
      //   Token: window.localStorage.getItem("Token")
      // }).then(res => {
      //   // if (res) {
      //   //   this.$set(this.addbh.OrderTypeInfo[0], "BatchNo", res.BatchNo);
      //   //   this.$set(this.addbh.OrderTypeInfo[0], "BatchQty", res.BatchQty);
      //   //   this.$set(this.addbh.OrderTypeInfo[0], "expiration", res.ExpireDate);
      //   // } else {
      //   this.$set(this.addbh.OrderTypeInfo[0], "BatchNo", "");
      //   this.$set(this.addbh.OrderTypeInfo[0], "BatchQty", "");
      //   this.$set(this.addbh.OrderTypeInfo[0], "expiration", "");
      //   // }
      // });
      // getStoreRest({
      //   tradeType: 2,
      //   sn: this.addbh.SN,
      //   expiration: this.addbh.OrderTypeInfo[1].Expiration || "",
      //   Token: window.localStorage.getItem("Token")
      // }).then(res => {
      //   // if (res) {
      //   //   this.$set(this.addbh.OrderTypeInfo[1], "BatchNo", res.BatchNo);
      //   //   this.$set(this.addbh.OrderTypeInfo[1], "BatchQty", res.BatchQty);
      //   //   this.$set(this.addbh.OrderTypeInfo[1], "expiration", res.ExpireDate);
      //   // } else {
      //   this.$set(this.addbh.OrderTypeInfo[1], "BatchNo", "");
      //   this.$set(this.addbh.OrderTypeInfo[1], "BatchQty", "");
      //   this.$set(this.addbh.OrderTypeInfo[1], "expiration", "");
      //   // }
      // });
      // getStoreRest({
      //   tradeType: 3,
      //   sn: this.addbh.SN,
      //   expiration: this.addbh.OrderTypeInfo[2].Expiration || "",
      //   Token: window.localStorage.getItem("Token")
      // }).then(res => {
      //   // if (res) {
      //   //   this.$set(this.addbh.OrderTypeInfo[2], "BatchNo", res.BatchNo);
      //   //   this.$set(this.addbh.OrderTypeInfo[2], "BatchQty", res.BatchQty);
      //   //   this.$set(this.addbh.OrderTypeInfo[2], "expiration", res.ExpireDate);
      //   // } else {
      //   this.$set(this.addbh.OrderTypeInfo[2], "BatchNo", "");
      //   this.$set(this.addbh.OrderTypeInfo[2], "BatchQty", "");
      //   this.$set(this.addbh.OrderTypeInfo[2], "expiration", "");
      //   // }
      // });

      this.addbh.OrderTypeInfo[0].CostPrice = Number(
        this.addbh.OrderTypeInfo[0].CostPrice
      ).toFixed(2);
      this.addbh.OrderTypeInfo[0].Price = Number(
        this.addbh.OrderTypeInfo[0].Price
      ).toFixed(2);
      this.addbh.OrderTypeInfo[0].RetailPrice = Number(
        this.addbh.OrderTypeInfo[0].RetailPrice
      ).toFixed(2);

      this.addbh.OrderTypeInfo[1].CostPrice = Number(
        this.addbh.OrderTypeInfo[1].CostPrice
      ).toFixed(2);
      this.addbh.OrderTypeInfo[1].Price = Number(
        this.addbh.OrderTypeInfo[1].Price
      ).toFixed(2);
      this.addbh.OrderTypeInfo[1].RetailPrice = Number(
        this.addbh.OrderTypeInfo[1].RetailPrice
      ).toFixed(2);

      this.addbh.OrderTypeInfo[2].CostPrice = Number(
        this.addbh.OrderTypeInfo[2].CostPrice
      ).toFixed(2);
      this.addbh.OrderTypeInfo[2].Price = Number(
        this.addbh.OrderTypeInfo[2].Price
      ).toFixed(2);
      this.addbh.OrderTypeInfo[2].RetailPrice = Number(
        this.addbh.OrderTypeInfo[2].RetailPrice
      ).toFixed(2);
      this.bhVisible = true;
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
    checkIsInt(row, id) {
      this.bhlist[row]["MaxBuyNumber" + id] = this.bhlist[row][
        "MaxBuyNumber" + id
      ].replace(/[^\.\d]/g, "0");
      this.bhlist[row]["MaxBuyNumber" + id] = this.bhlist[row][
        "MaxBuyNumber" + id
      ].replace(".", "");
      this.bhlist[row]["MaxBuyNumber" + id] =
        parseInt(this.bhlist[row]["MaxBuyNumber" + id]).toString() === "NaN"
          ? 0
          : parseInt(this.bhlist[row]["MaxBuyNumber" + id]).toString();
    },
    deletePrview(num, index) {
      this.bhlist[this.addbhindex].OrderTypeInfo[num].PreviewsInfo.splice(
        index,
        1
      );
    },
    addPreviewsInfo(num) {
      const a = JSON.parse(JSON.stringify(this.bhlist));
      a[this.addbhindex].OrderTypeInfo[num].PreviewsInfo.push({
        Amount: this.previewsInfo.amount,
        Desc: this.previewsInfo.Desc
      });
      // if(){
      a[this.addbhindex].OrderTypeInfo[num].Image = this.addbh.OrderTypeInfo[
        num
      ].Image;
      a[this.addbhindex].OrderTypeInfo[num].showImg = this.addbh.OrderTypeInfo[
        num
      ].showImg;
      a[this.addbhindex].OrderTypeInfo[
        num
      ].showMoreImage = this.addbh.OrderTypeInfo[num].showMoreImage;
      a[this.addbhindex].OrderTypeInfo[num].expInfo = this.addbh.OrderTypeInfo[
        num
      ].expInfo;
      a[this.addbhindex].OrderTypeInfo[
        num
      ].DetailInfo = this.addbh.OrderTypeInfo[num].DetailInfo;
      a[this.addbhindex].OrderTypeInfo[
        num
      ].MoreImage = this.addbh.OrderTypeInfo[num].MoreImage;
      switch (num) {
        case 0:
          // a[this.addbhindex].OrderTypeInfo[num].MoreImage = this.MoreImage0;
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 1) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 2) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 3) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          break;
        case 1:
          // a[this.addbhindex].OrderTypeInfo[num].MoreImage = this.MoreImage1;
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 1) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 2) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 3) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          break;
        case 2:
          // a[this.addbhindex].OrderTypeInfo[num].MoreImage = this.MoreImage2;
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 1) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 2) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          if (a[this.addbhindex].OrderTypeInfo[num].MoreImage.length == 3) {
            a[this.addbhindex].OrderTypeInfo[num].MoreImage.push("");
          }
          break;
      }

      // }
      this.addbh = a[this.addbhindex];
      this.addbh.OrderTypeInfo[0].CostPrice = Number(
        this.addbh.OrderTypeInfo[0].CostPrice
      ).toFixed(2);
      this.addbh.OrderTypeInfo[0].Price = Number(
        this.addbh.OrderTypeInfo[0].Price
      ).toFixed(2);
      this.addbh.OrderTypeInfo[0].RetailPrice = Number(
        this.addbh.OrderTypeInfo[0].RetailPrice
      ).toFixed(2);

      this.addbh.OrderTypeInfo[1].CostPrice = Number(
        this.addbh.OrderTypeInfo[1].CostPrice
      ).toFixed(2);
      this.addbh.OrderTypeInfo[1].Price = Number(
        this.addbh.OrderTypeInfo[1].Price
      ).toFixed(2);
      this.addbh.OrderTypeInfo[1].RetailPrice = Number(
        this.addbh.OrderTypeInfo[1].RetailPrice
      ).toFixed(2);

      this.addbh.OrderTypeInfo[2].CostPrice = Number(
        this.addbh.OrderTypeInfo[2].CostPrice
      ).toFixed(2);
      this.addbh.OrderTypeInfo[2].Price = Number(
        this.addbh.OrderTypeInfo[2].Price
      ).toFixed(2);
      this.addbh.OrderTypeInfo[2].RetailPrice = Number(
        this.addbh.OrderTypeInfo[2].RetailPrice
      ).toFixed(2);
      this.bhlist = a;
      this.previewsInfo.amount = "";
      this.previewsInfo.Desc = "";
    },
    newAttrVal(val) {
      this.addAttrValInfo = val;
      this.addAttrValVisible = true;
    },
    newAttr() {
      this.addAttrVisible = true;
    },
    addAttrs() {
      if (this.addAttr.Name.trim() === "") {
        this.$message.error("请输入属性名称");
        return;
      } else {
        addAttr(this.addAttr).then(() => {
          this.$message.success("新增成功");
          getAttr().then(res => {
            res.map(v => {
              if (parseInt(v.ValType) !== 1) {
                v.checked = -1;
              } else {
                v.checked = [];
              }
            });
            this.aList = res;
            // this.$set(this.ruleForm, 'baseAttrList', res)
            this.setCheckedAttr();
          });
          this.addAttrVisible = false;
          this.addAttr.Name = "";
          this.addAttr.ValType = 0;
        });
      }
    },
    addAttrsVal() {
      if (this.addAttrValName.trim() === "") {
        this.$message.error("请输入属性值名称！");
        return;
      } else {
        addAttrProp({
          PropId: this.addAttrValInfo.Id,
          Name: this.addAttrValInfo.Name,
          Val: this.addAttrValName
        }).then(res => {
          this.$message.success("新增成功");
          this.ruleForm.baseAttrList.map(v => {
            if (v.Id === res.PropId) {
              v.PropVals.push(res);
            }
          });
          this.addAttrValInfo = null;
          this.addAttrValName = "";
          this.addAttrValVisible = false;
        });
      }
    },
    saveAtt(val) {
      const a = [];
      this.aList.map(v => {
        this.selectedAttr.map(item => {
          if (v.Id === item) {
            a.push(v);
          }
        });
      });
      this.ruleForm.baseAttrList = a;
    },
    number() {
      this.standardQuantity = this.standardQuantity.replace(/[^\.\d]/g, "");
      this.standardQuantity = this.standardQuantity.replace(".", "");
    },
    //复制富文本
    copyDetail() {
      this.addbh.OrderTypeInfo[0].DetailInfo = this.addbh.OrderTypeInfo[1].DetailInfo;
      this.$message.success("已复制成功到跨境直邮的商品详情描述");
    },
    addSpecVal() {
      if (this.propValName.trim() === "" && this.sProp.StandardType != "2") {
        this.$message.error("请输入规格值名称");
        return;
      }
      if (this.valDateType == "2") {
        this.$message.error("请选择规格日期格式");
        return;
      }
      if (this.sProp.StandardType == "3") {
        if (this.standardQuantity == "" || this.standardQuantity == null) {
          this.$message.error("请输入数量");
          return;
        }
      }
      this.standardQuantity = Number(this.standardQuantity);
      addSkuSpecItem({
        StdId: this.sProp.Id,
        standardType: this.standardType,
        standardQuantity: this.standardQuantity,
        valDateType: this.valDateType,
        StdName: this.sProp.StandardName,
        Val: this.propValName
      }).then(res => {
        this.$message.success("新增成功");
        getSkuSpecList().then(res => {
          this.propList.map(v => {
            v.prop = res;
          });

          this.propList[this.sProp.index].prop.map(v => {
            if (v.Id == this.sProp.Id) {
              this.propList[this.sProp.index].propchildval = v.Vals;
            }
          });
          this.propValName = "";
          this.ValdialogVisible = false;
        });
      });
    },
    showValDig(index) {
      this.propList[index].prop.map(v => {
        if (v.Id == this.propList[index].propval) {
          this.sProp.Id = v.Id;
          this.standardType = v.StandardType;
          this.sProp.StandardName = v.StandardName;
          this.sProp.index = index;
        }
      });
      this.ValdialogVisible = true;
    },
    addSpec() {
      if (this.propName !== "" && this.standardType !== "") {
        addSkuSpec({
          name: this.propName,
          standardType: this.standardType
        }).then(res => {
          this.$message.success("新增成功");
          getSkuSpecList().then(res => {
            this.propList.map(v => {
              v.prop = res;
            });
            this.propList[this.addspecindex].prop.map(v => {
              if (v.StandardName == this.propName) {
                console.log(v);
                this.propList[this.addspecindex].propchildval = v.Vals;
                this.propList[this.addspecindex].propval = v.Id;
                this.sProp.Id = v.Id;
                this.standardType = v.StandardType;
                this.sProp.StandardName = v.StandardName;
                this.sProp.index = this.addspecindex;
              }
            });
            this.propName = "";
            this.standardType = "";
            this.dialogVisible = false;
          });
        });
      } else {
        this.$message.error("请完善表单");
      }
    },
    addProp(v) {
      this.addspecindex = v;
      this.dialogVisible = true;
    },
    changeProp(val, index) {
      obj = this.defprop.find(item => {
        return item.Id === val;
      });
      this.IsDurationFlag = obj.IsDuration;
      let f = false;
      this.propList.map((v, i) => {
        if (v.propval == val && i != index) {
          f = true;
        }
      });
      if (f) {
        this.$message.error("不可选择已有的规格");
        this.propList[index].propval = null;
        this.propList[index].propselectedval = [];
        return;
      }
      let obj = JSON.parse(JSON.stringify(this.propList[index]));
      let n = "";
      obj.prop.map(v => {
        if (v.Id == val) {
          obj.propchildval = v.Vals;
          n = v.StandardName;
          obj.propname = v.StandardName;
        }
      });
      obj.propselectedval = [];
      this.sProp.Id = obj.propval;
      this.sProp.StandardName = n;
      this.sProp.index = index;
      this.$set(this.propList, index, obj);
    },
    getArrDifference(a1, a2) {
      let obj = {};
      let arr = [];
      let arr2 = [];
      a2.map(v1 => {
        obj[v1] = true;
      });
      a1.map(v2 => {
        if (obj[v2]) {
          arr.push(v2);
        } else {
          arr2.push(v2);
        }
      });
      let deletearr = [];
      a2.map(v2 => {
        let f = false;
        arr.map(va => {
          if (va == v2) f = true;
        });
        if (!f) deletearr.push(v2);
      });
      let o = {};
      o.add = arr2;
      o.del = deletearr;
      o.def = arr;
      return o;
    },
    delProp(index) {
      this.$confirm("此操作将删除该规格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.propList.splice(index, 1);
        if (this.propList.length == 0) {
          this.bhlist[0] = stdTpl();
        } else {
          this.$nextTick(() => {
            this.saveProp();
          });
        }
      });
    },
    saveProp() {
      let isseleteall = true;
      this.propList.map(v => {
        if (v.propselectedval.length == 0) {
          isseleteall = false;
        }
      });
      if (!isseleteall) {
        this.$message.error("请完善规格信息");
        return;
      }
      let lengthflag = false;
      lengthflag = this.propList.length == this.backproplist.length;
      if (lengthflag) {
        if (this.propList.length == 1) {
          lengthflag = this.propList[0].propval == this.backproplist[0].propval;
        } else if (this.propList.length == 2) {
          lengthflag =
            this.propList[0].propval == this.backproplist[0].propval &&
            this.propList[1].propval == this.backproplist[1].propval;
        } else if (this.propList.length == 3) {
          lengthflag =
            this.propList[0].propval == this.backproplist[0].propval &&
            this.propList[1].propval == this.backproplist[1].propval &&
            this.propList[2].propval == this.backproplist[2].propval;
        }
      }
      if (lengthflag) {
        let arr = [];
        this.propList.map((pv, index) => {
          arr.push(
            this.getArrDifference(
              pv.propselectedval,
              this.backproplist[index].propselectedval
            )
          );
        });
        let addarr = [];
        let delarr = [];
        let defarr = [];
        arr.map(v => {
          v.add.map(av => {
            addarr.push(av);
          });
          v.del.map(dv => {
            delarr.push(dv);
          });
          v.def.map(dv => {
            defarr.push(dv);
          });
        });
        delarr.map(v => {
          for (let index = this.bhlist.length - 1; index >= 0; index--) {
            this.bhlist[index].StdDetail.map(std => {
              if (std.Id == v) {
                this.bhlist.splice(index, 1);
              }
            });
          }
        });
        let karr = [];
        let defkarr = [];
        this.propList.map(v => {
          let oa = [];
          let oa2 = [];
          v.propchildval.map(cv => {
            addarr.map(av => {
              if (cv.Id == av) {
                oa.push(cv);
              }
            });
            defarr.map(dv => {
              if (cv.Id == dv) {
                oa.push(cv);
                oa2.push(cv);
              }
            });
          });
          if (oa2.length > 0) {
            defkarr.push(oa2);
          }
          karr.push(oa);
        });
        karr = descartes(karr);
        defkarr = descartes(defkarr);
        // let dk = karr.concat(defkarr)
        // let dkobj = {}
        let str = [];
        let dstr = [];
        karr.map(v => {
          let s = "";
          v.map(vv => {
            s += vv.Id + "-" + vv.StandardId + ",";
          });
          str.push(s);
        });
        defkarr.map(v => {
          let s = "";
          v.map(vv => {
            s += vv.Id + "-" + vv.StandardId + ",";
          });
          dstr.push(s);
        });
        for (let index = str.length - 1; index >= 0; index--) {
          for (let i = 0; i < dstr.length; i++) {
            if (str[index] == dstr[i]) {
              karr.splice(index, 1);
            }
          }
        }
        let a = [];
        karr.map(v => {
          let tpl = stdTpl();
          if (this.propList.length > 1) {
            tpl.StdDetail.push(...v);
          } else {
            tpl.StdDetail.push(v);
          }
          a.push(tpl);
        });
        this.backproplist = JSON.parse(JSON.stringify(this.propList));
        this.$nextTick(() => {
          a.map(v => {
            this.bhlist.push(v);
          });
        });
        return;
      }
      let karr = [];
      this.propList.map(v => {
        let oa = [];
        v.propchildval.map(cv => {
          v.propselectedval.map(scv => {
            if (cv.Id == scv) {
              oa.push(cv);
            }
          });
        });
        karr.push(oa);
      });
      karr = descartes(karr);
      let a = [];
      karr.map(v => {
        let tpl = stdTpl();
        if (this.propList.length > 1) {
          tpl.StdDetail.push(...v);
        } else {
          tpl.StdDetail.push(v);
        }
        a.push(tpl);
      });
      this.backproplist = JSON.parse(JSON.stringify(this.propList));
      this.$nextTick(() => {
        this.bhlist = a;
      });
    },
    delImage1(item, index) {
      this.$refs["upload-1" + index][0].clearFiles();
      this.addbh.OrderTypeInfo[1].MoreImage[index] = "";
      this.$set(
        this.addbh.OrderTypeInfo[1].showMoreImage,
        this.addbh.OrderTypeInfo[1].showMoreImage[index],
        ""
      );
      this.MoreImage1[index] = "";
      if (item) {
        this.deleteOssImages.push(item);
      }
    },
    delImage0(item, index) {
      this.$refs["upload-0" + index][0].clearFiles();
      this.addbh.OrderTypeInfo[0].MoreImage[index] = "";
      this.$set(
        this.addbh.OrderTypeInfo[0].showMoreImage,
        this.addbh.OrderTypeInfo[0].showMoreImage[index],
        ""
      );
      this.MoreImage0[index] = "";
      if (item) {
        this.deleteOssImages.push(item);
      }
    },
    delImage2(item, index) {
      this.$refs["upload-2" + index][0].clearFiles();
      this.addbh.OrderTypeInfo[2].MoreImage[index] = "";
      this.$set(
        this.addbh.OrderTypeInfo[2].showMoreImage,
        this.addbh.OrderTypeInfo[2].showMoreImage[index],
        ""
      );
      this.MoreImage2[index] = "";
      if (item) {
        this.deleteOssImages.push(item);
      }
    },
    checkOrderTypeList(list) {
      let o_1 = true;
      let o_2 = true;
      let o_3 = true;
      let cp = 0;
      list.map(v => {
        cp = v.CostPrice;
        if (v.OrderType === 1) {
          o_1 = false;
        }
        if (v.OrderType === 2) {
          o_2 = false;
        }
        if (v.OrderType === 3) {
          o_3 = false;
        }
      });
      if (o_1) {
        list.splice(0, 0, orderTypeItem(1, cp));
      }
      if (o_2) {
        list.splice(1, 0, orderTypeItem(2, cp));
      }
      if (o_3) {
        list.splice(2, 0, orderTypeItem(3, cp));
      }
      return list;
    },
    getSkuQuote() {
      return new Promise(re => {
        if (parseInt(this.$route.query.id) === -1) {
          re();
          return;
        }
        getQuoteBySkuId({ skuid: this.$route.query.id }).then(res => {
          console.log(res);

          res.map(item => {
            console.log(item);

            this.MoreImage0 = [];
            this.MoreImage1 = [];
            this.MoreImage2 = [];
            // if (item.OrderTypeInfo[0].DeliveryAddress != "") {
            //   item.OrderTypeInfo[0].DeliveryAddress = item.OrderTypeInfo[0].DeliveryAddress.split(
            //     "-"
            //   );
            // } else {
            //   item.OrderTypeInfo[0].DeliveryAddress = [];
            // }
            if (item.OrderTypeInfo[0]) {
              if (item.OrderTypeInfo[0].MoreImage) {
                if (item.OrderTypeInfo[0].MoreImage instanceof Array) {
                } else {
                  item.OrderTypeInfo[0].MoreImage = item.OrderTypeInfo[0].MoreImage.split(
                    ","
                  );
                }
                item.OrderTypeInfo[0].MoreImage.map(item1 => {
                  if (item1 != "") {
                    let signUr = window.ali_oss_data.URL_IMG_SHOW + item1;
                    this.MoreImage0.push(signUr);
                  }
                });
                this.$set(
                  item.OrderTypeInfo[0],
                  "showMoreImage",
                  this.MoreImage0
                );
                if (item.OrderTypeInfo[0].MoreImage.length == 1) {
                  item.OrderTypeInfo[0].MoreImage.push("");
                  item.OrderTypeInfo[0].MoreImage.push("");
                  item.OrderTypeInfo[0].MoreImage.push("");
                }
                if (item.OrderTypeInfo[0].MoreImage.length == 2) {
                  item.OrderTypeInfo[0].MoreImage.push("");
                  item.OrderTypeInfo[0].MoreImage.push("");
                }
                if (item.OrderTypeInfo[0].MoreImage.length == 3) {
                  item.OrderTypeInfo[0].MoreImage.push("");
                }
              } else {
                item.OrderTypeInfo[0].MoreImage = ["", "", "", ""];
              }
            } else {
              console.log(11111);
            }

            if (item.OrderTypeInfo[1]) {
              console.log(321);

              if (item.OrderTypeInfo[1].MoreImage) {
                if (item.OrderTypeInfo[1].MoreImage instanceof Array) {
                } else {
                  item.OrderTypeInfo[1].MoreImage = item.OrderTypeInfo[1].MoreImage.split(
                    ","
                  );
                }
                item.OrderTypeInfo[1].MoreImage.map(i1 => {
                  if (i1) {
                    let clie = new OSS(window.ali_oss_data.PARAMS_OBJ);
                    if (i1 != "") {
                      let signU = window.ali_oss_data.URL_IMG_SHOW + i1;
                      this.MoreImage1.push(signU);
                    }
                  }
                });
                this.$set(
                  item.OrderTypeInfo[1],
                  "showMoreImage",
                  this.MoreImage1
                );
                if (item.OrderTypeInfo[1].MoreImage.length == 1) {
                  item.OrderTypeInfo[1].MoreImage.push("");
                  item.OrderTypeInfo[1].MoreImage.push("");
                  item.OrderTypeInfo[1].MoreImage.push("");
                }
                if (item.OrderTypeInfo[1].MoreImage.length == 2) {
                  item.OrderTypeInfo[1].MoreImage.push("");
                  item.OrderTypeInfo[1].MoreImage.push("");
                }
                if (item.OrderTypeInfo[1].MoreImage.length == 3) {
                  item.OrderTypeInfo[1].MoreImage.push("");
                }
              } else {
                item.OrderTypeInfo[1].MoreImage = ["", "", "", ""];
              }
            } else {
              console.log(123);
            }
            if (item.OrderTypeInfo[2]) {
              if (item.OrderTypeInfo[2].MoreImage) {
                if (item.OrderTypeInfo[2].MoreImage instanceof Array) {
                } else {
                  item.OrderTypeInfo[2].MoreImage = item.OrderTypeInfo[2].MoreImage.split(
                    ","
                  );
                }
                item.OrderTypeInfo[2].MoreImage.map(i2 => {
                  if (i2) {
                    let sign = window.ali_oss_data.URL_IMG_SHOW + i2;
                    this.MoreImage2.push(sign);
                  }
                });
                this.$set(
                  item.OrderTypeInfo[2],
                  "showMoreImage",
                  this.MoreImage2
                );
                if (item.OrderTypeInfo[2].MoreImage.length == 1) {
                  item.OrderTypeInfo[2].MoreImage.push("");
                  item.OrderTypeInfo[2].MoreImage.push("");
                  item.OrderTypeInfo[2].MoreImage.push("");
                }
                if (item.OrderTypeInfo[2].MoreImage.length == 2) {
                  item.OrderTypeInfo[2].MoreImage.push("");
                  item.OrderTypeInfo[2].MoreImage.push("");
                }
                if (item.OrderTypeInfo[2].MoreImage.length == 3) {
                  item.OrderTypeInfo[2].MoreImage.push("");
                }
              } else {
                item.OrderTypeInfo[2].MoreImage = ["", "", "", ""];
              }
            }

            item.OrderTypeInfo.map(v => {
              let signUrl = window.ali_oss_data.URL_IMG_SHOW + v.Image;
              this.$set(v, "showImg", signUrl);
              if (parseInt(v.TransFeeTemplate) === 0) {
                v.TransFeeTemplate = null;
              }
            });
            if (item.OrderTypeInfo.length !== 3) {
              item.OrderTypeInfo = this.checkOrderTypeList(item.OrderTypeInfo);
            }
          });
          let plength = res[0].StdDetail.length;
          if (plength > 0) {
            const a = [];
            for (let x = 0; x < res.length; x++) {
              for (let i = 0; i < res[x].StdDetail.length; i++) {
                let f = false;
                a.map(v => {
                  if (v.Id == res[x].StdDetail[i].Id) {
                    f = true;
                  }
                });
                if (!f) {
                  a.push(res[x].StdDetail[i]);
                }
              }
            }
            let b = {};
            a.map(v => {
              let f = false;
              for (let key in b) {
                if (key == v.StandardId) {
                  b[key].push(v);
                  f = true;
                }
              }
              if (!f) {
                b[v.StandardId] = [];
                b[v.StandardId].push(v);
              }
            });
            let l = Object.keys(b).length;
            if (l > 0) {
              for (let index = 0; index < l; index++) {
                this.propList[index] = {
                  prop: JSON.parse(JSON.stringify(this.defprop)),
                  propval: null,
                  propselectedval: [],
                  propchildval: null,
                  propname: null
                };
              }
            }
            let i = 0;
            for (let key in b) {
              b[key].map(v => {
                this.propList[i].propselectedval.push(v.Id);
                this.propList[i].propval = b[key][0].StandardId;
                this.propList[i].propname = v.StandardName;
                this.propList[i].prop.map(vp => {
                  if (vp.Id == b[key][0].StandardId) {
                    this.propList[i].propchildval = vp.Vals;
                  }
                });
              });
              i += 1;
            }
            this.backproplist = JSON.parse(JSON.stringify(this.propList));
          }
          this.bhlist = res;
          re();
        });
      });
    },
    setCheckedAttr() {
      if (!this.$route.query.id) {
        this.ruleForm.baseAttrList = [];
        return;
      }
      getAttrBySkuId({ skuId: this.$route.query.id }).then(res => {
        res.map(v => {
          this.selectedAttr.push(v.Id);
          v.PropVals.map(item => {
            if (item.IsSelected === 1) {
              if (v.ValType === 0) {
                v.checked = item.Id;
              } else {
                v.checked = v.checked ? v.checked : [];
                v.checked.push(item.Id);
              }
            }
          });
        });
        this.ruleForm.baseAttrList = res;
      });
    },
    getData(id) {
      return new Promise(re => {
        getSkuInfo({ skuId: id }).then(res => {
          res.Labels = res.Labels === "" ? [] : res.Labels.split(",");
          res.Labels = res.Labels.map(v => {
            v = parseInt(v);
            return v;
          });
          this.isEdit = true;
          this.ruleForm = Object.assign(this.ruleForm, res);
          this.ruleForm.selectedCateCode[0] = res.FirstCateCode;
          this.ruleForm.selectedCateCode[1] = res.SecondCateCode;
          this.ruleForm.selectedCateCode[2] = res.CateCode;
          re();
        });
      });
    },
    getTime(timeS, timeE) {
      timeS = new Date(timeS).getTime();
      timeE = new Date(timeE).getTime();
      let t = (timeE - timeS) / (24 * 3600 * 1000);
      t = parseInt(t);
      if (t > 360) {
        return 0;
      } else {
        return t;
      }
    },
    //提交表单
    onAdd() {
      if (!this.showEdit) {
        let f = true;
        this.bhlist.map(v => {
          if (v.GoodsId === "") {
            f = false;
          }
        });
        for (let index = 0; index < this.bhlist.length; index++) {
          if(index<this.bhlist.length-1){
            if( this.bhlist[index].NameCN ==this.bhlist[index+1].NameCN ){
              
              }else{
                f = false;
          this.$message.error("多规格SKU备货信息请选择相同的关联商品");
          return;
          }
              }
        }
        if (!f) {
          this.$message.error("请先完善备货商品信息（需选择商品）");
          return;
        }
        this.ruleForm.PropsInfo = this.getCheckedProps();
        if (
          this.ruleForm.PropsInfo.length !== this.ruleForm.baseAttrList.length
        ) {
          this.$message.error("请选择SKU属性");
          return;
        }
        let ff = false;
        this.bhlist.map(v => {
          if (v.GrossWeight <= 0) {
            this.$message.error("毛重需大于0");
            ff = true;
          }
        });
        if (ff) return;
        const bbbhhh = JSON.parse(JSON.stringify(this.bhlist));
        bbbhhh.map((v, index) => {
          const a = [];
          v.OrderTypeInfo.map((item, i) => {
            a.push(item);
          });
          v.OrderTypeInfo = a;
          let removeIndex = null;
          v.OrderTypeInfo = v.OrderTypeInfo.filter(
            item =>
              item.Price != 0 && item.RetailPrice != 0 && item.CostPrice != 0
          );
        });
        this.ruleForm.stdInfo = bbbhhh;
        this.$refs.ruleForm
          .validate()
          .then(res => {
            this.ruleForm.CateCode = this.ruleForm.selectedCateCode[2];
            if (this.isEdit) {
              if (!this.checkBtn("func_common_editsave")) {
                this.$message.error("你没有权限进行此操作");
                return;
              }
              this.ruleForm.skuId = this.$route.query.id;
              const x = JSON.parse(JSON.stringify(this.ruleForm));
              x.Labels = x.Labels.join(",");

              editSku(x).then(res => {
                editAttrBySkuid({
                  skuId: this.$route.query.id,
                  propsInfo: this.ruleForm.PropsInfo
                }).then(() => {
                  this.deleteOssPic(this.deleteOssImages);
                  this.$message.success("编辑成功");
                  this.$router.back(-1);
                });
              });
            } else {
              if (!this.checkBtn("func_common_addsave")) {
                this.$message.error("你没有权限进行此操作");
                return;
              }
              const x = JSON.parse(JSON.stringify(this.ruleForm));

              x.Labels = x.Labels.join(",");
              addSku(x).then(res => {
                this.deleteOssPic(this.deleteOssImages);
                this.$message.success("新增成功");
                this.$router.back(-1);
              });
            }
          })
          .catch(res => {});
      } else {
        this.$message.error("请先保存备货信息");
      }
    },
    checkBhlist() {
      let f = true;
      this.bhlist.map(v => {
        if (v.SN === "") {
          f = false;
        }
      });
      return f;
    },
    getCheckedProps() {
      const arr = [];
      for (let x = 0; x < this.ruleForm.baseAttrList.length; x++) {
        const a = {};
        a.Id = this.ruleForm.baseAttrList[x].Id;
        a.Name = this.ruleForm.baseAttrList[x].Name;
        a.ValType = this.ruleForm.baseAttrList[x].ValType;
        if (this.ruleForm.baseAttrList[x].ValType === 0) {
          if (this.ruleForm.baseAttrList[x].checked !== -1) {
            a.PropVals = [];
            this.ruleForm.baseAttrList[x].PropVals.map(v => {
              if (v.Id === this.ruleForm.baseAttrList[x].checked) {
                a.PropVals.push(v);
              }
            });
            arr.push(a);
          }
        } else {
          if (this.ruleForm.baseAttrList[x].checked.length > 0) {
            a.PropVals = [];
            this.ruleForm.baseAttrList[x].checked.map(v => {
              this.ruleForm.baseAttrList[x].PropVals.map(item => {
                if (v === item.Id) {
                  a.PropVals.push(item);
                }
              });
            });
            arr.push(a);
          }
        }
      }
      return arr;
    },
    batchSetAmount() {
      if (this.bhlist.length < 1) {
        this.$message.error("请先选择规格再进行设置！");
      } else {
        this.bhlist.map(v => {
          v.GrossWeight = this.batch.GrossWeight;
          v.BoxVolume = this.batch.BoxVolume;
        });
      }
    },
    deleteGoods(row) {
      this.$confirm("确定要删除这条备货信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.bhlist.splice(row.$index, 1);
        if (this.bhlist.length === 0) {
          this.bhlist[0] = stdTpl();
        }
        this.backproplist = JSON.parse(JSON.stringify(this.bhlist));
      });
    },
    onclose() {
      this.goodsVisible = false;
    },
    getGoods(item) {
      this.bhIndex = item.$index;
      this.goodsVisible = true;
    },
    choiceGoods(data) {
      // this.bhlist[this.bhIndex].Price = data.Price
      const a = JSON.parse(JSON.stringify(this.bhlist[this.bhIndex]));
      a.GoodsId = data.cd.Id;
      a.NameCN = data.NameCN;
      a.SN = data.SN;
      a.CostPrice = data.CostPrice;
      a.GoodsAmount = 1;
      a.OrderTypeInfo.map(v => {
        v.CostPrice = data.CostPrice;
      });
      this.$set(this.bhlist, this.bhIndex, a);
      this.goodsVisible = false;
    },
    itemchange(val) {
      // 获取sku规格和属性
    },
    handleItemChange(val) {
      this.getTypeList(val);
    },
    getBrandList() {
      getBrandList({ InUse: 1 }).then(res => {
        this.brandList = res.Data;
      });
    },
    getExpTemp() {
      getExpTemp({ orderTypeId: 1 }).then(res => {
        this.expTempList1 = res;
      });
      getExpTemp({ orderTypeId: 2 }).then(res => {
        this.expTempList2 = res;
      });
      getExpTemp({ orderTypeId: 3 }).then(res => {
        this.expTempList3 = res;
      });
    },
    getUnitList() {
      getUnitList({ InUse: 1 }).then(res => {
        this.unitList = res.Data;
      });
    },
    getOriginList() {
      getOriginList({ InUse: 1 }).then(res => {
        this.originList = res.Data;
      });
    },
    clearFiles() {
      // this.base.Icon = ''
      this.$refs.upload.clearFiles();
    },
    beforeAvatarUpload11(file, index) {
      this.ztIndex = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.clearFiles();
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload(file, index) {
      this.spztIndex = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.clearFiles();
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload2(file, index) {
      this.ftIndex2 = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.$refs["upload-2" + index][0].clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.$refs["upload-2" + index][0].clearFiles();
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload0(file, index) {
      this.ftIndex0 = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.$refs["upload-0" + index][0].clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.$refs["upload-0" + index][0].clearFiles();
      }
      return isJPG && isLt2M;
    },
    beforeAvatarUpload1(file, index) {
      this.ftIndex = index;
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、GIF 格式!");
        this.$refs["upload-1" + index][0].clearFiles();
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        this.$refs["upload-1" + index][0].clearFiles();
      }
      return isJPG && isLt2M;
    },
    getTypeList(data) {
      getSkuList({
        CurCode: data ? (data.length === 1 ? data[0] : data[1]) : ""
      }).then(res => {
        if (!data) {
          this.options = res;
        } else {
          this.options.map(v => {
            if (data.length === 1) {
              if (v.Code === data[0]) {
                v.Childs = res;
                return;
              }
            } else if (data.length === 2) {
              v.Childs.map(item => {
                if (item.Code === data[1]) {
                  res.map(i => {
                    delete i.Childs;
                  });
                  item.Childs = res;
                  return;
                }
              });
            }
          });
        }
      });
    }
  }
};
</script>
<style>
#skubhdig .el-input__prefix {
  height: 28px !important;
}
</style>

<style scoped>
.w300 {
  width: 300px !important;
}
.ml10 {
  margin-left: 10px;
}

.w800 {
  width: 800px;
}

.info_item {
  display: flex;
  width: 800px;
  height: 40px;
}

.info_item .info_title {
  flex: 0 0 130px;
  line-height: 29px;
  text-align: right;
}

.info_item .info_right {
  flex: 1;
  display: flex;
}

.delImage {
  padding: 6px 0 0 0;
  position: absolute;
  z-index: 1;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 130px;
  left: 0;
  color: #fff;
  text-align: center;
  height: 25px;
  font-style: normal;
}

.title_btn {
  margin-left: 15px;
}

.subTitle {
  padding-bottom: 20px;
  z-index: 2 !important;
}

.subTitle h2 {
  margin: 0;
  height: 45px;
  line-height: 45px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
}

.addskuupload {
  display: flex;
  width: 100%;
}

.mr15 {
  margin-right: 15px;
}

.upload h5 {
  font-size: 12px;
  font-weight: 500;
  margin: 0;
  color: #666;
}

.edit-input {
  flex: 1;
}

.mb10 {
  margin-bottom: 10px;
}

.mb18 {
  margin-bottom: 18px;
}

.demo-ruleForm {
}

.info {
  border: 1px solid #eee;
}

.infoDesc {
  padding: 18px;
  padding-bottom: 0;
}

.infoTitle {
  height: 40px;
  line-height: 40px;
  background: hsla(220, 4%, 58%, 0.1) !important;
  border-bottom: 1px solid #eee;
  font-weight: bolder;
  text-indent: 10px;
}

.w200 {
  width: 400px;
}
</style>