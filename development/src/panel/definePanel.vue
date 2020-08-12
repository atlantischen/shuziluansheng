<template>
    <div class="definePanel-drag" v-if = "define_SH">
      <div class="box definePanel popup-box" data-drag="true" @click="boxZindex" :style="{'z-index': Zindex}">
        <h1 class="b_title darg-title">
            <p class="tit_left">小面板库</p>
            <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
                <img src="../../static/img/index-6.png" v-if="bselected">
                <img src="../../static/img/index-9.png" v-else @click="noneother()">
            </p>
        </h1>
        <div class="panel_cent">
            <ul class="el_centUl">
                <li class="styleimgT">
                    <!-- :src="item" -->
                    <img v-for="(item, key) in smallimglist" :key="key" @click="iconchoose(item,key)"
                      :src="item.iconPath"  @dblclick="celldbclick" :class="item.selectedImg?'selectedImg':''">
                </li>
                <li class="title_save">
                    <span>标题: </span>
                    <input type="text" v-model="titlezu"/>
                    <button @click="titSave()">保存</button>
                    <button @click="titdelete()">删除</button>
                    <div class="bgimgstate">
                        <img :src="bgimgstate" alt="" />
                    </div>
                </li>
                <li class="type_lie">
                    <span>类型: </span>
                    <select v-model="selectItem" @change="selectFn()" class="selectla">
                        <option :value="item.machineType" v-for="(item, key) in typeList" :key="key" :type="item.uuid">{{item.machineType}}</option>
                    </select>
                </li>
                <li class="type_lie">
                    <span>机器型号: </span>
                    <select v-model="selectModel" @change="modelFn()" class="selectla">
                        <option :value="item.machineModel" v-for="(item, key) in modelList" :key="key" :type="item.uuid">{{item.machineModel}}</option>
                    </select>
                </li>
                <li class="style_bg">
                    <span>背景: </span>
                    <span class="styleimg_bg">
                        <img :src="[srcicon]"  @click="stylechang(srcicon,titstyle)"/>
                        <input type="text" name="" v-model="titstyle">
                    </span>
                    <ul class="stylebox" v-show="styleboxs">
                        <li class="bgbor"><!-- 这里是放置图片的位置 -->
                            <span v-for="(item,index) in bGimglist" :key="index" @mouseover="imgstyles(item)" @mouseout="imgstylelive(item)" @click="imgstyle(item)">
                                <img :src="[item.iconPath]"/>
                            </span>
                        </li>
                    </ul>
                </li>
                <li class="SX_checkbox" id="shux">
                    <ul class="Bs_panel">
                        <li id="small_p" class="BS_liHover" @click="smallpanel('小面板')">小面板</li>
                        <li id="big_p" @click="smallpanel('大面板')">大面板</li>
                    </ul>
                    <!-- <p>属性:</p> -->
                    <ul class="checkbox_list_big" v-show="big_show">
                        <li v-for="(item, index) in big_attributeList" :key="index">
                            <input type="checkbox" :name="item.description" :itemID ="item.name" :id="item" @change="big_one">
                            <label :for="item" :title="item.description">{{item.description}}</label>
                        </li>
                    </ul>
                    <ul class="checkbox_list_small" v-show="small_show">
                        <li v-for="(item, index) in small_attributeList" :key="index">
                            <input type="checkbox" :name="item.description" :itemID ="item.name" :id="item" @change="small_one">
                            <label :for="item" :title="item.description">{{item.description}}</label>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
      </div>
    </div>
