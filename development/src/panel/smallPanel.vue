<template>
    <div class="smallPanel-drag" :style="{'z-index': Zindex}" @click="boxZindex">
      <div class="box smallPanel popup-box " data-darg="true">
            <h1 class="b_title darg-title">
            <p class="tit_left">组件2</p>
            <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
                <img src="../../static/img/index-6.png" v-if="Paneled">
                <img src="../../static/img/index-9.png" v-else @click="noneother()">
            </p>
        </h1>
        <div class="panel_cent">
            <ul class="el_centUl">
                <li class="title_save">
                    <span>标题: </span>
                    <input type="text" v-model="titlezu"/>
                    <button @click="titSave()">保存</button>
                </li>
                <li class="style_bg">
                    <span>背景: </span>
                    <img src="../../static/img/index-8.png"/>
                </li>
                <li class="XJ_checkbox">
                    <p>属性:</p>
                    <ul>
                        <li v-for="(item, index) in checkbox_name" :key="index">
                            <input type="checkbox" :name="item" :v-model="item" :id="item">
                            <label :for="item">{{item}}</label>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
      </div>
    </div>
</template>
<script>
import $ from 'jquery';
import drag from '../../static/js/drag'
    export default {
        name:'smallPanel',
        props: ['index'],
        data(){
            return{
                definePanelhide:true,//传参主页面，显示隐藏控制
                Paneled : true,//图片选中的判断
                titlezu:'组件2',//标题输入框输入valve值
                checkbox_name:[
                    "产量1","产量2","产量3","产量4","产量5","产量6",
                    "产量7","产量8","产量9","产量10","产量11","产量12"
                ],
                Zindex:0,
            }
        },
        watch:{},
        methods:{
            boxZindex () {
                let arr = []
                $('.popup-box').each(function(item){
                    arr.push(Number($(this).css('z-index')))
                })
                this.Zindex = Math.max(...arr)+1
            },
            noneother(){//点击X,隐藏整个弹框
                this.definePanelhide = false;
                this.$emit('smallPanel', this.smallPanel);
            },
            R_selectStyle(){//图片显示选中
                this.Paneled = false;
                $(".smallPanel .tit_right img").css("background","#0878d2");
            },
            R_outStyle(){//图片显示不选中
                this.Paneled = true;
                $(".smallPanel .tit_right img").css("background","#292929");
            },
            iconchoose(name,item){//点击小图表选择样式
                console.log(name,item);
            },
            titSave(){//点击保存
                let arr = []
                $('.XJ_checkbox input[type=checkbox]').each(function(){
                    var checked = $(this).prop('checked');
                    if(checked) {
                        console.log($(this).attr('name'));
                        arr.push($(this).attr('name'))
                    }
                })
                console.log(arr)
            }
        },
        mounted:function(){
            drag('smallPanel-drag','')
            this.Zindex = this.index
            $('.XJ_checkbox').on('change', 'input[type=checkbox]', function(){
                var checked = $(this).prop('checked');
                if(checked) {
                    console.log($(this).attr('name'));
                }
            })
        }
    }
</script>
<style lang="less" scoped>
.box {
    position: absolute;
}
.smallPanel{
    position: absolute;
    top: calc(50% - 130px);
    left: calc(50% - 300px);
    width: 600px;
    min-width:400px;
    height: 260px;
    min-height: 200px;
    border: 1px solid #dcdcdc;
    background: #535353;
    box-shadow: 5px 5px 15px rgb(104, 98, 98);
    .b_title{
        display: flex;
        height: 40px;
        width: 100%;
        line-height: 40px;
        background: #292929;
        .tit_left{
            width: 97%;
            height: 100%;
            margin-left: 10px;
            font-size: 16px;
            font-weight: 500;
            color: #bbbbbb;
        }
        .tit_right{
            width: 10%;
            height: 100%;
            line-height: 40px;
            margin-right: 10px;
            margin-top: -2px;
            text-align: right;
            img{
                width: 14px;
                height: 14px;
                background: #292929;
            }
        }
    }
    .panel_cent{
        width: 600px;
        min-width: 400px;
        height: 220px;
        .el_centUl{
            width: 570px;
            height: 100%;
            margin-left: 15px;
            .title_save{
                width: 100%;
                margin-top: 15px;
                height: 27px;
                line-height: 27px;
                color: #ffff;
                span{
                    font-size: 14px;
                }
                input{
                    width: 240px;
                    height: 22px;
                    padding-left: 3px;
                    font-size: 15px;
                    background: #363636;
                    border: 1.3px solid #0673CC;
                }
                input:focus{
                    outline:none;
                    border: 1px solid #0096ff;
                }
                button{
                    width: 84px;
                    height: 27px;
                    margin-left: 26px;
                    line-height: 27px;
                    background: #535353;
                    border: 1px solid #fff;
                    border-radius: 20px;
                    color: #fff;
                }
                button:hover{
                    background:#fff;
                    color: #000
                }
            }
            .style_bg{
                width: 100%;
                height: 36px;
                margin-top: 15px;
                color: #fff;
                img{
                    width: 36px;
                    height: 36px;
                    margin-left: 5px;
                }
            }
            .XJ_checkbox{
                width: 100%;
                height: 100px;
                margin-top: 10px;
                color: #fff;
                ul{
                    width: 100%;
                    height: 60px;
                    display: flex;
                    flex-wrap: wrap;
                    li{
                        position: relative; 
                        width: 95px;
                        height: 30px;
                        line-height: 40px;
                        // border: 1px solid #fff;
                        // box-sizing: border-box;
                        input[type=checkbox]{
                            position: absolute;
                            top: 13px;
                            left: 0;
                            margin-right: 10px;
                            background: rgba(0,0,0,0.2);
                            border: 1px solid #707070;
                            border-radius: 3px;
                            box-sizing: border-box;
                        }
                        label{
                            display: inline-block;
                            margin-left: 20px;
                        }
                    }
                }
            }
        }
    }
}
</style>