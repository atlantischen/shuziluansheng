<template>
    <div class="incident">
        <li class="CPr_contDiv_li li_two">
            <p class="CPr_lip_tit">
                <span>事件组件</span>
            </p>
            <p class="incident_1 lip_con checkbox">
                <input type="checkbox" v-model="clickshicheck" id="clickshi" @change="clickshijian()"/>
                <label></label>
                <span class="titfunc">点击事件</span>
                <span class="styleimg">
                    <img :src="iconpath"  @click="stylechang(srcicon)"/>
                    <input type="text" name="" v-model="titstyle">
                </span>
                <!--   @mouseout="styleout()" -->
                <ul class="stylebox"  @mouseleave="styleout()" v-show="styleboxs">
                    <li class="bgbor">
                        <span v-for="(item,index) in clickstyle" :key="index" @mouseover="styleover(item, index)" @click="imgstyle(item)">
                            <img  :src="item.miniIconPath"/>
                        </span>
                    </li>
                    <!--  v-if="mousehover" -->
                    <div class="hoverdiv" v-if="mousehover">
                        <p><span class="panelName1">面板名称:       </span>{{panelSName}}</p>
                        <p><span class="panelName2">面板样式:</span><img :src="panelstyleSrc" alt="" /></p>
                        <P>
                            <span class="panelName3">小面板属性:</span>
                            <span class="panelName4">
                                <i v-for="(Propitem,index) in small_PropList" :key="index">{{Propitem.name}}</i>
                            </span>
                        </P>
                        <P>
                            <span class="panelName3">大面板属性:</span>
                            <span class="panelName4">
                                <i v-for="(Propitem,index) in big_PropList" :key="index">{{Propitem.name}}</i>
                            </span>
                        </P>
                    </div>
                </ul>
            </p>
            <p class="incident_2 in_two lip_con danjitai">
                <span class="titfunc">单机台</span>
                <input type="checkbox" :disabled="disabled" id="danjitai" @click="danjitai()"/>
            </p>
            <p class="incident_2 in_two lip_con">
                <span class="titfunc">大面板</span>
                <input type="checkbox" :disabled="disabled" id="damianban" @click="damianban()"/>
            </p>
            <p class="incident_2 lip_con checkbox">
                <span class="huadongshijian">滑动事件</span>
                <input type="checkbox" id="huadongshi" @click="huadong()"/>
                <label></label>
            </p>
        </li>
    </div>
