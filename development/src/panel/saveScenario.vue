<template>
    <div class="saveScenario-drag" >
       <div class="box saveScenario popup-box"  data-drag="true" :style="{'z-index': Zindex}" @click="boxZindex">
            <h1 class="b_title darg-title">
            <p class="tit_left">发布场景</p>
            <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
                <img src="../../static/img/N-dele.png" v-if="Paneled">
                <img src="../../static/img/N-d-select.png" v-else @click="noneother()">
            </p>
        </h1>
        <div class="panel_cent">
            <ul class="el_centUl">
                <li class="title_save">
                    <span>场景名称: </span>
                    <input type="text" v-model="titlezu"/>

                </li>
                <li class="style_textarea">
                    <p>
                        <span>场景描述: </span>
                        <textarea class="textarea" v-model="saveExplain"></textarea>
                    </p>
                    <div class="Screenshots">
                        <span class="spantit">场景截屏: </span>
                        <div @click="switchImg()">
                            <img :src="canvasUrl || './static/img/Upload_btn.png'" alt=""/>
                        </div>
                        <span class="zhushi">注:鼠标选择角度点击相机进行截图</span>
                    </div>
                </li>
                <li class="title_said">
                    <span>控制方式: </span>
                    <div  v-for="(item, index) in resourceslist" :key="index">
                        <input type="radio" :key="index" @click="radio(item.key)" :checked="index == 0" name="radios">
                        <label></label>
                        <span :for="item.name" :title="item.name">{{item.name}}</span>
                    </div>
                </li>
                <!-- <li class="title_Num">
                    <span>接口形式: </span>
                    <select v-model="NumItem" @change="NumFn()" class="selectla">
                        <option :value = "1">restful</option>
                        <option :value = "2">normal</option>
                    </select>
                </li> -->

            </ul>
        </div>
        <div class="btn_save">
            <button @click="titSave()">保存</button>
        </div>
       </div>
    </div>
