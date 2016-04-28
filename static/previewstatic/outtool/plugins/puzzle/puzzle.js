define("puzzle", ["createjs"], function () {
    function init(id, option, $http,type) {
        id && (this.id = id);
        this.option = option;
        this.$http = $http;
        this.canvas = document.getElementById(id);
        this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);
        switch (type) {
            case 2:
                this.createPuzzleTwo();
                break;
            case 3:
                this.createPuzzleDefault();
                break;
            case 5:
                this.createPuzzleFive();
                break;
            case 5.1:
                this.createPuzzleFive_one();
                break
            default:
                this.createPuzzleDefault();
                break;
        }
        this.stage.addChild(this.container);
        this.stage.update();
        this.modleClick();
    }
    //创建舞台
    init.prototype.createStage = function () {
        var _this = this;
        _this.canvas.width = _this.option.width || 320;
        _this.canvas.height = _this.option.height || 450;
        _this.stage = new createjs.Stage(_this.canvas);
        _this.container = new createjs.Container();
    };
    init.prototype.insertAt = function (index, value) {
        _this.container.splice(index, 0, value);
    };
    //分割区域 绑定事件
    init.prototype.bindDBLClick = function (graphics) {
        var _this = this;
        
        graphics.addEventListener("dblclick", function (e) {
            var pageii = $.layer({
                type: 1,
                title: ["<span style='padding-left:40px;'>素材库<span>", 'background:url(static/ico/lt-p-ico-files.png) 10px center no-repeat #ffc600; '],
                area: ['800', '600'],
                border: [0], //去掉默认边框
                shift: 'top', //从左动画弹出
                page: { html: temp.pic.html }
            }, false);

            temp.pic.fn(0, pageii, _this.$http, function ($img) {
                var bmp = new createjs.Bitmap($img[0]);
                var disLeft = $(_this.canvas).offset().left,
                    disTop = $(_this.canvas).offset().top;
                bmp.addEventListener("mousedown", function (e) {
                    //缩放
                    var puzzleScale = document.getElementById("lt-p-puzzle-scale");
                    puzzleScale.value = bmp.scaleX;
                    puzzleScale.onchange = null;
                    puzzleScale.onchange = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var puzzleThis = this;
                        bmp.scaleX = puzzleThis.value;
                        bmp.scaleY = puzzleThis.value;
                        _this.stage.update();
                    };
                    //旋转
                    var puzzleRotate = document.getElementById("lt-p-puzzle-rotate");
                    puzzleRotate.value = bmp.rotation;
                    puzzleRotate.onchange = null;
                    puzzleRotate.onchange = function (e) {
                        e.preventDefault();
                        e.stopPropagation(); 
                        var puzzleThis = this;
                        bmp.rotation = puzzleThis.value;
                        _this.stage.update();
                    };

                    var disX = e.stageX - bmp.x;
                    var disY = e.stageY - bmp.y;
                    $(".xuboxPageHtml").on("mousemove", function (e) {
                        bmp.x = e.clientX - disLeft - 10 - disX;
                        bmp.y = e.clientY - disTop - disY;
                        _this.stage.update();
                    }).on("mouseup mouseout", function () {
                        $(this).off("mousemove mouseup mouseout");
                    });
                });
                
                bmp.x = graphics.graphics._activeInstructions[0].x;
                bmp.y = graphics.graphics._activeInstructions[0].y;
                _this.container.addChildAt(bmp, _this.container.getChildIndex(graphics) + 1);
                bmp.mask = graphics;
                _this.stage.update();
                layer.close(pageii);
            });
        });
    };
    //默认格式 3
    init.prototype.createPuzzleDefault = function () {
        var _this = this;
        _this.createStage();
        var path = new createjs.Shape();
        path.graphics.beginFill("#ffffaa").beginStroke("#fff").setStrokeStyle(4).moveTo(0, 0).lineTo(_this.canvas.width, 0).lineTo(_this.canvas.width, _this.canvas.height * .4).lineTo(0, _this.canvas.height * .33).closePath();

        var path1 = new createjs.Shape();
        path1.graphics.beginFill("#f90").beginStroke("#fff").setStrokeStyle(4).moveTo(0, _this.canvas.height * .33).lineTo(_this.canvas.width, _this.canvas.height * .4).lineTo(_this.canvas.width, _this.canvas.height * .6).lineTo(0, _this.canvas.height * .7).closePath();

        var path2 = new createjs.Shape();
        path2.graphics.beginFill("#555").beginStroke("#fff").setStrokeStyle(4).moveTo(0, _this.canvas.height * .7).lineTo(0, _this.canvas.height).lineTo(_this.canvas.width, _this.canvas.height).lineTo(_this.canvas.width, _this.canvas.height * .6).closePath();
        _this.container.addChild(path, path1, path2);
        
        _this.bindDBLClick(path);
        _this.bindDBLClick(path1);
        _this.bindDBLClick(path2);
    };
    //2
    init.prototype.createPuzzleTwo = function () {
        var _this = this;
        _this.createStage();
        var shape1 = new createjs.Shape();
        shape1.graphics.beginFill("pink").beginStroke("#fff").setStrokeStyle(4).moveTo(0, 0).lineTo(_this.canvas.width, 0).lineTo(_this.canvas.width, _this.canvas.height * .4).lineTo(0, _this.canvas.height * .6).closePath();

        var shape2 = new createjs.Shape();
        shape2.graphics.beginFill("yellow").beginStroke("#fff").setStrokeStyle(4).moveTo(0, _this.canvas.height * .6).lineTo(_this.canvas.width, _this.canvas.height * .4).lineTo(_this.canvas.width, _this.canvas.height).lineTo(0, _this.canvas.height).closePath();

        _this.container.addChild(shape1, shape2);
        _this.bindDBLClick(shape1);
        _this.bindDBLClick(shape2);
    };
    //5
    init.prototype.createPuzzleFive = function () {
        var _this = this;
        _this.createStage();
        var shape1 = new createjs.Shape();
        shape1.graphics.beginFill("#956788").beginStroke("#fff").setStrokeStyle(4).moveTo(0, 0).lineTo(_this.canvas.width * .5, 0).lineTo(_this.canvas.width * .4, _this.canvas.height * .4).lineTo(0, _this.canvas.height * .6).closePath();

        var shape2 = new createjs.Shape();
        shape2.graphics.beginFill("#c7d5ee").beginStroke("#fff").setStrokeStyle(4).moveTo(_this.canvas.width * .5, 0).lineTo(_this.canvas.width, 0).lineTo(_this.canvas.width, _this.canvas.height * .4).lineTo(_this.canvas.width * .4, _this.canvas.height * .4).closePath();

        var shape3 = new createjs.Shape();
        shape3.graphics.beginFill("#f8c9d9").beginStroke("#fff").setStrokeStyle(4).moveTo(0, _this.canvas.height * .6).lineTo(_this.canvas.width * .4, _this.canvas.height * .4).lineTo(_this.canvas.width * .5, _this.canvas.height).lineTo(0, _this.canvas.height).closePath();

        var shape4 = new createjs.Shape();
        shape4.graphics.beginFill("#567004").beginStroke("#fff").setStrokeStyle(4).moveTo(_this.canvas.width * .4, _this.canvas.height * .4).lineTo(_this.canvas.width, _this.canvas.height * .4).lineTo(_this.canvas.width, _this.canvas.height).lineTo(_this.canvas.width * .5, _this.canvas.height).closePath();
        var shape5 = new createjs.Shape();
        shape5.graphics.beginFill("pink").beginStroke("#fff").setStrokeStyle(4).drawCircle(_this.canvas.width * .5, _this.canvas.height * .5, 100).closePath();
        _this.container.addChild(shape1, shape2, shape3, shape4, shape5);
        _this.bindDBLClick(shape1);
        _this.bindDBLClick(shape2);
        _this.bindDBLClick(shape3);
        _this.bindDBLClick(shape4);
        _this.bindDBLClick(shape5);
    };
    init.prototype.createPuzzleFive_one = function () {
        var _this = this;
        _this.createStage();
        var shape1 = new createjs.Shape();
        shape1.graphics.beginFill("#FF9AC2").beginStroke("#fff").setStrokeStyle(4).moveTo(0, 0).lineTo(_this.canvas.width * .6, 0).lineTo(_this.canvas.width * .48, _this.canvas.height * .58).lineTo(0, _this.canvas.height * .56).closePath();

        var shape2 = new createjs.Shape();
        shape2.graphics.beginFill("#FFDE72").beginStroke("#fff").setStrokeStyle(4).moveTo(_this.canvas.width * .6, 0).lineTo(_this.canvas.width, 0).lineTo(_this.canvas.width, _this.canvas.height * .22).lineTo(_this.canvas.width * .56, _this.canvas.height * .2).closePath();

        var shape3 = new createjs.Shape();
        shape3.graphics.beginFill("#BBDD77").beginStroke("#fff").setStrokeStyle(4).moveTo(_this.canvas.width * .56, _this.canvas.height * .2).lineTo(_this.canvas.width, _this.canvas.height * .22).lineTo(_this.canvas.width, _this.canvas.height * .56).lineTo(_this.canvas.width * .5, _this.canvas.height * .5).closePath();

        var shape4 = new createjs.Shape();
        shape4.graphics.beginFill("#aaddff").beginStroke("#fff").setStrokeStyle(4).moveTo(_this.canvas.width * .5, _this.canvas.height * .5).lineTo(_this.canvas.width, _this.canvas.height * .56).lineTo(_this.canvas.width, _this.canvas.height).lineTo(_this.canvas.width * .3, _this.canvas.height).lineTo(_this.canvas.width * .4, _this.canvas.height * .58).lineTo(_this.canvas.width * .48, _this.canvas.height * .58).closePath();

        var shape5 = new createjs.Shape();
        shape5.graphics.beginFill("#75C9BA").beginStroke("#fff").setStrokeStyle(4).moveTo(0, _this.canvas.height * .56).lineTo(_this.canvas.width * .4, _this.canvas.height * .58).lineTo(_this.canvas.width * .3, _this.canvas.height).lineTo(0, _this.canvas.height).closePath();

        _this.container.addChild(shape1, shape2, shape3, shape4, shape5);
        _this.bindDBLClick(shape1);
        _this.bindDBLClick(shape2);
        _this.bindDBLClick(shape3);
        _this.bindDBLClick(shape4);
        _this.bindDBLClick(shape5);
    };

    init.prototype.modleClick = function () {
        var _this = this;
        var oLi = $(".lt-p-outtool-puzzle-right-modle ul>li");
        oLi.off("click").on('click', function () {
            _this.container.removeAllChildren();//清除所有图形
            var liThis = $(this);
            _$(_this.id, _this.option, _this.$http, liThis.attr("type") * 1);
        });
    };

    function _$(id, option, $http,type) {
        return new init(id, option, $http,type);
    }
    return _$;
});