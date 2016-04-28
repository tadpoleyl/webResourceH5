define("myCharts", ["echarts"], function () {
    function init(id, option) {
        var myChart = echarts.init($('#' + id)[0]);
        myChart.setOption(option);
    }
    return init;
});