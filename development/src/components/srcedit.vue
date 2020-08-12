<template>
    <div class="srcedit">
        <li class="srcedit_li li_two">
            <p class="CPr_lip_tit">
                <span>外部链接</span>
            </p>
            <p class="CPr_lip_tits lip_con">
                <span>链接标题 :</span>
                <input type="text" max="360" id="name_src" v-model="name_srcedit" @change="tit_src(name_srcedit)"/>
            </p>
            <p class="CPr_lip_Light lip_con block">
                <span>屏幕占比</span>
                <el-slider v-model="slider_val" :show-tooltip="false" :step="1"  :max="100" :min="50" @change="intensity(slider_val )"></el-slider>
                <input type="text" v-model="text_val" id="intensityL" max="5"  @change="intensity(text_val)"/>
            </p>
            <p class="CPr_lip_color lip_con">
                <span>链接地址 :</span>
                <input type="text" max="360" id="url_basis" v-model="url_srcedit" @change="url_src(url_srcedit)"/>
                <button class="test_src" @click="test_src">测试</button>
            </p>
            <p class="CPr_lip_select lip_con">
                <span>层级 :</span>
                <select v-model="layerItem" @change="layerFn()" class="selectla">
                    <option :value="item" v-for="(item, key) in layerList" :key="key">{{item}}</option>
                </select>
            </p>
            <p class="CPr_lip_concheck lip_con">
                <span>是否可见</span>
                <input type="checkbox" checked="checked" name="" id="seeChoose_1" @click="kejian()">
                <label></label>
            </p>
            <!-- <p class="CPr_lip_btn lip_con">
                <button class="dele_src" @click="dele_src">删除</button>
                <button class="save_src" @click="save_src">保存</button>
            </p> -->
        </li>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:"srcedit",
        props:["src_key","src_data"],
        data(){
            return{
                layerList:[1,2,3,4,5,6,7,8],
                layerItem:1,
                text_val:"",//输入框滑块   光照强度
                slider_val: 0,//滑块   光照强度
                name_srcedit:"",//标题
                url_srcedit:'',
                id:'',
                defaultVisible:true,
            }
        },
        watch:{
            text_val(){
                this.slider_val = Number(this.text_val);
            },
            slider_val(){
                this.text_val = this.slider_val;
            },
            src_data(){
                this.xuanran();
            },
            src_data: {
                // 数据变化时执行的逻辑代码
                handler(newName, oldName) {
                    this.xuanran();
                },
                // 开启深度监听
                deep: true
            },
        },
        methods:{
            kejian(){//是否可见
                var checked = $("#seeChoose_1").prop('checked');
                if(checked == true) {//选中
                    console.log("选中")
                    this.defaultVisible = true;
                }else if(checked == false){
                    console.log("不选中")
                    this.defaultVisible = false;
                }
                this.save_src();
            },
            intensity(val){
                this.save_src();
            },
            layerFn(){//layer
                console.log(this.layerItem);
                this.save_src();
                // this.echartsDatas.layer = this.layerItem;
            },
            tit_src(val){//标题输入框
                this.save_src();
            },
            formatTooltip(val) {//滑块
                return val / 100;
            },
            url_src(){
                console.log(this.url_srcedit);
                this.save_src();
            },
            test_src(){
                console.log(this.url_srcedit);
                window.open(this.url_srcedit);
                this.save_src();
            },
            dele_src(){//删除方法
                this.$emit('dele_srcone', this.src_key);
            },
            save_src(){//保存方法
                let datas,data = {
                    title:this.name_srcedit,
                    url:this.url_srcedit,//链接地址
                    width:this.text_val,//屏幕占比
                    id:this.id,//id
                    layer:this.layerItem,//layer
                    defaultVisible:this.defaultVisible
                }
                datas = {
                    key:this.src_key,
                    data:data
                }
                // console.log(datas,"datasdatasdatasdatasdatasdatasdatas")
                this.$emit('save_srcone', datas);
            },
            xuanran(){
                if(this.src_data.id !=="" ){
                    this.slider_val = this.src_data.width;
                    this.name_srcedit = this.src_data.title;
                    this.url_srcedit = this.src_data.url;
                    this.id = this.src_data.id;
                    this.layerItem = this.src_data.layer;
                    console.log(this.name_srcedit, 1111);
                    if(this.src_data.defaultVisible == true){
                        $(".CPr_lip_concheck input[type=checkbox]").attr("checked","checked");
                    }else if(this.src_data.defaultVisible == false){
                        $(".CPr_lip_concheck input[type=checkbox]").removeAttr("checked");
                    }
                    $(".CPr_lip_tits input").val(this.src_data.title)
                }
            }
        },
        mounted:function(){
            // console.log(this.src_key);
            console.log(this.src_data);
            this.xuanran();
            // this.webEdior = webEdior();
            // this.colorPlugin();//颜色
            // console.log(this.light)
        }
    }
