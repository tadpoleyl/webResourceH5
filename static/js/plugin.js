define("", ["zepto"], function ($) {
    (function () {
        $.fn.extend({
            dragAndResize: function (operator, option, $compile, $scope, $location) {
                var defaults = {
                    radio: false,//是否等比缩放、
                    targetClass: "lt-widget-image",
                    positionFn: {
                        start: function () { },
                        move: function () { },
                        end: function () { }
                    },
                    widthFn: {
                        start: function () { },
                        move: function () { },
                        end: function () { }
                    },
                    heightFn: {
                        start: function () { },
                        move: function () { },
                        end: function () { }
                    },
                    sizeFn: {
                        start: function () { },
                        move: function () { },
                        end: function () { }
                    },
                    rotateFn: {
                        start: function () { },
                        move: function () { },
                        end: function () { }
                    },
                    pubMove: function () {
                    },
                    pubEnd: function () {
                    },
                    click: function () { }

                }

                var MOVE_EVENT = "touchmove", START_EVENT = "touchstart", END_EVENT = "touchend";

                var setting = $.extend(defaults, option);

                return this.each(function (i) {
                    var s = null;
                    if ($(this).hasClass("lt-widget")) {
                        s = $(this);
                    }
                    else {
                        s = $(this).parents(".lt-widget");
                    }
                    var type = s.attr("widget-type");
                    var className = s.attr("widget-type");

                    var target = s.find(".lt-widget-" + type).eq(0);
                    var scale = 1;
                    var isTarget = target.size() > 0;
                    if (isTarget && type === "image") {
                        var img = new Image();
                        img.onload = function () {
                            scale = this.height / this.width;
                        }
                        img.src = target.attr("src");
                    }
                    else if (isTarget && type === "ellipse") {//椭圆
                        scale = s.height() / s.width();
                    }
                    else if (isTarget && type === "radius") {//圆
                        scale = s.height() / s.width();
                    }
                    else if (isTarget && type === "slider") {
                        scale = s.height() / s.width();
                    }
                    if (/^enable|disable|destroy$/.test(operator)) {
                        operator = "destroy";
                        s.off();
                        isTarget && target.off(MOVE_EVENT + " " + END_EVENT);
                        s.find(".line div").off(MOVE_EVENT + " " + END_EVENT);
                        s.find(".line").hide();
                        return;
                    }
                    var oBody = $("body");
                    var lineWidth = 1;
                    var pointSize = 8;
                    var pointColor = "#64f23f";
                    var borderStyle = "none";//1px solid #4faa35
                    var lineColor = "#68f736";
                    s.find("aside").size() > 0 && s.find("aside").remove();
                    s.append("<aside style='width:100%;height:100%;position:absolute;left:0;top:0;cursor:move;padding:1px;'></aside>");
                    s.css({ position: "absolute", cursor: "move" }).addClass("lt-drag-resize");
                    var leftLine = $("<div class='line' style='opacity:1'></div>");
                    leftLine.css({ position: "absolute", left: 0, top: 0, width: lineWidth, height: "100%", background: lineColor, zIndex: 5 });
                    var leftPoint1 = $("<div></div>");
                    var leftPoint2 = $("<div></div>");
                    var leftPoint3 = $("<div></div>");
                    leftPoint1.css({ cursor: "se-resize", position: "absolute", left: -5, top: -5, width: pointSize, height: pointSize, borderRadius: "50%", zIndex: 1, background: pointColor, border: borderStyle });
                    leftLine.append(leftPoint1);

                    leftPoint2.css({ position: "absolute", cursor: "e-resize", left: -5, top: "50%", marginTop: -pointSize / 2, width: pointSize, height: pointSize, borderRadius: "50%", zIndex: 1, background: pointColor, border: borderStyle });
                    leftLine.append(leftPoint2);

                    leftPoint3.css({ cursor: "ne-resize", position: "absolute", left: -5, bottom: -4, width: pointSize, height: pointSize, borderRadius: "50%", zIndex: 1, background: pointColor, border: borderStyle });
                    leftLine.append(leftPoint3);

                    var topLine = $("<div class='line' style='opacity:1'></div>");
                    topLine.css({ position: "absolute", left: 0, top: 0, width: "100%", height: lineWidth, background: lineColor, zIndex: 1 });

                    var topPoint1 = $("<div></div>");

                    var linePoint = $("<div></div>");
                    topPoint1.css({ position: "absolute", left: "50%", marginLeft: -4, top: -5, width: pointSize, height: pointSize, background: pointColor, borderRadius: "50%", zIndex: 1, cursor: "n-resize", border: borderStyle });
                    topLine.append(topPoint1);


                    var bottomLine = $("<div class='line' style='opacity:1'></div>");
                    bottomLine.css({ position: "absolute", left: 0, bottom: 0, width: "100%", height: lineWidth, background: lineColor, zIndex: 1 });

                    var bottomPoint1 = $("<div></div>");
                    bottomPoint1.css({ position: "absolute", left: "50%", marginLeft: -4, bottom: -5, width: pointSize, height: pointSize, background: pointColor, borderRadius: "50%", zIndex: 1, cursor: "n-resize", border: borderStyle });
                    bottomLine.append(bottomPoint1);

                    var rightLine = $("<div  class='line' style='opacity:1'></div>");
                    rightLine.css({ position: "absolute", right: 0, top: 0, width: lineWidth, height: "100%", background: lineColor, zIndex: 5 });
                    var rightPoint1 = $("<div></div>");
                    var rightPoint2 = $("<div></div>");
                    var rightPoint3 = $("<div></div>");
                    rightPoint1.css({ position: "absolute", left: -5, top: -5, width: pointSize, height: pointSize, borderRadius: "50%", zIndex: 1, background: pointColor, cursor: "url(static/images/mouserotate.ico),default", border: borderStyle });
                    rightLine.append(rightPoint1);

                    rightPoint2.css({ position: "absolute", left: -5, marginTop: -pointSize / 2, top: "50%", width: pointSize, height: pointSize, borderRadius: "50%", zIndex: 1, background: pointColor, cursor: "e-resize", border: borderStyle });
                    rightLine.append(rightPoint2);

                    rightPoint3.css({ position: "absolute", left: -5, bottom: -4, width: pointSize, height: pointSize, borderRadius: "50%", zIndex: 1, background: pointColor, cursor: "se-resize", border: borderStyle });
                    rightLine.append(rightPoint3);


                    s.find("aside").append(leftLine);
                    s.find("aside").append(topLine);
                    s.find("aside").append(bottomLine);
                    s.find("aside").append(rightLine);


                    $compile(s.find("aside").contents())($scope);

                    s.off(MOVE_EVENT + " " + END_EVENT);
                    isTarget && target.off(MOVE_EVENT + " " + END_EVENT);
                    s.find(".line div").off(MOVE_EVENT + " " + END_EVENT);

                    s.on(START_EVENT, function (e) { ///改变位置
                        if (e.target.nodeName.toLowerCase() === "textarea") {
                            return;
                        }
                        setting.positionFn.start(e);
                        e.stopPropagation();
                        e.preventDefault();

                        var _this = $(this);
                        // e = e.touchChanged || e;
                        e = e.changedTouches[0] || e;
                        _this.disX = e.clientX - _this.offset().left;
                        _this.disY = e.clientY - _this.offset().top;
                        var pW = s.parent().width();
                        var pH = s.parent().height();
                        $(".lt-widget .line").hide();
                        s.find(".line").show();
                        var sW = s.width();
                        var sH = s.height();
                        $scope.$parent && ($scope.$parent.focusWidgetHeight = s.height());
                        var index = 0;
                        oBody.on(MOVE_EVENT, function (event) {

                            e.stopPropagation();
                            e.preventDefault();
                            index++;
                            index === 1 && setting.pubMove(s);
                            event.stopPropagation();
                            event.preventDefault();
                            setting.positionFn.move(e);
                            event = event.changedTouches[0] || event;
                            var left = event.clientX - _this.disX - s.parent().offset().left;
                            var top = event.clientY - _this.disY - s.parent().offset().top;

                            /*
                             * 
                            left <= -sW/2 && (left = -sW/2);
                            top < -sH/2 && (top = -sH/2);
    
                            left > pW - sW / 2 && (left = pW - sW / 2);
                            top >= pH - sH / 2 && (top = pH - sH / 2);
                             */

                            left <= 0 && (left = 0);
                            top < 0 && (top = 0);

                            left > pW - sW && (left = pW - sW);
                            top >= pH - sH && (top = pH - sH);
                            s.css({ left: left / 32 + "rem", top: top / 32 + "rem" });
                        }).on(END_EVENT, function (e) {
                            isTarget && target.css({ opcaity: 1 });
                            oBody.off(MOVE_EVENT + " " + END_EVENT);
                            index > 0 && setting.pubEnd(s);
                            setting.positionFn.end(e);
                            //$('.lt-widget-text-container p').cancelable = false;
                        });

                        return false;
                    });


                    var startAng = 0;
                    rightPoint1.on(START_EVENT, function (e) { //旋转
                        setting.rotateFn.start(e);
                        e.stopPropagation();
                        e.preventDefault();
                        var _this = this;
                        e = e.changedTouches[0] || e;
                        _this.Cx = e.clientX;  // 记录X轴坐标
                        _this.MT = isTarget && parseInt(target.offset().top) || 0;
                        _this.trans = s[0].style.WebkitTransform || s[0].style.transform;
                        var index = 0;
                        oBody.on(MOVE_EVENT, function (event) {

                            e.stopPropagation();
                            e.preventDefault();
                            event.stopPropagation();
                            event.preventDefault();
                            index++;
                            index === 1 && setting.pubMove(s);
                            event = event.changedTouches[0] || event;
                            _this.Tx = event.clientX;    // 记录X轴坐标
                            _this.Ty = event.clientY;    // 记录当前Y轴坐标
                            _this.y = _this.MT + target.height() / 2 - _this.Ty;
                            _this.x = _this.Tx - _this.Cx;
                            _this.angle = Math.atan(_this.x / _this.y) * 180 / Math.PI;
                            _this.val = _this.angle + startAng;
                            _this.val > 360 && (_this.val = _this.val - 360);
                            _this.val < 0 && (_this.val = _this.val + 360);
                            isTarget && target.css("transform", "rotate(" + _this.val + "deg)").css("-webkit-transform", "rotate(" + _this.val + "deg)");

                            s.find("aside").css("transform", "rotate(" + _this.val + "deg)").css("-webkit-transform", "rotate(" + _this.val + "deg)");
                            setting.rotateFn.move(e, _this.val);
                        }).on(END_EVENT, function (e) {
                            startAng = _this.val;
                            oBody.off(MOVE_EVENT + " " + END_EVENT);
                            index > 0 && setting.pubEnd(s);
                            setting.rotateFn.end(e);
                        });
                        return !1;
                    });
                });
            }
        });
    })();
})