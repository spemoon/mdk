#!/usr/bin/env node
/*
 * 说明：本程序用来快速建立一个js模块的初始化脚本
 * -----------------------------------------------------
 * 用法：
 *     ./define.js path_to_file [--sample=false] [--css=true] [--unit=false] [--doc=false] [--remove=true]
 * -----------------------------------------------------
 * 参数说明：
 *     path_to_file : js文件路径，比如：lib/util/dom/event（下同），将会在 /js/lib/util/dom/ 目录下生成event.js
 *
 *     --sample     : 是否生成例子目录，不设置默认true，将会在 /js/samples/lib/util/dom/event/ 目录下生成
 *                      index.html  测试页面，该文件默认引入：
 *                          /themes/global.css;
 *                          /js/samples/samples.css;
 *                          style.css
 *                          /js/lib/sea.js 并指定data-main为./app.js
 *                          如果配置了--css=true，还将包含：
 *                          /themes/default/lib.util.dom.event.css
 *                      app.js      测试页面的js，该文件默认引入：
 *                          /js/samples/samples.js
 *                          /js/lib/jquery/1.7.1/sea_jquery.js
 *                          /js/lib/util/dom/event.js
 *                      style.css   测试页面样式
 *     --css        : 是否生成样式文件，不设置默认false，显示设定为true，将会在 /themes/default/ 目录下生成lib.util.dom.event.css
 *     --unit       : 是否生成单元测试文件，不设置默认true，将会在 /js/tests/lib/util/dom/event/ 目录下生成
 *                      index.html Qunit的主文件，该文件默认引入
 *                          /js/lib/external/qunit/qunit.css
 *                          /js/lib/sea.js 并指定data-main为./test.js
 *                      test.js 测试脚本，该文件默认引入
 *                          /js/lib/external/qunit/sea_qunit.js
 *                          /js/lib/util/dom/event.js
 *     --doc        : 是否生成doc目录，不设置默认true，将会在 /js/docs/lib/util/dom/event/ 目录下生成index.html
 *     --remove     : 是否删除该脚本，不设置默认false，显示设定为true时候，会把上面所有生成的文件删除掉，具体如下
 *                      核心文件 /js/lib/util/dom/event.js
 *                      例子目录 /js/samples/lib/util/dom/event/ 及其该目录下的所有文件
 *                      样式文件 /themes/default/lib.util.dom.event.css
 *                      测试目录 /js/tests/lib/util/dom/event/ 及其该目录下的所有文件
 *                      文档目录 /js/docs/lib/util/dom/event/ 及其该目录下的所有文件
 * -----------------------------------------------------
 */
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var config = {
    charset:'utf-8',
    jquery:'1.7.1'
};

var helper = {
    remove:function(p, folder) {
        if(path.existsSync(p)) {
            exec('rm ' + (folder ? ' -Rf ' : ' ') + p, function() {
                process.stdout.write('remove' + p + ' successful!\n');
            });
        } else {
            process.stdout.write(p + ' does not exists\n');
        }
    },
    create:function(type) {
        var str = 'create successful:\n';
        str += '---- mod: {mod}\n';
        if(type == 'cmp') {
            str += '---- css: {css}\n';
        }
        str += '---- api: {api}\n';
        str += '\t---- index.html\n';
        str += '\t---- app.js\n';
        str += '\t---- style.css\n';
        str += '---- test: {test}\n';
        str += '\t---- test.html\n';
        str += '\t---- test.js\n';
        return {
            show:function(f, t) {
                str = str.replace('{' + t + '}', f);
                if(str.indexOf('{') == -1) {
                    process.stdout.write(str);
                }
            }
        }
    }
};

var type = process.argv[2];
var space = process.argv[3];
var isRemove = process.argv[4] == '--remove';
if(type && space) {
    var root = path.resolve(path.dirname('../../'));
    var temp = space.split('/');
    var name = temp.pop();
    var p = temp.join('/');
    var folder = {
        js:root + '/js/lib/' + type + '/' + p, // 模块目录
        api:root + '/js/api/' + type + '/' + space, // 例子目录
        test: root + '/js/tests/' + type + '/' + space, // 测试用例目录
        css:root + '/themes/default' // 模块样式
    };
    var success = helper.create(type);
    if(type == 'cmp' || type == 'util') {// 目录初始化
        if(isRemove) { // 移除
            helper.remove(folder.js + '/' + name + '.js');
            helper.remove(folder.api, true);
            helper.remove(folder.test, true);
            if(type == 'cmp') {
                helper.remove(folder.css + '/' + space.split('/').join('-') + '.css');
            }
        } else {
            var modFile = folder.js + '/' + name + '.js';
            var indexFile = folder.api + '/index.html';
            var appFile = folder.api + '/app.js';
            var testPage = folder.test + '/test.html';
            var testFile = folder.test + '/test.js';
            var coverageFile = root + '/js/jsCoverage/all.js';
            if(path.existsSync(modFile)) {
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
                exec('mkdir -p ' + folder.api, function() { // 创建例子目录
                    exec('cp ' + './model/' + type + '/api/* ' + folder.api, function() {
                        fs.readFile(indexFile, config.charset, function(e, data) { // 修正样式和seajs路径
                            fs.writeFile(indexFile, data.replace('{name}', name).replace('{global.css}', parents + '../../../themes/global.css').replace('{api.css}', parents + '../api_page.css').replace('{style.css}', parents + '../../../themes/default/' + name + '.css').replace('{sea.js}', parents + '../../lib/sea.js'));
                        });
                        fs.readFile(appFile, config.charset, function(e, data) { // 修正样式和seajs路径
                            fs.writeFile(appFile, data.replace('{api}', parents + '../api_page.js').replace('{jquery}', parents + '../../lib/jquery/' + config.jquery + '/sea_jquery.js').replace('modName', name).replace('{mod}', parents + '../../lib/' + type + '/' + p + '/' + name + '.js'));
                        });
                        success.show(folder.api, 'api');
                    });
                });
                exec('mkdir -p ' + folder.test, function() { // 创建测试用例目录
                    exec('cp ' + './model/test/* ' + folder.test, function() {
                        fs.readFile(testPage, config.charset, function(e, data) { // 修正样式和seajs路径
                            fs.writeFile(testPage, data.replace('{qunit.css}', parents + '../../lib/external/qunit/qunit.css').replace('{sea.js}', parents + '../../lib/sea.js'));
                        });
                        fs.readFile(testFile, config.charset, function(e, data) { // 修正样式和seajs路径
                            fs.writeFile(testFile, data.replace('{qunit}', parents + '../../lib/external/qunit/sea_qunit.js').replace('{jquery}', parents + '../../lib/jquery/' + config.jquery + '/sea_jquery.js').replace('modName', name).replace('{mod}', parents + '../../lib/' + type + '/' + p + '/' + name + '.js'));
                        });
                        fs.readFile(coverageFile, config.charset, function(e, data) {
                            var line;
                            var content = 'require(\'..//test.js\');'
                            var flag = true;
                            var list = data.split('\n');
                            for(var i = 0, len = list.length, temp; i < len; i++) {
                                temp = list[i].trim();
                                if(temp == content) {
                                    flag = false;
                                }
                                if(/\}\);?\s*$/.test(temp)) {
                                    line = i;
                                }
                            }
                            if(flag) {
                                var line = list.splice(i, 0, content);
                            }
                            fs.writeFile(coverageFile, line.join('\n'));
                        });
                        success.show(folder.test, 'test');
                    });
                });

                if(type == 'cmp') {
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
