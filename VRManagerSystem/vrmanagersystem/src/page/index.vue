<template>
    <div class="index">
        <header>
            <div class="header_logo">
                <img src="../assets/image/logo.png" alt="开发平台后台管理" />
            </div>
            <div class="header_tit">
                <img src="../assets/image/icon-menu.png" alt=""/>
                <span>您好, 欢迎来开发平台后台管理！</span>
            </div>
            <div class="header_login">
                <span>
                    <el-badge v-model="redLogoV" class="item">
                        <el-button size="small" @click="checked">系统消息</el-button>
                    </el-badge>
                </span>
                <button class="registered">注册</button>
                <button class="login">登录</button>
            </div>
        </header>
        <div class="content">
            <div class="aside">
                <v-asideResource></v-asideResource>
                <v-asideDataItem></v-asideDataItem>
            </div>
            <div class="main">
                <v-searchEnd v-if="searchEnd_sh"></v-searchEnd>
                <v-modelManage v-if="modelManage_sh"></v-modelManage>
            </div>
        </div>
        <!-------------------------------------模型上传弹框 ------------------------------------->
        <div class="bounced" v-if="bounced">
            <div class="bounced_div">
                <p class="tit_bd">
                    <span class="BD_tit">模型上传</span>
                    <span class="BD_img" @click="delete_bd()"></span>
                </p>
                <div class="choose_bd">
                    <p class="choose_kind">
                        <span>选择分类</span>
                        <select v-model="selectItem" @change="selectFn()" class="selectla">
                            <option :value="item" v-for="(item, key) in typeList" :key="key">{{item}}</option>
                        </select>
                    </p>
                    <p class="choose_model">
                        <span>上传模型</span>
                        <button>选择模型</button>
                    </p>
                </div>
                <div class="btn_loading">
                    <button>加载</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import asideResource from '../components/asideResource.vue'
import asideDataItem from '../components/asideDataItem.vue'
import searchEnd from '../components/searchEnd.vue'
import modelManage from '../components/modelManage.vue'
    export default {
        name:"index",
        data(){
            return{
                redLogoV:0,
                bounced:false,//弹框是否显示
                selectItem:'分类1',//默认选中的值
                typeList:["分类1","分类2","分类3"],//选择分裂的单个项
                searchEnd_sh:true,//搜索结果列表是否显示
                modelManage_sh:false,//模型管理平台是否显示
            }
        },
        components:{
            "v-asideResource":asideResource,//资源管理列表组件
            "v-asideDataItem":asideDataItem,//数据项管理列表组件
            "v-searchEnd":searchEnd,//搜索结果展示组件
            "v-modelManage":modelManage,//模型管理平台组件
        },
        watch:{
            redLogoV(){
                if(this.redLogoV == 0 ||this.redLogoV == "0"){
                    $(".item .el-badge__content").hide();
                }
            }
        },
        methods:{
            selectFn(){//弹框下拉框点击选中
                console.log(this.selectItem);
            },
            delete_bd(){//弹框点击X 关闭弹框
                this.bounced = false;
            },
            checked(){
                
                if(this.searchEnd_sh == true ){
                    this.searchEnd_sh = false;
                    this.modelManage_sh = true;
                }else{
                    this.searchEnd_sh = true;
                    this.modelManage_sh = false;
                }
            }
        },
        mounted:function(){
            if(this.redLogoV == 0 ||this.redLogoV == "0"){
                $(".item .el-badge__content").hide();
            }
        }
    }
</script>
<style lang="less" scoped>
.index{
    width: 100%;
    min-width: 1280px;
    height: 100%;
    min-height: 720px;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    overflow: hidden;
    header{
        width: 100%;
        min-width: 1280px;
        height: 2%;
        min-height: 75px;
        display: flex;
        background-color: #fff;
        line-height: 75px;
        box-sizing: border-box;
        .header_logo{
            height: 75px;
            width: 259px;
            min-width: 259px;
            text-align: center;
            background-color: #018fec;
            img{
                width: 238px;
                height: 30px;
                max-width: 238px;
            }
        }
        .header_tit{
            width: 72%;
            height: 75px;
            font-size: 16px;
            img{
                margin-left: 20px;
                margin-top: -3px;
            }
            span{
                margin-left: 20px;
                // vertical-align:-2px;
                color: #2b2b2b;
            }
        }
        .header_login{
            width: 18%;
            height: 75px;
            line-height: 75px;
            display: flex;
            font-size: 18px;
            span{
                width: 50%;
                height: 100%;
            }
            button{
                width: 65px;
                min-width: 65px;
                height: 30px;
                margin-top: 22px;
                background-color: #fff;
                color: #111;
                border: none;
                font-size: 18px;
            }
            .registered{
                border-right: 1px solid #000;
            }
        }
    }
    .content{
        width: 100%;
        min-width: 1280px;
        height: 98%;
        display: flex;
        min-height: 645px;
        background: #eef0f5;
        padding: 0;
        margin: 0;
        .aside{
            width: 10%;
            height: 100%;
            min-width: 259px;
            background-color: #242B34;
        }
        .main{
            width: 90%;
            height: 100%;
        }
    }
    // 模型弹框
    .bounced{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        .bounced_div{
            width: 600px;
            height: 400px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -300px;
            margin-top: -200px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            .tit_bd{
                width: 100%;
                height: 70px;
                line-height: 70px;
                padding-left: 3%;
                background: #f2f2f2;
                .BD_tit{
                    display: inline-block;
                    width: 90%;
                    color: #111;
                    font-size: 25px;
                }
                .BD_img{
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    background: url("../assets/image/icon-delete1.png");
                }
                .BD_img:hover{
                    background: url("../assets/image/icon-delete1x.png");
                }
            }
            .choose_bd{
                width: 100%;
                height: 170px;
                border-bottom: 1px solid #F2F2F2;
                p{
                    width: 75%;
                    height: 70px;
                    margin-left: 15%;
                    line-height: 70px;
                    font-size: 18px;
                    color: #111;
                    span{
                        margin-right: 28px;
                        color: #111;
                    }
                    button{
                        width: 140px;
                        height: 40px;
                        background: none;
                        color: #111;
                        border: 1.3px solid #D9D9D9;
                        border-radius: 5px;
                    }
                }
                .choose_kind{
                    margin-top: 30px;
                    .selectla{
                        width: 230px;
                        height: 40px;
                        padding-left: 25px;
                        color: #111;
                        border: 1.3px solid #D9D9D9;
                        border-radius: 5px;
                        box-sizing: border-box;
                    }
                }
            }
            .btn_loading{
                width: 100%;
                height: 130px;
                line-height: 130px;
                text-align: center;
                button{
                    width: 125px;
                    height: 50px;
                    line-height: 40px;
                    background: #E50113;
                    color: #fff;
                    font-size: 20px;
                    border: 1.3px solid #D9D9D9;
                    border-radius: 5px;
                    box-shadow:1px 1px 1px #D4EBF7 ;
                }
            }
        }
    }
}
</style>
<style lang="less">
.item {
    position: relative;
    width: 50%;
    min-width: 200px;
    height: 100%;
    margin-top: -8px;
    // vertical-align:-3px;
    .el-button{
        color: #111;
    }
    .el-badge__content{
        height: 18px;
        width: 18px;
        padding: 2px;
        position: absolute;
        top: 26px;
        right:58%;
        border-radius: 50%;
    }
}
</style>
