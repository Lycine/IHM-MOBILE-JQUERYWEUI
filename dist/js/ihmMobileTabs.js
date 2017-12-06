function loadBulletin() {
  var url = "http://" + backendUrl + "/wechat/bulletin";
  var fd = new FormData();
  fd.append("uid", getCookie('uid'));
  $.ajax({
    type: "POST",
    url: url,
    data: fd,
    crossDomain: true,
    async: false,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    beforeSend: function () {
      $.showLoading('加载公告中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (data) {
      if ("0" == data['status']) {
        $('.bulletinTitle').text(data['bulletinTitle']);
        $('.bulletinContent').text(data['bulletinContent']);

      } else {
        $.modal({
          text: data['info'],
          buttons: [
            {text: "知道了", className: "default"},
          ]
        });
      }
    },
    error: function () {
      $.toast("公告加载失败", "cancel", function (toast) {
      });
    }
  });
}

function loadTodayAssignmentInfoList() {
  var url = "http://" + backendUrl + "/wechat/remainingTaskListAllStatus";
  var fd = new FormData();
  fd.append("uid", getCookie('uid'));
  fd.append("offset", "0");
  $.ajax({
    type: "POST",
    url: url,
    data: fd,
    crossDomain: true,
    async: false,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    beforeSend: function () {
      $.showLoading('加载今日作业中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (data) {
      if ("0" == data['status']) {
        $('#todayAssignmentInfoListPanelFatherElement').html('<div class="weui-panel__hd">今日作业</div><div class="weui-panel__bd" id="todayAssignmentInfoListPanel"></div>');
        var item;
        var undoCount = 0;
        $('#todayAssignmentInfoListPanel').empty();
        $.each(data['data'], function (i, result) {
          item = '<a href="javascript:void(0);" onclick="skipToDetail(\'tid\', \'' + result['taskId'] + '\', 3600)" class="weui-media-box weui-media-box_appmsg weui-cell_access js_item" data-id="amsUploader"> <div class="weui-media-box__bd">'
              + result['taskName'];
          if ("未完成" == result['taskStatus']) {
            item += '<h4 class = "weui-media-box__title" > </h4> <p class="weui-media-box__desc">状态：<span style="color:red">'
                + result['taskStatus']
            undoCount += 1;
          } else if ("待完成" == result['taskStatus']) {
            item += '<h4 class = "weui-media-box__title" > </h4> <p class="weui-media-box__desc">状态：<span>'
                + result['taskStatus']
            undoCount += 1;
          } else {
            item += '<h4 class = "weui-media-box__title" > </h4> <p class="weui-media-box__desc">状态：<span>'
                + result['taskStatus']
          }
          item += '</span></p> <ul class="weui-media-box__info"> <li class="weui-media-box__info__meta">截止日期：<b>'
              + result['deadLineString']
              + '</b> </li> </ul> </div> </a>'
          $('#todayAssignmentInfoListPanel').append(item);
        });
        $('#todayAssignmentInfoListPanelFatherElement').after('<div style="width:100%;height:53px;background:#FAFAFA;border-style: solid;border-color: #FAFAFA"></div>')
        if (0 != parseInt(undoCount)) {
          $('#todayAssignmentIcon').before('<span class="weui-badge" style="position: absolute;top: -.4em;right: 1em;" id="weekAssignmentTabButtonBadge">' + undoCount + '</span>');
        }
      } else {
        $.modal({
          text: '今日作业: ' + data['info'],
          buttons: [
            {text: "知道了", className: "default"},
          ]
        });
      }
    },
    error: function () {
      $.toast("今日作业加载失败", "cancel", function (toast) {
      });
    }
  });
}

function loadWeekAssignmentInfoList() {
  var url = "http://" + backendUrl + "/wechat/remainingTaskList";
  var fd = new FormData();
  fd.append("uid", getCookie('uid'));
  fd.append("offset", "7");
  $.ajax({
    type: "POST",
    url: url,
    data: fd,
    crossDomain: true,
    async: false,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    beforeSend: function () {
      $.showLoading('加载本周剩余作业中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (data) {
      if ("0" == data['status']) {
        $('#weekAssignmentInfoListPanelFatherElement').html('<div class="weui-panel__hd">本周剩余作业</div><div class="weui-panel__bd" id="weekAssignmentInfoListPanel"></div>');
        var item;
        $('#weekAssignmentInfoListPanel').empty();
        $.each(data['data'], function (i, result) {
          item = '<a href="javascript:void(0);" onclick="skipToDetail(\'tid\', \'' + result['taskId'] + '\', 3600)" class="weui-media-box weui-media-box_appmsg weui-cell_access js_item" data-id="amsUploader"> <div class="weui-media-box__bd">'
              + result['taskName'];
          if ("未完成" == result['taskStatus']) {
            item += '<h4 class = "weui-media-box__title" > </h4> <p class="weui-media-box__desc">状态：<span style="color:red">'
                + result['taskStatus']
          } else {
            item += '<h4 class = "weui-media-box__title" > </h4> <p class="weui-media-box__desc">状态：<span>'
                + result['taskStatus']
          }
          item += '</span></p> <ul class="weui-media-box__info"> <li class="weui-media-box__info__meta">截止日期：<b>'
              + result['deadLineString']
              + '</b> </li> </ul> </div> </a>'
          $('#weekAssignmentInfoListPanel').append(item);
        });
        var undoCount = data['data'].length;
        $('#weekAssignmentInfoListPanelFatherElement').after('<div style="width:100%;height:53px;background:#FAFAFA;border-style: solid;border-color: #FAFAFA;"></div>')
        if (0 != parseInt(undoCount)) {
          $('#weekAssignmentIcon').before('<span class="weui-badge" style="position: absolute;top: -.4em;right: 1em;" id="weekAssignmentTabButtonBadge">' + undoCount + '</span>');
        }
      } else {
        $.modal({
          text: '本周剩余作业: ' + data['info'],
          buttons: [
            {text: "知道了", className: "default"},
          ]
        });
      }
    },
    error: function () {
      $.toast("本周剩余作业加载失败", "cancel", function (toast) {
      });
    }
  });
}

function loadChart() {
  // 基于准备好的dom，初始化echarts实例
  var myChart1 = echarts.init(document.getElementById('task-analysis-pie-chart'));
// 指定图表的配置项和数据
  var option = {
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      x: 'left',
      data: ['待完成', '已提交，按时交', '未完成', '糊弄，按时交', '合格，按时交', '已提交，迟交', '糊弄，迟交', '合格，迟交']
    },
    color: ['#3399ff', '#999999', '#ff0000', '#996600', '#66cc00', '#111111', '#663300', '#663300', '#336633'],
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius: ['50%', '65%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '30',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data:[
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

// 使用刚指定的配置项和数据显示图表。
  myChart1.setOption(option);

  $.ajax({
    type: "post",
    async: false,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
    url: "http://" + backendUrl + "/m/pie/" + getCookie('uid') + "/",    //请求发送到TestServlet处
    data: {},
    crossDomain: true,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    dataType: "json",        //返回数据形式为json
    beforeSend: function () {
      $.showLoading('加载饼图数据中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (data) {
      myChart1.setOption({
        series : [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '65%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:data,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    },
    error: function (errorMsg) {
      //请求失败时执行该函数
      alert("图表请求数据失败!" + errorMsg);
      myChart.hideLoading();
    }
  });


// 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('task-analysis-line-chart'));

// 指定图表的配置项和数据
  var option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['评分']
    },

    calculable: true,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: []
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '评分',
        type: 'line',
//                data: [7, 9.5, 6, 8, 9],
        data: [],
        markPoint: {
          data: [
            {type: 'max', name: '最高分'},
            {type: 'min', name: '最低分'}
          ]
        },
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        }
      }
    ]
  };


  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);

  myChart.showLoading();    //数据加载完之前先显示一段简单的loading动画

  var time = [];    //类别数组（实际用来盛放X轴坐标值）
  var value = [];
  $.ajax({
    type: "post",
    async: false,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
    url: "http://" + backendUrl + "/m/socreTime/" + getCookie('uid') + "/",    //请求发送到TestServlet处
    data: {},
    crossDomain: true,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    dataType: "json",        //返回数据形式为json
    beforeSend: function () {
      $.showLoading('加载折线图数据B中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (result) {
      //请求成功时执行该函数内容，result即为服务器返回的json对象
      if (result) {
        for (var i = 0; i < result.length; i++) {
          time.push(result[i]);    //挨个取出类别并填入类别数组
        }
        myChart.hideLoading();    //隐藏加载动画
        myChart.setOption({        //加载数据图表
          xAxis: {
            data: time
          }
        });

      }

    },
    error: function (errorMsg) {
      //请求失败时执行该函数
      alert("图表请求数据失败!" + errorMsg);
      myChart.hideLoading();
    }
  });
  $.ajax({
    type: "post",
    async: false,            //异步请求（同步请求将会锁住浏览器，用户其他操作必须等待请求完成才可以执行）
    url: "http://" + backendUrl + "/m/socreValue/" + getCookie('uid') + "/",    //请求发送到TestServlet处
    data: {},
    crossDomain: true,
    processData: false,  // 不处理数据
    contentType: false,  // 不设置内容类型
    dataType: "json",        //返回数据形式为json
    beforeSend: function () {
      $.showLoading('加载折线图数据A中');
    },
    complete: function () {
      setTimeout(function () {
        $.hideLoading();
      }, 500)
    },
    success: function (result) {
      //请求成功时执行该函数内容，result即为服务器返回的json对象
      if (result) {
        for (var i = 0; i < result.length; i++) {
          value.push(result[i]);    //挨个取出类别并填入类别数组
        }
        myChart.hideLoading();    //隐藏加载动画
        myChart.setOption({        //加载数据图表
          series: {
            data: value
          }
        });

      }

    },
    error: function (errorMsg) {
      //请求失败时执行该函数
      alert("图表请求数据失败!" + errorMsg);
      myChart.hideLoading();
    }
  });
}

function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes();
  return currentdate;
}

function skipToDetail(c_name, value, expiredays) {
  setCookie(c_name, value, expiredays);
  window.location.href = 'detail.html';
}

$(function () {
  if (checkSignInStatus()) {
    loadBulletin();
    loadTodayAssignmentInfoList();
    loadWeekAssignmentInfoList()
    $('#todayAssignmentTabButton').on("click", function () {
      loadTodayAssignmentInfoList();
    });
    $('#weekAssignmentTabButton').on("click", function () {
      loadWeekAssignmentInfoList();
    });
    $('#analysisTabButton').on("click", function () {
      loadChart();
      $('.currentTime').html('截止时间：' + getNowFormatDate());
    });
  }
});