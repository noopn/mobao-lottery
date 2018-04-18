$(function() {
  var data = {
    t2deg: [],
    t4deg: [],
    t7deg: [],
    t12deg: [],
    t25deg: [],
    t50deg: [],
    pos2Arr: [
      1,
      3,
      5,
      7,
      9,
      11,
      13,
      15,
      17,
      19,
      21,
      24,
      26,
      28,
      30,
      32,
      34,
      36,
      38,
      40,
      42,
      44,
      47,
      49,
      51,
      53
    ],
    pos4Arr: [2, 6, 12, 16, 20, 23, 29, 33, 37, 43, 46, 48, 50],
    pos7Arr: [8, 14, 22, 27, 32, 35, 41, 54],
    pos12Arr: [10, 25, 39, 52],
    pos25Arr: [4, 31],
    pos50Arr: [18, 45],
    gameTime: 25,
    lotteryDeg: 0,
    tottleDeg: 0,
    result: [2, 124, 12, 5, 3, 5, 1, 51, 2, 51, 35],
    lastResult: 0,
    betNum: 10,
    gold: 500,
    chipInNum: 0
  };

  funcData = {
    // 绑定事件和初始化数据
    initDomAndData: function() {
      // 金豆
      $("#j_gold").html(data.gold);
      var singleDeg = 360 / 54;

      function getNumDeg(arr, degArr) {
        $.each(arr, function(index, val) {
          degArr.push(((val - 1) * singleDeg).toFixed(2));
        });
      }
      // 初始化每种数字对应的角度集合
      getNumDeg(data.pos2Arr, data.t2deg);
      getNumDeg(data.pos4Arr, data.t4deg);
      getNumDeg(data.pos7Arr, data.t7deg);
      getNumDeg(data.pos12Arr, data.t12deg);
      getNumDeg(data.pos25Arr, data.t25deg);
      getNumDeg(data.pos50Arr, data.t50deg);
      // 绑定投注事件
      $(".chipIn-item").click(function() {
        $(this)
          .addClass("active")
          .siblings()
          .removeClass("active");
        data.betNum = $(this).data("betnum");
      });
      // 绑定倍数图标
      $(".cathectic-item").click(function() {
        var betNum = data.betNum;
        if (!betNum) betNum = 10;
        if (betNum >= 1000) betNum = 1000;
        data.chipInNum = $(this).data("mp");
        $(".chipIn-tit").remove();
        $(this).html(
          $(this).html() +
            "<div class='chipIn-tit'><i class='iconfont icon-jindouyindou01'></i><span class='chipIn-tit-num'>" +
            data.betNum +
            "</span></div>"
        );
      });
    },
    // 最新结果图标
    newResultIcon: function(num) {
      console.log(1);
      $(".new-result").html(
        $(".new-result").html() +
          "<span class='new-result-span shake freez shake-horizontal'><i class='iconfont icon-new'></i></span>"
      );
    },
    // 渲染结果
    renderResult: function() {
      var result = data.result;
      if (!$("#lottery-result-box").html() && !data.lastResult) {
        var html = "";
        $.each(result, function(index, item) {
          html += "<div class='result-item'>" + item + "</div>";
        });
        $("#lottery-result-box").html(html);
        $(".result-item")
          .eq(0)
          .addClass("new-result");
        this.newResultIcon();
      }
    },
    // 更新结果
    updateResult: function() {
      console.log(2333);
      data.result.unshift(data.lastResult);
      $(".new-result-span").remove();
      $("#lottery-result-box").prepend(
        "<div class='result-item'>" + data.lastResult + "</div>"
      );
      $(".result-item")
        .removeClass("new-result")
        .eq(0)
        .addClass("new-result");
      this.newResultIcon();
    },
    // 是否中奖 更新数据
    checkResult: function() {
      console.log(data.chipInNum, data.lastResult);
      if (data.chipInNum == data.lastResult) {
        data.gold += data.betNum * data.lastResult;
        $("#j_gold").html(data.gold);
        console.log("中奖了");
      }
    },
    // 每轮游戏倒计时
    countDown: function() {
      var _this = this;
      data.gameTime = 5;

      function cd() {
        if (data.gameTime === 0) {
          $("#j-timer").html("开奖");
          _this.openLottery();
        } else if (data.gameTime < 5 && data.gameTime > 0) {
          if (data.gameTime & 1) {
            $("#j-timer").html("开奖");
          } else {
            $("#j-timer").html("");
          }
          data.gameTime -= 0.5;
          setTimeout(cd, 500);
        } else {
          $("#j-timer").html(data.gameTime);
          data.gameTime--;
          setTimeout(cd, 1000);
        }
      }
      setTimeout(cd, 1000);
    },
    //开奖
    openLottery: function() {
      // 随机定义一个奖项
      var _this = this;
      var prents = [2, 4, 7, 12, 25, 50];
      pNum = prents[Math.floor(Math.random() * prents.length)];
      data.lastResult = pNum;
      var tdegArr = data["t" + pNum + "deg"];
      var tdeg = 360 - tdegArr[Math.floor(Math.random() * tdegArr.length)];
      var sdeg = 360 - data.lotteryDeg + tdeg;
      data.tottleDeg = data.tottleDeg + sdeg + 1080;
      data.lotteryDeg = tdeg;
      $("#table-box-lottery").css({
        transform: "rotate(" + data.tottleDeg + "deg)",
        webkitTransform: "rotate(" + data.tottleDeg + "deg)",
        oTransform: "rotate(" + data.tottleDeg + "deg)"
      });
      if ("ontransitionend" in window) {
        $("#table-box-lottery").on(
          "transitionend webkitTransitionEnd",
          function() {
            $("#table-box-lottery").off("transitionend webkitTransitionEnd");
            _this.checkResult();
            _this.updateResult();
            _this.countDown();
          }
        );
      } else {
        setTimeout(function() {
          _this.updateResult();
          _this.countDown();
        }, 11000);
      }
    },
    init: function() {
      this.initDomAndData();
      this.renderResult();
      this.countDown();
    }
  };
  funcData.init();
});
