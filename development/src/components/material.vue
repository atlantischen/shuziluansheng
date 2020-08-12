<template>
    <div class="material">
        <li class="CPr_contDiv_li li_two">
            <p class="CPr_lip_tit">
                <span>材质</span>
            </p>
            <p class="type_lie lip_con">
                <span>材质切换 :</span>
                <span>
                    <select v-model="selectItem" @change="selectFn(selectItem)" class="selectla">
                        <option :value="item" v-for="(item, key) in typeList" :key="key">{{item}}</option>
                    </select>
                </span>
            </p>
        </li>
    </div>
</template>
<script>
export default {
    name:"material",
    props:["materialList","material","delettreeLID"],
    data(){
        return{
            selectItem:"",
            typeList:[],
            // materialList:[],
        }
    },
    watch:{
        materialList(){
            // console.log(this.materialList);
            this.typeList = [];
            this.typeList = this.materialList;
            if(this.typeList.length > 0){
                // console.log(this.typeList[0]);
                this.selectItem = this.typeList[0];
            }
        },
        delettreeLID(){
            // console.log(this.delettreeLID);
        }
    },
    methods:{
        selectFn(item){
            console.log(item);
            let key = 0;
            for (let i = 0; i<this.typeList.length; i++) {
                if(this.typeList[i] == item) {
                    key = i;
                }
            }
            // console.log(key,this.delettreeLID);
            this.material.changeMaterial(key,this.delettreeLID,item);
        }
    },
    mounted:function(){
        // console.log(this.materialLists);
        $(".CPr_lip_color span:eq(0)").addClass('selecedspan');
        // $eventBus.$on('sourceTree', (res)=>{
        //     console.log(res);
        //     that.materialList = res.material
        // });
    }
}
</script>

<style lang="less" scoped>
.material{
    .CPr_contDiv_li{
        width: 100%;
        min-width: 336px;
        padding-bottom: 12px;
        padding-left: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.4);
        box-sizing: border-box;
        color: #fff;
        .CPr_lip_tit{
            width: 100%;
            height: 42px;
            line-height: 48px;
            font-size: 14px;
            img{
                margin-top: -2px;
            }
        }
        .lip_con{
            width: 90%;
            padding: 1px;
            span{
                font-size: 12px;
            }
            select{
                width: 200px;
                height: 22px;
                line-height: 35px;
                padding-left: 3px;
                background:rgba(39,39,39,1);
                border-radius:2px;
                border: none;
                color: #fff;
                option{
                    height: 22px;
                    line-height: 22px;
                    background: #C2C2C2;
                    color: #333333;
                }
            }
            select:focus{
                outline:none;
                border: 1px solid #0096ff;
                border-radius: 5px;
            }
        }
        // .type_lie{
        //     width: 100%;
        //     margin-top: 10px;
        //     height: 27px;
        //     line-height: 27px;
        //     color: #ffff;
        // }
    }
}
</style>