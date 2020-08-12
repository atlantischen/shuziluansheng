<template>
    <div class="chartsEditor">
        <div class="borderBottom">
            <div class="EE_basiss">
                <div class="EE_appearance">
                    <p class="EE_tit EE_tit_appea">
                        <span>外观</span>
                        <span>
                            <span>层级 :</span>
                            <select v-model="layerItem" @change="layerFn()" class="layerZindex">
                                <option :value="item" v-for="(item, key) in layerList" :key="key">{{item}}</option>
                            </select>
                        </span>
                    </p>
                    <img :src="['./static/img/'+ appearanceSrc +'.png']" alt="柱状图"/>
                </div>
                <div class="EE_colorfunc">
                    <span class="EE_tit">配色方案</span>
                    <span class="EE_CCcolorprise" @click="EEspan">
                        <img :src="colorKind.src">
                    </span>
                    <input type="text" id="EE_box_input"  @blur="boxInput">
                    <div class="EE_box s0">
                        <p class="EE_box_tit">选择配色</p>
                        <p class="EE_box_Find" v-for="(sty , index) in colorstyle" :key="index" @click="colorstyleFn(index, sty.name)">
                            <span :class="[ colorKind.name == sty.name ? 'active' : '', 'EE_box_uck']" ></span>
                            <span class="EE_box_f"><img :src="sty.src"></span>
                        </p>
                    </div>
                </div>
                <div class="EE_tittext">
                    <p class="EE_tit">标题</p>
                    <p>
                        <textarea rows="3" cols="20" type="text" class="textarea" v-model="echarts_tit" @click="addborder" @keyup.enter="submit()" @blur="submit()"></textarea>
                    </p>
                </div>
                <div class="EE_font_style">
                    <p class="EE_fontFamily">
                        <span>字体</span>
                        <select v-model="fontFamilyItem" @change="fontFamilyFn()" class="selectFamily">
                            <option :value="item" v-for="(item, key) in fontFamilyList" :key="key">{{item}}</option>
                        </select>
                    </p>
                    <p class="EE_fontSize">
                        <span>字体大小</span>
                        <select v-model="fontSizeItem" @change="fontSizeFn(fontSizeItem)" class="selectSize">
                            <option :value="item" v-for="(item, key) in fontSizeList" :key="key">{{item}}</option>
                        </select>
                    </p>
                    <p class="EE_fontColor">
                        <span>字体颜色</span>
                        <span class="colorbox"></span>
                        <el-color-picker v-model="color" @change="ccolor" @active-change="accolor"></el-color-picker>
                    </p>
                    <p class="EE_showAxial">
                        <span>显示轴向</span>
                        <input type="checkbox" checked="checked" name="" id="showAxial" @click="showAxialFn()">
                        <label></label>
                    </p>
                    <!-- <p class="EE_tit">文字大小</p>
                    <p class="EE_Fsider">
                        <span>A</span>
                        <el-slider v-model="slider_val" ></el-slider>
                        <span>A</span>
                    </p> -->
                </div>
                
            </div>
        </div>
        <div class="borderBottom">
            <div class="EE_location">
                <p class="EE_tit">位置和尺寸</p>
                <p class="EE_locaAxis">
                    <span>位置X轴</span><input type="text" class="Xaxis" v-model="Xaxis" @keyup.enter="Xaxisfn()" @blur="Xaxisfn()">
                    <span>位置Y轴</span><input type="text" class="Yaxis" v-model="Yaxis" @keyup.enter="Yaxisfn()" @blur="Yaxisfn()">
                </p>
                <p class="EE_locaAxis">
                    <span>大小X轴</span><input type="number" class="Wkuan" v-model="Wkuan" @keyup.enter="Wkuanfn()" @blur="Wkuanfn()">
                    <span>大小Y轴</span><input type="number" class="Hgao" v-model="Hgao" @keyup.enter="Hgaofn(Hgao)" @blur="Hgaofn(Hgao)">
                </p>
            </div>
        </div>
        <div class="borderBottom">
            <div class="EE_style">
                <div class="EE_ds_show">
                    <p class="EE_tit">数据显示风格</p>
                    <p class="EE_ds_show_p">
                        <span class="bgse" v-for="(sty , index) in stylelist" :key="index" @click="stylecharts(sty)">{{sty}}</span>
                    </p>
                </div>
                <div class="EE_transpa">
                    <p class="EE_tit">透明度</p>
                    <p>
                        <el-slider v-model="slider_valcolor" :step="1" :min="0" :max="100" @change="coloropacity(slider_valcolor )"></el-slider>
                        <input type="number" name="" id="" readonly="readonly" v-model="slider_valcolor">
                    </p>
                </div>
            </div>
        </div>
        <div class="borderBottom">
            <div class="EE_data">
                <p class="EE_tit">静态数据</p>
                <p class="EE_data_item">
                    <span>数据项</span>
                    <select v-model="selectItem" @change="selectFn()" class="selectla">
                        <option :value="item" v-for="(item, key) in dataitemList" :key="key">{{item}}</option>
                    </select>
                </p>
                <p class="EE_kindList">
                    <span>机器类型</span>
                    <select v-model="machineItem" @change="machineFn()" class="selectla">
                        <option :value="item" v-for="(item, key) in machineList" :key="key">{{item}}</option>
                    </select>
                </p>
                
            </div>
        </div>
        
        <!-- <div class="EE_btn">
            <button class="EE_btn_delete" @click="deleEch()">删 除</button>
            <button class="EE_btn_save" @click="saveEch()">保 存</button>
        </div> -->
    </div>
