<template>
    <div class="installBasis">
        <div class="checked_box">
            <p class="incident_2 in_two lip_con danjitai">
                <span class="titfunc">抗锯齿</span>
                <input type="checkbox" id="kangjuchi" @click="kangjuchi()"/>
                <label></label>
            </p>
            <p class="incident_2 in_two lip_con">
                <span class="titfunc">vr模式</span>
                <input type="checkbox" id="vrmoshi" @click="vrmoshi()"/>
                <label></label>
            </p>
        </div>
        <div class="url_box">
            <li class="CPr_contDiv_li">
                <p class="CPr_lip_tit">
                    <span>接口设置</span>
                </p>
            </li>
            <li class="title_Num">
                <span>接口形式 </span>
                <select v-model="NumItem" @change="NumFn()" class="selectla">
                    <option :value="item.key" v-for="(item, key) in UrlList" :key="key">{{item.name}}</option>
                    <!-- <option :value = "2">normal</option> -->
                </select>
            </li>
        </div>
        <div class="url_type">
            <li class="CPr_contDiv_li">
                <p class="CPr_lip_tit">
                    <span>接口类型</span>
                </p>
            </li>
            <li class="title_Num">
                <span>接口名称: </span>
                <input type="text" id="src_Name" v-model="url_name"/>
            </li>
            <li class="title_Num">
                <span>接口地址: </span>
                <input type="text" id="src_local" v-model="url_address"/>
            </li>
            <li>
                <!-- <button @click="test()">测试</button> -->
                <button @click="addUrl()">添加</button>
                <button @click="delUrl()">删除</button>
            </li>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:"installBasis",
        props:["installBasis","showSetData"],
        data(){
            return{
                NumItem:"0",//下拉框实时选中项
                UrlList:[
                    // {name:"restful",key:"0",url:"normal-resive-data",id:""},
                    // {name:"normal",key:"1",url:"restflu-resive-data",id:""},
                ],
                urlselect:"0",
                url_name:"",
                url_address:"",
            }
        },
        watch:{
            showSetData () {
                if (this.showSetData) {
                    let newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                    console.log(newSceneData, 'newSceneData');
                    if (newSceneData) {
                        if(newSceneData.scene3D.sceneData.API !== "" && newSceneData.scene3D.sceneData.API !== undefined) {
                            this.UrlList = newSceneData.scene3D.sceneData.API;
                            this.url_name = this.UrlList[0].name;
                            this.url_address = this.UrlList[0].url;
                        }
                    }
                }
                console.log(this.UrlList);
            },
        },
        methods:{
            NumFn(){//下拉框改变
                console.log(this.NumItem);
                // for(var i=0;i<this.UrlList.length;i++){
                this.url_name = this.UrlList[this.NumItem].name;
                this.url_address = this.UrlList[this.NumItem].url;
                // }
                this.urlselect = this.NumItem;
                this.UrlList[this.NumItem].checked = true;
                this.saveUrlList(this.UrlList[this.NumItem],this.NumItem);
                // this.$emit("install_url",this.NumItem)
            },
            kangjuchi(){//抗锯齿选中事件
                console.log("抗锯齿");
                var checked = $("#kangjuchi").prop('checked');
                if(checked == true) {//选中
                    this.installBasis.setAntialias(true);
                }else if(checked == false){
                    this.installBasis.setAntialias(false);
                }
            },
            vrmoshi(){//vr模式选中事件
                console.log("vr模式");
                var checked = $("#vrmoshi").prop('checked');
                if(checked == true) {//选中
                }else if(checked == false){
                }
            },
            test(){//测试
                console.log(this.urlselect);
            },
            addUrl(){//添加
                console.log(this.urlselect);
                // this.UrlList[]
                let newidadd,idadd,listlength; 
                idadd = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                newidadd = (idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
                listlength = this.UrlList.length+"";
                let data = {
                    name:this.url_name,
                    key:listlength+"",
                    url:this.url_address,
                    id:newidadd,
                    checked:false,
                }
                console.log(data);
                // if()
                for(var l=0;l<this.UrlList.length;l++){
                    if(this.url_name !== this.UrlList[l].name){
                        this.UrlList.push(data);
                        this.saveUrlList(data);
                        this.urlselect = listlength;
                        return
                    }else if(this.url_name == this.UrlList[l].name){
                        alert("已有此名称的链接，请重新添加!");
                        return
                    }
                }
            },
            delUrl(){//删除
                console.log(this.urlselect);
                this.UrlList.splice(this.urlselect,1);
                this.url_name = this.UrlList[0].name;
                this.url_address = this.UrlList[0].url;
                var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                if (newSceneData) {
                    if(newSceneData.scene3D.sceneData.API !== "" && newSceneData.scene3D.sceneData.API !== null && newSceneData.scene3D.sceneData.API !== undefined) {
                        newSceneData.scene3D.sceneData.API.splice(this.urlselect,1);
                    }
                }
                // console.log(newSceneData.scene3D.sceneData.API);
                localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            },
            saveUrlList(data ,keystate){
                var newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                if (newSceneData) {
                    if(newSceneData.scene3D.sceneData.API !== "" && newSceneData.scene3D.sceneData.API !== null && newSceneData.scene3D.sceneData.API !== undefined){
                        let key = -1;
                        for(var i=0;i<newSceneData.scene3D.sceneData.API.length;i++){
                            newSceneData.scene3D.sceneData.API[i].checked = false;
                            if(newSceneData.scene3D.sceneData.API[i].id == data.id){
                                newSceneData.scene3D.sceneData.API[keystate].checked = true;
                                key = i;
                            }
                        }
                        if(key > -1) {
                            newSceneData.scene3D.sceneData.API.splice(key,1,data);
                        } else {
                            newSceneData.scene3D.sceneData.API.push(data);
                        }
                    }
                }
                localStorage.setItem('sceneData', JSON.stringify(newSceneData));
            },
        },
        mounted:function(){
            $("#kangjuchi").attr("checked","checked");
            if (this.showSetData) {
                let newSceneData = JSON.parse(localStorage.getItem('sceneData'));
                // console.log(newSceneData, 'newSceneData');
                if (newSceneData) {
                    if(newSceneData.scene3D.sceneData.API !== "" && newSceneData.scene3D.sceneData.API !== undefined) {
                        this.UrlList = newSceneData.scene3D.sceneData.API;
                        this.url_name = newSceneData.scene3D.sceneData.API[0].name;
                        this.url_address = newSceneData.scene3D.sceneData.API[0].url;
                    }
                }
            }
            // console.log(this.UrlList);
        }
    }
