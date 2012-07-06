define(function(require, exports, module) {
    var $ = require('../../../../../js/lib/jquery/sea_jquery.js');

    return (function() {
        var ie = !!window.ActiveXObject;
        var webkit = !!window.devicePixelRatio;
        return {
            ie: ie,
            ie6: ie && !window.XMLHttpRequest, // IE6没有Window.XMLHttpRequest，其后版本都有
            ie7: ie && $.browser.version == '7.0',
            firefox: !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            opera: webkit && !!window.opera,
            safari: /a/.__proto__ == '//',
            chrome: webkit && !!window.chrome
        };
    })();
});