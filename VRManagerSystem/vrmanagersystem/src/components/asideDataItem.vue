<template>
    <div class="asideDataItem">
        <p class="AD_tit" @click="openlist(select_re)">
            <img class="AD_left" src="../assets/image/list-icon1.png" alt="" v-if="select_re">
            <img class="AD_left" src="../assets/image/list-icon1x.png" alt="" v-else>
            <span>数据项管理</span>
            <img class="AD_right1" src="../assets/image/icon-close.png" alt="" v-if="select_re">
            <img class="AD_right2" src="../assets/image/icon-open.png" alt="" v-else>
        </p>
        <ul class="AD_list" v-if="list_ad">
            <li  v-for="(item,index) in AD_list" :key="index" @click="liclick(item,index)">{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:'asideDataItem',
        data(){
            return{
                select_re:true,//选中图表和向下打开图标的切换
                AD_list:[//数据项管理ul列表项
                    {name:"分类一",key:false},
                    {name:"分类二",key:false},
                    {name:"分类三",key:false},
                    {name:"添加分类",key:false}
                ],
                list_ad:false,//下拉列表是否显示
            }
        },
        watch:{

        },
        methods:{
            openlist(select_re){//点击资源管理，列表显示
                if(select_re){
                    this.list_ad = true;
                    $(".AD_tit").addClass('AD_tit_select');
                    $(".AD_tit span").css('color',"#fff");
                    return this.select_re = false;
                }else if(select_re == false){
                    this.list_ad = false;
                    $(".AD_tit").removeClass('AD_tit_select');
                    $(".AD_tit span").css('color',"#888f97");
                    return this.select_re = true;
                }
            },
            liclick(item,index){//点击具体项
                $(".AD_list li:eq("+index+")").addClass("select_li").siblings().removeClass("select_li");
            }
        },
        mounted:function(){

        }
    }
</script>
<style lang="less" scoped>
.asideDataItem{
    width: 100%;
    background-color: #242B34;
    color: #fff; 
    box-sizing: border-box;
    .AD_tit{
        width: 100%;
        height: 67px;
        line-height: 67px;
        border-left: #242B34 5px solid;
        .AD_left{
            width: 25px;
            height: 25px;
            margin-left: 25px;
            margin-top: -4px;
        }
        span{
            margin-left: 10px;
            color: #888f97; 
            font-size: 18px;
        }
        .AD_right1{
            width: 10px;
            height: 17px;
            margin-left: 16px;
            margin-top: -6px;
        }
        .AD_right2{
            width: 17px;
            height: 10px;
            margin-left: 16px;
            margin-top: -3px;
        }
    }
    .AD_tit_select{
        border-left: #018fec 5px solid;
    }
    .AD_list{
        width: 100%;
        li{
            width: 100%;
           height: 67px;
           margin-left: 60px;
           line-height: 67px;
           font-size: 17px; 
        }
        .select_li{
            color: #018fec;
        }
    }
}
</style>