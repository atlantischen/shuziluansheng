<template>
    <div class="StatuSetting">
        <li class="CPr_contDiv_li">
            <p class="CPr_lip_tit">
                <span>状态设置</span>
            </p>
        </li>
        <ul class="setting_list">
            <p>
                <span>是否启用</span>
                <span>状态名称</span>
                <span>状态值</span>
                <span>颜色值</span>
            </p>
            <li class="boxList" v-for="(item, key) in statuList" :key="key" @click="delsave(key)">
                <span>
                    <input class="checkbox" :value="item.isUse" @click="allCheck($event)" type="checkbox" checked="checked" @change="clickUse(key)">
                    <label></label>
                </span>
                <span>
                    <input class="textchang" :iid="item.id" type="text" v-model="item.name" @keyup.enter="namechange(key,item.name,item.id)">
                </span>
                <span>
                    <input class="textvalchang" :statevla="item.value" type="text" v-model="item.value" @keyup.enter="valuechange(key,item.value,item.id)">
                </span>
                <span class="CPr_lip_color">
                    <!-- <input type="color" id="myColor" v-model="item.colorInput"  placeholder="" @change="Color(key,item.colorInput)" /> -->
                    <el-color-picker v-model="item.colorInput" @change="Color(key,item.colorInput)" @active-change="accolor"></el-color-picker>
                </span>
            </li>
        </ul>
        <div class="btn_ds">
            <button @click="add()">添加</button>
            <button @click="del()">删除</button>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import { colorRgb } from '../../static/js/utils'
