this.onmessage = function (e) {
    var focusPage = e.data.focusPage, type = e.data.type, focusWidget = e.data.focusWidget;
    if (focusPage) {
        if (type !== "page") {
            var zIndex = [];
            for (var i = 0; i < focusPage.widgets.length; i++) {
               focusPage.widgets[i].styles && zIndex.push(focusPage.widgets[i].styles.zIndex);
            }
            var _downLayer;
            var _prevLayer;
            if (zIndex.length !== 1) {
                var maxZindex = Math.max.apply(Math, zIndex);
                var minZindex = Math.min.apply(Math, zIndex);
                var nowZindex = focusWidget && focusWidget.styles && focusWidget.styles.zIndex || 0;
                if (nowZindex >= maxZindex) {
                   _downLayer = true;
                   _prevLayer = false;
                }
                else if (nowZindex <= minZindex) {
                   _prevLayer = true;
                   _downLayer = false;
                }
                else if (nowZindex < maxZindex && nowZindex > minZindex) {
                   _prevLayer = true;
                   _downLayer = true;
                }
            }
        }
        else {
          _prevLayer = false;
          _downLayer = false;
        }
        this.postMessage({ focusPage: focusPage, prevLayer: _prevLayer, downLayer: _downLayer });
    }

}