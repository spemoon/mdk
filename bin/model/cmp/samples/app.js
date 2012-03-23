define(function(require, exports, module) {
	var $ = require('{jquery}');
    var modName = require('{mod}');
	
    $(function() {
        // 实例代码
        
        
        // 语法高亮
        seajs.use('{highlighter}', function(highlighter) {
            highlighter.highlight();
        });
    });
});
