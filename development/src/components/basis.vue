<template>
  <div class="basis">
    <li class="CPr_contDiv_li li_one">
      <p class="CPr_lip_tit">
        <!-- <img src="../assets/image/icon.png"> -->
        <span>基础属性</span>
      </p>
      <p class="lip_con">
        <span>
          位置X轴
          <input type="number" id="positionX" step="1" v-model="posiX" @change="XYZX(posiX,'x')" />
        </span>
        <span>
          Y轴
          <input
            type="number"
            id="positionY"
            step="1"
            v-model="posiY"
            @click="noneclick()"
            disabled="disabled"
            @change="XYZX(posiY,'y')"
          />
        </span>
        <span>
          Z轴
          <input type="number" id="positionZ" step="1" v-model="posiZ" @change="XYZX(posiZ,'z')" />
        </span>
      </p>
      <p class="lip_con li_name">
        <span>名称  </span>
        <input
          type="text"
          max="360"
          id="name_basis"
          v-model="name_basis"
          @change="XYZX(name_basis,'name')"
        />
      </p>
      <p class="lip_con xuanzhuan">
        <span>旋转</span>
        <span v-if="moduleposiX">
          X 
          <input type="number" max="360" id="roationX" v-model="xuanX" @change="XYZX(xuanX,'xX')" />
        </span>
        <span>
          Y 
          <input type="number" max="360" id="roationY" v-model="xuanY" @change="XYZX(xuanY,'xY')" />
        </span>
        <span v-if="moduleposiX">
          Z 
          <input type="number" max="360" id="roationZ" v-model="xuanZ" @change="XYZX(xuanZ,'xZ')" />
        </span>
      </p>
      <p class="CPr_lip_concheck">
        <span>是否可见</span>
        <input type="checkbox" checked="checked" name id="seeChoose" @click="kejian()" />
        <label></label>
      </p>
      <p class="lip_con li_name" v-if="chidren_JT">
        <span>机台绑定 :</span>
        <input
          type="text"
          id="jitai_bang"
          v-model="jitaiBang"
          @change="jitai_bang(jitaiBang,'jitai')"
        />
      </p>
    </li>
  </div>
