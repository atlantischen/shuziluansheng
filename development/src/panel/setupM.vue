<template>
    <div class="setUpM-drag" v-if="setUpM_sh">
        <div class="box setUpM popup-box" data-drag="true" @click="boxZindex" :style="{'z-index': Zindex}">
            <h1 class="b_title darg-title">
                <p class="tit_left">设置</p>
                <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
                    <img src="../../static/img/N-dele.png" v-if="bselected">
                    <img src="../../static/img/N-d-select.png" v-else @click="noneother()">
                </p>
            </h1>
            <div class="d_conten">
                <p>
                    <span>旧密码:</span>
                    <input type="text" :class="[oldPW_tf?'addblur':'noAddblur']" v-model="oldPW" ref="oldPW" @click="passWordFn('旧密码')" @keyup.enter="passWordEFn('旧密码')" @blur="passWordEFn('旧密码')"/>
                </p>
                <p>
                    <span>新密码:</span>
                    <input type="text" :class="[newPW_tf?'addblur':'noAddblur']" v-model="newPW" ref="newPW" @click="passWordFn('新密码')" @keyup.enter="passWordEFn('新密码')" @blur="passWordEFn('新密码')"/>
                </p>
                <p>
                    <span>确认密码:</span>
                    <input type="text" :class="[truePW_tf?'addblur':'noAddblur']" v-model="truePW" ref="truePW" @click="passWordFn('确认密码')" @keyup.enter="passWordEFn('确认密码')" @blur="passWordEFn('确认密码')"/>
                </p>
            </div>
            <div class="d_foot_btn">
                <button class="btn_yes" @click="yes_save">确认</button>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import drag from '../../static/js/drag'
    export default {
        name:'clearHost',
        props:[ "index","clearHost"],
        data(){
            return{
                Zindex:0,
                bselected : true,//图片选中的判断
                setUpM_sh:true,
                oldPW:"",
                newPW:'',
                truePW:"",
                oldPW_tf:false,
                newPW_tf:false,
                truePW_tf:false,
            }
        },
        watch:{},
        methods:{
            passWordFn(val){//输入框完成输入，input选中
                if(val == "旧密码"){
                    // this.$refs.oldPW.addClass('addblur')
                    this.oldPW_tf = true;
                }else if(val == "新密码"){
                    this.newPW_tf = true;
                }else if(val == "确认密码"){
                    this.truePW_tf = true;
                }
            },
            passWordEFn(val){//输入框完成输入，取消选中
                if(val == "旧密码"){
                    this.oldPW_tf = false;
                    // this.$refs.oldPW.addClass("noAddblur");
                }else if(val == "新密码"){
                    this.newPW_tf = false;
                }else if(val == "确认密码"){
                    this.truePW_tf = false;
                }
            },
            noneother(){//点击X,隐藏整个弹框
                this.setUpM_sh = false;
                this.$emit('setup_M', false);
            },
            R_selectStyle(){// X 图片显示选中
                this.bselected = false;
            },
            R_outStyle(){// X 图片显示不选中
                this.bselected = true;
            },
            boxZindex () {//层级
                let arr = []
                $('.popup-box').each(function(item){
                    // console.log($(this).css('z-index'), "$(this).css('z-index')", $(this))
                    arr.push(Number($(this).css('z-index')))
                })
                // console.log(Math.max(...arr), 'this.Zindex1111')
                this.Zindex = Math.max(...arr)+1
                // console.log(this.Zindex, 'this.Zindex')
            },
            yes_save(){
                this.noneother();
                this.clearHost.clearHistory();
            }
        },
        mounted:function(){
            drag('setUpM-drag', '');
            this.Zindex = this.index;
        }
    }
</script>
<style lang="less" scoped>
.box {
    position: absolute;
}
.setUpM{
    position: absolute;
    top: calc(50% - 1.75rem);
    left: calc(50% - 4.15rem);
    width: 8.3rem;
    height: 3.5rem;
    min-height: 260px;
    background: #535353;
    overflow: hidden;
    border-radius:6px;
    .b_title{
        display: flex;
        width: 8.3rem;
        height:.48rem;
        background:rgba(194,194,194,1);
        line-height: 48px;
        // border: 1px solid red;
        color: #333333;
        font-size:20px;
        .tit_left{
            width: 96%;
            height: 100%;
            margin-left: 36px;
            font-weight: 500;
        }
        .tit_right{
            width: 10%;
            height: 100%;
            margin-right: 10px;
            margin-top: -2px;
            text-align: right;
            img{
                width: 18px;
                height: 18px;
            }
        }
    }
    .d_conten{
        width: 8.28rem;
        height: 2.09rem;
        // padding-left: 36px;
        font-size:.16rem;
        border-bottom: 1px solid #6E6F70;
        // border: 1px solid red;
        color:rgba(255,255,255,1);
        overflow: hidden;
        p{
            width: 8.28rem;
            height: .6rem;
            line-height: .65rem;
            text-align: center;
            span{
                display: inline-block;
                width: .8rem;
                text-align: left;
            }
            input{
                padding-left: 4px;
            }
            input,.noAddblur{
                width:3.36rem;
                height:.30rem;
                background:rgba(69,69,69,1);
                border: 1px solid rgba(69,69,69,1);
                box-sizing: border-box;
                border-radius: 3px;
            }
            .addblur{
                border: 1px solid #00a4ff;
                box-sizing: border-box;
            }
        }
        p:nth-child(1){
            margin-top: .12rem;
        }
    }
    .d_foot_btn{
        width: 100%;
        height: 75px;
        line-height: 75px;
        button{
            width:1.2rem;
            height:.34rem;
            margin-left: 6.68rem;
            line-height: .34rem;
            background:rgba(56,56,56,1);
            border: none;
            border-radius:6px;
            font-size:.16rem;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
        }
        button:hover,.b_select{
            background:linear-gradient(0deg,rgba(3,131,245,1),rgba(13,248,247,1));
        }
    }
}
</style>