</template>
<script>
import $ from 'jquery';
// import api from '../../static/api/api.js'
    export default {
        name:"incident",
        props:["incident","treeclickdata","machineType","clickIndex","treeclickD","machineTypeIn","isShowModelDetail","isShowMaxiPanel","datapanel"],
        data(){
            return{
                panelstyleSrc:'',
                srcicon:'',
                titstyle:"",
                styleboxs:false,
                clickstyle:[],
                panelData:[],
                miniID:{},//小面板ID
                resourcesimgSrc:'/StyleFile-Management-Service/getstyleIcon/test/',//资源图片的请求地址前缀
                // panelBGUrl:'http://111.230.241.106:9083/StyleFile-Management-Service/getStyleSettings/test/miniplane',//数据背景请求地址
                // shuUrl:"http://111.230.241.106:9084/DataitemFile-Management-Service/getDataitemSettings/test/MachineStateItems",//属性请求
                arrResourceslist:[],
                resourceslist:[],
                // treedata:[],
                panelSName:"",//详细信息，组件样式名称
                bgimgstate:'juanyanji',//默认小面板展示样式，，卷烟机
                small_PropList:[
                    {"name":"主机运行速度","vrkey":"设备生产速度","sckey":"主机生产速度"},
                    {"name":"主机运行效率","vrkey":"设备生产效率","sckey":"主机生产效率"},
                    {"name":"主机产量","vrkey":"设备产量","sckey":"主机产量"},
                    {"name":"主机废品率","vrkey":"设备废品率","sckey":"主机废品率"}
                ],
                big_PropList:[{"name":"主机运行速度","vrkey":"设备生产速度","sckey":"主机生产速度"},],
                mousehover:false,//悬浮其上显示
                messageoverstyles:true,//判断添加
                disabled: true,
                clickshicheck: false,
                httpdata:'',
                iconpath:'',
            }
        },
        watch:{
            // srcicon(){
            //     this.titstyle = this.srcicon;
            // },
            clickshicheck () {
                if (this.clickshicheck == false) {
                    $(".incident_2 #danjitai").attr("checked", false);
                    $(".incident_2 #damianban").attr("checked", false);
                }
                 this.disabled = !this.clickshicheck
            },
            titstyle(){
                // this.srcicon = this.titstyle;
                // console.log(this.titstyle);
            },
            srcicon(){
                if(this.srcicon == ''){
                    this.titstyle = '';
                    $(".styleimg img").hide();
                }else{
                    $(".styleimg img").show();
                }
            },
            treeclickdata(){
                console.log(this.treeclickdata);
            },
            datapanel: {
                handler(newName, oldName) {
                    for(var i=0;i<this.resourceslist.length;i++){
                        // console.log(this.resourceslist);
                        if(this.datapanel.belondName == this.resourceslist[i].mcid){
                            this.datapanel.belondName = this.resourceslist[i].mcid;
                            this.datapanel.sckey = this.resourceslist[i].sckey;
                           this.datapanel.vrkey = this.resourceslist[i].vrkey;
                            let checkeds = false;
                            this.incident.getEventData("noclickEvent",this.miniID,this.datapanel,checkeds);
                        }else {
                            this.datapanel.belondName = this.resourceslist[0].mcid;
                        }
                    }
                },
                deep: true
            },
            miniID(){
                this.srcicon = this.miniID.miniBackground;
                this.titstyle = this.miniID.miniTitle;
            }
        },
        methods:{
            danjitai(){//单机台选中事件
                console.log("单机台");
                var checked = $("#danjitai").prop('checked');
                if(checked == true) {//选中
                    // this.incident.
                }else if(checked == false){
                }
                console.log(checked,this.treeclickD,this.clickIndex);
                this.incident.isShowModelDetailControl(checked,this.treeclickD,this.clickIndex);
            },
            damianban(){//大面板选中事件
                console.log("大面板");
                var checked = $("#damianban").prop('checked');
                if(checked == true) {//选中
                }else if(checked == false){
                }
                console.log(checked,this.treeclickD,this.clickIndex);
                this.incident.isShowMaxiPanelControl(checked,this.treeclickD,this.clickIndex);
            },
            convertAction(){   // 用于拼接场景里的 vrkey
                var data = JSON.parse( localStorage.getItem("sceneData"));
                var objects = data.scene3D.object;
                var action = data.actions;
                var warningItem = {
                    datas:[],
                    id:'mechinewarningstatePanel',
                }
                for(var i =0 ;i< objects.length;i++){
                    if(objects[i].Name.indexOf('floor') <0){
                        var machineNum = objects[i].Name;
                        objects[i].modelContent.data.filter(data => {
                            if(data.ModelChildrenMechineType!=null){
                            var machineType = data.ModelChildrenMechineType
                            // if(machineNum.indexOf('T') == 0){
                            //     machineNum = '';
                            // }
                            var vrkey = machineNum+"_"+machineType+"_"+"运行状态";
                            var warningVrkey = machineNum+"_"+machineType+"_"+"机器状态信息";
                            var dataPoint = {"vrkey":vrkey,"value":0}
                             var warningdataPoint = {"vrkey":warningVrkey,"value":0}
                            warningItem.datas.push(warningdataPoint);
                            action[0].datas.push(dataPoint);
                            }
                        })
                    }
                    }
                    action.push(warningItem);
                    var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                    if (newSceneData) {
                        if(newSceneData.actions !== "" || null|| undefined) {
                            newSceneData.actions = action
                        }
                    }
                    localStorage.setItem('sceneData', JSON.stringify(newSceneData));
                    // this.convertAction();

            },
            clickshijian(){//点击事件选中
                var checked = $("#clickshi").prop('checked');
                console.log(this.resourceslist);
                if(checked == true){
                    if(this.clickstyle.length == 0){
                        alert("请先到面板库添加小面板!");
                        this.clickshicheck = false;
                        $("#clickshi").prop("checked", false);
                    }else if(this.clickstyle.length > 0){
                        console.log(this.miniID,this.datapanel,checked);
                        this.$emit('clickselect', true);
                        $(".incident_2 #danjitai").attr("checked","checked");
                        $(".incident_2 #damianban").attr("checked","checked");
                        // this.convertAction();    // 11-08 测试小面板出现数据问题
                        this.incident.getEventData("clickEvent",this.miniID,this.datapanel,checked);
                    }
                }
                if(checked == false){
                    console.log(this.miniID,this.datapanel);
                    $(".incident_2 #danjitai").removeAttr("checked");
                    $(".incident_2 #damianban").removeAttr("checked");
                    this.incident.getEventData("clickEvent",this.miniID,this.datapanel,checked);
                }

            },
            huadong(){//滑动事件选中
                var checked = $("#huadongshi").prop('checked');
                if(checked) {//选中
                    this.incident.setMouseMoveEvent("moveEvent",this.datapanel)
                }
            },
            stylechang(idsrc){//点击小图标更换样式
                console.log(idsrc);
                setTimeout(()=>{
                    this.styleboxs = true;
                })
            },
            imgstyle(item){//选择小图标面板
                // console.log(item);
                var checked = $("#clickshi").prop('checked');
                if(checked){
                    this.$emit('clickselect', true);
                }
                this.miniID = item;
                for(var i=0;i<this.resourceslist.length;i++){
                    if(this.datapanel.belondName == this.resourceslist[i].name){
                        this.datapanel.belondName = this.resourceslist[i].mcid;
                         this.datapanel.sckey = this.resourceslist[i].sckey;
                           this.datapanel.vrkey = this.resourceslist[i].vrkey;
                    }else {
                        this.datapanel.belondName = this.resourceslist[0].mcid;
                    }
                }
                this.incident.getEventData('minichangeEvent',this.miniID,this.datapanel,checked);
                this.srcicon = item.miniBackground;
                this.titstyle = item.miniTitle;
                this.styleboxs = false;
            },
            styleover(item){//悬浮其上
                console.log(item);
                this.PropList=[];
                this.panelSName = '';
                this.panelstyleSrc = '';
                // this.small_PropList = JSON.parse(item.miniAttribute);
                // this.big_PropList = JSON.parse(item.maxminiAttribute);//大面板数据展开
                this.small_PropList = item.miniAttribute;
                this.big_PropList = item.maxminiAttribute;
                this.panelSName = item.miniTitle;
                this.panelstyleSrc = item.miniBackGround;
                // if(this.machineTypeIn == "卷烟机"){
                //     this.bgimgstate = "juanyanji"
                // }else if(this.machineTypeIn == "包装机主机"){
                //     this.bgimgstate = "zhuji"
                // }else if(this.machineTypeIn == "包装机辅机"){
                //     this.bgimgstate = "fuji"
                // }
                // if(item.miniBackground == "miniplanetest"){  // 背景图片根据小面板的类型来设定
                //     this.bgimgstate = "juanyanji"
                // }else if(item.miniBackground == "miniplanetest1"){
                //     this.bgimgstate = "zhuji"
                // }else if(item.miniBackground == "miniplanetest2"){
                //     this.bgimgstate = "fuji"
                // }
                this.mousehover = true;
            },
            styleout(){//鼠标离开
                console.log('离开')
                // console.log(this.messageoverstyles);
                // if(this.messageoverstyles == false){
                    this.mousehover = false;
                    this.PropList=[];
                // }
            },
            styleShow(){
                 this.mousehover = true
            },
            messageover(){
                this.messageoverstyles = true;
                return this.messageoverstyles = false;
            }
        },
        mounted:async function(){
            $("#clickshi").attr("checked","checked");
            $('body').on('click', ()=>{
                if( this.styleboxs == true){
                    this.styleboxs = false;
                }
            });
            // console.log(this.isShowModelDetail,"单机台单机台单机台单机台单机台单机台单机台");
            // console.log(this.isShowMaxiPanel,"大面板大面板大面板大面板大面板大面板大面板大面板");
            if(this.isShowModelDetail == true){
                $(".incident_2 #danjitai").attr("checked","checked");
            }else if(this.isShowModelDetail == false){
                $(".incident_2 #danjitai").removeAttr("checked");
            }
            if(this.isShowMaxiPanel == true){
                $(".incident_2 #damianban").attr("checked","checked");
            }else if(this.isShowMaxiPanel == false){
                $(".incident_2 #damianban").removeAttr("checked");
            }
            let gbdefultdata = {};
            this.$http("./static/api/api.json",gbdefultdata, 'get').then(async (data) => {// 请求本地，背景名称
                this.httpdata = data.baseroot;
                // console.log(this.httpdata);
                this.resourcesimgSrc = this.httpdata.StyleFileManagementService+this.resourcesimgSrc;
                let BGdata = {}// 请求参数
                await this.$server.machinemodalgetByUser().then(data => {
                // await this.$http(this.httpdata.StyleFileManagementService+'/StyleFile-Management-Service/getStyleSettings/test/miniplane',BGdata, 'get').then((res) => {// 请求小图标
                    // console.log(res);
                    // this.panelData = JSON.parse(res.data);
                    this.panelData = data.data.data;
                    console.log(this.panelData);
                    this.clickstyle=[];
                    // if(this.panelData)
                    console.log(this.machineTypeIn);
                    console.log(this.panelData)
                    let panelDatas;
                    for(var j=0;j<this.panelData.length;j++){
                        if(this.machineTypeIn.indexOf('_')>0){  // 12-12 类型变更 添加辅机GDX1_CHCTCV
                            var type = this.machineTypeIn.split('_')[1];
                            if(type.indexOf(this.panelData[j].machineType>-1)){
                                console.log(type);
                                if(this.panelData[j].machineType == type){
                                    panelDatas = this.panelData[j].typeArray;
                                }
                            }
                        }else{
                            console.log(this.machineTypeIn);
                            if(this.panelData[j].machineType == this.machineTypeIn){
                                panelDatas = this.panelData[j].typeArray;
                                 console.log(this.panelData[j]);
                            }
                        }
                    }
                    console.log(panelDatas);
                    for(var i = 0;i<panelDatas.length;i++){
                        // panelDatas[i].miniBackground = panelDatas[i].miniBackground.replace('.png', '');
                        this.clickstyle.push(panelDatas[i]);
                    }
                    console.log(this.clickstyle);
                    console.log(this.treeclickdata);
                    if(this.treeclickdata.EventMiniPanelBackground !== "" && this.treeclickdata.EventContent !== ""){
                        console.log("组件2");
                        $(".styleimg img").css("display","block")
                        this.titstyle = this.treeclickdata.EventMiniPanelName;
                        this.srcicon = this.treeclickdata.EventMiniPanelBackground;
                        // this.iconpath = this.treeclickdata[0].miniIconPath
                        // $("#clickshi").attr("checked","checked");
                        this.clickshicheck = true;
                    }else{
                        // this.srcicon = this.clickstyle[0].miniBackground;
                        this.titstyle = this.clickstyle[0].miniTitle;
                        this.miniID = this.clickstyle[0];
                        this.iconpath = this.clickstyle[0].miniIconPath;
                    }
                    // console.log(this.miniID)
                }).catch((res)=>{});// 请求失败 res 失败状态码
                // let data1 = {};
                // this.$http(this.httpdata.DataitemFileManagementService+"/DataitemFile-Management-Service/getDataitemSettings/test/MachineStateItems",data1,'get').then((res) => {// 请求成功回调 res 结果
                //     this.arrResourceslist = JSON.parse(res.data);
                //     console.log(this.arrResourceslist);
                //     this.resourceslist = [];
                //     for(var i =0;i<this.arrResourceslist.length;i++){
                //         if(this.arrResourceslist[i].machineType == this.machineType){
                //             this.resourceslist = this.arrResourceslist[i].dataArray;
                //         }
                //     }
                //     // console.log(this.resourceslist);
                // }).catch((res)=>{});
            }).catch((res)=>{});
            console.log(this.machineTypeIn);
            if(this.treeclickdata.EventMiniPanelBackground !== "" && this.treeclickdata.EventContent !== ""){
                $(".styleimg img").css("display","block")
                this.titstyle = this.treeclickdata.EventMiniPanelName;
                this.srcicon = this.treeclickdata.EventMiniPanelBackground;
                console.log(this.srcicon);
                // $("#clickshi").attr("checked","checked");
            }
            $(".styleimg img").hide();
            // console.log(this.datapanel);
            // $("#clickshi").attr("checked","checked");

        }
    }
