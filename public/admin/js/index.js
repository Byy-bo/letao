$(function () {
    /*柱状图*/
    zuTf();

    /*饼状图*/
    biTf();
});

/*封装柱状图*/
const zuTf = function () {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('zut'));

    //模拟后台数据
    let data = [
        { name: '一月', value: '360'},
        { name: '二月', value: '660'},
        { name: '三月', value: '1000'},
        { name: '四月', value: '880'},
        { name: '五月', value: '990'},
    ];
    //把数据分成两个数组
    let xData = [], yData = [];
    $(data).each(function (index, item) {
        xData.push(item.name);
        yData.push(item.value);

    });


    // 指定图表的配置项和数据
    let option = {
        title: {
            text: '2019年注册人数'
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    /*替换*/
    option.xAxis.data = xData;
    option.series[0].data = yData;

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
};

/*封装饼状图*/
const biTf = function () {
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('bit'));

    // 指定图表的配置项和数据
    let option = {
        title: {
            text: '热门品牌销售',
            subtext: '2020年6月',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['匡威', '阿迪', '乔丹', '耐克', '李宁', 'AJ']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: '匡威'},
                    {value: 310, name: '阿迪'},
                    {value: 234, name: '乔丹'},
                    {value: 135, name: '耐克'},
                    {value: 999, name: '李宁'},
                    {value: 666, name: 'AJ'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
};