</template>
<script>
import $ from 'jquery';
// import { Message } from 'element-ui';
// import api from '../../static/api/api.js'
    export default {
        name:'chartsEditor',
        props:['echartsData', 'echartsKey'],//
        data(){
            return{
                color: '#504F4F',//字体颜色,确认的颜色
                colorchange:'',//字体颜色,切换时的颜色
                fontSizeItem:'12',//字体大小
                fontSizeList:["9",'10','11',"12",'13',"14"],
                fontFamilyItem:'微软雅黑',
                fontFamilyList:["微软雅黑","微软雅黑1","微软雅黑2"],
                httpdata:'',
                layerList:[1,2,3,4,5,6,7,8],
                layerItem:1,
                machineItem:"卷烟机产量",
                machineList:["卷烟机产量","包装机辅机产量","包装机主机产量"],
                appearanceSrc:"E_bar-1",
                echarts_tit:"",//echarts的标题
                // slider_val:12,//进度条，文字大小
                slider_valcolor:20,//进度条，透明度
                stylelist:["默认","强调","简洁"],
                colorlist:["纯色","纯色渐变","双色渐变"],
                selectItem:"产量",
                dataitemList:["产量"],
                // checkbox_name:[
                //     {mcid:"1_1_卷烟机",vrkey:"",sckey:""},
                //     {mcid:"1_2_卷烟机",vrkey:"",sckey:""},
                // ],
                echartsDatas:'',//接收data值
                Xaxis:"",//X轴
                Yaxis:"",//Y轴
                Wkuan:"348",//宽
                Hgao:"186",//高
                echartsYpye:"",
                colorstyle:[
                    {name:"colorPiece",src:"./static/img/colorPiece.png"},
                    {name:"colorPiece1",src:"./static/img/colorPiece1.png"},
                    {name:"colorPiece2",src:"./static/img/colorPiece2.png"},
                ],
                colorKind:{
                    name:"colorPiece",
                    src:"./static/img/colorPiece.png"
                },
                panelshu:'',
            }
        },
        watch:{
            Xaxis(){
                // console.log(this.Xaxis);
            },
            Yaxis(){
                // console.log(this.Yaxis);
            },
            colorchange(){
                $(".el-color-dropdown__link-btn").css({background:this.colorchange}) 
            },
            // echartsData: {
            //     // 数据变化时执行的逻辑代码
            //     handler(newName, oldName) {
            //         console.log(this.echartsData, 'this.echartsDatathis.echartsDatathis.echartsData')
            //         if(this.echartsDatas !== "" && this.echartsDatas.miniAttribute){
            //             this.adapterfn(this.echartsDatas.miniAttribute);
            //             this.echartsYpye = this.echartsDatas.miniAttribute.chartsKind;
            //         }
            //     },
            //     // 开启深度监听
            //     deep: true
            // },
            echartsData(){
                console.log(this.echartsData, '11111111');
                this.echartsDatas = this.echartsData;
                if(this.echartsDatas !== "" && this.echartsDatas.miniAttribute !== ""){
                    console.log(this.echartsDatas.miniAttribute);
                    this.Xaxis = this.echartsDatas.miniAttribute.position.x;
                    this.Yaxis = this.echartsDatas.miniAttribute.position.y;
                    this.Wkuan = this.echartsDatas.miniAttribute.size.x;
                    this.Hgao = this.echartsDatas.miniAttribute.size.y;
                    let adapterfnData = this.echartsDatas.miniAttribute;
                    this.adapterfn(adapterfnData);
                    this.echartsYpye = this.echartsDatas.miniAttribute.chartsKind;
                }
                
            },
            echartsKey(){
                // console.log(this.echartsKey);
            }
        },
        methods:{
            showAxialFn(){//是否显示轴向
                var checked = $("#showAxial").prop('checked');
                if(checked == true) {//选中
                }else if(checked == false){
                }
            },
            selectFn(){},
            machineFn(){},
            ccolor(node){//字体颜色修改 点击确认的颜色
                 console.log(this.color, 'color');
                // console.log(node);
            },
            accolor(node){//字体颜色修改 切换时的颜色
                // console.log(node);
                //  console.log(this.color);
                this.colorchange = node;
            },
            fontFamilyFn(){//字体 例微软雅黑

            },
            fontSizeFn(){//文字大小
                this.$emit('intensity', this.fontSizeItem);
                this.echartsDatas.miniAttribute.fontSize = this.fontSizeItem;
                this.saveEch();
            },
            deleEch(){//删除当前
                // console.log(this.echartsKey);
                this.$emit('deleEch_fn', this.echartsKey);
            },
            saveEch(){//保存当前
                let arr = [];
                $('.EE_data_listD input[type=checkbox]').each(function(){
                    var checked = $(this).prop('checked');
                    if(checked) {
                        let obj = {
                            mcid:$(this).attr('mcid'),
                            name: $(this).attr('name'),
                            vrkey:  $(this).attr('vrkey'),
                            sckey:$(this).attr('sckey')
                        }
                        arr.push(obj);
                    }
                });
                this.echartsDatas.miniAttribute.datapoint = arr;
                console.log(this.echartsDatas);
                let chuanE = {
                    key:this.echartsKey,
                    data:this.echartsDatas
                }
                console.log(chuanE);
                this.$emit('saveEch_fn',chuanE);
            },
            layerFn(){//layer
                console.log(this.layerItem);
                this.echartsDatas.layer = this.layerItem;
                // $(".EE_basiss .EE_tit_appea .layerZindex").addClass("inputsel");
            },
            colorstyleFn(key, data,type){//切换配色方案
                console.log(key);
                // if(type == true){
                //     console.log(true);
                    this.echartsDatas.miniAttribute.stylePlan = key;
                //     this.colorKind.name = data;
                //     this.colorKind.src = './static/img/'+ data +'.png';
                //     this.saveEch();
                // } else{
                    console.log(false);
                    this.$emit('colorKind', key);
                    this.colorKind.name = data;
                    this.colorKind.src = './static/img/'+ data +'.png';
                    this.saveEch();
                    $(".EE_CCcolorprise").removeClass("inputsel");
                // }
            },
            
            coloropacity(val){//进度条，透明度
                // console.log(val);
                this.$emit('coloropacity', val);
                this.echartsDatas.miniAttribute.opacity = val;
                this.saveEch();
            },
            stylecharts(item, type){//点击切换风格，eg：默认，强调，简洁
                // console.log(item);
                // if(type == true){
                    this.echartsDatas.miniAttribute.colorStyle = item;
                // }
                if(item == "默认"){
                    $(".EE_ds_show_p span:eq(0)").removeClass("bgse").addClass("bg_select");
                    $(".EE_ds_show_p span:eq(0)").siblings().removeClass("bg_select").addClass("bgse");
                    if(!type) {
                        this.$emit('stylecharts', "默认");
                        this.saveEch();
                    }
                }else if(item == "强调"){
                    $(".EE_ds_show_p span:eq(1)").removeClass("bgse").addClass("bg_select");
                    $(".EE_ds_show_p span:eq(1)").siblings().removeClass("bg_select").addClass("bgse");
                    if(!type) {
                        this.$emit('stylecharts', "强调");
                        this.saveEch();
                    }
                }else if(item == "简洁"){
                    $(".EE_ds_show_p span:eq(2)").removeClass("bgse").addClass("bg_select");
                    $(".EE_ds_show_p span:eq(2)").siblings().removeClass("bg_select").addClass("bgse");
                    if(!type) {
                        this.$emit('stylecharts', "简洁");
                        this.saveEch();
                    }
                }  
            },
            // colorcharts(item,type){//点击切换颜色，eg：纯色，纯色渐变，双色渐变
            //     // console.log(item);
            //     if(type == true){
            //         this.echartsDatas.miniAttribute.dataStyple = item;
            //     }else if(!type) {
            //         this.saveEch();
            //     }
            //     if(item == "纯色"){
            //         $(".EE_style .EE_shadowList span:eq(0)").removeClass("shadow_sel").addClass("shadow_select");
            //         $(".EE_style .EE_shadowList span:eq(0)").siblings().removeClass("shadow_select").addClass("shadow_sel");
            //     }else if(item == "纯色渐变"){
            //         $(".EE_style .EE_shadowList span:eq(1)").removeClass("shadow_sel").addClass("shadow_select");
            //         $(".EE_style .EE_shadowList span:eq(1)").siblings().removeClass("shadow_select").addClass("shadow_sel");
            //     }else if(item == "双色渐变"){
            //         $(".EE_style .EE_shadowList span:eq(2)").removeClass("shadow_sel").addClass("shadow_select");
            //         $(".EE_style .EE_shadowList span:eq(2)").siblings().removeClass("shadow_select").addClass("shadow_sel");
            //     }
            // },
            adapterfn(data){//渲染配置项的每一项的方法
                console.log(data, 'datadata');
                // console.log(data.stylePlan, 'data.stylePlandata.stylePlandata.stylePlan')
                try {
                if(data.chartsKind == "柱状图"){
                    this.appearanceSrc = "E_bar-1";
                }else if(data.chartsKind == "折线图"){
                    this.appearanceSrc = "line_style";
                }else if(data.chartsKind == "饼状图"){
                    this.appearanceSrc = "ping-ring";
                }
                // console.log(data.size)
                this.echarts_tit = data.panelTitle;
                this.fontSizeItem = data.fontSize;
                this.stylecharts(data.colorStyle, true);
                this.Xaxis = data.position.x;
                this.Yaxis = data.position.y;
                this.Wkuan = data.size.x;
                this.Hgao = data.size.y;
                // this.colorcharts(data.dataStyple, true);
                this.slider_valcolor = data.opacity;
                if(data.stylePlan == "0"){
                    this.colorstyleFn(0, "colorPiece",true);
                }else if(data.stylePlan == "1"){
                    this.colorstyleFn(1, "colorPiece1",true);
                }else if(data.stylePlan == "2"){
                    this.colorstyleFn(2, "colorPiece2",true);
                }
                this.machineItem = data.machineTpye;
                } catch (res)  {
                }
            },
            submit(){
                this.$emit('titleCharts', this.echarts_tit);
                $(".textarea").blur();
                this.echartsDatas.miniAttribute.panelTitle = this.echarts_tit;
                this.saveEch();
                $(".EE_tittext p textarea").removeClass("inputsel");
            },
            addborder(){
                $(".EE_tittext p textarea").addClass("inputsel");
            },
            Xaxisfn(){
                this.$emit('Xaxis', this.Xaxis);
                $(".Xaxis").blur();
                this.echartsDatas.miniAttribute.position.x = this.Xaxis;
                this.saveEch();
            },
            Yaxisfn(){
                this.$emit('Yaxis', this.Yaxis);
                $(".Yaxis").blur();
                this.echartsDatas.miniAttribute.position.y = this.Yaxis;
                this.saveEch();
            },
            Wkuanfn(){
                this.$emit('Wkuan', this.Wkuan);
                $(".Wkuan").blur();
                this.echartsDatas.miniAttribute.size.x = this.Wkuan;
                this.saveEch();
            },
            Hgaofn(val){
                // console.log(val);
                // if(val<168) val = 168;
                this.$emit('Hgao', this.Hgao);
                $("this").blur();
                this.echartsDatas.miniAttribute.size.y = this.Hgao;
                this.saveEch();
            },
            EEspan () {
                $('.EE_box').addClass('s1').removeClass('s0')
                $('#EE_box_input').focus();
                $(".EE_CCcolorprise").addClass("inputsel");
            },
            boxInput () {
                // console.log(11111)
                setTimeout(()=>{
                    $('.EE_box').addClass('s0').removeClass('s1');
                }, 100)
            }
        },
        mounted:function(){
            // setInterval(() => {
            //     console.log(this.echartsData, 'echartsDataechartsData')
            // }, 1000);
            // setTimeout(() => {
                // console.log(this.echartsData);
                
            //     if(this.echartsDatas !== "" && this.echartsDatas.miniAttribute){
            //         this.echarts_tit = this.echartsData.miniAttribute.panelTitle;
            //     }
            // }, 50);
            // console.log(this.echartsKey);
            let gbdefultdata = {};
            this.$http("./static/api/api.json",gbdefultdata, 'get').then((data) => {// 请求本地，背景名称
                this.httpdata = data.baseroot;
                // console.log(this.httpdata);
                let shudata = {}// 请求参数
                this.$http(this.httpdata.DataitemFileManagementService+'/DataitemFile-Management-Service/getDataitemSettings/test/ReportItem',shudata, 'get').then((res) => {// 请求默认属性值
                    this.panelshu = JSON.parse(res.data);
                }).catch((res)=>{});
            }).catch((res)=>{});
            $(".EE_ds_show_p span:eq(0)").removeClass("bgse").addClass("bg_select");
            // $(".EE_style .EE_shadowList span:eq(0)").removeClass("shadow_sel").addClass("shadow_select");
            this.echartsDatas = this.echartsData;
            if (this.echartsData) {
                this.echartsDatas = this.echartsData;
            } else {
                this.echartsDatas = {
                    datapoint: {} 
                }
            }
            $(".el-color-dropdown__link-btn span").text("rgb(80,79,79)");
            $(".el-color-dropdown__btn span").text("OK");
            if(this.echartsDatas !== "" && this.echartsDatas.miniAttribute !== ""){
                console.log(this.echartsDatas.miniAttribute);
                this.Xaxis = this.echartsDatas.miniAttribute.position.x;
                this.Yaxis = this.echartsDatas.miniAttribute.position.y;
                this.Wkuan = this.echartsDatas.miniAttribute.size.x;
                this.Hgao = this.echartsDatas.miniAttribute.size.y;
                let adapterfnData = this.echartsDatas.miniAttribute;
                this.adapterfn(adapterfnData);
                this.echartsYpye = this.echartsDatas.miniAttribute.chartsKind;
                console.log(this.Xaxis);
            }

            $eventBus.$on('echartsDatasUpdata', (data)=>{
                this.echartsDatas = data;
                console.log(data);
                if(this.echartsDatas !== "" && this.echartsDatas.miniAttribute !== ""){
                    //  this.$message({
                    //     message: data.miniAttribute.size.y
                    //     });
                    // console.log(this.echartsDatas.miniAttribute);
                    this.Xaxis = this.echartsDatas.miniAttribute.position.x;
                    this.Yaxis = this.echartsDatas.miniAttribute.position.y;
                    this.Wkuan = this.echartsDatas.miniAttribute.size.x;
                    this.Hgao = this.echartsDatas.miniAttribute.size.y;
                    let adapterfnData = this.echartsDatas.miniAttribute;
                    // console.log(adapterfnData, 'adapterfnDataadapterfnDataadapterfnDataadapterfnData')
                    this.adapterfn(adapterfnData);
                    this.echartsYpye = this.echartsDatas.miniAttribute.chartsKind;
                }
            })
        }
    }