</script>
<style lang="less" scoped>
.incident{
    .CPr_contDiv_li{
        width: 100%;
        min-width: 336px;
        padding-bottom: 12px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        color: #fff;
        text-overflow: ellipsis;
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
            position: relative;
            width: 100%;
            height: 36px;
            line-height: 36px;
            font-size: 12px;
            span.huadongshijian{
                margin-left: 24px;
            }
            input[type=checkbox]{
                position: absolute;
                display: inline-block;
                top: 12px;
                left: -4px;
                margin-left: 6px;
                margin-right: 10px;
                background: rgba(0,0,0,0.2);
                border: 1px solid #707070;
                border-radius: 3px;
                box-sizing: border-box;
            }
            input:focus{
                outline:none;
                border: 1px solid #0096ff;
            }
            .titfunc,.titfunc{
                margin-left: 24px;
            }
        }
        .checkbox{
            input[type="checkbox"] {
                position: absolute;
                left: 0px;
                top: 10px;
                width: 14px;
                height: 14px;
                opacity: 0;
                z-index: 2;
            }
            label {
                position: absolute;
                left: 0px;
                top: 10px;
                width: 14px;
                height: 14px;
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
        .incident_1{
            display: flex;
            .titfunc{
                display: inline-block;
                margin-left: 22px;
            }
            .styleimg{
                width: 142px;
                height: 22px;
                display: flex;
                margin-top: 8px;
                margin-left: 10px;
                line-height: 20px;
                border: none;
                background:rgba(39,39,39,1);
                border-radius: 3px;
                box-sizing: border-box;
                overflow: hidden;
                img{
                    display: inline-block;
                    width: 22px;
                    height: 22px;
                    margin: 0;
                    padding: 0;
                    border-right: 2px solid #4B4949;
                    box-sizing: border-box;
                    border-radius: 1px;
                }
                input[type=text]{
                    width: 142px;
                    height: 20px;
                    line-height: 35px;
                    padding-left: 3px;
                    background:rgba(39,39,39,1);
                    border-radius:2px;
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    border: none;
                    color: #fff;
                }
            }
            .stylebox{
                position: absolute;
                top: 40px;
                left: 75px;
                width: 238px;
                background: #545454;
                border: 2px solid #414141;
                box-sizing: border-box;
                z-index: 2;
                .bgbor{
                    position: relative;
                    margin: 10px;
                    width: 216px;
                    height: 134px;
                    border: 1px solid #414141;
                    box-sizing: border-box;
                    background: #4D4D4D;
                    overflow-y: scroll;
                    z-index: -1;
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
                        background-color: #777;
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
                        box-shadow: inset 0 0 0px rgba(45, 162, 253
                        , 0.3);
                        background-color: #fff;
                        /*滚动条的背景颜色*/
                    }
                    span{
                        display: inline-block;
                        padding: 0;
                        margin: 0;
                        margin-left: 2px;
                        width: 32px;
                        height: 32px;
                        box-sizing: border-box;
                        img{
                            width: 100%;
                            height: 100%;
                            border: 1px solid #434343;
                            box-sizing: border-box;
                        }
                        &:hover .hoverdiv {
                            display: inline-block;
                        }

                    }

                }
                .hoverdiv{
                    position: relative;
                    margin: 10px;
                    width: 216px;
                    border: 1px solid #414141;
                    box-sizing: border-box;
                    background: #4D4D4D;
                    // border: 1px solid red;
                    z-index: -1;
                    text-overflow: ellipsis;
                    p{
                        width: 100%;
                        margin-left: 0;
                        // text-align: center;
                        // border: 1px solid red;
                        .panelName1{
                            display: inline-block;
                            width: 28%;
                            height: 26px;
                            margin-left: 5px;
                            text-align: left;
                        }
                        .panelName2{
                            display: inline-block;
                            width: 100%;
                            margin-left: 5px;
                            text-align: left;
                        }
                        img{
                            margin-left: 10px;
                        }
                        .panelName3{
                            width: 30%;
                            height:20px;
                            margin-left: 5px;
                            line-height: 20px;
                            display: inline-block;
                            margin-top: 0;
                        }
                        .panelName4{
                            display: block;
                            width: 60%;
                            height: 128px;
                            margin-left: 8px;
                            i{
                                display: block;
                                width: 92.6%;
                                height: 20px;
                                line-height: 20px;
                                padding-left: 8px;
                                margin-top: 1.5px;
                                background: #3F3F43;
                                border-radius: 3px;
                                font-size: 10px;
                            }
                        }
                    }
                    p:nth-child(1){
                        height: 26px;
                        line-height: 36px;
                    }
                    p:nth-child(3){
                        display: flex;
                        height:70px;
                    }
                    p:nth-child(4){
                        display: flex;
                        height: 140px;
                    }
                    .panelName4{
                        overflow-y: auto;
                        &::-webkit-scrollbar {
                            margin-top: 2px;
                            width: 2px;
                            /*滚动条宽度*/
                            height: 6px;
                            /*滚动条高度*/
                            margin: 0;
                            padding: 0;
                        }
                        /*定义滚动条轨道 内阴影+圆角*/
                        &::-webkit-scrollbar-track {
                            margin-top: 2px;
                            box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
                            border-radius: 2px;
                            /*滚动条的背景区域的圆角*/
                            background-color: #777;
                            /*滚动条的背景颜色*/
                        }
                        /*定义滑块 内阴影+圆角*/
                        &::-webkit-scrollbar-thumb {
                            margin-top: 2px;
                            width: 2px;
                            /*滚动条宽度*/
                            height: 26px;
                            /*滚动条高度*/
                            border-radius: 2px;
                            /*滚动条的圆角*/
                            box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
                            background-color: #fff;
                            /*滚动条的背景颜色*/
                        }
                    }
                    p:first-child{
                        text-align: 50%;
                    }
                }
            }
        }
        .in_two{
            display: inline-block;
            width:20%;
        }
        .danjitai{
            margin-left: 23%;
        }
    }
}
</style>
<style lang="less">

</style>