</script>
<style lang="less" scoped>
.installBasis{
    width: 100%;
    min-width: 336px;
    box-sizing: border-box;
    // border: 1px solid red;
    color: #fff;
    .checked_box{
        width: 100%;
        height: 55px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        display: flex;
        .lip_con{
            position: relative;
            width: 30%;
            height: 55px;
            line-height: 55px;
            font-size: 12px;
            input[type="checkbox"] {
                position: absolute;
                left: 56px;
                top: 19px;
                width: 15px;
                height: 15px;
                opacity: 0;
                z-index: 2;
            }
            label {
                position: absolute;
                left: 56px;
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
    .url_box,.url_type{
        width: 100%;
        padding-left: 10px;
        height: 90px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        .CPr_contDiv_li{
            .CPr_lip_tit{
                width: 100%;
                height: 37px;
                line-height: 50px;
                font-size: 14px;
                img{
                    margin-top: -2px;
                }
            }
        }
        .title_Num{
            position: relative;
            width: 90%;
            height: 35px;
            line-height: 35px;
            margin-top: 6px;
            color: #fff;
            display: flex;
            flex-wrap: wrap;
            input,select{
                position: absolute;
                top:6px;
                left: 63px;
                width:136px;
                height:22px;
                line-height: 35px;
                padding-left: 3px;
                background:rgba(39,39,39,1);
                border-radius:2px;
                border: none;
                color: #fff;
            }
            select{
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
            select:focus{
                option{
                    outline:none;
                    // background: #00A4FF;
                    background: #C2C2C2;
                }
                
                // border: 1px solid #0096ff;
                
            }
        }
        li:nth-child(2){
            margin-bottom: 8px;
        }
    }
    .url_type{
        height: 160px;
        .title_Num{
            input{
                position: absolute;
                top:4px;
                left: 63px;
                width: 130px;
                padding-left: 7px;
            }
            
        }
        li:nth-child(2),li:nth-child(3){
            width: 90%;
            height: 26px;
            line-height: 26px;
            // border: 1px solid red;
        }
        // li:nth-child(2){
        //     input{
        //         width: 100px;
        //     }
        // }
        li:nth-child(3){
            input{
                width: 210px;
                font-size: 12px;
            }
        }
        li:nth-child(4){
            width: 70%;
            margin-bottom: 20px;
            margin-top: 10px;
            margin-left: 64px;
            // border: 1px solid red;
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
}
</style>