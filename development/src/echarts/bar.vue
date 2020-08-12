<template>
    <div class="bar">
        <!-- <header class="title" >{{titlevalues}}</header> -->
        <div v-if="isEcharts" class="eid" :id="eid"></div>
    </div>
</template>
<script>
import $ from 'jquery';
import echarts from 'echarts';
import commen from'@/assets/js/commen.js';
    export default {
        name: 'bar',
        mixins: [commen],
        props:["onlyid", "eid", "ekey","echartdata", "echartsListData"],
        data() {
            return{
                backgroundColor: 'rgba(0,0,0,0.5)',
                Xaisdata: ["类别1","类别2","类别3","类别4","类别5","类别6","类别7","类别8","类别9","类别10"],
                bardata:[{   
                    type: 'bar',
                    color:"#0ea0c4",
                    data: [2000,1500,780,2241,5164,947,3713,2143,1832,1232],
                    barWidth: 10, // 柱图宽度
                    barMaxWidth: 10, // 最大宽度
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                {
                                    offset: 0,
                                    color: '#0383f5'
                                }, {
                                    offset: 1,
                                    color: '#0df8f7'
                                }
                            ]),
                        }
                    },
                    label: {//数据上面的值
                        normal: {
                            show: true,
                            position: 'top',
                            fontSize:8,
                            color:"#0096ff"
                        }
                    },
                    markPoint: {
                        symbol: "none",
                        data: [{
                            name: '最大值',
                            type: 'max'
                        }]
                    },
                }],
                titlevalues:'默认echarts',
                titleText:"输入标题",
                barshu:[],
                option:{},
                bar:"",
                isEcharts: true,
                peizhi_ED:{//编辑传参
                },
                Xmargin:"10",
                Ymargin:"20",
                onload: true,
                titFonts:"12",
                XY_fonts:"9"
            }
        },
        watch:{
            onlyid(){//实时监听父级数据的变化
                this.isEcharts = false
            	this.$nextTick(()=>{
            		this.isEcharts = true
            		this.shujuchuli();
            	})
            },
            // peizhi_ED: {
            //     handler(newName, oldName) {
            //         console.log(this.peizhi_ED);
            //         if(this.peizhi_ED.panelTitle) this.$emit('peizhiEDB', this.peizhi_ED, this.onload);                   
            //     },
            //     immediate: true
            // }
        },
        methods:{
            callIndex (data) { // 回调index页面， data 数据， type 添加or替换 Echarts
                this.$emit('callIndex', data, this.ekey); 
            },
            Ereset(data){   // 用于重新渲染
                if (this.echartsListData) this.peizhi_ED = this.echartsListData
              
                // console.log(data, 'datadatadata');
                if(data !== "" && data !== undefined){
                    if(data.type == "titleText"){//标题
                        this.titleText = data.data;
                        this.peizhi_ED.miniAttribute.panelTitle = data.data;
                    }
                    if(data.type == "stylecharts"){//数据显示风格
                        if(data.data == "默认"){
                            this.bardata[0].label={
                                normal: {
                                    show: true,
                                    position: 'top',
                                    fontSize:8,
                                    // color:"#FF7A83"
                                }
                            }
                            if(this.peizhi_ED.miniAttribute.stylePlan == "0"){
                                this.bardata[0].label.normal.color = '#0096ff';
                            }else if(this.peizhi_ED.miniAttribute.stylePlan == "1"){
                                this.bardata[0].label.normal.color = '#FF7A83';
                            }else if(this.peizhi_ED.miniAttribute.stylePlan == "2"){
                                this.bardata[0].label.normal.color = '#00FFFF';
                            }
                            this.bardata[0].markPoint={
                                symbol: "none",
                                data: [{
                                    name: '最大值',
                                    type: 'max'
                                }]
                            }
                            this.peizhi_ED.miniAttribute.colorStyle = data.data;
                        }else if(data.data == "强调"){
                            this.bardata[0].label={
                                normal: {
                                    show: false
                                }
                            }
                            this.bardata[0].markPoint={
                                show:true,
                                symbol: "pin",
                                data: [{
                                    name: '最大值',
                                    type: 'max'
                                }]
                            }
                            this.peizhi_ED.miniAttribute.colorStyle = data.data;
                        }else if(data.data == "简洁"){
                            this.bardata[0].label={
                                normal: {
                                    show: false
                                }
                            }
                            this.bardata[0].markPoint={
                                symbol: "none",
                            }
                            this.peizhi_ED.miniAttribute.colorStyle = data.data;
                        }
                    }
                    if(data.type == "Xaxis"){//X轴间距
                        // this.Xmargin = data.data;
                        this.peizhi_ED.miniAttribute.position.x = data.data;
                        console.log(this.peizhi_ED);
                    }
                    if(data.type == "Yaxis"){//Y轴间距
                        // this.Ymargin = data.data;
                        this.peizhi_ED.miniAttribute.position.y = data.data;
                    }
                    if(data.type == "Wkuan"){//图表宽度
                    // console.log(data.data)
                        $("#"+this.eid).width(data.data);
                        this.peizhi_ED.miniAttribute.size.x = data.data;
                    }
                    if(data.type == "Hgao"){//图表高度
                        $("#"+this.eid).height(data.data);
                        this.peizhi_ED.miniAttribute.size.y = data.data;
                    }
                    if(data.type == "intensity"){//文字大小
                        // console.log(data.data)
                        this.titFonts = data.data;
                        this.XY_fonts = data.data;
                        this.peizhi_ED.miniAttribute.fontSize = data.data;
                    }
                    if(data.type == "coloropacity"){//透明度
                        // console.log(data.data);
                        this.peizhi_ED.miniAttribute.opacity = data.data;
                        let valR = data.data/100;
                        console.log(valR);
                        this.backgroundColor = "rgba(0,0,0,"+valR+")";

                    }
                    if(data.type == "colorKind"){//配色方案
                        if(data.data == "0"){//
                            this.bardata[0].itemStyle.normal={
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#0383f5'
                                    }, {
                                        offset: 1,
                                        color: '#0df8f7'
                                    }
                                ])
                            }
                            this.bardata[0].label.normal.color = '#0096ff';
                            this.peizhi_ED.miniAttribute.stylePlan = "0";
                        }else if(data.data == "1"){
                            this.bardata[0].itemStyle.normal={
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#FF7A83'
                                    }, {
                                        offset: 1,
                                        color: '#9664E8'
                                    }
                                ])
                            }
                            this.bardata[0].label.normal.color = '#FF7A83';
                            this.peizhi_ED.miniAttribute.stylePlan = "1";
                        }else if(data.data == "2"){
                            this.bardata[0].itemStyle.normal={
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    {
                                        offset: 0,
                                        color: '#00FFFF'
                                    }, {
                                        offset: 1,
                                        color: '#14FF00'
                                    }
                                ])
                            }
                            this.bardata[0].label.normal.color = '#00FFFF';
                            this.peizhi_ED.miniAttribute.stylePlan = "2";
                        }
                    }
                    this.callIndex(this.peizhi_ED)
                }
                this.isEcharts = false;
                this.$nextTick(()=>{
                    this.isEcharts = true
                    this.$nextTick(()=> {
                        this.bar = echarts.init(document.getElementById(this.eid));
                        this.option = {
                            backgroundColor:this.backgroundColor,
                            title: {
                                text: this.titleText,
                                left: '12',
                                top: 10,
                                textStyle: {
                                    color: '#EFEFEF',
                                    fontSize:this.titFonts,
                                }
                            },
                            tooltip : {show:false},
                            xAxis : [{
                                type : 'category',
                                data : this.Xaisdata,
                                axisLabel: {//X轴字体样式设置，eg：1000,2000,3000
                                    show: true,
                                    interval:0,
                                    textStyle: {
                                        color:'#EFEFEF',
                                    },
                                    fontSize:this.XY_fonts,//字体大小
                                }, 
                                axisLine:{//X轴样式设置
                                    show: true,
                                    lineStyle:{
                                        color:"#163f91"
                                    }
                                },
                                splitLine:{//间隔线样式设置
                                    show:false,
                                    
                                }
                            }],
                            yAxis : {
                                type : 'value',
                                // show:false,
                                axisLabel: {
                                    interval:0,
                                    textStyle: {
                                        color:'#EFEFEF',
                                    },
                                    fontSize: this.XY_fonts,//字体大小
                                },
                                axisLine:{
                                    show: false,
                                },
                                axisTick:{       //y轴刻度线样式设置
                                    show:false
                                },
                                splitLine:{
                                    show:true,
                                    lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                        color: ['#163f91'],
                                        width: 1,
                                        type: 'dashed'
                                    }
                                }
                            },
                            grid: {//图表位置定位
                                top:"23%",
                                left: "3%",
                                right: '5%',
                                bottom: "6%",
                                containLabel: true
                            },
                            series :this.bardata
                        };
                        if (this.onlyid) {
                            this.shujuchuli();
                        } else {
                            this.bar.setOption(this.option);
                        }
                    })
                })
            },
        },
        mounted: function() {
            // console.log(this.bardata);
            // this.callback() // 回调初始化数据
            let width,height;
            if(this.echartdata == ''){
                width = $(".bar").width();
                height = $(".bar").height();
                console.log(width,height);
                let idadd;
                idadd = (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                let newidadd; 
                newidadd = (idadd+idadd+"-"+idadd+"-"+idadd+"-"+idadd+"-"+idadd+idadd+idadd);
                this.peizhi_ED = {
                    miniID:newidadd,
                    type:"bar",
                    miniBackground:"",
                    layer:1,
                    miniAttribute:{
                        chartsKind:"柱状图",//图表类型
                        stylePlan:"0",//配色方案
                        panelTitle:"输入标题",//标题
                        fontSize:12,//文字大小
                        colorStyle:"默认",//数据显示风格
                        position:{"x":this.Xmargin,"y":this.Ymargin},//x,y轴的间距
                        size:{"x":width,"y":height},//图表的宽高
                        dataStyple:"纯色",//数据显示风格
                        opacity:50,//透明度
                        dataitem:"产量",//数据项
                        // datapoint:[//数据点
                        //     {mcid:"1_1_卷烟机",vrkey:"",sckey:"",name:""},
                        //     {mcid:"1_3_卷烟机",vrkey:"",sckey:"",name:""},
                        //     {mcid:"1_4_卷烟机",vrkey:"",sckey:"",name:""},
                        // ],
                        machineTpye:"卷烟机产量"
                    }
                }
            }else{
                this.peizhi_ED = this.echartdata;
                // console.log(this.peizhi_ED);
                // $("#"+this.eid).width(this.echartdata.miniAttribute.size.x);
                // $("#"+this.eid).height(this.echartdata.miniAttribute.size.y);
                // width = $(".bar").width();
                // height = $(".bar").height();
                // this.peizhi_ED.miniAttribute.size={
                //     "x":width,
                //     "y":height//图表的宽高
                // }
                this.titleText = this.echartdata.miniAttribute.panelTitle;
                this.titFonts = this.echartdata.miniAttribute.fontSize;
                this.XY_fonts = this.echartdata.miniAttribute.fontSize;
                let valR = this.echartdata.miniAttribute.opacity/100;
                this.backgroundColor = "rgba(0,0,0,"+valR+")";
                if(this.echartdata.miniAttribute.stylePlan == "0"){//
                    this.bardata[0].itemStyle.normal={
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#0383f5'
                            }, {
                                offset: 1,
                                color: '#0df8f7'
                            }
                        ])
                    }
                    this.bardata[0].label.normal.color = '#0096ff';
                }else if(this.echartdata.miniAttribute.stylePlan == "1"){
                    this.bardata[0].itemStyle.normal={
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#FF7A83'
                            }, {
                                offset: 1,
                                color: '#9664E8'
                            }
                        ])
                    }
                    this.bardata[0].label.normal.color = '#FF7A83';
                }else if(this.echartdata.miniAttribute.stylePlan == "2"){
                    this.bardata[0].itemStyle.normal={
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: '#00FFFF'
                            }, {
                                offset: 1,
                                color: '#14FF00'
                            }
                        ])
                    }
                    this.bardata[0].label.normal.color = '#00FFFF';
                }
                // this.Xmargin = $("#"+this.eid).width(this.echartdata.miniAttribute.size.x);
                // this.Xmargin = $("#"+this.eid).height(this.echartdata.miniAttribute.size.y);
                if(this.echartdata.miniAttribute.colorStyle == "默认"){
                    this.bardata[0].label={
                        normal: {
                            show: true,
                            position: 'top',
                            fontSize:8,
                        }
                    }
                    if(this.peizhi_ED.miniAttribute.stylePlan == "0"){
                        this.bardata[0].label.normal.color = '#0096ff';
                    }else if(this.peizhi_ED.miniAttribute.stylePlan == "1"){
                        this.bardata[0].label.normal.color = '#FF7A83';
                    }else if(this.peizhi_ED.miniAttribute.stylePlan == "2"){
                        this.bardata[0].label.normal.color = '#00FFFF';
                    }
                    this.bardata[0].markPoint={
                        symbol: "none",
                        data: [{
                            name: '最大值',
                            type: 'max'
                        }]
                    }
                }else if(this.echartdata.miniAttribute.colorStyle == "强调"){
                    this.bardata[0].label={
                        normal: {
                            show: false
                        }
                    }
                    this.bardata[0].markPoint={
                        show:true,
                        symbol: "pin",
                        data: [{
                            name: '最大值',
                            type: 'max'
                        }]
                    }
                }else if(this.echartdata.miniAttribute.colorStyle == "简洁"){
                    this.bardata[0].label={
                        normal: {
                            show: false
                        }
                    }
                    this.bardata[0].markPoint={
                        symbol: "none",
                    }
                }
            }
            this.Ereset();
            this.callIndex(this.peizhi_ED);
            console.log(this.peizhi_ED);
        }
    }
</script>
<style lang="less" scoped>
.bar{
    width: 100%;
    height:100%;
    border: 1px solid #0096ff;
    box-sizing: border-box;
    .eid{
        width: 100%;
        height:100%;
    }
}
// .bar, .bar > div{
//     width: 100%;
//     height:100%;
// }
.title {
    height: 5%;
    // margin: 5px 0 0 0;
    text-align: center;
    font-size: 20px;
}
</style>