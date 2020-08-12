<template>
    <div class="camera">
        <li class="CPr_contDiv_li li_three">
            <p class="CPr_lip_tit">
                <span>相机设置</span>
            </p>
            <p class="CPr_lip_Light lip_con">
                <span>视场角</span>
                <el-slider v-model="viewAngle" :show-tooltip="false" @input="viewA(tvalA)"></el-slider>
                <input type="text" max="180" v-model="tvalA" id="shichangjiao" @change="viewA(tvalA)">
            </p>
            <p class="CPr_lip_Light lip_con">
                <span>远视距</span>
                <el-slider v-model="FHorizon" :show-tooltip="false" :min="10000000" :max="20000000" :step="100" @input="FHori(FHorizon)"></el-slider>
                <input type="text" v-model="tvalF" min="10000000" max="20000000" id="yuanshiju" @change="FHori(tvalF)">
            </p>
            <p class="CPr_lip_Light lip_con">
                <span>近视距</span>
                <el-slider v-model="NStadia" :show-tooltip="false" @input="NStadi(NStadia)"></el-slider>
                <input type="text" v-model="tvalN" id="jinshiju" @change="NStadi(tvalN)">
            </p>
        </li>
    </div>
</template>
<script>
import $ from 'jquery';
// import { webEdior } from '../../static/js/webEdior.js'
    export default {
        name:"camera",
        props:["camera"],
        data(){
            return{
                tvalA:79,//输入框滑块   视场角
                viewAngle: 79,//滑块   视场角
                tvalF:50,//输入框滑块   远视距
                FHorizon: 50,//滑块   远视距
                tvalN:50,//输入框滑块   近视距
                NStadia: 50,//滑块   近视距
                webEdior:{},
            }
        },
        watch:{
            tvalA(){
                this.viewAngle = Number(this.tvalA);
            },
            viewAngle(){
                this.tvalA = this.viewAngle;
            },
            tvalF(){
                this.FHorizon = Number(this.tvalF);
            },
            FHorizon(){
                this.tvalF = this.FHorizon;
            },
            tvalN(){
                this.NStadia = Number(this.tvalN);
            },
            NStadia(){
                this.tvalN = this.NStadia;
            }
        },
        methods:{
            viewA(val){
                this.camera.updateCameraFOV("shichangjiao");
            },
            FHori(val){
                this.camera.updateCameraNear("yuanshiju");
            },
            NStadi(val){
                this.camera.updateCameraFar("jinshiju");
            },
            formatTooltip(val) {//滑块
                return val / 100;
            },
        },
        mounted:function(){
            // this.webEdior = webEdior();
            // console.log(this.camera)
        }
    }
</script>
<style lang="less" scoped>
.camera{
    .CPr_contDiv_li{
        width: 100%;
        min-width: 336px;
        padding-bottom: 12px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        color: #fff;
        .CPr_lip_tit{
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 14px;
            img{
                margin-top: -2px;
            }
        }
        .lip_con{
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 12px;
            span:nth-child(1){
                margin-right: 4px;
            }
            input[type=text]{
                width:42px;
                height:22px;
                margin-left: 8px;
                background:rgba(39,39,39,1);
                border-radius:3px;
                box-sizing: border-box;
                border: none;
                text-align-last:center;
            }
            input:focus{
                outline:none;
                border: 1px solid #0096ff;
            }
            .el-slider{
                margin-left: 10px;
                width: 60%;
            }
        }
        .CPr_lip_Light{
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 12px;
            span:nth-child(1){
                margin-right: 4px;
            }
        }
        
    }
}
</style>