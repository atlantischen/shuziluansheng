<template>
    <div class="searchEnd">
        <p class="SE_tit">
            <span>搜索结果</span>
            <button>模型上传</button>
        </p>
        <ul class="SE_list">
            <li>
                <p>名称</p>
                <p>是否显示</p>
                <p>类型</p>
                <p>上传时间</p>
                <p>操作</p>
            </li>
            <li v-for="(item,index) in SD_list" :key="index">
                <p>{{item.name}}</p>
                <p>
                    <span>
                        <span v-if="item.show_yn">
                            <input type="checkbox" checked="checked">
                            <label></label>
                            <span>已发布</span>
                        </span>
                        <span v-else>
                            <input type="checkbox">
                            <label></label>
                            <span>未发布</span>
                        </span>
                    </span>
                </p>
                <p><span>{{item.kind}}<img src="../assets/image/index-6.png"/></span></p>
                <p>{{item.time}}</p>
                <p>
                    <span class="operation"></span><span class="op_delete"></span>
                </p>
            </li>
        </ul>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
       name:"searchEnd",
        data(){
            return{
                SD_list:[//结果列表
                    {name:'模型1',show_yn:true,kind:"分类1",time:"2019-07-07    16:30:35"},
                    {name:'模型1',show_yn:false,kind:"分类1",time:"2019-07-07    16:30:35"},
                    {name:'模型1',show_yn:false,kind:"分类1",time:"2019-07-07    16:30:35"},
                    {name:'模型1',show_yn:true,kind:"分类1",time:"2019-07-07    16:30:35"},
                    {name:'模型1',show_yn:true,kind:"分类1",time:"2019-07-07    16:30:35"}
                ]
            }
        },
        watch:{

        },
        methods:{
            
        },
        mounted:function(){

        }
    }
</script>
<style lang="less" scoped>
.searchEnd{
    width: 96.8%;
    margin: 14px 30px 2px 30px;
    padding-bottom: 15px;
    background-color: #fff;
    box-sizing: border-box;
    .SE_tit{
        width: 96%;
        height: 75px;
        line-height: 75px;
        margin-left: 2%;
        display: flex;
        box-sizing: border-box;
        span{
            display: inline-block;
            width: 93%;
            height: 29px;
            padding-left: 10px;
            margin-top: 20px;
            line-height: 28px;
            font-size: 25px;
            font-weight: 500;
            border-left: 8px solid #0191ED;
        }
        button{
            width: 100px;
            height: 38px;
            margin-top: 18px;
            line-height: 38px;
            background: #0191ED;
            color: #fff;
            font-size: 19px;
            border: none;
            border-radius: 5px;
        }
    }
    .SE_list{
        width: 96%;
        margin-left: 2%;
        li{
            display: flex;
            width: 100%;
            height: 68px;
            line-height: 68px;
            font-size: 14px;
            p{
                width: 18%;
                text-align: center;
            }
            P:nth-child(2){
                span{
                    display: block;
                    min-width: 60px;
                    position: relative; 
                    overflow: hidden;
                    input[type=checkbox]{
                        position: absolute;
                        left: 32px;
                        top: 24px;
                        width: 15px;
                        height: 15px;
                        opacity: 0;
                        z-index: 2;
                    }
                    label{
                        position: absolute;
                        left: 32px;
                        top: 24px;
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        border: 1px solid #999;
                    }
                    span{
                        width: 55%;
                        min-width: 120px;
                        margin-left: 18px;
                        display: inline-block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    input:checked+label {
                        background-color: #0291EC;
                        border: 1px solid #0291EC;
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
            p:nth-child(3){
                width: 28%;
                span{
                    display: inline-block;
                    width: 90px;
                    height: 30px;
                    line-height: 30px;
                    background: #DEDEDE;
                    color: #000;
                    border-radius: 6px;
                    img{
                        margin-left: 12px;
                    }
                }
            }
            p:nth-child(5){
                span{
                    display: inline-block;
                    width: 57px;
                    height: 42px;
                    margin-top: 15px;
                }
                .operation{
                    margin-right: 5px;
                    background: url("../assets/image/index-8.png") no-repeat;
                    background-size: cover;
                    background-position: 100% 100%;
                }
                .operation:hover{
                    background: url("../assets/image/index-8-1.png") no-repeat;
                }
                .op_delete{
                    margin-left: 5px;
                    background: url("../assets/image/icon-3.png") no-repeat;
                    background-size: cover;
                    background-position: 100% 100%;
                }
                .op_delete:hover{
                    background: url("../assets/image/icon-3-2.png") no-repeat;
                }
            }
        }
        li:nth-child(2n){
            background: #fff;
        }
        li:nth-child(2n-1){
            background: #FAFAFA;
        }
        li:nth-child(1){
            background: #F4F7F7;
            font-size: 18px;
        }
    }
}
</style>