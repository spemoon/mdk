define(function(require, exports, module) {
	/**
	 * window.name 原理
	 *     一个浏览器刷新页面后或者修改location后还存在的内容，可以通过这个特性完成以下功能：
	 *     1. 内容暂存，防止刷新后丢失
	 *     2. 跨域获取内容，例如A域内页面要获取B域内的某个数据，可以通过iframe载入B域页面，B域页面生成window.name
	 *        在页面载入后修改页面location为本域任意页面，通常是一个空页面，此时父页面可以访问iframe的window.name
	 *        达到跨域功能
	 * window.name 大小：2MB（一说最大可以达到32M）
	 */
	var r = {
		set: function(key, value) {
			
		},
		get: function(key) {
			
		},
		del: function() {
			
		},
		proxy: function(dataUrl, proxyUrl) {
			
		}
	};
	return r;
});
