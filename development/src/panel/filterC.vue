<template>
  <div class="filterC-drag" v-if="filterC_sh">
    <div
      class="box filterC popup-box"
      data-drag="true"
      @click="boxZindex"
      :style="{'z-index': Zindex}"
    >
      <h1 class="b_title darg-title">
        <p class="tit_left">滤镜</p>
        <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
          <img src="../../static/img/N-dele.png" v-if="bselected" />
          <img src="../../static/img/N-d-select.png" v-else @click="noneother()" />
        </p>
      </h1>
      <div class="d_conten">
        <p class="d_conten_in">
          <span>色调:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="Ftonal"
            v-model="Ftonalval"
            @click="FinputFn('色调')"
            @keyup.enter="FinputBlur('色调')"
            @blur="FinputBlur('色调')"
          />
        </p>
        <p class="d_conten_in">
          <span>饱和度:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="Fsaturation"
            v-model="Fsaturationval"
            @click="FinputFn('饱和度')"
            @keyup.enter="FinputBlur('饱和度')"
            @blur="FinputBlur('饱和度')"
          />
        </p>
        <p class="d_conten_in">
          <span>亮度:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="Fbrightness"
            v-model="Fbrightness"
            @click="FinputFn('亮度')"
            @keyup.enter="FinputBlur('亮度')"
            @blur="FinputBlur('亮度')"
          />
        </p>
        <p class="d_conten_in">
          <span>模糊:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="Ffuzzy"
            v-model="Ffuzzy"
            @click="FinputFn('模糊')"
            @keyup.enter="FinputBlur('模糊')"
            @blur="FinputBlur('模糊')"
          />
        </p>
        <p class="d_conten_in">
          <span>对比度:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="Fcontrast"
            v-model="Fcontrast"
            @click="FinputFn('对比度')"
            @keyup.enter="FinputBlur('对比度')"
            @blur="FinputBlur('对比度')"
          />
        </p>
        <p class="d_conten_in">
          <span>灰度:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="Fgray"
            v-model="Fgray"
            @click="FinputFn('灰度')"
            @keyup.enter="FinputBlur('灰度')"
            @blur="FinputBlur('灰度')"
          />
        </p>
      </div>
      <div class="d_foot_btn">
        <button class="btn_yes" @click="yes_save">关闭</button>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import drag from "../../static/js/drag";
