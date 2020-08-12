<template>
    <div class="modelManage">
        <p class="MM_tit">
            <span>搜索结果</span>
            <button>上传</button>
        </p>
        <div class="MM_content">
            <div class="VR_div"></div>
            <div class="treedata">
                <p @click="openMM_list(select_re)">
                    <img class="modul_icon" src="../assets/image/icon-2.png" alt="">
                    <span>模型01</span>
                    <img class="MM_right1" src="../assets/image/icon-close.png" alt="" v-if="select_re">
                    <img class="MM_right2" src="../assets/image/icon-open1.png" alt="" v-else>
                </p>
                <ul v-if="MMlist">
                    <li v-for="(item,index) in MM_list" :key="index" @click="liselect(item,index)">{{item.name}}</li>
                </ul>
            </div>
            <div class="btn_list">
                <p>
                    <input type="checkbox" checked="checked">
                    <label></label>
                    <span>移动</span>
                </p>
                <p>
                    <input type="checkbox">
                    <label></label>
                    <span>旋转</span>
                </p>
                <p>
                    <input type="checkbox" checked="checked">
                    <label></label>
                    <span>缩放</span>
                </p>
                <p>
                    <input type="checkbox">
                    <label></label>
                    <span>事件添加</span>
                </p>
                <p>
                    <input type="checkbox">
                    <label></label>
                    <span>单选按钮</span>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:"modelManage",
        data(){
            return{
                select_re:true,//向下展示的小图标显示
                MM_list:[
                    {name:"模型子对象1",key:1},
                    {name:"模型子对象2",key:2},
                    {name:"模型子对象3",key:3},
                    {name:"模型子对象4",key:4}
                ],
                MMlist:false,
            }
        },
        watch:{

        },
        methods:{
            openMM_list(select_re){
                if(select_re){
                    this.MMlist = true;
                    return this.select_re = false;
                }else if(select_re == false){
                    this.MMlist = false;
                    return this.select_re = true;
                }
            },
            liselect(item,index){
                console.log(item);
                $(".treedata ul li:eq("+index+")").addClass("li_selected").siblings().removeClass("li_selected");
            }
        },
        mounted:function(){

        }
    }
</script>
<style lang="less" scoped>
.modelManage{
    width: 96.8%;
    margin: 14px 30px 2px 30px;
    padding-bottom: 15px;
    background-color: #fff;
    box-sizing: border-box;
    .MM_tit{
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
    .MM_content{
        width: 96%;
        height: 560px;
        margin-bottom: 92px;
        display: flex;
        margin-left: 2%;
        .VR_div{
            width: 796px;
            height: 100%;
            min-width: 796px;
            background: url("../assets/image/vr_123.png") no-repeat;
            background-size: cover;
            background-position: 100% 100%;
        }
        .treedata{
            width: 16%;
            min-width: 16%;
            height: 100%;
            margin-left: 24px;
            line-height: 67px;
            color: #999;
            background: #FAFAFA;
            p{
                .modul_icon{
                    width: 29px;
                    height: 24px;
                    margin-left: 25px;
                    margin-top: -4px;
                }
                span{
                    margin-left: 10px;
                    color: #111; 
                    font-size: 18px;
                }
                .MM_right1{
                    width: 10px;
                    height: 17px;
                    margin-left: 16px;
                    margin-top: -6px;
                }
                .MM_right2{
                    width: 17px;
                    height: 10px;
                    margin-left: 16px;
                    margin-top: -3px;
                }
            }
            ul{
                text-align: center;
                font-size: 18px;
                li{
                    width: 100%;
                    height: 66px;
                }
                .li_selected{
                    color: #fff;
                    background: #018fec;
                }
            }
        }
        .btn_list{
            width: 30%;
            min-width: 16px;
            height: 100%;
            margin-left: 24px;
            line-height: 67px;
            color: #111;
            background: #FAFAFA;
            p{
                position: relative; 
                width: 100%;
                height: 50px;
                line-height: 50px;
                overflow: hidden;
                input[type=checkbox]{
                    position: absolute;
                    left: 32px;
                    top: 16px;
                    width: 15px;
                    height: 15px;
                    opacity: 0;
                    z-index: 2;
                }
                label{
                    position: absolute;
                    left: 32px;
                    top: 16px;
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    border: 1px solid #999;
                }
                span{
                    width: 55%;
                    min-width: 120px;
                    margin-left: 60px;
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
    }
}
</style>