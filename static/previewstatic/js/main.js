define(function (require) {
    function  init(global,json){
        if(!json) {
            global = ltP.index.global;
            json = ltP.index.groups;
        }
        setRequireConfig();
        function setRequireConfig() {
            $.each(json, function (i, group) {
                $.each(group.pages, function (a, page) {
                    $.each(page.widgets, function (c, widget) {
                        if (widget.paths) {
                            for (var attr in widget.paths) {
                                paths[attr] = "previewstatic/" + widget.paths[attr];
                            }
                        }
                    });
                })
            });
            requirejs.config({
                paths: paths
            });
        }
        var current = 0;
        var pageChangeType = global.APP.pageChangeType * 1 || 16;
        var transitionEnd = "onwebkittransitionend" in window ? "webkitTransitionEnd" : "transitionend";
        var animationEnd = "webkitAnimationEnd", animationStart = "webkitAnimationStart";
        var zIndex = 100;
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

        function getQueryString(name, w) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = w.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }

        function shareconfig(title, desc, link, img) {
            wx.ready(function () {
                var shareDate = {
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: img,
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    },
                    success: function (res) {
                        console.log("分享成功,分享用户openid为" + openid);
                    },
                    cancel: function (res) {
                        console.log("取消分享,用户openid为" + openid);
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                };
                wx.onMenuShareAppMessage(shareDate); //发送给朋友
                wx.onMenuShareTimeline(shareDate); //享到朋友圈
                wx.onMenuShareQQ(shareDate);
                wx.onMenuShareWeibo(shareDate);
            });
            wx.error(function (res) {
                alert(res.errMsg);
            });
        }

        window.shareconfig = shareconfig;
        function appStart() {

            var animationObj = requirejs(["ltAnimation"], function (animationObj) {
                var aPage = $('.page');
                var len = aPage.size();
                var oStyle = $("#style");
                $.each(json, function (j) {
                    aPage.each(function (i, n) {
                        var This = $(this);
                        This.find(".ltwidget").each(function (x) {
                            var _this = $(this);

                            if (json[j]["pages"][i] && json[j]["pages"][i]["widgets"] && json[j]["pages"][i]["widgets"][x]) {
                                var aAnimation = json[j]["pages"][i]["widgets"][x]["animation"];
                                $.each(aAnimation, function (i, n) {
                                    var showType = n.requireObj;
                                    var animationName = n.animationName;
                                    var animation = animationObj(n);
                                    animation.bind(oStyle);//生成动画类

                                });
                            }
                        });
                    });
                });
            });

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

        var transitionEnd = "onwebkittransitionend" in window ? "webkitTransitionEnd" : "transitionend";
        var animationEnd = "webkitAnimationEnd";
        var animationStart = "webkitAnimationStart";
        var unpublish = $("#unpublish");
        setRem();

        var loading = $("#loading");
        var img = new Image();
        img.onload = img.onerror = function () {

            loading.css({ backgroundImage: "url(" + (global.APP.pubSource.loadingBg || "previewstaic/images/loading_bg.jpg") + ")", backgroundSize: "cover", backgroundPosition: "center center", backgroundRepeat: "no-repeat" });
        }

        var loadingBg = global.APP.pubSource.loadingBg.indexOf('http') > -1 ? global.APP.pubSource.loadingBg : global.APP.pubSource.loadingBg;
        var loadingSrc = global.APP.pubSource.loadingSrc.indexOf('http') > -1 ? global.APP.pubSource.loadingSrc : global.APP.pubSource.loadingSrc;
        img.src = (loadingBg ||  "static/previewstatic/images/loading_bg.jpg");

        var util = requirejs(["ltUtil"], function (util) {

            util.ltLoading(global.loadImgArr, function () {

                setTrans3d(loading, [0, "-100%", 0]);
                init(json);
                //$(".info", unpublish).css({ background: "url(" + global.APP.pubSource.infoBg + ") no-repeat center center", backgroundSize: "contain" });

                if (global.APP.isPublish * 1) {//已经是正式发布的项目
                    unpublish.remove();
                    appStart();
                    loading.off(transitionEnd).on(transitionEnd, function () {
                        window.setWidgetAnimation(null, $("#main .page").eq(0));

                    });
                }
                else {//非正式发布的应用。
                    unpublish.css({
                        opacity: 1,
                        backgroundImage: "url(static/previewstatic/images/unpublish.jpg)",
                        backgroundPosition:"center top",
                        backgroundRepeat:"no-repeat",
                        backgroundSize:"cover"}).swipe("up", function (e, _this) {
                        setTrans3d($(_this), [0, "-100%", 0]).off(transitionEnd).on(transitionEnd, function () {
                            $(_this).remove();
                            window.setWidgetAnimation(null, $("#main .page").eq(0));

                        });

                        appStart();
                    });
                }
            }, { id: "loading", src: loadingSrc, color: (global.APP.pubSource.loadingColor || "#fff"), scale: global.loadImgArr.length > 10 ? .5 : 1 });
        });


        function loadAudio() { //载入音频文件

            document.title = global.APP.appName;

            var audio = global.APP.bgSound;
            if (audio && audio.src) {//有背景音乐。
                var a = $("<audio controls loop='" + audio.loop + "' " + (audio.autoplay ? "autoplay" : "") + " src='" + audio.src + "' id='audio'></aduio>");
                $("body").append(a);
                var dataAudio = $("#audio");
                // dataAudio[0].muted = true;//TODO.音频静音了。测试用。
                if (audio.display) {
                    dataAudio.css({ opacity: 1, zIndex: 1000 });
                } else {
                    $("#container").append($('<div id="play"></div>'));
                    $("#style").append("#audio{position:fixed;z-index:-1;opacity:0;}\n#play{background:url(" + global.APP.domain + audio.icoSrc + ") no-repeat 0 0}");
                    var isStop = true;
                    var dataPlay = $("#play");

                    if (!audio.display) {
                        $(document).one("touchstart", function () {
                            dataAudio[0].play();
                            isStop = false;
                        });

                        dataPlay.tap(function (e, _this) {
                            if (isStop) {
                                $("#main audio").each(function (i, audios) {
                                    audios.pause();
                                });
                                dataAudio[0].play();
                            }
                            else {
                                dataAudio[0].pause();
                                $(_this).css({ backgroundPosition: "0 0" });
                            }
                            isStop = !isStop;
                        });

                        dataAudio.on("play", function () {
                            dataPlay.css({ backgroundPosition: "-37px 0" })
                        });
                        dataAudio.on("pause", function () {
                            dataPlay.css({ backgroundPosition: "0 0" })
                        }).on("canplaythrough", function () {
                            if ($(this)[0].paused) {
                                $(this)[0].play();
                                dataPlay.css({ backgroundPosition: "-37px 0" })
                            }
                        });
                    }
                }
            }
        }


        function init(json) {


            $('head').append('<style id="style"></style>');
            loadAudio();

            var main = $("#main");


            var scriptStr = "";

            for (var i = 0; i < json.length; i++) {
                for (var j = 0; j < json[i]["pages"].length; j++) {
                    getScript(json[i]["pages"][j]);
                }
            }



            function getScript(data) {


                var s = data;

                s.parent = main;
                //   s.pageChangeType === "go" && (s.pageChangeType += s.showDir);
                var ltPage = require("ltPage");


                var page = ltPage(s);

                if (s.type === "singlepage") {
                    var scrollObj = require("iscroll");
                    window.iScroll(s.pageId, { hScroll: false });
                }

                var aWidget = [];//存储一个页面中的所有的组件。

                if (!s['widgets']) return;
                var len = s['widgets'].length;

                function replaceToCanvas(obj) {

                    $.each(obj.animation, function (x, animation) {

                        if (animation.type === "flyParticle") {//该图片加上了canvas特效啦
                            $("#" + obj.id).html("").append("<canvas id='" + obj.id + "_canvas' style='opacity:1'></canvas><canvas style='opacity:0' id='" + obj.id + "_canvas1'></canvas>");
                        }
                    });
                }

                var parent = page.target.find(".page_container");



                for (var i = 0; i < len; i++) {//
                    var obj = s['widgets'][i];

                    obj.parent = parent;
                    switch (obj.type) {
                        case "image"://图片
                            var ltImage = require("ltImage");
                            var img = ltImage(obj);
                            var zIndex = 100;
                            replaceToCanvas(obj);
                            if (obj.hrefIndex * 1 >= 0) {
                                $("#" + obj.id).data("hrefIndex", obj.hrefIndex).tap(function (e, _this) {
                                    //   var aPage = $(".page");
                                    var index = $(_this).data("href-index") * 1;
                                    current = index;
                                    var lastIndex = $(_this).parents(".page").index(".page");
                                    window.navToPage(pageChangeType, lastIndex, index);
                                });
                            }


                            break;
                        case "text"://文本
                            var ltTextField = require("ltTextField");
                            var text = ltTextField(obj);
                            $(function () {
                                if (s.type === "page") {
                                   $("#" + obj.id).slider({ bindMoveEventObj: $("#" + obj.id).parents(".page_container") });
                                }
                            });
                            break;
                        case "video"://视频
                            var videoObj = require("ltVideo");
                            var video = videoObj(obj);
                            break;
                        case "radius":
                            var radius = require("ltRadius");
                            var ltRadius = radius(obj);
                            replaceToCanvas(obj);
                            break;
                        case "ellipse":

                            var ellipse = require("ltEllipse");
                            var ltEllipse = ellipse(obj);
                            replaceToCanvas(obj);

                            break;
                        case "rectangular":
                            var rectangular = require("ltRectangular");
                            var ltRectangular = rectangular(obj);
                            replaceToCanvas(obj);
                            break;
                        case "line":
                            var ltLine = require("ltLine");
                            var line = ltLine(obj);

                            break;
                        case "outweb":
                            var ltOutweb = require("ltOutweb");
                            var ltOutweb = ltOutweb(obj);

                            break;
                        case "slider":
                            var slider = require("ltSlider");
                            var ltSlider = slider(obj);
                            break;
                        case "outtool":
                            window.parentId = "#" + s.pageId + " .page_container";
                            var ltOutTool = require("ltOutTool");
                            var outtool = ltOutTool(obj);
                            break;
                        case "audio":
                            var audio = require("ltAudio");
                            audio(obj);
                            break;
                    }
                }
            }

            pageLoaded();
        }

        function pageLoaded() {

            pageLoad();
            var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            global.APP.statistics && ($("body").append(global.APP.statistics));
        }

        function pageLoad() {//页面渲染完执行的回调函数。

            var $main = $('#main'),
                $pages = $main.children('.page'),
                pagesCount = $pages.length,
                animcursor = 1,
                widgetAnimations = [],//所有的组件的动画
                isAnimating = false,
                endCurrPage = false,
                endNextPage = false,
                endPrevPage = false,
                animEndEventNames = {
                    'WebkitAnimation': 'webkitAnimationEnd',
                    'OAnimation': 'oAnimationEnd',
                    'msAnimation': 'MSAnimationEnd',
                    'animation': 'animationend'
                };
            // animation end event name
            if (pagesCount <= 1) {//如果只有一页的话，则移除页面滑动的提示。
                $pages.find(".info").remove();
            }
            function init1() {

                $pages.each(function () {
                    var $page = $(this);
                    $page.data('originalClassList', $page.attr('class'));
                });

                $pages.eq(current).addClass('fly-page-current');

                var Modernizr = window.Modernizr;//  require("Modernizr");
                if (!Modernizr) {
                    window.location.href = window.location.href;
                }
                $pages.each(function (i) {
                    var _this = $(this);
                    if (_this.data("type") === "page") {
                        _this.swipe("up", function () {
                            nextPage(pageChangeType);
                        }).swipe("down", function () {
                            prevPage(pageChangeType - 1);
                        });
                    }
                    else if (_this.data("type") === "singlepage") {
                        var pageId = _this.attr("id");
                        var page_container = $("#" + pageId).find(".page_container");
                        if (i === 0 && $pages.size() > 1) {//有超长单页，且在第一页，不止一个页面
                            var nextHtml = "<div id='next-" + pageId + "' style='border-radius:4px; background-color: #459bd1;color:#fff;position: absolute;  bottom: 0; width:100%;height:50px; line-height:50px; text-align:center;'>下一页</div>";
                            page_container.append(nextHtml);
                            $("#next-" + pageId).tap(function () {
                                nextPage(pageChangeType);
                            });
                        }
                        else if (i !== $pages.size() - 1) {//超长单页之后还有页面。
                            var upHtml = "<div id='up-" + pageId + "' style='border-radius:4px;  background-color: #459bd1;color:#fff;position: absolute; width:100%;height:50px; line-height:50px; text-align:center;'>上一页</div>";
                            var nextHtml = "<div id='next-" + pageId + "' style='border-radius:4px;  background-color: #459bd1;color:#fff;position: absolute;  bottom: 0; width:100%;height:50px; line-height:50px; text-align:center;'>下一页</div>";
                            page_container.prepend(upHtml);
                            page_container.append(nextHtml);
                            $("#up-" + pageId).tap(function () {
                                prevPage(pageChangeType - 1);
                            });
                            $("#next-" + pageId).tap(function () {
                                nextPage(pageChangeType);
                            });
                        }
                        else if (i === $pages.size() - 1 && i !== 0) {////超长单页之后没有页面。
                            var upHtml = "<div id='up-" + pageId + "' style='border-radius:4px;  background-color: #459bd1;color:#fff;position: absolute; width:100%;height:50px; line-height:50px; text-align:center;'>上一页</div>";
                            page_container.prepend(upHtml);
                            $("#up-" + pageId).tap(function () {
                                prevPage(pageChangeType - 1);
                            });
                        }
                    }
                });

            }

            function swichClass(animation) {
                var outClass = "", inClass = "";
                switch (animation) {
                    case 1:
                        outClass = 'fly-page-moveToLeft';
                        inClass = 'fly-page-moveFromRight';
                        break;
                    case 2:
                        outClass = 'fly-page-moveToRight';
                        inClass = 'fly-page-moveFromLeft';
                        break;
                    case 3://3-4
                        outClass = 'fly-page-moveToBottom';
                        inClass = 'fly-page-moveFromTop';
                        break;
                    case 4:
                        outClass = 'fly-page-moveToTop';
                        inClass = 'fly-page-moveFromBottom';
                        break;
                    case 5:
                        outClass = 'fly-page-fade';
                        inClass = 'fly-page-moveFromRight fly-page-ontop';
                        break;
                    case 6:
                        outClass = 'fly-page-fade';
                        inClass = 'fly-page-moveFromLeft fly-page-ontop';
                        break;
                    case 7://7-8
                        outClass = 'fly-page-fade';
                        inClass = 'fly-page-moveFromTop fly-page-ontop';
                        break;
                    case 8:
                        outClass = 'fly-page-fade';
                        inClass = 'fly-page-moveFromBottom fly-page-ontop';
                        break;
                    case 9:
                        outClass = 'fly-page-moveToLeftFade';
                        inClass = 'fly-page-moveFromRightFade';
                        break;
                    case 10:
                        outClass = 'fly-page-moveToRightFade';
                        inClass = 'fly-page-moveFromLeftFade';
                        break;
                    case 11:// 11-12
                        outClass = 'fly-page-moveToBottomFade';
                        inClass = 'fly-page-moveFromTopFade';
                        break;
                    case 12:
                        outClass = 'fly-page-moveToTopFade';
                        inClass = 'fly-page-moveFromBottomFade';
                        break;
                    case 13:
                        outClass = 'fly-page-moveToLeftEasing fly-page-ontop';
                        inClass = 'fly-page-moveFromRight';
                        break;
                    case 14:
                        outClass = 'fly-page-moveToRightEasing fly-page-ontop';
                        inClass = 'fly-page-moveFromLeft';
                        break;
                    case 15://16-16
                        outClass = 'fly-page-moveToBottomEasing fly-page-ontop';
                        inClass = 'fly-page-moveFromTop';
                        break;
                    case 16:
                        outClass = 'fly-page-moveToTopEasing fly-page-ontop';
                        inClass = 'fly-page-moveFromBottom';
                        break;
                    case 17:
                        outClass = 'fly-page-scaleDown';
                        inClass = 'fly-page-moveFromRight fly-page-ontop';
                        break;
                    case 18:
                        outClass = 'fly-page-scaleDown';
                        inClass = 'fly-page-moveFromLeft fly-page-ontop';
                        break;
                    case 19://19-20
                        outClass = 'fly-page-scaleDown';
                        inClass = 'fly-page-moveFromTop fly-page-ontop';
                        break;
                    case 20:
                        outClass = 'fly-page-scaleDown';
                        inClass = 'fly-page-moveFromBottom fly-page-ontop';
                        break;
                    case 21://21-22
                        outClass = 'fly-page-scaleDown';
                        inClass = 'fly-page-scaleUpDown fly-page-delay300';
                        break;
                    case 22:
                        outClass = 'fly-page-scaleDownUp';
                        inClass = 'fly-page-scaleUp fly-page-delay300';
                        break;
                    case 23:
                        outClass = 'fly-page-moveToLeft fly-page-ontop';
                        inClass = 'fly-page-scaleUp';
                        break;
                    case 24:
                        outClass = 'fly-page-moveToRight fly-page-ontop';
                        inClass = 'fly-page-scaleUp';
                        break;
                    case 25: // 25-26
                        outClass = 'fly-page-moveToBottom fly-page-ontop';
                        inClass = 'fly-page-scaleUp';
                        break;
                    case 26:
                        outClass = 'fly-page-moveToTop fly-page-ontop';
                        inClass = 'fly-page-scaleUp';
                        break;
                    case 27:
                        outClass = 'fly-page-scaleDownCenter';
                        inClass = 'fly-page-scaleUpCenter fly-page-delay400';
                        break;
                    case 28:
                        outClass = 'fly-page-rotateRightSideFirst';
                        inClass = 'fly-page-moveFromRight fly-page-delay200 fly-page-ontop';
                        break;
                    case 29: //29-30
                        outClass = 'fly-page-rotateTopSideFirst';
                        inClass = 'fly-page-moveFromTop fly-page-delay200 fly-page-ontop';
                        break;
                    case 30:
                        outClass = 'fly-page-rotateBottomSideFirst';
                        inClass = 'fly-page-moveFromBottom fly-page-delay200 fly-page-ontop';
                        break;
                    case 31:
                        outClass = 'fly-page-rotateLeftSideFirst';
                        inClass = 'fly-page-moveFromLeft fly-page-delay200 fly-page-ontop';
                        break;
                    case 32:
                        outClass = 'fly-page-flipOutRight';
                        inClass = 'fly-page-flipInLeft fly-page-delay500';
                        break;
                    case 33://33-34
                        outClass = 'fly-page-flipOutBottom';
                        inClass = 'fly-page-flipInTop fly-page-delay500';
                        break;
                    case 34:
                        outClass = 'fly-page-flipOutTop';
                        inClass = 'fly-page-flipInBottom fly-page-delay500';
                        break;
                    case 35:
                        outClass = 'fly-page-flipOutLeft';
                        inClass = 'fly-page-flipInRight fly-page-delay500';
                        break;
                    case 36:
                        outClass = 'fly-page-rotateFall fly-page-ontop';
                        inClass = 'fly-page-scaleUp';
                        break;
                    case 37:
                        outClass = 'fly-page-rotateOutNewspaper';
                        inClass = 'fly-page-rotateInNewspaper fly-page-delay500';
                        break;
                    case 38:
                        outClass = 'fly-page-rotatePushLeft';
                        inClass = 'fly-page-moveFromRight';
                        break;
                    case 39: //39-40
                        outClass = 'fly-page-rotatePushBottom';
                        inClass = 'fly-page-moveFromTop';
                        break;
                    case 40:
                        outClass = 'fly-page-rotatePushTop';
                        inClass = 'fly-page-moveFromBottom';
                        break;
                    case 41:
                        outClass = 'fly-page-rotatePushRight';
                        inClass = 'fly-page-moveFromLeft';
                        break;
                    case 42:
                        outClass = 'fly-page-rotatePushLeft';
                        inClass = 'fly-page-rotatePullRight fly-page-delay180';
                        break;
                    case 43://43-44
                        outClass = 'fly-page-rotatePushBottom';
                        inClass = 'fly-page-rotatePullTop fly-page-delay180';
                        break;
                    case 44:
                        outClass = 'fly-page-rotatePushTop';
                        inClass = 'fly-page-rotatePullBottom fly-page-delay180';
                        break;
                    case 45:
                        outClass = 'fly-page-rotatePushRight';
                        inClass = 'fly-page-rotatePullLeft fly-page-delay180';
                        break;
                    case 46:
                        outClass = 'fly-page-rotateFoldLeft';
                        inClass = 'fly-page-moveFromRightFade';
                        break;
                    case 47: // 47-48
                        outClass = 'fly-page-rotateFoldBottom';
                        inClass = 'fly-page-moveFromTopFade';
                        break;
                    case 48:
                        outClass = 'fly-page-rotateFoldTop';
                        inClass = 'fly-page-moveFromBottomFade';
                        break;
                    case 49:
                        outClass = 'fly-page-rotateFoldRight';
                        inClass = 'fly-page-moveFromLeftFade';
                        break;
                    case 50:
                        outClass = 'fly-page-moveToRightFade';
                        inClass = 'fly-page-rotateUnfoldLeft';
                        break;
                    case 51://51 -52
                        outClass = 'fly-page-moveToBottomFade';
                        inClass = 'fly-page-rotateUnfoldTop';
                        break;
                    case 52:
                        outClass = 'fly-page-moveToTopFade';
                        inClass = 'fly-page-rotateUnfoldBottom';
                        break;
                    case 53:
                        outClass = 'fly-page-moveToLeftFade';
                        inClass = 'fly-page-rotateUnfoldRight';
                        break;
                    case 54:
                        outClass = 'fly-page-rotateRoomLeftOut fly-page-ontop';
                        inClass = 'fly-page-rotateRoomLeftIn';
                        break;
                    case 55: //55-56
                        outClass = 'fly-page-rotateRoomBottomOut fly-page-ontop';
                        inClass = 'fly-page-rotateRoomBottomIn';
                        break;
                    case 56:
                        outClass = 'fly-page-rotateRoomTopOut fly-page-ontop';
                        inClass = 'fly-page-rotateRoomTopIn';
                        break;
                    case 57:
                        outClass = 'fly-page-rotateRoomRightOut fly-page-ontop';
                        inClass = 'fly-page-rotateRoomRightIn';
                        break;
                    case 58:
                        outClass = 'fly-page-rotateCubeLeftOut fly-page-ontop';
                        inClass = 'fly-page-rotateCubeLeftIn';
                        break;
                    case 59://59 -60;
                        outClass = 'fly-page-rotateCubeBottomOut fly-page-ontop';
                        inClass = 'fly-page-rotateCubeBottomIn';
                        break;
                    case 60:
                        outClass = 'fly-page-rotateCubeTopOut fly-page-ontop';
                        inClass = 'fly-page-rotateCubeTopIn';
                        break;
                    case 61:
                        outClass = 'fly-page-rotateCubeRightOut fly-page-ontop';
                        inClass = 'fly-page-rotateCubeRightIn';
                        break;
                    case 62:
                        outClass = 'fly-page-rotateCarouselLeftOut fly-page-ontop';
                        inClass = 'fly-page-rotateCarouselLeftIn';
                        break;
                    case 63://63-64
                        outClass = 'fly-page-rotateCarouselBottomOut fly-page-ontop';
                        inClass = 'fly-page-rotateCarouselBottomIn';
                        break;
                    case 64:
                        outClass = 'fly-page-rotateCarouselTopOut fly-page-ontop';
                        inClass = 'fly-page-rotateCarouselTopIn';
                        break;
                    case 65:
                        outClass = 'fly-page-rotateCarouselRightOut fly-page-ontop';
                        inClass = 'fly-page-rotateCarouselRightIn';
                        break;
                    case 66:
                        outClass = 'fly-page-rotateSidesOut';
                        inClass = 'fly-page-rotateSidesIn fly-page-delay200';
                        break;
                    case 67:
                        outClass = 'fly-page-rotateSlideOut';
                        inClass = 'fly-page-rotateSlideIn';
                        break;

                }

                return { outClass: outClass, inClass: inClass }
            }

            function nextPage(animation) {

                if (isAnimating || pagesCount <= 1) {
                    return false;
                }
                isAnimating = true;

                var $currPage = $pages.eq(current);

                if (current < pagesCount - 1) {
                    current++;
                }
                else {
                    current = 0;
                }
                var $nextPage = $pages.eq(current).addClass('fly-page-current'),
                    outClass = '', inClass = '';
                //$currPage.removeClass("fly-page-current");

                var classList = swichClass(animation);
                outClass = classList.outClass;
                inClass = classList.inClass;
                var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
                // support css animations
                    support = Modernizr.cssanimations;

                $currPage.addClass(outClass).on(animEndEventName, function () {
                    $currPage.off(animEndEventName);
                    endCurrPage = true;
                    if (endNextPage) {
                        onEndAnimation($currPage, $nextPage);
                    }
                });

                $nextPage.addClass(inClass).on(animEndEventName, function () {
                    $nextPage.off(animEndEventName);
                    endNextPage = true;

                    if (endCurrPage) {
                        onEndAnimation($currPage, $nextPage);
                    }
                });

                if (!support) {
                    onEndAnimation($currPage, $nextPage);
                }
            }

            window.navToPage = navToPage;
            function navToPage(animation, lastIndex, index) {
                if (isAnimating) {
                    return false;
                }

                isAnimating = true;

                var $currPage = $pages.eq(lastIndex);

                var $nextPage = $pages.eq(index).addClass('fly-page-current'),
                    outClass = '', inClass = '';

                var classList = swichClass(animation);
                outClass = classList.outClass;
                inClass = classList.inClass;
                var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
                // support css animations
                    support = Modernizr.cssanimations;

                $currPage.addClass(outClass).on(animEndEventName, function () {
                    $currPage.off(animEndEventName);
                    endCurrPage = true;
                    if (endNextPage) {
                        onEndAnimation($currPage, $nextPage);
                    }
                });

                $nextPage.addClass(inClass).on(animEndEventName, function () {
                    $nextPage.off(animEndEventName);
                    endNextPage = true;
                    if (endCurrPage) {
                        onEndAnimation($currPage, $nextPage);
                    }
                });

                if (!support) {
                    onEndAnimation($currPage, $nextPage);
                }
            }

            function prevPage(animation) {

                if (isAnimating || pagesCount <= 1) {
                    return false;
                }

                isAnimating = true;

                var $currPage = $pages.eq(current);

                if (current > 0) {
                    current--;
                }
                else {
                    current = pagesCount - 1;
                }

                var $prevPage = $pages.eq(current).addClass('fly-page-current'),
                    outClass = '', inClass = '';

                var classList = swichClass(animation);
                outClass = classList.outClass;
                inClass = classList.inClass;
                var animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
                // support css animations
                    support = Modernizr.cssanimations;

                $currPage.addClass(outClass).on(animEndEventName, function () {
                    $currPage.off(animEndEventName);
                    endCurrPage = true;
                    if (endPrevPage) {
                        onEndAnimation($currPage, $prevPage);
                    }
                });

                $prevPage.addClass(inClass).on(animEndEventName, function () {
                    $prevPage.off(animEndEventName);
                    endPrevPage = true;
                    if (endCurrPage) {
                        onEndAnimation($currPage, $prevPage);
                    }
                });

                if (!support) {
                    onEndAnimation($currPage, $prevPage);
                }
            }


            $.each(json, function (j) {
                $pages.each(function (i, n) {
                    var This = $(this);
                    var widgets = json[j]["pages"][i] && json[j]["pages"][i]["widgets"];
                    if (widgets) {
                        for (var k = 0; k < widgets.length; k++) {
                            for (var h = 0; h < widgets[k]["animation"].length; h++) {
                                if (widgets[k]["animation"][h].type === "animation") {
                                    widgetAnimations.push(widgets[k]["animation"][h]);//得到一个页面所有的组件的所有动画！

                                }
                            }
                        }
                    }

                });
            });

            function onEndAnimation($outpage, $inpage) {
                endCurrPage = false;
                endNextPage = false;
                endPrevPage = false;
                resetPage($outpage, $inpage);
                isAnimating = false;
                setWidgetAnimation($outpage, $inpage);

            }

            window.setWidgetAnimation = setWidgetAnimation;

            //设置组件的动画！
            var htmlFontSize = $("html").css("font-size");

            function setWidgetAnimation($outpage, $inpage) {
                removeAnimation();

                var audios = $inpage.find("audio");
                if (audios.length > 0) {
                    audios.each(function (i, n) {//开启当前页面的音乐。
                        if ($(n).parent().data("autoplay")) {
                            $(n)[0].play();
                        }
                    });
                }
                var len = pagesCount;
                $.each(json, function (j) {
                    var This = $inpage;
                    var pageIndex = current;
                    var widgets = json[j]["pages"][pageIndex] && json[j]["pages"][pageIndex]["widgets"];
                    var ltwidget = This.find(".ltwidget");
                    //动画处理的逻辑

                    ltwidget.each(function (x) {//循环每一个组件
                        var _this = $(this);

                        if (json[j]["pages"][pageIndex]["widgets"][x] && json[j]["pages"][pageIndex]["widgets"][x].type === "outtool") {
                            var scripts = json[j]["pages"][pageIndex]["widgets"][x].scripts;
                            var links = json[j]["pages"][pageIndex]["widgets"][x].links;
                            var type = json[j]["pages"][pageIndex]["widgets"][x].data.type;

                            if ((!type || type !== "image") && scripts && scripts.length > 0) {
                                requirejs(json[j]["pages"][pageIndex]["widgets"][x].scripts, function () {
                                    for (var i = 0; i < arguments.length; i++) {
                                        typeof arguments[i] === "function" && arguments[i]("outtool_" + json[j]["pages"][pageIndex]["widgets"][x].id, json[j]["pages"][pageIndex]["widgets"][x].data);
                                    }
                                });
                            }

                            if ((!type || type !== "image") && links && links.length > 0) {
                                var head = $("head");
                                for (var i = 0; i < links.length; i++) {
                                    $("#" + json[j]["pages"][pageIndex]["widgets"][x].links[i].id).size() <= 0 && head.append(' <link href="/previewstatic' + json[j]["pages"][pageIndex]["widgets"][x].links[i].src.split("static")[1] + '" id="' + json[j]["pages"][pageIndex]["widgets"][x].links[i].id + '" rel="stylesheet" type="text/css">');
                                }
                            }
                        }

                        if (json[j]["pages"][pageIndex]["widgets"][x]) {
                            var aAnimation = json[j]["pages"][pageIndex]["widgets"][x]["animation"];
                            if (aAnimation.length <= 0) {
                                //setTrans3d(_this);
                                _this.addClass("active");
                            }
                            else {
                                $.each(aAnimation, function (aaa, animtion) {
                                    if (animtion.type !== "animation") {//如果组件没有动画，清除默认的偏移。
                                        //setTrans3d(_this);
                                        _this.addClass("active");
                                    }
                                });
                            }

                            if (json[j]["pages"][pageIndex]["widgets"][x].styles && json[j]["pages"][pageIndex]["widgets"][x].styles.rotate && json[j]["pages"][pageIndex]["widgets"][x].styles.rotate > 0) {
                                _this.children().css("transform", " rotate(" + json[j]["pages"][pageIndex]["widgets"][x].styles.rotate + "deg)")
                                    .css("-webkit-transform", " rotate(" + json[j]["pages"][pageIndex]["widgets"][x].styles.rotate + "deg)");
                            }

                        }
                    });
                    if (json[j]["pages"][pageIndex] && json[j]["pages"][pageIndex].keyFrames && json[j]["pages"][pageIndex].styles.animationName !== "none") {
                        $("#" + json[j]["pages"][pageIndex].pageId + " .bg-img").addClass("lt-img-move");
                    }

                    var pageWidgets = json[j]["pages"][pageIndex] && json[j]["pages"][pageIndex]["widgets"];
                    var animationIds = [];
                    $.each(widgetAnimations, function (v, animate) {
                        if (animate.requireObj.animationId.trim().length > 0) {
                            animationIds.push({ id: animate.id, cId: animate.requireObj.currentWidgetId, wId: animate.requireObj.widgetId, aId: animate.requireObj.animationId, aName: animate.animationName, triggerType: animate.triggerType, animationId: animate.id });
                        }
                    });



                    if (pageWidgets) {
                        $.each(pageWidgets, function (l, w) {
                            $.each(w["animation"], function (a, anim) {

                                if (anim.type === "animation" && anim.requireObj.animationId.trim().length <= 0) {//不依赖于任何的组件，则是在页面动画完成触发。
                                    var obj = $("#preview_" + anim.requireObj.currentWidgetId).addClass(anim.animationName + anim.id).off(animationStart).on(animationStart, function () {
                                        obj.addClass("active");
                                    });
                                }
                            });
                        });
                    }

                    if (widgets) {
                        $.each(widgets, function (i, n) { //解析canvas动画。
                            $.each(n.animation, function (x, animation) {
                                if (animation.type === "flyParticle") {

                                    var w = parseFloat(n.styles.width) * parseFloat(htmlFontSize),
                                        h = parseFloat(n.styles.height) * parseFloat(htmlFontSize);

                                    var option = {
                                        type: n.type,
                                        aString: n.src,
                                        w: w,
                                        h: h,
                                        canvas: n.id + "_canvas",
                                        canvas1: n.id + "_canvas1",
                                        fillStyle: n.styles.backgroundColor,
                                        duration: animation.animationDuration * 1000 || 800,
                                        pointsStyle: ["#f90", "#DDD9E4", "#D2CFD8", "#A3AFB2"],
                                        isNeedBackBg: 0
                                    }
                                    requirejs(["ltUtil"], function (util) {
                                        if (animation.animationDelay > 0) {
                                            setTimeout(function () {
                                                util.flyParticle(option);
                                            }, animation.animationDelay * 1000);
                                        } else {
                                            util.flyParticle(option);
                                        }
                                    });

                                }
                            });
                        });
                    }
                    var iCount = 0;
                    $.each(animationIds, function (l, w) {

                        var animationEvent = (w.triggerType === "together" ? animationStart : animEndEventNames[Modernizr.prefixed('animation')]);
                        $("#" + w.wId).off(animationEvent).on(animationEvent, function (e) {

                            $.each(widgetAnimations, function (v, item) {

                                if (item.requireObj.animationId === w.aId) {

                                    animationIds[iCount] && $("#preview_" + item.requireObj.currentWidgetId).addClass("active").addClass(item.animationName + item.id);
                                    iCount++;
                                    //animationIds[iCount] && $("#" + item.requireObj.currentWidgetId).addClass(animationIds[iCount].aName + animationIds[iCount].animationId);


                                }
                            });
                        });
                    });
                });
            }

            function removeAnimation() {

                var audios = aPage.find("audio");
                if (audios.length > 0) { //暂停所有的音乐
                    audios.each(function (i, n) {
                        $(n)[0].pause();
                    });
                }

                aPage.find(".ltwidget").each(function () {
                    var $This = $(this);
                    if ($This.find("video").size() > 0) {
                        $This.find("video")[0].pause();
                    }
                    aPage.find(".info").length > 0 && aPage.find(".info").css({ animation: "none", "-webkit-animation": "none" }).eq(current).css({ animation: "ltshake 1.5s infinite ease", "-webkit-animation": "ltshake 1.5s infinite ease" });
                    var aClass = $This.attr("class").split(" ");
                    $.each(aClass, function (aa, bb) {
                        if (bb.indexOf("lt") > 0) {
                            $This.removeClass(bb);
                            //setTrans3d($This, ["700px", 0]);
                            $This.removeClass("active");
                        }
                    });
                });

                $.each(json, function (i, js) {
                    $.each(js.pages, function (j, page) {
                        if (page.keyFrames && page.styles.animationName !== "none") {
                            $("#" + page.pageId + " .bg-img").removeClass("lt-img-move");
                        }
                        $.each(page.widgets, function (x, widget) {
                            $.each(widget.animation, function (a, animation) {
                                if (animation.type === "flyParticle") {
                                    window[widget.id + "_canvas"] && (window[widget.id + "_canvas"].style.opacity = 0);
                                    window[widget.id + "_canvas1"] && (window[widget.id + "_canvas1"].style.opacity = 0);
                                }
                            });
                        });
                    })
                });

            }

            function resetPage($outpage, $inpage) {
                $outpage.attr('class', $outpage.data('originalClassList'));
                $inpage.attr('class', $inpage.data('originalClassList') + ' fly-page-current');
            }

            init1();
            var aPage = $pages;
            var len = pagesCount;

            var isPreview = getQueryString("isPreview", window);
            isPreview && ($("#back-edit").show());

            var operator = $("#operator");
            if (operator.css("display") === "block") {
                var oCode = $("#code");

                //oCode.find("img").remove();

                var img = new Image();
                img.onerror = function () {

                    var s = require("Sonic");
                    var square = new s.Sonic({
                        width: 200,
                        height: 200,
                        fillColor: '#000',
                        path: [
                            ['line', 0, 0, 200, 0],
                            ['line', 200, 0, 200, 200],
                            ['line', 200, 200, 0, 200],
                            ['line', 0, 200, 0, 0]
                        ]
                    });
                    square.play();

                    oCode.append(square.canvas);

                    var code = require("qrcode");
                    var qrcode = new code.QRCode($("#code")[0], {
                        width: 200,//设置宽高;
                        height: 200
                    });
                    qrcode.makeCode(global.APP.qrCode, function () {
                        oCode.css({ border: "2px dashed #8f1e23" });
                        square.stop();
                        $("#code canvas").remove();
                    });
                }
                img.onload = function () {
                    oCode.find("img").remove();
                    oCode.css({ border: "2px dashed #8f1e23" });
                    oCode.append("<img src='" + this.src + "' alt='智媒体'>");
                };
                img.src = "static/qrcode.png";

                if (global.APP.isPublish * 1) {
                    appStart();
                }


                operator.find(".keyword .dir div").each(function () {
                    $(this).tap(function (e, _this) {
                        var index = $(_this).index();

                        switch (index) {
                            case 0://上一页
                                prevPage(pageChangeType - 1);
                                break;
                            case 1://向左
                                break;
                            case 2://下一页

                                if (!(global.APP.isPublish * 1)) {
                                    setTrans3d($("#unpublish"), [0, "-100%"]).off(transitionEnd).on(transitionEnd, function () {
                                        window.setWidgetAnimation(null, $("#main .page").eq(0));
                                    });
                                    appStart();

                                    global.APP.isPublish = 1;
                                }
                                else {

                                    nextPage(pageChangeType);
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
                            prevPage(pageChangeType - 1);
                            break;
                        case 39:
                            break;
                        case 40://下
                            if (!(global.APP.isPublish * 1)) {
                                setTrans3d($("#unpublish"), [0, "-100%"]).off(transitionEnd).on(transitionEnd, function () {
                                    window.setWidgetAnimation(null, $("#main .page").eq(0));
                                });
                                appStart();
                                global.APP.isPublish = 1;
                            }
                            else {
                                nextPage(pageChangeType);
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
                    //parent.layer.closeAll(); //执行关闭
                    parent.$(".xubox_close").trigger("click");
                });
            }
        }

        function setRem() {
            $("html").css({ fontSize: $("#container").width() / 10 + "px" });
        }
    }
   return init;
});