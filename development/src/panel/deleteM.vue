<template>
    <div class="delete-drag" v-if="delete_sh">
        <div class="box delete popup-box" data-drag="true" @click="boxZindex" :style="{'z-index': Zindex}">
            <h1 class="b_title darg-title">
                <p class="tit_left">{{tit_val}}</p>
                <p class="tit_right" @mouseover="R_selectStyle()" @mouseout="R_outStyle()">
                    <img src="../../static/img/N-dele.png" v-if="bselected">
                    <img src="../../static/img/N-d-select.png" v-else @click="noneother()">
                </p>
            </h1>
            <div class="d_conten">
                <p>{{conten_val}}
                    <span>{{TheRed}}</span>
                    {{val_end}}
                </p>
            </div>
            <div class="d_foot_btn">
                <button @click="confirmD()">{{clickYes}}</button>
                <button @click="cancelD()">{{clickNo}}</button>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import drag from '../../static/js/drag'
    export default {
        name:"bounced",
        props:["deleteM","treeclickD","index","delet_kind"],
        data(){
            return{
                tit_val:"",
                conten_val:"",
                TheRed:'',
                val_end:'',
                delete_sh:true,
                Zindex:0,
                bselected : true,//图片选中的判断
                parentID:'',
                clickYes:'确定',
                clickNo:"取消"
            }
        },
        watch:{
            treeclickD:{
                handler(newName, oldName) {
                    // console.log(this.dragDropList);
                    if(this.treeclickD){
                        console.log(this.treeclickD);
                        this.parentID = this.treeclickD;
                    }
                },
                // 开启深度监听
                deep: true
            },
        },
        methods:{
            noneother(){//点击X,隐藏整个弹框
                this.delete_sh = false;
                this.$emit('closepanel', "模型");
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
            confirmD(){//确认
                this.noneother();
                if(this.delet_kind == "模型"){
                    console.log(this.parentID);
                    this.deleteM.deleteObjectFromElement(this.parentID);
                }
            },
            cancelD(){//取消
                console.log("取消")
                this.noneother();
            },
        },
        mounted:function(){
            drag('delete-drag', '')
            this.Zindex = this.index;
            console.log(this.treeclickD);
            this.parentID = this.treeclickD;
            console.log(this.delet_kind);
            if(this.delet_kind == "模型"){
                this.tit_val = "删除";
                this.conten_val = "删除就不可恢复，确定删除吗？";
                this.clickYes = '确定';
                this.clickNo = "取消";
            }else if(this.delet_kind == "历史记录"){
                this.tit_val = "清空历史";
                this.conten_val = "撤销、重做历史记录将被";
                this.TheRed = "清空";
                this.val_end = "，确定吗？";
                this.clickYes = '是';
                this.clickNo = "否";
            }
        }
    }
</script>
<style lang="less" scoped>
.box {
    position: absolute;
}
.delete{
    position: absolute;
    top: calc(50% - 130px);
    left: calc(50% - 280px);
    width: 558px;
    min-width:558px;
    height: 260px;
    min-height: 260px;
    background: #535353;
    overflow: hidden;
    border-radius:6px;
    .b_title{
        display: flex;
        width:558px;
        height:48px;
        background:rgba(194,194,194,1);
        line-height: 48px;
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
        width: 100%;
        height: 136px;
        padding-left: 36px;
        line-height: 136px;
        font-size:16px;
        border-bottom: 1px solid #6E6F70;
        color:rgba(255,255,255,1);
        span{
            color: red;
        }
    }
    .d_foot_btn{
        width: 100%;
        height: 75px;
        line-height: 75px;
        button:nth-child(1){
            margin-left: 269px;
        }
        button:nth-child(2){
            margin-left: 26px;
        }
        button{
            width:120px;
            height:34px;
            line-height: 34px;
            background:rgba(56,56,56,1);
            border: none;
            border-radius:6px;
            font-size:16px;
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
<style lang="less">


</style>