</template>
<script>
import $ from "jquery";
export default {
  name: "basis",
  props: [
    "markbasis",
    "basis",
    "clickid",
    "treeclicknode",
    "labelname",
    "delettreeLIDs",
    "see_YN"
  ],
  data() {
    return {
      posiX: "0", //位置Z
      posiY: "", //位置Y
      posiZ: "0", //位置Z
      xuanX: "0",
      xuanY: "0", //旋转Y
      xuanZ: "0",
      name_basis: "", //
      moduleposiX: true,
      moduleposiY: "",
      moduleposiZ: "",
      modulerotaY: "",
      jitaiBang: "",
      chidren_JT: false, //机台绑定显示
      // webEdior:{},//js
      parent: "", //点击树状图，若为子级，即为父级的整个对象
      childindex: "", //点击子级的下标
      clicklevel: "", //点击子级的层级
      Yaxiosc:true,
    };
  },
  watch: {
    markbasis() {
      // console.log(this.markbasis);
      this.shifoukejian(this.see_YN);
      this.basistwoinput(this.markbasis);
    },
    see_YN() {
      this.$nextTick(() => {
        console.log(this.see_YN);
      });
    },
    text_val() {
      this.slider_val = Number(this.text_val);
    },
    slider_val() {
      this.text_val = this.slider_val;
    },
    clickid() {
      // console.log(this.clickid,'clickid')
      // if(this.clickid !== '' || this.clickid !== undefined){
      //    this.basis.updateObjectName(this.name_basis,this.clickid);
      // }
    },
    labelname() {
      // console.log(this.labelname);
      this.name_basis = this.labelname;
    },
    delettreeLIDs() {
      // console.log(this.delettreeLIDs);
      // this.posiX = this.basis.updatePositionX(this.delettreeLIDs);
      // this.posiY = this.basis.updatePositionY(this.delettreeLIDs);
      // this.posiZ = this.basis.updatePositionZ(this.delettreeLIDs);
      // this.xuanY = this.basis.updateRotaitonY(this.delettreeLIDs);
    },
    treeclicknode() {
      // console.log(this.treeclicknode.data.machineBelondName);
      if (this.treeclicknode.level > 1 && this.treeclicknode.parent !== null) {
        // 获取 点击 父级id
        console.log(this.treeclicknode);
        if (!this.treeclicknode.data.children) {
          this.parent = this.treeclicknode.parent;
          this.chidren_JT = true;
          this.jitaiBang = this.treeclicknode.data.machineBelondName;
          this.clicklevel = this.treeclicknode.level;
          for (
            var i = 0;
            i < this.treeclicknode.parent.childNodes.length;
            i++
          ) {
            //label
            if (
              this.treeclicknode.parent.childNodes[i].label ==
              this.treeclicknode.label
            ) {
              this.childindex = i;
            }
          }
        } else {
          this.chidren_JT = false;
        }
      } else {
        this.chidren_JT = false;
      }
    }
  },
  methods: {
    shifoukejian(val) {
      if (val == true) {
        $("#seeChoose").prop("checked", true);
      } else if (val == false) {
        $("#seeChoose").prop("checked", false);
      }
    },
    kejian() {
      var checked = $("#seeChoose").prop("checked");
      console.log(this.delettreeLIDs);
      if (checked == true) {
        //选中
        this.basis.setVisible(checked, this.delettreeLIDs);
      } else if (checked == false) {
        this.basis.setVisible(checked, this.delettreeLIDs);
      }
    },
    jitai_bang(val, key) {
      //机台绑定点击触发
      if (val !== "") {
        // console.log(this.parent,this.childindex,this.clicklevel,val);
        this.basis.changeMachineID(
          this.parent,
          this.childindex,
          this.clicklevel,
          val
        );
      }
    },
    XYZX(posi, W) {
      //调用3D渲染的XYZ 输入框值改变
      console.log(this.delettreeLIDs);
      if (W == "x") {
        this.basis.updatePositionX("positionX", this.delettreeLIDs);
      }
      if (W == "y") {
        this.basis.updatePositionY("positionY", this.delettreeLIDs);
      }
      if (W == "z") {
        this.basis.updatePositionZ("positionZ", this.delettreeLIDs);
      }
      if (W == "xY") {
        this.basis.updateRotaitonY("roationY", this.delettreeLIDs);
      }
      if (W == "name") {
        console.log(this.clickid);
        setTimeout(() => {
          this.$nextTick(() => {
            if (this.clickid !== "" && this.clickid !== undefined) {
              console.log(this.clickid);
              $("#name_basis").blur();
              this.basis.updateObjectName(this.name_basis, this.clickid);
            }
          });
        });
      }
    },
    basistwoinput(val) {
      // console.log(val);
      var positionY = document.getElementById("positionY");
      if (val == "Camera") {
        $("#positionY").css({"background": "rgba(39, 39, 39, 1)"},{"color":"#ffffff"});
        positionY.removeAttribute("disabled");
        this.moduleposiX = true;
      } else {
        $("#positionY").css({"background":"#707070"},{"color":"#707070"});
        positionY.setAttribute("disabled", "disabled");
        this.moduleposiX = false;
      }
    },
    noneclick(){
      $("#positionY").css("border","1px solid #707070!important");
    }
  },
  mounted: function() {
    // console.log(this.markbasis);
    this.basistwoinput("Camera");
    this.$nextTick(() => {
      this.shifoukejian(this.see_YN);
    });
    this.name_basis = this.labelname;
    setTimeout(() => {
      this.$nextTick(() => {
        if (this.clickid !== "" && this.clickid !== undefined) {
          // console.log(this.clickid);
          this.basis.updateObjectName(this.name_basis, this.clickid);
        }
      });
    }, 50);
  }
};
</script>
<style lang="less" scoped>
.basis {
  .CPr_contDiv_li {
    width: 100%;
    padding-bottom: 12px;
    padding-left: 10px;
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
    .lip_con {
      width: 100%;
      height: 36px;
      line-height: 36px;
      font-size: 12px;
      overflow:hidden span:nth-child(1) {
        margin-right: 0px;
      }
      input {
        width: 52px;
        height: 22px;
        margin-left: 9px;
        margin-right: 7px;
        padding-left: 4px;
        background: rgba(39, 39, 39, 1);
        border-radius: 3px;
        border: none;
        box-sizing: border-box;
        color: #fff;
        overflow: hidden;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input:focus {
        outline: none;
        border: 1px solid #0096ff;
      }
    }
    .xuanzhuan {
      span {
        input {
          margin-left: 17px !important;
        }
      }
    }
    .li_name {
      span {
        font-size: 14px;
      }
      #name_basis {
        width: 100px;
        margin-left: 24px;
      }
      #jitai_bang {
        width: 120px;
      }
    }
    .CPr_lip_concheck {
      position: relative;
      height: 33px;
      line-height: 33px;
      input[type="checkbox"] {
        position: absolute;
        left: 56px;
        top: 8px;
        width: 15px;
        height: 15px;
        opacity: 0;
        z-index: 2;
      }
      label {
        position: absolute;
        left: 56px;
        top: 8px;
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
</style>