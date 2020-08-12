<template>
    <div class="skyBox">
        <li class="CPr_contDiv_li li_two">
            <p class="CPr_lip_tit">
                <span>天空盒</span>
            </p>
            <p class="CPr_lip_color lip_con">
                <span :class="[ key ==  selIndex ? 'selecedspan' : '']" v-for="(item , key) in imglist" :key="key" @click="select(key,item)">
                    <img :src="['./static/img/'+ item +'.png']" alt="背景">
                </span>
            </p>
        </li>
    </div>
</template>

<script>
import $ from 'jquery';
    export default {
        name:"skyBox",
        props:["skyBox"],
        data(){
            return{
                imglist:["skybox-sky0","skybox-sky1","skybox-sky2"],
                selIndex: -1
            }
        },
        methods:{
            select(key,item){
                // console.log($(".CPr_lip_color span:eq("+key+")"));
                this.selIndex = key
                $(".skyBox .CPr_lip_color span:eq("+key+")").addClass('selecedspan').siblings().removeClass("selecedspan");
                // $(".skyBox .CPr_lip_color span:eq("+key+")").siblings().removeClass("selecedspan");
                this.skyBox.setSkyboxForScene('skybox',item);
            }
        },
        mounted:function(){
            // $(".CPr_lip_color span:eq(2)").addClass('selecedspan');
        }
    }
</script>

<style lang="less" scoped>
.skyBox{
    .CPr_contDiv_li{
        width: 100%;
        min-width: 321px;
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
            width: 95%;
            height: 174px;
            // min-width: 295px;
            padding: 1px;
            background: #272727;
            display: flex;
            flex-wrap: wrap;
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
            span{
                display: inline-block;
                width: 30.6%;
                height: 60px;
                margin: 4px;
                border: 2px solid #272727;
                box-sizing: border-box;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .selecedspan{
                border: 2px solid #157EF0;
                box-sizing: border-box;
            }
        }
    }
}
</style>