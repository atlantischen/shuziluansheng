<template>
    <div class="test">
        <div class="block">
            <span class="demonstration">自定义初始值</span>
            <el-slider v-model="value2"></el-slider>
            <el-select v-model="value1" filterable placeholder="">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <span class="xiala"></span>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value1: 0,
                value2: 50,
                value3: 36,
                value4: 48,
                value5: 42,
                text_val:'',
                text_val1:'',
                options: [{
                    value: '选项1',
                    label: '无事件'
                }, {
                    value: '选项2',
                    label: '点击事件'
                }, {
                    value: '选项3',
                    label: '滑动时间'
                }],
                value: '无事件',
                value1: '无事件',
                ziyuandata:{},
            }
        }, 
        watch:{
            text_val(){
                this.slider_val = Number(this.text_val);
            },
            slider_val(){
                this.text_val = this.slider_val;
            },
        },
        methods: {
            formatTooltip(val) {
                return val / 100;
            }
        },
        mounted:function(){
            // this.ziyuandata = [
                //     {
                //         "id": 10001,
                //         "name": "包装机1",
                //         "iconPath": "http://47.112.23.49/HLXD/cloudeditor/source/icon/icon01.png",
                //         "attribute": {
                //             "modePath": "../static/models/fbx/0703/JZ.FBX",
                //             "modelInteractive": [1,1,0,0]
                //         },
                //     },
                //     {
                //         "id": 10002,
                //         "name": "包装机2",
                //         "iconPath": "http://47.112.23.49/HLXD/cloudeditor/source/icon/icon01.png",
                //         "attribute": {
                //             "modePath": "../static/models/fbx/0703/JZ.FBX",
                //             "modelInteractive": [1,1,0,0]
                //         }
                //     },
                //     {
                //         "id": 10003,
                //         "name": "包装机3",
                //         "iconPath": "http://47.112.23.49/HLXD/cloudeditor/source/icon/icon01.png",
                //         "attribute": {
                //             "modePath": "../static/models/fbx/0703/JZ.FBX",
                //             "modelInteractive": [1,1,0,0]
                //         }
                //     }
                // ]
        }
    }
</script>

<style lang="less" scoped>

</style>
<style lang="less">
.el-select-dropdown__item {
    height: auto;
    line-height: 20px;
}

.xiala{
    display: inline-block;
    width: 12px;
    height: 30px;
    margin: 0;
    background: url("../../static/img/index-4.png") no-repeat;
    background-position: 50% 50%; 
    border-left: 1px solid #747474;
}
.el-select{
    width: 28%;
    height: 20px;
    line-height: 20px;
    margin-right: 10px;
    .el-input{
        width: 100%;
        height: 20px;
        line-height: 20px;
    }
    .el-input__inner{
        width: 100%;
        height: 20px;
        padding-left: 6px;
        line-height: 20px;
        background: #3B3B3B;
        border: 1px solid #707070;
        border-radius: 3px!important;
    }
    .el-input__suffix{
        height: 20px;
        line-height: 20px;
        padding: 0;
    }
    .el-select-dropdown{
        margin: 0;
    }
    .el-scrollbar__view{
        width: 100%;
        height: 20px;
        padding-left: 6px;
        line-height: 20px;
        background: #3B3B3B;
        border: 1px solid #707070;
    }
}
.el-input__icon {
    height: 20px;
    line-height: 20px;
}
</style>