export default {
  name: "filterC",
  props: ["index", "filterC"],
  data() {
    return {
      Zindex: 0,
      bselected: true, //图片选中的判断
      filterC_sh: true,
      Ftonalval: "2", //色调
      Fsaturationval:'2',//饱和度
      Fbrightness:'2',//亮度
      Ffuzzy:'2',//模糊
      Fcontrast:"2",//对比度
      Fgray:'2',//灰度
    };
  },
  watch: {},
  methods: {
    noneother() {
      //点击X,隐藏整个弹框
      this.filterC_sh = false;
      this.$emit("closepanel", "滤镜");
    },
    R_selectStyle() {
      // X 图片显示选中
      this.bselected = false;
    },
    R_outStyle() {
      // X 图片显示不选中
      this.bselected = true;
    },
    boxZindex() {
      //层级
      let arr = [];
      $(".popup-box").each(function(item) {
        // console.log($(this).css('z-index'), "$(this).css('z-index')", $(this))
        arr.push(Number($(this).css("z-index")));
      });
      // console.log(Math.max(...arr), 'this.Zindex1111')
      this.Zindex = Math.max(...arr) + 1;
      // console.log(this.Zindex, 'this.Zindex')
    },
    yes_save() {
      this.noneother();
    },
    FinputFn(data) {//input点击事件
      if(data == "色调"){
        $("#Ftonal").addClass("inputclick");
      }else if(data == "饱和度"){
        $("#Fsaturation").addClass("inputclick");
      }else if(data == "亮度"){
        $("#Fbrightness").addClass("inputclick");
      }else if(data == "模糊"){
        $("#Ffuzzy").addClass("inputclick");
      }else if(data == "对比度"){
        $("#Fcontrast").addClass("inputclick");
      }else if(data == "灰度"){
        $("#Fgray").addClass("inputclick");
      }
    },
    FinputBlur(data) {//input失去焦点事件
      if(data == "色调"){
        $("#Ftonal").removeClass("inputclick");
      }else if(data == "饱和度"){
        $("#Fsaturation").removeClass("inputclick");
      }else if(data == "亮度"){
        $("#Fbrightness").removeClass("inputclick");
      }else if(data == "模糊"){
        $("#Ffuzzy").removeClass("inputclick");
      }else if(data == "对比度"){
        $("#Fcontrast").removeClass("inputclick");
      }else if(data == "灰度"){
        $("#Fgray").removeClass("inputclick");
      }
    }
  },
  mounted: function() {
    drag("filterC-drag", "");
    this.Zindex = this.index;
    // console.log(this.kindheader);
  }
};
</script>
<style lang="less" scoped>
.box {
  position: absolute;
}
.filterC {
  position: absolute;
  top: calc(50% - 170px);
  left: calc(50% - 415px);
  width:830px;
  height:356px;
  background: #535353;
  overflow: hidden;
  border-radius: 6px;
  .b_title {
    display: flex;
    width:830px;
    height: 48px;
    background: rgba(194, 194, 194, 1);
    line-height: 48px;
    color: #333333;
    font-size: 20px;
    .tit_left {
      width: 82%;
      height: 100%;
      margin-left: 40px;
      font-weight: 500;
    }
    .tit_right {
      width: 10%;
      height: 100%;
      margin-right: 10px;
      margin-top: -2px;
      text-align: right;
      img {
        width: 18px;
        height: 18px;
      }
    }
  }
  .d_conten {
    width: 95%;
    height: 208px;
    padding-left: 40px;
    padding-top: 15px;
    font-size: 16px;
    border-bottom: 1px solid #6e6f70;
    color: rgba(255, 255, 255, 1);
    .d_conten_in {
      display: inline-block;
      width: 48%;
      height: 44px;
      margin-top: 8px;
      line-height: 40px;
      select,
      input {
        width: 280px;
        height: 30px;
        margin-left: 5px;
        padding-left: 5px;
        background: rgba(69, 69, 69, 1);
        border-radius: 6px;
        border: 1px solid rgba(69, 69, 69, 1);
        box-sizing: border-box;
        color: #ececec;
      }
      #YFactorinput::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
      span{
        margin-right: 41px;
      }
    }
    .d_conten_in:nth-child(2n){
      margin-left: 10px;
    }
    .d_conten_in:nth-child(2),.d_conten_in:nth-child(5) {
      span {
        margin-right: 24px;
      }
    }
    .chevkboxlist {
      width: 90%;
      height: 70px;
      line-height: 70px;
      p {
        position: relative;
        display: inline-block;
        margin-right: 28px;
        width: 18%;
        height: 100%;
        input[type="checkbox"] {
          position: absolute;
          left: 66px;
          top: 26px;
          width: 15px;
          height: 15px;
          opacity: 0;
          z-index: 2;
        }
        label {
          position: absolute;
          left: 66px;
          top: 26px;
          width: 15px;
          height: 15px;
          border-radius: 3px;
          border: 1px solid #999;
        }
        input:checked + label {
          background-color: #00A4FF;
          border: 1px solid #00A4FF;
        }
        input:checked + label::after {
          position: absolute;
          content: "";
          width: 5px;
          height: 10px;
          left: 4px;
          top: 0px;
          border: 2px solid #fff;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
          text-align: center;
          display: block;
          color: white;
        }
      }
    }
  }
  .d_foot_btn {
    width: 100%;
    height: 84px;
    line-height: 84px;
    button {
      width: 120px;
      height: 34px;
      line-height: 34px;
      margin-left: 680px;
      background: rgba(56, 56, 56, 1);
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
    button:hover,
    .b_select {
      background: linear-gradient(
        0deg,
        rgba(3, 131, 245, 1),
        rgba(13, 248, 247, 1)
      );
    }
  }
  .inputclick {
    border: 1px solid #00a4ff !important;
  }
}
</style>