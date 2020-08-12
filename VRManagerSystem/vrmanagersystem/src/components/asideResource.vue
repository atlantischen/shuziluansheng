<template>
    <div class="asideResource">
        <p class="AR_tit" @click="openlist(select_re)">
            <img class="AR_left" src="../assets/image/list-icon2.png" alt="" v-if="select_re">
            <img class="AR_left" src="../assets/image/list-icon2x.png" alt="" v-else>
            <span>资源管理</span>
            <img class="AR_right1" src="../assets/image/icon-close.png" alt="" v-if="select_re">
            <img class="AR_right2" src="../assets/image/icon-open.png" alt="" v-else>
        </p>
        <ul class="AR_list" v-if="list_ar">
            <li v-for="(item,index) in AR_list" :key="index" @click="liclick(item,index)">{{item.name}}</li>
        </ul>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:"asideResource",
        data(){
            return{
                select_re:true,//选中图表和向下打开图标的切换
                AR_list:[//资源管理ul列表项
                    {name:"分类一",key:false},
                    {name:"分类二",key:false},
                    {name:"分类三",key:false},
                    {name:"添加分类",key:false}
                ],
                list_ar:false,//下拉列表是否显示
            }
        },
        watch:{

        },
        methods:{
            openlist(select_re){//点击资源管理，列表显示
                if(select_re){
                    this.list_ar = true;
                    $(".AR_tit").addClass('AR_tit_select');
                    $(".AR_tit span").css('color',"#fff");
                    return this.select_re = false;
                }else if(select_re == false){
                    this.list_ar = false;
                    $(".AR_tit").removeClass('AR_tit_select');
                    $(".AR_tit span").css('color',"#888f97");
                    return this.select_re = true;
                }
            },
            liclick(item,index){//点击具体项
                $(".AR_list li:eq("+index+")").addClass("select_li").siblings().removeClass("select_li");
            }
        },
        mounted:function(){

        }
    }
</script>
<style lang="less" scoped>
.asideResource{
    width: 100%;
    padding-top: 14px;
    color: #fff; 
    box-sizing: border-box;
    font-family: "Apple LiGothic Medium";
    .AR_tit{
        width: 100%;
        height: 67px;
        line-height: 67px;
        color: #888f97; 
        border-left: #242B34 5px solid;
        .AR_left{
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
        .AR_right1{
            width: 10px;
            height: 17px;
            margin-left: 16px;
            margin-top: -6px;
        }
        .AR_right2{
            width: 17px;
            height: 10px;
            margin-left: 16px;
            margin-top: -3px;
        }
    }
    .AR_tit_select{
        border-left: #018fec 5px solid;
    }
    .AR_list{
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