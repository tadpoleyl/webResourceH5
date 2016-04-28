define("directive", ["angular"], function () {
    var derectiveModule = angular.module("derectiveModule", ["ngTouch"]);

    derectiveModule.directive("stage", [function () { //渲染舞台。
            var option = {
                restrict: "E",
                scope: {
                    "ltStagePage": "=",
                    "ltStageType": "@"
                },
                templateUrl: "static/template/htmlStage.html",
                replace: true
            };
            return option;
        }]).directive("widgetType", ["$location", "$compile", "$http", "zmitiService", function ($location, $compile, $http, zmitiService) {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    element.on("touchstart", function (e) {
                        var _this = this;
                        e.stopPropagation();
                        e.preventDefault();


                        ltP.index.$scope.isShowDialog=false;
                        if ($location.path().indexOf("animation") > -1) {
                            $location.path(attr.widgetType + "/animation");
                        }
                        else {
                            $location.path(attr.widgetType + "/attr");
                        }
                        zmitiService.mouseDownWidget(e, _this, attr.widgetType, zmitiService, scope, $location, $compile, $http);

                        if (ltP.index.focusWidget.type === "image") {
                            if (ltP.index.focusWidget.textType !== "art") {
                                scope.$apply(function () {
                                    ltP.index.focusWidgetItemOparater = ltP.index.allOparaterItems[attr.widgetType];
                                });
                            }
                            else {
                                scope.$apply(function () {
                                    ltP.index.focusWidgetItemOparater = ltP.index.allOparaterItems["artImage"];
                                });
                            }
                        }
                        else if (ltP.index.focusWidget.type === "text" && ltP.index.focusWidget.textType === "art") {
                            scope.$apply(function () {
                                ltP.index.focusWidgetItemOparater = ltP.index.allOparaterItems["artText"];
                            });
                        }
                        else if (attr.widgetType !== "page") {
                            scope.$apply(function () {
                                ltP.index.focusWidgetItemOparater = ltP.index.allOparaterItems[attr.widgetType];

                            });
                        }
                    }).swipe("left",function(){
                        ltP.index.$scope.$apply(function(){
                            ltP.index.focusPageIndex--;
                            if(ltP.index.focusPageIndex<=0) {
                                ltP.index.focusPageIndex = ltP.index.groups[0].pages.length;
                            }
                            ltP.index.focusPage=ltP.index.groups[0].pages[ltP.index.focusPageIndex-1];
                        });
                        return !1;
                    }).swipe("right",function(){
                        ltP.index.$scope.$apply(function(){
                            if(ltP.index.focusPageIndex===1) {
                                ltP.index.focusPageIndex = ltP.index.groups[0].pages.length - 1;
                            }
                            else if(ltP.index.focusPageIndex>=ltP.index.groups[0].pages.length - 1) {
                                ltP.index.focusPageIndex = 0;
                            }
                            ltP.index.focusPage=ltP.index.groups[0].pages[ltP.index.focusPageIndex];
                            ltP.index.focusPageIndex++;
                        });
                        return !1;
                    });
                }
            }
        }]).directive("close", [ function () {
            return {
                restrict: "E",
                link: function (scope, element, attr) {
                    $(element).find("span").tap(function () {
                        scope.$apply(function () {
                            ltP.index.$scope.isShowDialog = false;
                            ltP.index.focusWidget.text && (ltP.index.focusWidget.text = $("#" + ltP.index.focusWidget.id).text());
                        });
                    });
                },
                scope: {
                    flyCloseId: "@"
                },
                replace: true,
                template: "<h2 id={{flyCloseId}} class='fly-close'><span></span></h2>",
                controller: ["$scope", function ($scope) {
                    $(".fly-widget-property").length > 0 && $(".fly-widget-property").height(document.documentElement.clientHeight - $(".fly-widget-property").offset().top);
                    switch (ltP.index.focusWidget.type) {
                        case "text":
                            $scope.$parent.$watch("curPanel", function (oldValue, newValue) {
                                if (!oldValue && !ltP.index.$scope.propertyScroll) {
                                    requirejs(["iscroll"], function (scroll) {
                                        $(".fly-widget-property").length > 0 && $(".fly-widget-property").height(document.documentElement.clientHeight - $(".fly-widget-property").offset().top);
                                        ltP.index.$scope.propertyScroll = scroll(".fly-widget-property", {
                                            scrollbars: true,//显示滚动条
                                            click: false,//关闭click事件
                                            tap: true,//启用tap事件
                                            //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                                            interactiveScrollbars: true,//用户是否可以拖动滚动条
                                            shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                        });
                                    })
                                }
                            });
                            break;
                        case "image":
                            $scope.$parent.$watch("curPanel", function (oldValue, newValue) {
                                switch (oldValue) {
                                    case 0:
                                        break;
                                    case 1:
                                        requirejs(["iscroll"], function (scroll) {
                                            $(".fly-widget-property").height(document.documentElement.clientHeight - $(".fly-widget-property").offset().top);
                                            ltP.index.$scope.propertyScroll = scroll(".fly-widget-property", {
                                                scrollbars: true,//显示滚动条
                                                click: false,//关闭click事件
                                                tap: true,//启用tap事件
                                                //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                                                interactiveScrollbars: true,//用户是否可以拖动滚动条
                                                shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                            });
                                        })
                                        break;
                                    case 2:
                                        break;
                                }

                            });
                            break;
                        case "video":

                            break;
                    }
                }]

            }
        }]).directive("operator", ["$location", "zmitiService", function ($location, zmitiService) {
            return {
                restrict: "E",
                link: function (scope, element, attr) {

                    $(element).tap(function (e) {

                        if (e.target.nodeName === "LI") {

                            $(e.target).addClass("operatorActive").siblings().removeClass("operatorActive");
                            //ltP.index.focusWidget === undefined && ltP.index.foucsPage.widgets.length>0 && (ltP.index.focusWidget = ltP.index.foucsPage.widgets[0]);
                            var type = ltP.index.focusWidget.type;
                            switch (ltP.index.focusWidget.type) {
                                case "text": //文本
                                    var index = $(e.target).index();
                                    switch (index) {
                                        case 0://编辑
                                            scope.$apply(function () {
                                                ltP.index.$scope.isShowDialog = true;
                                            });
                                            break;
                                        case 1://删除
                                            zmitiService.delLayer($location, ltP.index.focusWidget);
                                            break;
                                    }
                                    break;
                                case "image": //图片
                                    var index = $(e.target).index();
                                    switch (index) {
                                        case 0://编辑

                                            scope.$apply(function () {
                                                ltP.index.$scope.isShowDialog = true;
                                                ltP.index.focusWidget && $location.path("/image/attr");
                                            });
                                            break;
                                        case 1://删除
                                            zmitiService.delLayer($location, ltP.index.focusWidget);
                                            break;
                                    }
                                    break;
                                case "video":
                                    var index = $(e.target).index();
                                    switch (index) {
                                        case 0://替换
                                            scope.$apply(function () {
                                                ltP.index.$scope.isShowDialog = true;
                                            });
                                            break;
                                        case 1:
                                            zmitiService.delLayer($location, ltP.index.focusWidget);
                                            break;
                                    }
                                    break;
                                case "audio":
                                    var index = $(e.target).index();
                                    switch (index) {
                                        case 0://替换视频
                                            scope.$apply(function () {
                                                ltP.index.$scope.isShowDialog = true;
                                                ltP.index.$scope.isAudio = true;
                                            });
                                            zmitiService.setMusic();
                                            break;
                                        case 1:
                                            zmitiService.delLayer($location, ltP.index.focusWidget);
                                            break;
                                    }
                                    break;
                                case "slider":
                                    var index = $(e.target).index();
                                    switch (index) {
                                        case 0://编辑
                                            scope.$apply(function () {
                                                ltP.index.$scope.isShowDialog = true;
                                            });
                                            break;
                                        case 1:
                                            zmitiService.delLayer($location, ltP.index.focusWidget);
                                            break;
                                    }
                                    break;
                            }
                            if (ltP.index.focusWidget && ltP.index.focusWidget.type !== "image") {
                                ltP.index.$scope.$apply(function () {
                                    ltP.index.focusWidget && ltP.index.$location.path(type + "/attr");
                                });
                            }
                        }
                        return false;
                    });
                },
                scope: {
                    ltStage: "=",
                    type: "@",
                    item: "@"
                },
                replace: true,
                templateUrl: 'static/template/operatorbar.html'
            }
        }]).filter('filterPageWidget',function () {
            return function (item, typeName) {
                var num = 0;
                for (var i = 0; i < item.length; i++) {
                    if (item[i].type == typeName) {
                        num++;
                    }
                }
                return num;
            }
        }).filter('to_trusted', ['$sce', function ($sce) {
            return function (text) {
                return $sce.trustAsHtml(text);
            };
        }]).directive("animate", [function () {
            return {
                restrict: "E",
                scope: {
                    widget: "=",
                    isshow: "="
                },
                replace: true,
                link: function (scope, element, attr) {
                    var scroll;
                    scope.$watch("isshow", function (oldValue, newValue) {
                        if (oldValue === 0 || oldValue) {
                            if (!scroll) {
                                requirejs(["iscroll"], function (iscroll) {
                                    scroll = iscroll($("#fly-animation-container .fly-animation-all")[0], {
                                        scrollbars: false,//显示滚动条
                                        click: false,//关闭click事件
                                        tap: true,//启用tap事件
                                        interactiveScrollbars: true,//用户是否可以拖动滚动条
                                        shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                    });
                                });
                            }
                        }
                    });
                },
                controller: ["$scope", "zmitiService", function ($scope, zmitiService) {
                    $scope.setAnimate = function (animationName) {
                        if (animationName) {
                            if ($scope.widget.animation.length <= 0) {//没有动画，添加动画
                                var animationObj = {
                                    "0": true,
                                    animationClass: "",
                                    animationDelay: 0,
                                    animationDuration: 0.6,
                                    animationIterationCount: 1,
                                    animationName: animationName,
                                    animationTimingFunction: "ease",
                                    dempAnimationId: " ",
                                    dempDir: "all",
                                    direction: "",
                                    id: zmitiService.getGuid(),
                                    name: "淡入",
                                    requireObj: {
                                        animationId: " ",
                                        currentWidgetId: $scope.widget.id,
                                        name: "页面加载完成",
                                        widgetId: $scope.widget.id
                                    },
                                    triggerType: "",
                                    txtName: "appAnimation",
                                    type: "animation"
                                };
                                $scope.widget.animation.push(animationObj);
                            }
                            else {//有动画，设置动画
                                $scope.widget.animation[0].animationName = animationName;
                            }
                        }
                        else {
                            $scope.widget.animation = [];
                        }
                    };
                    $scope.animations = [
                        { animationName: "fadeInDown", displayName: "向下淡入"},
                        { animationName: "fadeInUp", displayName: "向上淡入"},
                        { animationName: "fadeInLeft", displayName: "向左淡入"},
                        { animationName: "fadeInRight", displayName: "向右淡入"},
                        { animationName: "fadeOutDown", displayName: "向下淡出"},
                        { animationName: "fadeOutUp", displayName: "向上淡出"},
                        { animationName: "fadeOutLeft", displayName: "向左淡出"},
                        { animationName: "fadeOutRight", displayName: "向右淡出"},
                        { animationName: "bounceInDown", displayName: "向下移入"},
                        { animationName: "bounceInUp", displayName: "向上移入"},
                        { animationName: "bounceInLeft", displayName: "向左移入"},
                        { animationName: "bounceInRight", displayName: "向右移入" },
                        { animationName: "bounceOutDown", displayName: "向下移出"},
                        { animationName: "bounceOutUp", displayName: "向上移出"},
                        { animationName: "bounceOutLeft", displayName: "向左移出"},
                        { animationName: "bounceOutRight", displayName: "向右移出" },
                        { animationName: "slideInDown", displayName: "向下弹入" },
                        { animationName: "slideInUp", displayName: "向上弹入" },
                        { animationName: "slideInLeft", displayName: "向左弹入" },
                        { animationName: "slideInRight", displayName: "向右弹入" },
                        { animationName: "slideOutDown", displayName: "向下弹出" },
                        { animationName: "slideOutUp", displayName: "向上弹出" },
                        { animationName: "slideOutLeft", displayName: "向左弹出" },
                        { animationName: "slideOutRight", displayName: "向右弹出" },
                        { animationName: "ltFlyRotate", displayName: "360度旋转" }
                    ];
                }],
                templateUrl: "static/template/animations.html"
            }
        }]).directive("minicolor", ["$timeout", "zmitiService", function ($timeout, zmitiService) {
            return {
                restrict: "E",
                template: '<div id="{{ltId}}" class="color-container {{colorType}}"><a href="javascript:void(0)" class="minicolor" data-opacity="1"></a><input type="text" class="form-control val" ng-model="ltModel" value="#000"></div>',
                scope: {
                    "ltId": "@",
                    "ltModel": "=",
                    "colorType": "@"
                },
                replace: true,
                link: function (scope, element, attr) {
                    var timer = null;
                    requirejs(["jquery"], function () {
                        $('.minicolor').minicolors({
                            control: $(this).attr('data-control') || 'hue',
                            defaultValue: $(this).attr('data-defaultValue') || '',
                            inline: $(this).attr('data-inline') === 'true',
                            opacity: $(this).attr('data-opacity'),
                            change: function (hex, opacity) {
                                if (!hex) return;
                                var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
                                var sColor = hex;
                                if (sColor && reg.test(sColor)) {
                                    if (sColor.length === 4) {
                                        var sColorNew = "#";
                                        for (var i = 1; i < 4; i += 1) {
                                            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                                        }
                                        sColor = sColorNew;
                                    }
                                    //处理六位的颜色值
                                    var sColorChange = [];
                                    for (var i = 1; i < 7; i += 2) {
                                        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
                                    }
                                    var colorType = $(this).parents(".color-container").attr("color-type");
                                    switch (colorType.trim()) {
                                        case "index-backgroundColor":
                                        case "remark-backgroundColor":
                                        case "question-backgroundColor":
                                            var pro = colorType.trim().split("-");
                                            scope.$apply(function () {
                                                scope.$parent.ltP.index.focusWidget[pro[0]] && (scope.$parent.ltP.index.focusWidget[pro[0]].styles.backgroundColor = "rgba(" + sColorChange.join(",") + "," + opacity + ")");
                                            });
                                            break;
                                        case "page-bgcolor":
                                            scope.$apply(function () {
                                                ltP.index.focusPage && (ltP.index.focusPage.styles['background-color'] = "rgba(" + sColorChange.join(",") + "," + opacity + ")");
                                            });
                                            break;
                                        case "text-backgroundColor":
                                        case "text-color":
                                        case "image-backgroundColor":
                                        case "pub-borderColor":
                                        case "line-backgroundColor":
                                        case "radius-backgroundColor":
                                        case "rectangular-backgroundColor":
                                        case "ellipse-backgroundColor":
                                            scope.$apply(function () {
                                                ltP.index.focusWidget && (ltP.index.focusWidget.styles[colorType.trim().split('-')[1]] = "rgba(" + sColorChange.join(",") + "," + opacity + ")");
                                            });
                                            break;
                                        case ltP.index.focusWidget.id + "-boxShadow":
                                            scope.$apply(function () {
                                                ltP.index.focusWidget && (ltP.index.focusWidget.styles.boxShadows[2] = "rgba(" + sColorChange.join(",") + "," + opacity + ")");
                                                ltP.index.focusWidget && (ltP.index.focusWidget.styles.boxShadowDemp[3] = "rgba(" + sColorChange.join(",") + "," + opacity + ")");
                                                ltP.index.focusWidget.styles.boxShadow = ltP.index.focusWidget.styles.boxShadowDemp.join(' ');
                                            });
                                        case "pubSource-loadingColor":
                                            ltP.index.global.APP.pubSource.loadingColor = "rgba(" + sColorChange.join(",") + "," + opacity + ")";
                                            break;
                                    }
                                }
                            },
                            theme: 'bootstrap'
                        })
                    });


                }
            }
        }]).directive("slider", ["zmitiService", function (zmitiService) {
            return {
                restrict: "E",
                scope: {
                    max: "@",
                    ltModel: "=",
                    value: "@",
                    flyId: "@"
                },
                controller: ["$scope", function ($scope) {
                    var width = 120,
                        sWidth = 12;

                    $scope.$watch("ltModel", function (oldValue, newValue) {
                        if (oldValue !== newValue) {
                            var x = $scope.ltModel / $scope.max * width - sWidth;
                            x <= 0 && (x = 0);
                            x >= $scope.max * (100 / $scope.max) * 1 && (x = $scope.max * 1 * (100 / $scope.max));
                            $("#" + $scope.flyId + " span").css({
                                "transform": "translate(" + x + "px,0)",
                                "-webkit-transform": "translate(" + x + "px,0)"
                            });
                        }
                    });
                }],
                link: function (scope, element, attr) {
                    element.find("span").css({ "transform": "translate(" + (scope.value / scope.max * 100) + "px,0)", "-webkit-transform": "translate(" + (scope.value / scope.max * 100) + "px,0)" });
                    element.on("touchstart", function (e) {
                        var target = e.target;
                        if (target.nodeName === "SPAN") {
                            var $target = $(target);

                            ltP.index.$scope.propertyScroll && ltP.index.$scope.propertyScroll.disable();
                            var left = $(e.target).parent().offset().left;
                            $(document).on("touchmove",function (e) {
                                e.preventDefault();
                                var e = e.originalEvent.changedTouches && e.originalEvent.changedTouches[0] || e;
                                var l = e.pageX - left;

                                l <= 0 && (l = 0);
                                l >= scope.max * (100 / scope.max) * 1 && (l = scope.max * 1 * (100 / scope.max));

                                // $target.css({ "transform": "translate(" + (l) + "px,0)", "-webkit-transform": "translate(" + (l) + "px,0)" });

                                scope.$apply(function () {
                                    scope.ltModel = parseInt(l / scope.max * 100 / (100 / scope.max) / (100 / scope.max));
                                });

                            }).on("touchend", function (e) {
                                    $(this).off("touchmove touchend");
                                    ltP.index.$scope.propertyScroll && ltP.index.$scope.propertyScroll.enable();
                                });
                        }

                    });
                },
                replace: true,
                template: '<div id="{{flyId}}" class="fly-slider"><span></span></div>'
            }
        }]).directive("flyAddWidget", ["$filter", "$compile", "$location", "zmitiService", function ($filter, $compile, $location, zmitiService) {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    var flyWidgetType = null;

                    var zIndex = zmitiService.getWidgetZIndex();
                    var getZindex = (Math.max.apply(Math, zmitiService.getWidgetZIndex()));
                    var maxZIndex = zIndex.length > 0 ? getZindex + 1 : 100;
                    $(element).tap(function (e, _this) {
                        var widgetIndexs = $("#J-lt-p-screen-content .lt-widget").size();
                        flyWidgetType = $(e.target).attr("fly-widget-type") * 1;
                        switch (flyWidgetType) {
                            case 1://文本
                            {
                                var num = $filter('filterPageWidget')(ltP.index.focusPage.widgets, 'text');
                                var option = {
                                    id: zmitiService.getGuid(),
                                    index: maxZIndex,
                                    name: '文本' + (num++),//组件名称。
                                    type: 'text',//组件类型
                                    text: "右键此处进行编辑",
                                    widgetIndex: widgetIndexs,
                                    radio: false,
                                    styles: {
                                        "width": "7rem",
                                        'position': 'absolute',
                                        'fontSize': '14px',
                                        'height': '4rem',
                                        'lineHeight': '30',
                                        'marginLeft': '0',
                                        'color': '#000',
                                        'textIndent': "0em",
                                        'opacity': '100',
                                        'left': 0,//组件的x轴位置。
                                        'right': 'auto',
                                        'bottom': 'auto',
                                        'top': "2rem",//组件的y轴位置。
                                        'zIndex': maxZIndex
                                    },
                                    isLocked: false,//是否锁定。
                                    events: [],//事件对象、默认为空
                                    animation: []//组件的动画
                                };
                                scope.focusWidgetHeight = 30;
                                scope.$apply(function () {
                                    ltP.index.focusPage.widgets.push(angular.copy(option));
                                    ltP.index.focusWidgetItemOparater = ltP.index.allOparaterItems["text"];
                                });

                                var cWidget = $(".lt-widget-text-container").eq(-1);
                                zmitiService.dragAndResize("", cWidget, $compile, scope, $location);

                                ltP.index.focusWidget = angular.copy(option);
                                ltP.index.focusWidgetIndex = ltP.index.focusPage.widgets.length - 1;

                                $location.path("text/attr");
                                zmitiService.setFocusWidgetAttr(scope, ltP.index.focusPage.widgets.length - 1);

                            }


                                break;
                            case 2://图片
                                break;
                            case 3://视频
                                break;
                            case 4://幻灯片
                                break;
                            case 5:
                                break;
                            case 6:
                                break;
                        }
                    });
                }
            }
        }]).directive("flySwitch", ["zmitiService", function (zmitiService) {
            return {
                restrict: "E",
                scope: {
                    checkboxId: "@",
                    defaultColor: "@",
                    activeColor: "@",
                    flyModel: "="
                },
                controller: ["$scope", function ($scope) {

                } ],
                link: function (scope, element, attr) {
                    setTimeout(function () {
                        if (scope.flyModel) {
                            $("#" + scope.checkboxId).find("div").css({ "transform": "translateX(33px)", "-webkit-transform": "translateX(33px)" });
                            $("#" + scope.checkboxId).css({ background: scope.activeColor || "green" });
                        }
                    }, 10);
                    $(element).tap(function (e) {
                        var $target = $(e.target);
                        arguments.callee.show = scope.flyModel ? false : !arguments.callee.show;
                        if ($target.children().length <= 0) {
                            if (arguments.callee.show) {
                                $target.css({ "transform": "translateX(33px)", "-webkit-transform": "translateX(33px)" });
                                $target.parent().css({ background: scope.activeColor || "green" });
                                scope.$apply(function () {
                                    scope.flyModel = true;
                                });
                            }
                            else {
                                $target.css({ "transform": "translateX(0)", "-webkit-transform": "translateX(0)" });
                                $target.parent().css({ background: scope.defaultColor || "#fff" });
                                scope.$apply(function () {
                                    scope.flyModel = false;
                                });
                            }
                        }
                        else {
                            if (arguments.callee.show) {
                                $target.find("div").css({ "transform": "translateX(33px)", "-webkit-transform": "translateX(33px)" });
                                $target.css({ background: scope.activeColor || "green" });
                                scope.$apply(function () {
                                    scope.flyModel = true;
                                });
                            }
                            else {
                                $target.find("div").css({ "transform": "translateX(0)", "-webkit-transform": "translateX(0)" });
                                $target.css({ background: scope.defaultColor || "#fff" });
                                scope.$apply(function () {
                                    scope.flyModel = false;
                                });
                            }
                        }

                    });
                },
                template: '<div class="fly-switch" id="{{checkboxId}}" style="background: {{defaultColor}}"><div></div></div>',
                replace: true
            }
        }]).directive("flyBtnGroup", [function () {
            return {
                restrict: "A",
                scope: {

                },
                require: "?^",
                controller: ["$scope", function ($scope) {

                }],
                link: function (scope, element, attr, requireController) {
                    $(element).find(".fly-btn").each(function (n, i) {
                        switch (attr.flyBtnGroup) {
                            case 'text':
                                $(this).tap(function () {

                                    scope.$apply(function () {
                                        scope.$parent.curPanel = !n;
                                    });

                                });
                                break;
                            case 'image':
                                $(this).tap(function () {
                                    switch (n) {
                                        case 0:
                                            scope.$apply(function () {
                                                scope.$parent.curPanel = false;
                                            });
                                            break;
                                        case 1:
                                            scope.$apply(function () {
                                                scope.$parent.curPanel = true;
                                            });
                                            break;
                                    }
                                });
                                break;
                        }

                    });
                }
            }
        }]).directive("flyTextAlign", [function () {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    $(element).find("li").each(function (i, n) {
                        $(this).tap(function () {
                            scope.$apply(function () {
                                ltP.index.focusWidget.styles.textAlign = $(n).data("align");
                            });
                        });
                    });
                }
            }
        }]).directive("flyHeader", ["$location", "zmitiService", function ($location, zmitiService) {
            return {
                restrict: "E",
                scope: {
                    flyTitle: "="
                },
                controller: ["$scope", function ($scope) {

                }],
                templateUrl: "static/template/header.html",
                link: function (scope, element, attr) {
                    var mask = $(element).find(".fly-mask");
                    var menu = $(element).find(".fly-menu");
                    $(element).find(".fly-operator").on("tap",function (e) {
                        e.preventDefault();
                        mask.show();
                        mask.height(zmitiService.stageHeight);
                        menu.addClass("active");
                    });
                    mask.on("tap",function () {
                        setTimeout(function () {
                            mask.hide();
                            menu.removeClass("active");
                        }, 12)
                    });
                    $(element).find(".fly-back").on("tap",function (e) {
                        e.preventDefault();
                        if (ltP.index.$scope.isAudio && !ltP.index.focusWidget.picSrc) {
                            alert("音频组件必须有音乐地址");
                        }
                        else {
                            ltP.index.$scope.$apply(function () {
                                zmitiService.goBack();
                            });
                            ltP.index.$scope.isAudio = false;
                        }
                    });


                    $(".fly-menu",$(element)).tap(function(e){
                        if (e.target.nodeName === "LI") {
                            switch ($(e.target).index("li")) {
                                case 0://新增单页
                                    break;
                                case 1://删除页
                                    ltP.index.groups[0].pages = $.grep(ltP.index.groups[0].pages, function (page, i) {
                                        return page.pageId !== ltP.index.focusPage.pageId;
                                    });
                                    ltP.index.$scope.$apply(function () {
                                        if (ltP.index.groups[0].pages.length === 1) {
                                            ltP.index.focusPage = ltP.index.groups[0].pages[0];
                                        }
                                        else if (ltP.index.groups[0].pages.length > 1) {
                                        }
                                        else {
                                            ltP.index.focusPage = null;
                                        }
                                    });
                                    break;
                                case 2://页面排序
                                    scope.$apply(function () {
                                        ltP.index.$scope.redirectTo("/page/pageorder");
                                    });
                                    break;
                                case 3://作品属性
//                                ltP.index.$scope.projectAttr=[
//                                    "在编辑",
//                                    "在编辑",
//                                    "在编辑"
//                                ];
                                    ltP.index.$scope.prjSetTypeList = [
                                        "一级分类",
                                        "二级分类",
                                        "三级分类"
                                    ];
                                    scope.$apply(function () {
                                        ltP.index.$scope.redirectTo("/page/projectSetting");
                                    });

                                    break;
                                case 4://作品预览

                                    var jsonString = "var json= "+ angular.toJson(json) + "\n var global=" +angular.toJson(global);


                                    H5Manager.saveJsonConfig({'jsonConfig':jsonString,'ID':global.APP.appID});
                                   // console.log(ltP.index.focusPage.widgets[0]);
                                    scope.$apply(function () {
                                        ltP.index.$scope.redirectTo("/page/preview");
                                    });
                                    break;
                                case 5://发布
                                    scope.$apply(function () {
                                        ltP.index.$scope.redirectTo("/page/projectSetting");
                                    });
                                    break;
                            }
                            //收起导航。
                            mask.hide();
                            menu.removeClass("active");
                        }

                    })



                }
            }
        }]).directive("flyDropdownlist", ["$timeout", "zmitiService", function ($timeout, zmitiService) {
            return {
                restrict: "E",
                scope: {
                    flyModel: "=",
                    dropdownlistId: "=",
                    flyWidth: "@",
                    flyHeight: "@",
                    cssName: "@"
                },
                replace: true,
                transclude: true,
                controller: ["$scope", function ($scope) {
                }],
                templateUrl: "static/template/dropdownlist.html",
                link: function (scope, element, attr, reController) {
                    $(element).tap(function (e, _this) {
                        var currentDropdown = $("#" + scope.dropdownlistId + " .fly-dropdownlist-items");
                        $(".fly-dropdownlist-items").removeClass("active");
                        if ($(e.target).hasClass('fly-current-val')) {//点击开始下拉操作
                            var arg = arguments;
                            arg.callee.scroll === undefined && (arg.callee.scroll = requirejs(["iscroll"], function (iscroll) {
                                scroll = iscroll(currentDropdown[0], {
                                    scrollbars: true,//显示滚动条
                                    click: false,//关闭click事件
                                    tap: true,//启用tap事件
                                    interactiveScrollbars: true,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                });
                            }));
                            var dropdownlist = $("#" + scope.dropdownlistId);

                            $(".fly-dropdownlist-items", dropdownlist).addClass("active");
                            var mask = $(".fly-mask", dropdownlist);
                            mask.show().height(zmitiService.stageHeight);
                        }
                        else if ($(e.target).hasClass('fly-mask')) {//点击遮罩时
                            var mask = $(".fly-mask", dropdownlist);
                            mask.hide();
                            $(" .fly-dropdownlist-items", dropdownlist).removeClass("active");
                        }
                        else if ($(e.target).hasClass('fly-dropdown-item')) {//点击列表


                            element.find(".fly-dropdown-item").removeClass("active");

                            $(e.target).addClass("active");


                            var type = scope.cssName.split('-');

                            var value = $(e.target).data("value").trim();
                            var text = $(e.target).html();
                            scope.$apply(function () {

                                scope.flyModel = value;


                                if (type.length > 1) {

                                    if (type[0] === 'widget') {
                                        if (type[1] === "sliderChangeType") {
                                            ltP.index.focusWidget.sliderChangeType = value;
                                            ltP.index.focusWidget.sliderChangeTypeName = text;
                                            scope.flyModel = text;
                                        }
                                        else {
                                            ltP.index.focusWidget.styles[type[1]] = value;
                                        }
                                    }
                                    else if (type[0] === "page") {

                                        ltP.index.focusPage.styles[type[1]] = value;

                                        switch (type[2]) {
                                            case "bgrepeat":// 背景重复
                                                ltP.index.focusPage.focusBgRepeatType = text;
                                                break;
                                            case "bgsize":
                                                ltP.index.focusPage.focusBgSize = text;
                                                break;
                                            case "bgposition":
                                                ltP.index.focusPage.focusBgPosition = text;
                                                break;
                                        }
                                    }
                                    else {
                                        alert("属性配置错误")
                                    }
                                }
                            });

                            var mask = $(".fly-mask", dropdownlist);

                            mask.hide();
                            $(" .fly-dropdownlist-items", dropdownlist).removeClass("active");
                        }
                    });
                }
            }
        }]).directive("flyDropdownlistOption", [function () {
            return {
                restrict: "AE",
                scope: {
                    text: "@",
                    value: "@"
                },
                controller: ["$scope", function ($scope) {
                    $scope.value1 = $scope.value.trim();
                }],
                replace: true,
                require: "^?flyDropdownlist",
                link: function (scope, element, attr, pController) {
                },
                transclude: true,
                template: "<li class=\"fly-dropdown-item\"   ng-transclude ng-bind='text' data-value='{{value}}'></li>"
            }
        }]).directive("flyPicTypeTitle", ["zmitiService",function (zmitiService) {
            return function (scope, element, attr) {
                var that = zmitiService;
                $("#fly-pic-library-container .fly-pic-btn input").on("tap",function(e){
                    e.preventDefault();
                    $(this).addClass("active").siblings().removeClass("active");
                    var index = $(this).index();

                    switch (index){
                        case 0://机构
                            that.loadingImgData(2,0,1,12,null,true,that.orgId);
                            that.loadingCateData(0,"orgId");
                            break;
                        case 1://个人
                            that.loadingCateData(0);
                            that.loadingImgData(1,0,1,12,null,true);
                            break;
                    }
                });
                $(element).on("tap", function (e) {
                    if (e.target.nodeName === "LI") {
                        var $Target = $(e.target);
                        $Target.addClass("active").siblings().removeClass("active");
                        var id = $Target.data("id");
                        zmitiService.loadingCateData(id);
                        zmitiService.loadingImgData(1,0,1,12,id,true);
                    }
                });
            };
        }]).directive("flyPicTypeItems", ["zmitiService",function (zmitiService) {
            return function (scope, element, attr) {
                $(element).on("tap", function (e) {
                    e.preventDefault();
                    if (e.target.nodeName === "LI") {
                        var $Target = $(e.target);
                        $Target.addClass("active").siblings().removeClass("active");
                        var id = $Target.data("id");
                        zmitiService.loadingImgData(1,0,1,12,id,true);
                    }
                });
            };
        }]).directive("flyPicItem", ["zmitiService",function (zmitiService) {
            return function (scope, element, attr) {
                ltP.index.focusSource.resType = 3;

                $(element).on("tap", function (e) {
                    if (e.target.nodeName === "IMG") {
                        if (ltP.index.$scope.batchChangeSlider) {
                            if ($(e.target).hasClass("active")) {
                                $(e.target).removeClass("active")
                            }
                            else {
                                $(e.target).addClass("active");
                            }
                        }
                        else {
                            $(e.target).addClass("active").parent().siblings().find("img").removeClass("active");
                        }
                    }
                });
            };
        }]).directive("flyAudioList", [function () {
            return function (scope, element, attr) {
                $(element).on("tap", function (e) {
                    var _target = $(e.target);
                    if (e.target.nodeName === "SPAN") {
                        _target = $(e.target).parent();
                    }
                    var src = _target.data("src");
                    ltP.index.$scope.$apply(function () {
                        if (ltP.index.$scope.isAudio) {
                            ltP.index.focusWidget.picSrc = src;
                        }
                        else {
                            ltP.index.global.APP.bgSound.src = src;
                        }
                    });
                    _target.addClass("active").siblings().removeClass("active");
                });
            };
        }]).directive("flyProjectAddType", ["zmitiService", function (zmitiService) {
            return function (scope, element, attr) {
                $(element).on("tap", function (e) {
                    var typeName = $("#prjType").val();
                    if (typeName) {
                        ltP.index.$scope.$apply(function () {
                            if (ltP.index.$scope.projectAttr) {
                                ltP.index.$scope.projectAttr.push(typeName);
                            }
                            else {
                                ltP.index.$scope.projectAttr = [typeName];
                            }
                            zmitiService.setProjectSetting();
                        });
                    }
                });
            };
        }]).directive("flySliderChangePic", ["zmitiService", function (zmitiService) {
            return function (scope, element, attr) {
                $(element).on("tap", function () {
                    if (ltP.index.focusWidget && ltP.index.focusWidget.src.length < 6) {
                        ltP.index.$scope.batchChangeSlider = true;
                        ltP.index.$scope.$apply(function () {
                            ltP.index.$scope.goBackPath = "/slider/attr";
                            zmitiService.picLibraryList(ltP.index.$scope.goBackPath);
                        });
                    }
                    return !1;
                });
            };
        }]).directive("flyChangeAudio",["zmitiService",function(zmitiService){

            return {
                restrict:"A",
                link:function(scope,element,attr){
                    $(element).find("input").on("tap",function(e){
                        e.preventDefault();

                        $(this).addClass("action").siblings('input').removeClass("action");

                        var index = $(this).index();

                        var type = index === 0 ? "orgId":"userId";
                        zmitiService.setMusic(type);




                    });
                }
            }

        }]).directive("flySelect", ["zmitiService", function (zmitiService) {
            return function (scope, element, attr) {
                $(element).on("tap", function (e) {
                    var index = $(e.target).index();
                    if (index === 0) {//本地库
                        var imgName = ltP.index.focusWidget.src.split("/")[ltP.index.focusWidget.src.split("/").length-1];
                        var width = parseFloat($("html").css("font-size"))*parseFloat(ltP.index.focusWidget.styles.width);
                        var height = parseFloat($("html").css("font-size"))*parseFloat(ltP.index.focusWidget.styles.height);
                        H5Manager.getImageFromNative({'productionID': global.APP.appID, 'resourcePath': imgName, 'width': width,
                                'height': height}
                            , function (response) {
                                var result = ltP.index.focusWidget.src.replace(imgName,response.newPath);

                                scope.$apply(function(){
                                    ltP.index.focusWidget.src = result;
                                })
                                //log("getImageFromNative return state " + response.state + "& newPath:" + response.newPath);
                            });
                    }
                    else if (index === 1) {//在线图库
                        ltP.index.$scope.$apply(function () {
                            zmitiService.picLibraryList('/image/attr');
                        });
                    }
                    return !1;
                });
            };
        }]).directive("flyPageOrder", ["zmitiService", function (zmitiService) {
            return {
                restrict: "A",
                link: function (scope, element, attr) {
                    if (scope.$last) {
                        var pageContainer = $("#fly-page-order .fly-page-container");
                        pageContainer.height(zmitiService.viewHeight - 44 - $("#fly-page-order .fly-btn").height());
                        var flyPage = pageContainer.find(".fly-page-list .fly-page");
                        var len = flyPage.length;
                        var count = parseInt(len / 3) + (len % 3 === 0 ? 0 : 1);
                        pageContainer.find(".fly-page-list").height(count * 5.55 + "rem");
                        setScroll();

                        function setScroll() {
                            pageContainer[0].scroll === undefined && (requirejs(["iscroll"], function (scroll) {
                                pageContainer[0].scroll = scroll(pageContainer[0], {
                                    scrollbars: true,//显示滚动条
                                    click: false,//关闭click事件
                                    tap: true,//启用tap事件
                                    //fadeScrollbars: true,//是否渐隐滚动条，关掉可以加速
                                    interactiveScrollbars: true,//用户是否可以拖动滚动条
                                    shrinkScrollbars: "clip" //滚动超出滚动边界时，是否收缩滚动条。‘clip’：裁剪超出的滚动条‘scale’: 按比例的收缩滚动条（占用 CPU 资源）false: 不收缩，
                                });
                            }));

                        }

                        function getDis(x1, y1, x2, y2) {
                            return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
                        }

                        var arg = null;


                        $("#fly-page-order .fly-page-delete").on("tap",function(){
                            var index = $(this).parent(".fly-page").index(".fly-page");
                            ltP.index.$scope.$apply(function(){
                                ltP.index.groups[0].pages.splice(index,1);
                            });
                        });

                        $("#fly-page-order .fly-btn").on("tap", function (e) {
                            e.preventDefault();
                            arguments.callee.open = !arguments.callee.open;


                            $(this).html(arguments.callee.open ? "确定" : "点击排序");
                            arg = arguments;
                            if (arguments.callee.open) { //begin order page


                            }
                            else {
                                setScroll()
                            }

                            if (pageContainer[0].scroll) {
                                pageContainer[0].scroll.destroy();
                                pageContainer[0].scroll = undefined;
                            }

                        });

                        var pages = $("#fly-page-order .fly-page");
                        $("#fly-page-order .fly-page").on("touchstart", function (e) {

                            if (!arg || !arg.callee.open)
                                return;

                            e = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                            var _this = $(this);

                            var startX = e.pageX,
                                startY = e.pageY;
                            var disX = e.pageX - _this.offset().left,
                                disY = e.pageY - _this.offset().top;

                            _this.addClass("active");

                            $(document).on("touchmove",function (e) {

                                e = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;

                                _this.css({transform: "translate3d(" + (e.pageX - startX) + "px," + (e.pageY - startY) + "px,1px)",
                                    '-webkit-transform': "translate3d(" + (e.pageX - startX) + "px," + (e.pageY - startY) + "px,1px)", zIndex: 100});


                                var arr = [];

                                var left = e.pageX - disX,
                                    top = e.pageY - disY;

                                pages.each(function (i, n) { //碰撞检测。
                                    if (_this.index(".fly-page") !== $(n).index(".fly-page")) {//remove current page of order
                                        var left = e.pageX - disX,
                                            top = e.pageY - disY,
                                            isColl = left + _this.width() < $(n).offset().left ||
                                            top + _this.height() < $(n).offset().top ||
                                            left > $(n).offset().left + $(n).width() ||
                                            top > $(n).offset().top + $(n).height();

                                            if(!isColl){
                                                arr.push($(n));
                                            }
                                            else{
                                                arr.splice(i,1);
                                                $(n).removeClass("poll");
                                            }
                                    }
                                });


                                _this[0].index = -1;
                                var minDis = 320;
                                arr.forEach(function (item, i) {
                                    var minDisd = 0;
                                    d = getDis(
                                        item.offset().left + item.width() / 2,
                                        item.offset().top + item.height() / 2,
                                        left + _this.width() / 2,
                                        top + _this.height() / 2
                                    );
                                    if (d < minDis) {
                                        minDis = d;
                                        _this[0].index = item.index(".fly-page");
                                        pages.removeClass("poll");
                                        item.addClass("poll");
                                    }
                                    else{

                                        _this[0].index=-1;
                                    }
                                });

                            }).on("touchend", function (e) {
                                    e = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e;
                                    var endX = e.pageX,
                                        endY = e.pageY;
                                    $(this).off("touchmove touchend");
                                    _this.removeClass("active");
                                    _this.css({transform: "translate3d(0,0,0)",
                                        '-webkit-transform': "translate3d(0,0,0)", zIndex: 10});
                                    pages.removeClass("poll");

                                    if (_this[0].index === undefined || _this[0].index<=-1){
                                        return;//no colls
                                    }

                                    var cIndex = _this.index(".fly-page") * 1;
                                    var currentPage = ltP.index.groups[0].pages[cIndex];
                                    var chagePage = ltP.index.groups[0].pages[_this[0].index];

                                    ltP.index.$scope.$apply(function () {

                                        ltP.index.groups[0].pages[cIndex] = chagePage;

                                        ltP.index.groups[0].pages[_this[0].index] = currentPage;

                                    });
                                });
                        })
                    }
                }
            }
        }]).directive("flyPreFooter",["$location","zmitiService",function($location,zmitiService){
            return{
                restrict:"A",
                link:function(scope,element,attr){

                    var inputs=$("input",$(element));

                    var focusWidget = ltP.index.focusWidget;
                    var $scope = ltP.index.$scope;
                    //编辑
                    inputs.eq(0).on("tap",function(e){
                        //e.preventDefault();



                       scope.$parent.$apply(function(){

                           ltP.index.focusWidget = focusWidget;
                           ltP.index.$scope = $scope;
                           ltP.index.$scope.isShowDialog = false;

                       });
                        $location.path('/page');

                       /// return !1;

                    });

                    //翻页
                    $(inputs.eq(1)).tap(function(){
                        ltP.index.$scope.$apply(function(){
                            ltP.index.$scope.redirectTo("/page/flip");
                            ltP.index.$scope.goBackPath="/page/preview";
                        });
                    });
                    //背景音乐
                    $(inputs.eq(2)).tap(function(){
                        ltP.index.$scope.$apply(function(){
                            ltP.index.$scope.isAudio=false;
                            ltP.index.$scope.redirectTo("/audio/attr");
                            ltP.index.$scope.goBackPath="/page/preview";
                            if(!ltP.index.global.APP.bgSound){
                                var option = {
                                    id: ltP.index.zmitiService.getGuid(),
                                    name: '背景音乐',//组件名称。
                                    type: 'music',//组件类型
                                    src: "",
                                    autoplay: 'true',
                                    icoSrc: "",
                                    loop: 'true',
                                    backgroundPosition: '0 0',
                                    styles: {
                                    },
                                    isLocked: true,//是否锁定。
                                    events: [],//事件对象、默认为空
                                    animation: []//组件的动画
                                };
                                ltP.index.global.APP.bgSound = option;
                            }
                            ltP.index.zmitiService.setMusic();
                        });
                    });
                    //分享
                    $(inputs.eq(3)).tap(function(){
                        $(".fly-share").addClass("fly-share-active");
                    });
                    $("#cancel").tap(function(){
                        $(".fly-share").removeClass("fly-share-active");
                    });
                    //Loading
                    $(inputs.eq(4)).tap(function(){
                        ltP.index.$scope.$apply(function(){
                            ltP.index.$scope.redirectTo("/page/loading");
                            ltP.index.$scope.goBackPath="/page/preview";
                        });
                    });
                    //发布
                    $(inputs.eq(5)).tap(function(){
                        ltP.index.$scope.$apply(function(){
                            ltP.index.$scope.redirectTo("/page/projectSetting");
                            ltP.index.$scope.goBackPath="/page/preview";
                        });
                    });

                }
            }
        }]).directive("flyVideoTypeTitle", ["zmitiService",function (zmitiService) {
        return function (scope, element, attr) {
            var that = zmitiService;

            $("#fly-video-library-container .fly-video-btn input").on("tap",function(e){
                e.preventDefault();
                $(this).addClass("active").siblings().removeClass("active");
                var index = $(this).index();
                ltP.index.videoTypeIndex=-1;
                switch (index){
                    case 0://机构
                        ltP.index.videoTypeIndex=2;
                        that.loadingImgData(2,2,1,12,null,true,that.orgId);
                        that.loadingCateData(0,"orgId");
                        break;
                    case 1://个人
                        ltP.index.videoTypeIndex=1;
                        that.loadingCateData(0);
                        that.loadingImgData(1,2,1,12,null,true);
                        break;
                }
            });
            $(element).on("tap", function (e) {
                if (e.target.nodeName === "LI") {
                    var $Target = $(e.target);
                    $Target.addClass("active").siblings().removeClass("active");
                    var id = $Target.data("id");
                    zmitiService.loadingCateData(id);
                    zmitiService.loadingImgData(ltP.index.videoTypeIndex ? ltP.index.videoTypeIndex : 1, 2, 1, 12, id, true);
                }
                return !1;
            });
        };
    }]).directive("flyVideoTypeItems", ["zmitiService",function (zmitiService) {
        return function (scope, element, attr) {
            $(element).on("tap", function (e) {
                if (e.target.nodeName === "LI") {
                    var $Target = $(e.target);
                    $Target.addClass("active").siblings().removeClass("active");
                    var id = $Target.data("id");
                    zmitiService.loadingImgData(ltP.index.videoTypeIndex ? ltP.index.videoTypeIndex : 1, 2, 1, 12, id, true);
                }
                return !1;
            });
        };
    }]).directive("flyVideoItem", ["zmitiService",function (zmitiService) {
        return function (scope, element, attr) {
            $(element).on("tap", function (e) {
                if (e.target.nodeName === "IMG") {
                    $(e.target).addClass("active").parent().siblings().find("img").removeClass("active");
                }
                return !1;
            });
            $("#fly-video-library-container .btn-ok").on("tap",function(e){
                var img=$("#fly-video-library-container .fly-list-items").find("img[class='active']");
                var videoSrc=$(img).data("video");
                if(videoSrc){
                    ltP.index.focusWidget.src=videoSrc;
                }
                ltP.index.$scope.$apply(function () {
                    zmitiService.goBack();
                });
                return !1;
            });
            $("#fly-video-library-container .btn-clear").on("tap",function(e){
                $("#fly-video-library-container .fly-list-items").find("img").removeClass("active");
                return !1;
            });
        };
    }]);

    return derectiveModule;
});