</template>
<script>
import $ from 'jquery';//checkbox_name
import drag from '../../static/js/drag'
// import {server} from '../assets/js/http-server';
// import api from '../../static/api/api.js'
    export default {
        name:'definePanel',
        props:["definePanel","incidentcomps", "index"],
        data(){
            return{
                modelId:"",//设备类型id
                machineId:"",//机器型号id
                panelUuid:"",
                imgstyleId:'',
                paneldefaultUrl:"",
                define_SH:true,//刷新面板
                big_show:false,//大面板数据显示
                small_show:true,//小面板数据显示
                selectModel:"卷烟机型号1",
                oldSelectModel: '卷烟机型号1', // 用于取消保存时
                modelList:["卷烟机型号1","卷烟机型号2","卷烟机型号3"],//机器型号数组
                selectItem:"卷烟机",
                oldSelectItem:"卷烟机", // 用于取消保存时
                typeList:["卷烟机","包装机主机","包装机辅机"],//type类型的list
                definePanelhide:true,//传参主页面，显示隐藏控制
                bselected : true,//图片选中的判断
                titlezu:'',//标题输入框输入valve值
                srcicon:'miniplanetest',//背景默认
                titstyle:"miniplanetest",//背景绑定
                styleboxs:false,//选项
                smallimglist:[],//默认样式
                panelbgdefu:[],
                bGimglist:[],//背景可选择列表
                big_attributeList:["产量1","产量2","产量3","产量4","产量5","产量6"],
                small_attributeList:[],
                // panelBGUrl:'http://111.230.241.106:9083/StyleFile-Management-Service/getStyleSettings/test/miniplane',//数据背景请求地址
                // panelshuUrl:'http://111.230.241.106:9084/DataitemFile-Management-Service/getDataitemSettings/test/MiniPlaneItems',//默认属性请求地址
                panelData:[],//panel背景的默认值
                panelshu:[],//panel属性的默认值
                resourcesimgSrc:'/StyleFile-Management-Service/getstyleIcon/test/',//资源图片的请求地址前缀
                // chuanzhiUrl:'http://111.230.241.106:9083/StyleFile-Management-Service/addStyleSettings/',//传值后台
                // deleteurl:'http://111.230.241.106:9083/StyleFile-Management-Service/removeStyleSettings/test/',//删除数据请求
                // changgeUrl:'http://111.230.241.106:9083/StyleFile-Management-Service/updateStyleSettings/',//修改
                clickitem:"",//点击的每一项数据
                deleteDataitem:"",//点击删除的时候接受点击项的数据
                truedelete:false,//判断是否是修改
                miniid:'',
                tiaoyongdata:[],
                shuxingliet:[],
                bgimgstate:'juanyanji',//默认小面板展示样式，，卷烟机
                dataopen:[],//机器型号下拉框总数据
                Zindex:0,
                httpdata:'',
                imgclickkey:'',//点击小图标的下标
            }
        },
        watch:{
            clickitem(){
                this.deleteDataitem = this.clickitem;
            },
            selectModel(newsel, oldel){
                this.oldSelectModel = oldel // 存储旧的值，用于取消时赋值
                let shudata = {}// 请求参数
            },
            selectItem(newsel, oldel){
                this.oldSelectItem = oldel // 存储旧的值，用于取消时赋值
            },
            iconchoose(){
                console.log(this.iconchoose);
            }
        },
        methods:{
            big_one(){
                console.log("点击大面板选中框")
            },
            small_one(){
                console.log("点击小面板选中框")
            },
            smallpanel(val){//点击切换大面板和小面板
                console.log("大面板")
                if(val == "大面板"){
                    $(".SX_checkbox .Bs_panel #big_p").addClass('BS_liHover').siblings().removeClass('BS_liHover');
                    this.big_show = true;
                    this.small_show = false;
                }else if(val == "小面板"){
                    $(".SX_checkbox .Bs_panel #small_p").addClass('BS_liHover').siblings().removeClass('BS_liHover');
                    this.big_show = false;
                    this.small_show = true;
                }
            },
            boxZindex () {
                let arr = []
                $('.popup-box').each(function(item){
                    // console.log($(this).css('z-index'), "$(this).css('z-index')", $(this))
                    arr.push(Number($(this).css('z-index')))
                })
                // console.log(Math.max(...arr), 'this.Zindex1111')
                this.Zindex = Math.max(...arr)+1
                // console.log(this.Zindex, 'this.Zindex')
            },
            modelFn(){//模型切换方法
                this.modelFn_();
                console.log(this.machineId)
                this.big_attributeListFn(this.machineId);
                this.small_attributeListFn(this.machineId);
                if(this.panelUuid !== undefined || this.panelUuid !== null || this.panelUuid !== ''){//点击小面板

                }else {//正常切换

                }
            },
            selectFn_(){//根据卷烟机下拉框选中值拿到具体id
                for(var i=0;i<this.typeList.length;i++){
                    if(this.typeList[i].machineType == this.selectItem){
                        this.modelId = this.typeList[i].uuid;
                    }
                }
            },
            modelFn_(){//根据机器模型value值拿到id
                console.log(this.selectModel);
                for(var i=0;i<this.modelList.length;i++){
                    if(this.modelList[i].machineModel == this.selectModel){
                        this.machineId = this.modelList[i].uuid;
                    }
                }
            },
            noneother(){//点击X,隐藏整个弹框
                this.definePanelhide = false;
                this.$emit('closepanel', "小面板库");
            },
            R_selectStyle(){//图片显示选中
                this.bselected = false;
                $(".definePanel .tit_right img").css("background","#0878d2");
            },
            R_outStyle(){//图片显示不选中
                this.bselected = true;
                $(".definePanel .tit_right img").css("background","#292929");
            },
            iconchoose(item,key){//点击小图表选择样式
                // this.secHeader.smallpanelgetid();
                let id = item.uuid;
                this.panelUuid = item.uuid;
                console.log(this.smallimglist,"this.smallimglist");
                this.smallimglist.map((items,index)=>{
                    if(index == key) {
                        items.selectedImg = true
                    }else{
                        items.selectedImg=false
                    }
                })
                console.log(id,this.panelUuid);
                this.$server.smallpanelgetid(id).then(data => {
                    console.log(data);
                    this.smallPanellist(data.data.data);
                }).catch((res)=>{
                    console.log(res);
                });
            },
            celldbclick(){//小图标双击取消选中
                console.log("双击")
                this.smallimglist.map((items,index)=>{
                    items.selectedImg = false;
                })
                this.truedelete = false;
                this.$emit('No_change', true);
                this.smallpanel("小面板");
                console.log("双击取消选中");
                this.$nextTick(()=>{
                    this.typeListFn()
                    console.log($("#shux ul li input[type=checkbox]"))
                    $("#shux ul li input[type=checkbox]").removeAttr("checked");
                })
            },
            selectFn(){//点击卷烟机下拉框
                // console.log(this.selectItem);
                this.selectFn_();
                console.log(this.modelId);
                this.modelListFn(this.modelId);
                if(this.panelUuid !== undefined || this.panelUuid !== null || this.panelUuid !== ''){//点击小面板
                    // this.typeListFn();
                }else {//正常切换

                }
            },
            shuxinjicheng(miniAttribute,maxminiAttribute){
                console.log(miniAttribute,maxminiAttribute);
                setTimeout(()=>{
                    this.$nextTick(()=>{
                        // console.log(this.selectItem);
                        // this.typeList=[];
                        // this.typeList.push(this.selectItem);
                        for(var j=0;j<this.small_attributeList.length;j++){
                            for(var i=0;i<miniAttribute.length;i++){
                                if(miniAttribute[i].name == this.small_attributeList[j].description){
                                    $("#shux ul.checkbox_list_small li:eq("+j+") input[type=checkbox]").attr("checked","checked");
                                }
                            }
                        }
                        console.log(this.big_attributeList);
                        for(var j=0;j<this.big_attributeList.length;j++){
                            for(var i=0;i<maxminiAttribute.length;i++){
                                if(maxminiAttribute[i].name == this.big_attributeList[j].description){
                                    $("#shux ul.checkbox_list_big li:eq("+j+") input[type=checkbox]").attr("checked","checked");
                                }
                            }
                        }
                    })
                });
            },
            titSave(){//点击保存   在这里调用，拿到值
                // console.log(this.titlezu);
                let arr = [],bigarr=[];
                $('.SX_checkbox ul.checkbox_list_big input[type=checkbox]').each(function(){
                    var checked = $(this).prop('checked');
                    if(checked) {
                        let obj = {
                            name: $(this).attr('name'),
                            id: $(this).attr('itemID'),
                        }
                        bigarr.push(obj);
                    }
                    // console.log(bigarr);
                });
                $('.SX_checkbox ul.checkbox_list_small input[type=checkbox]').each(function(){
                    var checked = $(this).prop('checked');
                    if(checked) {
                        let obj = {
                            name: $(this).attr('name'),
                             id: $(this).attr('itemID'),
                        }
                        arr.push(obj);
                    }
                    // console.log(arr);
                });
                let arrs = JSON.stringify(arr);
                let bigarrs = JSON.stringify(bigarr);
                var type = "test";
                var name="miniplane";
                if(this.panelUuid !== '' && this.panelUuid !== undefined && this.panelUuid !== null){//再次编辑
                    console.log("再次编辑")
                    let JsonData1 = {
                        maxminiAttribute:bigarrs,//大面板
                        miniAttribute: arrs,//小面板
                        miniBackground: this.srcicon +'.png',
                        miniID: this.panelUuid,
                        miniTitle: this.titlezu,
                        machineType:this.machineId,
                        type: "mini-panel"
                    };
                    console.log(JsonData1);
                    this.definePanel.addMinipanelOptions(JsonData1);//点击保存，调用js方法，放置数据
                    let gbdefultdata = {
                        title:this.titlezu,
                        machineModeId:this.machineId,
                        smallPanelStyleId:this.imgstyleId,
                        json:{
                            maxminiAttribute:bigarr,//大面板
                            miniAttribute: arr,//小面板
                        },
                        uuid:this.panelUuid
                    }
                    console.log(gbdefultdata);
                    this.$server.editsmallpanel(gbdefultdata).then(data => {
                    // this.$http(this.httpdata.StyleFileManagementService+'/StyleFile-Management-Service/updateStyleSettings/'+type+"/"+name+"/"+this.selectModel+"/JsonData" , jsonData2, 'POST').then((res) => {
                        // this.smallimglist.push(this.srcicon+".png");
                        if(this.incidentcomps == true){
                            this.$emit('save_refresh', true);
                        }else{
                            this.$emit('save_refresh', false);
                        }
                        console.log("保存");
                    }).catch((res)=>{}); // 请求失败 res 失败状态码
                }else{//第一次编辑保存
                    console.log("首次编辑")
                    let jsonData2;
                    var type = "test";
                    var name="miniplane";
                    let idadd;
                    idadd = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                    let newidadd;
                    newidadd = (idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
                    jsonData2 = {
                        maxminiAttribute:bigarr,//大面板
                        miniAttribute: arr,
                        miniBackground: this.srcicon +'.png',
                        miniID: newidadd,
                        miniTitle: this.titlezu,
                        machineType:this.machineId,
                        type: "mini-panel"
                    }
                    // console.log(jsonData2);
                    console.log(type+"/"+name+"/"+this.selectModel+"/JsonData");//this.changgeUrl+
                    // console.log(this.selectItem);
                    let gbdefultdata = {
                        title:this.titlezu,
                        machineModeId:this.machineId,
                        smallPanelStyleId:this.imgstyleId,
                        json:{
                            maxminiAttribute:bigarr,//大面板
                            miniAttribute: arr,//小面板
                        }
                    }
                    console.log(gbdefultdata)
                    // this.$http(this.httpdata.StyleFileManagementService+'/StyleFile-Management-Service/addStyleSettings/'+type+"/"+name+"/"+this.selectModel+"/JsonData" , JsonData1, 'POST').then((res) => {
                    this.$server.addsmallpanel(gbdefultdata).then(data => {//新增小面板
                        this.smallimglist.push(this.srcicon+".png");
                        if(this.incidentcomps == true){
                            this.$emit('save_refresh', true);
                        }else{
                            this.$emit('save_refresh', false);
                        }
                        alert("保存成功！");
                    }).catch((res)=>{}); // 请求失败 res 失败状态码



                }
                if(this.titlezu == "" || this.titlezu == undefined){
                    alert("小面板标题不能为空");
                }
            },
            titdelete(){//点击删除，删除选中的小图标
                // console.log(machineType,miniid);
                let BGdata = this.panelUuid;
                console.log(BGdata)
                this.$server.smallpaneldeleteid(BGdata).then(data => {
                // this.$http(this.httpdata.StyleFileManagementService+'/StyleFile-Management-Service/removeStyleSettings/test/'+name+"/"+machineType+"/"+miniid,BGdata  , 'post').then((res) => {
                    // console.log(this.deleteurl+name+"/"+machineType+"/"+miniid);
                    alert("删除成功!");
                    this.$emit('save_refresh', true);
                }).catch((res)=>{});// 请求删除小面板的数据
            },
            stylechang(idsrc){//点击切换小面板样式单独icon显示icon列表div
                console.log(idsrc)
                setTimeout(()=>{
                    this.styleboxs = true;
                });
            },
            imgstyle(item){//点击小面板样式切换面板样式
                console.log(item);
                this.imgstyleswitch(item);
                this.styleboxs = false;
            },
            imgstyles(item){
                this.panelImgstyle(item);
            },
            imgstylelive(){
                this.bgimgstate = this.paneldefaultUrl;
            },
            //精简方法
            imgstyleswitch(item){//小面板样式切换
                this.srcicon = item.iconPath;
                this.bgimgstate = item.panelIconPath;
                this.titstyle = item.name;
                this.imgstyleId = item.uuid;
                this.paneldefaultUrl = item.panelIconPath;
            },
            panelImgstyle(item){//小面板的大面板样式img图片切换
                this.bgimgstate = item.panelIconPath;
            },
            smallPanellist(item){//小面板单个点击列表渲染
                console.log(item);
                this.titlezu = item.title;
                this.srcicon = item.iconPath;
                this.bgimgstate = item.panelIconPath;
                if(item.json.maxminiAttribute.length > 0){
                    this.smallpanel("大面板")
                }
                if(item.json.miniAttribute.length > 0){
                    this.smallpanel("小面板")
                }
                console.log(this.typeList);
                for(var i=0;i<this.typeList.length;i++){
                    if(this.typeList[i].uuid == item.machineTypeId){
                        this.selectItem = this.typeList[i].machineType;
                        this.modelId = this.typeList[i].uuid;
                    };
                }
                let type = this.modelId;
                this.$server.machinemodalgetByType(type).then(data => {
                    console.log(data);
                    this.modelList = data.data.data;
                    console.log(this.modelList);
                    for(var j=0;j<this.modelList.length;j++){
                        if(this.modelList[j].uuid == item.machineModeId){
                            this.selectModel = this.modelList[j].machineModel;
                            this.machineId = this.modelList[j].uuid;
                        };
                    }
                    this.$server.bigpanelgetListByModelId(this.machineId).then(data => {
                        this.big_attributeList = data.data.data;
                        $("#shux ul li input[type=checkbox]").removeAttr("checked");
                        this.shuxinjicheng(item.json.miniAttribute,item.json.maxminiAttribute);
                    }).catch((res)=>{
                        console.log(res);
                    });
                    this.$server.smallpanelgetListByModelId(this.machineId).then(data => {
                        console.log(data.data.data);
                        this.small_attributeList = data.data.data;
                        $("#shux ul li input[type=checkbox]").removeAttr("checked");
                        this.shuxinjicheng(item.json.miniAttribute,item.json.maxminiAttribute);
                    }).catch((res)=>{
                        console.log(res);
                    });
                }).catch((res)=>{
                    console.log(res);
                });
            },
            typeListFn(){//请求设备类型列表 typeList
                this.$server.machinetype().then(data => {
                    console.log(data.data.data);
                    this.typeList = data.data.data;
                    this.selectItem = this.typeList[0].machineType;
                    this.modelId = this.typeList[0].uuid;
                    this.modelListFn(this.modelId);
                }).catch((res)=>{
                    console.log(res);
                });
            },
            modelListFn(modelId){//机器型号获取方法
                this.modelList = [];
                let type = modelId;
                this.$server.machinemodalgetByType(type).then(data => {
                    console.log(data);
                    this.modelList = data.data.data;
                    this.selectModel = this.modelList[0].machineModel;
                    this.machineId = this.modelList[0].uuid;
                    this.big_attributeListFn(this.machineId);
                    this.small_attributeListFn(this.machineId);
                }).catch((res)=>{
                    console.log(res);
                });
            },
            big_attributeListFn(machineId){//获取大面板属性信息
                let type = machineId;
                console.log(type)
                this.big_attributeList = [];
                this.$server.bigpanelgetListByModelId(type).then(data => {
                    console.log(data.data.data);
                    this.big_attributeList = data.data.data;
                }).catch((res)=>{
                    console.log(res);
                });
            },
            small_attributeListFn(machineId){//获取小面板属性信息
                let type = machineId;
                this.small_attributeList = [];
                this.$server.smallpanelgetListByModelId(type).then(data => {
                    console.log(data.data.data);
                    this.small_attributeList = data.data.data;
                }).catch((res)=>{
                    console.log(res);
                });
            }

        },
        mounted:async function(){
            drag('definePanel-drag', '')
            this.Zindex = this.index;
            this.typeList=["卷烟机","包装机主机","包装机辅机"];
            $('body').on('click', ()=>{
                if(this.styleboxs == true){
                    this.styleboxs = false;
                }
            });
            $("#shux ul.checkbox_list_big li input[type=checkbox]").removeAttr("checked");
            $("#shux ul.checkbox_list_small li input[type=checkbox]").removeAttr("checked");
            let gbdefultdata = {};
            this.$http("./static/api/api.json",gbdefultdata, 'get').then(async (data) => {// 请求本地，背景名称
                this.httpdata = data.baseroot;
                console.log(this.httpdata);
                this.resourcesimgSrc = this.httpdata.StyleFileManagementService+this.resourcesimgSrc;
                let dataopennew={};
                await this.$http(this.httpdata.DataitemFileManagementService+'/DataitemFile-Management-Service/getIMachineClassList/test',dataopennew, 'get').then((res) => {
                    this.dataopen = JSON.parse(res.data);
                    for(var i = 0;i<this.dataopen.length;i++){
                        if(this.dataopen[i].name == "卷烟机"){
                            this.modelList = [];
                            this.modelList = this.dataopen[i].list;
                            // console.log(this.modelList);
                            this.selectModel = this.modelList[0].name;
                        }
                    }
                }).catch((res)=>{});
            }).catch((res)=>{});
            //请求小面板样式列表
            this.$server.smallpanelstylelist().then(data => {
                this.bGimglist = data.data.data;
                console.log(this.bGimglist);
                this.imgstyleswitch(this.bGimglist[0])
            }).catch((res)=>{
                console.log(res);
            });
            //请求小面板列表
            this.$server.smallpanellist().then(data => {
                console.log(data);
                this.smallimglist = data.data.data;
                for(var i=0;i<this.smallimglist.length;i++){
                    this.smallimglist.dataJson = JSON.parse(this.smallimglist.dataJson);
                    this.smallimglist[i].selectedImg = false;
                }
                console.log(this.smallimglist,"this.smallimglist");
            }).catch((res)=>{
                console.log(res);
            });
            this.typeListFn();//请求设备类型列表 typeList
        }
    }
</script>
<style lang="less" scoped>
.box {
    position: absolute;
}
.definePanel{
    position: absolute;
    top: calc(50% - 210px);
    left: calc(50% - 300px);
    width: 600px;
    min-width:400px;
    height: 435px;
    min-height: 435px;
    border: 1px solid #dcdcdc;
    background: #535353;
    box-shadow: 5px 5px 15px rgb(104, 98, 98);
    overflow: hidden;
    .selectedImg{
        border: 1px solid red!important;
        box-sizing: border-box;
    }
    input:focus{
        outline:none;
        border: 1px solid #0096ff;
    }
    select:focus{
        outline:none;
        border: 1px solid #0096ff;
    }
    .b_title{
        display: flex;
        height: 40px;
        width: 100%;
        line-height: 40px;
        background: #292929;
        .tit_left{
            width: 97%;
            height: 100%;
            margin-left: 10px;
            font-size: 16px;
            font-weight: 500;
            color: #bbbbbb;
        }
        .tit_right{
            width: 10%;
            height: 100%;
            line-height: 40px;
            margin-right: 10px;
            margin-top: -2px;
            text-align: right;
            img{
                width: 14px;
                height: 14px;
                background: #292929;
            }
        }
    }
    .panel_cent{
        width: 600px;
        min-width: 400px;
        height: 390px;
        overflow: hidden;
        .el_centUl{
            width: 570px;
            height: 99%;
            margin-left: 15px;
            .styleimgT{
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                height: 72px;
                margin-top: 10px;
                border: 4px solid #454545;
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
                    box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
                    background-color: #fff;
                    /*滚动条的背景颜色*/
                }
                img{
                    width: 30px;
                    height: 30px;
                    border: 1px solid #454545;
                    box-sizing: border-box;
                }
                .selectclick{
                    border: 1px solid red!important;
                }
            }
            .title_save,.type_lie{
                width: 100%;
                margin-top: 10px;
                height: 27px;
                line-height: 27px;
                color: #ffff;
                span{
                    font-size: 14px;
                }
                select,input{
                    width: 240px;
                    height: 22px;
                    padding-left: 3px;
                    font-size: 15px;
                    background: #363636;
                    border: 1.3px solid #0673CC;
                    box-sizing: border-box;
                }
                button{
                    width: 84px;
                    height: 27px;
                    margin-left: 36px;
                    line-height: 27px;
                    background: #535353;
                    border: 1px solid #fff;
                    border-radius: 20px;
                    color: #fff;
                    box-sizing: border-box;
                }
                button:hover{
                    background:#fff;
                    color: #000
                }
            }
            .type_lie{
                select{
                    height: 22px;
                    line-height: 22px;
                    padding: 0;
                    font-size: 14px;
                }
            }
            .style_bg{
                width: 100%;
                height: 36px;
                display: flex;
                margin-top: 10px;
                color: #fff;
                img{
                    width: 36px;
                    height: 36px;
                    display: inline-block;
                    margin-left: 5px;
                }
                .styleimg_bg{
                    width: 131px;
                    height: 22px;
                    display: flex;
                    margin-top: 4px;
                    margin-left: 10px;
                    line-height: 20px;
                    border: 1px solid #747474;
                    border-radius: 5px;
                    box-sizing: border-box;
                    img{
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        margin: 0;
                        padding: 0;
                        border: 1px solid #414141;
                        box-sizing: border-box;
                        border-radius: 3px;
                    }
                    input[type=text]{
                        width: 109px;
                        height: 20px;
                        padding-left: 4px;
                        background: rgba(0,0,0,0.2);
                        border: none;
                        box-sizing: border-box;
                        overflow: hidden;
                    }
                }
                .stylebox{
                    position: absolute;
                    top: 40px;
                    left: 75px;
                    width: 238px;
                    height: 157px;
                    background: #545454;
                    border: 2px solid #414141;
                    box-sizing: border-box;
                    z-index: 2;
                    .bgbor{
                        margin: 10px;
                        width: 216px;
                        height: 134px;
                        border: 1px solid #414141;
                        box-sizing: border-box;
                        background: #4D4D4D;
                        span{
                            display: inline-block;
                            padding: 0;
                            margin: 0;
                            margin-left: 2px;
                            width: 32px;
                            height: 32px;
                            img{
                                width: 100%;
                                height: 100%;
                                border: 1px solid #434343;
                            }
                        }
                    }
                }
            }
            .SX_checkbox{
                width: 100%;
                height: 120px;
                color: #fff;
                ul.checkbox_list_big,ul.checkbox_list_small{
                    width: 99%;
                    height: 115px;
                    // display: flex;
                    // flex-wrap: wrap;
                    background-color: #454545;
                    border: 3px solid #454545;
                    border-left: 7px solid #454545;
                    box-sizing: border-box;
                    // border-radius: 5px;
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
                        box-shadow: inset 0 0 0px rgba(45, 162, 253, 0.3);
                        background-color: rgba(118,118,118);//滚动条的颜色
                        /*滚动条的背景颜色*/
                    }
                    li{
                        position: relative;
                        display: inline-block;
                        width: 25%;
                        height: 22px;
                        line-height: 15px;
                        // border: 1px solid #fff;
                        // box-sizing: border-box;
                        input[type=checkbox]{
                            position: absolute;
                            top: 1px;
                            left: 0;
                            margin-right: 10px;
                            background: rgba(0,0,0,0.2);
                            border: 1px solid #707070;
                            border-radius: 3px;
                            box-sizing: border-box;
                        }
                        label{
                            width: 115px;
                            display: inline-block;
                            margin-left: 20px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                }
                ul.checkbox_list_big{
                    background:#383838;
                    border-color:#383838;
                }
                ul.checkbox_list_small{
                    background:#454545;
                    border-color:#454545;
                }
                ul.Bs_panel{
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    li{
                        width: 12%;
                        height: 30px;
                        text-align: center;
                        background-color: #454545;
                        border-top-right-radius: 10px;
                        border-top-left-radius: 10px;
                    }
                    // li:hover{
                    //     background-color: #0673CC;
                    //     color: #fff;
                    // }
                    .BS_liHover{
                        background-color: #0673CC;
                        color: #fff;
                    }
                }
            }
        }
    }
    .title_save{
        position: relative;
    }
    .bgimgstate{
        position: absolute;
        top: 50px;
        left: 360px;
        width: 150px;
        height: 100px;
        text-align: center;
        // border: 1px solid red;
    }
}
</style>
