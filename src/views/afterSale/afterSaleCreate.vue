<!--申请售后-->
<template>
  <div class="tkxq_root">
    <div class="order">
      <div class="oder_info">
        <img
          style="margin-left:20px"
          v-if="ruleForm.serviceType=='退货退款'"
          src="../../assets/img/payback/tjtk2.png"
          alt="售后进度"
        />
        <img style="margin-left:20px" v-else src="../../assets/img/completeStep1.png" alt="售后进度" />
        <el-row style="color:#999999;margin-top:10px" v-if="ruleForm.serviceType=='退货退款'">
          <el-col :span="7" style="color:#F05454;margin-left: 10px;">1.买家申请退款</el-col>
          <el-col :span="4">2.卖家处理退款申请</el-col>
          <el-col :span="7" style="margin-left: 3px;">3.买家退货</el-col>
          <el-col :span="4">4.退款完毕</el-col>
        </el-row>
        <el-row style="color:#999999;margin-top:10px" v-else>
          <el-col :span="7" style="color:#F05454">1.买家申请退款</el-col>
          <el-col :span="8" style="margin-left:22px">2.卖家处理退款申请</el-col>
          <el-col :span="7" style="margin-left:24px">3.退款完毕</el-col>
        </el-row>
      </div>
      <div class="bg"></div>
    </div>
    <div class="order" style="display:flex">
      <div class="left_div">
        <el-form
          @submit.native.prevent
          :inline-message="titleFlag"
          size="small"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
        >
          <el-form-item label="服务类型：" prop="serviceType">
            <el-select
              style="width:200px"
              v-model="ruleForm.serviceType"
              placeholder="请选择服务类型"
              @change="chooseServiceType"
            >
              <el-option
                v-for="item in serviceTypeArr"
                :label="item.tName"
                :value="item.tName"
                :key="item.tcode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退款原因：" prop="reason">
            <el-select
              style="width:200px"
              v-model="ruleForm.reason"
              placeholder="请选择退款原因"
              @change="chooseReasonArrType"
            >
              <el-option
                v-for="(item,index) in reasonArr"
                :label="item.RefundReasonDesc"
                :value="item.RefundReasonCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="div_import" v-if="ruleForm.serviceType=='申请补偿'&& this.jnf=='瘪罐（仅奶粉）'">*</div>
          <el-form-item label="损坏程度：" v-if="ruleForm.serviceType=='申请补偿'&& this.jnf=='瘪罐（仅奶粉）'">
            <span style="color:#999999">亲，请根据照片示例给出的奶粉瘪罐程度，合理选择，客服处理更快哦！</span>
            <div style="display: flex">
              <div class="border_TK">
                <img class="temImg" src="../../assets/img/payback/bieguan2.png" alt="环球云仓" />
                <div class="bgimg_clss">瘪罐＜10%以下</div>
              </div>
              <div class="border_TK">
                <img class="temImg" src="../../assets/img/payback/bieguan3.png" alt="环球云仓" />
                <div class="bgimg_clss">10%＜瘪罐＜30%</div>
              </div>
              <div class="border_TK">
                <img class="temImg" src="../../assets/img/payback/bieguan3.png" alt="环球云仓" />
                <div class="bgimg_clss">30%＜瘪罐＜50%</div>
              </div>
              <div class="border_TK">
                <img class="temImg" src="../../assets/img/payback/bieguan4.png" alt="环球云仓" />
                <div class="bgimg_clss">瘪罐＞50%以上</div>
              </div>
            </div>
            <ul style="line-height:50px;list-style-type: none">
              <li>
                &nbsp;10%以下
                <el-input-number
                  style="margin-left:10px"
                  :disabled="showCout"
                  @change="coutMoney1"
                  v-model="lv1"
                  :min="0"
                  :max="parseInt(this.sum-this.value2-this.value3)"
                ></el-input-number>&nbsp;件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10%-30%
                <el-input-number
                  style="margin-left:10px"
                  :disabled="showCout2"
                  @change="coutMoney2"
                  v-model="lv2"
                  :min="0"
                  :max="parseInt(this.sum-this.value1-this.value3)"
                ></el-input-number>&nbsp;件
              </li>
              <li>
                30%-50%
                <el-input-number
                  style="margin-left:10px"
                  :disabled="showCout3"
                  @change="coutMoney3"
                  v-model="lv3"
                  :min="0"
                  :max="parseInt(this.sum-this.value2-this.value1)"
                ></el-input-number>&nbsp;件&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;大于50%
                <el-button
                  class="sqtkBtn"
                  style="padding: 8px;width: 100px;margin-left:10px"
                  size="small"
                  @click="sqthtkClick"
                >申请退货退款</el-button>
              </li>
            </ul>
          </el-form-item>
          <div class="div_import" v-if="ruleForm.serviceType=='申请补偿'&& this.jnf=='包装破损'">*</div>
          <el-form-item label="损坏程度：" v-if="ruleForm.serviceType=='申请补偿'&& this.jnf=='包装破损'">
            <ul style="line-height:50px;list-style-type: none">
              <li style="line-height:20px">
                &nbsp;&nbsp; 轻微破损，不影响售卖
                <el-input-number
                  style="margin-left:10px"
                  :disabled="showCout"
                  @change="coutMoney1"
                  v-model="lv1"
                  :min="0"
                  :max="parseInt(this.sum-this.value2-this.value3)"
                ></el-input-number>&nbsp;件
              </li>
              <li>
                &nbsp;&nbsp; &nbsp;&nbsp; 中度破损，影响售卖
                <el-input-number
                  style="margin-left:10px"
                  :disabled="showCout"
                  @change="coutMoney2"
                  v-model="lv2"
                  :min="0"
                  :max="parseInt(this.sum-this.value1-this.value3)"
                ></el-input-number>&nbsp;件
              </li>
              <li style="line-height:20px;margin-left:3px">
                严重破损，严重影响售卖
                <el-input-number
                  style="margin-left:10px"
                  :disabled="showCout"
                  @change="coutMoney3"
                  v-model="lv3"
                  :min="0"
                  :max="parseInt(this.sum-this.value2-this.value1)"
                ></el-input-number>&nbsp;件
              </li>
            </ul>
          </el-form-item>
          <div class="div_import" v-if="ruleForm.serviceType=='申请补偿'&&this.jnf=='商品保质期与平台描述不符'">*</div>
          <el-form-item label="损坏程度：" v-if="ruleForm.serviceType=='申请补偿'&&this.jnf=='商品保质期与平台描述不符'">
            <ul style="line-height:50px;list-style-type: none">
              <li style="line-height:20px;margin: 7px 0 0 0;">
                <span style="margin: 0 6px 0 0;">
                  实际商品保质期低于平台描述保质期，未
                  <br />低于总有效期的1/3，赔付商品金额的5%
                </span>
                <div style="display: block;float: right; margin: 5px 165px 0 0;">
                  <el-input-number
                    :disabled="showCout"
                    @change="coutMoney1"
                    v-model="lv1"
                    :min="0"
                    :max="parseInt(this.sum-this.value2)"
                  ></el-input-number>&nbsp;件
                </div>
              </li>
              <li style="line-height:20px;margin: 7px 0 0 0;">
                <span style="margin: 0 6px 0 0;">
                  实际商品保质期低于总有效期的1/3，赔
                  <br />付商品金额的20%
                </span>
                <div style="display: block;float: right;margin: 5px 165px 0 0;">
                  <el-input-number
                    :disabled="showCout"
                    @change="coutMoney2"
                    v-model="lv2"
                    :min="0"
                    :max="parseInt(this.sum-this.value1)"
                  ></el-input-number>&nbsp;件
                </div>
              </li>
            </ul>
          </el-form-item>
          <div class="div_import">*</div>
          <el-form-item
            label="退款数量："
            v-if="this.jnf =='瘪罐（仅奶粉）'||this.jnf =='包装破损'||this.jnf =='商品保质期与平台描述不符'"
          >
            <el-input-number disabled v-model="totalCout"></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf =='商品瑕疵'">
            <el-input-number
              v-model="xcCout"
              @change="coutMoneyXC"
              :min="0"
              :max="parseInt(this.sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf =='爆罐'">
            <el-input-number
              v-model="bgCout"
              @change="coutMoneybg"
              :min="0"
              :max="parseInt(this.sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf =='包装破损1'">
            <el-input-number
              v-model="bzpsCout"
              @change="coutMoneybzps"
              :min="0"
              :max="parseInt(this.sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf =='商品瑕疵1'">
            <el-input-number
              v-model="spxcCout"
              @change="coutMoneyspxc"
              :min="0"
              :max="parseInt(this.sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf =='商品保质期与平台描述不符1'">
            <el-input-number
              v-model="ptbzqCout"
              @change="coutMoneyptbzq"
              :min="0"
              :max="parseInt(this.sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf =='错发'">
            <el-input-number
              v-model="cfCout"
              @change="coutMoneycf"
              :min="0"
              :max="parseInt(this.sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf=='丢件'">
            <el-input-number
              :disabled="showCoutBtn"
              @change="djMoneyClick"
              v-model="djCout"
              :min="0"
              :max="parseInt(sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf=='订单发货超时'">
            <el-input-number
              @change="ddfhcsMoneyClick"
              v-model="djCout"
              :min="0"
              :max="parseInt(sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf=='少件'">
            <el-input-number
              :disabled="showCoutBtn"
              @change="sjMoneyClick"
              v-model="djCout"
              :min="0"
              :max="parseInt(sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <el-form-item label="退款数量：" v-if="this.jnf=='拒收'">
            <el-input-number
              :disabled="showCoutBtn"
              @change="jsMoneyClick"
              v-model="djCout"
              :min="0"
              :max="parseInt(sum)"
            ></el-input-number>&nbsp;件
          </el-form-item>
          <div class="div_import">*</div>
          <el-form-item label="退款金额：">
            <span style="color:#F05454">¥ {{parseFloat(ProTotalPrice).toFixed(2)}}</span>
            <el-button
              class="sqtkBtn"
              style="padding: 8px;margin:0 0 0 8px;width: 100px;background-color:#F5F5F5"
              size="small"
              @click="showStdDialog"
            >退款金额标准</el-button>
          </el-form-item>
          <div v-if="this.jnf!='丢件'&&this.jnf!='订单发货超时'&&this.jnf!=''">
            <el-form-item
              label="上传凭证："
              v-if="(ruleForm.serviceType=='申请补偿'|| this.jnf=='少件'|| this.jnf=='拒收'||ruleForm.serviceType=='退货退款')&&this.jnf!='订单发货超时'"
            >
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;">1.快递面单照片</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/128b3cc75cf141a8aa403d478ac189d6_快递面单照.jpg'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/128b3cc75cf141a8aa403d478ac189d6_快递面单照.jpg')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/128b3cc75cf141a8aa403d478ac189d6_快递面单照.jpg')"
                    >查看详情</span>
                    <img v-if="!isShow1" class="upload_img" :src="url1Show" alt="环球云仓" />
                    <img
                      v-if="!isShow1"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture1"
                    />

                    <el-upload
                      accept="image/*"
                      v-if="isShow1"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item
              label
              v-if="ruleForm.serviceType=='申请补偿'|| this.jnf=='拒收'||this.jnf=='少件'||ruleForm.serviceType=='退货退款'"
            >
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;">2.快递外箱照片</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/ea10af65d73a4240b6e3c633cfcea00d_快递外箱照.jpg'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/ea10af65d73a4240b6e3c633cfcea00d_快递外箱照.jpg')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/ea10af65d73a4240b6e3c633cfcea00d_快递外箱照.jpg')"
                    >查看详情</span>
                    <img v-if="!isShow2" class="upload_img" :src="url2Show" alt="环球云仓" />
                    <img
                      v-if="!isShow2"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture2"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow2"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg1"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label v-if="ruleForm.serviceType=='申请补偿'||ruleForm.serviceType=='退货退款'">
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;" v-if="this.jnf =='商品瑕疵'">3.商品瑕疵处照片</span>
                  <span style="color: #333333;" v-else>3.商品破损处照片</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      v-if="this.jnf =='商品瑕疵'"
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/c4c83ecf784d49b4af7074e60fd539a6_瑕疵.png'"
                    />
                    <img
                      v-else
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/2a55a0bca8b94baca99a08e9909a1143_破损处.png'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/2a55a0bca8b94baca99a08e9909a1143_破损处.png')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/2a55a0bca8b94baca99a08e9909a1143_破损处.png')"
                    >查看详情</span>
                    <img v-if="!isShow3" class="upload_img" :src="url3Show" alt="环球云仓" />
                    <img
                      v-if="!isShow3"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture3"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow3"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg2"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label v-if="ruleForm.serviceType=='申请补偿'||ruleForm.serviceType=='退货退款'">
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;">4.商品正面照片</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/9a311819bba344a08cfdf3d3736407e9_产品正面照.jpg'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/9a311819bba344a08cfdf3d3736407e9_产品正面照.jpg')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/9a311819bba344a08cfdf3d3736407e9_产品正面照.jpg')"
                    >查看详情</span>
                    <img v-if="!isShow4" class="upload_img" :src="url4Show" alt="环球云仓" />
                    <img
                      v-if="!isShow4"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture4"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow4"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg3"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label v-if="ruleForm.serviceType=='申请补偿'||ruleForm.serviceType=='退货退款'">
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;">5.产品批次号和效期处照片</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/e063fb8b578a468cb0991fb5b8908fd0_产品效期处照.jpg'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/e063fb8b578a468cb0991fb5b8908fd0_产品效期处照.jpg')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/e063fb8b578a468cb0991fb5b8908fd0_产品效期处照.jpg')"
                    >查看详情</span>
                    <img v-if="!isShow5" class="upload_img" :src="url5Show" alt="环球云仓" />
                    <img
                      v-if="!isShow5"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture5"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow5"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg4"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>

            <el-form-item label v-if="this.jnf=='少件'">
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;" v-if="this.jnf=='少件'">3.开箱照片（可以看到全部内件）</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/23676cd2aff34ea1beac246183ab1078_开箱照.jpg'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/23676cd2aff34ea1beac246183ab1078_开箱照.jpg')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/23676cd2aff34ea1beac246183ab1078_开箱照.jpg')"
                    >查看详情</span>
                    <img v-if="!isShow7" class="upload_img" :src="url7Show" alt="环球云仓" />
                    <img
                      v-if="!isShow7"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture7"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow7"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg6"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item
              label
              v-if="(ruleForm.serviceType=='申请补偿'||ruleForm.serviceType=='退货退款')&&this.jnf!='商品保质期与平台描述不符1'&&this.jnf!='错发'"
            >
              <ul class="ul_style">
                <li>
                  <span class="span_import" v-if="this.jnf=='瘪罐（仅奶粉）'||this.jnf=='爆罐'">*</span>
                  <span style="color: #333333;" v-if="this.jnf=='瘪罐（仅奶粉）'||this.jnf=='爆罐'">6.气泡柱照片</span>
                  <span style="color: #333333;" v-else>6.气泡柱照片（选填）</span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/ff3212109be44fa2b5c7d3e160ca277e_气泡柱2.png'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/ff3212109be44fa2b5c7d3e160ca277e_气泡柱2.png')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/ff3212109be44fa2b5c7d3e160ca277e_气泡柱2.png')"
                    >查看详情</span>
                    <img v-if="!isShow6" class="upload_img" :src="url6Show" alt="环球云仓" />
                    <img
                      v-if="!isShow6"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture6"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow6"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg5"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item
              label
              v-if="(ruleForm.serviceType=='申请补偿'||ruleForm.serviceType=='退货退款'||ruleForm.serviceType=='仅退款')&&this.jnf != ''"
            >
              <ul class="ul_style">
                <li>
                  <span class="span_import">*</span>
                  <span style="color: #333333;">
                    <span v-if="this.jnf=='少件'">4.</span>
                    <span v-if="this.jnf=='拒收'">3.</span>
                    <span v-if="this.jnf=='商品保质期与平台描述不符1'">6.</span>
                    <span v-if="this.jnf=='错发'">6.</span>
                    <span
                      v-if="this.jnf!='少件'&&this.jnf!='拒收'&&this.jnf!='商品保质期与平台描述不符1'&&this.jnf!='错发'"
                    >7.</span>
                    售后群照
                  </span>
                </li>
                <li>
                  <div style="margin-top: 10px;">
                    <img
                      title="点击查看大图"
                      class="upload_img"
                      :src="imgBaseUrl+'/u/ff3212109be44fa2b5c7d3e160ca277e_气泡柱2.png'"
                    />
                    <div
                      class="showDetailPic"
                      @click="showBigPic(imgBaseUrl+'/u/ff3212109be44fa2b5c7d3e160ca277e_气泡柱2.png')"
                    ></div>
                    <span
                      class="ckxp_span"
                      @click="showBigPic(imgBaseUrl+'/u/ff3212109be44fa2b5c7d3e160ca277e_气泡柱2.png')"
                    >查看详情</span>
                    <img v-if="!isShow8" class="upload_img" :src="url8Show" alt="环球云仓" />
                    <img
                      v-if="!isShow8"
                      class="close_upload_img"
                      src="../../assets/img/payback/deletePic.png"
                      alt="环球云仓"
                      @click="deletePicture8"
                    />
                    <el-upload
                      accept="image/*"
                      v-if="isShow8"
                      class="upload_scpz"
                      action
                      :http-request="uploadImg7"
                      :multiple="false"
                      :file-list="fileList"
                      :show-file-list="true"
                      list-type="picture-card"
                      :before-upload="beforeUpload"
                    >
                      <img class="scpzImg" src="../../assets/img/uploadPic.png" alt="上传凭证" />
                      <div class="scpztextImg">上传凭证</div>
                    </el-upload>
                  </div>
                </li>
              </ul>
            </el-form-item>
          </div>
          <el-form-item label="退款说明：" prop="resasonDesc">
            <el-input style="width:448px" type="textarea" rows="5" v-model="ruleForm.resasonDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <button :disabled="btnFlag" class="comfirm" @click="submitForm('ruleForm')">确认提交</button>
            <el-button
              style="padding: 9px;width: 130px;margin: 0 0 0 10px;"
              @click="resetForm('ruleForm')"
            >取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="line-c"></div>
      <div class="right_div">
        <ul style="line-height:30px;list-style-type: none">
          <li style="font-size:16px;color:#333333">订单信息</li>
          <li style="color:#666666">
            订单号：
            <span
              style="color:#333333;cursor:pointer"
              @click="jumpDesc(goodsBaseInfo.OrderCode)"
            >
              <span style="color:#F05454">{{goodsBaseInfo.OrderCode}}</span>
            </span>
          </li>
          <li style="color:#666666">
            商品：
            <span style="color:#333333">{{goodsBaseInfo.ProName}}</span>
          </li>
          <li style="color:#666666">
            商品数量：
            <span style="color:#333333">{{goodsBaseInfo.ProCount}}</span>&nbsp;件
          </li>
          <li style="color:#666666">
            运费：¥
            <span style="color:#333333">{{parseFloat(goodsBaseInfo.TransFee).toFixed(2)}}</span>
          </li>
          <li style="color:#666666">
            综合税金：¥
            <span style="color:#333333">{{parseFloat(goodsBaseInfo.TaxAmount).toFixed(2)}}</span>
          </li>
          <li style="color:#666666">
            支付金额：¥
            <span style="color:#333333">{{parseFloat(goodsBaseInfo.PayPrice).toFixed(2)}}</span>
          </li>
        </ul>
      </div>
    </div>

    <payback-dialog :is="stdDialog" keep-alive></payback-dialog>
  </div>
