<template>
  <div class="renderer-drag" v-if="renderer_sh">
    <div
      class="box renderer popup-box"
      data-drag="true"
      @click="boxZindex"
      :style="{'z-index': Zindex}"
    >
      <h1 class="b_title darg-title">
        <p class="tit_left">渲染器</p>
        <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
          <img src="../../static/img/N-dele.png" v-if="bselected" />
          <img src="../../static/img/N-d-select.png" v-else @click="noneother()" />
        </p>
      </h1>
      <div class="d_conten">
        <p class="d_conten_in">
          <span>阴影类型:</span>
          <!-- @click="ShadowTypeFn()" -->
          <select
            v-model="ShadowTypeval"
            @change="ShadowTypeBlur()"
            id="ShadowType"
            class="layerZindex"
          >
            <option :value="item" v-for="(item, key) in ShadowTypeList" :key="key">{{item.val}}</option>
          </select>
        </p>
        <p class="d_conten_in">
          <span>y因子:</span>
          <input
            type="number"
            max="100"
            min="0"
            id="YFactor"
            v-model="YFactorval"
            @click="YFactorFn()"
            @keyup.enter="YFactorBlur()"
            @blur="YFactorBlur()"
          />
        </p>
        <div class="chevkboxlist">
          <p>
            <span>y输入:</span>
            <input type="checkbox" checked="checked" name id="YInput" @click="checkboxFn('YInput')" />
            <label></label>
          </p>
          <p>
            <span>y输出:</span>
            <input
              type="checkbox"
              checked="checked"
              name
              id="YOutput"
              @click="checkboxFn('YOutput')"
            />
            <label></label>
          </p>
          <p>
            <span>阴影:</span>
            <input
              type="checkbox"
              checked="checked"
              name
              id="RShadow"
              @click="checkboxFn('RShadow')"
            />
            <label></label>
          </p>
          <p>
            <span>抗锯齿:</span>
            <input
              type="checkbox"
              checked="checked"
              name
              id="AntiAliasing"
              @click="checkboxFn('AntiAliasing')"
            />
            <label></label>
          </p>
        </div>
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
  name: "renderer",
  props: ["index", "renderer"],
  data() {
    return {
      Zindex: 0,
      bselected: true, //图片选中的判断
      renderer_sh: true,
      ShadowTypeval: { key: "BasicShadowMap", val: "基本阴影" }, //阴影类型
      YFactorval: "2", //y因子
      ShadowTypeList: [
        { key: "BasicShadowMap", val: "基本阴影" },
        { key: "PCFShadowMap", val: "PCF阴影" },
        { key: "PCFSoftShadowMap", val: "PCF软阴影" },
        { key: "none", val: "禁用" }
      ]
    };
  },
  watch: {},
  methods: {
    noneother() {
      //点击X,隐藏整个弹框
      this.renderer_sh = false;
      this.$emit("closepanel", "渲染器");
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
    ShadowTypeFn() {
      //阴影类型 点击事件
      $("#ShadowType").addClass("inputclick");
    },
    ShadowTypeBlur() {
      //阴影类型 失去焦点事件
      // console.log(this.ShadowTypeval);
      $("#ShadowType").removeClass("inputclick");
      this.renderer.rendererUpdate("shadowMapType", this.ShadowTypeval.key);
    },
    YFactorFn() {
      //y因子  点击事件
      $("#YFactor").addClass("inputclick");
    },
    YFactorBlur() {
      //y因子  失去焦点事件
      $("#YFactor").removeClass("inputclick");
      this.renderer.rendererUpdate("gammaFactor", this.YFactorval);
    },
    checkboxFn(data) {
      //单选框  点击事件
      if (data == "YInput") {
        var inputV = $("#YInput").prop("checked");
        // if(inputV == true) {//选中
        //     this.renderer.rendererUpdate('GammaInput',true);
        // }else if(inputV == false){
        //     this.renderer.rendererUpdate('GammaInput',false);
        // }
        this.renderer.rendererUpdate("GammaInput", inputV);
      } else if (data == "YOutput") {
        var outputV = $("#YOutput").prop("checked");
        if (outputV == true) {
          //选中
          this.renderer.rendererUpdate("gammaOutput", true);
        } else if (outputV == false) {
          this.renderer.rendererUpdate("gammaOutput", false);
        }
      } else if (data == "RShadow") {
        var shadowV = $("#RShadow").prop("checked");
        if (shadowV == true) {
          //选中
          this.renderer.rendererUpdate("shadowMapEnable", true);
        } else if (shadowV == false) {
          this.renderer.rendererUpdate("shadowMapEnable", false);
        }
      } else if (data == "AntiAliasing") {
        var antiAliasingV = $("#AntiAliasing").prop("checked");
        if (antiAliasingV == true) {
          //选中
          this.renderer.setAntialias(true);
        } else if (antiAliasingV == false) {
          this.renderer.setAntialias(false);
        }
      }
    }
  },
  mounted: function() {
    drag("renderer-drag", "");
    this.Zindex = this.index;
    // console.log(this.kindheader);
  }
};
</script>
<style lang="less" scoped>
.box {
  position: absolute;
}
.renderer {
  position: absolute;
  top: calc(50% - 165px);
  left: calc(50% - 280px);
  width: 558px;
  min-width: 558px;
  height: 330px;
  min-height: 330px;
  background: #535353;
  overflow: hidden;
  border-radius: 6px;
  .b_title {
    display: flex;
    width: 558px;
    height: 48px;
    background: rgba(194, 194, 194, 1);
    line-height: 48px;
    color: #333333;
    font-size: 20px;
    .tit_left {
      width: 96%;
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
    width: 93%;
    height: 185px;
    padding-left: 40px;
    padding-top: 15px;
    line-height: 185px;
    font-size: 16px;
    border-bottom: 1px solid #6e6f70;
    color: rgba(255, 255, 255, 1);
    .d_conten_in {
      width: 100%;
      height: 44px;
      margin-top: 8px;
      line-height: 40px;
      select,
      input {
        width: 275px;
        height: 30px;
        margin-left: 5px;
        padding-left: 5px;
        background: rgba(69, 69, 69, 1);
        border-radius: 6px;
        border: 1px solid rgba(69, 69, 69, 1);
        box-sizing: border-box;
        color: #ececec;
      }
      select{
          option{
              height: 30px;
              line-height: 30px;
              background: #C2C2C2;
              color: #333333;
          }
      }
      select:focus{
          outline:none;
          border: 1px solid #0096ff;
          border-radius: 5px;
      }
      #YFactorinput::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }
    }
    .d_conten_in:nth-child(2) {
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
    height: 81px;
    line-height: 81px;
    button {
      width: 120px;
      height: 34px;
      line-height: 34px;
      margin-left: 414px;
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