<template>
  <div class="light">
    <li class="CPr_contDiv_li li_two">
      <p class="CPr_lip_tit">
        <span>灯光设置</span>
      </p>
      <p class="CPr_lip_color">
        <span>灯光颜色</span>
        <span class="colorbox"></span>
        <!-- :disabled="true" -->
        <el-color-picker
          id="colorName"
          ref="colorName"
          v-model="color"
          @change="ccolor"
          @active-change="accolor"
          @click.native="delsave"
          v-if="colorEl"
        >
          <div class="color-box">1111</div>
        </el-color-picker>
      </p>
      <p class="CPr_lip_Light lip_con block">
        <span>光照强度</span>
        <el-slider v-model="slider_val" :show-tooltip="false" :step="0.1" :max="5" @input="intensity(slider_val )"></el-slider>
        <input
          type="number"
          :value="text_val"
          id="intensityL"
          max="5"
          readonly="readonly"
          @change="intensity(text_val)"
        />
      </p>
    </li>
  </div>
</template>
<script>
import $ from "jquery";
// import { webEdior } from '../../static/js/webEdior.js'
import { colorHex } from '../../static/js/utils'
    export default {
        name:"light",
        props:["light","lightdata"],
        data(){
            return{
                text_val:1,//输入框滑块   光照强度
                slider_val: 1,//滑块   光照强度
                colorName:"#ffffff",//颜色
                webEdior:{},//js
                colorEl: true,
                color: '#504F4F',//
                colorchangeV:'',
                colorchangeC:'',
            }
        },
        watch:{
            text_val(){
                this.slider_val = Number(this.text_val);
                // console.log(this.text_val);
            },
            slider_val(){
                // console.log(this.slider_val);
                this.text_val = this.slider_val;
            },
            lightdata : {
                handler(newName, oldName) {
                    console.log(this.lightdata);
                    this.text_val = this.lightdata.opacity;
                    this.color = this.lightdata.color;
                    console.log(this.color);
                    this.colorEl = false
                    this.$nextTick(()=> {
                        this.colorEl = true
                        // this.colorPlugin();//颜色
                    })
                    
                },
                // 开启深度监听
                deep: true
            },
            colorchangeC : {
                handler(newName, oldName) {
                    this.$nextTick(()=> {
                      console.log("666")
                        $(".el-color-dropdown__link-btn").css({background:this.colorchangeC})
                    })
                },
                // 开启深度监听
                deep: true
            },
            color(){
                console.log(this.color)
                this.light.updateLightColor(this.color);
            },
            colorName(){
                // this.colorPlugin();//颜色
            }
        },
        methods:{
          delsave () {
            $(".el-color-dropdown__link-btn").css({"background":"#ffffff"});
            $(".el-color-dropdown__btns .el-color-dropdown__btn span").text("OK");
          },
            updateLightColor(colorV){
                this.light.updateLightColor("colorName");
            },
            intensity(val){
                // this.slider_val = val; 
                this.light.updateLightOpacity("intensityL");
            },
            formatTooltip(val) {//滑块
                return val / 100;
            },
            ccolor(node){
                 console.log(this.color, 'color');
                // console.log(node);
                this.light.updateLightColor(this.color);
                // this.colorchangeC = this.color
            },
            accolor(node){
                this.colorchangeV = colorHex(node);
                this.colorchangeC = node;
            }
        },
        mounted:function(){
            // console.log(this.color);
            // alert(1111111111)
            // console.log(this.$refs.colorName, 222222)
            this.$refs.colorName.clearValue = function(e) {
              console.log(e, 111111111)
            }
           
        }
    }
</script>
<style lang="less" scoped>
.light {
  .CPr_contDiv_li {
    width: 100%;
    min-width: 336px;
    padding-bottom: 12px;
    padding-left: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
    box-sizing: border-box;
    color: #fff;
    .CPr_lip_tit {
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
      img {
        margin-top: -2px;
      }
    }
    .CPr_lip_Light {
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      span:nth-child(1) {
        margin-right: 3px;
      }
      input[type="number"] {
        width: 32px;
        height: 22px;
        padding-left: 14px;
        text-align: center;
        background: rgba(39, 39, 39, 1);
        border-radius: 3px;
        border: none;
        color: oldlace;
      }
    }
  }
}
</style>
<style lang="less">
.index {
  .CPr_contDiv_li {
    .CPr_lip_color {
      position: relative;
      .el-color-picker {
        top: 6px;
        left: 6px;
        height: 22px;
        .el-color-picker__trigger {
          position: relative;
          width: 34px;
          height: 22px;
          padding: 0;
          background: #504f4f;
          border: 1px solid #000000;
          border-radius: 0;
          .el-color-picker__color {
            border: none;
          }
          .el-color-picker__icon {
            position: absolute;
            top: 15px;
            left: 26px;
            width: 12px;
            height: 9px;
            background: rgba(56, 56, 56, 1);
            border: 1px solid #000000;
            border-bottom: none;
            font-size: 8px;
            color: #9d9d9d;
          }
          // .el-icon-caret-bottom{

          // }
        }
      }
      .colorbox {
        position: absolute;
        top: 50px;
        display: block;
        width: 50px;
        height: 20px;
      }
    }
  } 
}

</style>