</template>

<script>
import moment from "moment";
let OSS = require("ali-oss");
let imgSavePath =
  window.ali_oss_data.URL_IMG_HQYC +
  "afterSale/" +
  moment().format("YYYYMM") +
  "/img/";
import {
  sumBackMoney,
  submitPayBack,
  getPayBackType,
  getPayBackList
} from "@/api/afterSale/index.js";
import { baseConfig } from "../../../static/js/base";
import thtkpaybackStd from "@/components/payBack/thtkpaybackStd.vue";
import jtkpaybackStd from "@/components/payBack/jtkpaybackStd.vue";
import paybackStd from "@/components/payBack/paybackStd.vue";
import Bus from "@/components/common/bus.js";
// import "../../assets/css/order.css";

export default {
  components: {
    "payback-dialog": paybackStd,
    "jtk-payback-dialog": jtkpaybackStd,
    "thtk-payback-dialog": thtkpaybackStd
  },
  data() {
    return {
      deleteOssImages: [],
      stdDialog: "",
      btnFlag: false,
      titleFlag: true,
      uploadfiles: [],
      imgNames: [],
      uploadfiles1: [],
      imgNames1: [],
      uploadfiles2: [],
      imgNames2: [],
      uploadfiles3: [],
      imgNames3: [],
      uploadfiles4: [],
      imgNames4: [],
      uploadfiles5: [],
      imgNames5: [],
      uploadfiles6: [],
      imgNames6: [],
      uploadfiles7: [],
      imgNames7: [],
      listObj: {},
      successList: [],
      fileList: [],
      showCoutBtn: true,
      cout10: 0,
      cout10_30: 0,
      cout30_50: 0,
      damageCout1: 0,
      damageCout2: 0,
      damageCout3: 0,
      value1: 0,
      xcCout: 0,
      cfCout: 0,
      ptbzqCout: 0,
      spxcCout: 0,
      bzpsCout: 0,
      bgCout: 0,
      value2: 0,
      value3: 0,
      RefundMethodDesc: "",
      //服务类型code
      RefundMethodCode: "",
      //退款原因code
      RefundReasonCode: "",
      //退款标准code
      RefundStandardCode: "",
      isShow1: true,
      loading: false,
      url1Show: "",
      url2Show: "",
      url3Show: "",
      url4Show: "",
      url5Show: "",
      url6Show: "",
      url7Show: "",
      url8Show: "",
      sum: 0,
      djCout: 0,
      showCout: false,
      showCout2: false,
      showCout3: false,
      isShow2: true,
      isShow3: true,
      isShow4: true,
      isShow5: true,
      isShow6: true,
      isShow7: true,
      isShow8: true,
      //商品总金额
      ProTotalPrice: 0.0,
      jnf: "",
      imgBaseUrl: ali_oss_data.URL_IMG_SHOW,
      goodsBaseInfo: "",
      serviceTypeArr: [],
      reasonArr: [],
      RefundStandards: [],
      payBackType: "",
      RefundOrderDetailse: [],
      //售后群照
      shqImage: "",
      //产品批次号和效期处照片
      BatchNumberOrExpiryDateImage: "",
      //气泡柱/泡沫箱/纸箱照片
      CartonImage: "",
      //产品与快递面单
      ExpressDeliverySheetImage: "",
      //商品正面照片
      MerchandiseFrontImage: "",
      //开相处照片
      UnpackingImage: "",
      //破损处照片
      DamagedImage: "",
      //快递外箱照片
      ExpressboxImage: "",
      //产品正面照
      VoucherImage6: "",
      //破损处照片
      VoucherImage5: "",
      //快递外箱照片
      VoucherImage4: "",
      //产品与快递免单
      VoucherImage3: "",
      //气泡柱/泡沫箱/纸箱照片
      VoucherImage2: "",
      //凭证图片
      VoucherImage1: "",
      //低于平台有效期数量
      dyptyxq: "",
      //低于总效期数量
      dyzyxq: "",
      bglvl1Code: "",
      url: "../../assets/img/payback/kdmdz.jpg",
      procoutC: 0,
      lv1: 0,
      lv2: 0,
      lv3: 0,
      pslv1: 0,
      pslv2: 0,
      pslv3: 0,
      showKDMDZ: false,
      ruleForm: {
        name: "",
        serviceType: "",
        reason: "",
        resasonDesc: "",
        cout: ""
      },
      rules: {
        serviceType: [
          { required: true, message: "请选择服务类型", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "请选择退款原因", trigger: "change" }
        ],
        resasonDesc: [
          {
            required: false,
            max: 200,
            min: 0,
            message: "描述不能超过200字",
            trigger: "blur"
          }
        ],
        totalCout: [{ required: true, message: "", trigger: "blur" }],
        lvl1: [{ required: true, message: "", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getData();
    const TOKEN = window.localStorage.getItem("Token");
  },
  computed: {
    totalCout: {
      get: function() {
        return this.lv1 + this.lv2 + this.lv3;
      }, // setter
      set: function(newValue) {}
    }
  },
  methods: {
    //查看大图
    showBigPic(url) {
      console.log(url);

      window.open(url, "_blank");
    },
    //删除oss上的图片
    deleteOssPic(picArr) {
      let client = new OSS(ali_oss_data.PARAMS_OBJ);
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
    //自定義圖片上傳方法
    uploadImg(option) {
      this.uploadfiles = [];
      this.imgNames = [];
      this.uploadfiles.push(option.file);
      this.imgNames.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles.length; i++) {
        this.uploadImgToOSS(this.uploadfiles[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow1 = false;
          this.url1Show = signUrl;
          this.ExpressDeliverySheetImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg1(option) {
      this.uploadfiles1 = [];
      this.imgNames1 = [];
      this.uploadfiles1.push(option.file);
      this.imgNames1.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames1.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles1.length; i++) {
        this.uploadImgToOSS(this.uploadfiles1[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow2 = false;
          this.url2Show = signUrl;
          this.ExpressboxImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg2(option) {
      this.uploadfiles2 = [];
      this.imgNames2 = [];
      this.uploadfiles2.push(option.file);
      this.imgNames2.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames2.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles2.length; i++) {
        this.uploadImgToOSS(this.uploadfiles2[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow3 = false;
          this.url3Show = signUrl;
          this.DamagedImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg3(option) {
      this.uploadfiles3 = [];
      this.imgNames3 = [];
      this.uploadfiles3.push(option.file);
      this.imgNames3.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames3.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles3.length; i++) {
        this.uploadImgToOSS(this.uploadfiles3[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow4 = false;
          this.url4Show = signUrl;
          this.MerchandiseFrontImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg4(option) {
      this.uploadfiles4 = [];
      this.imgNames4 = [];
      this.uploadfiles4.push(option.file);
      this.imgNames4.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames4.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles4.length; i++) {
        this.uploadImgToOSS(this.uploadfiles4[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow5 = false;
          this.url5Show = signUrl;
          this.BatchNumberOrExpiryDateImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg5(option) {
      this.uploadfiles5 = [];
      this.imgNames5 = [];
      this.uploadfiles5.push(option.file);
      this.imgNames5.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames5.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles5.length; i++) {
        this.uploadImgToOSS(this.uploadfiles5[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow6 = false;
          this.url6Show = signUrl;
          this.CartonImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg6(option) {
      this.uploadfiles6 = [];
      this.imgNames6 = [];
      this.uploadfiles6.push(option.file);
      this.imgNames6.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames6.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles6.length; i++) {
        this.uploadImgToOSS(this.uploadfiles6[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow7 = false;
          this.url7Show = signUrl;
          this.UnpackingImage = imgFileNameList[0];
        });
      }, 500);
    },
    //自定義圖片上傳方法
    uploadImg7(option) {
      this.uploadfiles7 = [];
      this.imgNames7 = [];
      this.uploadfiles7.push(option.file);
      this.imgNames7.push(option.file.name);
      //配置的上传路径
      let imgFileNameList = this.imgNames6.map(element => {
        let name = Math.floor(Math.random() * 1000);
        let imageType = element.substring(element.lastIndexOf(".") + 1);
        return imgSavePath + name + "." + imageType;
      });
      for (var i = 0; i < this.uploadfiles6.length; i++) {
        this.uploadImgToOSS(this.uploadfiles6[i], imgFileNameList[i]);
      }
      setTimeout(() => {
        imgFileNameList.forEach(element => {
          let signUrl = window.ali_oss_data.URL_IMG_SHOW + element;
          this.isShow8 = false;
          this.url8Show = signUrl;
          this.shqImage = imgFileNameList[0];
        });
      }, 500);
    },
    //上传到ali-OSS
    uploadImgToOSS(file, imgName) {
      let client = new OSS(ali_oss_data.PARAMS_OBJ);
      async function put() {
        try {
          let result = await client.put(imgName, file);
        } catch (e) {
          console.log(e);
        }
      }
      put();
    },
    jumpDesc(code) {
      this.$router.push("/dashboard/order?id=" + code);
    },
    //订单发货超时
    ddfhcsMoneyClick(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC022";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC022";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC022",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC022";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC022",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //丢件金额计算
    djMoneyClick(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC011";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC011";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC011",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC011";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC011",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //少件金额计算
    sjMoneyClick(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC012";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC012";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC012",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC012";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC012",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //拒收金额计算
    jsMoneyClick(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC013";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC013";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC013",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC013";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC013",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //计算金额保留两位小数
    returnFloat(value) {
      var value = Math.round(parseFloat(value) * 100) / 100;
      var s = value.toString().split(".");
      if (s.length == 1) {
        value = value.toString() + ".00";
        return value;
      }
      if (s.length > 1) {
        if (s[1].length < 2) {
          value = value.toString() + "0";
        }
        return value;
      }
    },
    //计算金额
    coutMoneyTotal() {
      let param = {
        RefundMethodCode: this.RefundMethodCode,
        RefundReasonCode: this.RefundReasonCode,
        OrderCode: this.goodsBaseInfo.OrderCode,
        RefundStandards: this.RefundStandards,
        Token: window.localStorage.getItem("Token")
          ? window.localStorage.getItem("Token")
          : null
      };
      sumBackMoney(param).then(res => {
        this.ProTotalPrice = this.returnFloat(res.Data.RefundSKUPrice);
      });
    },
    showStdDialog() {
      Bus.$emit("showStd", true);
    },
    //瘪罐==========计算金额开始======
    coutMoney1(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      if (self.jnf == "瘪罐（仅奶粉）") {
        self.value1 = currentValue;
        if (currentValue > oldValue) {
          //增加商品计算价格
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC001";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC001";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC001",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          //删除商品计算价格
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC001";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC001",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      } else if (self.jnf == "包装破损") {
        self.value1 = currentValue;
        if (currentValue > oldValue) {
          //增加商品计算价格
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC004";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC004";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC004",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          //删除商品计算价格
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC004";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC004",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      } else if (self.jnf == "商品保质期与平台描述不符") {
        self.value1 = currentValue;
        if (currentValue > oldValue) {
          //增加商品计算价格
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC009";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC009";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC009",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          //删除商品计算价格
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC009";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC009",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      }
    },
    coutMoney2(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      if (self.jnf == "瘪罐（仅奶粉）") {
        self.value2 = currentValue;
        if (currentValue > oldValue) {
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC002";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC002";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC002",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC002";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC002",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      } else if (self.jnf == "包装破损") {
        self.value2 = currentValue;
        if (currentValue > oldValue) {
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC005";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC005";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC005",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC005";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC005",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      } else if (self.jnf == "商品保质期与平台描述不符") {
        self.value2 = currentValue;
        if (currentValue > oldValue) {
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC010";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC010";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC010",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC010";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC010",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      }
    },
    coutMoney3(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      if (self.jnf == "瘪罐（仅奶粉）") {
        self.value3 = currentValue;
        if (currentValue > oldValue) {
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC003";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC003";
          });
          //判断是否存在
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC003",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC003";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC003",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      } else if (self.jnf == "包装破损") {
        self.value3 = currentValue;
        if (currentValue > oldValue) {
          self.procoutC = currentValue;
          self.RefundStandardCode = "RSC006";
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC006";
          });
          //判断是否存在
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC006",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        } else {
          let index = self.RefundStandards.findIndex(item => {
            return item.RefundStandardCode == "RSC006";
          });
          if (index != -1) {
            self.RefundStandards.splice(index, 1);
          }
          self.RefundStandards.push({
            RefundStandardCode: "RSC006",
            OrderDetailId: self.goodsBaseInfo.OrderDetailId,
            ProId: self.goodsBaseInfo.ProId,
            ProCount: currentValue
          });
          self.coutMoneyTotal();
        }
      }
    },
    //商品瑕疵
    coutMoneyXC(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC007";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC007";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC007",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC007";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC007",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //爆罐
    coutMoneybg(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC014";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC014";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC014",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC014";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC014",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //包赚破损-退货
    coutMoneybzps(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC015";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC015";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC015",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC015";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC015",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //商品瑕疵1-退货
    coutMoneyspxc(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC016";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC016";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC016",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC016";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC016",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //商品保质期与平台描述不符-退款
    coutMoneyptbzq(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC017";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC017";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC017",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC017";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC017",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //错发
    coutMoneycf(currentValue, oldValue) {
      if (currentValue == undefined) {
        currentValue = 0;
      }
      let self = this;
      self.value3 = currentValue;
      if (currentValue > oldValue) {
        self.procoutC = currentValue;
        self.RefundStandardCode = "RSC018";
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC018";
        });
        //判断是否存在
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC018",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      } else {
        let index = self.RefundStandards.findIndex(item => {
          return item.RefundStandardCode == "RSC018";
        });
        if (index != -1) {
          self.RefundStandards.splice(index, 1);
        }
        self.RefundStandards.push({
          RefundStandardCode: "RSC018",
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          ProId: self.goodsBaseInfo.ProId,
          ProCount: currentValue
        });
        self.coutMoneyTotal();
      }
    },
    //==========计算金额结束=====================

    sqthtkClick() {
      this.stdDialog = "thtk-payback-dialog";
      this.ruleForm.serviceType = "退货退款";
      this.RefundMethodCode = this.payBackType[2].RefundMethodCode;
      this.RefundMethodDesc = this.payBackType[2].RefundMethodDesc;
      this.ruleForm.reason = "";
      this.jnf = "";
      this.reasonArr = this.payBackType[2].RefundOrderReasons;
      this.showCoutBtn = true;
    },

    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、PNG、JPEG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = _URL.createObjectURL(file);
        img.onload = function() {
          _self.listObj[fileName] = {
            hasSuccess: false,
            uid: file.uid,
            width: this.width,
            height: this.height
          };
        };
        resolve(true);
      });
    },

    chooseServiceType(value) {
      this.jnf = "";
      this.ruleForm.reason = "";
      this.lv1 = 0;
      this.lv2 = 0;
      this.lv3 = 0;
      this.value1 = 0;
      this.value2 = 0;
      this.value3 = 0;
      this.xcCout = 0;
      this.bgCout = 0;
      this.bzpsCout = 0;
      this.spxcCout = 0;
      this.ptbzqCout = 0;
      this.cfCout = 0;
      this.djCout = 0;
      this.clearInfo();
      this.clearImage();
      switch (value) {
        case "申请补偿":
          this.stdDialog = "payback-dialog";
          this.RefundMethodCode = this.payBackType[0].RefundMethodCode;
          this.RefundMethodDesc = this.payBackType[0].RefundMethodDesc;
          this.bglvl1Code = this.payBackType[0].RefundOrderReasons[0].RefundOrderStandards[0].RefundStandardCode;
          this.reasonArr = [];
          this.payBackType[0].RefundOrderReasons.forEach(item => {
            if (item.RefundReasonDesc != "订单发货超时") {
              this.reasonArr.push(item);
            }
          });
          this.showCoutBtn = true;
          break;
        case "仅退款":
          this.stdDialog = "jtk-payback-dialog";
          this.RefundMethodCode = this.payBackType[1].RefundMethodCode;
          this.RefundMethodDesc = this.payBackType[1].RefundMethodDesc;
          this.reasonArr = this.payBackType[1].RefundOrderReasons;
          this.showCoutBtn = false;
          break;
        case "退货退款":
          this.stdDialog = "thtk-payback-dialog";
          this.RefundMethodCode = this.payBackType[2].RefundMethodCode;
          this.RefundMethodDesc = this.payBackType[2].RefundMethodDesc;
          this.reasonArr = this.payBackType[2].RefundOrderReasons;
          this.showCoutBtn = true;
          break;
      }
    },
    chooseReasonArrType(value) {
      this.jnf = "";
      this.lv1 = 0;
      this.lv2 = 0;
      this.lv3 = 0;
      this.value1 = 0;
      this.value2 = 0;
      this.value3 = 0;
      this.xcCout = 0;
      this.bgCout = 0;
      this.bzpsCout = 0;
      this.spxcCout = 0;
      this.ptbzqCout = 0;
      this.cfCout = 0;
      this.djCout = 0;
      this.clearInfo();
      this.clearImage();
      switch (value) {
        case "RRC001":
          this.jnf = "瘪罐（仅奶粉）";
          this.RefundReasonCode = this.payBackType[0].RefundOrderReasons[0].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[0].RefundOrderReasons[0].RefundReasonDesc;
          break;
        case "RRC002":
          this.jnf = "包装破损";
          this.RefundReasonCode = this.payBackType[0].RefundOrderReasons[1].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[0].RefundOrderReasons[1].RefundReasonDesc;
          break;
        case "RRC003":
          this.jnf = "商品瑕疵";
          this.RefundReasonCode = this.payBackType[0].RefundOrderReasons[2].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[0].RefundOrderReasons[2].RefundReasonDesc;
          break;
        case "RRC004":
          this.jnf = "商品保质期与平台描述不符";
          this.RefundReasonCode = this.payBackType[0].RefundOrderReasons[3].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[0].RefundOrderReasons[3].RefundReasonDesc;
          break;
        case "RRC016":
          this.jnf = "订单发货超时";
          this.RefundReasonCode = this.payBackType[0].RefundOrderReasons[4].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[0].RefundOrderReasons[4].RefundReasonDesc;
          break;
        case "RRC005":
          this.jnf = "丢件";
          this.RefundReasonCode = this.payBackType[1].RefundOrderReasons[0].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[1].RefundOrderReasons[0].RefundReasonDesc;
          break;
        case "RRC006":
          this.jnf = "少件";
          this.RefundReasonCode = this.payBackType[1].RefundOrderReasons[1].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[1].RefundOrderReasons[1].RefundReasonDesc;
          break;
        case "RRC007":
          this.jnf = "拒收";
          this.RefundReasonCode = this.payBackType[1].RefundOrderReasons[2].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[1].RefundOrderReasons[2].RefundReasonDesc;
          break;
        case "RRC008":
          this.jnf = "爆罐";
          this.RefundReasonCode = this.payBackType[2].RefundOrderReasons[0].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[2].RefundOrderReasons[0].RefundReasonDesc;
          break;
        case "RRC009":
          this.jnf = "包装破损1";
          this.RefundReasonCode = this.payBackType[2].RefundOrderReasons[1].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[2].RefundOrderReasons[1].RefundReasonDesc;
          break;
        case "RRC010":
          this.jnf = "商品瑕疵1";
          this.RefundReasonCode = this.payBackType[2].RefundOrderReasons[2].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[2].RefundOrderReasons[2].RefundReasonDesc;
          break;
        case "RRC011":
          this.jnf = "商品保质期与平台描述不符1";
          this.RefundReasonCode = this.payBackType[2].RefundOrderReasons[3].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[2].RefundOrderReasons[3].RefundReasonDesc;
          break;
        case "RRC012":
          this.jnf = "错发";
          this.RefundReasonCode = this.payBackType[2].RefundOrderReasons[4].RefundReasonCode;
          this.RefundReasonDesc = this.payBackType[2].RefundOrderReasons[4].RefundReasonDesc;
          break;
      }
    },
    //跳转到客服
    contactServe() {
      let u = "https://chat.xiankefu.com/?bid=8c827410baf6caf4c810e9b9bce25f9a";
      window.open(u);
    },
    submitForm(formName) {
      let self = this;
      self.btnFlag = true;
      this.$refs[formName].validate(valid => {
        let arry = [];
        self.RefundStandards.forEach(element => {
          switch (element.RefundStandardCode) {
            case "RSC001":
              self.cout10 = element.ProCount;
              arry.push({
                key: baseConfig.percentLv1,
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC002":
              self.cout10_30 = element.ProCount;
              arry.push({
                key: baseConfig.percentLv2,
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC003":
              self.cout30_50 = element.ProCount;
              arry.push({
                key: baseConfig.percentLv3,
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC004":
              self.damageCout1 = element.ProCount;
              arry.push({
                key: baseConfig.damageLv1,
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC005":
              self.damageCout2 = element.ProCount;
              arry.push({
                key: baseConfig.damageLv2,
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC006":
              self.damageCout3 = element.ProCount;
              arry.push({
                key: baseConfig.damageLv3,
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC007":
              arry.push({
                key: "商品瑕疵",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC009":
              self.dyptyxq = element.ProCount;
              arry.push({
                key: "低于平台有效期数量",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC010":
              self.dyzyxq = element.ProCount;
              arry.push({
                key: "低于总效期数量",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC011":
              arry.push({
                key: "丢件",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC012":
              arry.push({
                key: "少件",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC022":
              arry.push({
                key: "订单发货超时",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC013":
              arry.push({
                key: "拒收",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC014":
              arry.push({
                key: "爆罐",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC015":
              arry.push({
                key: "包装破损_退货退款",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC016":
              arry.push({
                key: "商品瑕疵_退货退款",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC017":
              arry.push({
                key: "商品保质期与平台描述不符_退货退款",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
            case "RSC018":
              arry.push({
                key: "错发",
                RefundCount: element.ProCount,
                RefundStandardCode: element.RefundStandardCode
              });
              break;
          }
        });
        self.RefundOrderDetailse = [];
        self.RefundOrderDetailse.push({
          SN: self.goodsBaseInfo.SN,
          RefundSkuId: self.goodsBaseInfo.ProId,
          OrderDetailId: self.goodsBaseInfo.OrderDetailId,
          RefundSKUs: arry,
          LowerThanPlatformValidityPeriodCount: self.dyptyxq,
          LowerThanTotalValidityPeriodCount: self.dyzyxq,
          DamageTenCount: self.cout10,
          DamageTenToThirtyCount: self.cout10_30,
          DamageThirtyToFiftyCount: self.cout30_50,
          SeriousDamageCount: self.damageCout1,
          ModerateDamageCount: self.damageCout2,
          SlightDamageCount: self.damageCout3,
          BatchNumberOrExpiryDateImage: self.BatchNumberOrExpiryDateImage,
          CartonImage: self.CartonImage,
          ExpressDeliverySheetImage: self.ExpressDeliverySheetImage,
          MerchandiseFrontImage: self.MerchandiseFrontImage,
          DamagedImage: self.DamagedImage,
          UnpackingImage: self.UnpackingImage,
          ExpressboxImage: self.ExpressboxImage,
          shqImage: self.shqImage,
          VoucherImage6: self.VoucherImage6,
          VoucherImage5: self.VoucherImage5,
          VoucherImage4: self.VoucherImage4,
          VoucherImage3: self.VoucherImage3,
          VoucherImage2: self.VoucherImage2,
          VoucherImage1: self.VoucherImage1
        });
        let params = {
          OrderCode: self.goodsBaseInfo.OrderCode,
          RefundMethodCode: self.RefundMethodCode,
          RefundMethodDesc: self.RefundMethodDesc,
          RefundReasonCode: self.RefundReasonCode,
          RefundReasonDesc: self.RefundReasonDesc,
          refundExplain: self.ruleForm.resasonDesc,
          RefundOrderDetails: self.RefundOrderDetailse,
          Token: window.localStorage.getItem("Token")
            ? window.localStorage.getItem("Token")
            : null
        };
        if (this.ProTotalPrice === 0) {
          this.$message({
            message: "请填写退款数量",
            type: "error",
            center: true,
            duration: 2000
          });
          self.btnFlag = false;
        } else if (this.jnf == "瘪罐（仅奶粉）" || this.jnf == "爆罐") {
          if (
            this.BatchNumberOrExpiryDateImage == "" ||
            this.CartonImage == "" ||
            this.ExpressDeliverySheetImage == "" ||
            this.MerchandiseFrontImage == "" ||
            this.DamagedImage == "" ||
            this.shqImage == "" ||
            this.ExpressboxImage == ""
          ) {
            this.$message({
              message: "请检查凭证是否上传完整",
              type: "error",
              center: true,
              duration: 2000
            });
            self.btnFlag = false;
          } else {
            if (valid) {
              submitPayBack(params).then(res => {
                if (res.ResponseId != 0) {
                  self.btnFlag = false;
                  this.isLoginOut(res);
                } else {
                  this.deleteOssPic(this.deleteOssImages);
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    center: true,
                    duration: 2000
                  });
                  this.$router.push({
                    path: "/dashboard/afterSaleShbcStep2",
                    query: res.Data
                  });
                  setTimeout(() => {
                    self.btnFlag = false;
                  }, 500);
                  Bus.$emit("goodsInfo", this.goodsBaseInfo);
                }
              });
            } else {
              this.$message({
                message: "对不起，提交失败,请检查表单是否填写完整",
                type: "error",
                center: true,
                duration: 2000
              });
              self.btnFlag = false;
              return false;
            }
          }
        } else if (
          this.jnf == "包装破损" ||
          this.jnf == "商品瑕疵" ||
          this.jnf == "商品保质期与平台描述不符" ||
          this.jnf == "包装破损1" ||
          this.jnf == "商品保质期与平台描述不符1" ||
          this.jnf == "错发" ||
          this.jnf == "商品瑕疵1"
        ) {
          if (
            this.BatchNumberOrExpiryDateImage == "" ||
            this.ExpressDeliverySheetImage == "" ||
            this.MerchandiseFrontImage == "" ||
            this.DamagedImage == "" ||
            this.shqImage == "" ||
            this.ExpressboxImage == ""
          ) {
            this.$message({
              message: "请检查凭证是否上传完整",
              type: "error",
              center: true,
              duration: 2000
            });
            self.btnFlag = false;
          } else {
            if (valid) {
              submitPayBack(params).then(res => {
                if (res.ResponseId != 0) {
                  self.btnFlag = false;
                  this.isLoginOut(res);
                } else {
                  this.deleteOssPic(this.deleteOssImages);
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    center: true,
                    duration: 2000
                  });
                  this.$router.push({
                    path: "/dashboard/afterSaleShbcStep2",
                    query: res.Data
                  });
                  setTimeout(() => {
                    self.btnFlag = false;
                  }, 500);
                  Bus.$emit("goodsInfo", this.goodsBaseInfo);
                }
              });
            } else {
              this.$message({
                message: "对不起，提交失败,请检查表单是否填写完整",
                type: "error",
                center: true,
                duration: 2000
              });
              self.btnFlag = false;
              return false;
            }
          }
        } else if (this.jnf == "少件") {
          if (
            this.ExpressDeliverySheetImage == "" ||
            this.UnpackingImage == "" ||
            this.shqImage == "" ||
            this.ExpressboxImage == ""
          ) {
            this.$message({
              message: "请检查凭证是否上传完整",
              type: "error",
              center: true,
              duration: 2000
            });
            self.btnFlag = false;
          } else {
            if (valid) {
              submitPayBack(params).then(res => {
                if (res.ResponseId != 0) {
                  self.btnFlag = false;
                  this.isLoginOut(res);
                } else {
                  this.deleteOssPic(this.deleteOssImages);
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    center: true,
                    duration: 2000
                  });
                  this.$router.push({
                    path: "/dashboard/afterSaleShbcStep2",
                    query: res.Data
                  });
                  setTimeout(() => {
                    self.btnFlag = false;
                  }, 500);
                  Bus.$emit("goodsInfo", this.goodsBaseInfo);
                }
              });
            } else {
              this.$message({
                message: "对不起，提交失败,请检查表单是否填写完整",
                type: "error",
                center: true,
                duration: 2000
              });
              self.btnFlag = false;
              return false;
            }
          }
        } else if (this.jnf == "拒收") {
          if (
            this.ExpressDeliverySheetImage == "" ||
            this.shqImage == "" ||
            this.ExpressboxImage == ""
          ) {
            this.$message({
              message: "请检查凭证是否上传完整",
              type: "error",
              center: true,
              duration: 2000
            });
            self.btnFlag = false;
          } else {
            if (valid) {
              submitPayBack(params).then(res => {
                if (res.ResponseId != 0) {
                  self.btnFlag = false;
                  this.isLoginOut(res);
                } else {
                  this.deleteOssPic(this.deleteOssImages);
                  this.$message({
                    message: "提交成功",
                    type: "success",
                    center: true,
                    duration: 2000
                  });
                  this.$router.push({
                    path: "/dashboard/afterSaleShbcStep2",
                    query: res.Data
                  });
                  setTimeout(() => {
                    self.btnFlag = false;
                  }, 500);
                  Bus.$emit("goodsInfo", this.goodsBaseInfo);
                }
              });
            } else {
              this.$message({
                message: "对不起，提交失败,请检查表单是否填写完整",
                type: "error",
                center: true,
                duration: 2000
              });
              self.btnFlag = false;
              return false;
            }
          }
        } else {
          if (valid) {
            submitPayBack(params).then(res => {
              if (res.ResponseId != 0) {
                self.btnFlag = false;
                this.isLoginOut(res);
              } else {
                this.deleteOssPic(this.deleteOssImages);
                this.$message({
                  message: "提交成功",
                  type: "success",
                  center: true,
                  duration: 2000
                });
                this.$router.push({
                  path: "/dashboard/afterSaleShbcStep2",
                  query: res.Data
                });
                setTimeout(() => {
                  self.btnFlag = false;
                }, 500);
                Bus.$emit("goodsInfo", this.goodsBaseInfo);
              }
            });
          } else {
            this.$message({
              message: "对不起，提交失败,请检查表单是否填写完整",
              type: "error",
              center: true,
              duration: 2000
            });
            self.btnFlag = false;
            return false;
          }
        }
      });
    },
    resetForm(formName) {
      this.$router.push({
        path: "/dashboard/orderCenter"
      });
    },
    //请求接口后判断用户是否登陆过期
    isLoginOut(res) {
      this.$message.error(res.Message);
      if (res.ResponseId == -1) {
        this.$store.commit("LOGOUT");
        this.$message({
          message: "登录过期，请重新登录",
          type: "error",
          duration: 1000,
          onClose: () => {
            this.$router.push({
              path: "/login"
            });
          }
        });
      }
    },
    // 获取数据
    getData() {
      //获取退款类型
      let param = {
        refundType: 2
      };
      getPayBackType(param).then(res => {
        this.payBackType = res;
        this.payBackType.forEach(element => {
          this.serviceTypeArr.push({
            tName: element.RefundMethodDesc,
            tcode: element.RefundMethodCode
          });
        });
        this.ruleForm.serviceType = "申请补偿";
        this.chooseServiceType(this.ruleForm.serviceType);
      });
      getPayBackList({
        SN: this.$route.query.SN,
        ordercode: this.$route.query.OrderCode,
        token: window.localStorage.getItem("Token")
          ? window.localStorage.getItem("Token")
          : null
      }).then(res => {
        this.goodsBaseInfo = res;
        this.sum = this.goodsBaseInfo.ProCount;
      });
    },
    clearInfo() {
      this.lv1 = 0;
      this.lv2 = 0;
      this.lv3 = 0;
      this.isShow1 = true;
      this.isShow2 = true;
      this.isShow3 = true;
      this.isShow4 = true;
      this.isShow5 = true;
      this.isShow6 = true;
      this.isShow7 = true;
      this.isShow8 = true;
      this.ProTotalPrice = 0.0;
      this.RefundStandards = [];
    },
    //上传相关操作============
    deletePicture1() {
      this.deleteOssImages.push(this.ExpressDeliverySheetImage);
      this.isShow1 = !this.isShow1;
      this.ExpressDeliverySheetImage = "";
    },
    deletePicture2() {
      this.deleteOssImages.push(this.ExpressboxImage);
      this.isShow2 = !this.isShow2;
      this.ExpressboxImage = "";
    },
    deletePicture3() {
      this.deleteOssImages.push(this.DamagedImage);
      this.isShow3 = !this.isShow3;
      this.DamagedImage = "";
    },
    deletePicture4() {
      this.deleteOssImages.push(this.MerchandiseFrontImage);
      this.isShow4 = !this.isShow4;
      this.MerchandiseFrontImage = "";
    },
    deletePicture5() {
      this.deleteOssImages.push(this.BatchNumberOrExpiryDateImage);
      this.isShow5 = !this.isShow5;
      this.BatchNumberOrExpiryDateImage = "";
    },
    deletePicture6() {
      this.deleteOssImages.push(this.CartonImage);
      this.isShow6 = !this.isShow6;
      this.CartonImage = "";
    },
    deletePicture7() {
      this.deleteOssImages.push(this.UnpackingImage);
      this.isShow7 = !this.isShow7;
      this.UnpackingImage = "";
    },
    deletePicture8() {
      this.deleteOssImages.push(this.shqImage);
      this.isShow8 = !this.isShow8;
      this.shqImage = "";
    },
    //==============上传相关操作结束===================
    clearImage() {
      this.shqImage = "";
      this.BatchNumberOrExpiryDateImage = "";
      this.CartonImage = "";
      this.ExpressDeliverySheetImage = "";
      this.MerchandiseFrontImage = "";
      this.UnpackingImage = "";
      this.DamagedImage = "";
      this.ExpressboxImage = "";
    }
  }
};
</script>

<style scoped>
li {
  color: #333333;
}
.ul_style {
  list-style-type: none;
  margin-left: -37px;
  margin-top: 3px;
}
.dq {
  margin-right: 10px;
  vertical-align: middle;
}
.dq:hover {
  margin-right: 10px;
  vertical-align: middle;
  opacity: 0.7;
}
.bg {
  width: 100%;
  height: 15px;
  background: #f6f6f6;
  position: absolute;
  left: 0;
}

.order-title {
  font-size: 16px;
  font-weight: 600 !important;
}

.order {
  width: 98%;
  border-collapse: collapse;
  margin: 30px;
  box-sizing: content-box !important;
}
.order1 {
  width: 100%;
  border-collapse: collapse;
  /* margin-top: 16px; */
  box-sizing: content-box !important;
}

.tk_bg {
  width: 100%;
}

.line {
  border-style: solid;
  border-width: 0.5px;
  border-color: #eee;
  margin: 13px 0 15px 0;
}
p {
  color: #999999;
  line-height: 30px;
}
.tkmskg {
  margin-top: 15px;
}
.oder_info {
  text-align: center;
  padding: 0 0 14px 0;
}
.tkxx_box {
  text-align: center;
  display: flex;
  padding: 36px;
  background: url("../../assets/img/tkbg.png") no-repeat;
}
.sotp {
  border-style: solid;
  border-width: 0.5px;
  border-color: #eee;
  padding: 5px;
  display: block;
  width: 150px;
  height: 150px;
  margin-right: 20px;
}
.line-c {
  margin: 0 0 -25px 0;
  border-style: solid;
  border-color: #f2f2f2;
  border-width: 0 1px 0 0;
}
.left_div {
  padding: 0 20px 0 0;
  width: 75%;
}
.contac_btn {
  margin: 20px 0 0 0;
  font-size: 12px;
  background-color: rgb(245, 245, 245);
  width: auto;
  height: auto;
}
.contact_img {
  margin: 0 auto;
  vertical-align: middle;
  height: 20px;
}
.right_div {
  padding: 0 0 0 20px;
  margin-top: -13px;
  width: 30%;
}
.must_class {
  vertical-align: middle;
  width: 10px;
  height: 10px;
}
.border_TK {
  margin: 0 5px 0 0;
  width: auto;
  height: auto;
  border-style: solid;
  border-width: 0.5px;
  border-color: #eee;
  padding: 5px 5px 0 5px;
  border-radius: 5px;
}
.temImg {
  border-radius: 5px;
  width: 113px;
  height: 115px;
}
.bgimg_clss {
  color: #999999;
  text-align: center;
  margin-top: -10px;
}
.close_upload_img {
  cursor: pointer;
  width: 25px !important;
  height: 25px !important;
  position: absolute;
  margin: -13px 0 0 -47px;
}
.close_upload_img:hover {
  opacity: 0.7;
}
.upload_img {
  width: 200px;
  height: 200px;
  margin: 0 32px 0 0;
  border-radius: 5px;
}
.upload_scpz {
  display: inline;
}
.scpzImg {
  position: absolute;
  vertical-align: middle;
  top: 44%;
  left: 29%;
}
.scpztextImg {
  position: absolute;
  top: 36%;
  left: 29%;
  color: #999999;
}
.div_import {
  color: #f56c6c;
  font-size: 14px;
  position: absolute;
  margin: 11px 0 0 8px;
}
.span_import {
  color: #f56c6c;
  font-size: 14px;
}
.showDetailPic {
  border: 2px solid white;
  pointer-events: none;
  cursor: pointer;
  top: 71%;
  left: 5.5%;
  position: absolute;
  width: 90px;
  height: 40px;
  background-color: #000;
  opacity: 0.5;
  text-align: center;
  color: #f2f2f2;
  border-radius: 5px;
  padding: 4px 0 0 0;
}
.sqtkBtn {
  background-color: #f5f5f5;
}
.sqtkBtn:hover {
  background-color: #00b0ff;
}
.ckxp_span {
  /* pointer-events: none; */
  color: white;
  position: absolute;
  left: 85px;
  top: 201px;
  cursor: pointer;
}
.comfirm {
  padding: 9px;
  text-align: center;
  width: 130px;
  cursor: pointer;
  font-size: 10px;
  border: none;
  border-radius: 3px;
  background-color: #00b0ff;
  color: white;
}
.comfirm:hover {
  background-color: #f78989;
}
.tkxq_root {
  width: 1005px;
}
</style>
<style lang="scss" >
.tkxq_root {
  .el-button:focus,
  .el-button:hover {
    color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff !important;
  }
  .el-upload-list--picture-card .el-upload-list__item-thumbnail {
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions {
    display: none;
  }
  .el-upload--picture-card {
    width: 200px;
    height: 200px;
  }
  .el-button {
    padding: 4px 13px;
  }
  .el-form-item__error--inline {
    margin-left: 20px;
  }
}
</style>