<template>
    <div class="img_Box">
        <li class="skyBox_li li_two">
            <p class="skyBox_tit">
                <span>天空盒</span>
            </p>
            <p class="skyBox_color lip_con">
                <span  v-for="(item , key) in sky_imglist" :key="key" @click="select_sky(key,item)">
                    <img :src="['./static/img/'+ item +'.png']" alt="背景">
                </span>
            </p>
        </li>
        <li class="bgBox_li li_two">
            <p class="bgBox_lip_tit">
                <img src="../assets/image/icon.png">
                <span>背景盒</span>
            </p>
            <p class="bgBox_lip_color bgBox_con">
                <span v-for="(item , key) in bg_imglist" :key="key" @click="select_bg(key,item)">
                    <img :src="['./static/img/'+ item +'.jpg']" alt="背景">
                </span>
            </p>
        </li>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:"bgBox",
        props:["bgBox"],
        data(){
            return{
                bgBoxname:"天空盒",
                bg_imglist:["BG2","BG19","BG20","BG22","BG27"],
                sky_imglist:["skybox-sky0","skybox-sky1","skybox-sky2"],
            }
        },
        watch:{},
        methods:{
            select_bg(key,item){//背景点击
                console.log(item);
                $(".img_Box .bgBox_lip_color span:eq("+key+")").addClass('selecedspan').siblings().removeClass("selecedspan");
                $(".img_Box .skyBox_color span").removeClass("selecedspan");
                // this.bgBox.setSkyboxForScene(item);
                this.bgBox.setSkyboxForScene('background',item);
            },
            select_sky(key,item){//天空盒点击
                // console.log($(".CPr_lip_color span:eq("+key+")"));
                this.selIndex = key
                $(".img_Box .skyBox_color span:eq("+key+")").addClass('selecedspan').siblings().removeClass("selecedspan");
                $(".img_Box .bgBox_lip_color span").removeClass("selecedspan");
                this.bgBox.setSkyboxForScene("skybox",item);
            }
        },
        mounted:function(){
            $(".img_Box .skyBox_color span:eq(0)").addClass('selecedspan');
        }
    }
</script>
<style lang="less" scoped>
.img_Box{
    .bgBox_li{  // stephen 由于三维方面的原因无法进行背景的添加，暂时先取消
        display: none;
    }
    .bgBox_li,.skyBox_li{
        width: 100%;
        min-width: 321px;
        padding-bottom: 20px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        color: #fff;
        .bgBox_lip_tit,.skyBox_tit{
            width: 100%;
            height: 46px;
            line-height: 46px;
            font-size: 14px;
            img{
                margin-top: -2px;
            }
        }
        .bgBox_con,.lip_con{
            width: 92%;
            height: 174px;
            padding: 1px;
            background: #272727;
            overflow-y: auto;
            font-size: 0;
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
                width: 30.4%;
                height: 60px;
                margin: 4px;
                border: 1px solid #272727;
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