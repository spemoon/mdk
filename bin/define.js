#!/usr/bin/env node
/*
 * 说明：本程序用来快速建立一个js模块的初始化脚本
 * -----------------------------------------------------
 * 用法：
 *     ./define.js type name [--remove]
 * -----------------------------------------------------
 * 参数说明：
 *     type：类型
 *         cmp：UI组件
 *         util：工具类
 *     name：可以是一个多级目录，例如：
 *         mask
 *         momo/window
 *     --remove：删除已经建立的组件
 * -----------------------------------------------------
 * 功能：
 *     type为cmp时，以name=momo/window为例：
 *     $ ./define.js cmp momo/window
 *     将生成：
 *         mod：模块核心文件 js/lib/cmp/momo/window.js 默认已经require jquery
 *         css：模块所需样式文件 themes/default/momo-window.css
 *         sample: 实例文件夹 js/samples/cmp/momo/window 包含以下文件
 *             页面： index.html 默认引入sea.js，运行app.js，样式三个（global，组件样式和页面样式)
 *             页面业务文件：app.js 默认引入cmp/momo/window.js
 *             页面样式：style.css
 * 
 *     type为util时，以name=momo/api为例：
 *     $ ./define.js util momo/api
 *     将生成：
 *         mod：模块核心文件 js/lib/util/momo/api.js 默认已经require jquery
 *         sample: 实例文件夹 js/samples/util/momo/api 包含以下文件
 *             页面： index.html 默认引入sea.js，运行app.js，样式两个（global，页面样式)
 *             页面业务文件：app.js 默认引入util/momo/api.js
 *             页面样式：style.css
 * -----------------------------------------------------
 */
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var config = {
    charset: 'utf-8',
    jquery: '1.7.1'
};

var helper = {
    remove: function(p, folder) {
        if (path.existsSync(p)) {
            exec('rm ' + (folder ? ' -Rf ' : ' ') + p, function() {
                process.stdout.write('remove' + p + ' successful!\n');
            });
        } else {
            process.stdout.write(p + ' does not exists\n');
        }
    },
	create: function(type) {
        var str = 'create successful:\n';
        str += '---- mod: {mod}\n';
		if (type == 'cmp') {
			str += '---- css: {css}\n';
		}
        str += '---- sample: {sample}\n';
        str += '\t---- index.html\n';
        str += '\t---- app.js\n';
        str += '\t---- style.css\n';
        return {
			show: function(f, t) {
				str = str.replace('{' + t + '}', f);
				if (str.indexOf('{') == -1) {
					process.stdout.write(str);
				}
			}
        }
	}
};

var type = process.argv[2];
var space = process.argv[3];
var isRemove = process.argv[4] == '--remove';
if (type && space) {
    var root = path.resolve(path.dirname('../../'));
	var temp = space.split('/');
    var name = temp.pop();
	var p = temp.join('/');
    var folder = {
        js: root + '/js/lib/' + type + '/' + p, // 模块目录
        samples: root + '/js/samples/' + type + '/' + space, // 例子目录
        css: root + '/themes/default' // 模块样式
    };
	var success = helper.create(type);
	if (type == 'cmp' || type == 'util') {// 目录初始化
		if (isRemove) { // 移除
		    helper.remove(folder.js + '/' + name + '.js');
			helper.remove(folder.samples, true);
			if (type == 'cmp') {
				helper.remove(folder.css + '/' + space.split('/').join('-') + '.css');
			}
		} else {
            var modFile = folder.js + '/' + name + '.js';
            var indexFile = folder.samples + '/index.html';
            var appFile = folder.samples + '/app.js';
			if (path.existsSync(modFile)) {
				process.stdout.write('\n\n' + modFile + ' exists, please change a name\n\n');
			} else {
				var parents = (new Array(space.split('/').length + 1)).join('../');
				exec('mkdir -p ' + folder.js, function() { // 创建模块目录
					exec('cp ' + './model/' + type + '/mod.js ' + modFile, function() {
						fs.readFile(modFile, config.charset, function(e, data) { // 修正模块引入的jquery路径
							fs.writeFile(modFile, data.replace('{jquery}', parents + 'jquery/' + config.jquery + '/sea_jquery.js'));
							success.show(modFile, 'mod');
						});
					});
				});
				exec('mkdir -p ' + folder.samples, function() { // 创建例子目录
					exec('cp ' + './model/' + type + '/samples/* ' + folder.samples, function() {
						fs.readFile(indexFile, config.charset, function(e, data) { // 修正样式和seajs路径
							fs.writeFile(indexFile, data.replace('{name}', name).replace('{global.css}', parents + '../../../themes/global.css').replace('{samples.css}', parents + '../samples.css').replace('{style.css}', parents + '../../../themes/default/' + name + '.css').replace('{sea.js}', parents + '../../lib/sea.js'));
						});
						fs.readFile(appFile, config.charset, function(e, data) { // 修正样式和seajs路径
							fs.writeFile(appFile, data.replace('modName', name).replace('{mod}', parents + '../../lib/' + type + '/' + p + '/' + name + '.js'));
						});
						success.show(folder.samples, 'sample');
					});
				});
				if (type == 'cmp') {
					var cssFile = folder.css + '/' + space.split('/').join('-') + '.css';
					exec('touch ' + cssFile, function() {
						fs.writeFile(cssFile, '@charset "utf-8";');
						success.show(cssFile, 'css');
					});
				}
			}
		}
	}
}
