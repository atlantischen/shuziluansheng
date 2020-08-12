import echarts from 'echarts'
import $ from 'jquery'
export default {
    data() {
        return {
            echartsOption: {

            }
        }
    },
    watch: {
        insideDiameter(newVal, old) { //监控实时改变圆的大小
            if (newVal > this.outerDiameter) {
                this.$nextTick(() => {
                    this.insideDiameter = this.outerDiameter - 10
                })
            } else {
                this.qiehuanEcharts(); // 改变echarts
            }
        },
        outerDiameter(newVal, old) {
            if (newVal < this.insideDiameter) {
                this.$nextTick(() => {
                    this.outerDiameter = this.insideDiameter + 10
                })

            } else {
                this.qiehuanEcharts(); // 改变echarts
            }
        }
    },
    methods: {
        qiehuanEcharts() {
            let itemLs = this.itemLsRE
                // console.log(itemLs, 'itemLs')
            if (itemLs == "pie_ring") {
                this.pie_ring();
            } else if (itemLs == "pie_customized") {
                this.pie_customized();
            } else if (itemLs == "piek") {
                this.piek();
            } else if (itemLs == "line_basic") {
                let xzhouls = this.Xaxis;
                let linedas = this.lineshu;
                this.line_basic(xzhouls, linedas);
            } else if (itemLs == "line_area") {
                let xzhouls = this.Xaxis;
                let linedas = this.lineshu;
                this.line_area(xzhouls, linedas);
            } else if (itemLs == "line_smoothed") {
                let xzhouls = this.Xaxis;
                let linedas = this.lineshu;
                this.line_smoothed(xzhouls, linedas);
            } else if (itemLs == "bar_vertical") {
                let xzhouls = this.Xaxis;
                let linedas = this.barshu;
                this.bar_vertical(xzhouls, linedas);
            } else if (itemLs == "bar_cross") {
                let xzhouls = this.Xaxis;
                let linedas = this.barshu;
                this.bar_cross(xzhouls, linedas);
            }
            this.optionstyle();
        },
        optionstyle() { //生成Echarts的方法idname, idecharts
            this.loadings = false
            setTimeout(() => {
                this.loadings = true
                this.$nextTick(() => {
                    let echartpie = echarts.init(document.getElementById('echartpie1')); //MCU驱动电机控制器
                    let option = this.option;
                    echartpie.setOption(option);
                })
            })
        },
        pie_ring() { //圆环图
            this.option = {
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
                series: {
                    type: 'pie',
                    legend: {
                        formatter: function(name) {
                            for (var i = 0; i < this.jsondata.pageList.length; i++) {
                                let data = this.jsondata.pageList[i].name;
                                console.log(data);
                                return data
                            }
                        }
                    },
                    radius: [`${this.insideDiameter}%`, `${this.outerDiameter}%`],
                    center: ['50%', '50%'],
                    data: this.jsondata.pageList
                }
            }
        },
        pie_customized() { //馅饼
            this.option = {
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
                series: {
                    type: 'pie',
                    radius: [`${this.insideDiameter}%`, `${this.outerDiameter}%`],
                    center: ['50%', '50%'],
                    data: this.jsondata.pageList.sort(function(a, b) { return a.value - b.value; })
                },
                roseType: 'radius',
                itemStyle: { normal: { color: '#c23531', shadowBlur: 200, shadowColor: 'rgba(0, 0, 0, 0.5)' } },
            }
        },
        piek() { //饼图
            this.option = {
                tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
                series: {
                    type: 'pie',
                    radius: [`${this.insideDiameter}%`, `${this.outerDiameter}%`],
                    center: ['50%', '50%'],
                    data: this.jsondata.pageList
                }
            }
        },
        line_basic(xzhoul, lineBda) { //基础折线
            for (var i = 0; i < lineBda.length; i++) {
                if (lineBda[i]['areaStyle']) {
                    delete lineBda[i]['areaStyle']
                    delete lineBda[i]['stack']
                }
                lineBda[i].smooth = false;
            }
            this.option = {
                color: this.colorName,
                tooltip: { trigger: 'axis' },
                legend: {
                    data: xzhoul,
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: { type: 'category', boundaryGap: false, data: xzhoul, textStyle: { fontSize: 8 }, axisLabel: { interval: 0, rotate: 40 } },
                yAxis: { type: 'value', textStyle: { fontSize: 8 } },
                series: lineBda
            }
        },
        line_area(xzhoul_1, lineAda) { //面积折线图
            for (var i = 0; i < lineAda.length; i++) {
                lineAda[i].areaStyle = {};
                lineAda[i].smooth = true;
                lineAda[i].stack = '总量';
            }
            this.option = {
                backgroundColor: '',
                color: this.colorName,
                legend: {
                    data: xzhoul_1
                },
                grid: { left: '6%', right: '4%', bottom: '3%', containLabel: true },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', boundaryGap: false, data: xzhoul_1, axisLabel: { interval: 0, rotate: 40 } },
                yAxis: { type: 'value' },
                series: lineAda
            }

        },
        line_smoothed(xzhoul_2, lineSda) { //曲线图
            for (var i = 0; i < lineSda.length; i++) {
                if (lineSda[i]['areaStyle']) {
                    delete lineSda[i]['areaStyle'];
                    delete lineSda[i]['stack'];
                }
                lineSda[i].smooth = true;
            }
            this.option = {
                color: this.colorName,
                legend: {
                    data: xzhoul_2
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', boundaryGap: false, data: xzhoul_2, axisLabel: { interval: 0, rotate: 40 } },
                yAxis: { type: 'value' },
                series: lineSda
            }
            console.log(this.option);
        },
        bar_vertical(xzhoub, barda) { //竖向柱状图
            this.option = {
                color: this.colorName,
                legend: {
                    data: xzhoub
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                xAxis: { type: 'category', data: xzhoub, axisLabel: { interval: 0, rotate: 40 } },
                yAxis: { type: 'value' },
                series: barda
            }
        },
        bar_cross(xzhoub, barda) { //横向柱状图
            this.option = {
                color: this.colorName,
                legend: {
                    data: xzhoub
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                xAxis: { type: 'value' },
                yAxis: { type: 'category', data: xzhoub, axisLabel: { interval: 0, rotate: 40 } },
                series: barda
            }
        },
        selects(value) { //选择数据项
            this.tableValue = [];
            this.jsondata.hang = value;
            this.colorPlugin();
            for (let i = 0; i < Number(value); i++) {
                this.tableValue.push({
                    titleitem: '2',
                    dataitem: '3',
                    coloritem: '4'
                })
            }
        },
        resetDiameter() { //内径外径
            this.isDiameter = false;
            this.insideDiameter = 40
            this.outerDiameter = 65
            setTimeout(() => {
                this.isDiameter = true
            });

        },
        openclick() { //点击显示侧边栏方法
            $("#iconleft").css("display", "none");
            $("#iconright").css("display", "block");
            $("#aside").css("width", "434px");
            $("#aside").animate({ left: "+=170px" }, 300);

        },
        closeclick() { //点击影藏侧边栏方法
            $("#iconleft").css("display", "block");
            $("#iconright").css("display", "none");
            $("#aside").css("width", "170px");
            $("#aside").animate({ left: "-=170px" }, 300);
        },
        colorPlugin() { //颜色的方法
            setTimeout(() => {
                this.$nextTick(() => {
                    let that = this
                    $('.demo').each(function() {
                        $(this).minicolors({
                            control: $(this).attr('data-control') || 'hue',
                            defaultValue: $(this).attr('data-defaultValue') || '',
                            inline: $(this).attr('data-inline') === 'true',
                            letterCase: $(this).attr('data-letterCase') || 'lowercase',
                            opacity: $(this).attr('data-opacity'),
                            position: $(this).attr('data-position') || 'bottom left',
                            change: function(hex, opacity) {
                                if (!hex)
                                    return;
                                if (opacity)
                                    hex += ', ' + opacity;
                                try {
                                    // console.log(11111)
                                    that.colorName = hex;
                                    that.savalist();
                                    // that.selects(that.select);
                                    // that.qiehuanEcharts();
                                } catch (e) {}
                            },
                            theme: 'bootstrap'
                        });
                    });
                })
            })
        }

    },
    mounted: function() {
        this.colorPlugin();
    }



}