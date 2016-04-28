/**
 * Created by lt-llj on 2015/12/30.
 */
!(function($,doc) {
    doc.ontouchmove = function (e) {
        e.preventDefault();
    }
    String.prototype.hump = function () {
        return this.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
    //返回
    $("#fly-back").tap(function () {
        H5Manager.deallocWebView();
    });
    var inputs = $("#pre-footer input");
    //编辑
    $(inputs.eq(0)).tap(function () {
        loadingStart();
        H5Manager.downloadProductionByID(productionID,function(pageId){
            loadingEnd();
            H5Manager.goEditViewController(pageId,"");
        });
        return !1;
    });
    //翻页
    $(inputs.eq(1)).tap(function () {
        loadingStart();
        H5Manager.downloadProductionByID(productionID,function(pageId){
            loadingEnd();
            H5Manager.goEditViewController(pageId,"/page/flip");
        });
        return !1;
    });
    //背景音乐
    $(inputs.eq(2)).tap(function () {
        loadingStart();
        H5Manager.downloadProductionByID(productionID,function(pageId){
            loadingEnd();
            H5Manager.goEditViewController(pageId,"/audio/attr");
        });
        return !1;
    });
    //分享
    $(inputs.eq(3)).tap(function () {
        loadingStart();
        PDMIRequestAgent.getRequest(self.proxyUrl + "/h5api/page/getShareInfo", { token: self.token,pageId:productionID}, function (response) {
            loadingEnd();
            if(response.code===200) {
                shareTitle = response.result.title;
                shareDesc = response.result.desc;
                shareImg = response.result.src;
                shareURL = response.result.url;
                $("#flyUrl").val(shareURL);
                $("#flyImg").attr("src", response.result.qrCode);
                $(".fly-share").addClass("fly-share-active");
            }
            else {
                AlertManager && AlertManager.alert({message: "服务器上没此作品，不能分享", buttons: [
                    {"cancel": "取消"}
                ]});
            }
        }, function (error) {
            loadingEnd();
            if(error.code===2000){
                AlertManager && AlertManager.alert({message: error.info, buttons: [
                    {"cancel": "取消"}
                ]});
                !AlertManager && alert(error.info);
            }
            else{
                H5Manager.log(error.info);
            }
        });
        return !1;
    });
    //调用原生分享组件,传入下面分享名字调用到相应的分享，例如传入UMShareToWechatSession，则分享到微信好友
    /**
     新浪微博 UMShareToSina;
     腾讯微博 UMShareToTencent;
     人人网 UMShareToRenren;
     豆瓣 UMShareToDouban;
     QQ空间 UMShareToQzone;
     邮箱 UMShareToEmail;
     短信 UMShareToSms;
     微信好友 UMShareToWechatSession;
     微信朋友圈 UMShareToWechatTimeline;
     微信收藏 UMShareToWechatFavorite;
     手机QQ UMShareToQQ;
     Facebook UMShareToFacebook;
     分享到Whatsapp
     */
    $(".production_share_right button").tap(function (e) {
        if (e.target.nodeName === "BUTTON") {
            var index = $(e.target).index();
            var UMSocialSnsType = index === 0 ? "UMShareToWechatTimeline" : (index === 1 ? "UMShareToWechatSession" : "UMShareToQQ");
            $(e.target).addClass("active").siblings().removeClass("active");
            H5Manager.share({'productionID': productionID, 'shareTitle': shareTitle, 'shareDesc': shareDesc, 'shareImg': shareImg, 'shareURL': shareURL, 'UMSocialSnsType': UMSocialSnsType})
        }
        return !1;
    });
    $("#cancel").tap(function () {
        $(".fly-share").removeClass("fly-share-active");
        return !1;
    });
    //Loading
    $(inputs.eq(4)).tap(function () {
        loadingStart();
        H5Manager.downloadProductionByID(productionID,function(pageId){
            loadingEnd();
            H5Manager.goEditViewController(pageId,"/page/loading");
        });
        return !1;
    });
    //发布
    $(inputs.eq(5)).tap(function () {
    });
    var productionID = -1;
    var shareTitle = "";
    var shareDesc = "";
    var shareImg = "";
    var shareURL = "";

    function loadingStart() {
        $("#fly-ajax-loading").css({opacity: 1, zIndex: 99999});
    };
    function loadingEnd() {
        $("#fly-ajax-loading").css({opacity: 0, zIndex: -11});
    };
    var self= {
        token: H5Manager.getUserInfo().userToken || -111,
        proxyUrl: "http://115.28.28.210:8083"
    };
    function initPreview(prevlewUrl, pageId) {
        productionID = pageId;
        var iframe = $("#iframe");
        iframe.height($(window).height() - 44);
        if (prevlewUrl.indexOf('http') > -1) {
            iframe.attr("src", prevlewUrl);
        }
        else {
            window.url=prevlewUrl;
            iframe.attr("src", "previewJson.html");
        }
    }
    window.initPreview = initPreview;
})(jQuery,document);
