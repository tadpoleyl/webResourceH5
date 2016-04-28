/**
 * Created by lt-llj on 2015/12/19.
 */
var appPicLibrary = angular.module("appPicLibrary", []);
appPicLibrary.provider("picService",function() {
    return {
        $get: function () {
            return {
                orgId: "4ca2082da088420fb561dcd18f7481b2",
                userId: H5Manager.getUserInfo().userID || -111,
                token: H5Manager.getUserInfo().userToken || -111,
                groupId: 0,
                proxyUrl: "http://115.28.28.210:8083",
                loadingStart: function () {
                    $("#fly-ajax-loading").css({opacity: 1, zIndex: 99999});
                },
                loadingEnd: function () {
                    $("#fly-ajax-loading").css({opacity: 0, zIndex: -11});
                },
                loadingCateData:function(parentId,type){
                    type === undefined && (type="userId");
                    H5Manager.log("request starting...");
                    var self= this;
                    ltP.index.$scope.$apply(function(){
                        ltP.index.$scope.typeItemList=[];
                        parentId === 0 && (ltP.index.$scope.typeTitle=[]);
                    });
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
                            }
                            else{
                                response.result.forEach(function(child){
                                    ltP.index.$scope.$apply(function(){
                                        ltP.index.$scope.typeItemList.push({name:child.groupName,id:child.groupId});
                                    });
                                });
                            }
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
                        },100);
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


                    ltP.index.$scope.picList.scroll = flyScroll($("#fly-pic-list .fly-list-items")[0], {
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


                    ltP.index.$scope.picList.scroll1 = flyScroll($("#fly-pic-list .fly-pic-list-items")[0], {
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
                },
                setNextAndPrev: function () {
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
                },
                clear:function(){
                    $("#fly-my-pic-list ul").find("img").removeClass("active");
                }
            }
        }
    };
});
var ltP={
    index:{}
};
window.ltP=ltP;
appPicLibrary.controller("picLibraryController",["$scope","picService",function($scope,picService){
    ltP.index.$scope=$scope;
    $scope.btnClass=true;
    $scope.picBtn=function(type) {
        $scope.btnClass = type === 1 ? false : true;
        picService.loadingImgData(2, 0, 1, 12, null, true, type === 1 ?  picService.orgId : "");
        return !1;
    };
    $scope.clearActive= function () {
        picService.clear();
    };
    $scope.init=function(){
        picService.loadingImgData(1,0,1,12);
        picService.loadingCateData(0);
        picService.setNextAndPrev();
    };
    $scope.init();
}]);
appPicLibrary.directive("flyPicItem", [function () {
    return function (scope, element, attr) {
        $(element).on("tap", function (e) {
            if (e.target.nodeName === "IMG") {
                $(e.target).addClass("active").parent().siblings().find("img").removeClass("active");
            }
        });
    };
}]).directive("flyPicTypeTitle", ["picService",function (picService) {
    return function (scope, element, attr) {
        $(element).on("tap", function (e) {
            if (e.target.nodeName === "LI") {
                var $Target = $(e.target);
                $Target.addClass("active").siblings().removeClass("active");
                var id = $Target.data("id");
                picService.loadingCateData(id);
                picService.loadingImgData(1,0,1,12,id,true);
            }
        });
    };
}]).directive("flyPicTypeItems", ["picService",function (picService) {
    return function (scope, element, attr) {
        $(element).on("tap", function (e) {
            e.preventDefault();
            if (e.target.nodeName === "LI") {
                var $Target = $(e.target);
                $Target.addClass("active").siblings().removeClass("active");
                var id = $Target.data("id");
                picService.loadingImgData(1,0,1,12,id,true);
            }
        });
    };
}]).directive("flyBack",[function(){
    return function(scope,element,attr){
        $(element).on("tap",function(e){
            H5Manager.deallocWebView();
        });
    };
}]);
angular.bootstrap(document,["appPicLibrary"]);