</script>
<style lang="less">
.srcedit{
    .srcedit_li{
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
                width:142px;
                height:22px;
                background:rgba(39,39,39,1);
                border-radius:2px;
                padding-left: 4px;
                border: none;
                font-size: 12px;
            }
            select{
                width:146px;
                height:22px;
                margin-left: 24px;
                padding-left: 3px;
                font-size: 12px;
                border-radius:2px;
                background:rgba(39,39,39,1);
                border: none;
                color: #fff;
                option{
                    height: 30px;
                    line-height: 30px;
                    background: #C2C2C2;
                    color: #333333;
                }
            }
            button{
                width:52px;
                height:21px;
                margin-left: 8px;
                background:rgba(112,112,112,1);
                border-radius:3px;
                text-align: center;
                color: #ffffff;
                font-size: 12px;
                border: none;
                // vertical-align:-1px;
            }
            button:hover{
                background:linear-gradient(0deg,rgba(3,131,245,1),rgba(13,248,247,1));
            }
            input:focus{
                outline:none;
                border: 1px solid #0096ff;
            }
            select:focus{
                outline:none;
                border: 1px solid #0096ff;
                border-radius: 3px;
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
            input[type=text]{
                width: 42px;
                height: 22px;
                margin-left: 6px;
                text-align-last:center;
                background: rgba(39, 39, 39, 1);
                border-radius: 3px;
                border: none;
                color: oldlace;
            }
        }
        .CPr_lip_concheck{
            position: relative; 
            height: 33px;
            line-height: 33px;
            input[type="checkbox"] {
                position: absolute;
                left: 62px;
                top: 8px;
                width: 15px;
                height: 15px;
                opacity: 0;
                z-index: 2;
            }
            label {
                position: absolute;
                left: 62px;
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
        .CPr_lip_btn{
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
            .dele_src{
                border: 1px solid #E8E8E8;
                background: none;
                color: #E8E8E8;
            }
            .save_src{
                background:#DDDDDD;
            }
            .dele_src:hover{
                border: 1px solid #1869B3;
            }
            .save_src:hover{
                background:#1869B3;
                color: #DDDDDD;
            }
        } 
    }
}
</style>
<style lang="less">
.srcedit{
    .srcedit_li{
        .el-slider{
            display: inline-block;
            width: 146px;
            height: 15px;
            margin-left: 8px;
            z-index: 10;
        }
        .el-slider__bar{
            height: 4px;
            background-color: #00A4FF;
        }
        .el-slider__runway{
            height: 4px;
            margin: 8px 0;
            background-color: #20212B;
        }
        .el-slider__button-wrapper{
            z-index: 1;
        }
        .el-slider__button{
            width:18px;
            height:18px;
            background-color:linear-gradient(0deg,rgba(231,227,225,1),rgba(244,241,236,1));
            box-shadow:0px 1px 3px 0px rgba(41,35,32,0.3);
            border: none;
            border-radius:50%;
        }
}
}
</style>