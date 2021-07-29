/**
 * Created by forbiz on 2019-02-11.
 */
 const ktGigaSoundChart = () => {
    const $document = $(document);

    const date_picker = () => {
        $document.on("click", ".js__calendar", function(){
            $(this).datepicker();
        });
    }

    const status_green = () => {
        $document.on("click", ".lightGraph__box__control", function(){
            const $this = $(this);
            $this.closest(".lightGraph__box")
                .removeClass("yellow")
                .removeClass("red")
                .addClass("green")
                .find(".lightGraph__box__title em").html("정상");
        });
    }

    const sort_click = () => {
        $document.on("click", ".lineGraph__sort--button button", function () {
            $(this).addClass("on").siblings().removeClass("on");
        });
    };

    const chartInit = () => {
        "use strict";
        Highcharts.setOptions({
            chart: {
                backgroundColor: "#fff",
                animation: false,
            },
            title: {
                text: null
            },
            labels: {
                style: {
                    color: 'transparent',
                },
                enabled: false,
            },
            legend: {
                enabled: false,
                shadow: false,
                color: "#000",
            },
            xAxis: {
                labels: {
                    rotation: -25,
                },
                tickInterval: 1,
                tickColor: 'transparent',
            },
            yAxis: {
                title: {
                    text: null,
                },
                lineWidth: 1,
            },
            credits: {// 구석에 하이차트 주소 뜨는것
                enabled: false
            },
            plotOptions: {
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0,
                }
            },
            tooltip: {
                shared: true,
                enabled: true,
                color: "gray",
                fontWeight: "bold",
                borderWidth: 0,
                formatter: function () {
                    return this.y;
                }
            },
        });
        var highChartDraw = {
            runChart: function (avgoption, dataoption, dateLabel) {
                var option = {
                    chart: {
                        type: "column",
                    },
                    xAxis: {
                        categories: dateLabel, //x축 값
                    },
                    yAxis: {
                        min: 0,
                    },
                    series: [{
                            color: 'transparent',
                            borderWidth: 2,
                            borderColor: "#999",
                            data: avgoption,
                            pointPadding: 0.39,
                            pointPlacement: -0.2
                                    // pointPadding: 0.45,
                                    // pointPlacement: -0.05
                        }, {
                            //color: '#00b653',
                            opacity: 0.6,
                            data: dataoption,
                            pointPadding: 0.39,
                            pointPlacement: -0.2,
                            // pointPadding: 0.46,
                            // pointPlacement: -0.05
                        }]
                };
                $("#runHigh").highcharts(option);
            },
            soundTrendChart: function (data1, data2, dateLabel) {
                $("#soundTrendHigh").highcharts({
                    chart: {
                        type: "line"
                    },
                    xAxis: [{
                            categories: dateLabel, //x축 값
                        }],
                    yAxis: [{}],
                    series: [{
                            color: 'red',
                            data: data1
                        }, {
                            color: 'blue',
                            data: data2
                        }]
                });
            },
            vibChart: function (data1, data2, lineData, dateLabel) {
                var self = highChartDraw;
                var minFast = 0;
                var maxFast = 1000;
                var minSlow = 0;
                var maxSlow = 1000;

                $("#vibHigh").highcharts({
                    xAxis: [{
                            categories: dateLabel,
                        }],
                    series: [
                        {
                            type: 'line',
                            color: 'red',
                            data: data1,
                            tooltip: {
                                valueSuffix: ''
                            },
                            zIndex: 10,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: false,
                                    }
                                },
                            },
                            ordinal: false,
                            minorGridLineWidth: 1,
                            minorTickInterval: 'auto',
                            showLastLabel: true,
                            startOnTick: true,
                            endOnTick: false
                        }, {
                            name: '',
                            color: 'blue',
                            type: 'line',
                            data: data2,
                            zIndex: 10,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: false,
                                    }
                                }
                            },
                        }, {
                            name: '',
                            color: 'gray',
                            type: 'line',
                            data: lineData,
                            allowPointSelect: false,
                            zIndex: 12,
                            marker: {
                                enabled: true,
                                symbol: 'circle',
                                states: {
                                    select: {
                                        fillColor: 'red',
                                        lineWidth: 0
                                    }
                                }
                            },
                            cursor: 'pointer',
                        },
                        self.createRangeUp(data1, minFast, maxFast, data2, minSlow, maxSlow),
                        self.createRangeDown(data1, minFast, maxFast, data2, minSlow, maxSlow)
                    ]
                });
            },
            tempChart: function (data1, data2, dateLabel) {
                $("#tempHigh").highcharts({
                    chart: {
                        type: "line",
                    },
                    xAxis: [{
                            categories: dateLabel,
                        }],
                    yAxis: [{
                            min: 0,
                        }],
                    series: [{
                            color: 'red',
                            data: data1,
                        }, {
                            color: 'blue',
                            data: data2,
                        }]
                });
            },
            soundChart1: function (data1, data2, lineData, dateLabel) {
                var self = highChartDraw;
                $("#soundHigh1").highcharts({
                    xAxis: {
                        categories: dateLabel,
                    },
                    yAxis: {
                        min: -100,
                        max: 100
                    },
                    series: [
                        {
                            name: '',
                            color: 'red',
                            type: 'line',
                            data: data1,
                            tooltip: {
                                valueSuffix: ''
                            },
                            zIndex: 10,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: false,
                                    }
                                }
                            },
                        }, {
                            color: 'blue', // 위아래 삐죽
                            type: 'line',
                            data: data2, //dataFast,
                            zIndex: 10,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {// hover할때 마커 색
                                        enabled: false,
                                    }
                                }
                            },
                        }, {
                            name: '',
                            color: 'gray', // 마커 있는 선 중간선 이게 회색선 나올거임 일단 투명상태
                            type: 'line',
                            data: lineData,
                            allowPointSelect: false,
                            zIndex: 12,
                            marker: {
                                enabled: true,
                                symbol: 'circle',
                                states: {
                                    select: {
                                        fillColor: 'red',
                                        lineWidth: 0
                                    }
                                }
                            },
                            cursor: 'pointer',
                        },
                        self.limitUp(data1, lineData),
                        self.limitDown(data2, lineData)
                    ]
                });
            },
            soundChart2: function (data1, data2, lineData, dateLabel) {
                var self = highChartDraw;
                $("#soundHigh2").highcharts({
                    xAxis: [{
                            categories: dateLabel,
                        }],
                    series: [
                        {
                            name: '',
                            color: 'red',
                            type: 'line',
                            data: data1,
                            tooltip: {
                                valueSuffix: ''
                            },
                            zIndex: 10,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {
                                        enabled: false,
                                    }
                                }
                            },
                            ordinal: false,
                            minorGridLineWidth: 1,
                            minorTickInterval: 'auto',
                            showLastLabel: true,
                            startOnTick: true,
                            endOnTick: false

                        }, {
                            color: 'blue', // 위아래 삐죽
                            type: 'line',
                            data: data2, //dataFast,
                            zIndex: 10,
                            marker: {
                                enabled: false,
                                states: {
                                    hover: {// hover할때 마커 색
                                        enabled: false,
                                    }
                                }
                            },
                        }, {
                            name: '',
                            color: 'gray', // 마커 있는 선 중간선 이게 회색선 나올거임 일단 투명상태
                            type: 'line',
                            data: lineData,
                            allowPointSelect: false,
                            zIndex: 12,
                            marker: {
                                enabled: true,
                                symbol: 'circle',
                                states: {
                                    select: {
                                        fillColor: 'red',
                                        lineWidth: 0
                                    }
                                }
                            },
                            cursor: 'pointer',
                        },
                        self.limitUp(data1, lineData),
                        self.limitDown(data2, lineData)
                    ]
                });
            },
            limitUp: function (limitTop, realData) {
                var overLimit = [];
                for (var i = 0; i < realData.length; i++) {
                    if (realData[i] >= limitTop[i]) {
                        overLimit[i] = [limitTop[i], realData[i]];
                    } else {
                        overLimit[i] = [limitTop[i], limitTop[i]];
                    }
                }
                //console.log(overLimit);

                return {
                    name: 'overLimit',
                    type: 'areasplinerange',
                    data: overLimit,
                    lineColor: 'transparent',

                    fillColor: 'rgba(255, 0, 0, 0.7)', // 위영역 색
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                fillColor: 'transparent',
                                lineColor: 'transparent',
                                width: 1,
                            }
                        }
                    },
                    zIndex: 0,
                };
            },
            limitDown: function (limitBottom, realData) {
                var overLimit = [];
                for (var i = 0; i < realData.length; i++) {
                    if (realData[i] <= limitBottom[i]) {
                        overLimit[i] = [limitBottom[i], realData[i]];
                    } else {
                        overLimit[i] = [limitBottom[i], limitBottom[i]];
                    }
                }
                //console.log(overLimit);

                return {
                    name: 'overLimit',
                    type: 'areasplinerange',
                    data: overLimit,
                    lineColor: 'transparent',

                    fillColor: 'rgba(0, 0, 255, 0.7)', // 위영역 색
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                fillColor: 'transparent',
                                lineColor: 'transparent',
                                width: 1,
                            }
                        }
                    },
                    zIndex: 0,
                };
            },
            createRangeUp: function (data1, min1, max1, data2, min2, max2) {

                //we apply
                var topList = [];
                var bottomList = [];
                for (var i = 0; i < data2.length; i++) {
                    if (data2[i] <= data1[i]) {
                        //파란선 <= 빨간선
                        topList.push(data1[i])
                    } else {
                        topList.push(data2[i]);
                    }

                    if (data2[i] > data1[i]) {
                        //파란선 > 빨간선
                        bottomList.push(data1[i])
                    } else {
                        // 파란선 <= 빨간선
                        bottomList.push(data2[i]);
                    }
                }

                var b = min1 - min2;
                var a = (max1 - b) / max2;

                var rangeData = [];
                /*$.each(data1, function(index, value) {
                var value2 = a*data2[index] + b; // 0
                rangeData2.push([value, value2]);
                });
                */
                for (var i = 0; i < topList.length; i++) {
                    var value2 = a * topList[i] + b; // 0
                    rangeData.push([topList[i], data2[i]]);

                }
                //return the third serie, used to fill the area between our 2 series.
                return {
                    name: 'toparea',
                    type: 'arearange',
                    data: rangeData,
                    lineColor: 'transparent',

                    fillColor: 'rgba(255, 0, 0, 0.7)', // 위영역 색
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                fillColor: 'transparent',
                                lineColor: 'transparent',
                                width: 1,
                            }
                        }
                    },
                    zIndex: 0,
                };
            },
            createRangeDown: function (data1, min1, max1, data2, min2, max2) {
                var topList = [];
                var bottomList = [];
                for (var i = 0; i < data2.length; i++) {
                    if (data2[i] <= data1[i]) {
                        topList.push(data1[i])
                    } else {
                        topList.push(data2[i]);
                    }

                    if (data2[i] > data1[i]) {
                        bottomList.push(data1[i])
                    } else {
                        bottomList.push(data2[i]);
                    }
                }

                var b = min1 - min2; // 0
                var a = (max1 - b) / max2;

                var rangeData2 = [];
                /*$.each(data1, function(index, value) {
                var value2 = a*data2[index] + b; // 0
                rangeData2.push([value, value2]);
                });
                */
                for (var i = 0; i < bottomList.length; i++) {
                    var value2 = a * bottomList[i] + b; // 0

                    rangeData2.push([bottomList[i], data2[i]]);
                }

                //return the third serie, used to fill the area between our 2 series.
                return {
                    name: 'bottomarea',
                    type: 'arearange',
                    data: rangeData2,
                    lineColor: 'transparent',

                    fillColor: 'rgba(0, 0, 255, 0.7)', // 아래영역 색
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                fillColor: 'transparent',
                                lineColor: 'transparent',
                                width: 1,
                            }
                        }
                    },
                    zIndex: 0,
                };
            },
        };

        var sampleData = {
            vibTop: [
                110.7590, 110.7651, 110.7784, 110.7962, 110.8167, 110.7902, 110.7850, 110.7725, 110.6095, 110.6385, 110.6395, 110.3866,
                110.3532, 110.3118, 110.2841, 110.3009, 110.3015, 110.1807, 110.1773, 110.1704, 110.1667, 110.1747, 110.1891, 110.1969,
                110.2520, 110.3236, 110.3435, 110.3453, 110.4189, 110.4799, 110.4617, 110.4644, 110.4555, 110.4672, 110.5139, 110.5189,
                110.5172, 110.5806, 110.6586, 110.7008, 110.6619, 110.8248, 110.9255, 110.9828, 111.0020, 110.9172, 110.7772, 110.6378,
            ],
            vibBottom: [
                110.7502, 110.7499, 110.7536, 110.7319, 110.7228, 110.7063, 110.6767, 110.6423, 110.5807, 110.5732, 110.5539, 110.4368,
                110.4342, 110.4103, 110.4003, 110.4281, 110.4233, 110.4139, 110.4068, 110.4125, 110.4011, 110.4069, 110.3830, 110.3780,
                110.3947, 110.3987, 110.4060, 110.4252, 110.4455, 110.4563, 110.4473, 110.4692, 110.4685, 110.4921, 110.5065, 110.5133,
                110.5345, 110.5697, 110.5707, 110.5736, 110.6136, 110.6563, 110.6661, 110.6616, 110.6557, 110.6492, 110.6124, 110.5756,
            ],
            vibMiddle: [
                111, 110.7544, 110.7632, 110.7657, 110.7654, 110.7609, 110.7376, 110.7018, 110.5940, 110.6058, 110.5851, 110.4014,
                110.4178, 110.3584, 110.3414, 110.3781, 110.3636, 110.3431, 110.2794, 110.2613, 110.3006, 110.2293, 110.2920, 110.2736,
                110.3181, 110.3693, 110.3796, 110.3983, 110.4296, 110.4751, 110.4533, 110.4671, 110.4612, 110.4792, 110.5102, 110.5159,
                110.5245, 110.5733, 110.6260, 110.7756, 110.8197, 110.9583, 110.9791, 110.9406, 110.8320, 110.7515, 110.7820, 110.7115,
            ],
            soundTop: [
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
                50.7590, 50.7651, 50.7784, 50.7962, 50.8167, 50.7902, 50.7850, 50.7725, 50.6095, 50.6385, 50.6395, 50.3866,
                50.3532, 50.3118, 50.2841, 50.3009, 50.3015, 50.1807, 50.1773, 50.1704, 50.1667, 50.1747, 50.1891, 50.1969,
            ],
            soundBottom: [
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
                -50.7502, -50.7499, -50.7536, -50.7319, -50.7228, -50.7063, -50.6767, -50.6423, -50.5807, -50.5732, -50.5539, -50.4368,
                -50.4342, -50.4103, -50.4003, -50.4281, -50.4233, -50.4139, -50.4068, -50.4125, -50.4011, -50.4069, -50.3830, -50.3780,
            ],
            soundMiddle: [
                -10, 1.7544, 10.7632, 12.7657, 20.7654, 30.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
                -10, 1.7544, 10.7632, 12.7657, 20.7654, 30.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
                -10, 1.7544, 10.7632, 12.7657, 20.7654, 30.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
                -10, 1.7544, 10.7632, 12.7657, 20.7654, 30.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
                -20, -30.7544, -50.7632, -70.7657, -62.7654, -50.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
                -10, 1.7544, 10.7632, 12.7657, 20.7654, 30.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
                -10, 1.7544, 10.7632, 12.7657, 20.7654, 30.7609, 40.7376, 55.7018, 60.5940, 65.6058, 60.5851, 40.4014,
                35.4178, 35.3584, 35.3414, 33.3781, 20.3636, 10.3431, 10.2794, 10.2613, 10.3006, 10.2293, 10.2920, 0.2736,
            ],
            runAvg: [150, 73, 20],
            runData: [{
                    y: 140,
                    color: "red"
                }, {
                    y: 90,
                    color: "blue"
                }, {
                    y: 40,
                    color: "blue"
                }],
        };

        var machineObj = {
            enginA: [],
            enginB: [],
            burn: [],
            vibration: [],
            soundBound: [],
            soundCollBound: [],
            soundChu: [],
            machineStatus: function (device) {
                var self = machineObj;
                window.setTimeout(function () {
                    $("#devPopVib").removeClass();
                    $("#devPopVib").addClass("lightGraph__box");
                    $("#devPopVib").addClass(device.data("vib"));
                    $("#devPopVib > dt > span >em").text(device.data("vibtxt"));

                    $("#devPopTem").removeClass();
                    $("#devPopTem").addClass("lightGraph__box");
                    $("#devPopTem").addClass(device.data("tem"));
                    $("#devPopTem > dt > span >em").text(device.data("temtxt"));

                    $("#devPopSound").removeClass();
                    $("#devPopSound").addClass("lightGraph__box");
                    $("#devPopSound").addClass(device.data("sound"));
                    $("#devPopSound > dt > span >em").text(device.data("soundtxt"));

                    $("#devMachineInfoId").text(device.data("id"));
                    $("#devMachineInfoCenser").text(device.data("censer"));
                    $("#devMachineInfoStatus").text(device.data("censer") + " 주의");
                    $("#devMachineInfoName").text(device.data("machinename"));
                    $("#devMachineInfoLocation").text(device.data("location"));

                    machineObj.ajaxMachineInfo();

                }, 1100);
            },
            ajaxForm: $("#devAjaxGrape"),
            ajaxGsdForm: $("#devAjaxGsd"),
            ajaxMachineInfo: function () {
                var self = machineObj;
                var selfChart = highChartDraw;
                var sample = sampleData;

                /* x축 라벨 샘플 */
                var dateLabel = [];
                var dt = new Date();
                sample.soundTop.forEach(function (k, v) {
                    dt.setHours(dt.getHours() - 1);
                    dateLabel.unshift(self.getFormatDate(dt).toString());
                });
                var $bottomGraph = $(".devinfo__box--graph").find(".lineGraph__graph");
                self.sortChange($($bottomGraph), $(".js__sort__day-select").val());
                self.sortChange($("#runHigh"), $(".js__sort__button on").data("value"));
                self.sortChange($("#soundTrendHigh"), $("#devSoundLong").val());
                self.scrollEvent();

                common.form.init(
                        self.ajaxForm,
                        common.util.getControllerUrl('ajaxGetGrape', 'gigasound'),
                        function ($form) {
                            return common.validation.check($form);
                        },
                        function (response) {
                            if (response.result == "success") {
                                self.engin = response.data.engin; //가동율
                                self.burn = response.data.burn; //온도
                                self.vibration = response.data.vibration; //진동
                                self.soundBound = response.data.soundBound; //사운드 1
                                self.soundCollBound = response.data.soundCollBound; //사운드 2 펜 
                                self.soundChu = response.data.soundChu; //사운드 추이



                                /*실제데이터 그래프*/
                                selfChart.runChart(self.engin.enginA, self.engin.enginB, self.engin.date); //가동율
                                selfChart.soundTrendChart(self.soundChu.short, self.soundChu.long, self.soundChu.date); //사운드추이분석
                                selfChart.tempChart(self.burn.grape, null, self.burn.date); //온도
                                //selfChart.soundChart1(self.soundBound.max, self.soundBound.real, self.soundBound.min, self.soundBound.date); //사운드 바운더리
                                selfChart.soundChart2(self.soundBound.max, self.soundBound.real, self.soundBound.min, self.soundBound.date); //사운드 냉각팬

                                /*테스트용*/
                                // selfChart.runChart(sample.runAvg, sample.runData, dateLabel); //가동율
                                selfChart.vibChart(sample.vibTop, sample.vibBottom, sample.vibMiddle, dateLabel); //진동
                                selfChart.soundChart1(sample.soundTop, sample.soundBottom, sample.soundMiddle, dateLabel); //사운드 바운더리
                                //selfChart.soundChart2(sample.soundTop, sample.soundBottom, sample.soundMiddle, dateLabel); //사운드 냉각팬
                                //selfChart.soundTrendChart(self.enginA.engin_a_day, self.enginB.engin_b_day, selfChart.axisRangeDay, dateLabel); //사운드추이분석

                            }
                        });
                self.ajaxForm.submit();
            },
            sortChange: function ($graph, _selVal) {
                _selVal == null ? _selVal = 24 : _selVal;

                if (_selVal == 24) { //오늘
                    $graph
                            .removeClass("week")
                            .removeClass("month")
                            .addClass("day")
                } else if (_selVal == 168) { //일주일
                    $graph
                            .removeClass("day")
                            .removeClass("month")
                            .addClass("week")
                } else { //한달
                    $graph
                            .removeClass("day")
                            .removeClass("week")
                            .addClass("month")
                }
            },
            initEvent: function () {
                var self = this;
                $("#devFloorTitle").text($("select[name=deviceFloor]").text());
                $(document)
                        .on("change", "select[name=day_type]", function () {
                            //필터값 재정렬
                            var $graph = $(this).closest(".devinfo__box").find(".lineGraph__graph");
                            self.sortChange($($($graph)), $(this).val());
                            self.scrollEvent();

                            $("input[name=short]").val($("#devSoundShort option:selected").val());
                            $("input[name=long]").val($("#devSoundLong option:selected").val());
                            $("input[name=window_size]").val($(this).val());
                            self.ajaxChangeBottom();
                        })
                        .on("change", "#devSoundLong, #devSoundShort", function () {
                            //필터값 재정렬 단기,장기 평균은 장기 기준으로 변경
                            var $graph = $(this).closest(".lineGraph").find("#soundTrendHigh");
                            //self.sortChange($graph, $(this).val());
                            self.scrollEvent();

                            //사운드추이 분석 갱신
                            $("input[name=short]").val($("#devSoundShort option:selected").val());
                            $("input[name=long]").val($("#devSoundLong option:selected").val());
                            self.ajaxChangeChu();
                        })
                        .on("click", ".js__sort__button button", function () {
                            //필터값 재정렬
                            var $graph = $(this).closest(".lineGraph").find(".lineGraph__graph");
                            self.sortChange($($graph), $(this).data("value"));
                            //필터값 재정렬 시마다 스크롤 오른쪽으로
                            self.scrollEvent();

                            //가동율 그래프 갱신
                            $("input[name=window_size]").val($(this).data("value"));
                            self.ajaxChangeEngin();
                        })
                        .on("click", "#devPopVib", function () {
                            //재학습 요청  디바이스 아이디만 받아간다
                            $("input[name=gsd_device_id]").val($("input[name=device_id]").val());
                            self.ajaxCallGsd002();
                        })
                        .on("click", "#devPopTem", function () {
                            //재학습 요청  디바이스 아이디만 받아간다
                            $("input[name=gsd_device_id]").val($("input[name=device_id]").val());
                            self.ajaxCallGsd002();
                        })
                        .on("click", "#devPopSound", function () {
                            //재학습 요청  디바이스 아이디만 받아간다
                            $("input[name=gsd_device_id]").val($("input[name=device_id]").val());
                            self.ajaxCallGsd002();
                        });
            },
            scrollEvent: function () {
                $(".lineGraph__wrap").each(function () {
                    var $this = $(this);
                    $this.scrollLeft($this[0].scrollWidth);
                })
            },
            getFormatDate: function (date) {
                var month = (1 + date.getMonth());		//M
                month = month >= 10 ? month : '0' + month;	//month 두자리로 저장
                var day = date.getDate();			//d
                day = day >= 10 ? day : '0' + day;		//day 두자리로 저장
                var hour = date.getHours();
                return  month + '.' + day + ' ' + hour + '시';
            },
            openPopLayer: function () {
                var self = machineObj;
                $(document).on("click", ".device", function () {
                    // common.util.modal.open('ajax', '머신별 현황 보기', '/popup/deviceInfo/', '', self.machineStatus($(this)));
                    $("input[name=device_id]").val($(this).data("id"));
                });
            },
            ajaxCallGsd002: function () {
                /* 재학습 요청 002 */
                var self = machineObj;
                common.form.init(
                        self.ajaxGsdForm,
                        common.util.getControllerUrl('ajaxCallGsd002', 'gigasound'),
                        function ($form) {
                            return common.validation.check($form);
                        },
                        function (response) {
                            if (response.result == "success") {
                                if (response.data.response_code == 200) {
                                    alert("정상적으로 재학습 요청 되었습니다.");
                                } else {
                                    alert("재학습 요청 실패.");
                                }
                            }
                        });
                self.ajaxGsdForm.submit();

            },
            ajaxChangeBottom: function () {
                var self = machineObj;
                var selfChart = highChartDraw;
                var sample = sampleData;
                var dateLabel = [];
                var dt = new Date();
                sample.soundTop.forEach(function (k, v) {
                    dt.setHours(dt.getHours() - 1);
                    dateLabel.push(self.getFormatDate(dt).toString());
                });
                common.form.init(
                        self.ajaxForm,
                        common.util.getControllerUrl('ajaxGetGrapeBottom', 'gigasound'),
                        function ($form) {
                            return common.validation.check($form);
                        },
                        function (response) {
                            if (response.result == "success") {
                                self.burn = response.data.burn;
                                self.vibration = response.data.vibration;
                                self.soundBound = response.data.soundBound;
                                self.soundCollBound = response.data.soundCollBound;

                                selfChart.tempChart(self.burn.grape, null, self.burn.date); //온도
                                selfChart.soundChart2(self.soundBound.max, self.soundBound.real, self.soundBound.min, self.soundBound.date); //사운드 냉각팬

                                /*테스트용*/
                                selfChart.vibChart(sample.vibTop, sample.vibBottom, sample.vibMiddle, dateLabel); //진동
                                selfChart.soundChart1(sample.soundTop, sample.soundBottom, sample.soundMiddle, dateLabel); //사운드 바운더리
                            }
                        });
                self.ajaxForm.submit();

            },
            ajaxChangeEngin: function () {
                var self = machineObj;
                var selfChart = highChartDraw;

                common.form.init(
                        self.ajaxForm,
                        common.util.getControllerUrl('ajaxGetGrapeEngin', 'gigasound'),
                        function ($form) {
                            return common.validation.check($form);
                        },
                        function (response) {
                            if (response.result == "success") {
                                self.engin = response.data.engin;
                                console.log(self.engin);
                                selfChart.runChart(self.engin.enginA, self.engin.enginB, self.engin.date); //가동율
                            }
                        });
                self.ajaxForm.submit();

            },
            ajaxChangeChu: function () {
                var self = machineObj;
                var selfChart = highChartDraw;

                common.form.init(
                        self.ajaxForm,
                        common.util.getControllerUrl('ajaxGetGrapeChu', 'gigasound'),
                        function ($form) {
                            return common.validation.check($form);
                        },
                        function (response) {
                            if (response.result == "success") {
                                self.soundChu = response.data.soundChu; //사운드 추이
                                selfChart.soundTrendChart(self.soundChu.short, self.soundChu.long, self.soundChu.date); //사운드추이분석
                            }
                        });
                self.ajaxForm.submit();
            },
            run: function () {
                var self = machineObj;
                self.initEvent();
                self.openPopLayer();
            }
        };

        $(function () {
            machineObj.run();
        });
    }

    const machine_init = () => {
        date_picker();
        status_green();
        sort_click();
        chartInit();
    };

    machine_init();
}


export default ktGigaSoundChart;