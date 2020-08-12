<template>
    <div class="convention-drag" v-if="convention_sh">
        <div class="box convention popup-box" data-drag="true" @click="boxZindex" :style="{'z-index': Zindex}">
            <h1 class="b_title darg-title">
                <p class="tit_left">常规</p>
                <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
                    <img src="../../static/img/N-dele.png" v-if="bselected">
                    <img src="../../static/img/N-d-select.png" v-else @click="noneother()">
                </p>
            </h1>
            <div class="d_conten">
                <p>
                    <span>网格:</span>
                    <input type="checkbox" checked="checked" name="" id="CGrid" @click="checkboxFn('CGrid')">
                    <label></label>
                </p>
                <p>
                    <span>相机：</span>
                    <input type="checkbox" checked="checked" name="" id="CCamera" @click="checkboxFn('CCamera')">
                    <label></label>
                </p>
                <p>
                    <span>灯光：</span>
                    <input type="checkbox" checked="checked" name="" id="CLight" @click="checkboxFn('CLight')">
                    <label></label>
                </p>
                <p>
                    <span>帧率：</span>
                    <input type="checkbox" checked="checked" name="" id="FrameRate" @click="checkboxFn('FrameRate')">
                    <label></label>
                </p>
                <p>
                    <span>坐标系：</span>
                    <input type="checkbox" checked="checked" name="" id="Coordinate" @click="checkboxFn('Coordinate')">
                    <label></label>
                </p>
            </div>
            <div class="d_foot_btn">
                <button class="btn_yes" @click="yes_save">关闭</button>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import drag from '../../static/js/drag'
    export default {
        name:'convention',
        props:[ "index","convention"],
        data(){
            return{
                Zindex:0,
                bselected : true,//图片选中的判断
                convention_sh:true,
            }
        },
        watch:{},
        methods:{
            noneother(){//点击X,隐藏整个弹框
                this.convention_sh = false;
                this.$emit('closepanel', "常规");
            },
            R_selectStyle(){// X 图片显示选中
                this.bselected = false;
            },
            R_outStyle(){// X 图片显示不选中
                this.bselected = true;
            },
            boxZindex () {//层级
                let arr = []
                $('.popup-box').each(function(item){
                    // console.log($(this).css('z-index'), "$(this).css('z-index')", $(this))
                    arr.push(Number($(this).css('z-index')))
                })
                // console.log(Math.max(...arr), 'this.Zindex1111')
                this.Zindex = Math.max(...arr)+1
                // console.log(this.Zindex, 'this.Zindex')
            },
            yes_save(){
                this.noneother();
            },
            checkboxFn(data){//单选框  点击事件
                if(data == "CGrid"){
                    var CGridV = $("#CGrid").prop('checked');
                    if(CGridV == true) {//选中
                        this.convention.helperControls("grid",true);
                    }else if(CGridV == false){
                        this.convention.helperControls("grid",false);
                    }
                }else if(data == "CCamera"){
                    var CCameraV = $("#CCamera").prop('checked');
                    if(CCameraV == true) {//选中
                        this.convention.helperControls("camera",true);
                    }else if(CCameraV == false){
                        this.convention.helperControls("camera",false);
                    }
                }else if(data == "CLight"){
                    var CLightV = $("#CLight").prop('checked');
                    if(CLightV == true) {//选中
                        this.convention.helperControls("light",true);
                    }else if(CLightV == false){
                        this.convention.helperControls("light",false);
                    }
                }else if(data == "FrameRate"){
                    var FrameRateV = $("#FrameRate").prop('checked');
                    if(FrameRateV == true) {//选中
                        this.convention.helperControls("state",true);
                    }else if(FrameRateV == false){
                        this.convention.helperControls("state",false);
                    }
                }else if(data == "Coordinate"){
                    var CoordinateV = $("#Coordinate").prop('checked');
                    if(CoordinateV == true) {//选中
                        this.convention.helperControls("axis",true);
                    }else if(CoordinateV == false){
                        this.convention.helperControls("axis",false);
                    }
                }
                
            },
        },
        mounted:function(){
            drag('convention-drag', '')
            this.Zindex = this.index;
        }
    }
</script>
<style lang="less" scoped>
.box {
    position: absolute;
}
.convention{
    position: absolute;
    top: calc(50% - 140px);
    left: calc(50% - 280px);
    width: 558px;
    min-width:558px;
    height: 280px;
    min-height: 280px;
    background: #535353;
    overflow: hidden;
    border-radius:6px;
    .b_title{
        display: flex;
        width:558px;
        height:48px;
        background:rgba(194,194,194,1);
        line-height: 48px;
        color: #333333;
        font-size:20px;
        .tit_left{
            width: 96%;
            height: 100%;
            margin-left: 40px;
            font-weight: 500;
        }
        .tit_right{
            width: 10%;
            height: 100%;
            margin-right: 10px;
            margin-top: -2px;
            text-align: right;
            img{
                width: 18px;
                height: 18px;
            }
        }
    }
    .d_conten{
        width: 93%;
        height: 127px;
        padding-left: 40px;
        padding-top: 18px;
        font-size:16px;
        border-bottom: 1px solid #6E6F70;
        color:rgba(255,255,255,1);
        p{
            position: relative;
            display: inline-block;
            margin: 0;
            margin-right: 20px;
            width: 18%;
            height: 53px;
            line-height: 53px;
            input[type=checkbox]{
                position: absolute;
                left: 66px;
                top: 19px;
                width: 15px;
                height: 15px;
                opacity: 0;
                z-index: 2;
            }
            label{
                position: absolute;
                left: 66px;
                top: 19px;
                width: 15px;
                height: 15px;
                border-radius: 3px;
                border: 1px solid #999;
            }
            input:checked + label {
                background-color: #00A4FF;
                border: 1px solid #00A4FF;
            }
            input:checked+label::after {
                position: absolute;
                content:  "";
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
    .d_foot_btn{
        width: 100%;
        height: 85px;
        line-height: 85px;
        button{
            width:120px;
            height:34px;
            line-height: 34px;
            margin-left: 414px;
            background:rgba(56,56,56,1);
            border: none;
            border-radius:6px;
            font-size:16px;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
        button:hover,.b_select{
            background:linear-gradient(0deg,rgba(3,131,245,1),rgba(13,248,247,1));
        }
    }
    .inputclick{
        border: 1px solid #00A4FF!important;
    }
}
</style>