define("app",["iscroll", "jquery", "flyPlugin", "directive", "minicolor"], function (iscroll) {
    var doc = document;
    $(doc).on("touchmove", function (e) {
        if (e.target.nodeName !== "INPUT") {
            e.preventDefault();
        }
    });
    function fnJSONLoaded() {//主程序的入口。
        var ltP = {
            index: {}
        };
        window.ltP = ltP;
        ltP.index.groups = json;
        ltP.index.global = global;
        var zmitiApp = angular.module("zmitiApp", ["ngSanitize", "derectiveModule", "ngRoute", "ngAnimate", "ngTouch"]);
        zmitiApp.run(["$rootScope", "$location", "zmitiService", function ($rootScope, $location, zmitiService) {


            zmitiService.setDefault();

            zmitiService.getFocusPage(0);//默认加载第一页的内容。

            zmitiService.getFocusWidget(0);//

            $rootScope.$on("$viewContentLoaded", function () {


                if ($location.path() === "/page/projectSetting") {
                    if ($("#fly-project-setting").length <= 0) {
                        return;
                    }
                    $("#fly-project-setting").height(zmitiService.viewHeight - 44 ); //32为两个.5rem的padding值
                    zmitiService.setProjectSetting();
                    requirejs(["iscroll"], function (scroll) {
                        scroll("#fly-project-setting", {
                            scrollbars: true,//显示滚动条
                            click: false,//关闭click事件
                            tap: true,//启用tap事件
                            //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                            interactiveScrollbars: true,//用户是否可以拖动滚动条
                            shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                        });
                    });
                }
                else if ($location.path() === "/page/flip") {
                    $("#fly-flip .fly-flip-box").height(zmitiService.viewHeight - 44 - $("#fly-flip .fly-btn").height());
                    requirejs(["iscroll"], function (scroll) {
                        scroll("#fly-flip .fly-flip-box", {
                            scrollbars: true,//显示滚动条
                            click: false,//关闭click事件
                            tap: true,//启用tap事件
                            //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                            //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                            interactiveScrollbars: true,//用户是否可以拖动滚动条
                            shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                        });
                    })
                }
                else if($location.path()==="/piclibrary/attr") {//图片库
                    var yes=$("#fly-pic-library-container .fly-bottom input").eq(0);
                    var cancel=$("#fly-pic-library-container .fly-bottom input").eq(1);

                    switch (ltP.index.$scope.goBackPath){
                        case "/slider/attr":
                            if(ltP.index.$scope.sliderIndex){
                                yes.on("tap", function(e){
                                    e.preventDefault();
                                    zmitiService.setSliderChangeOne();
                                });
                            }
                            else{
                                yes.on("tap",function(e){
                                    e.preventDefault();
                                    zmitiService.setSliderBatch();
                                });
                            }
                            break;
                        case "/video/attr":
                            yes.on("tap", function(e){
                                e.preventDefault();
                                zmitiService.setVideoPic();
                            });
                            break;
                        case "/image/attr":
                            yes.on("tap",function(e){
                                e.preventDefault();
                                zmitiService.setImageSrc();
                            });
                            break;
                        case "/page/editBg":
                            yes.on("tap",function(e){
                                e.preventDefault();
                                zmitiService.setPageBG();
                            });
                            break;
                        case "/page/loading":
                            yes.on("tap",function(e){
                                e.preventDefault();
                                zmitiService.setEditLoading();
                            });
                            break;
                        default :
                            yes.on("tap", function (e) {
                                e.preventDefault();
                                zmitiService.setImageSrc();
                            });
                            break;
                    }
                    cancel.on("tap", function(e){
                        e.preventDefault();
                        zmitiService.cancel();
                    });
                }
                else if($location.path()==="/video/library"){

                }
                else if($location.path() === "/page/preview"){
                    requirejs(["previewAll","weixin"],function(){
                        requirejs(["main"],function(init){
                            init(zmitiService.isWX);
                        })

                        String.prototype.hump = function () {
                            return this.replace(/([A-Z])/g, "-$1").toLowerCase();
                        }

                        var local = window.location.href;


                        var openid = "";
                        if (zmitiService.isWX()) {
                            openid = getQuery("openid", window);
                            if (!openid || openid == '') {
                                var h = local.substring(0, local.indexOf("?") > -1 ? local.indexOf("?") : local.length);
                                var oauth2 = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfacf4a639d9e3bcc&redirect_uri=http%3a%2f%2fwww.zmiti.com%2fwxapi%2fwechatOauth2&response_type=code&scope=snsapi_base&state=' + h + '#wechat_redirect';
                                window.location.href = oauth2;
                            }
                        }
                    });
                }
                else if($location.path()==="/slider/attr"){
                    var pH=$("#fly-slider").height();
                    var headerH=$("#fly-slider .fly-slider-header").height();
                    var bottomH=$("#fly-slider .fly-bottom").height();
                    $("#fly-slider .fly-slider-pic-list").height(pH-headerH-bottomH-15);

                    var liH=$("#fly-slider .fly-slider-pic-list").find("ul li").height();
                    if((ltP.index.focusWidget.src.length+1)%2===0){
                        $("#fly-slider .fly-slider-pic-list").find("ul").height(liH*((ltP.index.focusWidget.src.length+1)/2));
                    }
                    else{
                        $("#fly-slider .fly-slider-pic-list").find("ul").height(liH*(((ltP.index.focusWidget.src.length+1)/2)+1)-35);
                    }
                    requirejs(["iscroll"], function (scroll) {
                        scroll($("#fly-slider .fly-slider-pic-list")[0], {
                            scrollbars: true,//显示滚动条
                            click: false,//关闭click事件
                            tap: true,//启用tap事件
                            //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                            interactiveScrollbars: true,//用户是否可以拖动滚动条
                            shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                        });
                    });
                }
            });

            $rootScope.$on("$routeChangeStart", function () {
            });
        }]);
        //路由
        zmitiApp.config(['$routeProvider', '$sceDelegateProvider', function ($routeProvider, $sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                // Allow same origin resource loads.
                'self',
                // Allow loading from our assets domain.  Notice the difference between * and **.
                '**'
            ]);

            $routeProvider.when("/page/animation", {
                templateUrl: "static/template/pageAnimationLibrary.html?t=" + new Date().getTime()
            }).when("/page/editBg", {
                templateUrl: "static/template/pageBackground.html?t=" + new Date().getTime()
            }).when("/page/projectSetting", {
                templateUrl: "static/template/projectsetting.html?t=" + new Date().getTime()
            }).when("/page/flip", {
                templateUrl: "static/template/flip.html?t=" + new Date().getTime()
            }).when("/audio/attr", {
                templateUrl: "static/template/editAudio.html?t=" + new Date().getTime()
            }).when("/piclibrary/attr", {
                templateUrl: "static/template/picLibrary.html?t=" + new Date().getTime()
            }).when("/image/attr", {
                templateUrl: "static/template/toolPicNav.html?t=" + new Date().getTime()
            }).when("/image/animation", {
                templateUrl: "static/template/toolAnimationNav.html?t=" + new Date().getTime()
            }).when("/text/animation", {
                templateUrl: "static/template/toolAnimationNav.html?t=" + new Date().getTime()
            }).when("/text/attr", {
                templateUrl: "static/template/toolTextNav.html?t=" + new Date().getTime()
            }).when("/page/pageorder", {
                templateUrl: "static/template/pageorder.html?t=" + new Date().getTime()
            }).when("/video/animation", {
                templateUrl: "static/template/toolAnimationNav.html"
            }).when("/video/attr", {
                templateUrl: "static/template/toolVideoNav.html"
            }).when("/radius/animation", {
                templateUrl: "static/template/toolAnimationNav.html"
            }).when("/radius/attr", {
                templateUrl: "static/template/htmlRadius.html"
            }).when("/ellipse/animation", {
                templateUrl: "static/template/toolAnimationNav.html"
            }).when("/ellipse/attr", {
                templateUrl: "static/template/htmlRadius.html"
            }).when("/rectangular/animation", {
                templateUrl: "static/template/toolAnimationNav.html"
            }).when("/rectangular/attr", {
                templateUrl: "static/template/htmlRadius.html"
            }).when("/line/animation", {
                templateUrl: "static/template/toolAnimationNav.html"
            }).when("/line/attr", {
                templateUrl: "static/template/htmlLine.html"
            }).when("/outweb/attr", {
                templateUrl: "static/template/toolPageNav.html"
            }).when("/slider/attr", {
                templateUrl: "static/template/htmlSlider.html"
            }).when("/slider/animation", {
                templateUrl: "static/template/sliderAnimation.html"
            }).when("/audio/attr", {
                templateUrl: "static/template/editAudio.html?t=" + new Date().getTime()
            }).when("/page/loading", {
                templateUrl: "static/template/loading.html?t=" + new Date().getTime()
            }).when("/video/library", {
                templateUrl: "static/template/videoLibrary.html?t=" + new Date().getTime()
            }).when("/page/release",{
                templateUrl:"static/template/release.html?t="+new Date().getTime()
            }).when("/page/preview",{
                templateUrl:"previewIndex.html?t="+new Date().getTime()
            }).otherwise({
                redirectTo: "/page"
            });
        }]);
        zmitiApp.provider("zmitiService", function () {
            return {
                $get: function () {
                    return {
                        stageWidth: window.innerWidth,
                        stageHeight: window.innerHeight,
                        viewWidth: doc.documentElement.clientWidth,
                        viewHeight: doc.documentElement.clientHeight,
                        proxyUrl:"http://115.28.28.210:8083",
                        orgId:"4ca2082da088420fb561dcd18f7481b2",
                        userId :-11,// H5Manager.getUserInfo().userID || -111,
                        token:-11,// H5Manager.getUserInfo().userToken || -111,
                        groupId:0,
                        isWX:function(){
                            var ua = window.navigator.userAgent.toLowerCase();
                            return ua.match(/MicroMessenger/i) == 'micromessenger';
                        },
                        flyContainer: $("#fly-container"),
                        getFocusPage: function (avg) {
                            switch (typeof avg) {
                                case "object":
                                    ltP.index.focusPage = avg;
                                    break;
                                case "number":
                                    ltP.index.focusPage = json[0].pages[avg];
                                    break;
                            }
                        },
                        getFocusWidget: function (avg) {

                            if (ltP.index.focusPage.widgets.length > 0) {
                                switch (typeof avg) {
                                    case "object":
                                        ltP.index.focusWidgetltP.index.focusPage = avg;
                                        break;
                                    case "number":
                                        ltP.index.focusWidget = ltP.index.focusPage.widgets[avg]
                                        break;
                                }

                            }
                        },
                        setDefault: function () {
                            $(document).on("touchmove", function (e) {
                                e.preventDefault();
                            });
                            $("html").css({fontSize: this.stageWidth / 10});
                            this.flyContainer.height(this.viewHeight - 44);

                        },
                        setTransition: function (obj, style) {
                            obj.css({ "transition": style, "-webkit-transition": style });
                            return obj;
                        },
                        transitionEnd: function () {
                            return 'onwebkittransitionend' in window ? "webkitTransitionEnd" : "transitionend"
                        },
                        getRandom: function () {
                            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                        },
                        getGuid: function () {
                            return 'lt-' + (this.getRandom() + this.getRandom() + "-" + this.getRandom() + "-" + this.getRandom() + "-" +
                                this.getRandom() + "-" + this.getRandom() + this.getRandom() + this.getRandom()).toUpperCase();
                        },
                        setFocusWidgetAttr: function (scope, index) {//当前组件的属性
                            ltP.index.focusWidgetIndex = index * 1;
                            var vals = 0;
                            scope.$apply(function () {
                                ltP.index.focusWidget = ltP.index.focusPage.widgets[index];
                            });
                            if (ltP.index.focusWidget && ltP.index.focusWidget.styles) {
                                !ltP.index.focusWidget.styles.boxShadows && (ltP.index.focusWidget.styles.boxShadows = [0, 0, '#fff', 100, 0]);
                                !ltP.index.focusWidget.styles.boxShadowDemp && (ltP.index.focusWidget.styles.boxShadowDemp = ['0', '0', '0', 'rgba(0,0,0,0)']);
                                ltP.index.focusWidget.styles.boxShadow = ltP.index.focusWidget.styles.boxShadowDemp.join(' ');
                                vals = ltP.index.focusWidget.styles.boxShadows[4];
                                !ltP.index.focusWidget.styles.opacity && (ltP.index.focusWidget.styles.opacity = 100);
                           }
                        },
                        mouseDownWidget: function (e, _this, widgetType, zmitiService, scope, $location, $compile, $http) {
                            var type = widgetType;
                            var target = e.target;
                            var $Target = $(target);
                            $(".fly-text-operator ul li").removeClass("operatorActive");
                            if ($Target.hasClass("lt-p-content")) {
                                type = "page";
                            }
                            else {
                                type = $Target.parents(".lt-widget").attr("widget-type") || $Target.attr("widget-type");
                            }
                            type === undefined && (type = "page");//如果点击到的是移动的背景图片。默认跳转到page上去。
                            (type === "singlepage") && (type = "page");
                            ltP.index.currentType = type;
                            $("#J-lt-p-screen .lt-widget .line").hide();
                            switch (type) {//当前选中的
                                case "page":
                                    e.preventDefault();
                                    if ($location.path() !== "/page/attr" && $location.path() !== "/page/animation") {
                                        $location.path("page/attr");
                                    }
                                    break;
                                case "image":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var $Target = $(e.target);
                                    if ($Target.parent().hasClass("lt-widget-image-container")) {
                                        var index = $Target.parent().attr("data-widgetindex");
                                        zmitiService.setFocusWidgetAttr(scope, index);
                                        if ($Target.parent().attr("class").indexOf("lt-drag-resize") <= -1 && !ltP.index.focusWidget.isLocked) {
                                            zmitiService.dragAndResize("", $Target.parent(), $compile, scope, $location);
                                        }
                                    }
                                    if (ltP.index.focusWidget && !ltP.index.focusWidget.isLocked) {
                                        $Target.parents('.lt-widget').find('.line').show();
                                    }
                                    ltP.index.focusOptionsItemAttr = zmitiService.focusWidgetPrevAndNextId();
                                    break;
                                case "text":
                                    e.stopPropagation();
                                    e.preventDefault();
                                    var $Target = $(e.target);
                                    if ($Target.parents(".lt-widget").hasClass('lt-widget-text-container') || $Target.hasClass('lt-widget-text-container')) {
                                        var index = $Target.index('.lt-widget') < 0 ? $Target.parents(".lt-widget").attr('data-widgetindex') : $Target.attr('data-widgetindex');
                                        zmitiService.setFocusWidgetAttr(scope, index);
                                        if ($Target.parent().attr("class").indexOf("lt-drag-resize") <= -1 && !ltP.index.focusWidget.isLocked) {
                                            zmitiService.dragAndResize("", $Target.parent(), $compile, scope, $location);
                                        }
                                    }

                                    if (ltP.index.focusWidget && !ltP.index.focusWidget.isLocked) {
                                        $Target.parents('.lt-widget').find('.line').show();
                                    }

                                    ltP.index.focusOptionsItemAttr = zmitiService.focusWidgetPrevAndNextId();

                                    break;
                                case "video":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if ($Target.parents(".lt-widget").hasClass("lt-widget-video-container")) {
                                        var index = $Target.index('.lt-widget') < 0 ? $Target.parents(".lt-widget").attr('data-widgetindex') : $Target.attr('data-widgetindex');
                                        zmitiService.setFocusWidgetAttr(scope, index);
                                        var indexOf = $Target.parents('.lt-widget').hasClass("lt-drag-resize") || $Target.hasClass("lt-drag-resize");
                                        if (!indexOf && !ltP.index.focusWidget.isLocked) {
                                            zmitiService.dragAndResize("", $Target.parent(), $compile, scope, $location);
                                        }
                                    }
                                    if (ltP.index.focusWidget && !ltP.index.focusWidget.isLocked) {
                                        $Target.parents('.lt-widget').find('.line').show();
                                    }
                                    ltP.index.focusOptionsItemAttr = zmitiService.focusWidgetPrevAndNextId();
                                    break;
                                case "audio":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var $Target = $(e.target);
                                    if ($Target.parents(".lt-widget").hasClass("lt-widget-audio-container")) {
                                        var index = $Target.parents(".lt-widget").attr("data-widgetindex");
                                        zmitiService.setFocusWidgetAttr(scope, index);
                                        if ($Target.parents(".lt-widget").attr("class").indexOf("lt-drag-resize") <= -1 && !ltP.index.focusWidget.isLocked) {
                                            zmitiService.dragAndResize("", $Target.parents(".lt-widget"), $compile, scope, $location);
                                        }
                                        if (!ltP.index.focusWidget.isLocked) {
                                            $Target.parents(".lt-widget").find('.line').show();
                                        }
                                    }
                                    ltP.index.focusOptionsItemAttr = zmitiService.focusWidgetPrevAndNextId();
                                    break;
                                case "slider":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    var $Target = $(e.target);
                                    if ($Target.parents('.lt-widget').hasClass("lt-widget-slider-container")) {
                                        var index = $Target.parents('.lt-widget').attr("data-widgetindex");
                                        zmitiService.setFocusWidgetAttr(scope, index);
                                        if (!$Target.parents('.lt-widget').hasClass("lt-drag-resize") && !ltP.index.focusWidget.isLocked) {
                                            zmitiService.dragAndResize("", $Target.parents('.lt-widget'), $compile, scope, $location);
                                        }
                                        if (!ltP.index.focusWidget.isLocked) {
                                            $Target.parent().find('.line').show();
                                        }
                                    }
                                    ltP.index.focusOptionsItemAttr = zmitiService.focusWidgetPrevAndNextId();
                                    break;
                            }
                            if (type !== "page" && type !== "singlepage") {//正常的组件
                                var rotate = 0;
                                ltP.index.focusWidget && ltP.index.focusWidget.styles && (rotate = ltP.index.focusWidget.styles.rotate);
                                $Target.parents(".lt-widget").find("aside").css({ "-webkit-transform": "rotate(" + rotate + "deg)", "transform": "rotate(" + rotate + "deg)" });
                                scope.$apply(function () {
                                    ltP.index.$scope.isShowOparatorBar = true; //是否显示文本编辑操作对话框
                                    ltP.index.focusWidget && (ltP.index.$scope["isShow" + ltP.index.focusWidget.type.charAt(0).toUpperCase() + ltP.index.focusWidget.type.substring(1) + "OparatorBar"] = true);
                                    if (ltP.index.focusWidget) {
                                        ltP.index.OparatorBarStyles = {
                                            left: ltP.index.focusWidget.styles.left,
                                            top: parseFloat(ltP.index.focusWidget.styles.top) + parseFloat(ltP.index.focusWidget.styles.height) + 0.1 + "rem"
                                        };
                                        var w = $(".fly-text-operator").width();
                                        var h = $(".fly-text-operator").height();
                                        var l = $("#" + ltP.index.focusWidget.id).parents(".lt-widget").offset().left;
                                        var pw = $("#fly-container").width();
                                        var ph = $("#fly-container").height();
                                        if (w + l > pw) {
                                            ltP.index.OparatorBarStyles.left = (pw - w) / 32 + "rem";
                                        }
                                        if (parseFloat(ltP.index.OparatorBarStyles.top) > ph / 32) {
                                            ltP.index.OparatorBarStyles.top = parseFloat(ltP.index.focusWidget.styles.top) - 1.2 + "rem";
                                        }
                                    }
                                });
                            }
                            else {//page
                                scope.$apply(function () {
                                    ltP.index.$scope.isShowOparatorBar = false; //是否显示文本编辑操作对话框
                                });
                            }
                            if (type !== "outweb") {
                                $("#J-lt-p-screen .lt-widget").find("textarea").hide();
                                ltP.index.focusWidget && ltP.index.focusWidget.isFocus && (ltP.index.focusWidget.isFocus = false);
                            }
                        },
                        focusWidgetPrevAndNextId: function () {
                            var id = ltP.index.focusWidget ? ltP.index.focusWidget.id : " "
                            var items = [
                                { widgetId: id, currentWidgetId: id, animationId: " ", name: "页面加载完成" }
                            ];
                            for (var i = 0, len = ltP.index.focusPage.widgets.length; i < len; i++) {
                                var weigetId = ltP.index.focusPage.widgets[i].id;//组件id
                                var weigetName = ltP.index.focusPage.widgets[i].name;//组件name
                                for (var j = 0, lens = ltP.index.focusPage.widgets[i].animation.length; j < lens; j++) {
                                    if (ltP.index.focusPage.widgets[i].animation[j].type === "animation") {
                                        var animationId = ltP.index.focusPage.widgets[i].animation[j].id;
                                        var animationName = ltP.index.focusPage.widgets[i].animation[j].txtName;
                                        items.push({ widgetId: weigetId, currentWidgetId: id, animationId: animationId, name: weigetName + "——" + animationName });
                                    }
                                }
                            }
                            return items;
                        },
                        getWidgetZIndex: function () {
                            var zIndex = [];
                            for (var i = 0, len = ltP.index.focusPage.widgets.length; i < len; i++) {
                                ltP.index.focusPage.widgets[i].styles && zIndex.push(ltP.index.focusPage.widgets[i].styles.zIndex);
                            }
                            return zIndex;
                        },
                        dragAndResize: function (str, obj, compile, scope, $location) {
                            if (str === "destroy") {
                                obj.dragAndResize(str);
                            }
                            else {
                                obj.dragAndResize(str, {
                                    positionFn: {//改变位置
                                        start: function (e) {
                                            this.index = $(e.target).parents(".lt-widget").size() > 0 ? $(e.target).parents(".lt-widget").attr("data-widgetindex") : $(e.target).attr("data-widgetindex");
                                            this.parent = $("#J-lt-p-screen-content");
                                            this.startX = e.clientX;
                                            this.startY = e.clientY;
                                        },
                                        move: function (e, ang) {
                                            if (!ltP.index.focusPage.widgets[this.index]) {
                                                return;
                                            }
                                            var $Target = $(e.target).parents(".lt-widget").size() > 0 ? $(e.target).parents(".lt-widget") : $(e.target);
                                            ltP.index.focusPage.widgets[this.index].styles.left = $Target.offset() && (($Target.offset().left - this.parent.offset().left) / ltP.index.fontSize + "rem");
                                            ltP.index.focusPage.widgets[this.index].styles.top = $Target.offset() && (($Target.offset().top - this.parent.offset().top) / ltP.index.fontSize + "rem");
                                        },
                                        end: function (e) {
                                            if (Math.abs(this.startX - e.clientX) > 2 || Math.abs(this.startY - e.clientY) > 2) {
                                                ltP.index.history.add(scope.$parent);
                                            }
                                        }
                                    },
                                    widthFn: {//改变宽
                                        start: function (e) {
                                            this.index = $(e.target).parents(".lt-widget").attr("data-widgetindex");
                                            this.startX = e.clientX;
                                            this.startY = e.clientY;
                                        },
                                        move: function (e) {
                                            var index = this.index;
                                            scope.$apply(function () {
                                                if (ltP.index.focusPage.widgets[index].styles.height === "0.1rem" && ltP.index.focusPage.widgets[index].type === "line") {
                                                    ltP.index.focusPage.widgets[index].styles.height === "0.875rem";
                                                }
                                            });
                                            ltP.index.focusPage.widgets[this.index].styles.width = $(e.target).parents(".lt-widget").width() / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.left = $(e.target).parents(".lt-widget").position().left / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.height = $(e.target).parents(".lt-widget").height() / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.top = $(e.target).parents(".lt-widget").position().top / ltP.index.fontSize + "rem";
                                            if (ltP.index.focusPage.widgets[this.index].type === "line") {
                                                ltP.index.focusPage.widgets[this.index].styles.points = "0," + $(e.target).parents(".lt-widget").height() / 2 + ',' + $(e.target).parents(".lt-widget").width() + ',' + $(e.target).parents(".lt-widget").height() / 2;
                                            }
                                            return scope.currentKeyCode === 17 || ltP.index.focusWidget.radio;
                                        },
                                        end: function (e) {
                                            if (Math.abs(this.startX - e.clientX) > 2 || Math.abs(this.startY - e.clientY) > 2) {
                                                ltP.index.history.add(scope.$parent);
                                            }
                                        }
                                    },
                                    heightFn: {//改变高
                                        start: function (e) {
                                            //this.index = $(e.target).parents(".lt-widget").index('.lt-widget');
                                            this.index = $(e.target).parents(".lt-widget").attr("data-widgetindex");
                                            this.startX = e.clientX;
                                            this.startY = e.clientY;
                                            return ltP.index.focusPage.height ? parseInt(ltP.index.focusPage.height) : 568 - 64;
                                        },
                                        move: function (e) {
                                            ltP.index.focusPage.widgets[this.index].styles.height = $(e.target).parents(".lt-widget").height() / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.width = $(e.target).parents(".lt-widget").width() / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.top = $(e.target).parents(".lt-widget").position().top / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.left = $(e.target).parents(".lt-widget").position().left / ltP.index.fontSize + "rem";
                                            return scope.currentKeyCode === 17 || ltP.index.focusWidget.radio;

                                        },
                                        end: function (e) {
                                            if (Math.abs(this.startX - e.clientX) > 2 || Math.abs(this.startY - e.clientY) > 2) {
                                                ltP.index.history.add(scope.$parent);
                                            }
                                        }
                                    },
                                    sizeFn: {//同时改变高宽
                                        start: function (e) {
                                            //this.index = $(e.target).parents(".lt-widget").index('.lt-widget');
                                            this.index = $(e.target).parents(".lt-widget").attr("data-widgetindex");
                                            this.startX = e.clientX;
                                            this.startY = e.clientY;
                                        },
                                        move: function (e) {
                                            ltP.index.focusPage.widgets[this.index].styles.width = $(e.target).parents(".lt-widget").width() / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.height = $(e.target).parents(".lt-widget").height() / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.left = $(e.target).parents(".lt-widget").position().left / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.top = $(e.target).parents(".lt-widget").position().top / ltP.index.fontSize + "rem";
                                            return scope.currentKeyCode === 17 || ltP.index.focusWidget.radio;
                                        },
                                        end: function (e) {
                                            if (Math.abs(this.startX - e.clientX) > 2 || Math.abs(this.startY - e.clientY) > 2) {
                                                ltP.index.history.add(scope.$parent);
                                            }
                                        }
                                    },
                                    rotateFn: {
                                        start: function (e) {
                                            //this.index = $(e.target).parents(".lt-widget").index('.lt-widget');
                                            this.index = $(e.target).parents(".lt-widget").attr("data-widgetindex");
                                            this.startX = e.clientX;
                                            this.startY = e.clientY;
                                        },
                                        move: function (e, ang) {
                                            ltP.index.focusPage.widgets[this.index].styles.rotate = ang;
                                            ltP.index.focusPage.widgets[this.index].styles.width = $(e.target).parents(".lt-widget").width() / ltP.index.fontSize + "rem";
                                            if (ltP.index.focusPage.widgets[this.index].type !== "line") {
                                                ltP.index.focusPage.widgets[this.index].styles.height = $(e.target).parents(".lt-widget").height() / ltP.index.fontSize + "rem";
                                            }
                                            ltP.index.focusPage.widgets[this.index].styles.left = $(e.target).parents(".lt-widget").position().left / ltP.index.fontSize + "rem";
                                            ltP.index.focusPage.widgets[this.index].styles.top = $(e.target).parents(".lt-widget").position().top / ltP.index.fontSize + "rem";

                                        },
                                        end: function (e) {
                                            if (Math.abs(this.startX - e.clientX) > 2 || Math.abs(this.startY - e.clientY) > 2) {
                                                ltP.index.history.add(scope.$parent);
                                            }
                                        }
                                    },
                                    pubMove: function (s) {
                                        //s.css({ opacity: .35 });
                                    },
                                    pubEnd: function (s) {
                                        //s.css({ opacity: 1 });
                                        scope.$apply(function () {
                                            ltP.index.focusWidget = ltP.index.focusWidget;
                                        });
                                    }
                                }, compile, scope, $location);
                            }

                        },
                        delLayer: function ($location, focusWidget) {//删除组件
                            var index = 0;
                            var weigetId = focusWidget.id;//被删除组件id
                            ltP.index.$scope.$apply(function () {
                                ltP.index.focusPage.widgets = $.grep(ltP.index.focusPage.widgets, function (value, i) {
                                    if (value.id !== weigetId) {
                                        value.widgetIndex = index;
                                        var varlueAnimations = value.animation;
                                        angular.forEach(varlueAnimations, function (item, n) {//动画
                                            if (item.requireObj.widgetId === weigetId) {
                                                item.requireObj = {
                                                    "animationId": " ",//动画id
                                                    "currentWidgetId": value.id,//当前组件id
                                                    "name": "页面加载完成",//动画名称
                                                    "widgetId": value.id//依赖组件id
                                                };
                                                item.dempAnimationId = " ";
                                            }
                                        });
                                        index++;
                                    }
                                    return value.id !== focusWidget.id;
                                });
                                ltP.index.focusWidget = null;
                                ltP.index.$scope.isShowOparatorBar = false;
                            });
                            $location.path("page");
                        },
                        loadingStart: function () {

                            //AlertManager.alert({message:"1",buttons:[{"cancel":"取消"}]})

                            $("#fly-ajax-loading").css({opacity:1,zIndex:999999,animationName:"bouncedelay","webkitAnimationName":"bouncedelay"});

                        },
                        loadingEnd:function(){

                            $("#fly-ajax-loading").css({opacity:0,zIndex:-110,animationName:"","webkitAnimationName":""})

                        },
                        loadingCateData:function(parentId,type){


                            type === undefined && (type="userId");

                            H5Manager.log("request starting...");
                            var self= this;
                            //self.loadingStart();


                            ltP.index.$scope.$apply(function(){
                                ltP.index.$scope.typeItemList=[];
                                parentId === 0 && (ltP.index.$scope.typeTitle=[]);
                            })



                            var params = {parentId:parentId,token:self.token};
                            params[type] = self[type];
                            PDMIRequestAgent.getRequest(self.proxyUrl+ "/h5api/res/usergroup/search",params,function(response){
                                setTimeout(function(){
                                    if(parentId === 0 ){
                                        response.result.forEach(function(item){

                                            ltP.index.$scope.$apply(function(){
                                                ltP.index.$scope.typeTitle.push({name:item.groupName,id:item.groupId});
                                            });

                                            item.childList.forEach(function(child){
                                                ltP.index.$scope.$apply(function(){
                                                    ltP.index.$scope.typeItemList.push({name:child.groupName,id:child.groupId});
                                                });
                                            });


                                        });

                                       // AlertManager.alert({message:ltP.index.$scope.typeTitle.length,buttons:[{"cancel":"取消"}]})
                                    }
                                    else{
                                        response.result.forEach(function(child){
                                            ltP.index.$scope.$apply(function(){
                                                ltP.index.$scope.typeItemList.push({name:child.groupName,id:child.groupId});
                                            });
                                        });
                                    }

                                    //self.loadingEnd();
                                    ltP.index.$scope.picList.scroll1.refresh();
                                },0)

                            },function(error){
                                H5Manager.log("失败");
                                AlertManager && AlertManager.alert({message:error.info,buttons:[{"cancel":"取消"}]});
                                !AlertManager && alert(error.info);
                            });
                        },
                        loadingImgData:function(type,resType,no,size,groupId,reload,orgId){

                            ltP.index.focusSource = {
                                resType:3,//下载的资源类别:1.作品2.模板3.图片4.音乐5.视频6.二维码
                                sourceId:0,//资源ID
                                type:1//库类别:1.个人库2.机构库3.公共库
                            };

                            var self = this;

                            self.loadingStart();


                            if(reload){
                                ltP.index.$scope.$apply(function(){
                                    ltP.index.$scope.picList=[]
                                })
                            }

                            var params={userId:self.userId,resType:resType,no:no,size:size,type:type,token:self.token};

                            groupId && (params.groupId =  groupId);
                            orgId && (params.orgId =  orgId);

                            PDMIRequestAgent.getRequest(self.proxyUrl+ "/h5api/page/image/search",params,function(response){
                                setTimeout(function(){
                                    response.result.content.forEach(function(item){
                                        ltP.index.$scope.$apply(function(){
                                            ltP.index.$scope.picList.push({src:item.src,id:item.id,type:item.type});
                                        });
                                    });

                                    if(resType===0){
                                        self.setPicLibrary();
                                    }
                                    else if(resType===2){
                                        self.setVideoLibrary();
                                    }
                                    self.loadingEnd();
                                    ltP.index.$scope.picList.scroll.refresh();
                                },100)


                            },function(error){
                                H5Manager.log("失败")
                                AlertManager && AlertManager.alert({message:error.info,buttons:[{"cancel":"取消"}]});
                                !AlertManager && alert(error.info);
                            })
                        },
                        setPicLibrary: function () {

                            var self = this;
                            var ulH = $("#fly-pic-library-container .fly-type-items").find("ul li").height() * ltP.index.$scope.typeItemList.length / 6 + 15;
                            $("#fly-pic-list .fly-type-items").find("ul").height(ulH);

                            var headerLiW = $("#fly-pic-list-items").find("ul li").width();
                            $("#fly-pic-list-items").find("ul").width(headerLiW * ltP.index.$scope.typeTitle.length + 2);

                            var pH = $("#fly-pic-library-container").height();
                            var headerH = $("#fly-pic-library-container .fly-pic-btn").height();
                            var bottomH = $("#fly-pic-library-container .fly-bottom").height();
                            var typeH = $("#fly-pic-library-container .fly-pic-type").height();
                            $("#fly-pic-list .fly-list-items").height(pH - headerH - bottomH - ulH - typeH - 3);

                            var listLiH = $("#fly-pic-list .fly-list-items").find("ul li").height();
                            if (ltP.index.$scope.picList.length % 3 === 0) {
                                $("#fly-pic-list .fly-list-items").find("ul").height(listLiH * (ltP.index.$scope.picList.length / 3));
                            }
                            else {
                                $("#fly-pic-list .fly-list-items").find("ul").height(listLiH * (ltP.index.$scope.picList.length / 3 + 1));
                            }
                            requirejs(["iscroll"], function (iscroll) {

                                /**
                                 * 滚动翻页 （自定义实现此方法）
                                 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
                                 */
                                function pullUpAction() {
                                    setTimeout(function () {	// <-- Simulate network congestion, remove setTimeout from production!

                                        //self.loadingImgData()

                                        ltP.index.$scope.picList.scroll.refresh();		// 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
                                    }, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
                                }

                                var pullUpEl = document.getElementById('pullUp'),
                                    pullUpOffset = pullUpEl.offsetHeight;


                                ltP.index.$scope.picList.scroll = iscroll($("#fly-pic-list .fly-list-items")[0], {
                                    scrollbars: true,//显示滚动条
                                    click: false,//关闭click事件
                                    tap: true,//启用tap事件
                                    interactiveScrollbars: true,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，

                                });


                                ltP.index.$scope.picList.scroll.on("refresh", function () {
                                    if (pullUpEl.className.match('loading')) {
                                        pullUpEl.className = '';
                                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                                    }
                                })
                                ltP.index.$scope.picList.scroll.on("scroll", function () {
                                    if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                                        pullUpEl.className = 'flip';
                                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                                        this.maxScrollY = this.maxScrollY;
                                    } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                                        pullUpEl.className = '';
                                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                                        this.maxScrollY = pullUpOffset;
                                    }

                                })
                                ltP.index.$scope.picList.scroll.on("scrollEnd", function () {
                                    if (pullUpEl.className.match('flip')) {
                                        pullUpEl.className = 'loading';
                                        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                                        pullUpAction();	// Execute custom function (ajax call?)
                                    }
                                })


                                ltP.index.$scope.picList.scroll1 = iscroll($("#fly-pic-list .fly-pic-list-items")[0], {
                                    scrollbars: false,//显示滚动条
                                    click: true,//关闭click事件
                                    tap: true,//启用tap事件
                                    scrollX: true,
                                    scrollY: false,
                                    mouseWheel: true,
                                    interactiveScrollbars: true,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                });
                                var index = 0;
                                $("#next").off("tap").on("tap", function () {
                                    if (index < ltP.index.$scope.typeTitle.length) {
                                        index += 5;
                                        ltP.index.$scope.picList.scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(' + index + ')'), null, null, true);
                                    }
                                    else {
                                        ltP.index.$scope.picList.scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(' + ltP.index.$scope.typeTitle.length + ')'), null, null, true);
                                        index = ltP.index.$scope.typeTitle.length;
                                    }
                                    return !1;
                                });
                                $("#prev").off("tap").on("tap", function () {
                                    if (index >= 0 && index != 5) {
                                        index -= 5;
                                        ltP.index.$scope.picList.scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(' + index + ')'), null, null, true);
                                    }
                                    else {
                                        ltP.index.$scope.picList.scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(1)'), null, null, true);
                                        index = 5;
                                    }
                                    return !1;
                                });
                            });
                        },
                        downloadSource:function(focusSoruce,fn){
                            var resType = focusSoruce.resType,
                                type = focusSoruce.type,
                                sourceName = focusSoruce.sourceName,
                                sourceID = focusSoruce.sourceId;
                            var self = this;
                            H5Manager.downloadRes(self.proxyUrl+"/h5api/page/source/download/"+sourceID+"/"+type+"/"+self.token,null,ltP.index.global.APP.appID,sourceName,fileName,function(response){
                                fn && fn(response.path);
                            },function(error){
                            });

                        },
                        setVideoLibrary:function(){
                            var ulH = $("#fly-video-library-container .fly-type-items").find("ul li").height() * ltP.index.$scope.typeItemList.length / 6 + 15;
                            $("#fly-pic-list .fly-type-items").find("ul").height(ulH);

                            var headerLiW=$("#fly-pic-list-items").find("ul li").width();
                            $("#fly-pic-list-items").find("ul").width(headerLiW*ltP.index.$scope.typeTitle.length+2);


                            var pH = $("#fly-video-library-container").height();
                            var headerH = $("#fly-video-library-container .fly-pic-btn").height();
                            var bottomH = $("#fly-video-library-container .fly-bottom").height();
                            var typeH = $("#fly-video-library-container .fly-pic-type").height();
                            $("#fly-pic-list .fly-list-items").height(pH - headerH - bottomH - ulH - typeH - 3);
                            var listLiH=$("#fly-pic-list .fly-list-items").find("ul li").height();

                            if(ltP.index.$scope.picList.length % 3===0){
                                $("#fly-pic-list .fly-list-items").find("ul").height(listLiH * (ltP.index.$scope.picList.length / 3));
                            }
                            else{
                                $("#fly-pic-list .fly-list-items").find("ul").height(listLiH * (ltP.index.$scope.picList.length / 3 +1));
                            }

                            requirejs(["iscroll"], function (iscroll) {
                                ltP.index.$scope.picList.scroll = iscroll($("#fly-pic-list .fly-list-items")[0], {
                                    scrollbars: true,//显示滚动条
                                    click: false,//关闭click事件
                                    tap: true,//启用tap事件
                                    interactiveScrollbars: true,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                });
                                ltP.index.$scope.picList.scroll1 = iscroll($("#fly-pic-list .fly-pic-list-items")[0], {
                                    scrollbars: false,//显示滚动条
                                    click: true,//关闭click事件
                                    tap: true,//启用tap事件
                                    scrollX: true,
                                    scrollY: false,
                                    mouseWheel: true,
                                    interactiveScrollbars: true,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                });
                                var index=0;
                                $("#next").off("tap").on("tap",function() {
                                    if (index < ltP.index.$scope.videoTypeTitle.length) {
                                        index += 5;
                                        scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(' + index + ')'), null, null, true);
                                    }
                                    else{
                                        scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(' + ltP.index.$scope.videoTypeTitle.length + ')'), null, null, true);
                                        index=ltP.index.$scope.videoTypeTitle.length;
                                    }
                                    return !1;
                                });
                                $("#prev").off("tap").on("tap", function () {
                                    if (index >= 0 && index!=5) {
                                        index -= 5;
                                        scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(' + index + ')'), null, null, true);
                                    }
                                    else {
                                        scroll1.scrollToElement(document.querySelector('#fly-pic-list li:nth-child(1)'), null, null, true);
                                        index = 5;
                                    }
                                    return !1;
                                });
                            });
                        },
                        setProjectSetting:function() {
                            if (ltP.index.$scope.projectAttr) {
                                var liH = $("#fly-project-setting .edit").find("ul li").height();
                                var count = (ltP.index.$scope.projectAttr.length + 2) % 5 === 0 ? ((ltP.index.$scope.projectAttr.length + 2)) / 5 + 2 : ((ltP.index.$scope.projectAttr.length + 2) / 5) + 3;
                                $("#fly-project-setting .edit").find("ul").height(liH * (count));
                                requirejs(["iscroll"], function (scroll) {
                                    scroll($("#fly-project-setting .edit")[0], {
                                        scrollbars: true,//显示滚动条
                                        click: false,//关闭click事件
                                        tap: true,//启用tap事件
                                        //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                                        interactiveScrollbars: true,//用户是否可以拖动滚动条
                                        shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                    });
                                });
                            }
                        },
                        videoLibrayList:function(path){
                            ltP.index.$scope.goBackPath=path;
                            ltP.index.$scope.isShowDialog = true;
                            ltP.index.$location.path("/video/library");
                            ltP.index.$scope.typeItemList = [];
                            ltP.index.$scope.picList = [];
                            ltP.index.$scope.typeTitle = [];
                            this.loadingImgData(1,2,1,12);

                            this.loadingCateData(0);
                        },
                        picLibraryList:function(path){
                            ltP.index.$scope.goBackPath=path;
                            ltP.index.$scope.isShowDialog = true;
                            ltP.index.$location.path("/piclibrary/attr");
                            ltP.index.$scope.typeItemList = [];
                            ltP.index.$scope.picList = [];
                            ltP.index.$scope.typeTitle = [];

                            this.loadingImgData(1,0,1,12);

                            this.loadingCateData(0);



                        },
                        cancel:function(){
                            $("#fly-pic-library-container .fly-list-items img[class='active']").removeClass("active");
                            return !1;
                        },
                        setSliderChangeOne:function(){
                            var _this = this;
                            ltP.index.focusSource.resType = 3;
                            var img = $("#fly-pic-library-container .fly-list-items img[class='active']");
                            ltP.index.focusSource.sourceId = img.data("id");
                            ltP.index.focusSource.type = img.data("type");
                            ltP.index.focusSource.sourceName = img.attr("src").split("/")[img.attr("src").split("/").length - 1];
                            _this.downloadSource(ltP.index.focusSource,function(path){
                                ltP.index.$scope.$apply(function () {
                                    var fileName = ltP.index.focusWidget.src[ltP.index.$scope.sliderIndex].src.split("/")[ltP.index.focusWidget.src[ltP.index.$scope.sliderIndex].src.split("/").length - 1];
                                    ltP.index.focusWidget.src[ltP.index.$scope.sliderIndex].src = ltP.index.focusWidget.src[ltP.index.$scope.sliderIndex].src.replace(fileName, path);
                                    ltP.index.zmitiService.goBack();
                                });
                            });
                            ltP.index.$scope.sliderIndex="";
                            return !1;
                        },
                        setVideoPic:function(){
                            var _this = this;
                            ltP.index.focusSource.resType = 3;
                            var img = $("#fly-pic-library-container .fly-list-items img[class='active']");
                            ltP.index.focusSource.sourceId = img.data("id");
                            ltP.index.focusSource.type = img.data("type");
                            ltP.index.focusSource.sourceName = img.attr("src").split("/")[img.attr("src").split("/").length - 1];
                            _this.downloadSource(ltP.index.focusSource,function(path){
                                ltP.index.$scope.$apply(function () {
                                    var fileName = ltP.index.focusWidget.poster.split("/")[ltP.index.focusWidget.poster.split("/").length - 1];
                                    ltP.index.focusWidget.poster = ltP.index.focusWidget.poster.replace(fileName, path);
                                    ltP.index.zmitiService.goBack();
                                });
                            });
                            return !1;
                        },
                        setImageSrc:function() {
                            var _this = this;
                            ltP.index.focusSource.resType = 3;
                            var img = $("#fly-pic-library-container .fly-list-items img[class='active']");
                            ltP.index.focusSource.sourceId = img.data("id");
                            ltP.index.focusSource.type = img.data("type");
                            ltP.index.focusSource.sourceName = img.attr("src").split("/")[img.attr("src").split("/").length - 1];
                            _this.downloadSource(ltP.index.focusSource,function(path){
                                ltP.index.$scope.$apply(function () {
                                    var fileName = ltP.index.focusWidget.src.split("/")[ltP.index.focusWidget.src.split("/").length - 1];
                                    ltP.index.focusWidget.src = ltP.index.focusWidget.src.replace(fileName, path);
                                    ltP.index.zmitiService.goBack();
                                });
                            });
                            return !1;
                        },
                        setSliderBatch:function(){
                            var _this = this;
                            ltP.index.focusSource.resType = 3;
                            var src=$("#fly-pic-library-container .fly-list-items img[class='active']");
                            var len=6-ltP.index.focusWidget.src.length;
                            var indexs=ltP.index.focusWidget.src.length-1;
                            if(src.length<=len) {
                                ltP.index.$scope.$apply(function () {
                                    $.each(src, function (i, v) {
                                        ltP.index.focusSource.sourceId = $(v).data("id");
                                        ltP.index.focusSource.type = $(v).data("type");
                                        ltP.index.focusSource.sourceName = $(v).attr("src").split("/")[$(v).attr("src").split("/").length - 1];
                                        _this.downloadSource(ltP.index.focusSource,function(path){
                                            ltP.index.$scope.$apply(function () {
                                                ltP.index.focusWidget.src.push({
                                                    id: indexs++,
                                                    index: indexs++,
                                                    src:path
                                                });
                                            });
                                        });
                                    });
                                    ltP.index.zmitiService.goBack();
                                });
                                ltP.index.$scope.batchChangeSlider=false;
                            }
                            else {
                                AlertManager.alert({'message':"该幻灯片最多还只能上传"+len+"张图片",'title':'提示','buttons':[{'cancel':'取消'}]});
                            }
                            return !1;
                        },
                        setPageBG:function(){
                            var _this = this;
                            ltP.index.focusSource.resType = 3;
                            var img = $("#fly-pic-library-container .fly-list-items img[class='active']");
                            ltP.index.focusSource.sourceId = img.data("id");
                            ltP.index.focusSource.type = img.data("type");
                            ltP.index.focusSource.sourceName = img.attr("src").split("/")[img.attr("src").split("/").length - 1];
                            _this.downloadSource(ltP.index.focusSource,function(path){
                                ltP.index.$scope.$apply(function () {
                                    var fileName = ltP.index.focusPage.styles['background-image'].split("/")[ltP.index.focusPage.styles['background-image'].split("/").length - 1];
                                    ltP.index.focusPage.styles['background-image'] = ltP.index.focusPage.styles['background-image'].replace(fileName, path);
                                    ltP.index.zmitiService.goBack();
                                });
                            });
                            return !1;
                        },
                        goBack:function(){
                            ltP.index.$scope.batchChangeSlider = false;
                            if(!ltP.index.$scope.isShowDialog){
                                H5Manager.deallocWebView();
                            }
                            else{
                                if(ltP.index.$scope.editType){
                                    ltP.index.$location.path(ltP.index.$scope.goBackPath);
                                    ltP.index.$scope.editType="";
                                    ltP.index.$scope.goBackPath="/page/preview";
                                }
                                else if (ltP.index.$scope.goBackPath===ltP.index.$location.path()) {
                                    ltP.index.$scope.isShowDialog = false;
                                    ltP.index.$location.path("");
                                    ltP.index.$scope.goBackPath = "";

                                }
                                else if (ltP.index.$scope.goBackPath) {
                                    ltP.index.$location.path(ltP.index.$scope.goBackPath);
                                    ltP.index.$scope.goBackPath = "";
                                }
                                else {
                                    ltP.index.$scope.isShowDialog = false;
                                    ltP.index.focusWidget.text !== undefined && $("#fly-" + ltP.index.focusWidget.id).size() > 0 && (ltP.index.focusWidget.text = $("#fly-" + ltP.index.focusWidget.id).text());
                                    ltP.index.$location.path("");
                                }
                            }
                        },
                        setMusic:function(type){
                            this.loadingStart();

                            var self=this;

                            type === undefined && (type = "userId");

                            ltP.index.$scope.$apply(function(){
                                ltP.index.$scope.audioList = [];
                            })
                            ///alert(H5Manager.getUserInfo().userID)
                            var params = {token:this.token};
                            if( this[type]===-111 ){
                                AlertManager.alert({'message':"获取"+type+"的值出现异常,程序终止...",'title':'提示','buttons':[{'cancel':'取消'}]});
                                return;
                            }
                            params[type] = this[type];
                            PDMIRequestAgent.getRequest(this.proxyUrl+ "/h5api/page/music/search",params,function(response){
                                response.result.forEach(function(item){
                                    ltP.index.$scope.$apply(function(){
                                        ltP.index.$scope.audioList.push({
                                            name :item.name,
                                            src:item.src
                                        });

                                    });
                                  });
                                // AlertManager.alert({message:ltP.index.$scope.audioList.length,buttons:[{"cancel":"取消"}]})
                                setTimeout(function(){
                                    self.loadingEnd();
                                    ltP.index.$scope.audioList.scroll.refresh();
                                },1000)

                            },function(error){
                                AlertManager && AlertManager.alert({message:error.info,buttons:[{"cancel":"取消"}]});
                               !AlertManager && alert(error.info);
                            })

                            requirejs(["iscroll"], function (iscroll) {
                                ltP.index.$scope.audioList.scroll  = iscroll($("#fly-audio-list")[0], {
                                    scrollbars: false,//显示滚动条
                                    click: false,//关闭click事件
                                    tap: true,//启用tap事件
                                    interactiveScrollbars: false,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                });
                            });


                        },
                        setEditLoading:function() {
                            var _this = this;
                            ltP.index.focusSource.resType = 3;
                            var img = $("#fly-pic-library-container .fly-list-items img[class='active']");
                            ltP.index.focusSource.sourceId = img.data("id");
                            ltP.index.focusSource.type = img.data("type");
                            ltP.index.focusSource.sourceName = img.attr("src").split("/")[img.attr("src").split("/").length - 1];
                            _this.downloadSource(ltP.index.focusSource,function(path){
                                ltP.index.$scope.$apply(function () {
                                    if (ltP.index.$scope.editType === "loadingBg") {
                                        ltP.index.global.APP.pubSource.loadingBg = path;
                                    }
                                    else if (ltP.index.$scope.editType === "loadingSrc") {
                                        ltP.index.global.APP.pubSource.loadingSrc = path;
                                    }
                                    ltP.index.zmitiService.goBack();
                                });
                            });
                            return !1;
                        }
                    }
                }
            }
        });
        zmitiApp.controller("zmitiWapController", ["$scope", "$location","$window", "zmitiService", function ($scope, $location,$window, zmitiService) {
            $scope.ltP = window.ltP;
            ltP.index.focusWidgetIndex = 0;
            $scope.isShowDialog = false;//
            $scope.ltP.index.fontSize = zmitiService.viewWidth/10;
            $scope.isShowOparatorBar = false;
            ltP.index.allOparaterItems = {
                text: ["编辑", "删除"],
                artText:["编辑", "转图片", "删除"],
                artImage:["转文本","删除"],
                image: ["编辑", "删除"],
                video: ["替换", "删除"],
                audio: ["替换", "删除"],
                slider:["编辑","删除"]
            };
            $scope.redirectTo = function (path) {
                ltP.index.$scope.isShowDialog = true;
                $location.path(path);
                return !1;
            }
            $scope.ChangePageBackground = function () {
                ltP.index.$scope.isShowDialog = true;
                $location.path("/page/editBg");
                return !1;
            };

            $scope.ShowPic = function () {
                if(!$("#fly-image-container .fly-image-menu").hasClass("activeShow")) {
                    $("#fly-image-container .fly-image-menu").addClass("activeShow");
                }
                $("#fly-image-container").off("tap").on("tap",function(e){
                    $("#fly-image-container .fly-image-menu").removeClass("activeShow");
                });
                return !1;
            };
            $scope.changePicSrc = function (path) {
                zmitiService.picLibraryList(path);
                return !1;
            };
            $scope.editLoading=function(path,editType){
                zmitiService.picLibraryList(path);
                ltP.index.$scope.editType=editType;
                return !1;
            };

            $scope.changeVideo=function(path){
                zmitiService.videoLibrayList(path);
                return !1;
            };

            $scope.goHome = function () {//回到编辑页面
                zmitiService.goBack();
            }
            $scope.useDefaultLoadingPage = function () {//使用默认的加载页
                ltP.index.$scope.editType="";
                ltP.index.global.APP.pubSource.loadingColor = "#fff";
                ltP.index.global.APP.pubSource.loadingSrc = ltP.index.global.APP.domain + "/static/images/lt_loading.png";
                ltP.index.global.APP.pubSource.loadingBg = ltP.index.global.APP.domain + "/static/images/loading_bg.jpg";
                this.goHome();
            }
            $scope.pageRelease=function(){
                ltP.index.$scope.isShowDialog = true;
                $location.path("/page/release");
                return !1;
            };
            $scope.sliderChange= function (index) {
                ltP.index.$scope.sliderIndex=index;
                ltP.index.$scope.goBackPath="/slider/attr";
                zmitiService.picLibraryList(ltP.index.$scope.goBackPath);
            };

            $scope.cropImage=function(){
                H5Manager.cropImage({'productionID':'100','resourcePath':"corpImage.jpg",'width':"300",
                        'height':"300"}
                    ,function(response){
                        log("cropImage return state "+response.state+"& newPath:"+response.newPath);
                    });
                return !1;
            };
            $scope.getAudioFromNative=function(){
                var srcName = ltP.index.focusWidget.src.split('/')[ltP.index.focusWidget.src.split('/').length-1];
                H5Manager.getAudioFromNative({'productionID':ltP.index.global.APP.appID,'resourcePath':srcName},function(response){
                    ltP.index.focusWidget.src = ltP.index.focusWidget.src.relpace(srcName,response.newPath);
                });
                return !1;
            };
            $scope.getVideoFromNative=function(){
                var srcName = ltP.index.focusWidget.src.split('/')[ltP.index.focusWidget.src.split('/').length-1];
                H5Manager.getVideoFromNative({'productionID':ltP.index.global.APP.appID,'resourcePath':srcName},function(response){
                    ltP.index.focusWidget.src = ltP.index.focusWidget.src.relpace(srcName,response.newPath);
                });
                return !1;
            };
            $scope.clearMusic=function(){
                if(ltP.index.$scope.isAudio){
                    ltP.index.focusWidget.picSrc="";
                }
                else {
                    ltP.index.global.APP.bgSound.src = "";
                }
                return !1;
            };

            $scope.viewHeight = zmitiService.viewHeight;
            $scope.$location = $location;
            ltP.index.$scope = $scope;
            ltP.index.$window=$window;
            ltP.index.$location = $location;
            ltP.index.zmitiService=zmitiService;
            ltP.index.$scope.batchChangeSlider=false;
            ltP.index.$scope.isAudio=false;
            ltP.index.focusPageIndex=1;
            ltP.index.focusWidget && (ltP.index.focusWidgetItemOparater = ltP.index.allOparaterItems[ltP.index.focusWidget.type]);
        }]);
        zmitiApp.animation(".fly-operator", ["zmitiService", function (zmitiService) {
            return {
                leave: function (element, done) {//隐藏编辑页面
                    zmitiService.setTransition($(element), ".3s").addClass("active");
                    zmitiService.setTransition($("#J-lt-p-screen>div"), ".5s -.1s").removeClass("active");
                    setTimeout(done, 300);
                },
                enter: function (element, done) {//展开编辑页面
                    setTimeout(function () {
                        zmitiService.setTransition($(element), ".3s").removeClass("active");
                    }, 0);
                    zmitiService.setTransition($("#J-lt-p-screen>div"), ".5s .1s").addClass("active");

                }
            }
        }]);
        angular.bootstrap(document, ["zmitiApp"]);
        window.ltP=ltP;
    }
    function initData(url) {

        if(url.indexOf("http")>-1){//在线预览
            window.location.href= "preview.html?url"+url;
        }else{
            var s = doc.createElement("script");
            s.onload = fnJSONLoaded;
            s.src = url;
            doc.body.appendChild(s);
        }

    }
    return initData;
});

