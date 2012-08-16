define(function(require, exports, module) {
    var $ = require('jquery');

    return (function() {
        var ie = !!window.ActiveXObject;
        var webkit = !!window.devicePixelRatio;
        return {
            ie: ie,
            ie6: ie && !window.XMLHttpRequest, // IE6没有Window.XMLHttpRequest，其后版本都有
            ie7: ie && $.browser.version == '7.0',
            ie8: !!window.XDomainRequest,
            ie9: ie && !!+'\v1',
            firefox: !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            opera: webkit && !!window.opera,
            safari: /a/.__proto__ == '//',
            chrome: webkit && !!window.chrome
        };
    })();
});