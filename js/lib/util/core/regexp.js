define(function(require, exports, module) {
    return {
        url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        email: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        chinese: /[^\u4e00-\u9fa5]/,
        tag: /^<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)$/
    };
});