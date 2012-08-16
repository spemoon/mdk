define(function(require, exports, module) {
    seajs.config({
        map: [
            [ /^(.*\.(?:css|js))(.*)$/i, '$1?20120810' ]
        ]
    });
});