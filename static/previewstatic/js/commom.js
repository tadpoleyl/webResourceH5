define(function (require, exports, module) {
    var iNow = 0;
    var util = {
        setBg: setBg,
        setSize: setSize,
        iNow: iNow,
        setTrans3d: setTrans3d,
        getDuration: getDuration,
        getDelay: getDelay,
        pageLoad: pageLoad,
        appStart: appStart,
        navTo: navTo
    };
    var transitionEnd = "onwebkittransitionend" in window ? "webkitTransitionEnd" : "transitionend";
    var animationEnd = "webkitAnimationEnd", animationStart = "webkitAnimationStart";
    var zIndex = 100;
    function setBg(classNames, srcs, types) {//设置背景
        if (classNames instanceof Array) {
            var len = classNames.length;
            var styles = "";
            for (var i = 0; i < len; i++) {
                styles += "." + classNames[i] + "{background-image:url(" + srcs[i] + ");background-repeat:no-repeat;background-size:" + types[i] + "}";
            }
            $("#style").append(styles);
        }
    }

    function setSize(obj, iW, iH) {//设置大小
        if (obj instanceof Array) {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                obj[i].height(iH);
            }
        }
        else {
            obj.height(iH);
        }
    }

    Array.prototype.unique = function () { //数组去重
        var res = [];
        var json = {};
        for (var i = 0; i < this.length; i++) {
            if (!json[this[i]]) {
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }

        return res;
    }

    function checkType(page) {
        return page.data("type") === "singlepage";
    }


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }



    function pageLoad() {//页面渲染完执行的回调函数。
        var aPage = $(".page");
        var len = aPage.size();

        var isPreview = getQueryString("isPreview");

        isPreview && ($("#back-edit").show());
        // $("#back-edit").show()

         
        function next(_this) {
            iNow++;
            if (iNow > len - 1) {
                iNow = len - 1;
                return;
            }

            aPage.css({ zIndex: zIndex - 1, opacity: 0 });
            setTrans3d(aPage.eq(iNow)).css({ zIndex: zIndex, opacity: json[0]["pages"][iNow].styles.opacity / 100 });
            switch (_this.data("pagechangetype")) {
                case "translate"://平移推进、
                    setTrans3d(aPage.eq(iNow - 1), [0, "-100%", 0]).css({ opacity: 0 });
                    break;
            }
            util.iNow = iNow;
        }

  

        function prev(_this) {
            iNow--;
            if (iNow < 0) {
                iNow = 0;
                return;
            }

            aPage.css({ zIndex: zIndex - aPage.size(), opacity: 0 });
            setTrans3d(aPage.eq(iNow)).css({ zIndex: zIndex, opacity: json[0]["pages"][iNow].styles.opacity / 100 });
            switch (_this.data("pagechangetype")) {
                case "goDown":
                    setTrans3d(aPage.eq(iNow + 1), [0, "-100%", 0]);
                    break;
                case "goUp":
                    setTrans3d(aPage.eq(iNow + 1), [0, "100%", 0]);
                    break;
                case "goLeft":
                    setTrans3d(aPage.eq(iNow + 1), ["100%", 0, 0]);
                    break;
                case "goRight":
                    setTrans3d(aPage.eq(iNow + 1), ["-100%", 0, 0]);
                    break;
                case "translate"://平移推进、
                    setTrans3d(aPage.eq(iNow + 1), [0, "100%", 0]).css({ opacity: 0 });
                    break;
            }
            util.iNow = iNow;
        }

        aPage.each(function (i) {
            var _this = $(this);
            if (checkType(_this)) {//如果是单面的话就不用滑动事件了
                return;
            }

            switch (_this.data("showtype")) {
                case "swipe"://滑动
                    _this.swipe("up", function () {
                        next(_this);
                    }).swipe("down", function () {
                        prev(_this);
                    });
                    break;
                case "tap"://点击。
                    _this.tap(function () {
                        iNow++;
                        if (iNow >= len - 1) {
                            iNow = len - 1;
                        }
                        setTrans3d(aPage.eq(iNow)).css({ zIndex: zIndex++, opacity: json[0]["pages"][iNow].styles.opacity / 100 });
                        util.iNow = iNow;
                    });
                    break;
            }
        });


        var operator = $("#operator");
        if (operator.css("display") === "block") {
            var code = require("qrcode");
            var qrcode = new code.QRCode($("#code")[0], {
                width: 200,//设置宽高;
                height: 200
            });
            $("#code").find("img").eq(0).remove();

            qrcode.makeCode(global.APP.qrCode);


            if (global.APP.isPublish) {
                appStart();
            }

            operator.find(".keyword .dir div").each(function () {
                $(this).tap(function (e, _this) {
                    var index = $(_this).index();
                    switch (index) {
                        case 0://上一页
                            prev(aPage.eq(iNow));
                            break;
                        case 1://向左
                            break;
                        case 2://下一页
                            if (!global.APP.isPublish) {
                                setTrans3d($("#unpublish"), [0, "-100%"]);
                                appStart();
                                global.APP.isPublish = 1;
                            }
                            else {
                                next(aPage.eq(iNow));
                            }


                            break;
                        case 3://向右
                            break;
                    }
                });
            });

            $(document).on("keydown", function (e) {
                var e = e || window.event;
                var code = e.keyCode;
                switch (code) {
                    case 37:
                        break;
                    case 38://上
                        prev(aPage.eq(iNow));
                        break;
                    case 39:
                        break;
                    case 40://下
                        if (!global.APP.isPublish) {
                            setTrans3d($("#unpublish"), [0, "-100%"]);
                            appStart();
                            global.APP.isPublish = 1;
                        }
                        else {
                            next(aPage.eq(iNow));
                        }
                        break;
                }
            })


            operator.find(".keyword .dir1 div").each(function () {
                $(this).tap(function (e, _this) {
                    var index = $(_this).index();
                    switch (index) {
                        case 0://点击
                            break;
                        case 1://摇一摇
                            //$(".phone").addClass("shake-base").off("webkitAnimationEnd").on("webkitAnimationEnd", function () {
                            //    $(this).removeClass("shake-base");
                            //});
                            break;
                        case 2://双击
                            break;
                        case 3://擦屏
                            break;
                    }
                });
            });

            $("#back-edit").on("click", function () {
                parent.layer.closeAll(); //执行关闭
            });
        }
    }


    function appStart() {

        var animationObj = require("ltAnimation.js");
        var aPage = $('.page');
        var len = aPage.size();
        aPage.each(function (i) {
            var _this = $(this);
            i === 0 && (setTimeout(function () { setTrans3d(aPage.eq(0)).css({ zIndex: 100, opacity: json[0]["pages"][0].styles.opacity / 100 }) }, 10))
            if (_this.data("pagechangetype") === "translate" && _this.index() < len - 1) {//平移推进
                _this.append("<span class='info'></span>");
                $(".info").css({ background: "url(" + global.APP.pubSource.infoBg + ") no-repeat center center", backgroundSize: "contain" });
            }

            if (_this.data("transitionend")) {
                if (_this.data('type') === "singlepage") {
                    var scrollObj = require("iscroll.js");
                    var k = 0;
                    _this.attr("id", "page_" + i).off(transitionEnd).on(transitionEnd, function () {
                        k++ === 1 && (scrollObj.iScroll("page_" + i, { hScroll: false }));
                    });
                }
            }
        });

        var oStyle = $("#style");
        $.each(json, function (j) {
            aPage.each(function (i, n) {
                var This = $(this);
                This.find(".ltwidget").each(function (x) {
                    var _this = $(this);
                    if (json[j]["pages"][i]["widgets"][x]) {
                        var aAnimation = json[j]["pages"][i]["widgets"][x]["animation"];
                        $.each(aAnimation, function (i, n) {
                            var showType = n.requireObj;
                            var animationName = n.animationName;
                            var animation = animationObj.ltAnimation(n);
                            animation.bind(oStyle);//生成动画类
                        });
                    }
                });
            });
        });

        var len = aPage.size();
        $.each(json, function (j) {
            aPage.each(function (i, n) {
                var This = $(this);
                var widgetAnimations = [];//
                var widgets = json[j]["pages"][i]["widgets"];
                for (var k = 0; k < widgets.length; k++) {
                    for (var h = 0; h < widgets[k]["animation"].length; h++) {
                        if (widgets[k]["animation"][h].requireObj.animationId.trim().length>0) {
                            widgetAnimations.push(widgets[k]["animation"][h]);//得到一个页面所有的组件的所有动画！  
                        }
                    }
                }
                var ltwidget = This.find(".ltwidget");
                This.off(transitionEnd);

                This.on(transitionEnd, function () {
                    //
                   
                    var pageIndex = util.iNow;
                    ltwidget.each(function (x) {//循环每一个组件
                        var _this = $(this);
                        if (json[j]["pages"][i]["widgets"][x]) {
                            var aAnimation = json[j]["pages"][i]["widgets"][x]["animation"];
                            if (aAnimation.length <= 0) {//如果组件没有动画，清除默认的偏移。
                                setTrans3d(_this);
                            }
                            _this.find("img").css("transform", " rotate(" + json[j]["pages"][i]["widgets"][x].styles.rotate + "deg)")
                            .css("-webkit-transform", " rotate(" + json[j]["pages"][i]["widgets"][x].styles.rotate + "deg)");
                        }
                    });

                    var pageWidgets = json[j]["pages"][pageIndex]["widgets"];
                    var animationIds = [];
                    $.each(widgetAnimations, function (v, animate) {
                        if (animate.requireObj.animationId.trim().length > 0) {
                            animationIds.push({ id: animate.id, cId: animate.requireObj.currentWidgetId, wId: animate.requireObj.widgetId, aId: animate.requireObj.animationId, aName: animate.animationName, triggerType: animate.triggerType, animationId: animate.id });
                        }
                    });

                    $.each(pageWidgets, function (l, w) {
                        $.each(w["animation"], function (a, anim) {

                            if (anim.requireObj.animationId.trim().length <= 0) {//不依赖于任何的组件，则是在页面动画完成触发。
                                var obj = $("#" + anim.requireObj.currentWidgetId).addClass(anim.animationName + anim.id);
                                //setTimeout(function () {
                                //    setTrans3d(obj);
                                //}, anim.animationDelay * 1000);
                            }
                        });
                    });

                    var iCount = 0;
                    $.each(animationIds, function (l, w) {
                        var animationEvent = (w.triggerType === "together" ? animationStart : animationEnd);
                        $("#" + w.wId).off(animationEvent).on(animationEvent, function (e) {
                            $.each(widgetAnimations, function (v, item) {
                                if (item.requireObj.animationId === w.aId) {
                                    animationIds[iCount] && $("#" + item.requireObj.currentWidgetId).addClass(animationIds[iCount].aName + animationIds[iCount].animationId);
                                    iCount++;
                                }
                            });
                        });
                    });
                    
                    if (len <= 1) return; 
                    if (pageIndex === 0) {
                        removeAnimation(pageIndex + 1);
                    }
                    else if ( pageIndex === len-1) {
                        removeAnimation(pageIndex -1);
                    }
                    else {
                        removeAnimation(pageIndex + 1);
                        removeAnimation(pageIndex - 1);
                    }
                    
                });
            });
        });

        function removeAnimation(iNow) {
            aPage.eq(iNow).find(".ltwidget").each(function () {
                var $This = $(this);
                var aClass = $This.attr("class").split(" ");
                $.each(aClass, function (aa, bb) {
                    if (bb.indexOf("lt") > 0) {
                        $This.removeClass(bb);
                        setTrans3d($This, ["700px", 0]);
                    }
                });
            });
        }

    }


    function setTrans3d(obj, arr) {
        if (arguments.length === 1) {
            obj.css("-webkit-transform", "translate(0,0)");
            obj.css("transform", "translate(0,0)");
        }
        else {
            obj.css("-webkit-transform", "translate(" + arr[0] + "," + arr[1] + ")");
            obj.css("transform", "translate(" + arr[0] + "," + arr[1] + ")");
        }
        return obj;
    }

    function getDuration(obj) {//获取元素动画的时间

        return obj.css("-webkit-animation-duration");

    }
    function getDelay(obj) {//获取元素动画的延迟时间

        return obj.css("-webkit-animation-delay");

    }
    return util;
});