</script>
<style lang="less" scoped>
.chartsEditor{
    width: 100%;
    height: 100%;
    min-width: 326px;
    background-color: #383838;
    overflow: hidden;
    box-sizing: border-box;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width: 3px;
        /*滚动条宽度*/
        height: 6px;
        /*滚动条高度*/
        margin: 0;
        padding: 0;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
        border-radius: 2px;
        /*滚动条的背景区域的圆角*/
        background-color:#525050;
        /*滚动条的背景颜色*/
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
        width: 3px;
        /*滚动条宽度*/
        height: 26px;
        /*滚动条高度*/
        border-radius: 2px;
        /*滚动条的圆角*/
        box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
        background-color: #8C8C8C;
        /*滚动条的背景颜色*/
    }
    .borderBottom{
        width: 100%;
        border-bottom: 1px solid #000000;
    }
    .borderBottom:nth-child(4){
        border: none;
    }
    .EE_basiss,.EE_location,.EE_style,.EE_data,.EE_btn{
        width: 94%;
        margin-left: 3%;
        .EE_tit{
            // padding-top: 3px;
            color: #ffffff;
            font-size: 14px;
        }
        input[type=text],input[type=number]{
            width:68px;
            height:21px;
            padding-left: 5px;
            background:rgba(39,39,39,1);
            border-radius:2px;
            border: none;
            box-sizing: border-box;
            overflow: hidden;
        }
        input[type=number] {
            -moz-appearance:textfield;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        select,p select{
            padding-left: 10px;
            background:rgba(39,39,39,1);
            border-radius:2px;
            border: none;
            color: #ffffff;
            option{
                height: 30px;
                line-height: 30px;
                background: #C2C2C2;
                color: #333333;
            }
        }
        input:focus{
            outline:none;
            border: 1px solid #0096ff;
        }
        select:focus{
            option{
                outline:none;
                // background: #00A4FF;
                background: #C2C2C2;
            }
            
            // border: 1px solid #0096ff;
            
        }
    }
    .EE_basiss{
        height: 42%;
        min-height: 406px;
        .EE_appearance{
            width: 99%;
            height: 42%;
            .EE_tit_appea{
                width: 100%;
                display: flex;
                span:nth-child(1){
                    width: 52%;
                    font-size: 14px;
                }
                span:nth-child(2){
                    width: 48%;
                    min-width: 156px;
                    // margin-left: 5.2%;
                    font-size: 12px;
                    span{
                        display: inline-block;
                        width: 25%;
                        font-size: 12px;
                    }
                    select{
                        width: 72.5%;
                        height:22px;
                    }
                }   
            }
            img{
                width: 100%;
                height: 53%;
                margin-top: 6px;
                background: rgba(0,0,0,0.3);
            }
        }
        .EE_colorfunc{
            position: relative;
            margin-top: 10px;
            width: 100%;
            display: flex;
            .EE_box {
                position: absolute;
                top: 28px;
                right:16px;
                width: 229px;
                height: 165px;
                background: url("../assets/image/color_bg_prise.png") no-repeat;
                background-size: 100% 100%;
                background-position: 100% 100%;
                transition: all 0.3s linear;
                transform-origin: 50% 0%;
                z-index: 22222;
                overflow: hidden;
                .EE_box_tit{
                    margin-left: 39px;
                    margin-top: 18px;
                    color: #fff;
                    font-size: 14px;
                }
                .EE_box_Find{
                    .EE_box_uck{
                        display: inline-block;
                        // margin-top: 6px;
                        margin-left: 18px;
                        // margin-right: 4px;
                        width: 14px;
                        height: 14px;
                        vertical-align:3px;
                        &.active{
                            background: url("../assets/image/select_CP.png") no-repeat;
                            background-size: 100% 100%;
                            background-position: 100% 100%;
                        }
                    }
                    .EE_box_f{
                        display: inline-block;
                        width: 168px;
                        height: 22px;
                        border: 1px solid #838383;
                        img{
                            height: 100%;
                            width: 98%;
                            margin-left: 1px;
                            margin-right: 1px;
                            vertical-align:baseline;
                            // padding: 1px;
                        }
                    }
                    .EE_box_f:hover{
                        border: 1px solid #4558D0;
                    }
                }
            }
            .EE_box.s0 {
                transform: scale(0);
            } 
            .EE_box.s1 {
                transform: scale(1);
            }
            #EE_box_input {
                position: absolute;
                width: 0px;
                height: 0px;
                opacity: 0;
            }
            span{
                display: inline-block;
            }
            span.EE_tit{
                width: 48%;
            }
            span.EE_CCcolorprise{
                width: 50.5%;
                height: 22px;
                margin-top: 2px;
                // margin-left: 6%;
                // padding: 1px 1px;
                // vertical-align:-4px;
                border: 1px solid #6c6c6c;
                img{
                    height: 100%;
                    width: 99%;
                    margin-left: 1px;
                    margin-right: 1px;
                    vertical-align:baseline;
                }
            }
            span.EE_CCcolorprise:hover{
                border: 1px solid #00A4FF;
            }
        }
        .EE_tittext{
            margin-top: 1px;
            margin-bottom: 8px;
            .EE_tit{
                margin-bottom: 6px;
            }
            .textarea{
                width:99%;
                height:68px;
                font-size: 12px;
                padding-top: 2px;
                padding-left: 8px;
                line-height: 22px;
                color: #ccc;
                background:rgba(39,39,39,1);
                border-radius:2px;
                border: 1px solid rgba(39,39,39,1);
                box-sizing: border-box;
            }
        }
        .EE_font_style{
            color: #ffffff;
            font-size: 12px;
            margin-bottom: 6px;
            select{
                width:142px;
                height:22px;
            }
            p{
                height: 30px;
                line-height: 30px;
            }
            .EE_fontFamily{
                .selectFamily{
                    margin-left: 32px;
                }
            }
            .EE_fontSize{
                .selectSize{
                    margin-left: 8px;
                } 
            }
            .EE_showAxial{
                position: relative;
                input[type=checkbox]{
                    position: absolute;
                    left: 59px;
                    top: 6px;
                    width: 15px;
                    height: 15px;
                    opacity: 0;
                    z-index: 2;
                }
                label{
                    position: absolute;
                    left: 59px;
                    top: 6px;
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
                    content: "";
                    width: 5px;
                    height: 10px;
                    left: 4px;
                    top: 0px;
                    border: 2px solid #fff;
                    border-top: none;
                    border-left: none;
                    transform: rotate(45deg)
                }
            }
        }
    }
    .EE_location{
        min-height: 80px;
        margin-top: 5px;
        padding-bottom: 12px;
        .EE_tit{
            height: 30px;
            line-height: 30px;
            margin-bottom: 4px;
        }
        .EE_locaAxis{
            height: 27px;
            line-height: 27px;
            color: #FFFFFF;
            span{
                display: inline-block;
                width: 16%;
                font-size: 12px;
            }
            input[type=text],input[type=number]{
                margin-right: 11%;
                color: #C2C2C2;
            }
        }
    }
    .EE_style{
        min-height: 138px;
        .EE_ds_show{
            margin-bottom: 15px;
            .EE_tit{
                height: 40px;
                line-height: 44px;
            }
            .EE_ds_show_p{
                display: flex;
                margin-bottom: 18px;
                span{
                    display: inline-block;
                    width:54px;
                    height:26px;
                    margin-top: 8px;
                    margin-left: 10%;
                    line-height: 26px;
                    text-align: center;
                    border-radius: 3px;
                }
            }
            .bgse{
                background: #3F3F43;
            }
            .bg_select{
                color: #fff;
                background:linear-gradient(90deg,rgba(4,138,245,1),rgba(12,239,247,1));
                background-size: cover;
                background-position: 100% 100%;
            }
        }
        .EE_transpa{
            margin-top: 3px;
            margin-bottom: 8px;
            p{
                display: inline-block;
                font-size: 14PX;
            }
            .EE_tit{
                width: 15%;
                margin-right: 3%;
            }
            p:nth-child(2){
               width: 80%; 
               vertical-align:2px;
            }
            input{
                width: 40px;
                margin-left: 3%;
                padding-left: 12px;
                vertical-align:-3px;
            }
        }
    }
    .EE_data{
        min-height: 132px;
        .EE_tit{
            height: 40px;
            line-height: 40px;
        }
        p{
            width: 100%;
            height: 32px;
            line-height: 32px;
            color: #fff;
            font-size: 12px;
            select{
                width:142px;
                height: 22px;
                line-height: 22px;
                padding-left: 5px;
            }
        }
        .EE_data_item{
            span{
                margin-right: 16px;
            }
           
        }
        .EE_kindList{
            span{
                margin-right: 5px;
            }
            
        }
    }
    .EE_btn{
        position: relative;
        margin: 10px;
        height: 38px;
        border: none;
        margin-bottom: 20px;
        button{
            position: absolute;
            width: 78px;
            height: 32px;
            background: #3F3F43;
            border: none;
            color: #fff;
            font-size: 16px;
            border-radius: 5px;
        }
        .EE_btn_delete{
            top: 10px;
            right: 100px;
        }
        .EE_btn_save{
            top: 10px;
            right: 10px;
        }
        button:hover{
                color: #fff;
                background: url("../assets/image/styleselect.png") no-repeat;
                background-size: cover;
                background-position: 100% 100%;
            }
    }
    .inputsel{
        border: 1px solid #00A4FF!important;
        box-sizing: border-box;
    }
    .seclectsel{
        border: 1px solid #00A4FF!important;
        box-sizing: border-box;
    }
}
</style>
<style lang="less">
.chartsEditor{
    .EE_transpa{
        .el-slider{
            width: 73%;
        }
    }
    .EE_fontColor{
        position: relative;
        .el-color-picker{
            top: 6px;
            left: 8px;
            height:22px;
            .el-color-picker__trigger{
                position: relative;
                width:34px;
                height:22px;
                padding: 0;
                background:#504F4F;
                border:1px solid #000000;
                border-radius: 0;
                .el-color-picker__color{
                    border: none;
                }
                .el-color-picker__icon{
                    position: absolute;
                    top: 15px;
                    left: 26px;
                    width: 12px;
                    height: 9px;
                    background:rgba(56,56,56,1);
                    border:1px solid #000000;
                    border-bottom: none;
                    font-size: 8px;
                    color: #9D9D9D;
                }
                // .el-icon-caret-bottom{

                // }
            }
        }
        .colorbox{
            position: absolute;
            top: 50px;
            display: block;
            width: 50px;
            height: 20px;
        }
    }
}
</style>