import { colorHex } from '../../static/js/utils'
// import '@/assets/css/jquery.minicolors.css';
// import '@/assets/js/jquery.minicolors.js';
    export default {
        name:"StatuSetting",
        props:["showSetData"],
        data(){
            return{
                statuList:[
                    // {isUse:true,name:"警报",color:"#20a181",id:""},
                    // {isUse:true,name:"未开机",color:"#eb3d9d",id:""},
                    // {isUse:true,name:"待机",color:"#666ad6",id:""},
                ],
                delKey:1,
                colorchangeV:'',
                colorchangeC:'',
            }
        },
        watch:{
            showSetData () {
                if (this.showSetData) {
                    let newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                    // console.log(newSceneData, 'newSceneData');
                    if (newSceneData) {
                        if(newSceneData.scene3D.sceneData.StateColor !== "" && newSceneData.scene3D.sceneData.StateColor !== undefined) {
                            // console.log("做判断");
                            this.statuList = newSceneData.scene3D.sceneData.StateColor;
                        }
                    }
                }
                // console.log(this.statuList);
            },
            colorchangeC : {
                handler(newName, oldName) {
                    this.$nextTick(()=> {
                        $(".el-color-dropdown__link-btn").css({background:this.colorchangeC})
                    })
                },
                // 开启深度监听
                deep: true
            }
        },
        methods:{
            allCheck (e) {// 全选
                // console.log($(e))
                // if (e.target.checked) {
                //     $('.AE_list .item-check').each(function(){
                //         $(this).attr('checked', true)
                //     })
                // } else {
                //     $('.AE_list .item-check').each(function(){
                //         $(this).attr('checked', false)

                //     })
                // }
            },
            delsave(key){//点击每一项
                // console.log(key);
                this.delKey = key;
                // $(".setting_list .boxList:eq("+key+")").addClass("liselect").siblings().removeClass("liselect");
                this.colorchangeV = this.statuList[key].colorInput;
                this.colorchangeC = this.statuList[key].color;
                if(key == 0){
                    $(".el-color-dropdown__link-btn span").text("#20A181");
                }else if(key == 1){
                    $(".el-color-dropdown__link-btn span").text("#EB3D9D");
                }else if(key == 2){
                    $(".el-color-dropdown__link-btn span").text("#666AD6");
                }
            },
            clickUse(key){//点击勾选是否启用
                var checked = $(".setting_list .boxList:eq("+key+") .checkbox").prop('checked');
                if(checked == true) {//选中
                    console.log(key);
                    this.statuList[key].isUse = true;
                }else if(checked == false){
                    this.statuList[key].isUse = false;
                }
                this.saveloaclStatus(this.statuList[key]);
            },
            namechange(key,val,id){//修改名称
                console.log(id);
                console.log(key,val);
                $(".setting_list .boxList:eq("+key+") .textchang").blur();
                this.statuList[key].name = val;
                this.saveloaclStatus(this.statuList[key]);
            },
            valuechange(key,val,id){//修改状态值
                console.log(id);
                console.log(key,val);
                $(".setting_list .boxList:eq("+key+") .textvalchang").blur();
                this.statuList[key].value = val;
                this.saveloaclStatus(this.statuList[key]);
            },
            add(){//添加一项
                let newidadd,idadd; 
                idadd = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                newidadd = (idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
                var data = {
                    isUse:true,
                    name:"警报",
                    color:"",//#20a181
                    id:newidadd,
                    value:"0"
                }
                // data = JSON.stringify(data);
                console.log(data);
                this.statuList.push(data);
                this.saveloaclStatus(data);
            },
            del(){//删除选中的一项
                console.log(this.delKey);
                this.statuList.splice(this.delKey,1);
                var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                if (newSceneData) {
                    if(newSceneData.scene3D.sceneData.StateColor !== "" || null|| undefined) {
                        newSceneData.scene3D.sceneData.StateColor.splice(this.delKey,1);
                    }
                }
                localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            },
            Color(key,val){
                // console.log(key,val, colorRgb(val));
                this.statuList[key].color = colorRgb(val);
                this.statuList[key].colorInput = val;
                this.saveloaclStatus(this.statuList[key]);
            },
            accolor(node){
                this.colorchangeV = colorHex(node);
                this.colorchangeC = node;
            },
            saveloaclStatus(data){
                // console.log(data.id);
                var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                if (newSceneData) {
                    if(newSceneData.scene3D.sceneData.StateColor !== "" && newSceneData.scene3D.sceneData.StateColor !== null) {
                        // console.log("做判断")
                        let key = -1;
                        for(var i=0;i<newSceneData.scene3D.sceneData.StateColor.length;i++){
                            if(newSceneData.scene3D.sceneData.StateColor[i].id == data.id){
                                // console.log(i);
                                key = i;
                                // console.log(key);
                            }
                        }
                        // console.log(key);
                        if(key > -1) {
                            newSceneData.scene3D.sceneData.StateColor.splice(key,1,data);
                        } else {
                            // console.log(newSceneData.scene3D.sceneData.StateColor);
                            newSceneData.scene3D.sceneData.StateColor.push(data);
                        }
                    }
                }
                localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            },
        },
        mounted:function(){
            // console.log(this.showSetData);
            if (this.showSetData) {
                let newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                // console.log(newSceneData, 'newSceneData');
                if (newSceneData) {
                    if(newSceneData.scene3D.sceneData.StateColor !== "" && newSceneData.scene3D.sceneData.StateColor !== undefined) {
                        // console.log("做判断");
                        this.statuList = newSceneData.scene3D.sceneData.StateColor;
                    }
                }
            }
            // this.statuList = this.statuLSList;
            // console.log(this.statuList);
            $(".el-color-dropdown__link-btn span").text("#20A181");
            $(".el-color-dropdown__btns .el-color-dropdown__btn span").text("OK");
            // var btndisable = document.getElementsByClassName("el-color-dropdown__link-btn");
            // btndisable.setAttribute("disabled", "disabled");
        }
    }
</script>
<style lang="less" scoped>
.StatuSetting{
    width: 100%;
    min-width: 366px;
    padding-bottom: 12px;
    padding-left: 10px;
    box-sizing: border-box;
    color: #fff;
    .CPr_contDiv_li{
        .CPr_lip_tit{
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            img{
                margin-top: -2px;
            }
        }
    }
    .setting_list{
        width:290px;
        // height:163px;
        padding-bottom: 10px;
        background:rgba(39,39,39,1);
        border-radius:2px;
        p,li{
            display: flex;
            width:290px;
            height: 36px;
            line-height: 39px;
            font-size: 12px;
            text-align: center;
            color: #ddd;
            // border: 1px solid red;
            span{
                width: 27%;
                input::-webkit-color-swatch-wrapper{
                    outline: none;
                }
            }
            span:nth-child(1){
                width: 30%;
            }
            span:nth-child(2){
                width: 30%;
                input{
                    width: 80px;
                    height: 20px;
                    background: none;
                    color: #fff;
                    text-align-last:center;
                    border: none;
                }
            }
            span:nth-child(3){
                width: 20%;
                input{
                    width: 30px;
                    height: 30px;
                    background: none;
                    color: #fff;
                    border: 0;
                    text-align-last:center;
                    outline:none;
                }
            }
            
        }
        li{
            position: relative;
            input[type="checkbox"] {
                position: absolute;
                left: 32px;
                top: 10px;
                width: 15px;
                height: 15px;
                opacity: 0;
                z-index: 2;
            }
            label {
                position: absolute;
                left: 32px;
                top: 10px;
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
        p{
            line-height: 46px;
        }
        .liselect{
            background: #7c6ddb;
        }
        // li:nth-child(2n){
        //     background: rgba(0,255,188,0.1);
        // }
        // li:nth-child(2n-1){
        //     background: rgba(0,255,188,0.2);
        // }
    }
    .btn_ds{
        width: 70%;
        margin-bottom: 15px;
        margin-top: 15px;
        margin-left: 168px;
        button{
            width:52px;
            height:22px;
            margin-right: 15px;
            background:rgba(112,112,112,1);
            border-radius:3px;
            text-align: center;
            color: #ffffff;
            font-size: 12px;
            border: none;
        }
        button:hover{
            background:linear-gradient(0deg,rgba(3,131,245,1),rgba(13,248,247,1));
        }
    }
}
</style>
<style lang="less">
.StatuSetting{
    .minicolors-theme-bootstrap .minicolors-swatch{
        top: 5px;
        left: 19px;
    }
    .minicolors-theme-bootstrap .minicolors-input{
        padding-left: 5px;
    }
    .minicolors-position-left .minicolors-panel{
        left: -20px;
    }
    .CPr_lip_color {
      position: relative;
      .el-color-picker {
        top: 6px;
        left: 0px;
        height: 22px;
        .el-color-picker__trigger {
            position: relative;
            width: 34px;
            height: 22px;
            padding: 0;
            background: #504f4f;
            //   border: 1px solid #000000;
            border: none;
            border-radius: 0;
            .el-color-picker__color {
                border: none;
            }
            .el-color-picker__icon {
                position: absolute;
                top: 17px;
                left: 27px;
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
    
    // .el-color-dropdown__link-btn span{
    //     display: inline-block;
    //     width: 100%;
    //     height: 100%;
    // }
    .el-button--mini, .el-button--mini.is-round{
        padding: 0;
    }
}
</style>