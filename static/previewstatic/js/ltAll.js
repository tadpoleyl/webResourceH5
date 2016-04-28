define("ltPage", [], function (require, exports, module) {

    var pageId = 0;
    var isOtherPage = false;
    function LtPage(option) {
        if (!option) return;
        var s = this;
        s.id = option.id || "";
        s.type = option.type || "page";
        s.displayName = option.displayName || "";
        s.parent = option.parent || $(document);
        s.styles = option.styles || {}; //页面的样式
        s.height = option.height;
        s.pageId = option.pageId || "";
        s.showType = option.showType || "swipe";//页面展示方式，默认为滑动
        s.pageChangeType = option.pageChangeType || "goUp";
        s.orderPageNum = pageId;//页面序号
        s.orderGroupNum = pageId;//群组序号
        s.transitionDuration = option.transitionDuration || "1s";
        s.transitionTimingFunction = option.transitionTimingFunction || "cubic-bezier(0.215, 0.610, 0.355, 1.000)";
        s.transitionDelay = option.transitionDelay || "0s";
        s.transitionEnd = option.transitionEnd || 1;
        s.keyFrames = option.keyFrames || "";

        s.create();
        s.target = $("." + s.pageId);
        if (s.styles.animationName && s.styles.animationName !== "none") {
            var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
            var keyFrames = "";
            var iWidth = 320,
                iHeight = 568;
            var img = new Image();
            img.addEventListener("load", function () {
                var width = this.width,
                    height = this.height;
                if (device) {
                    iWidth = document.documentElement.clientWidth,
                        iHeight = document.documentElement.clientHeight;
                }
                var lastWidth = 0, lastHeight = 0;
                if (s.styles.animationName.indexOf("bgMoveX") > -1) {
                    lastWidth= width / height * iHeight;
                    lastHeight = iHeight;
                }
                else {
                    lastWidth = iWidth;
                    lastHeight = height / width * iWidth;

                }
                s.target.find(".bg-img").css({ width: lastWidth, height: lastHeight});

                var keyFrames = "@keyframes bgMoveY" + s.pageId + "{\
                                100%{\
                                    transform:translate3d(0," + (iHeight - lastHeight) + "px,0);\
                                }\
                            }\
                            @keyframes bgMoveX" + s.pageId + " {\
                                100%{\
                                    transform:translate3d(" + (iWidth - lastWidth) + "px,0,0);\
                                }\
                            }\
                            @-webkit-keyframes bgMoveY" + s.pageId + "{\
                                100%{\
                                    -webkit-transform:translate3d(0," + (iHeight - lastHeight) + "px,0);\
                                }\
                            }\
                            @-webkit-keyframes bgMoveX" + s.pageId + " {\
                                100%{\
                                    -webkit-transform:translate3d(" + (iWidth - lastWidth) + "px,0,0);\
                                }\
                            }";
                keyFrames += "#" + s.pageId + " .lt-img-move{ -webkit-animation-name:" + s.styles.animationName + ";\
                                           -webkit-animation-duration:" + s.styles.animationDuration + "s;\
                                           -webkit-animation-timing-function: " + s.styles.animationTimingFunction + "; \
                                           -webkit-animation-iteration-count: " + s.styles.animationIterationCount + "; \
                                           -webkit-animation-direction: " + s.styles.animationDirection + ";\
                                           animation-name:" + s.styles.animationName + ";\
                                           animation-duration:" + s.styles.animationDuration + "s;\
                                           animation-timing-function: " + s.styles.animationTimingFunction + "; \
                                           animation-iteration-count: " + s.styles.animationIterationCount + "; \
                                           animation-direction: " + s.styles.animationDirection + "}";
                $("#style").append(keyFrames);


            });
            img.src = s.styles["background-image"];
        }

    }
    var d = document.createElement("div");
    var isStylePro = function (style) {
        return d.style[style] === undefined;
    }
    LtPage.prototype.create = function () {//创建一个页面。
        pageId++;
        var s = this;
        var oPage = "";
        var select = "";
        if (s.type === "singlepage") {

            oPage = "<figure id='" + s.pageId + "'  class='page  " + s.pageId + "' data-type='" + s.type + "' style='overflow:hidden'>\
                        <div class='page_container'></div></figure>";
            if (s.styles["background-image"] && (!s.styles.animationName || s.styles.animationName === "none")) {
                select = "." + s.pageId + " .page_container{width:100%;height:" + s.height + ";position:absolute;left:0;top:0;background:url(" + s.styles["background-image"] + ");background-position:" + s.styles.backgroundPosition + ";background-repeat:" + s.styles.backgroundRepeat + ";background-size:" + s.styles.backgroundSize + "}." + s.pageId + "{";
            }
            else {
                select = "." + s.pageId + " .page_container{width:100%;height:" + s.height + ";position:absolute;left:0;top:0;}." + s.pageId + "{";
            }
        }
        else if (s.type === "page") {
            if (s.styles.animationName && s.styles.animationName !== "none") {//有背景移动的动画。
                oPage = "<figure id='" + s.pageId + "' data-pageChangeType='" + s.pageChangeType + "' data-type='" + s.type + "'  data-transitionEnd='" + s.transitionEnd + "'  data-showtype='" + s.showType + "' class='page  " + s.pageId + "'>\
                                <div class='page_bg'></div><img class='bg-img lt-img-move' src='" + s.styles["background-image"] + "' \
                                    style=' position: absolute; left: 0px; top: 0px; max-width: none; '><div class='page_container'></div></figure>";
            } else {
                oPage = "<figure id='" + s.pageId + "' data-pageChangeType='" + s.pageChangeType + "' data-type='" + s.type + "'  data-transitionEnd='" + s.transitionEnd + "'  data-showtype='" + s.showType + "' class='page  " + s.pageId + "'><div class='page_bg'></div><div class='page_container'></div></figure>";
            }
            if (s.styles["background-image"] && (!s.styles.animationName || s.styles.animationName === "none")) {
                select = "." + s.pageId + " .page_bg{width:100%;height:100%;position:absolute;left:0;top:0;background:url(" + s.styles["background-image"] + ");background-position:" + s.styles.backgroundPosition + ";background-repeat:" + s.styles.backgroundRepeat + ";background-size:" + s.styles.backgroundSize + "}." + s.pageId + " .page_container{width:100%;height:100%;position:absolute;left:0;top:0}." + s.pageId + "{";
            }
            else {
                select = "." + s.pageId + " .page_container{width:100%;height:100%;position:absolute;left:0;top:0;}." + s.pageId + "{";
            }
        }

        var style = "";
        for (var attr in s.styles) {
            var attr1 = attr.hump();
            if (attr === "animationName" || attr === "animationTimingFunction" || attr === "animationDuration" || attr === "animationIterationCount") {
                continue;//
            }
            if (attr === "background-image" || isStylePro(attr)) {
                continue;
            }
            else if (attr === "opacity") {
                style += attr1 + ":" + s.styles[attr] * 1 / 100 + ";";
            }
            else {
                style += attr1 + ":" + s.styles[attr] + ";";
            }
        }
        var selectEnd = "}";
        $("#style").append((select + style + selectEnd));

        if (pageId === 1) {
            isOtherPage = $(".page").size() > 0
        }

        if (isOtherPage) {
            $(oPage).insertBefore($(".page").eq(0))
        }
        else {
            s.parent.append(oPage);
        }
        s.createInfo();
    };
    LtPage.prototype.createInfo = function () { //创建提示图标。
        var s = this;
        var span = '<span class="info"></span>';
        $("#" + s.pageId).append(span);
    }


    function _$(option) {
        return new LtPage(option)
    }
    return _$;
});
define("ltWidget",[], function (require, exports, module) {
    var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
    var scale = 1;
    // device && (scale = document.documentElement.clientHeight / 568);


    function ltWidget(option, className) {
        var s = this;
        s.id = "preview_" + option.id || "";
        s.type = option.type || "";
        s.name = option.name || "";
        s.styles = option.styles || {};

        //s.position = option.position || "absolute";
        s.parent = option.parent || $(document);
        //s.classList = option.classList || "";
        // s.events = option.events || [];
        s.showType = option.showType || "together";//组件出现的场景1，together:和依赖的组件一起。2、after:在依赖的组件之后（依赖的组件默认为page页面。）

    }
    var d = document.createElement("div");
    var isStylePro = function (style) {
        return d.style[style] === undefined;
    }
    ltWidget.prototype.setStyle = function (className) {
        var s = this;
        var style = "." + className + "\
            {\
            backface-visibility:hidden;";

        for (var attr in s.styles) {
            if (attr === "left" || attr === "top" || attr==="zIndex" || attr === "right" || attr === "bottom" || isStylePro(attr) || attr === "position" || (attr === "backgroundColor" && s.type === "line")) {
                continue;
            }
            var attr1 = attr.hump();
            if  (attr === "width"|| attr === "height") {
                //if (attr === "top" || attr === "width" || attr === "height") {
                //    s.styles[attr] = parseFloat(s.styles[attr]) * 1 + "rem";
                //    if (attr === "top") {
                //        // alert(s.styles[attr])
                //    }
                //} else {
                //    s.styles[attr] = parseFloat(s.styles[attr]) + "rem";
                //}
                s.styles[attr] = parseFloat(s.styles[attr]) * 1 + "rem";
                style += attr1 + ":" + s.styles[attr] + ";";
            }
            else if (attr1 === "line-height") {
                style += attr1 + ":" + s.styles[attr] + "px;";
            }
            else if (attr === "opacity") {
                style += attr + ":" + s.styles[attr] / 100 + ";";
            }
            else if (attr1 === "border-radius") {
                style += attr1 + ":" + s.styles[attr] + "%;";
            }
            else if (attr1 === "z-index") {
                style += attr1 + ":" + s.styles[attr] + ";";
            }
            else {
                style += attr1 + ":" + s.styles[attr] + ";";
            }
        }
        style += "}";

        style += ".widgetParent" + className + "{";

        for (var attr in s.styles) {
            var attr1 = attr.hump();
            if (attr === "left" || attr === "top" || attr === "right" || attr === "bottom" || attr === "height"|| attr === "width") {
                s.styles[attr] = parseFloat(s.styles[attr]) + "rem";
                style += attr1 + ":" + s.styles[attr] + ";";
            }
            else if (attr1 === "z-index") {
                style += attr1 + ":" + s.styles[attr] + ";";
            }
            else if (attr === "position") {
                style += attr1 + ":" + s.styles[attr] + ";";
            }
        }
        $("#style").append(style + "}");

        s.type === "image" && $("." + className);
    };
    function _$(option) {
        return new ltWidget(option)
    }
    return _$;

});
define("ltImage", ["ltWidget"], function (widget, exports, module) {//图片对象
    var imageId = 0;

    function LtImage(option) {
        if (!option) { return; }

        var s = this;
        s.src = option.src || "";
        s.href = option.href || "#";
        s.alt = option.alt || "";
        s.hrefIndex = option.hrefIndex || -1;



        var a = widget.call(s, option, "img" + imageId);
        for (var attr in a) {
            s[attr] = a[attr];
        }

        s.append();

        s.setStyle('img' + imageId);

        s.target = $('.img' + imageId);
        s.classNames = option.classNames || "";
        s.animationEnd = "webkitAnimationEnd";
    }

    LtImage.prototype.setStyle = widget.prototype.setStyle;

//    LtImage.prototype.append = function () {
//        imageId++;
//        var s = this;
//        var img_container = "";
//        if (s.href !== "#" && s.hrefIndex === -1) {
//            img_container = $("<div id='" + s.id + "'  data-showtype='" + s.showType + "'  data-id='" + s.id + "' data-type='" + s.type + "' class='ltimg ltwidget widgetParentimg" + imageId + "'><a href='" + s.href + "'><img src='" + s.src + "' class='img" + imageId + "' alt='" + s.alt + "'/></a></div>");
//        } else {
//            img_container = $("<div id='" + s.id + "'  data-showtype='" + s.showType + "'  data-id='" + s.id + "' data-type='" + s.type + "' class='ltimg ltwidget widgetParentimg" + imageId + "'><img src='" + s.src + "' class='img" + imageId + "' alt='" + s.alt + "'/></div>");
//        }
//        s.parent.append(img_container);
//
//    }

    LtImage.prototype.append = function () {
        imageId++;
        var s = this;
        var img_container = "";
        if (s.href.charAt(0) !== "#" && s.hrefIndex === -1) {
            img_container = $("<div id='" + s.id + "'  data-showtype='" + s.showType + "'  data-id='" + s.id + "' data-type='" + s.type + "' class='ltimg ltwidget widgetParentimg" + imageId + "'><a href='" + s.href + "'><img src='" + s.src + "' class='img" + imageId + "' alt='" + s.alt + "'/></a></div>");
        } else {
            img_container = $("<div id='" + s.id + "'  data-showtype='" + s.showType + "'  data-id='" + s.id + "' data-type='" + s.type + "' class='ltimg ltwidget widgetParentimg" + imageId + "'><img src='" + s.src + "' class='img" + imageId + "' alt='" + s.alt + "'/></div>");
        }
        s.parent.append(img_container);

    }


    function _$(option) {
        return new LtImage(option)
    }
    //exports.LtImage = _$;
    return _$;
});
define("ltTextField", ["ltWidget"], function (widget, exports, module) {
    var textFieldId = 0;
    function LtTextField(option) {

        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "text" + textFieldId);
        s.text = option.text || "";
        s.href = option.href || "";
        s.animationEnd = "webkitAnimationEnd";
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.append();
        s.setStyle('text' + textFieldId);
        s.target = $(".text" + textFieldId);

    }
    LtTextField.prototype.setStyle = widget.prototype.setStyle;
    LtTextField.prototype.append = function () {
        textFieldId++;
        var s = this;
        var text_container = $("<div id='" + s.id + "'   class='lttext ltwidget widgetParenttext" + textFieldId + "'><div class='text" + textFieldId + "'><p>" + s.text + "</p></div></div>");

        if (s.href) {//如果有链接，主要针对移动端
            text_container = $("<div id='" + s.id + "'   class='lttext ltwidget widgetParenttext" + textFieldId + "'><div class='text" + textFieldId + "'><p><a href='" + s.href + "'" + s.text + "</a></p></div></div>");
        }

        s.parent.append(text_container);
        if ($(".text" + textFieldId).parents(".page_container").parent().data("type") === "page") {
            if (s.styles.rotate <= 0) {
                $(".text" + textFieldId).parent().css("overflow", "hidden");
            }
            else {
                $(".text" + textFieldId).css("overflow", "hidden");
            }
        }
        s.styles.rotate > 0 && $(".text" + textFieldId).parent().css("-webkit-transform", "rotate(" + s.styles.rotate + "deg) translate3d(700px,0,0)");
    };
    function _$(option) {
        return new LtTextField(option)
    }
    //exports.LtTextField = _$;
    return _$;

});
define("ltAnimation",[],function (require, exports, module) {
    function ltAnimation(option) {
        var s = this;
        s.type = option.type || "animation";//类型
        s.animationName = option.animationName || "";//动画名称
        s.animationDuration = option.animationDuration || "1s";
        s.animationTimingFunction = option.animationTimingFunction || "ease-in";//动画运动形式
        s.animationDelay = option.animationDelay || 0;//动画延迟时间
        s.animationIterationCount = option.animationIterationCount || 1;//动画播放次数。
        s.animationFillMode = option.animationFillMode || "forwards";//
        s.triggerType = option.triggerType || "after";//触发方式
        s.id = option.id || "";
    }

    ltAnimation.prototype.bind = function (oStyle) {//将动画对象绑定到组件元素上。
        var s = this;
        var style = "";
        style += "." + s.animationName + s.id + "{\
                    -webkit-animation-name:" + s.animationName + ";\
                    -webkit-animation-delay:" + s.animationDelay + "s;\
                    -webkit-animation-duration:" + s.animationDuration + "s;\
                    -webkit-animation-fill-mode:" + s.animationFillMode + ";\
                    -webkit-animation-iteration-count:" + s.animationIterationCount + ";\
                    -webkit-animation-timing-function:" + s.animationTimingFunction + ";\
                    animation-name:" + s.animationName + ";\
                    animation-delay:" + s.animationDelay + "s;\
                    animation-duration:" + s.animationDuration + "s;\
                    animation-fill-mode:" + s.animationFillMode + ";\
                    animation-iteration-count:" + s.animationIterationCount + ";\
                    animation-timing-function:" + s.animationTimingFunction + ";\
                }";
        oStyle.append(style);
    }

    function _$(option) {
        return new ltAnimation(option);
    }

    // exports.ltAnimation = _$;
    return _$;
});
define("qrcode", [], function (require, exports, module) {
    /*from tccdn minify at 2014-6-4 14:59:43,file：/cn/c/c/qrcode.js*/
    /**
     * @fileoverview
     * - Using the 'QRCode for Javascript library'
     * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
     * - this library has no dependencies.
     *
     * @author davidshimjs
     * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
     * @see <a href="http://jeromeetienne.github.com/jquery-qrcode/" target="_blank">http://jeromeetienne.github.com/jquery-qrcode/</a>
     */
    var QRCode;

    //---------------------------------------------------------------------
    // QRCode for JavaScript
    //
    // Copyright (c) 2009 Kazuhiko Arase
    //
    // URL: http://www.d-project.com/
    //
    // Licensed under the MIT license:
    //   http://www.opensource.org/licenses/mit-license.php
    //
    // The word "QR Code" is registered trademark of
    // DENSO WAVE INCORPORATED
    //   http://www.denso-wave.com/qrcode/faqpatent-e.html
    //
    //---------------------------------------------------------------------
    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
        this.parsedData = [];

        // Added to support UTF-8 Characters
        for (var i = 0, l = this.data.length; i < l; i++) {
            var byteArray = [];
            var code = this.data.charCodeAt(i);

            if (code > 0x10000) {
                byteArray[0] = 0xF0 | ((code & 0x1C0000) >>> 18);
                byteArray[1] = 0x80 | ((code & 0x3F000) >>> 12);
                byteArray[2] = 0x80 | ((code & 0xFC0) >>> 6);
                byteArray[3] = 0x80 | (code & 0x3F);
            } else if (code > 0x800) {
                byteArray[0] = 0xE0 | ((code & 0xF000) >>> 12);
                byteArray[1] = 0x80 | ((code & 0xFC0) >>> 6);
                byteArray[2] = 0x80 | (code & 0x3F);
            } else if (code > 0x80) {
                byteArray[0] = 0xC0 | ((code & 0x7C0) >>> 6);
                byteArray[1] = 0x80 | (code & 0x3F);
            } else {
                byteArray[0] = code;
            }

            this.parsedData.push(byteArray);
        }

        this.parsedData = Array.prototype.concat.apply([], this.parsedData);

        if (this.parsedData.length != this.data.length) {
            this.parsedData.unshift(191);
            this.parsedData.unshift(187);
            this.parsedData.unshift(239);
        }
    }

    QR8bitByte.prototype = {
        getLength: function (buffer) {
            return this.parsedData.length;
        },
        write: function (buffer) {
            for (var i = 0, l = this.parsedData.length; i < l; i++) {
                buffer.put(this.parsedData[i], 8);
            }
        }
    };

    function QRCodeModel(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataCache = null;
        this.dataList = [];
    }

    function QRPolynomial(num, shift) {
        if (num.length == undefined) throw new Error(num.length + "/" + shift);
        var offset = 0;
        while (offset < num.length && num[offset] == 0) offset++;
        this.num = new Array(num.length - offset + shift);
        for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset];
    }

    function QRRSBlock(totalCount, dataCount) {
        this.totalCount = totalCount, this.dataCount = dataCount;
    }

    function QRBitBuffer() {
        this.buffer = [], this.length = 0;
    }

    QRCodeModel.prototype = {
        "addData": function (data) {
            var newData = new QR8bitByte(data);
            this.dataList.push(newData), this.dataCache = null;
        },
        "isDark": function (row, col) {
            if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) throw new Error(row + "," + col);
            return this.modules[row][col];
        },
        "getModuleCount": function () {
            return this.moduleCount;
        },
        "make": function () {
            this.makeImpl(!1, this.getBestMaskPattern());
        },
        "makeImpl": function (test, maskPattern) {
            this.moduleCount = this.typeNumber * 4 + 17, this.modules = new Array(this.moduleCount);
            for (var row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null;
            }
            this.setupPositionProbePattern(0, 0),
                this.setupPositionProbePattern(this.moduleCount - 7, 0),
                this.setupPositionProbePattern(0, this.moduleCount - 7),
                this.setupPositionAdjustPattern(), this.setupTimingPattern(),
                this.setupTypeInfo(test, maskPattern),
            this.typeNumber >= 7 && this.setupTypeNumber(test),
            this.dataCache == null && (this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)), this.mapData(this.dataCache, maskPattern);
        },
        "setupPositionProbePattern": function (row, col) {
            for (var r = -1; r <= 7; r++) {
                if (row + r <= -1 || this.moduleCount <= row + r) continue;
                for (var c = -1; c <= 7; c++) {
                    if (col + c <= -1 || this.moduleCount <= col + c) continue;
                    0 <= r && r <= 6 && (c == 0 || c == 6) || 0 <= c && c <= 6 && (r == 0 || r == 6) || 2 <= r && r <= 4 && 2 <= c && c <= 4 ? this.modules[row + r][col + c] = !0 : this.modules[row + r][col + c] = !1;
                }
            }
        },
        "getBestMaskPattern": function () {
            var minLostPoint = 0, pattern = 0;
            for (var i = 0; i < 8; i++) {
                this.makeImpl(!0, i);
                var lostPoint = QRUtil.getLostPoint(this);
                if (i == 0 || minLostPoint > lostPoint) minLostPoint = lostPoint, pattern = i;
            }
            return pattern;
        },
        "createMovieClip": function (target_mc, instance_name, depth) {
            var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth), cs = 1;
            this.make();
            for (var row = 0; row < this.modules.length; row++) {
                var y = row * cs;
                for (var col = 0; col < this.modules[row].length; col++) {
                    var x = col * cs, dark = this.modules[row][col];
                    dark && (qr_mc.beginFill(0, 100), qr_mc.moveTo(x, y), qr_mc.lineTo(x + cs, y), qr_mc.lineTo(x + cs, y + cs), qr_mc.lineTo(x, y + cs), qr_mc.endFill());
                }
            }
            return qr_mc;
        },
        "setupTimingPattern": function () {
            for (var r = 8; r < this.moduleCount - 8; r++) {
                if (this.modules[r][6] != null) continue;
                this.modules[r][6] = r % 2 == 0;
            }
            for (var c = 8; c < this.moduleCount - 8; c++) {
                if (this.modules[6][c] != null) continue;
                this.modules[6][c] = c % 2 == 0;
            }
        },
        "setupPositionAdjustPattern": function () {
            var pos = QRUtil.getPatternPosition(this.typeNumber);
            for (var i = 0; i < pos.length; i++) for (var j = 0; j < pos.length; j++) {
                var row = pos[i], col = pos[j];
                if (this.modules[row][col] != null) continue;
                for (var r = -2; r <= 2; r++) for (var c = -2; c <= 2; c++) r == -2 || r == 2 || c == -2 || c == 2 || r == 0 && c == 0 ? this.modules[row + r][col + c] = !0 : this.modules[row + r][col + c] = !1;
            }
        },
        "setupTypeNumber": function (test) {
            var bits = QRUtil.getBCHTypeNumber(this.typeNumber);
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod;
            }
            for (var i = 0; i < 18; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        },
        "setupTypeInfo": function (test, maskPattern) {
            var data = this.errorCorrectLevel << 3 | maskPattern, bits = QRUtil.getBCHTypeInfo(data);
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                i < 6 ? this.modules[i][8] = mod : i < 8 ? this.modules[i + 1][8] = mod : this.modules[this.moduleCount - 15 + i][8] = mod;
            }
            for (var i = 0; i < 15; i++) {
                var mod = !test && (bits >> i & 1) == 1;
                i < 8 ? this.modules[8][this.moduleCount - i - 1] = mod : i < 9 ? this.modules[8][15 - i - 1 + 1] = mod : this.modules[8][15 - i - 1] = mod;
            }
            this.modules[this.moduleCount - 8][8] = !test;
        },
        "mapData": function (data, maskPattern) {
            var inc = -1, row = this.moduleCount - 1, bitIndex = 7, byteIndex = 0;
            for (var col = this.moduleCount - 1; col > 0; col -= 2) {
                col == 6 && col--;
                for (; ;) {
                    for (var c = 0; c < 2; c++) if (this.modules[row][col - c] == null) {
                        var dark = !1;
                        byteIndex < data.length && (dark = (data[byteIndex] >>> bitIndex & 1) == 1);
                        var mask = QRUtil.getMask(maskPattern, row, col - c);
                        mask && (dark = !dark), this.modules[row][col - c] = dark, bitIndex--, bitIndex == -1 && (byteIndex++, bitIndex = 7);
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) {
                        row -= inc, inc = -inc;
                        break;
                    }
                }
            }
        }
    }, QRCodeModel.PAD0 = 236, QRCodeModel.PAD1 = 17, QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
        var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel), buffer = new QRBitBuffer;
        for (var i = 0; i < dataList.length; i++) {
            var data = dataList[i];
            buffer.put(data.mode, 4), buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)), data.write(buffer);
        }
        var totalDataCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
        if (buffer.getLengthInBits() > totalDataCount * 8) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + totalDataCount * 8 + ")");
        buffer.getLengthInBits() + 4 <= totalDataCount * 8 && buffer.put(0, 4);
        while (buffer.getLengthInBits() % 8 != 0) buffer.putBit(!1);
        for (; ;) {
            if (buffer.getLengthInBits() >= totalDataCount * 8) break;
            buffer.put(QRCodeModel.PAD0, 8);
            if (buffer.getLengthInBits() >= totalDataCount * 8) break;
            buffer.put(QRCodeModel.PAD1, 8);
        }
        return QRCodeModel.createBytes(buffer, rsBlocks);
    }, QRCodeModel.createBytes = function (buffer, rsBlocks) {
        var offset = 0, maxDcCount = 0, maxEcCount = 0, dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length);
        for (var r = 0; r < rsBlocks.length; r++) {
            var dcCount = rsBlocks[r].dataCount, ecCount = rsBlocks[r].totalCount - dcCount;
            maxDcCount = Math.max(maxDcCount, dcCount), maxEcCount = Math.max(maxEcCount, ecCount), dcdata[r] = new Array(dcCount);
            for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
            offset += dcCount;
            var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount), rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1), modPoly = rawPoly.mod(rsPoly);
            ecdata[r] = new Array(rsPoly.getLength() - 1);
            for (var i = 0; i < ecdata[r].length; i++) {
                var modIndex = i + modPoly.getLength() - ecdata[r].length;
                ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0;
            }
        }
        var totalCodeCount = 0;
        for (var i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
        var data = new Array(totalCodeCount), index = 0;
        for (var i = 0; i < maxDcCount; i++) for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
        for (var i = 0; i < maxEcCount; i++) for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
        return data;
    };

    var QRMode = {
        "MODE_NUMBER": 1,
        "MODE_ALPHA_NUM": 2,
        "MODE_8BIT_BYTE": 4,
        "MODE_KANJI": 8
    }, QRErrorCorrectLevel = {
        "L": 1,
        "M": 0,
        "Q": 3,
        "H": 2
    }, QRMaskPattern = {
        "PATTERN000": 0,
        "PATTERN001": 1,
        "PATTERN010": 2,
        "PATTERN011": 3,
        "PATTERN100": 4,
        "PATTERN101": 5,
        "PATTERN110": 6,
        "PATTERN111": 7
    }, QRUtil = {
        "PATTERN_POSITION_TABLE": [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
        "G15": 1335,
        "G18": 7973,
        "G15_MASK": 21522,
        "getBCHTypeInfo": function (data) {
            var d = data << 10;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
            return (data << 10 | d) ^ QRUtil.G15_MASK;
        },
        "getBCHTypeNumber": function (data) {
            var d = data << 12;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
            return data << 12 | d;
        },
        "getBCHDigit": function (data) {
            var digit = 0;
            while (data != 0) digit++, data >>>= 1;
            return digit;
        },
        "getPatternPosition": function (typeNumber) {
            return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        },
        "getMask": function (maskPattern, i, j) {
            switch (maskPattern) {
                case QRMaskPattern.PATTERN000:
                    return (i + j) % 2 == 0;
                case QRMaskPattern.PATTERN001:
                    return i % 2 == 0;
                case QRMaskPattern.PATTERN010:
                    return j % 3 == 0;
                case QRMaskPattern.PATTERN011:
                    return (i + j) % 3 == 0;
                case QRMaskPattern.PATTERN100:
                    return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                case QRMaskPattern.PATTERN101:
                    return i * j % 2 + i * j % 3 == 0;
                case QRMaskPattern.PATTERN110:
                    return (i * j % 2 + i * j % 3) % 2 == 0;
                case QRMaskPattern.PATTERN111:
                    return (i * j % 3 + (i + j) % 2) % 2 == 0;
                default:
                    throw new Error("bad maskPattern:" + maskPattern);
            }
        },
        "getErrorCorrectPolynomial": function (errorCorrectLength) {
            var a = new QRPolynomial([1], 0);
            for (var i = 0; i < errorCorrectLength; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
            return a;
        },
        "getLengthInBits": function (mode, type) {
            if (1 <= type && type < 10) switch (mode) {
                case QRMode.MODE_NUMBER:
                    return 10;
                case QRMode.MODE_ALPHA_NUM:
                    return 9;
                case QRMode.MODE_8BIT_BYTE:
                    return 8;
                case QRMode.MODE_KANJI:
                    return 8;
                default:
                    throw new Error("mode:" + mode);
            } else if (type < 27) switch (mode) {
                case QRMode.MODE_NUMBER:
                    return 12;
                case QRMode.MODE_ALPHA_NUM:
                    return 11;
                case QRMode.MODE_8BIT_BYTE:
                    return 16;
                case QRMode.MODE_KANJI:
                    return 10;
                default:
                    throw new Error("mode:" + mode);
            } else {
                if (!(type < 41)) throw new Error("type:" + type);
                switch (mode) {
                    case QRMode.MODE_NUMBER:
                        return 14;
                    case QRMode.MODE_ALPHA_NUM:
                        return 13;
                    case QRMode.MODE_8BIT_BYTE:
                        return 16;
                    case QRMode.MODE_KANJI:
                        return 12;
                    default:
                        throw new Error("mode:" + mode);
                }
            }
        },
        "getLostPoint": function (qrCode) {
            var moduleCount = qrCode.getModuleCount(), lostPoint = 0;
            for (var row = 0; row < moduleCount; row++) for (var col = 0; col < moduleCount; col++) {
                var sameCount = 0, dark = qrCode.isDark(row, col);
                for (var r = -1; r <= 1; r++) {
                    if (row + r < 0 || moduleCount <= row + r) continue;
                    for (var c = -1; c <= 1; c++) {
                        if (col + c < 0 || moduleCount <= col + c) continue;
                        if (r == 0 && c == 0) continue;
                        dark == qrCode.isDark(row + r, col + c) && sameCount++;
                    }
                }
                sameCount > 5 && (lostPoint += 3 + sameCount - 5);
            }
            for (var row = 0; row < moduleCount - 1; row++) for (var col = 0; col < moduleCount - 1; col++) {
                var count = 0;
                qrCode.isDark(row, col) && count++, qrCode.isDark(row + 1, col) && count++, qrCode.isDark(row, col + 1) && count++, qrCode.isDark(row + 1, col + 1) && count++;
                if (count == 0 || count == 4) lostPoint += 3;
            }
            for (var row = 0; row < moduleCount; row++) for (var col = 0; col < moduleCount - 6; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
            for (var col = 0; col < moduleCount; col++) for (var row = 0; row < moduleCount - 6; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
            var darkCount = 0;
            for (var col = 0; col < moduleCount; col++) for (var row = 0; row < moduleCount; row++) qrCode.isDark(row, col) && darkCount++;
            var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
            return lostPoint += ratio * 10, lostPoint;
        }
    }, QRMath = {
        "glog": function (n) {
            if (n < 1) throw new Error("glog(" + n + ")");
            return QRMath.LOG_TABLE[n];
        },
        "gexp": function (n) {
            while (n < 0) n += 255;
            while (n >= 256) n -= 255;
            return QRMath.EXP_TABLE[n];
        },
        "EXP_TABLE": new Array(256),
        "LOG_TABLE": new Array(256)
    };

    for (var i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i;

    for (var i = 8; i < 256; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];

    for (var i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;

    QRPolynomial.prototype = {
        "get": function (index) {
            return this.num[index];
        },
        "getLength": function () {
            return this.num.length;
        },
        "multiply": function (e) {
            var num = new Array(this.getLength() + e.getLength() - 1);
            for (var i = 0; i < this.getLength() ; i++) for (var j = 0; j < e.getLength() ; j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
            return new QRPolynomial(num, 0);
        },
        "mod": function (e) {
            if (this.getLength() - e.getLength() < 0) return this;
            var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)), num = new Array(this.getLength());
            for (var i = 0; i < this.getLength() ; i++) num[i] = this.get(i);
            for (var i = 0; i < e.getLength() ; i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
            return (new QRPolynomial(num, 0)).mod(e);
        }
    }, QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]], QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
        var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
        if (rsBlock == undefined) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
        var length = rsBlock.length / 3, list = [];
        for (var i = 0; i < length; i++) {
            var count = rsBlock[i * 3 + 0], totalCount = rsBlock[i * 3 + 1], dataCount = rsBlock[i * 3 + 2];
            for (var j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount));
        }
        return list;
    }, QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
        switch (errorCorrectLevel) {
            case QRErrorCorrectLevel.L:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
            case QRErrorCorrectLevel.M:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
            case QRErrorCorrectLevel.Q:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
            case QRErrorCorrectLevel.H:
                return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
            default:
                return undefined;
        }
    }, QRBitBuffer.prototype = {
        "get": function (index) {
            var bufIndex = Math.floor(index / 8);
            return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) == 1;
        },
        "put": function (num, length) {
            for (var i = 0; i < length; i++) this.putBit((num >>> length - i - 1 & 1) == 1);
        },
        "getLengthInBits": function () {
            return this.length;
        },
        "putBit": function (bit) {
            var bufIndex = Math.floor(this.length / 8);
            this.buffer.length <= bufIndex && this.buffer.push(0), bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8), this.length++;
        }
    };
    var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]];

    function _isSupportCanvas() {
        return typeof CanvasRenderingContext2D != "undefined";
    }

    // android 2.x doesn't support Data-URI spec
    function _getAndroid() {
        var android = false;
        var sAgent = navigator.userAgent;

        if (/android/i.test(sAgent)) { // android
            android = true;
            aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i);

            if (aMat && aMat[1]) {
                android = parseFloat(aMat[1]);
            }
        }

        return android;
    }

    var svgDrawer = (function () {

        var Drawing = function (el, htOption) {
            this._el = el;
            this._htOption = htOption;
        };

        Drawing.prototype.draw = function (oQRCode) {
            var _htOption = this._htOption;
            var _el = this._el;
            var nCount = oQRCode.getModuleCount();
            var nWidth = Math.floor(_htOption.width / nCount);
            var nHeight = Math.floor(_htOption.height / nCount);

            this.clear();

            function makeSVG(tag, attrs) {
                var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                for (var k in attrs)
                    if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
                return el;
            }

            var svg = makeSVG("svg", { 'viewBox': '0 0 ' + String(nCount) + " " + String(nCount), 'width': '100%', 'height': '100%', 'fill': _htOption.colorLight });
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            _el.appendChild(svg);

            svg.appendChild(makeSVG("rect", { "fill": _htOption.colorDark, "width": "1", "height": "1", "id": "template" }));

            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    if (oQRCode.isDark(row, col)) {
                        var child = makeSVG("use", { "x": String(row), "y": String(col) });
                        child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template")
                        svg.appendChild(child);
                    }
                }
            }
        };
        Drawing.prototype.clear = function () {
            while (this._el.hasChildNodes())
                this._el.removeChild(this._el.lastChild);
        };
        return Drawing;
    })();

    var useSVG = document.documentElement.tagName.toLowerCase() === "svg";

    // Drawing in DOM by using Table tag
    var Drawing = useSVG ? svgDrawer : !_isSupportCanvas() ? (function () {
        var Drawing = function (el, htOption) {
            this._el = el;
            this._htOption = htOption;
        };

        /**
         * Draw the QRCode
         *
         * @param {QRCode} oQRCode
         */
        Drawing.prototype.draw = function (oQRCode) {
            var _htOption = this._htOption;
            var _el = this._el;
            var nCount = oQRCode.getModuleCount();
            var nWidth = Math.floor(_htOption.width / nCount);
            var nHeight = Math.floor(_htOption.height / nCount);
            var aHTML = ['<table style="border:0;border-collapse:collapse;">'];

            for (var row = 0; row < nCount; row++) {
                aHTML.push('<tr>');

                for (var col = 0; col < nCount; col++) {
                    aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + 'px;height:' + nHeight + 'px;background-color:' + (oQRCode.isDark(row, col) ? _htOption.colorDark : _htOption.colorLight) + ';"></td>');
                }

                aHTML.push('</tr>');
            }

            aHTML.push('</table>');
            _el.innerHTML = aHTML.join('');

            // Fix the margin values as real size.
            var elTable = _el.childNodes[0];
            var nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2;
            var nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
            if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
                elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px";
            }
        };

        /**
         * Clear the QRCode
         */
        Drawing.prototype.clear = function () {
            this._el.innerHTML = '';
        };

        return Drawing;
    })() : (function () { // Drawing in Canvas
        function _onMakeImage() {
            this._elImage.src = this._elCanvas.toDataURL("image/png");
            this._elImage.style.display = "block";
            this._elCanvas.style.display = "none";
        }

        // Android 2.1 bug workaround
        // http://code.google.com/p/android/issues/detail?id=5141
        if (this._android && this._android <= 2.1) {
            var factor = 1 / window.devicePixelRatio;
            var drawImage = CanvasRenderingContext2D.prototype.drawImage;
            CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
                if (("nodeName" in image) && /img/i.test(image.nodeName)) {
                    for (var i = arguments.length - 1; i >= 1; i--) {
                        arguments[i] = arguments[i] * factor;
                    }
                } else if (typeof dw == "undefined") {
                    arguments[1] *= factor;
                    arguments[2] *= factor;
                    arguments[3] *= factor;
                    arguments[4] *= factor;
                }

                drawImage.apply(this, arguments);
            };
        }

        /**
         * Check whether the user's browser supports Data URI or not
         *
         * @private
         * @param {Function} fSuccess Occurs if it supports Data URI
         * @param {Function} fFail Occurs if it doesn't support Data URI
         */
        function _safeSetDataURI(fSuccess, fFail) {
            var self = this;
            self._fFail = fFail;
            self._fSuccess = fSuccess;

            // Check it just once
            if (self._bSupportDataURI === null) {
                var el = document.createElement("img");
                var fOnError = function () {
                    self._bSupportDataURI = false;

                    if (self._fFail) {
                        _fFail.call(self);
                    }
                };
                var fOnSuccess = function () {
                    self._bSupportDataURI = true;

                    if (self._fSuccess) {
                        self._fSuccess.call(self);
                    }
                };

                el.onabort = fOnError;
                el.onerror = fOnError;
                el.onload = fOnSuccess;
                el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="; // the Image contains 1px data.
                return;
            } else if (self._bSupportDataURI === true && self._fSuccess) {
                self._fSuccess.call(self);
            } else if (self._bSupportDataURI === false && self._fFail) {
                self._fFail.call(self);
            }
        };

        /**
         * Drawing QRCode by using canvas
         *
         * @constructor
         * @param {HTMLElement} el
         * @param {Object} htOption QRCode Options
         */
        var Drawing = function (el, htOption) {
            this._bIsPainted = false;
            this._android = _getAndroid();

            this._htOption = htOption;
            this._elCanvas = document.createElement("canvas");
            this._elCanvas.width = htOption.width;
            this._elCanvas.height = htOption.height;
            el.appendChild(this._elCanvas);
            this._el = el;
            this._oContext = this._elCanvas.getContext("2d");
            this._bIsPainted = false;
            this._elImage = document.createElement("img");
            this._elImage.alt = "Scan me!";
            this._elImage.style.display = "none";
            this._el.appendChild(this._elImage);
            this._bSupportDataURI = null;
        };

        /**
         * Draw the QRCode
         *
         * @param {QRCode} oQRCode
         */
        Drawing.prototype.draw = function (oQRCode) {
            var _elImage = this._elImage;
            var _oContext = this._oContext;
            var _htOption = this._htOption;

            var nCount = oQRCode.getModuleCount();
            var nWidth = _htOption.width / nCount;
            var nHeight = _htOption.height / nCount;
            var nRoundedWidth = Math.round(nWidth);
            var nRoundedHeight = Math.round(nHeight);

            _elImage.style.display = "none";
            this.clear();

            for (var row = 0; row < nCount; row++) {
                for (var col = 0; col < nCount; col++) {
                    var bIsDark = oQRCode.isDark(row, col);
                    var nLeft = col * nWidth;
                    var nTop = row * nHeight;
                    _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                    _oContext.lineWidth = 1;
                    _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight;
                    _oContext.fillRect(nLeft, nTop, nWidth, nHeight);

                    // 안티 앨리어싱 방지 처리
                    _oContext.strokeRect(
                        Math.floor(nLeft) + 0.5,
                        Math.floor(nTop) + 0.5,
                        nRoundedWidth,
                        nRoundedHeight
                    );

                    _oContext.strokeRect(
                        Math.ceil(nLeft) - 0.5,
                        Math.ceil(nTop) - 0.5,
                        nRoundedWidth,
                        nRoundedHeight
                    );
                }
            }

            this._bIsPainted = true;
        };

        /**
         * Make the image from Canvas if the browser supports Data URI.
         */
        Drawing.prototype.makeImage = function () {
            if (this._bIsPainted) {
                _safeSetDataURI.call(this, _onMakeImage);
            }
        };

        /**
         * Return whether the QRCode is painted or not
         *
         * @return {Boolean}
         */
        Drawing.prototype.isPainted = function () {
            return this._bIsPainted;
        };

        /**
         * Clear the QRCode
         */
        Drawing.prototype.clear = function () {
            this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height);
            this._bIsPainted = false;
        };

        /**
         * @private
         * @param {Number} nNumber
         */
        Drawing.prototype.round = function (nNumber) {
            if (!nNumber) {
                return nNumber;
            }

            return Math.floor(nNumber * 1000) / 1000;
        };

        return Drawing;
    })();

    /**
     * Get the type by string length
     *
     * @private
     * @param {String} sText
     * @param {Number} nCorrectLevel
     * @return {Number} type
     */
    function _getTypeNumber(sText, nCorrectLevel) {
        var nType = 1;
        var length = _getUTF8Length(sText);

        for (var i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
            var nLimit = 0;

            switch (nCorrectLevel) {
                case QRErrorCorrectLevel.L:
                    nLimit = QRCodeLimitLength[i][0];
                    break;
                case QRErrorCorrectLevel.M:
                    nLimit = QRCodeLimitLength[i][1];
                    break;
                case QRErrorCorrectLevel.Q:
                    nLimit = QRCodeLimitLength[i][2];
                    break;
                case QRErrorCorrectLevel.H:
                    nLimit = QRCodeLimitLength[i][3];
                    break;
            }

            if (length <= nLimit) {
                break;
            } else {
                nType++;
            }
        }

        if (nType > QRCodeLimitLength.length) {
            throw new Error("Too long data");
        }

        return nType;
    }

    function _getUTF8Length(sText) {
        var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, 'a');
        return replacedText.length + (replacedText.length != sText ? 3 : 0);
    }

    /**
     * @class QRCode
     * @constructor
     * @example
     * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
     *
     * @example
     * var oQRCode = new QRCode("test", {
     *    text : "http://naver.com",
     *    width : 128,
     *    height : 128
     * });
     *
     * oQRCode.clear(); // Clear the QRCode.
     * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
     *
     * @param {HTMLElement|String} el target element or 'id' attribute of element.
     * @param {Object|String} vOption
     * @param {String} vOption.text QRCode link data
     * @param {Number} [vOption.width=256]
     * @param {Number} [vOption.height=256]
     * @param {String} [vOption.colorDark="#000000"]
     * @param {String} [vOption.colorLight="#ffffff"]
     * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
     */
    QRCode = function (el, vOption) {
        this._htOption = {
            width: 256,
            height: 256,
            typeNumber: 4,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRErrorCorrectLevel.H
        };

        if (typeof vOption === 'string') {
            vOption = {
                text: vOption
            };
        }

        // Overwrites options
        if (vOption) {
            for (var i in vOption) {
                this._htOption[i] = vOption[i];
            }
        }

        if (typeof el == "string") {
            el = document.getElementById(el);
        }

        this._android = _getAndroid();
        this._el = el;
        this._oQRCode = null;
        this._oDrawing = new Drawing(this._el, this._htOption);

        if (this._htOption.text) {
            this.makeCode(this._htOption.text);
        }
    };

    /**
     * Make the QRCode
     *
     * @param {String} sText link data
     */
    QRCode.prototype.makeCode = function (sText,fn) {
        this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel);
        this._oQRCode.addData(sText);
        this._oQRCode.make();
        this._el.title = sText;
        this._oDrawing.draw(this._oQRCode);
        this.makeImage();
        fn && fn();
    };

    /**
     * Make the Image from Canvas element
     * - It occurs automatically
     * - Android below 3 doesn't support Data-URI spec.
     *
     * @private
     */
    QRCode.prototype.makeImage = function () {
        if (typeof this._oDrawing.makeImage == "function" && (!this._android || this._android >= 3)) {
            this._oDrawing.makeImage();
        }
    };

    /**
     * Clear the QRCode
     */
    QRCode.prototype.clear = function () {
        this._oDrawing.clear();
    };

    /**
     * @name QRCode.CorrectLevel
     */
    QRCode.CorrectLevel = QRErrorCorrectLevel;

    //exports.QRCode = QRCode;

    return QRCode;

})
define("ltUtil", [], function () {
    var Util = {
        browerKernel: function () {//获取支持VisibilityState事件的浏览器的内核前缀。
            var result;
            var arr = ['webkit', 'moz', 'o', 'ms'];
            for (var i = 0; i < arr.length; i++) {
                if (typeof document[arr[i] + 'Hidden'] != 'undefined') {
                    result = arr[i];
                }
            }
            return result;
        },
        pageChange: function (fnEnter, fnLeave) {//当页面切换到其它的窗口或者最小化的时候触发，和当页面正常显示的时候触发。
            var prefix = this.browerKernel();
            document.addEventListener && document.addEventListener(prefix + 'visibilitychange', function (e) {
                if (document[prefix + 'VisibilityState'] === 'visible') {
                    fnEnter.call(document);
                }
                else if (document[prefix + 'VisibilityState'] === 'hidden') {
                    fnLeave.call(document);
                }

            });
        },
        loadImgByCanvas: function (aImgSrc, canvas, x, y, scaleX, scaleY, canvasW, canvasH, fn) {
            var img = new Image();
            var context = canvas.getContext && canvas.getContext("2d");
            if (context) {
                var width = context.measureText("图片加载中,请稍等...").width;
                context.fillText("图片加载中,请稍等...", (canvas.width - width) / 2, canvas.height / 2);
            };
            img.onload = function () {
                scaleX = scaleX || 1;
                scaleY = scaleY || 1;
                canvas.width = canvasW || this.width * scaleX;
                canvas.height = canvasH || this.height * scaleY;
                if (canvas.getContext) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(this, x, y, canvas.width, canvas.height);
                }
                else {
                    var newImg = document.createElement("img");
                    newImg.src = aImgSrc;
                    newImg.id = canvas.id;
                    newImg.width = canvasW || this.width * scaleX;
                    newImg.height = canvasH || this.height * scaleY;
                    document.body.appendChild(newImg);
                    canvas.parentNode.replaceChild(newImg, canvas);
                }
                fn && fn();
                return aImgSrc;
            };
            img.onerror = function (e) {

            }
            img.src = aImgSrc;
        },
        loadImgByLocalStorage: function (src, fnSuccess) {
            var img = new Image();
            var canvas = document.createElement("canvas");
            var context = null;
            if (canvas.getContext) {
                context = canvas.getContext("2d");
            }
            var url = "", data = "";
            img.onload = function () {
                if (context) {
                    context.canvas.width = this.width;
                    context.canvas.height = this.height;
                    context.drawImage(this, 0, 0, context.canvas.width, context.canvas.height);
                    url = canvas.toDataURL();

                }
                if (window.localStorage) {
                    try {
                        if (!localStorage.getItem(src)) {
                            localStorage.setItem(src, url); //ie8支持window.loacalStorage但是没有getItem();

                        }
                        if (localStorage.getItem(src)) {
                            data = localStorage.getItem(src);

                        }
                        else {
                            data = src;

                        }
                    } catch (e) {
                        //如果苹果的浏览器的无痕浏览模式，就会抛出这个异常
                        data = src;//把当前的src返回给data ;
                    }
                }
                else {
                    data = src;
                }
                fnSuccess && fnSuccess(data);
            };
            img.src = src;
        },

        setCss3: function (obj, attr) {
            for (var i in attr) {
                var newI = i;
                if (newI.indexOf('-') > 0) {
                    var num = newI.indexOf('-');
                    newI = newI.replace(newI.substr(num, 2), newI.substr(num + 1, 1).toUpperCase());
                }
                obj.style[newI] = attr[i];
                newI = newI.replace(newI.charAt(0), newI.charAt(0).toUpperCase());
                obj.style["webkit" + newI] = attr[i];
                obj.style["moz" + newI] = attr[i];
                obj.style["ms" + newI] = attr[i];
                obj.style["o" + newI] = attr[i];
            }
            return obj;
        },

        requestAnimFrame: (function () { //用来做动画的。
            var lastTime = 0;
            var vendors = ['webkit', 'moz', 'ms'];
            for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestNextAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                window.cancelNextAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // Webkit中此取消方法的名字变了
                    window[vendors[x] + 'CancelRequestAnimationFrame'];
            }
            if (!window.requestNextAnimationFrame) {

                window.requestNextAnimationFrame = function (callback, element) {
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
                    var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            }
            if (!window.cancelNextAnimationFrame) {
                window.cancelNextAnimationFrame = function (id) {
                    clearTimeout(id);
                };
            }
        })(),
        ltLoading: function (arr, fn, option) {


            if (arr.length <= 0) {
                fn();
                return;
            }


            var box = (option && option.id) ? option.id : "linten_loading";
            var color = (option && option.color) ? option.color : "rgba(149,30,35,1)";
            var src = (option && option.src) ? option.src : "/previewstatic/images/lt_loading.png";

            var isPicLogo = (option && option.isPicLogo === false) ? option.isPicLogo : true;
            var oC = document.createElement("canvas");
            if (!oC.getContext) {
                return;
            }
            oC.width = 500;
            oC.height = 200;
            var cxt = oC.getContext("2d");
            cxt.beginPath();
            var x1 = 183, y1 = 34, x2 = 225, y2 = -2;//x1 = 183, y1 = 32, x2 = 225, y2 = 2;
            cxt.moveTo(0, 15);
            cxt.bezierCurveTo(x1, y1, x2, y2, oC.width, 27); //
            cxt.lineTo(oC.width, oC.height);
            cxt.lineTo(0, oC.height);
            cxt.closePath();
            cxt.fillStyle = color;
            cxt.fill();


            var canvas = document.createElement("canvas");
            var proc = document.createElement("div");//用来存储百分比数字变化的容器。
            proc.style.width = "130px";
            proc.style.textAlign = "center";
            proc.style.fontFamily = "Georgia";
            canvas.width = 500;
            canvas.height = 200;
            var container = document.getElementById(box);
            if (!container) {
                alert("容器id配置错误");
                return false;
            }

            container.innerHTML = "";
            container.appendChild(canvas);
            container.appendChild(proc);
            var context = canvas.getContext("2d");
            var img1 = new Image();
            var img = new Image();
            var bg = null;
            var id = null;
            context.globalCompositeOperation = "destination-atop";//像素的合成。这是关键啊。
            var _this = this;
            img1.onload = function () {

                img.onload = function () {

                    id = window.requestNextAnimationFrame(render);
                }

                img.src = src;

            };

            img1.src = oC.toDataURL();
            var initX = -320;
            var disX = initX;
            var len = arr.length;
            var s = option.scale || 1;
            var count = 0;
            var d = true;
            var i = 0;
            loadimg();
            function loadimg() {
                if (i === len) {
                    return;
                }
                var img = new Image();
                img.onload = function () {
                    count++;
                    if (i < len - 1) {
                        i++;
                        loadimg();
                    };
                };
                img.onerror = function () {
                    count++;
                    if (i < len - 1) {
                        i++;
                        loadimg();
                    };
                }
                img.src = arr[i];
            }
            function render() {
                disX += 8;
                if (disX > 0) {
                    disX = initX;
                }
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (len > 0) {
                    context.drawImage(img1, disX, 25 - 40 * (count / len));//70 - 90 * (count / len)25- -15
                    //context.drawImage(img1, disX, 70 - 90 * (count / len));//70-90*(count/len)
                    if (count / len >= s && d) { //加载完成了。。
                        window.cancelNextAnimationFrame(id)
                        fn && fn();
                        d = false;
                    }
                    else {
                        id = window.requestNextAnimationFrame(render);
                    }

                }
                proc.innerHTML = parseInt(count / len * 100) + "%";
                context.drawImage(img, 0, 0);
            }
        },
        ltLoading2: function (arr, fn, option) { //加载2
            //var box = (option && (typeof option === "object") && option.id) ? option.id : "ltLoading";
            var box = (option && option.id) ? option.id : "ltLoading";
            var src = (option && (typeof option === "object") && option.src) ? option.src : "images/lt_loading1.png"
            var color = (option && (typeof option === "object") && option.color) ? option.color : "#951e23";
            var html = "#" + box + "{width: 430px;margin-top:50px;height: 20px;position: relative;border-radius:5px; border:1px solid " + color + ";padding: 1px;box-sizing:border-box;}\
                #"+ box + " span{width: 100%;height:100%;background: " + color + ";border-radius: 5px;display: inline-block;}\
                #"+ box + " div{width:0;height: 100%;position: absolute;left: 0;top:0;z-index: 1;background: #fff;border-radius: 5px 0 0 5px;text-align: right;line-height: 25px;}\
                #"+ box + " div label{position: relative;top:-3px;color:" + color + "}\
                #"+ box + " div img{position: absolute;top:-40px;}\
                @media all and (max-width: 480px) {\
                     #"+ box + "{width:100%;}\
                }"
            var loading_container = _$(box);
            if (!loading_container) {
                alert("容器id配置错误");
                return false;
            }

            var doc = document;
            loading_container.appendChild(doc.createElement("span"));
            loading_container.appendChild(doc.createElement("div"));
            var oDiv = _$(box).getElementsByTagName("div")[0];
            oDiv.appendChild(doc.createElement("label"));
            var oImg = new Image();
            oImg.src = src;
            oDiv.appendChild(oImg);
            var proc = oDiv.getElementsByTagName("label")[0];
            var style = doc.createElement("style");
            doc.getElementsByTagName("head")[0].appendChild(style);
            //style.innerHTML = 1234;
            try {
                style.innerHTML = html;
            }
            catch (e) {
                alert("浏览器不支持此加载特效");
                return false;
            }
            var len = arr.length;
            var count = 0;
            var i = 0;
            loadimg();
            function loadimg() {
                if (i === len) {
                    return;
                }
                var img = new Image();
                img.onload = function () {
                    count++;
                    if (i < len - 1) {
                        i++;
                        loadimg();
                    };
                    move(count, len)
                };
                img.onerror = function () {
                    count++;
                    if (i < len - 1) {
                        i++;
                        loadimg();
                    };
                    move(count, len);
                }
                img.src = arr[i];
            }
            function move(i, n) {
                if (i / n > .1) {
                    proc.innerHTML = parseInt(i / n) * 100 + "%";
                }
                oDiv.style.width = (loading_container.offsetWidth - 85) * (i / n) + "px";
                if (i / n >= 1) {//图片加载完成
                    fn && typeof fn === "function" && fn();
                }
            }
            function _$(id) {
                return document.getElementById(id);
            }
        },
        clearCache: function (cache) {//清除离线缓存。
            cache.onupdateready = function () {
                cache.swapCache();
                location.href = location.href;
            }
        },
        getStyle: function (obj, attr) {//得到css文件里面定义的样式属性值
            return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, false)[attr];
        },
        startMove: function (obj, json, times, fx, fn) { //运动框架
            var iCur = {};
            var startTime = now();
            for (var attr in json) {//当为透明度变化的时候.
                iCur[attr] = 0;
                if (attr === 'opacity') {
                    iCur[attr] = Math.round(this.getStyle(obj, attr) * 100);
                } else if (attr === "transformX") {
                    iCur[attr] = parseFloat(obj.getAttribute("transX")) || 0;
                } else if (attr === "transformY") {
                    iCur[attr] = parseFloat(obj.getAttribute("transY")) || 0;
                } else if (attr === "scale") {
                    iCur[attr] = parseFloat(obj.getAttribute("scale")) || 0;
                } else {
                    iCur[attr] = parseInt(this.getStyle(obj, attr)) || 0;
                }
            }
            window.cancelNextAnimationFrame(obj.timer);
            obj.timer = window.requestNextAnimationFrame(move);
            function now() {
                return (new Date()).getTime();
            }
            var _this = this;
            function move() {
                var changeTime = now();
                var scale = 1 - Math.max(0, startTime - changeTime + times) / times;
                for (var attr in json) {

                    var value = ltTween[fx](scale * times, parseFloat(iCur[attr]), parseFloat(json[attr]) - parseFloat(iCur[attr]), times);
                    //alert(value)
                    switch (attr.toLowerCase()) {
                        case "opacity":
                            obj.style.filter = 'alpha(oapcity=' + value + ')';
                            obj.style.opacity = value / 100;
                            break;
                        case "scrollTop":
                            document.body.scrollTop = value;
                            document.documentElement.scrollTop = value;
                            break;
                        case "width":
                        case "height":
                        case "left":
                        case "top":
                        case "bottom":
                        case "right":
                            if (json[attr].toString().indexOf("%") > -1) {//带百分比的距离
                                obj.style[attr] = value + '%';
                            } else {
                                obj.style[attr] = value + 'px';
                            }

                            break;
                        case "backgroundposition"://火孤下不支持backgroundPositionY(X)
                            if (json[attr].toString().indexOf("%") > -1) {//带百分比的距离
                                obj.style[attr] = value + '%';
                            } else {
                                obj.style[attr] = value;
                            }
                            break;
                        case "transformx":
                            obj.setAttribute("transX", value);
                            var prefix = "px";
                            if (json[attr].toString().indexOf("%") > -1) {//带百分比的距离
                                prefix = "%";
                            }
                            _this.setCss3(obj, { transform: "translateX(" + value + "" + prefix + ")" })
                            break;
                        case "transformy":
                            obj.setAttribute("transY", value);
                            var prefix = "px";
                            if (json[attr].toString().indexOf("%") > -1) {//带百分比的距离
                                prefix = "%";
                            }
                            _this.setCss3(obj, { transform: "translateY(" + value + "" + prefix + ")" })
                            break;
                        case "scale":
                            obj.setAttribute("scale", value);
                            _this.setCss3(obj, { transform: "scale(" + value + ")" });
                            break;
                    }

                }
                if (scale === 1) {
                    //_this.requestAnimFrame.cancel(obj.timer);
                    window.cancelNextAnimationFrame(obj.timer);
                    fn && typeof fn === "function" && fn.call(obj);
                }
                else {
                    obj.timer = window.requestNextAnimationFrame(move);
                }
            }
        },
        getXYByElement: function (el) { // 得到一个元素距离左侧的距离和距离顶部的距离
            var left = 0,
                top = 0;
            while (el.offsetParent) {
                left += el.offsetLeft;
                top += el.offsetTop;
                el = el.offsetParent;
            }
            return {
                left: left,
                top: top
            };
        },
        isWeiXin: function () {//判断一个页面是否是在微信页面打开
            var ua = window.navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == 'micromessenger';
        },
        imgLoader: function (arr, fn) {//图片的加载器。
            var len = arr.length;
            var count = 0;
            var i = 0;
            loadimg();
            function loadimg() {
                if (i === len) {
                    return;
                }
                var img = new Image();
                img.onload = function () {
                    count++;
                    if (i < len - 1) {
                        i++;
                        loadimg();
                    };
                    if (count / len >= 1) {
                        fn && fn();
                    }
                };
                img.onerror = function () {
                    count++;
                    if (i < len - 1) {
                        i++;
                        loadimg();
                    };
                    if (count / len >= 1) {
                        fn && fn();
                    }
                }
                img.src = arr[i];
            }
        },
        shake: function (fn, responesTime) {//手机摇一摇触发的函数
            responesTime = responesTime || 1000;//响应时间
            var last_update = 0;
            var x = y = z = last_x = last_y = last_z = 0;
            if (window.DeviceMotionEvent) {
                window.addEventListener('devicemotion', deviceMotionHandler, false);
            }
            function deviceMotionHandler(eventData) {
                var acceleration = eventData.accelerationIncludingGravity;
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 100) {
                    var diffTime = curTime - last_update;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;
                    if (speed > responesTime) {
                        fn && fn();
                    }
                    last_x = x;
                    last_y = y;
                    last_z = z;
                }
            }
        }
        ,
        isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        flyParticle: function (option) {
            var Point = function (args) {
                var s = this;
                s.x = args.x;
                s.y = args.y;
            };

            var canvas = document.getElementById(option.canvas);
            var canvas1 = document.getElementById(option.canvas1);

            getPoints(option.w, option.h, function (points) {
                canvas.style.opacity = 1;
                canvas.width = option.w;
                canvas.height = option.h;
                setCanvasStyle(canvas);
                setCanvasStyle(canvas1);

                var context = canvas.getContext("2d");
                var sourceArr = [];
                var m = Math;
                for (var i = 0; i < points.length; i++) {
                    var s = getRandomNumber(-5, 5);
                    var x = points[i].x + getRandomNumber(-2, 2) * canvas.width,
                        y = points[i].y + getRandomNumber(-2, 2) * canvas.height;
                    sourceArr.push({x: x, y: y});
                    if (option.pointsStyle instanceof Array) {
                        var color = option.pointsStyle[m.ceil(m.random() * option.pointsStyle.length - 1)];
                    }
                    else {
                        color = option.pointsStyle;
                    }
                    context.fillStyle = color;
                    context.beginPath();
                    context.arc(x, y, m.random(), 0, m.PI * 2, false);
                    context.closePath();
                    context.fill();
                }
                var timer = null;
                startMove(sourceArr, points, option.duration || 800, "easeOut", function () {
                    canvas1.style.opacity = 1;
                    canvas.style.opacity = 0;
                });
                function startMove(sourceArr, targetArr, times, fx, fn) {

                    var len = targetArr.length;
                    var startTime = now();

                    timer = window.requestNextAnimationFrame(move);
                    function move() {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        var changeTime = now();
                        var scale = 1 - Math.max(0, startTime - changeTime + times) / times;
                        var i = 0
                        for (; i < len; i++) {
                            var valueX = ltTween[fx](scale * times, parseFloat(sourceArr[i]["x"]), parseFloat(targetArr[i]["x"]) - parseFloat(sourceArr[i]["x"]), times);
                            var valueY = ltTween[fx](scale * times, parseFloat(sourceArr[i]["y"]), parseFloat(targetArr[i]["y"]) - parseFloat(sourceArr[i]["y"]), times);
                            if (option.pointsStyle instanceof Array) {
                                var color = option.pointsStyle[m.ceil(m.random() * option.pointsStyle.length - 1)];
                            }
                            else {
                                color = option.pointsStyle;
                            }
                            context.fillStyle = color;
                            context.beginPath();
                            context.arc(valueX, valueY, m.random() * 2, 0, m.PI * 2, false);
                            context.closePath();
                            context.fill();
                        }
                        if (scale > .8) {
                            fn && fn();
                            fn = null;
                        }
                        if (scale === 1) {
                            window.cancelNextAnimationFrame(timer);
                        }
                        else {
                            timer = window.requestNextAnimationFrame(move);
                        }
                    }

                    function now() {
                        return (new Date()).getTime();
                    }

                }

                function getRandomNumber(min, max) {
                    return (min + Math.floor(Math.random() * (max - min + 1)));
                }

                function now() {
                    return (new Date()).getTime();
                }
            });
            function getPoints(w, h, fn) {

                var outContext = canvas1.getContext("2d");
                canvas1.width = w;
                canvas1.height = h;

                function saveDots() {
                    var pixels = outContext.getImageData(0, 0, canvas1.width, canvas1.height).data;
                    var dots = [],
                        x = 0,
                        y = 0,
                        gap = 8;
                    for (var i = 0; i < pixels.length; i += (4 * gap)) {
                        if (pixels[i + 3] > 0) {//透明度不为0，
                            dots.push(new Point({
                                x: x,
                                y: y
                            }));
                        }
                        x += gap;
                        if (x >= canvas1.width) {
                            x = 0;
                            y += gap;
                            i += gap * 4 * canvas1.width;
                        }
                    }
                    fn && fn(dots, img);
                }

                switch (option.type) {
                    case "image":
                        var img = new Image();
                        img.onload = function () {
                            outContext.drawImage(this, 0, 0, w, h);
                            saveDots();
                        }
                        img.src = option.aString;
                        break;
                    case "ellipse":
                        outContext.drawEllipse(0, 0, w, h, "fill", option.fillStyle || "red");
                        saveDots();
                        break;
                    case "radius":
                        outContext.fillStyle = option.fillStyle || "#ccc";
                        outContext.beginPath();
                        outContext.arc(w / 2, w / 2, w / 2, 0, Math.PI * 2, false);
                        outContext.closePath();
                        outContext.fill();
                        saveDots();
                        break;
                    case "rectangular":
                        outContext.fillStyle = option.fillStyle || "#ccc";
                        outContext.fillRect(0, 0, w, h);
                        saveDots();
                        break;
                    case "text":
                        outContext.font = " 50px Verdana, Arial, Helvetica, sans-serif";
                        outContext.textBaseline = "top";
                        outContext.fillStyle = "#f90";
                        outContext.fillText(option.aString, 0, 0);
                        saveDots();
                        break;
                }
            }

            function setCanvasStyle(canvas) {
                option.isNeedBackBg && (canvas.style.background = "#000");
                canvas.style.position = "absolute";
                canvas.style.left = 0;
                canvas.style.top = 0;
                canvas.style.WebkitTransition = ".8s opacity";
                canvas.style.transition = ".8s opacity";
            }
        }
    }


    //动画函数
    !function (w) {
        var Tween = {
            //t : 当前时间   b : 初始值  c : 变化值   d : 总时间  //return : 当前的位置
            linear: function (t, b, c, d) {  //匀速
                return c * t / d + b;
            },
            easeIn: function (t, b, c, d) {  //加速曲线
                return c * (t /= d) * t + b;
            },
            easeOut: function (t, b, c, d) {  //减速曲线
                return -c * (t /= d) * (t - 2) + b;
            },
            easeBoth: function (t, b, c, d) {  //加速减速曲线
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t + b;
                }
                return -c / 2 * ((--t) * (t - 2) - 1) + b;
            },
            easeInStrong: function (t, b, c, d) {  //加加速曲线
                return c * (t /= d) * t * t * t + b;
            },
            easeOutStrong: function (t, b, c, d) {  //减减速曲线
                return -c * ((t = t / d - 1) * t * t * t - 1) + b;
            },
            easeBothStrong: function (t, b, c, d) {  //加加速减减速曲线
                if ((t /= d / 2) < 1) {
                    return c / 2 * t * t * t * t + b;
                }
                return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
            },
            elasticIn: function (t, b, c, d, a, p) {  //正弦衰减曲线（弹动渐入）
                if (t === 0) {
                    return b;
                }
                if ((t /= d) == 1) {
                    return b + c;
                }
                if (!p) {
                    p = d * 0.3;
                }
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else {
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            },
            elasticOut: function (t, b, c, d, a, p) {    //正弦增强曲线（弹动渐出）
                if (t === 0) {
                    return b;
                }
                if ((t /= d) == 1) {
                    return b + c;
                }
                if (!p) {
                    p = d * 0.3;
                }
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                } else {
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            elasticBoth: function (t, b, c, d, a, p) {
                if (t === 0) {
                    return b;
                }
                if ((t /= d / 2) == 2) {
                    return b + c;
                }
                if (!p) {
                    p = d * (0.3 * 1.5);
                }
                if (!a || a < Math.abs(c)) {
                    a = c;
                    var s = p / 4;
                }
                else {
                    var s = p / (2 * Math.PI) * Math.asin(c / a);
                }
                if (t < 1) {
                    return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
                        Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                }
                return a * Math.pow(2, -10 * (t -= 1)) *
                    Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
            },
            backIn: function (t, b, c, d, s) {     //回退加速（回退渐入）
                if (typeof s == 'undefined') {
                    s = 1.70158;
                }
                return c * (t /= d) * t * ((s + 1) * t - s) + b;
            },
            backOut: function (t, b, c, d, s) {
                if (typeof s == 'undefined') {
                    s = 3.70158;  //回缩的距离
                }
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            },
            backBoth: function (t, b, c, d, s) {
                if (typeof s == 'undefined') {
                    s = 1.70158;
                }
                if ((t /= d / 2) < 1) {
                    return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                }
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            bounceIn: function (t, b, c, d) {    //弹球减振（弹球渐出）
                return c - Tween['bounceOut'](d - t, 0, c, d) + b;
            },
            bounceOut: function (t, b, c, d) {
                if ((t /= d) < (1 / 2.75)) {
                    return c * (7.5625 * t * t) + b;
                } else if (t < (2 / 2.75)) {
                    return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
                } else if (t < (2.5 / 2.75)) {
                    return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
                }
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            },
            bounceBoth: function (t, b, c, d) {
                if (t < d / 2) {
                    return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
                }
                return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
        }
        w.ltTween = Tween;
    }(window);
    return Util;
});
define("iscroll", [], function (require, exports, module) {
    /*!
     * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
     * Released under MIT license, http://cubiq.org/license
     */
    /*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
    (function (window, document, Math) {
        var rAF = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); };

        var utils = (function () {
            var me = {};

            var _elementStyle = document.createElement('div').style;
            var _vendor = (function () {
                var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                    transform,
                    i = 0,
                    l = vendors.length;

                for (; i < l; i++) {
                    transform = vendors[i] + 'ransform';
                    if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
                }

                return false;
            })();

            function _prefixStyle(style) {
                if (_vendor === false) return false;
                if (_vendor === '') return style;
                return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
            }

            me.getTime = Date.now || function getTime() { return new Date().getTime(); };

            me.extend = function (target, obj) {
                for (var i in obj) {
                    target[i] = obj[i];
                }
            };

            me.addEvent = function (el, type, fn, capture) {
                el.addEventListener(type, fn, !!capture);
            };

            me.removeEvent = function (el, type, fn, capture) {
                el.removeEventListener(type, fn, !!capture);
            };

            me.prefixPointerEvent = function (pointerEvent) {
                return window.MSPointerEvent ?
                'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) :
                    pointerEvent;
            };

            me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination,
                    duration;

                deceleration = deceleration === undefined ? 0.0006 : deceleration;

                destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
                duration = speed / deceleration;

                if (destination < lowerMargin) {
                    destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed;
                } else if (destination > 0) {
                    destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed;
                }

                return {
                    destination: Math.round(destination),
                    duration: duration
                };
            };

            var _transform = _prefixStyle('transform');

            me.extend(me, {
                hasTransform: _transform !== false,
                hasPerspective: _prefixStyle('perspective') in _elementStyle,
                hasTouch: 'ontouchstart' in window,
                hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
                hasTransition: _prefixStyle('transition') in _elementStyle
            });

            // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
            me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

            me.extend(me.style = {}, {
                transform: _transform,
                transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
                transitionDuration: _prefixStyle('transitionDuration'),
                transitionDelay: _prefixStyle('transitionDelay'),
                transformOrigin: _prefixStyle('transformOrigin')
            });

            me.hasClass = function (e, c) {
                var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
                return re.test(e.className);
            };

            me.addClass = function (e, c) {
                if (me.hasClass(e, c)) {
                    return;
                }

                var newclass = e.className.split(' ');
                newclass.push(c);
                e.className = newclass.join(' ');
            };

            me.removeClass = function (e, c) {
                if (!me.hasClass(e, c)) {
                    return;
                }

                var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
                e.className = e.className.replace(re, ' ');
            };

            me.offset = function (el) {
                var left = -el.offsetLeft,
                    top = -el.offsetTop;

                // jshint -W084
                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop;
                }
                // jshint +W084

                return {
                    left: left,
                    top: top
                };
            };

            me.preventDefaultException = function (el, exceptions) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true;
                    }
                }

                return false;
            };

            me.extend(me.eventType = {}, {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,

                mousedown: 2,
                mousemove: 2,
                mouseup: 2,

                pointerdown: 3,
                pointermove: 3,
                pointerup: 3,

                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            });

            me.extend(me.ease = {}, {
                quadratic: {
                    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fn: function (k) {
                        return k * (2 - k);
                    }
                },
                circular: {
                    style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',	// Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                    fn: function (k) {
                        return Math.sqrt(1 - (--k * k));
                    }
                },
                back: {
                    style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    fn: function (k) {
                        var b = 4;
                        return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                    }
                },
                bounce: {
                    style: '',
                    fn: function (k) {
                        if ((k /= 1) < (1 / 2.75)) {
                            return 7.5625 * k * k;
                        } else if (k < (2 / 2.75)) {
                            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                        } else if (k < (2.5 / 2.75)) {
                            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                        } else {
                            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                        }
                    }
                },
                elastic: {
                    style: '',
                    fn: function (k) {
                        var f = 0.22,
                            e = 0.4;

                        if (k === 0) { return 0; }
                        if (k == 1) { return 1; }

                        return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                    }
                }
            });

            me.tap = function (e, eventName) {
                var ev = document.createEvent('Event');
                ev.initEvent(eventName, true, true);
                ev.pageX = e.pageX;
                ev.pageY = e.pageY;
                e.target.dispatchEvent(ev);
            };

            me.click = function (e) {
                var target = e.target,
                    ev;

                if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                    ev = document.createEvent('MouseEvents');
                    ev.initMouseEvent('click', true, true, e.view, 1,
                        target.screenX, target.screenY, target.clientX, target.clientY,
                        e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                        0, null);

                    ev._constructed = true;
                    target.dispatchEvent(ev);
                }
            };

            return me;
        })();

        function IScroll(el, options) {
            this.wrapper = typeof el == 'string' ? document.getElementById(el) : el;

            this.scroller = this.wrapper.children[0];
            this.scrollerStyle = this.scroller.style;		// cache style for better performance

            this.options = {

                resizeScrollbars: true,

                mouseWheelSpeed: 20,

                snapThreshold: 0.334,

                // INSERT POINT: OPTIONS

                startX: 0,
                startY: 0,
                scrollY: true,
                directionLockThreshold: 5,
                momentum: true,

                bounce: true,
                bounceTime: 600,
                bounceEasing: '',

                preventDefault: true,
                preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ },

                HWCompositing: true,
                useTransition: true,
                useTransform: true
            };

            for (var i in options) {
                this.options[i] = options[i];
            }

            // Normalize options
            this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

            this.options.useTransition = utils.hasTransition && this.options.useTransition;
            this.options.useTransform = utils.hasTransform && this.options.useTransform;

            this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
            this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

            // If you want eventPassthrough I have to lock one of the axes
            this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
            this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

            // With eventPassthrough we also need lockDirection mechanism
            this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
            this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

            this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

            this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

            if (this.options.tap === true) {
                this.options.tap = 'tap';
            }

            if (this.options.shrinkScrollbars == 'scale') {
                this.options.useTransition = false;
            }

            this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

            // INSERT POINT: NORMALIZATION

            // Some defaults
            this.x = 0;
            this.y = 0;
            this.directionX = 0;
            this.directionY = 0;
            this._events = {};

            // INSERT POINT: DEFAULTS

            this._init();
            this.refresh();

            this.scrollTo(this.options.startX, this.options.startY);
            this.enable();
        }

        IScroll.prototype = {
            version: '5.1.3',

            _init: function () {
                this._initEvents();

                if (this.options.scrollbars || this.options.indicators) {
                    this._initIndicators();
                }

                if (this.options.mouseWheel) {
                    this._initWheel();
                }

                if (this.options.snap) {
                    this._initSnap();
                }

                if (this.options.keyBindings) {
                    this._initKeys();
                }

                // INSERT POINT: _init

            },

            destroy: function () {
                this._initEvents(true);

                this._execEvent('destroy');
            },

            _transitionEnd: function (e) {
                if (e.target != this.scroller || !this.isInTransition) {
                    return;
                }

                this._transitionTime();
                if (!this.resetPosition(this.options.bounceTime)) {
                    this.isInTransition = false;
                    this._execEvent('scrollEnd');
                }
            },

            _start: function (e) {
                // React to left mouse button only
                if (utils.eventType[e.type] != 1) {
                    if (e.button !== 0) {
                        return;
                    }
                }

                if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                    return;
                }

                if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault();
                }

                var point = e.touches ? e.touches[0] : e,
                    pos;


                this.initiated = utils.eventType[e.type];

                this.moved = false;
                this.distX = 0;
                this.distY = 0;
                this.directionX = 0;
                this.directionY = 0;
                this.directionLocked = 0;

                this._transitionTime();

                this.startTime = utils.getTime();

                if (this.options.useTransition && this.isInTransition) {
                    this.isInTransition = false;
                    pos = this.getComputedPosition();
                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this._execEvent('scrollEnd');
                } else if (!this.options.useTransition && this.isAnimating) {
                    this.isAnimating = false;
                    this._execEvent('scrollEnd');
                }

                this.startX = this.x;
                this.startY = this.y;
                this.absStartX = this.x;
                this.absStartY = this.y;
                this.pointX = point.pageX;
                this.pointY = point.pageY;

                this._execEvent('beforeScrollStart');

            },

            _move: function (e) {

                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return;
                }

                if (this.options.preventDefault) {	// increases performance on Android? TODO: check!
                    e.preventDefault();
                }

                var point = e.touches ? e.touches[0] : e,
                    deltaX = point.pageX - this.pointX,
                    deltaY = point.pageY - this.pointY,
                    timestamp = utils.getTime(),
                    newX, newY,
                    absDistX, absDistY;

                this.pointX = point.pageX;
                this.pointY = point.pageY;

                this.distX += deltaX;
                this.distY += deltaY;
                absDistX = Math.abs(this.distX);
                absDistY = Math.abs(this.distY);

                // We need to move at least 10 pixels for the scrolling to initiate
                if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                    return;
                }

                // If you are scrolling in one direction lock the other
                if (!this.directionLocked && !this.options.freeScroll) {
                    if (absDistX > absDistY + this.options.directionLockThreshold) {
                        this.directionLocked = 'h';		// lock horizontally
                    } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                        this.directionLocked = 'v';		// lock vertically
                    } else {
                        this.directionLocked = 'n';		// no lock
                    }
                }

                if (this.directionLocked == 'h') {
                    if (this.options.eventPassthrough == 'vertical') {
                        e.preventDefault();
                    } else if (this.options.eventPassthrough == 'horizontal') {
                        this.initiated = false;
                        return;
                    }

                    deltaY = 0;
                } else if (this.directionLocked == 'v') {
                    if (this.options.eventPassthrough == 'horizontal') {
                        e.preventDefault();
                    } else if (this.options.eventPassthrough == 'vertical') {
                        this.initiated = false;
                        return;
                    }

                    deltaX = 0;
                }

                deltaX = this.hasHorizontalScroll ? deltaX : 0;
                deltaY = this.hasVerticalScroll ? deltaY : 0;

                newX = this.x + deltaX;
                newY = this.y + deltaY;

                // Slow down if outside of the boundaries
                if (newX > 0 || newX < this.maxScrollX) {
                    newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
                }
                if (newY > 0 || newY < this.maxScrollY) {
                    newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
                }

                this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
                this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

                if (!this.moved) {
                    this._execEvent('scrollStart');
                }

                this.moved = true;

                this._translate(newX, newY);

                /* REPLACE START: _move */

                if (timestamp - this.startTime > 300) {
                    this.startTime = timestamp;
                    this.startX = this.x;
                    this.startY = this.y;
                }

                /* REPLACE END: _move */

            },

            _end: function (e) {
                if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                    return;
                }

                if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                    e.preventDefault();
                }

                var point = e.changedTouches ? e.changedTouches[0] : e,
                    momentumX,
                    momentumY,
                    duration = utils.getTime() - this.startTime,
                    newX = Math.round(this.x),
                    newY = Math.round(this.y),
                    distanceX = Math.abs(newX - this.startX),
                    distanceY = Math.abs(newY - this.startY),
                    time = 0,
                    easing = '';

                this.isInTransition = 0;
                this.initiated = 0;
                this.endTime = utils.getTime();

                // reset if we are outside of the boundaries
                if (this.resetPosition(this.options.bounceTime)) {
                    return;
                }

                this.scrollTo(newX, newY);	// ensures that the last position is rounded

                // we scrolled less than 10 pixels
                if (!this.moved) {
                    if (this.options.tap) {
                        utils.tap(e, this.options.tap);
                    }

                    if (this.options.click) {
                        utils.click(e);
                    }

                    this._execEvent('scrollCancel');
                    return;
                }

                if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                    this._execEvent('flick');
                    return;
                }

                // start momentum animation if needed
                if (this.options.momentum && duration < 300) {
                    momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : { destination: newX, duration: 0 };
                    momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : { destination: newY, duration: 0 };
                    newX = momentumX.destination;
                    newY = momentumY.destination;
                    time = Math.max(momentumX.duration, momentumY.duration);
                    this.isInTransition = 1;
                }


                if (this.options.snap) {
                    var snap = this._nearestSnap(newX, newY);
                    this.currentPage = snap;
                    time = this.options.snapSpeed || Math.max(
                            Math.max(
                                Math.min(Math.abs(newX - snap.x), 1000),
                                Math.min(Math.abs(newY - snap.y), 1000)
                            ), 300);
                    newX = snap.x;
                    newY = snap.y;

                    this.directionX = 0;
                    this.directionY = 0;
                    easing = this.options.bounceEasing;
                }

                // INSERT POINT: _end

                if (newX != this.x || newY != this.y) {
                    // change easing function when scroller goes out of the boundaries
                    if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                        easing = utils.ease.quadratic;
                    }

                    this.scrollTo(newX, newY, time, easing);
                    return;
                }

                this._execEvent('scrollEnd');
            },

            _resize: function () {
                var that = this;

                clearTimeout(this.resizeTimeout);

                this.resizeTimeout = setTimeout(function () {
                    that.refresh();
                }, this.options.resizePolling);
            },

            resetPosition: function (time) {
                var x = this.x,
                    y = this.y;

                time = time || 0;

                if (!this.hasHorizontalScroll || this.x > 0) {
                    x = 0;
                } else if (this.x < this.maxScrollX) {
                    x = this.maxScrollX;
                }

                if (!this.hasVerticalScroll || this.y > 0) {
                    y = 0;
                } else if (this.y < this.maxScrollY) {
                    y = this.maxScrollY;
                }

                if (x == this.x && y == this.y) {
                    return false;
                }

                this.scrollTo(x, y, time, this.options.bounceEasing);

                return true;
            },

            disable: function () {
                this.enabled = false;
            },

            enable: function () {
                this.enabled = true;
            },

            refresh: function () {
                var rf = this.wrapper.offsetHeight;		// Force reflow

                this.wrapperWidth = this.wrapper.clientWidth;
                this.wrapperHeight = this.wrapper.clientHeight;

                /* REPLACE START: refresh */

                this.scrollerWidth = this.scroller.offsetWidth;
                this.scrollerHeight = this.scroller.offsetHeight;

                this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
                this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

                /* REPLACE END: refresh */

                this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
                this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

                if (!this.hasHorizontalScroll) {
                    this.maxScrollX = 0;
                    this.scrollerWidth = this.wrapperWidth;
                }

                if (!this.hasVerticalScroll) {
                    this.maxScrollY = 0;
                    this.scrollerHeight = this.wrapperHeight;
                }

                this.endTime = 0;
                this.directionX = 0;
                this.directionY = 0;

                this.wrapperOffset = utils.offset(this.wrapper);

                this._execEvent('refresh');

                this.resetPosition();

                // INSERT POINT: _refresh

            },

            on: function (type, fn) {
                if (!this._events[type]) {
                    this._events[type] = [];
                }

                this._events[type].push(fn);
            },

            off: function (type, fn) {
                if (!this._events[type]) {
                    return;
                }

                var index = this._events[type].indexOf(fn);

                if (index > -1) {
                    this._events[type].splice(index, 1);
                }
            },

            _execEvent: function (type) {
                if (!this._events[type]) {
                    return;
                }

                var i = 0,
                    l = this._events[type].length;

                if (!l) {
                    return;
                }

                for (; i < l; i++) {
                    this._events[type][i].apply(this, [].slice.call(arguments, 1));
                }
            },

            scrollBy: function (x, y, time, easing) {
                x = this.x + x;
                y = this.y + y;
                time = time || 0;

                this.scrollTo(x, y, time, easing);
            },

            scrollTo: function (x, y, time, easing) {
                easing = easing || utils.ease.circular;

                this.isInTransition = this.options.useTransition && time > 0;

                if (!time || (this.options.useTransition && easing.style)) {
                    this._transitionTimingFunction(easing.style);
                    this._transitionTime(time);
                    this._translate(x, y);
                } else {
                    this._animate(x, y, time, easing.fn);
                }
            },

            scrollToElement: function (el, time, offsetX, offsetY, easing) {
                el = el.nodeType ? el : this.scroller.querySelector(el);

                if (!el) {
                    return;
                }

                var pos = utils.offset(el);

                pos.left -= this.wrapperOffset.left;
                pos.top -= this.wrapperOffset.top;

                // if offsetX/Y are true we center the element to the screen
                if (offsetX === true) {
                    offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
                }
                if (offsetY === true) {
                    offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
                }

                pos.left -= offsetX || 0;
                pos.top -= offsetY || 0;

                pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
                pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

                time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

                this.scrollTo(pos.left, pos.top, time, easing);
            },

            _transitionTime: function (time) {
                time = time || 0;

                this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

                if (!time && utils.isBadAndroid) {
                    this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
                }


                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].transitionTime(time);
                    }
                }


                // INSERT POINT: _transitionTime

            },

            _transitionTimingFunction: function (easing) {
                this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].transitionTimingFunction(easing);
                    }
                }


                // INSERT POINT: _transitionTimingFunction

            },

            _translate: function (x, y) {
                if (this.options.useTransform) {

                    /* REPLACE START: _translate */

                    this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                    /* REPLACE END: _translate */

                } else {
                    x = Math.round(x);
                    y = Math.round(y);
                    this.scrollerStyle.left = x + 'px';
                    this.scrollerStyle.top = y + 'px';
                }

                this.x = x;
                this.y = y;


                if (this.indicators) {
                    for (var i = this.indicators.length; i--;) {
                        this.indicators[i].updatePosition();
                    }
                }


                // INSERT POINT: _translate

            },

            _initEvents: function (remove) {
                var eventType = remove ? utils.removeEvent : utils.addEvent,
                    target = this.options.bindToWrapper ? this.wrapper : window;

                eventType(window, 'orientationchange', this);
                eventType(window, 'resize', this);

                if (this.options.click) {
                    eventType(this.wrapper, 'click', this, true);
                }

                if (!this.options.disableMouse) {
                    eventType(this.wrapper, 'mousedown', this);
                    eventType(target, 'mousemove', this);
                    eventType(target, 'mousecancel', this);
                    eventType(target, 'mouseup', this);
                }

                if (utils.hasPointer && !this.options.disablePointer) {
                    eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                    eventType(target, utils.prefixPointerEvent('pointermove'), this);
                    eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                    eventType(target, utils.prefixPointerEvent('pointerup'), this);
                }

                if (utils.hasTouch && !this.options.disableTouch) {
                    eventType(this.wrapper, 'touchstart', this);
                    eventType(target, 'touchmove', this);
                    eventType(target, 'touchcancel', this);
                    eventType(target, 'touchend', this);
                }

                eventType(this.scroller, 'transitionend', this);
                eventType(this.scroller, 'webkitTransitionEnd', this);
                eventType(this.scroller, 'oTransitionEnd', this);
                eventType(this.scroller, 'MSTransitionEnd', this);
            },

            getComputedPosition: function () {
                var matrix = window.getComputedStyle(this.scroller, null),
                    x, y;

                if (this.options.useTransform) {
                    matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                    x = +(matrix[12] || matrix[4]);
                    y = +(matrix[13] || matrix[5]);
                } else {
                    x = +matrix.left.replace(/[^-\d.]/g, '');
                    y = +matrix.top.replace(/[^-\d.]/g, '');
                }

                return { x: x, y: y };
            },

            _initIndicators: function () {
                var interactive = this.options.interactiveScrollbars,
                    customStyle = typeof this.options.scrollbars != 'string',
                    indicators = [],
                    indicator;

                var that = this;

                this.indicators = [];

                if (this.options.scrollbars) {
                    // Vertical scrollbar
                    if (this.options.scrollY) {
                        indicator = {
                            el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                            interactive: interactive,
                            defaultScrollbars: true,
                            customStyle: customStyle,
                            resize: this.options.resizeScrollbars,
                            shrink: this.options.shrinkScrollbars,
                            fade: this.options.fadeScrollbars,
                            listenX: false
                        };

                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator);
                    }

                    // Horizontal scrollbar
                    if (this.options.scrollX) {
                        indicator = {
                            el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                            interactive: interactive,
                            defaultScrollbars: true,
                            customStyle: customStyle,
                            resize: this.options.resizeScrollbars,
                            shrink: this.options.shrinkScrollbars,
                            fade: this.options.fadeScrollbars,
                            listenY: false
                        };

                        this.wrapper.appendChild(indicator.el);
                        indicators.push(indicator);
                    }
                }

                if (this.options.indicators) {
                    // TODO: check concat compatibility
                    indicators = indicators.concat(this.options.indicators);
                }

                for (var i = indicators.length; i--;) {
                    this.indicators.push(new Indicator(this, indicators[i]));
                }

                // TODO: check if we can use array.map (wide compatibility and performance issues)
                function _indicatorsMap(fn) {
                    for (var i = that.indicators.length; i--;) {
                        fn.call(that.indicators[i]);
                    }
                }

                if (this.options.fadeScrollbars) {
                    this.on('scrollEnd', function () {
                        _indicatorsMap(function () {
                            this.fade();
                        });
                    });

                    this.on('scrollCancel', function () {
                        _indicatorsMap(function () {
                            this.fade();
                        });
                    });

                    this.on('scrollStart', function () {
                        _indicatorsMap(function () {
                            this.fade(1);
                        });
                    });

                    this.on('beforeScrollStart', function () {
                        _indicatorsMap(function () {
                            this.fade(1, true);
                        });
                    });
                }


                this.on('refresh', function () {
                    _indicatorsMap(function () {
                        this.refresh();
                    });
                });

                this.on('destroy', function () {
                    _indicatorsMap(function () {
                        this.destroy();
                    });

                    delete this.indicators;
                });
            },

            _initWheel: function () {
                utils.addEvent(this.wrapper, 'wheel', this);
                utils.addEvent(this.wrapper, 'mousewheel', this);
                utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

                this.on('destroy', function () {
                    utils.removeEvent(this.wrapper, 'wheel', this);
                    utils.removeEvent(this.wrapper, 'mousewheel', this);
                    utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
                });
            },

            _wheel: function (e) {
                if (!this.enabled) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                var wheelDeltaX, wheelDeltaY,
                    newX, newY,
                    that = this;

                if (this.wheelTimeout === undefined) {
                    that._execEvent('scrollStart');
                }

                // Execute the scrollEnd event after 400ms the wheel stopped scrolling
                clearTimeout(this.wheelTimeout);
                this.wheelTimeout = setTimeout(function () {
                    that._execEvent('scrollEnd');
                    that.wheelTimeout = undefined;
                }, 400);

                if ('deltaX' in e) {
                    if (e.deltaMode === 1) {
                        wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                        wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
                    } else {
                        wheelDeltaX = -e.deltaX;
                        wheelDeltaY = -e.deltaY;
                    }
                } else if ('wheelDeltaX' in e) {
                    wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                    wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
                } else if ('wheelDelta' in e) {
                    wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
                } else if ('detail' in e) {
                    wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
                } else {
                    return;
                }

                wheelDeltaX *= this.options.invertWheelDirection;
                wheelDeltaY *= this.options.invertWheelDirection;

                if (!this.hasVerticalScroll) {
                    wheelDeltaX = wheelDeltaY;
                    wheelDeltaY = 0;
                }

                if (this.options.snap) {
                    newX = this.currentPage.pageX;
                    newY = this.currentPage.pageY;

                    if (wheelDeltaX > 0) {
                        newX--;
                    } else if (wheelDeltaX < 0) {
                        newX++;
                    }

                    if (wheelDeltaY > 0) {
                        newY--;
                    } else if (wheelDeltaY < 0) {
                        newY++;
                    }

                    this.goToPage(newX, newY);

                    return;
                }

                newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
                newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

                if (newX > 0) {
                    newX = 0;
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                }

                if (newY > 0) {
                    newY = 0;
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                }

                this.scrollTo(newX, newY, 0);

                // INSERT POINT: _wheel
            },

            _initSnap: function () {
                this.currentPage = {};

                if (typeof this.options.snap == 'string') {
                    this.options.snap = this.scroller.querySelectorAll(this.options.snap);
                }

                this.on('refresh', function () {
                    var i = 0, l,
                        m = 0, n,
                        cx, cy,
                        x = 0, y,
                        stepX = this.options.snapStepX || this.wrapperWidth,
                        stepY = this.options.snapStepY || this.wrapperHeight,
                        el;

                    this.pages = [];

                    if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                        return;
                    }

                    if (this.options.snap === true) {
                        cx = Math.round(stepX / 2);
                        cy = Math.round(stepY / 2);

                        while (x > -this.scrollerWidth) {
                            this.pages[i] = [];
                            l = 0;
                            y = 0;

                            while (y > -this.scrollerHeight) {
                                this.pages[i][l] = {
                                    x: Math.max(x, this.maxScrollX),
                                    y: Math.max(y, this.maxScrollY),
                                    width: stepX,
                                    height: stepY,
                                    cx: x - cx,
                                    cy: y - cy
                                };

                                y -= stepY;
                                l++;
                            }

                            x -= stepX;
                            i++;
                        }
                    } else {
                        el = this.options.snap;
                        l = el.length;
                        n = -1;

                        for (; i < l; i++) {
                            if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                                m = 0;
                                n++;
                            }

                            if (!this.pages[m]) {
                                this.pages[m] = [];
                            }

                            x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                            y = Math.max(-el[i].offsetTop, this.maxScrollY);
                            cx = x - Math.round(el[i].offsetWidth / 2);
                            cy = y - Math.round(el[i].offsetHeight / 2);

                            this.pages[m][n] = {
                                x: x,
                                y: y,
                                width: el[i].offsetWidth,
                                height: el[i].offsetHeight,
                                cx: cx,
                                cy: cy
                            };

                            if (x > this.maxScrollX) {
                                m++;
                            }
                        }
                    }

                    this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

                    // Update snap threshold if needed
                    if (this.options.snapThreshold % 1 === 0) {
                        this.snapThresholdX = this.options.snapThreshold;
                        this.snapThresholdY = this.options.snapThreshold;
                    } else {
                        this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                        this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
                    }
                });

                this.on('flick', function () {
                    var time = this.options.snapSpeed || Math.max(
                            Math.max(
                                Math.min(Math.abs(this.x - this.startX), 1000),
                                Math.min(Math.abs(this.y - this.startY), 1000)
                            ), 300);

                    this.goToPage(
                        this.currentPage.pageX + this.directionX,
                        this.currentPage.pageY + this.directionY,
                        time
                    );
                });
            },

            _nearestSnap: function (x, y) {
                if (!this.pages.length) {
                    return { x: 0, y: 0, pageX: 0, pageY: 0 };
                }

                var i = 0,
                    l = this.pages.length,
                    m = 0;

                // Check if we exceeded the snap threshold
                if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
                    Math.abs(y - this.absStartY) < this.snapThresholdY) {
                    return this.currentPage;
                }

                if (x > 0) {
                    x = 0;
                } else if (x < this.maxScrollX) {
                    x = this.maxScrollX;
                }

                if (y > 0) {
                    y = 0;
                } else if (y < this.maxScrollY) {
                    y = this.maxScrollY;
                }

                for (; i < l; i++) {
                    if (x >= this.pages[i][0].cx) {
                        x = this.pages[i][0].x;
                        break;
                    }
                }

                l = this.pages[i].length;

                for (; m < l; m++) {
                    if (y >= this.pages[0][m].cy) {
                        y = this.pages[0][m].y;
                        break;
                    }
                }

                if (i == this.currentPage.pageX) {
                    i += this.directionX;

                    if (i < 0) {
                        i = 0;
                    } else if (i >= this.pages.length) {
                        i = this.pages.length - 1;
                    }

                    x = this.pages[i][0].x;
                }

                if (m == this.currentPage.pageY) {
                    m += this.directionY;

                    if (m < 0) {
                        m = 0;
                    } else if (m >= this.pages[0].length) {
                        m = this.pages[0].length - 1;
                    }

                    y = this.pages[0][m].y;
                }

                return {
                    x: x,
                    y: y,
                    pageX: i,
                    pageY: m
                };
            },

            goToPage: function (x, y, time, easing) {
                easing = easing || this.options.bounceEasing;

                if (x >= this.pages.length) {
                    x = this.pages.length - 1;
                } else if (x < 0) {
                    x = 0;
                }

                if (y >= this.pages[x].length) {
                    y = this.pages[x].length - 1;
                } else if (y < 0) {
                    y = 0;
                }

                var posX = this.pages[x][y].x,
                    posY = this.pages[x][y].y;

                time = time === undefined ? this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(posX - this.x), 1000),
                        Math.min(Math.abs(posY - this.y), 1000)
                    ), 300) : time;

                this.currentPage = {
                    x: posX,
                    y: posY,
                    pageX: x,
                    pageY: y
                };

                this.scrollTo(posX, posY, time, easing);
            },

            next: function (time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;

                x++;

                if (x >= this.pages.length && this.hasVerticalScroll) {
                    x = 0;
                    y++;
                }

                this.goToPage(x, y, time, easing);
            },

            prev: function (time, easing) {
                var x = this.currentPage.pageX,
                    y = this.currentPage.pageY;

                x--;

                if (x < 0 && this.hasVerticalScroll) {
                    x = 0;
                    y--;
                }

                this.goToPage(x, y, time, easing);
            },

            _initKeys: function (e) {
                // default key bindings
                var keys = {
                    pageUp: 33,
                    pageDown: 34,
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40
                };
                var i;

                // if you give me characters I give you keycode
                if (typeof this.options.keyBindings == 'object') {
                    for (i in this.options.keyBindings) {
                        if (typeof this.options.keyBindings[i] == 'string') {
                            this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                        }
                    }
                } else {
                    this.options.keyBindings = {};
                }

                for (i in keys) {
                    this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
                }

                utils.addEvent(window, 'keydown', this);

                this.on('destroy', function () {
                    utils.removeEvent(window, 'keydown', this);
                });
            },

            _key: function (e) {
                if (!this.enabled) {
                    return;
                }

                var snap = this.options.snap,	// we are using this alot, better to cache it
                    newX = snap ? this.currentPage.pageX : this.x,
                    newY = snap ? this.currentPage.pageY : this.y,
                    now = utils.getTime(),
                    prevTime = this.keyTime || 0,
                    acceleration = 0.250,
                    pos;

                if (this.options.useTransition && this.isInTransition) {
                    pos = this.getComputedPosition();

                    this._translate(Math.round(pos.x), Math.round(pos.y));
                    this.isInTransition = false;
                }

                this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

                switch (e.keyCode) {
                    case this.options.keyBindings.pageUp:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX += snap ? 1 : this.wrapperWidth;
                        } else {
                            newY += snap ? 1 : this.wrapperHeight;
                        }
                        break;
                    case this.options.keyBindings.pageDown:
                        if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                            newX -= snap ? 1 : this.wrapperWidth;
                        } else {
                            newY -= snap ? 1 : this.wrapperHeight;
                        }
                        break;
                    case this.options.keyBindings.end:
                        newX = snap ? this.pages.length - 1 : this.maxScrollX;
                        newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                        break;
                    case this.options.keyBindings.home:
                        newX = 0;
                        newY = 0;
                        break;
                    case this.options.keyBindings.left:
                        newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.up:
                        newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.right:
                        newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                        break;
                    case this.options.keyBindings.down:
                        newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                        break;
                    default:
                        return;
                }

                if (snap) {
                    this.goToPage(newX, newY);
                    return;
                }

                if (newX > 0) {
                    newX = 0;
                    this.keyAcceleration = 0;
                } else if (newX < this.maxScrollX) {
                    newX = this.maxScrollX;
                    this.keyAcceleration = 0;
                }

                if (newY > 0) {
                    newY = 0;
                    this.keyAcceleration = 0;
                } else if (newY < this.maxScrollY) {
                    newY = this.maxScrollY;
                    this.keyAcceleration = 0;
                }

                this.scrollTo(newX, newY, 0);

                this.keyTime = now;
            },

            _animate: function (destX, destY, duration, easingFn) {
                var that = this,
                    startX = this.x,
                    startY = this.y,
                    startTime = utils.getTime(),
                    destTime = startTime + duration;

                function step() {
                    var now = utils.getTime(),
                        newX, newY,
                        easing;

                    if (now >= destTime) {
                        that.isAnimating = false;
                        that._translate(destX, destY);

                        if (!that.resetPosition(that.options.bounceTime)) {
                            that._execEvent('scrollEnd');
                        }

                        return;
                    }

                    now = (now - startTime) / duration;
                    easing = easingFn(now);
                    newX = (destX - startX) * easing + startX;
                    newY = (destY - startY) * easing + startY;
                    that._translate(newX, newY);

                    if (that.isAnimating) {
                        rAF(step);
                    }
                }

                this.isAnimating = true;
                step();
            },
            handleEvent: function (e) {

                switch (e.type) {
                    case 'touchstart':
                    case 'pointerdown':
                    case 'MSPointerDown':
                    case 'mousedown':
                        this._start(e);
                        break;
                    case 'touchmove':
                    case 'pointermove':
                    case 'MSPointerMove':
                    case 'mousemove':
                        this._move(e);
                        break;
                    case 'touchend':
                    case 'pointerup':
                    case 'MSPointerUp':
                    case 'mouseup':
                    case 'touchcancel':
                    case 'pointercancel':
                    case 'MSPointerCancel':
                    case 'mousecancel':
                        this._end(e);
                        break;
                    case 'orientationchange':
                    case 'resize':
                        this._resize();
                        break;
                    case 'transitionend':
                    case 'webkitTransitionEnd':
                    case 'oTransitionEnd':
                    case 'MSTransitionEnd':
                        this._transitionEnd(e);
                        break;
                    case 'wheel':
                    case 'DOMMouseScroll':
                    case 'mousewheel':
                        this._wheel(e);
                        break;
                    case 'keydown':
                        this._key(e);
                        break;
                    case 'click':
                        if (!e._constructed) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        break;
                }
            }
        };
        function createDefaultScrollbar(direction, interactive, type) {
            var scrollbar = document.createElement('div'),
                indicator = document.createElement('div');

            if (type === true) {
                scrollbar.style.cssText = 'position:absolute;z-index:9999';
                indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
            }

            indicator.className = 'iScrollIndicator';

            if (direction == 'h') {
                if (type === true) {
                    scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
                    indicator.style.height = '100%';
                }
                scrollbar.className = 'iScrollHorizontalScrollbar';
            } else {
                if (type === true) {
                    scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
                    indicator.style.width = '100%';
                }
                scrollbar.className = 'iScrollVerticalScrollbar';
            }

            scrollbar.style.cssText += ';overflow:hidden';

            if (!interactive) {
                scrollbar.style.pointerEvents = 'none';
            }

            scrollbar.appendChild(indicator);

            return scrollbar;
        }

        function Indicator(scroller, options) {
            this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
            this.wrapperStyle = this.wrapper.style;
            this.indicator = this.wrapper.children[0];
            this.indicatorStyle = this.indicator.style;
            this.scroller = scroller;

            this.options = {
                listenX: true,
                listenY: true,
                interactive: false,
                resize: true,
                defaultScrollbars: false,
                shrink: false,
                fade: false,
                speedRatioX: 0,
                speedRatioY: 0
            };

            for (var i in options) {
                this.options[i] = options[i];
            }

            this.sizeRatioX = 1;
            this.sizeRatioY = 1;
            this.maxPosX = 0;
            this.maxPosY = 0;

            if (this.options.interactive) {
                if (!this.options.disableTouch) {
                    utils.addEvent(this.indicator, 'touchstart', this);
                    utils.addEvent(window, 'touchend', this);
                }
                if (!this.options.disablePointer) {
                    utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                    utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
                }
                if (!this.options.disableMouse) {
                    utils.addEvent(this.indicator, 'mousedown', this);
                    utils.addEvent(window, 'mouseup', this);
                }
            }

            if (this.options.fade) {
                this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
                this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
                this.wrapperStyle.opacity = '0';
            }
        }

        Indicator.prototype = {
            handleEvent: function (e) {
                switch (e.type) {
                    case 'touchstart':
                    case 'pointerdown':
                    case 'MSPointerDown':
                    case 'mousedown':
                        this._start(e);
                        break;
                    case 'touchmove':
                    case 'pointermove':
                    case 'MSPointerMove':
                    case 'mousemove':
                        this._move(e);
                        break;
                    case 'touchend':
                    case 'pointerup':
                    case 'MSPointerUp':
                    case 'mouseup':
                    case 'touchcancel':
                    case 'pointercancel':
                    case 'MSPointerCancel':
                    case 'mousecancel':
                        this._end(e);
                        break;
                }
            },

            destroy: function () {
                if (this.options.interactive) {
                    utils.removeEvent(this.indicator, 'touchstart', this);
                    utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                    utils.removeEvent(this.indicator, 'mousedown', this);

                    utils.removeEvent(window, 'touchmove', this);
                    utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                    utils.removeEvent(window, 'mousemove', this);

                    utils.removeEvent(window, 'touchend', this);
                    utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                    utils.removeEvent(window, 'mouseup', this);
                }

                if (this.options.defaultScrollbars) {
                    this.wrapper.parentNode.removeChild(this.wrapper);
                }
            },

            _start: function (e) {
                var point = e.touches ? e.touches[0] : e;

                e.preventDefault();
                e.stopPropagation();

                this.transitionTime();

                this.initiated = true;
                this.moved = false;
                this.lastPointX = point.pageX;
                this.lastPointY = point.pageY;

                this.startTime = utils.getTime();

                if (!this.options.disableTouch) {
                    utils.addEvent(window, 'touchmove', this);
                }
                if (!this.options.disablePointer) {
                    utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
                }
                if (!this.options.disableMouse) {
                    utils.addEvent(window, 'mousemove', this);
                }

                this.scroller._execEvent('beforeScrollStart');
            },

            _move: function (e) {

                var point = e.touches ? e.touches[0] : e,
                    deltaX, deltaY,
                    newX, newY,
                    timestamp = utils.getTime();

                if (!this.moved) {
                    this.scroller._execEvent('scrollStart');
                }

                this.moved = true;

                deltaX = point.pageX - this.lastPointX;
                this.lastPointX = point.pageX;

                deltaY = point.pageY - this.lastPointY;
                this.lastPointY = point.pageY;

                newX = this.x + deltaX;
                newY = this.y + deltaY;

                this._pos(newX, newY);

                // INSERT POINT: indicator._move

                e.preventDefault();
                e.stopPropagation();
            },

            _end: function (e) {
                if (!this.initiated) {
                    return;
                }

                this.initiated = false;

                e.preventDefault();
                e.stopPropagation();

                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);

                if (this.scroller.options.snap) {
                    var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

                    var time = this.options.snapSpeed || Math.max(
                            Math.max(
                                Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                                Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                            ), 300);

                    if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
                        this.scroller.directionX = 0;
                        this.scroller.directionY = 0;
                        this.scroller.currentPage = snap;
                        this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                    }
                }

                if (this.moved) {
                    this.scroller._execEvent('scrollEnd');
                }
            },

            transitionTime: function (time) {
                time = time || 0;
                this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

                if (!time && utils.isBadAndroid) {
                    this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
                }
            },

            transitionTimingFunction: function (easing) {
                this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
            },

            refresh: function () {
                this.transitionTime();

                if (this.options.listenX && !this.options.listenY) {
                    this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
                } else if (this.options.listenY && !this.options.listenX) {
                    this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
                } else {
                    this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
                }

                if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                    utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                    utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

                    if (this.options.defaultScrollbars && this.options.customStyle) {
                        if (this.options.listenX) {
                            this.wrapper.style.right = '8px';
                        } else {
                            this.wrapper.style.bottom = '8px';
                        }
                    }
                } else {
                    utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                    utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

                    if (this.options.defaultScrollbars && this.options.customStyle) {
                        if (this.options.listenX) {
                            this.wrapper.style.right = '2px';
                        } else {
                            this.wrapper.style.bottom = '2px';
                        }
                    }
                }

                var r = this.wrapper.offsetHeight;	// force refresh

                if (this.options.listenX) {
                    this.wrapperWidth = this.wrapper.clientWidth;
                    if (this.options.resize) {
                        this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                        this.indicatorStyle.width = this.indicatorWidth + 'px';
                    } else {
                        this.indicatorWidth = this.indicator.clientWidth;
                    }

                    this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                    if (this.options.shrink == 'clip') {
                        this.minBoundaryX = -this.indicatorWidth + 8;
                        this.maxBoundaryX = this.wrapperWidth - 8;
                    } else {
                        this.minBoundaryX = 0;
                        this.maxBoundaryX = this.maxPosX;
                    }

                    this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
                }

                if (this.options.listenY) {
                    this.wrapperHeight = this.wrapper.clientHeight;
                    if (this.options.resize) {
                        this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                        this.indicatorStyle.height = this.indicatorHeight + 'px';
                    } else {
                        this.indicatorHeight = this.indicator.clientHeight;
                    }

                    this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                    if (this.options.shrink == 'clip') {
                        this.minBoundaryY = -this.indicatorHeight + 8;
                        this.maxBoundaryY = this.wrapperHeight - 8;
                    } else {
                        this.minBoundaryY = 0;
                        this.maxBoundaryY = this.maxPosY;
                    }

                    this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                    this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
                }

                this.updatePosition();
            },

            updatePosition: function () {
                var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                    y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

                if (!this.options.ignoreBoundaries) {
                    if (x < this.minBoundaryX) {
                        if (this.options.shrink == 'scale') {
                            this.width = Math.max(this.indicatorWidth + x, 8);
                            this.indicatorStyle.width = this.width + 'px';
                        }
                        x = this.minBoundaryX;
                    } else if (x > this.maxBoundaryX) {
                        if (this.options.shrink == 'scale') {
                            this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                            this.indicatorStyle.width = this.width + 'px';
                            x = this.maxPosX + this.indicatorWidth - this.width;
                        } else {
                            x = this.maxBoundaryX;
                        }
                    } else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
                        this.width = this.indicatorWidth;
                        this.indicatorStyle.width = this.width + 'px';
                    }

                    if (y < this.minBoundaryY) {
                        if (this.options.shrink == 'scale') {
                            this.height = Math.max(this.indicatorHeight + y * 3, 8);
                            this.indicatorStyle.height = this.height + 'px';
                        }
                        y = this.minBoundaryY;
                    } else if (y > this.maxBoundaryY) {
                        if (this.options.shrink == 'scale') {
                            this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                            this.indicatorStyle.height = this.height + 'px';
                            y = this.maxPosY + this.indicatorHeight - this.height;
                        } else {
                            y = this.maxBoundaryY;
                        }
                    } else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
                        this.height = this.indicatorHeight;
                        this.indicatorStyle.height = this.height + 'px';
                    }
                }

                this.x = x;
                this.y = y;

                if (this.scroller.options.useTransform) {
                    this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
                } else {
                    this.indicatorStyle.left = x + 'px';
                    this.indicatorStyle.top = y + 'px';
                }
            },

            _pos: function (x, y) {
                if (x < 0) {
                    x = 0;
                } else if (x > this.maxPosX) {
                    x = this.maxPosX;
                }

                if (y < 0) {
                    y = 0;
                } else if (y > this.maxPosY) {
                    y = this.maxPosY;
                }

                x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
                y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

                this.scroller.scrollTo(x, y);
            },

            fade: function (val, hold) {
                if (hold && !this.visible) {
                    return;
                }

                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;

                var time = val ? 250 : 500,
                    delay = val ? 0 : 300;

                val = val ? '1' : '0';

                this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

                this.fadeTimeout = setTimeout((function (val) {
                    this.wrapperStyle.opacity = val;
                    this.visible = +val;
                }).bind(this, val), delay);
            }
        };


        function _$(el, option) {
            return new IScroll(el, option)
        }

        if (typeof exports !== 'undefined') exports.iScroll = _$;
        else window.iScroll = _$;
        IScroll.utils = utils;


        return _$;

    })(window, document, Math);

});
define("Modernizr", [], function (require, exports, module) {
    window.Modernizr = function (a, b, c) { function z(a) { j.cssText = a } function A(a, b) { return z(m.join(a + ";") + (b || "")) } function B(a, b) { return typeof a === b } function C(a, b) { return !!~("" + a).indexOf(b) } function D(a, b) { for (var d in a) { var e = a[d]; if (!C(e, "-") && j[e] !== c) return b == "pfx" ? e : !0 } return !1 } function E(a, b, d) { for (var e in a) { var f = b[a[e]]; if (f !== c) return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f } return !1 } function F(a, b, c) { var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + o.join(d + " ") + d).split(" "); return B(b, "string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), E(e, b, c)) } var d = "2.6.2", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k, l = {}.toString, m = " -webkit- -moz- -o- -ms- ".split(" "), n = "Webkit Moz O ms", o = n.split(" "), p = n.toLowerCase().split(" "), q = {}, r = {}, s = {}, t = [], u = t.slice, v, w = function (a, c, d, e) { var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body"); if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), l.appendChild(j); return f = ["&#173;", '<style id="s', h, '">', a, "</style>"].join(""), l.id = h, (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), !!i }, x = {}.hasOwnProperty, y; !B(x, "undefined") && !B(x.call, "undefined") ? y = function (a, b) { return x.call(a, b) } : y = function (a, b) { return b in a && B(a.constructor.prototype[b], "undefined") }, Function.prototype.bind || (Function.prototype.bind = function (b) { var c = this; if (typeof c != "function") throw new TypeError; var d = u.call(arguments, 1), e = function () { if (this instanceof e) { var a = function () { }; a.prototype = c.prototype; var f = new a, g = c.apply(f, d.concat(u.call(arguments))); return Object(g) === g ? g : f } return c.apply(b, d.concat(u.call(arguments))) }; return e }), q.touch = function () { var c; return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : w(["@media (", m.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) { c = a.offsetTop === 9 }), c }, q.cssanimations = function () { return F("animationName") }, q.csstransitions = function () { return F("transition") }; for (var G in q) y(q, G) && (v = G.toLowerCase(), e[v] = q[G](), t.push((e[v] ? "" : "no-") + v)); return e.addTest = function (a, b) { if (typeof a == "object") for (var d in a) y(a, d) && e.addTest(d, a[d]); else { a = a.toLowerCase(); if (e[a] !== c) return e; b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), e[a] = b } return e }, z(""), i = k = null, function (a, b) { function k(a, b) { var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement; return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild) } function l() { var a = r.elements; return typeof a == "string" ? a.split(" ") : a } function m(a) { var b = i[a[g]]; return b || (b = {}, h++, a[g] = h, i[h] = b), b } function n(a, c, f) { c || (c = b); if (j) return c.createElement(a); f || (f = m(c)); var g; return f.cache[a] ? g = f.cache[a].cloneNode() : e.test(a) ? g = (f.cache[a] = f.createElem(a)).cloneNode() : g = f.createElem(a), g.canHaveChildren && !d.test(a) ? f.frag.appendChild(g) : g } function o(a, c) { a || (a = b); if (j) return a.createDocumentFragment(); c = c || m(a); var d = c.frag.cloneNode(), e = 0, f = l(), g = f.length; for (; e < g; e++) d.createElement(f[e]); return d } function p(a, b) { b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag()), a.createElement = function (c) { return r.shivMethods ? n(c, a, b) : b.createElem(c) }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + l().join().replace(/\w+/g, function (a) { return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")' }) + ");return n}")(r, b.frag) } function q(a) { a || (a = b); var c = m(a); return r.shivCSS && !f && !c.hasCSS && (c.hasCSS = !!k(a, "article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")), j || p(a, c), a } var c = a.html5 || {}, d = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, e = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, f, g = "_html5shiv", h = 0, i = {}, j; (function () { try { var a = b.createElement("a"); a.innerHTML = "<xyz></xyz>", f = "hidden" in a, j = a.childNodes.length == 1 || function () { b.createElement("a"); var a = b.createDocumentFragment(); return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined" }() } catch (c) { f = !0, j = !0 } })(); var r = { elements: c.elements || "abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video", shivCSS: c.shivCSS !== !1, supportsUnknownElements: j, shivMethods: c.shivMethods !== !1, type: "default", shivDocument: q, createElement: n, createDocumentFragment: o }; a.html5 = r, q(b) }(this, b), e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, e.testProp = function (a) { return D([a]) }, e.testAllProps = F, e.testStyles = w, e.prefixed = function (a, b, c) { return b ? F(a, b, c) : F(a, "pfx") }, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""), e }(this, this.document), function (a, b, c) { function d(a) { return "[object Function]" == o.call(a) } function e(a) { return "string" == typeof a } function f() { } function g(a) { return !a || "loaded" == a || "complete" == a || "uninitialized" == a } function h() { var a = p.shift(); q = 1, a ? a.t ? m(function () { ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1) }, 0) : (a(), h()) : q = 0 } function i(a, c, d, e, f, i, j) { function k(b) { if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, b)) { "img" != a && m(function () { t.removeChild(l) }, 50); for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload() } } var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = { t: d, s: c, e: f, a: i, x: j }; 1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function () { k.call(this, r) }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), m(k, j)) : y[c].push(l)) } function j(a, b, c, d, f) { return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 1 == p.length && h()), this } function k() { var a = B; return a.loader = { load: j, i: 0 }, a } var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function (a) { return "[object Array]" == o.call(a) }, x = [], y = {}, z = { timeout: function (a, b) { return b.length && (a.timeout = b[0]), a } }, A, B; B = function (a) { function b(a) { var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = { url: c, origUrl: c, prefixes: a }, e, f, g; for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g)); for (f = 0; f < b; f++) c = x[f](c); return c } function g(a, e, f, g, h) { var i = b(a), j = i.autoCallback; i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), (d(e) || d(j)) && f.load(function () { k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2 }))) } function h(a, b) { function c(a, c) { if (a) { if (e(a)) c || (j = function () { var a = [].slice.call(arguments); k.apply(this, a), l() }), g(a, j, b, 0, h); else if (Object(a) === a) for (n in m = function () { var b = 0, c; for (c in a) a.hasOwnProperty(c) && b++; return b }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function () { var a = [].slice.call(arguments); k.apply(this, a), l() } : j[n] = function (a) { return function () { var b = [].slice.call(arguments); a && a.apply(this, b), l() } }(k[n])), g(a[n], j, b, n, h)) } else !c && l() } var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n; c(h ? a.yep : a.nope, !!i), i && c(i) } var i, j, l = this.yepnope.loader; if (e(a)) g(a, 0, l, 0); else if (w(a)) for (i = 0; i < a.length; i++) j = a[i], e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l) }, B.addPrefix = function (a, b) { z[a] = b }, B.addFilter = function (a) { x.push(a) }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", b.addEventListener("DOMContentLoaded", A = function () { b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete" }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function (a, c, d, e, i, j) { var k = b.createElement("script"), l, o, e = e || B.errorTimeout; k.src = a; for (o in d) k.setAttribute(o, d[o]); c = j ? h : c || f, k.onreadystatechange = k.onload = function () { !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null) }, m(function () { l || (l = 1, c(1)) }, e), i ? k.onload() : n.parentNode.insertBefore(k, n) }, a.yepnope.injectCss = function (a, c, d, e, g, i) { var e = b.createElement("link"), j, c = i ? h : c || f; e.href = a, e.rel = "stylesheet", e.type = "text/css"; for (j in d) e.setAttribute(j, d[j]); g || (n.parentNode.insertBefore(e, n), m(c, 0)) } }(this, document), Modernizr.load = function () { yepnope.apply(window, [].slice.call(arguments, 0)) };
    return Modernizr;
});
define("ltLine", ["ltWidget"], function (widget, exports, module) {
    var lineId = 0;

    function LtLine(option) {
        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "line" + lineId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.animationEnd = "webkitAnimationEnd";
        s.append();
        s.setStyle('line' + lineId);
        s.target = $(".line" + lineId);
    }
    LtLine.prototype.setStyle = widget.prototype.setStyle;
    LtLine.prototype.append = function () {
        lineId++;
        var s = this;
        var div = "<div id='" + s.id + "'  data-showtype='" + s.showType + "' data-type='" + s.type + "' class='ltline ltwidget widgetParentline" + lineId + "'><svg class='line" + lineId + " '>" +
            "<polyline stroke='" + s.styles.backgroundColor + "' stroke-dasharray='" + s.styles.dasharray + "' stroke-width='" + s.styles.lineWidth + "' points='" + s.styles.points + "'></polyline>"
            + "<svg></div>";
        var line_container = $(div);
        s.parent.append(line_container);
    };
    function _$(option) {
        return new LtLine(option);
    }
    //   exports.LtLine = _$;
    return _$;

});
define("ltEllipse", ["ltWidget"], function (widget, exports, module) {
    var ellipseId = 0;

    function LtEllipse(option) {
        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "ellipse" + ellipseId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.animationEnd = "webkitAnimationEnd";
        s.append();
        s.setStyle('ellipse' + ellipseId);
        s.target = $(".ellipse" + ellipseId);
    }
    LtEllipse.prototype.setStyle = widget.prototype.setStyle;
    LtEllipse.prototype.append = function () {
        ellipseId++;
        var s = this;
        var ellipse_container = $("<div  id='" + s.id + "'  data-showtype='" + s.showType + "' data-type='" + s.type + "' class='ltellipse ltwidget widgetParentellipse" + ellipseId + "'><div class='ellipse" + ellipseId + " '></div></div>");
        s.parent.append(ellipse_container);
    };
    function _$(option) {
        return new LtEllipse(option)
    }
    // exports.LtEllipse = _$;
    return _$;

});
define("ltOutTool", ["ltWidget"], function (widget, exports, module) {
    var outtoolId = 0;
    function ltOutTool(option) {
        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "outtool" + outtoolId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.html = option.html || "";
        s.links =(option.links) || [];
        s.scripts = option.scripts || [];
        s.data = option.data || {};
        for (var i = 0; i < s.links.length; i++) {
            s.links[i].src = "/html/" + s.links[i].src;
        }
        s.append();
        s.setStyle('outtool' + outtoolId);
        s.target = $(".outtool" + outtoolId);
    }
    ltOutTool.prototype.setStyle = widget.prototype.setStyle;
    ltOutTool.prototype.append = function () {
        outtoolId++;
        var s = this;
        var type = s.data.type;
        if ((!type || type !== "image") && s.links && s.links.length > 0) {
            var head = $("head");
            for (var i = 0; i < s.links.length; i++) {
                $("#" + s.links[i].id).size() <= 0 && head.append(' <link href="' + s.links[i].src + '" id="' + s.links[i].id + '" rel="stylesheet" type="text/css">');
                //$("#" + s.links[i].id).size() <= 0 && head.append(' <link href="/previewstatic' + s.links[i].src.split("static")[1] + '" id="' + s.links[i].id + '" rel="stylesheet" type="text/css">');
            }
        }

        if ((!type || type !== "image") && s.scripts && s.scripts.length > 0) {
            requirejs(s.scripts, function () {
                for (var i = 0; i < arguments.length; i++) {
                    typeof arguments[i] === "function" && arguments[i]("outtool_" + s.id, s.data);
                }
            });
        }
        s.parent.append("<div  id='" + s.id + "'  data-showtype='" + s.showType + "' data-type='" + s.type + "' class='ltouttool ltwidget widgetParentouttool" + outtoolId + "'>" + s.html + "</div>");
        $("#outtool_" + s.id).addClass("outtool" + outtoolId).css({ "width": s.styles.width, "height": s.styles.height });
    };

    function _$(option) {
        return new ltOutTool(option)
    }
    //exports.ltOutTool = _$;
    return _$;

});
define("ltOutweb", ["ltWidget"], function (widget, exports, module) {
    var outwebId = 0;
    function ltOutweb(option) {
        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "outweb" + outwebId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.text = option.text || "";
        s.animationEnd = "webkitAnimationEnd";
        s.append();
        //s.setStyle('outweb' + outwebId);
        s.target = $(".outweb" + outwebId);
    }
    ltOutweb.prototype.setStyle = widget.prototype.setStyle;
    ltOutweb.prototype.append = function () {
        var s = this;
        s.parent.append(s.text);
    };


    function _$(option) {
        return new ltOutweb(option)
    }
    // exports.ltOutweb = _$;

    return _$;

});
define("ltRadius", ["ltWidget"], function (widget, exports, module) {
    var radiusId = 0;

    function LtRadius(option) {
        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "radius" + radiusId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.animationEnd = "webkitAnimationEnd";
        s.append();
        s.setStyle('radius' + radiusId);
        s.target = $(".radius" + radiusId);
    }
    LtRadius.prototype.setStyle = widget.prototype.setStyle;
    LtRadius.prototype.append = function () {
        radiusId++;
        var s = this;
        var radius_container = $("<div  id='" + s.id + "'  data-showtype='" + s.showType + "' data-type='" + s.type + "' class='ltradius ltwidget widgetParentradius" + radiusId + " '><div class='radius" + radiusId + "'></div></div>");
        s.parent.append(radius_container);
    };
    function _$(option) {
        return new LtRadius(option);
    }
    /// exports.LtRadius = _$;
    return _$;

});
define("ltRectangular", ["ltWidget"], function (widget, exports, module) {
    var rectangularId = 0;
    function LtRectangular(option) {
        !option && (option = {});
        var s = this;
        var a = widget.call(this, option, "rectangular" + rectangularId);
        for (var attr in a) {
            s[attr] = a[attr];
        }

        s.animationEnd = "webkitAnimationEnd";
        s.append();
        s.setStyle('rectangular' + rectangularId);
        s.target = $(".rectangular" + rectangularId);
    }
    LtRectangular.prototype.setStyle = widget.prototype.setStyle;
    LtRectangular.prototype.append = function () {
        rectangularId++;
        var s = this;
        var rectangular_container = $("<div  id='" + s.id + "'  data-showtype='" + s.showType + "' data-type='" + s.type + "' class='ltrectangular ltwidget widgetParentrectangular" + rectangularId + "'><div class='rectangular" + rectangularId + " '></div></div>");
        s.parent.append(rectangular_container);
    };
    function _$(option) {
        return new LtRectangular(option);
    }
    // exports.LtRectangular = _$;
    return _$;

});
define("ltSlider", ["ltWidget", "Modernizr"], function (widget, Modernizr, module) {//幻灯片对象
    var sliderId = 0;
    //llj 7.1
    var animEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'OAnimation': 'oAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
        support = Modernizr.cssanimations;
    function ltSlider(option) {
        if (!option) { return; }
        var s = this;
        s.src = option.src || {};
        s.href = option.href || "#";
        s.automaticPlay = option.automaticPlay || false;//是否自动切换
        s.sliderChangeType = option.sliderChangeType * 1 || 0;//切换类型
        s.switchingTime = option.switchingTime * 1000 || 0;//切换时间
        s.timeout = option.timeout || "";

        s.$main = "";
        s.$pages = "";
        s.$iterate = $('#iterateEffects');
        s.animcursor = 1;
        s.pagesCount = 0;
        s.current = 0;
        s.isAnimating = false;
        s.endCurrPage = false;
        s.endNextPage = false;

        var a = widget.call(s, option, "slider" + sliderId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.append();
        s.setStyle('slider' + sliderId);
        s.target = $('.slider' + sliderId);
        s.classNames = option.classNames || "";
        s.animationEnd = "webkitAnimationEnd";
    }

    ltSlider.prototype.setStyle = widget.prototype.setStyle;

    ltSlider.prototype.append = function () {
        sliderId++;
        var s = this;
        var img_container = "";
        var imgs = "";
        for (var i = 0, len = s.src.length; i < len; i++) {
            imgs += "<div class=\"lt-slider\"><img src='" + s.src[i]["src"] + "' /></div>";
        }
        if (s.href !== "#") {
            img_container = $("<div id='" + s.id + "'  data-showtype='" + s.showType + "'  data-id='" + s.id + "' data-type='" + s.type + "' class='ltimg pt-perspective-slider ltwidget widgetParentslider" + sliderId + "'><div class='slider" + sliderId + "'><a href='" + s.href + "'>" + imgs + "</a></div></div>");
        } else {
            img_container = $("<div id='" + s.id + "'  data-showtype='" + s.showType + "'  data-id='" + s.id + "' data-type='" + s.type + "' class='ltimg pt-perspective-slider ltwidget widgetParentslider" + sliderId + "'><div class='slider" + sliderId + "'>" + imgs + "</div></div>");
        }
        s.parent.append(img_container);
        $("#" + s.id).css("overflow", "hidden");//.css("transform", "translate3d(0,0,0)").css("-webkit-transform", "translate3d(0,0,0)");
        $("#" + s.id).find(".lt-slider").css("height", s.styles.height.replace('rem', '') * 32 + "px");
        init(s);
        if (s.automaticPlay) {//自动切换
            s.timeout = setInterval(function () {
                nextPage(s);
            }, s.switchingTime);
        }
    }
    function setIntervals(s) {
        if (s.automaticPlay) {
            clearTimeout(s.setTimeouts);
            s.setTimeouts = setTimeout(function () {
                clearTimeout(s.setTimeouts);
                nextPage(s);
                s.timeout = setInterval(function () {
                    nextPage(s);
                }, s.switchingTime);
            }, s.switchingTime);
        }
    };
    function init(s) {
        s.$main = $("#" + s.id);
        s.$pages = s.$main.find(".lt-slider");
        s.pagesCount = s.$pages.length;
        var firstWidget = s.$pages.eq(s.current);
        s.$pages.each(function () {
            var $page = $(this);
            $page.data('originalClassList', $page.attr('class'));
        });
        firstWidget.addClass('lt-slider-current');



        s.$main.swipe("left",
            function () {
                if (s.automaticPlay) {
                    clearInterval(s.timeout);
                }
                nextPage(s);
                setIntervals(s);
            }).swipe("right",
            function () {
                if (s.automaticPlay) {
                    clearInterval(s.timeout);
                }
                prevPage(s);
                setIntervals(s);
            });
    }

    function nextPage(s) {
        var animation = s.sliderChangeType - 1;
        if (s.isAnimating) {
            return false;
        }
        s.isAnimating = true;
        var $currPage = s.$pages.eq(s.current);
        if (s.current < s.pagesCount - 1) {
            ++s.current;
        }
        else {
            s.current = 0;
        }
        var $nextPage = s.$pages.eq(s.current).addClass('lt-slider-current');
        var getJson = setAnimation(animation);
        var outClass = getJson.outClass, inClass = getJson.inClass;
        $currPage.addClass(outClass).on(animEndEventName, function () {
            $currPage.off(animEndEventName);
            s.endCurrPage = true;
            if (s.endNextPage) {
                onEndAnimation($currPage, $nextPage, s);
            }
        });
        $nextPage.addClass(inClass).on(animEndEventName, function () {
            $nextPage.off(animEndEventName);
            s.endNextPage = true;
            if (s.endCurrPage) {
                onEndAnimation($currPage, $nextPage, s);
            }
        });
        if (!support) {
            onEndAnimation($currPage, $nextPage, s);
        }
    }
    function prevPage(s) {
        var animation = s.sliderChangeType;
        if (s.isAnimating) {
            return false;
        }
        s.isAnimating = true;
        var $currPage = s.$pages.eq(s.current);
        if (s.current > 0) {
            --s.current;
        }
        else {
            s.current = s.pagesCount - 1;
        }
        var $nextPage = s.$pages.eq(s.current).addClass('lt-slider-current');;
        var getJson = setAnimation(animation);
        var outClass = getJson.outClass, inClass = getJson.inClass;

        $currPage.addClass(outClass).on(animEndEventName, function () {
            $currPage.off(animEndEventName);
            s.endCurrPage = true;
            if (s.endNextPage) {
                onEndAnimation($currPage, $nextPage, s);
            }
        });
        $nextPage.addClass(inClass).on(animEndEventName, function () {
            $nextPage.off(animEndEventName);
            s.endNextPage = true;
            if (s.endCurrPage) {
                onEndAnimation($currPage, $nextPage, s);
            }
        });
        if (!support) {
            onEndAnimation($currPage, $nextPage, s);
        }
    }
    function setAnimation(animation) {
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
            case 3:
                outClass = 'fly-page-moveToTop';
                inClass = 'fly-page-moveFromBottom';
                break;
            case 4:
                outClass = 'fly-page-moveToBottom';
                inClass = 'fly-page-moveFromTop';
                break;
            case 5:
                outClass = 'fly-page-fade';
                inClass = 'fly-page-moveFromRight fly-page-ontop';
                break;
            case 6:
                outClass = 'fly-page-fade';
                inClass = 'fly-page-moveFromLeft fly-page-ontop';
                break;
            case 7:
                outClass = 'fly-page-fade';
                inClass = 'fly-page-moveFromBottom fly-page-ontop';
                break;
            case 8:
                outClass = 'fly-page-fade';
                inClass = 'fly-page-moveFromTop fly-page-ontop';
                break;
            case 9:
                outClass = 'fly-page-moveToLeftFade';
                inClass = 'fly-page-moveFromRightFade';
                break;
            case 10:
                outClass = 'fly-page-moveToRightFade';
                inClass = 'fly-page-moveFromLeftFade';
                break;
            case 11:
                outClass = 'fly-page-moveToTopFade';
                inClass = 'fly-page-moveFromBottomFade';
                break;
            case 12:
                outClass = 'fly-page-moveToBottomFade';
                inClass = 'fly-page-moveFromTopFade';
                break;
            case 13:
                outClass = 'fly-page-moveToLeftEasing fly-page-ontop';
                inClass = 'fly-page-moveFromRight';
                break;
            case 14:
                outClass = 'fly-page-moveToRightEasing fly-page-ontop';
                inClass = 'fly-page-moveFromLeft';
                break;
            case 15:
                outClass = 'fly-page-moveToTopEasing fly-page-ontop';
                inClass = 'fly-page-moveFromBottom';
                break;
            case 16:
                outClass = 'fly-page-moveToBottomEasing fly-page-ontop';
                inClass = 'fly-page-moveFromTop';
                break;
            case 17:
                outClass = 'fly-page-scaleDown';
                inClass = 'fly-page-moveFromRight fly-page-ontop';
                break;
            case 18:
                outClass = 'fly-page-scaleDown';
                inClass = 'fly-page-moveFromLeft fly-page-ontop';
                break;
            case 19:
                outClass = 'fly-page-scaleDown';
                inClass = 'fly-page-moveFromBottom fly-page-ontop';
                break;
            case 20:
                outClass = 'fly-page-scaleDown';
                inClass = 'fly-page-moveFromTop fly-page-ontop';
                break;
            case 21:
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
            case 25:
                outClass = 'fly-page-moveToTop fly-page-ontop';
                inClass = 'fly-page-scaleUp';
                break;
            case 26:
                outClass = 'fly-page-moveToBottom fly-page-ontop';
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
            case 29:
                outClass = 'fly-page-rotateLeftSideFirst';
                inClass = 'fly-page-moveFromLeft fly-page-delay200 fly-page-ontop';
                break;
            case 30:
                outClass = 'fly-page-rotateTopSideFirst';
                inClass = 'fly-page-moveFromTop fly-page-delay200 fly-page-ontop';
                break;
            case 31:
                outClass = 'fly-page-rotateBottomSideFirst';
                inClass = 'fly-page-moveFromBottom fly-page-delay200 fly-page-ontop';
                break;
            case 32:
                outClass = 'fly-page-flipOutRight';
                inClass = 'fly-page-flipInLeft fly-page-delay500';
                break;
            case 33:
                outClass = 'fly-page-flipOutLeft';
                inClass = 'fly-page-flipInRight fly-page-delay500';
                break;
            case 34:
                outClass = 'fly-page-flipOutTop';
                inClass = 'fly-page-flipInBottom fly-page-delay500';
                break;
            case 35:
                outClass = 'fly-page-flipOutBottom';
                inClass = 'fly-page-flipInTop fly-page-delay500';
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
            case 39:
                outClass = 'fly-page-rotatePushRight';
                inClass = 'fly-page-moveFromLeft';
                break;
            case 40:
                outClass = 'fly-page-rotatePushTop';
                inClass = 'fly-page-moveFromBottom';
                break;
            case 41:
                outClass = 'fly-page-rotatePushBottom';
                inClass = 'fly-page-moveFromTop';
                break;
            case 42:
                outClass = 'fly-page-rotatePushLeft';
                inClass = 'fly-page-rotatePullRight fly-page-delay180';
                break;
            case 43:
                outClass = 'fly-page-rotatePushRight';
                inClass = 'fly-page-rotatePullLeft fly-page-delay180';
                break;
            case 44:
                outClass = 'fly-page-rotatePushTop';
                inClass = 'fly-page-rotatePullBottom fly-page-delay180';
                break;
            case 45:
                outClass = 'fly-page-rotatePushBottom';
                inClass = 'fly-page-rotatePullTop fly-page-delay180';
                break;
            case 46:
                outClass = 'fly-page-rotateFoldLeft';
                inClass = 'fly-page-moveFromRightFade';
                break;
            case 47:
                outClass = 'fly-page-rotateFoldRight';
                inClass = 'fly-page-moveFromLeftFade';
                break;
            case 48:
                outClass = 'fly-page-rotateFoldTop';
                inClass = 'fly-page-moveFromBottomFade';
                break;
            case 49:
                outClass = 'fly-page-rotateFoldBottom';
                inClass = 'fly-page-moveFromTopFade';
                break;
            case 50:
                outClass = 'fly-page-moveToRightFade';
                inClass = 'fly-page-rotateUnfoldLeft';
                break;
            case 51:
                outClass = 'fly-page-moveToLeftFade';
                inClass = 'fly-page-rotateUnfoldRight';
                break;
            case 52:
                outClass = 'fly-page-moveToBottomFade';
                inClass = 'fly-page-rotateUnfoldTop';
                break;
            case 53:
                outClass = 'fly-page-moveToTopFade';
                inClass = 'fly-page-rotateUnfoldBottom';
                break;
            case 54:
                outClass = 'fly-page-rotateRoomLeftOut fly-page-ontop';
                inClass = 'fly-page-rotateRoomLeftIn';
                break;
            case 55:
                outClass = 'fly-page-rotateRoomRightOut fly-page-ontop';
                inClass = 'fly-page-rotateRoomRightIn';
                break;
            case 56:
                outClass = 'fly-page-rotateRoomTopOut fly-page-ontop';
                inClass = 'fly-page-rotateRoomTopIn';
                break;
            case 57:
                outClass = 'fly-page-rotateRoomBottomOut fly-page-ontop';
                inClass = 'fly-page-rotateRoomBottomIn';
                break;
            case 58:
                outClass = 'fly-page-rotateCubeLeftOut fly-page-ontop';
                inClass = 'fly-page-rotateCubeLeftIn';
                break;
            case 59:
                outClass = 'fly-page-rotateCubeRightOut fly-page-ontop';
                inClass = 'fly-page-rotateCubeRightIn';
                break;
            case 60:
                outClass = 'fly-page-rotateCubeTopOut fly-page-ontop';
                inClass = 'fly-page-rotateCubeTopIn';
                break;
            case 61:
                outClass = 'fly-page-rotateCubeBottomOut fly-page-ontop';
                inClass = 'fly-page-rotateCubeBottomIn';
                break;
            case 62:
                outClass = 'fly-page-rotateCarouselLeftOut fly-page-ontop';
                inClass = 'fly-page-rotateCarouselLeftIn';
                break;
            case 63:
                outClass = 'fly-page-rotateCarouselRightOut fly-page-ontop';
                inClass = 'fly-page-rotateCarouselRightIn';
                break;
            case 64:
                outClass = 'fly-page-rotateCarouselTopOut fly-page-ontop';
                inClass = 'fly-page-rotateCarouselTopIn';
                break;
            case 65:
                outClass = 'fly-page-rotateCarouselBottomOut fly-page-ontop';
                inClass = 'fly-page-rotateCarouselBottomIn';
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
    function onEndAnimation($outpage, $inpage, s) {
        s.endCurrPage = false;
        s.endNextPage = false;
        resetPage($outpage, $inpage);
        s.isAnimating = false;
    }
    function resetPage($outpage, $inpage) {
        $outpage.attr('class', $outpage.data('originalClassList'));
        $inpage.attr('class', $inpage.data('originalClassList') + ' fly-page-current');
    }

    function _$(option) {
        return new ltSlider(option)
    }

    //exports.ltSlider = _$;
    return _$;

});
define("ltVideo", ["ltWidget"], function (widget, exports, module) {//视频对象
    var videoId = 0;
    function LtVideo(option) {
        if (!option) { return; }

        var s = this;
        s.src = option.src || "";
        s.poster = option.poster || "";
        s.pic = option.pic || "";
        var a = widget.call(s, option, "video" + videoId);
        for (var attr in a) {
            s[attr] = a[attr];
        }
        s.append();

        s.setStyle('video' + videoId);
        s.target = $('.video' + videoId);
        s.loadVideo();
        s.classNames = option.classNames || "";
        s.animationEnd = "webkitAnimationEnd";
    }

    LtVideo.prototype.setStyle = widget.prototype.setStyle;

    LtVideo.prototype.append = function () {
        videoId++;
        var s = this;
        var video_container = "";
        var fontSize = parseFloat($("html").css("fontSize"));
        video_container = $("\
            <div style='' id='" + s.id + "'  data-showtype='" + s.showType + "'  data-type='" + s.type + "' class='ltvideo ltwidget widgetParentvideo" + videoId + "'>\
                <div style='position:absolute;line-height:" + s.styles.height + ";z-index:3;text-align:center;color:black;' class='tips video video" + videoId + "'></div>\
                <video style='-webkit-transform:rotate("+ (s.styles.rotate ? s.styles.rotate : 0) + "deg);transform:rotate(" + (s.styles.rotate ? s.styles.rotate : 0) + "deg);border-radius:" + (s.styles.borderRadius ? s.styles.borderRadius : 0) + "%;\
                	border-style: "+ (s.styles.borderStyle ? s.styles.borderStyle : "") + ";border-width:" + s.styles.borderWidth + ";border-color:" + (s.styles.borderColor ? s.styles.borderColor : "") + ";box-shadow:" + s.styles.boxShadow + ";background-color:" + s.styles.backgroundColor + ";'\
                	poster='" + s.poster + "' controls width='" + (parseFloat(s.styles.width) * fontSize) + "' height='" + (parseFloat(s.styles.height) * fontSize) + "' src='" + s.src + "'>\
                </video>\
            </div>");

        s.parent.append(video_container);
    }


    LtVideo.prototype.loadVideo = function () {
        var s = this;
        var video = s.parent.find("video")[0];
        video.load();
        var state = video.networkState;
        var tip = "使用" + getLineStatus() + "播放,";
        if (state == 0) {
            tip += '等待初始化';
        } else if (state == 1) {
            tip += '网络连接失败';
        } else if (state == 2) {
            tip += '加载中……';
        } else if (state == 3) {
            tip += '资源未找到';
        }
        var oTips = $(".tips");
        oTips.html(tip);
        video.addEventListener('stalled', function () {

            oTips.html("网络连接失败");
        }, false);
        video.addEventListener('error', function () {
            oTips.html("使用" + getLineStatus() + "播放,加载出错");
            video.controls = "";
        }, false);
        video.addEventListener('progress', function () {
            oTips.html("使用" + getLineStatus() + "播放,加载中……");
        }, false);
        video.addEventListener('pause', function () {
            video.poster = s.pic;
        }, false);
        video.addEventListener('loadedmetadata', function () {
            oTips.hide();
        }, false);
    }


    function getLineStatus() {
        //平台、设备和操作系统
        var system = {
            win: false,
            mac: false,
            xll: false,
            ipad: false
        };
        //检测平台
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
        if (system.win || system.mac || system.xll || system.ipad) {
            return "ethernet";
        } else {
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || { type: 'unknown' };
            var type_text = ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none'];
            if (typeof (connection.type) == "number") {
                connection.type_text = type_text[connection.type];
            } else {
                connection.type_text = connection.type;
            }

            if (typeof (connection.bandwidth) == "number") {
                if (connection.bandwidth > 10) {
                    connection.type_text = 'wifi';
                } else if (connection.bandwidth > 2) {
                    connection.type_text = '3g';
                } else if (connection.bandwidth > 0) {
                    connection.type_text = '2g';
                } else if (connection.bandwidth == 0) {
                    connection.type_text = 'none';
                } else {
                    connection.type_text = 'unknown';
                }
            }
            return connection.type_text;
        }

    }

    function _$(option) {
        return new LtVideo(option)
    }

    // exports.LtVideo = _$;

    return _$;

});
define("Sonic", [], function (require, exports, module) {
    var emptyFn = function () { };

    function Sonic(d) {

        this.converter = d.converter;

        this.data = d.path || d.data;
        this.imageData = [];

        this.multiplier = d.multiplier || 1;
        this.padding = d.padding || 0;

        this.fps = d.fps || 25;

        this.stepsPerFrame = ~~d.stepsPerFrame || 1;
        this.trailLength = d.trailLength || 1;
        this.pointDistance = d.pointDistance || .05;

        this.domClass = d.domClass || 'sonic';

        this.backgroundColor = d.backgroundColor || 'rgba(0,0,0,0)';
        this.fillColor = d.fillColor;
        this.strokeColor = d.strokeColor;

        this.stepMethod = typeof d.step == 'string' ?
            stepMethods[d.step] :
        d.step || stepMethods.square;

        this._setup = d.setup || emptyFn;
        this._teardown = d.teardown || emptyFn;
        this._preStep = d.preStep || emptyFn;

        this.pixelRatio = d.pixelRatio || null;

        this.width = d.width;
        this.height = d.height;

        this.fullWidth = this.width + 2 * this.padding;
        this.fullHeight = this.height + 2 * this.padding;

        this.domClass = d.domClass || 'sonic';

        this.setup();

    }

    var argTypes = Sonic.argTypes = {
        DIM: 1,
        DEGREE: 2,
        RADIUS: 3,
        OTHER: 0
    };

    var argSignatures = Sonic.argSignatures = {
        arc: [1, 1, 3, 2, 2, 0],
        bezier: [1, 1, 1, 1, 1, 1, 1, 1],
        line: [1, 1, 1, 1]
    };

    var pathMethods = Sonic.pathMethods = {
        bezier: function (t, p0x, p0y, p1x, p1y, c0x, c0y, c1x, c1y) {

            t = 1 - t;

            var i = 1 - t,
                x = t * t,
                y = i * i,
                a = x * t,
                b = 3 * x * i,
                c = 3 * t * y,
                d = y * i;

            return [
                a * p0x + b * c0x + c * c1x + d * p1x,
                a * p0y + b * c0y + c * c1y + d * p1y
            ]

        },
        arc: function (t, cx, cy, radius, start, end) {

            var point = (end - start) * t + start;

            var ret = [
                (Math.cos(point) * radius) + cx,
                (Math.sin(point) * radius) + cy
            ];

            ret.angle = point;
            ret.t = t;

            return ret;

        },
        line: function (t, sx, sy, ex, ey) {
            return [
                (ex - sx) * t + sx,
                (ey - sy) * t + sy
            ]
        }
    };

    var stepMethods = Sonic.stepMethods = {

        square: function (point, i, f, color, alpha) {
            this._.fillRect(point.x - 3, point.y - 3, 6, 6);
        },

        fader: function (point, i, f, color, alpha) {

            this._.beginPath();

            if (this._last) {
                this._.moveTo(this._last.x, this._last.y);
            }

            this._.lineTo(point.x, point.y);
            this._.closePath();
            this._.stroke();

            this._last = point;

        }

    }

    Sonic.prototype = {

        calculatePixelRatio: function () {

            var devicePixelRatio = window.devicePixelRatio || 1;
            var backingStoreRatio = this._.webkitBackingStorePixelRatio
                || this._.mozBackingStorePixelRatio
                || this._.msBackingStorePixelRatio
                || this._.oBackingStorePixelRatio
                || this._.backingStorePixelRatio
                || 1;

            return devicePixelRatio / backingStoreRatio;
        },

        setup: function () {

            var args,
                type,
                method,
                value,
                data = this.data;

            this.canvas = document.createElement('canvas');
            this._ = this.canvas.getContext('2d');

            if (this.pixelRatio == null) {
                this.pixelRatio = this.calculatePixelRatio();
            }

            this.canvas.className = this.domClass;

            if (this.pixelRatio != 1) {

                this.canvas.style.height = this.fullHeight + 'px';
                this.canvas.style.width = this.fullWidth + 'px';

                this.fullHeight *= this.pixelRatio;
                this.fullWidth *= this.pixelRatio;

                this.canvas.height = this.fullHeight;
                this.canvas.width = this.fullWidth;

                this._.scale(this.pixelRatio, this.pixelRatio);

            } else {

                this.canvas.height = this.fullHeight;
                this.canvas.width = this.fullWidth;

            }

            this.points = [];

            for (var i = -1, l = data.length; ++i < l;) {

                args = data[i].slice(1);
                method = data[i][0];

                if (method in argSignatures) for (var a = -1, al = args.length; ++a < al;) {

                    type = argSignatures[method][a];
                    value = args[a];

                    switch (type) {
                        case argTypes.RADIUS:
                            value *= this.multiplier;
                            break;
                        case argTypes.DIM:
                            value *= this.multiplier;
                            value += this.padding;
                            break;
                        case argTypes.DEGREE:
                            value *= Math.PI / 180;
                            break;
                    };

                    args[a] = value;

                }

                args.unshift(0);

                for (var r, pd = this.pointDistance, t = pd; t <= 1; t += pd) {

                    // Avoid crap like 0.15000000000000002
                    t = Math.round(t * 1 / pd) / (1 / pd);

                    args[0] = t;

                    r = pathMethods[method].apply(null, args);

                    this.points.push({
                        x: r[0],
                        y: r[1],
                        progress: t
                    });

                }

            }

            this.frame = 0;

            if (this.converter && this.converter.setup) {
                this.converter.setup(this);
            }

        },

        prep: function (frame) {

            if (frame in this.imageData) {
                return;
            }

            this._.clearRect(0, 0, this.fullWidth, this.fullHeight);
            this._.fillStyle = this.backgroundColor;
            this._.fillRect(0, 0, this.fullWidth, this.fullHeight);

            var points = this.points,
                pointsLength = points.length,
                pd = this.pointDistance,
                point,
                index,
                frameD;

            this._setup();

            for (var i = -1, l = pointsLength * this.trailLength; ++i < l && !this.stopped;) {

                index = frame + i;

                point = points[index] || points[index - pointsLength];

                if (!point) continue;

                this.alpha = Math.round(1000 * (i / (l - 1))) / 1000;

                this._.globalAlpha = this.alpha;

                if (this.fillColor) {
                    this._.fillStyle = this.fillColor;
                }
                if (this.strokeColor) {
                    this._.strokeStyle = this.strokeColor;
                }

                frameD = frame / (this.points.length - 1);
                indexD = i / (l - 1);

                this._preStep(point, indexD, frameD);
                this.stepMethod(point, indexD, frameD);

            }

            this._teardown();

            this.imageData[frame] = (
                this._.getImageData(0, 0, this.fullWidth, this.fullWidth)
            );

            return true;

        },

        draw: function () {

            if (!this.prep(this.frame)) {

                this._.clearRect(0, 0, this.fullWidth, this.fullWidth);

                this._.putImageData(
                    this.imageData[this.frame],
                    0, 0
                );

            }

            if (this.converter && this.converter.step) {
                this.converter.step(this);
            }

            if (!this.iterateFrame()) {
                if (this.converter && this.converter.teardown) {
                    this.converter.teardown(this);
                    this.converter = null;
                }
            }
            this._.textBaseline = "top";
            this._.fillText("二维码图片生成中...", 50, 100);
        },

        iterateFrame: function () {

            this.frame += this.stepsPerFrame;

            if (this.frame >= this.points.length) {
                this.frame = 0;
                return false;
            }

            return true;

        },

        play: function () {

            this.stopped = false;

            var hoc = this;

            this.timer = setInterval(function () {
                hoc.draw();
            }, 1000 / this.fps);

        },
        stop: function () {

            this.stopped = true;
            this.timer && clearInterval(this.timer);

        }
    };
    //exports.Sonic = Sonic;
    window.Sonic = Sonic;

});
define("ltAudio", ["ltWidget"], function (widget, exports, module) {//图片对象
    var audioId = 0;

    function ltAudio(option) {
        if (!option) { return; }

        var s = this;
        s.src = option.picSrc || "";//音频地址
        s.loop = option.loop || false;
        s.picSrc = option.src;//图片地址
        s.autoPlay = option.autoplay;
        var a = widget.call(s, option, "audio" + audioId);
        for (var attr in a) {
            s[attr] = a[attr];
        }

        s.append();

        s.setStyle('audio' + audioId);
        s.target = $('.audio' + audioId);
        s.classNames = option.classNames || "";
    }

    ltAudio.prototype.setStyle = widget.prototype.setStyle;

    ltAudio.prototype.append = function () {
        audioId++;
        var s = this;
        var audio_container = "";
        if (s.loop) {
            audio_container = $("<div data-autoplay='" + s.autoPlay + "' id='" + s.id + "'   class='ltaudio ltwidget widgetParentaudio" + audioId + "'><img src='" + s.picSrc + "' class='audio_img" + audioId + "' />\
            <audio src=" + s.src + " loop='" + s.loop + "'  style='position:fixed;z-index:-1;opacity:0;'></audio>\
            </div>");
        }
        else {
            audio_container = $("<div data-autoplay='" + s.autoPlay + "' id='" + s.id + "'   class='ltaudio ltwidget widgetParentaudio" + audioId + "'><img src='" + s.picSrc + "' class='audio_img" + audioId + "' />\
            <audio src=" + s.src + "  style='position:fixed;z-index:-1;opacity:0;'></audio>\
            </div>");
        }

        s.parent.append(audio_container);

        s.bindEvent();
    }

    ltAudio.prototype.bindEvent = function () {
        var s = this;
        var audio = $("#" + s.id).find("audio")[0];

        $("#" + s.id).tap(function (e, _this) {
            audio[audio.paused ? "play" : "pause"]();

        });
        var bgAudio = $("#audio");
        if (bgAudio.length > 0 && audio) { //有背景音乐

            audio.addEventListener("ended", function () {
                bgAudio[0].play();
            });

            audio.addEventListener("play", function () {
                bgAudio[0].pause();
            });

            audio.addEventListener("pause", function () {
                bgAudio[0].play();
            });
        }
    }



    function _$(option) {
        return new ltAudio(option)
    }
    return _$;
});