</template>
<script>
// import api from '../../static/api/api.js'
import FileSaver from 'file-saver'
import html2canvas from 'html2canvas'
import drag from '../../static/js/drag'
import {server} from '../assets/js/http-server';
export default {
    name:'saveScenario',
    props:["openNI","manageitemdata", "index","type_url","comebacked"],
    data(){
        return{
            NumItem:"2",//下拉框实时选中项
            saveScenHide:true,
            Paneled:true,
            titlezu:'',
            saveExplain:"场景说明",
            resourceslist:[{name:'第一人称',key:1},{name:'第三人称',key:3}],//属性list
            VR_said:1,//搜索资源输入框默认绑定数据
            clientJSON:{
                sceneName:"",
                firstPersonPos:[],
                BuildingInfos:[],
                actions:[],
                echartsURL:"",
                label:[]
            },
            Zindex:0,
            httpdata:'',
            canvasUrl: '',
            openitemId:'',
        }
    },
    watch:{
        manageitemdata(){
            if(this.manageitemdata.sceneName !== "" && this.manageitemdata.sceneName !== undefined && this.manageitemdata.sceneName !== null){
                console.log(this.manageitemdata);
                this.titlezu = this.manageitemdata.sceneName;
                this.saveExplain = this.manageitemdata.description;
                $(".title_save input").attr("readonly",true);//打开场景，信息需要服务器检索，不允许修改
                $(".style_textarea textarea").attr("readonly",true);
            }

        },
        openNI(){
            if(this.openNI.name !== "" && this.openNI.name !== undefined && this.openNI.name !== null){
                console.log(this.openNI);
                this.titlezu = this.openNI.name;
                this.saveExplain = this.openNI.info;
                $(".title_save input").attr("readonly",true);//打开场景，信息需要服务器检索，不允许修改
                $(".style_textarea textarea").attr("readonly",true);
            }
        },
        type_url(){
            // console.log(this.type_url);
            this.NumItem = this.type_url;
        },
    },
    methods:{
        switchImg(){//点击截取保存方法
            // console.log(this.testtime());
            if (this.canvasUrl) return
            html2canvas(document.getElementById('viewport'), {
                useCORS: true,
                backgroundColor:null
            }).then((canvas) => {
                // console.log(canvas.toDataURL(), 1111111);
                // this.canvasUrl = canvas.toDataURL();
                let imgbase = canvas.toDataURL('image/jpeg', 0.5);
                this.canvasUrl = imgbase;
                // var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                // if (newSceneData) {
                //     newSceneData.scene3D.info.sceneimage = this.canvasUrl;
                // }
                // console.log(newSceneData);
                // localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            });
        },
        NumFn(){//下拉框改变
            console.log(this.NumItem);
        },
        boxZindex () {
            let arr = []
            $('.popup-box').each(function(item){
                arr.push(Number($(this).css('z-index')))
            })
            this.Zindex = Math.max(...arr)+1
        },
        R_selectStyle(){//图片显示选中
            this.Paneled = false;
        },
        R_outStyle(){//图片显示不选中
            this.Paneled = true;
        },
        noneother(){//点击X,隐藏整个弹框
            this.saveScenHide = false;
            this.$emit('closepanel', "发布场景");
        },
        radio(value){
            console.log(value);
            this.VR_said = value;
        },
        convertJsonData(json,id){
            console.log(json);
            let action = [];
            let needAttr_a = [],needAttr_b=[];
            let gbdefultdata = {} // 请求参数
            const res = json;
            needAttr_a=[];
            needAttr_b=[];
            for(var i = 0;i<res.length;i++){
                if(res[i].id == "mechinestatePanel"){
                    console.log('mechinestatePanel');
                    let  needAttr_a_data=[];
                    needAttr_a = res[i].datas;
                    for (let y=0;y<needAttr_a.length;y++ ) {
                        let Yvrkey = needAttr_a[y].vrkey;
                        let mcid = needAttr_a[y].mcid;
                        let sckey = needAttr_a[y].sckey;
                        let vrkey = needAttr_a[y].vrkey.split("-");
                        // let a = vrkey[0].substr(0,1)
                        // let b = vrkey[0].substr(1,vrkey[0].length);
                        // b=Number(b)
                        let a = 'NBNY_1_';
                        let b = vrkey[0];
                        let c = vrkey[1];
                                if(c.indexOf('_')>0){
                            mcid = a+"BZ_"+b;
                            var d = c.split("_")[1];
                            if(d=="CHCTCV"||d== "C800"){
                                sckey = "辅机_机器状态"
                            }else if(d=="GDX2"||d=="GDX3000"||d=="GDX1"||d=="FX2"||d=="GDX6S"||d=="ZB48"||d=="Focke350"){
                                sckey = "小包机_机器状态"
                            }
                                }
                            else{
                        if(c=="CHCTCV"||c== "C800"||c=="GDX2"||c=="GDX3000"||c=="GDX1"||c=="FX2"||c=="GDX6S"||c=="ZB48"||c=="Focke350"){
                            mcid = a+"BZ_"+b;
                            if(c=="CHCTCV"||c== "C800"){
                                sckey = "辅机_机器状态"
                            }else if(c=="GDX2"||c=="GDX3000"||c=="GDX1"||c=="FX2"||c=="GDX6S"||c=="ZB48"||c=="Focke350"){
                                sckey = "小包机_机器状态"
                            }
                        }else if(c=="PROTO70"||c=="PROTOM5"||c=="PROTOS2"||c=="PASSIM"||c=="ZJ116"||c=="ZJ118"||c=="GD121"||c=="GD121P"){
                            mcid = a+"JJ_"+b;
                            sckey = "机器状态";
                        }
                    }
                        needAttr_a_data.push({
                            vrkey: Yvrkey,
                            mcid: mcid,
                            sckey: sckey,
                            value: 0,

                        })
                    }
                    res[i].datas = needAttr_a_data;
                    action.push(res[i]);
                }else if(res[i].type == "max-panel"||res[i].type == "min-panel"){
                    console.log('max-panel');
                    let mcid='',sckey='', needAttr_b_data=[];
                    needAttr_b = res[i].datas;
                    for (let y=0;y<needAttr_b.length;y++ ) {
                        let Yvrkey = needAttr_b[y].vrkey;
                        let vrkey =needAttr_b[y].vrkey.split("-");
                        let propName = needAttr_b[y].propName;
                        // let a = vrkey[0].substr(0,1)
                        // let b = vrkey[0].substr(1,vrkey[0].length);
                        // b=Number(b)
                        let a = 'NBNY_1_';
                        let b = vrkey[0];
                        let c = vrkey[1];
                        let d = vrkey[2];
                        if(c.indexOf('_')>0){
                            //说明是一个辅机
                            mcid  = a+"BZ_"+b;
                            sckey = d;
                        }else{
                        if(c=="CHCTCV"||c== "C800"||c=="GDX2"||c=="GDX3000"||c=="GDX1"||c=="FX2"||c=="GDX6S"||c=="ZB48"||c=="Focke350"){
                            mcid = a+"BZ_"+b;
                            sckey = d;
                        }else if(c=="PROTO70"||c=="PROTOM5"||c=="PROTOS2"||c=="PASSIM"||c=="ZJ116"||c=="ZJ118"||c=="GD121"||c=="GD121P"){
                            mcid = a+"JJ_"+b;
                            sckey = d;
                        }
                        }
                        needAttr_b_data.push({
                            vrkey: Yvrkey,
                            mcid: mcid,
                            sckey: sckey,
                            value: 0,
                             propName:propName,
                        })
                    }
                    res[i].datas = needAttr_b_data;
                        action.push(res[i]);
                }else if(res[i].id == "mechinewarningstatePanel"){
                    console.log('mechinewarningstatePanel');
                    let  needAttr_a_data=[];
                    needAttr_a = res[i].datas;
                    for (let y=0;y<needAttr_a.length;y++ ) {
                        let Yvrkey = needAttr_a[y].vrkey;
                        let mcid = needAttr_a[y].mcid;
                        let sckey = needAttr_a[y].sckey;
                        let vrkey = needAttr_a[y].vrkey.split("-");
                         let propName = needAttr_a[y].propName;
                          // let a = vrkey[0].substr(0,1)
                        // let b = vrkey[0].substr(1,vrkey[0].length);
                        // b=Number(b)
                        let a = 'NBNY_1_';
                        let b = vrkey[0];
                        let c = vrkey[1];
                        // console.log(c);
                        if(c.indexOf('_')>0){
                            //说明是一个辅机
                            mcid  = a+"BZ_"+b;
                            sckey = "机器状态信息";
                        }else{
                        if(c=="CHCTCV"||c== "C800"||c=="GDX2"||c=="GDX3000"||c=="GDX1"||c=="FX2"||c=="GDX6S"||c=="ZB48"||c=="Focke350"){
                            mcid = a+"BZ_"+b;
                            if(c=="CHCTCV"||c== "C800"){
                                sckey = "机器状态信息"
                            }else if(c=="GDX2"||c=="GDX3000"||c=="GDX1"||c=="FX2"||c=="GDX6S"||c=="ZB48"||c=="Focke350"){
                                sckey = "机器状态信息"
                            }
                        }else if(c=="PROTO70"||c=="PROTOM5"||c=="PROTOS2"||c=="PASSIM"||c=="ZJ116"||c=="ZJ118"||c=="GD121"||c=="GD121P"){
                            mcid = a+"JJ_"+b;
                            sckey = "机器状态信息";
                        }
                        }
                        needAttr_a_data.push({
                            vrkey: Yvrkey,
                            mcid: mcid,
                            sckey: sckey,
                            value: 0,
                             propName:propName,
                        })
                    }
                    res[i].datas = needAttr_a_data;
                }
            }
        },
        successdata(newidadd){//请求成功执行
            localStorage.setItem('public',true);
            this.$emit('closepanel', "save");
            alert("保存成功！");
            if(this.comebacked == true){
                let login_3 = true;
                let host = location.host
                this.$router.replace({path: '/manage', query: {'login_3': login_3, 'type': 'reload'}});
            }else if(this.comebacked == false){
                 window.open(this.httpdata.ViewerServer+'/viewer/index.html?scenename='+newidadd+'&controls='+this.VR_said+''+"&type="+this.NumItem);
                 setTimeout(function(){
                    window.open('http://192.168.89.213:8081/convertJson/index.html?scenename='+newidadd);
                 },2000)

            }
        },
        faildata(newidadd){//请求失败执行
            setTimeout(() => {
                if(this.comebacked == true){
                    let login_3 = true;
                    let host = location.host
                    this.$router.replace({path: '/manage', query: {'login_3': login_3, 'type': 'reload'}});
                }else if(this.comebacked == false){
                    window.open(this.httpdata.ViewerServer+'/viewer/index.html?scenename='+newidadd+'&controls='+this.VR_said+''+"&type="+this.NumItem);
                      setTimeout(function(){
                    window.open('http://192.168.89.213:8081/convertJson/index.html?scenename='+newidadd);
                 },2000)
                }
            }, 2000);
        },
        titSave(){//点击保存
            let realtime = this.testtime();
            // console.log(realtime);//点击保存时的实际时间
            let idadd,newidadd,imageName;
            idadd = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            newidadd = (idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
            imageName = "image"+(idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
            // console.log(imageName);
            //  /updateSceneSettings/{type}/{name}/{info}/JsonData
            //  this.chuanzhiUrl+type+"/"+name+"/"+this.selectItem+"/JsonData"
            if(this.saveExplain !== "" && this.titlezu !== ""){
                var type = 'test';
                var name = this.titlezu;
                var info = this.saveExplain;
                this.$nextTick(()=>{
                    var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                    if (newSceneData) {
                        newSceneData.scene3D.info.name = this.titlezu;
                        newSceneData.scene3D.info.time = realtime;
                    }
                    console.log(newSceneData);
                    localStorage.setItem('sceneData', JSON.stringify(newSceneData));
                });
                // return
                setTimeout(()=> {
                    var JsonData =  JSON.parse( localStorage.getItem('sceneData'));
                    let currentscene = {
                        id: newidadd,
                        date: realtime,
                        imagedata: this.canvasUrl,
                        name: this.titlezu,
                        info: this.saveExplain,
                        image:imageName,
                        scenedata:JsonData
                    };
                    if(this.openitemId !=="" && this.manageitemdata !== undefined){
                        console.log("再次编辑");
                        currentscene.id = '';
                        newidadd='';
                        currentscene.id = this.openitemId;
                        newidadd = this.openitemId;
                        currentscene.image = '';
                        currentscene.image = this.manageitemdata.image;
                        if (this.canvasUrl == "" || this.canvasUrl == null || this.canvasUrl == undefined) {
                            currentscene.imagedata = "null";
                        }
                        let gbdefultdata = {
                            description:this.saveExplain,
                            sceneName:this.titlezu,
                            base64Img:this.canvasUrl,
                            uuid:this.openitemId
                        };
                        if(this.NumItem == "2"){
                            console.log(gbdefultdata);
                            this.$server.editscene(gbdefultdata).then(data => {
                                this.successdata(data.data);
                                let uuid = data.data,gbdefultdata_1={},gbdefultdata_2={};

                      let currentscenedata = currentscene;
                    // console.log(JSON.parse(currentscene));
                    console.log(currentscenedata);
                    console.log(JsonData);
                    this.toJSONC(JsonData,uuid);
                    let action = JsonData.actions;
                    action.filter(item => {       // 用于下载当前对象的所有的数据配置文件
                    if(item.datas){
                        item.datas.filter(data=>{
                            delete data.mcid;
                            delete data.sckey;
                            delete data.unit;
                        })
                        }
                    })
                    this.convertJsonData(action,uuid)   // 自动转出规则定义好的格式


                                gbdefultdata_1 = {//data/add
                                    sceneConfId:uuid,
                                    json:JsonData
                                };
                                gbdefultdata_2={
                                    sceneConfId:uuid,
                                    json:JsonData
                                }
                                this.$server.scenedataadd(gbdefultdata_1).then(data => {//添加场景数据配置
                                    console.log(data);
                                // 同时将数据的配置文件发送到服务器
                                }).catch((res)=>{
                                });
                                this.$server.sceneinfoadd(gbdefultdata_2).then(data => {//添加场景配置信息
                                    console.log(data);
                                // 同时将数据的配置文件发送到服务器
                                }).catch((res)=>{
                                });
                            // 同时将数据的配置文件发送到服务器
                            }).catch((res)=>{
                                console.log(res);
                                this.faildata(newidadd);
                            });
                        }else if(this.NumItem == "1"){//Data-Interface-Service-Restful/updateData/JsonData
                            this.$server.editscene(gbdefultdata).then(data => {
                            this.successdata(data.data);
                                let uuid = data.data,gbdefultdata_1={};
                      let currentscenedata = currentscene;
                    // console.log(JSON.parse(currentscene));
                    console.log(currentscenedata);
                    console.log(JsonData);
                    this.toJSONC(JsonData,uuid);
                    let action = JsonData.actions;
                    action.filter(item => {       // 用于下载当前对象的所有的数据配置文件
                    if(item.datas){
                        item.datas.filter(data=>{
                            delete data.mcid;
                            delete data.sckey;
                            delete data.unit;
                        })
                        }
                    })
                    this.convertJsonData(action,uuid)   // 自动转出规则定义好的格式
                                gbdefultdata_1 = {
                                    sceneConfId:uuid,
                                    json:jsonData
                                };
                                this.$server.sceneinfoadd(gbdefultdata_1).then(data => {
                                    console.log(data);
                                // 同时将数据的配置文件发送到服务器
                                }).catch((res)=>{
                                });
                            // 同时将数据的配置文件发送到服务器
                            }).catch((res)=>{
                                console.log(res);
                                this.faildata(newidadd)
                            });
                        }
                    }else {
                        let gbdefultdata = {
                            description:this.saveExplain,
                            sceneName:this.titlezu,
                            base64Img:this.canvasUrl
                        };
                        if(this.NumItem == "2"){
                            console.log(gbdefultdata);
                            this.$server.addscene(gbdefultdata).then(data => {
                              console.log(data.data)
                           this.successdata(data.data);
                        let currentscenedata = currentscene;
                    // console.log(JSON.parse(currentscene));
                    console.log(currentscenedata);
                    console.log(JsonData);
                    this.toJSONC(JsonData,data.data);
                    let action = JsonData.actions;
                    action.filter(item => {       // 用于下载当前对象的所有的数据配置文件
                    if(item.datas){
                        item.datas.filter(data=>{
                            delete data.mcid;
                            delete data.sckey;
                            delete data.unit;
                        })
                        }
                    })
                    this.convertJsonData(action,data.data)   // 自动转出规则定义好的格式
                                console.log(data);
                                let uuid = data.data,gbdefultdata_1={},gbdefultdata_2={};
                                gbdefultdata_1 = {//data/add
                                    sceneConfId:uuid,
                                    json:JsonData
                                };
                                gbdefultdata_2={
                                    sceneConfId:uuid,
                                    json:JsonData
                                }
                                this.$server.scenedataadd(gbdefultdata_1).then(data => {//添加场景数据配置
                                    console.log(data);
                                // 同时将数据的配置文件发送到服务器
                                }).catch((res)=>{
                                });
                                this.$server.sceneinfoadd(gbdefultdata_2).then(data => {//添加场景配置信息
                                    console.log(data);
                                // 同时将数据的配置文件发送到服务器
                                }).catch((res)=>{
                                });
                            // 同时将数据的配置文件发送到服务器
                            }).catch((res)=>{
                                this.faildata(newidadd)
                            });
                        }else if(this.NumItem == "1"){//Data-Interface-Service-Restful/updateData/JsonData
                            this.$server.addscene(gbdefultdata).then(data => {
                              console.log(data);
                                 this.successdata(data.data);
                    let currentscenedata = currentscene;
                    // console.log(JSON.parse(currentscene));
                    console.log(currentscenedata);
                    console.log(JsonData);
                    this.toJSONC(JsonData,data.data);
                    let action = JsonData.actions;
                    action.filter(item => {       // 用于下载当前对象的所有的数据配置文件
                    if(item.datas){
                        item.datas.filter(data=>{
                            delete data.mcid;
                            delete data.sckey;
                            delete data.unit;
                        })
                        }
                    })
                    this.convertJsonData(action,data.data)   // 自动转出规则定义好的格式
                                let uuid = data.data,gbdefultdata_1={};
                                gbdefultdata_1 = {
                                    sceneConfId:uuid,
                                    json:jsonData
                                };
                                this.$server.sceneinfoadd(gbdefultdata_1).then(data => {
                                    console.log(data);
                                // 同时将数据的配置文件发送到服务器
                                }).catch((res)=>{
                                });
                                // this.sceneinfoadd
                            // 同时将数据的配置文件发送到服务器
                            }).catch((res)=>{
                                this.faildata(newidadd)
                            });
                        }
                    }
                    // // console.log(currentscene);
                    // // let currentscenedata = JSON.stringify(currentscene);
                    // let currentscenedata = currentscene;
                    // // console.log(JSON.parse(currentscene));
                    // console.log(currentscenedata);
                    // console.log(JsonData);
                    // this.toJSONC(JsonData,currentscenedata.id);
                    // let action = JsonData.actions;
                    // action.filter(item => {       // 用于下载当前对象的所有的数据配置文件
                    // if(item.datas){
                    //     item.datas.filter(data=>{
                    //         delete data.mcid;
                    //         delete data.sckey;
                    //         delete data.unit;
                    //     })
                    //     }
                    // })
                    // this.convertJsonData(action)   // 自动转出规则定义好的格式
                }, 100);
            }
        },
        toJSONC(object,idJson){
            console.log(object);
             console.log(idJson);
            var echartsURL = ''; // 当前链接地址加上当前的id
            var actions = '';
            var dataReflashURL='';
            var stateColor = '';
            if(object.length < 0 )return;
                if( object.scene3D.sceneData.echarts && object.scene3D.sceneData.echarts.length > 0){
                echartsURL = this.httpdata.ViewerServer+'/echartsviewer/index.html?scenename='+idJson;
            }
            if(object.scene3D.sceneData.API.length > 0){
                object.scene3D.sceneData.API.filter(api => {
                    if(api.checked){
                       dataReflashURL = api.url;
                    }
                })
            }
            if(object.scene3D.sceneData.StateColor){
                stateColor = object.scene3D.sceneData.StateColor;
            }

            object.scene3D.object.filter(item => {
                var clientPath = item.Path.substring(item.Path.lastIndexOf('/')+1,item.Path.length - 4);
                var clientName = item.Name;
                var clienPosition = item.Position;
                var clientRotationY= item.rotationY;
                var clientDefaultName = item.DefaultName.substring(0,item.DefaultName.indexOf('TP'));
                console.log(clientDefaultName);
                // var children = item.modelContent.data;
                var children = [];
                var childrenContent = [];

                if(item.modelContent.data.length > 0){
                for(var i=0;i<item.modelContent.data.length;i++){
                    if(item.modelContent.data[i].machineType!="玻璃"){
                        if(item.modelContent.data[i].machineType.indexOf('管道') > -1){
                           var machine = item.modelContent.data[i].machineType.slice(3,item.modelContent.data[i].machineType.length);
                           children.push(machine);
                           childrenContent.push(null);
                        }else{
                            children.push(item.modelContent.data[i].ModelChildrenMechineType);
                            var content = {
                                machineType:item.modelContent.data[i].machineType,
                                name:item.modelContent.data[i].Name,
                                childrenContent:item.modelContent.data[i].EventContent,
                                EventMiniPanelName:item.modelContent.data[i].EventMiniPanelName,
                                EventMiniPanelBackground:item.modelContent.data[i].EventMiniPanelBackground,
                                ModelChildrenMechineType:item.modelContent.data[i].ModelChildrenMechineType,
                                machineBelondName:item.modelContent.data[i].machineBelondName,
                                isShowMaxiPanel:item.modelContent.data[i].isShowMaxiPanel,
                            }
                            childrenContent.push(content);
                        }

                    }
                }
            }

            //   var k = new THREE.Euler();
            //                 k.copy(item.rotationForClient);
            //                 // // k.z *= -1;
            //                 // k.y *=-1 +  Math.PI;

            //                    k.z *= -1;
            //                    k.y -= Math.PI;


            //                 var qk = new THREE.Quaternion(0, 0, 0, 0);
            //                 qk.setFromEuler(k);
            //                 console.log(qk);


            //                 var qk_x = - qk.x;
            //                   var qk_y = qk.y;
            //                 var qk_z = qk.z;
            //                  var qk_w = -qk.w;
            //                 qk.x = qk_x;
            //                 qk.y = qk_w;
            //                 qk.z = qk_z;
            //                 qk.w = qk_y;
            console.log(item.rotationForClient);
            if(item.rotationForClient == undefined){
                console.log(item.rotationForClient);
                item.rotationForClient = {"_x":0,"_y":-1,"_z":0,"_w":0}
            }
            console.log(item);
            var clienItem = {
                path:clientPath,
                name:clientName,
                defaultName:clientDefaultName,
                child:children,
                eventContent:childrenContent,
                x:clienPosition[0] / 1000,
                y:clienPosition[1] / 1000,
                z:-clienPosition[2] / 1000,
                rx:0,
                ry:item.rotationForClient,
                rz:0,
                sx:1,
                sy:1,
                sz:1
            }
            this.clientJSON.BuildingInfos.push(clienItem);
            })
            // 添加label标签的unity复现
            console.log(object);
            if(object.scene3D.label.length > 0){

        object.scene3D.label.filter(label => {
            var clientLabel = {
                id:label.id,
                name:label.name,
                path:label.path,
                position:{x:label.position.x / 1000,y:label.position.y / 1000,z:-label.position.z / 1000},
                type:label.type
              }
  console.log(clientLabel);
                this.clientJSON.label.push(clientLabel);
              })
            }

           //  this.clientJSON.actions = object.actions; // 03-17 aciton 数据用不着
            this.clientJSON.dataUrl = dataReflashURL+idJson;
            this.clientJSON.echartsURL = echartsURL;
            this.clientJSON.sceneName = 'client'+this.titlezu;
            this.clientJSON.state = stateColor;
            console.log(this.clientJSON);
            console.log(idJson);
            var type = 'test';
            var name = 'client_'+idJson;
            var info = this.saveExplain;
            var params = {
              dataJson:JSON.stringify( this.clientJSON),
              sceneConfId:idJson
            }
            console.log(params);
            this.$server.saveUnityJsonData(params).then((res)=> {   //
              console.log(res);
            })
            // this.$http(this.httpdata.SceneFileManagementService+'/SceneFile-Management-Service/updateSceneSettings/'+type+'/'+name+'/'+info
            // +'/JsonData',this.clientJSON,  'POST').then((res) => {
            //     console.log(res);
            // // 同时将数据的配置文件发送到服务器
            // }).catch((res)=>{});
        },
        testtime(){
            var dataT = new Date();
            var y = dataT.getFullYear();
            var m = dataT.getMonth()+1;
            var d = dataT.getDate();
            var h = dataT.getHours();
            var min = dataT.getMinutes();
            var s = dataT.getSeconds();
            var str=y+'-'+(m<10?('0'+m):m)+'-'+(d<10?('0'+d):d)+' '+(h<10?('0'+h):h)+':'+(min<10?('0'+min):min)+':'+(s<10?('0'+s):s);
            return str
        }
    },
    mounted:function(){
        drag('saveScenario-drag', '')
        console.log(this.comebacked);
        let gbdefultdata = {};
        this.$http("./static/api/api.json",gbdefultdata, 'get').then((data) => {// 请求本地，背景名称
            this.httpdata = data.baseroot;
            console.log(this.httpdata);
        }).catch((res)=>{});
        this.Zindex = this.index;
        console.log(this.openNI);
        // console.log(this.type_url);
        if(this.type_url !== "" || this.type_url !== undefined || this.type_url !== null){
            this.NumItem = this.type_url;
        }
        if(this.openNI.name !== "" && this.openNI.name !== undefined){
            console.log(this.openNI);
            this.titlezu = this.openNI.name;
            this.saveExplain = this.openNI.info;
            $(".title_save input").attr("readonly",true);//打开场景，信息需要服务器检索，不允许修改
            $(".style_textarea textarea").attr("readonly",true);
        }
        // manageitemdata
        if(this.manageitemdata.sceneName !== "" && this.manageitemdata.sceneName !== undefined){
            console.log(this.manageitemdata);
            this.titlezu = this.manageitemdata.sceneName;
            this.saveExplain = this.manageitemdata.description;
            this.openitemId="";
            this.openitemId = this.manageitemdata.id;
            $(".title_save input").attr("readonly",true);//打开场景，信息需要服务器检索，不允许修改
            $(".style_textarea textarea").attr("readonly",true);
        }
    }
}
</script>
<style lang="less" scoped>
.box {
    position: absolute;
}
.saveScenario{
    position: absolute;
    top: calc(50% - 205px);
    left: calc(50% - 415px);
    width: 830px;
    min-width:830px;
    height: 410px;
    min-height: 410px;
    background: #535353;
    overflow: hidden;
    border-radius:6px;
    box-sizing: border-box;
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
        width:830px;
        height:48px;
        background:rgba(194,194,194,1);
        line-height: 48px;
        color: #333333;
        font-size:20px;
        .tit_left{
            width: 96%;
            height: 100%;
            margin-left: 36px;
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
    .panel_cent{
        width: 830px;
        min-width: 830px;
        height: 265px;
        margin-top: 14px;
        border-bottom: 1px solid #6E6F70;
        .el_centUl{
            width: 791px;
            height: 100%;
            margin-left: 39px;
            margin-top: 10px;
            .title_save{
                width: 100%;
                margin-top: 15px;
                height: 27px;
                line-height: 27px;
                color: #ffff;
                span{
                    font-size:16px;
                }
                input{
                    width:321px;
                    height:30px;
                    margin-left: 9px;
                    padding-left: 15px;
                    line-height: 30px;
                    background:rgba(69,69,69,1);
                    border-radius:6px;
                    border: none;
                }
            }
            .style_textarea{
                display: flex;
                width: 100%;
                height: 52%;
                margin-top: 32px;
                color: #fff;
                font-size:16px;
                p{
                    width: 55%;
                    span{
                        font-family:Microsoft YaHei;
                        font-weight:400;
                        color:rgba(255,255,255,1);
                        line-height:30px;
                    }
                    .textarea{
                        width:336px;
                        height:130px;
                        margin-left: 9px;
                        background:rgba(69,69,69,1);
                        border-radius:6px;
                        padding-top: 2px;
                        padding-left: 2px;
                        border: none;
                    }
                }
                .Screenshots{
                    position: relative;
                    width: 45%;
                    .spantit{
                        position: absolute;
                        top: 5px;
                        left: 5px;
                    }
                    div{
                        position: absolute;
                        top: 0px;
                        left: 85px;
                        display: inline-block;
                        width: 230px;
                        height: 130px;
                        background:rgba(69,69,69,1);
                        border-radius:6px;
                        box-sizing: border-box;
                        cursor: pointer;
                        img{
                            width: 100%;
                            height: 100%;
                            z-index: -1;
                            border-radius:6px;
                        }
                    }
                    .zhushi{
                        position: absolute;
                        top: 128px;
                        left: 85px;
                        color: #FFF600;
                        font-size:14px;
                    }
                }
            }
            .title_said{
                width: 70%;
                color: #fff;
                display: flex;
                flex-wrap: wrap;
                font-size: 16px;
                span{
                    height: 35px;
                    line-height: 35px;
                }
                div{
                    position: relative;
                    width: 22%;
                    height: 35px;
                    margin-left: 13px;
                    line-height: 40px;
                    input[type=radio]{
                        position: absolute;
                        left: 0px;
                        top: 10px;
                        width: 15px;
                        height: 15px;
                        opacity: 0;
                        z-index: 2;
                    }
                    label{
                        position: absolute;
                        left: 0px;
                        top: 10px;
                        width: 15px;
                        height: 15px;
                        border-radius: 3px;
                        border: 1px solid #999;
                    }
                    span{
                        width: 96%;
                        display: inline-block;
                        margin-left: 20px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    input:checked+label {
                        background-color: #006eb2;
                        border: 1px solid #006eb2;
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
            .title_Num{
                width: 70%;
                height: 35px;
                line-height: 35px;
                margin-top: 6px;
                color: #fff;
                display: flex;
                flex-wrap: wrap;
                select{
                    width: 180px;
                    height: 22px;
                    margin-top: 6px;
                    margin-left: 13px;
                    padding-left: 3px;
                    font-size: 15px;
                    background: #363636;
                    border: 1.3px solid #0673CC;
                    box-sizing: border-box;
                }
            }
        }

    }
    .btn_save{
        height: 80px;
        width: 100%;
        line-height: 80px;
        font-size: 16px;
        button{
            width:120px;
            height:34px;
            margin-left: 668px;
            background:rgba(56,56,56,1);
            border-radius:6px;
            border: none;
            color: #fff;
        }
        button:hover{
            background: linear-gradient(
                0deg,
                rgba(3, 131, 245, 1),
                rgba(13, 248, 247, 1)
            );
        }
    }
}
</style>
