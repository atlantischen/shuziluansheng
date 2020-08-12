<template>
    <div class="mapping">
        <div class="TD_ifream" :id="idname">
            <div class="rippleWrap" id="alarmdiv"></div>
        </div>
        <div class="icon_back"><img src="../assets/image/icon-back.png" alt="返回"></div>
    </div>
</template>
<script>
import $ from 'jquery';
    export default {
        name:"mapping",
        props:["idname"],
        data(){
            return{
                QYMachineInfoEx: {},
            }
        },
        watch: {
        },
        methods:{},
        mounted:function(){
            console.log(this.idname);
            let that = this;
        }
    }
</script>
<style lang="less" scoped>
.mapping{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:rgba(25,34,102,.6) no-repeat;
    background-position: 100% 100%;
    background-size: 100% 100%;
    z-index: 999; 
}
.icon_back{
    position: absolute;
    left: 30px;
    top:30%;
    height: 100%;
    width: 76px;
}
.icon_back img{
    width: 76px;
    height: 139px;
    margin: auto;
}
.TD_ifream{
    width: 60%;
    height: 60%;
    margin-top: 15%;
    margin-left: 18%;
    background: url("../assets/image/piesquare.png") no-repeat;
    background-size: 100% 100%;
    background-position: 100% 100%;
}
</style>