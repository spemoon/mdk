#!/usr/bin/env node
/*
 * 说明：本程序用来快速建立一个js模块的初始化脚本
 * -----------------------------------------------------
 * 用法：
 *     ./define.js path_to_file [--sample=false] [--css=true] [--unit=false] [--doc=false] [--remove=true]
 * -----------------------------------------------------
 * 参数说明：
 *     --mod : js文件路径，比如：lib/util/dom/event（下同），将会在 /js/lib/util/dom/ 目录下生成event.js
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

/**
 * require 模块
 */
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var program = require('commander');

/**
 * 命令行参数
 */
(function() {
    var version = '0.0.2';
    var doc = {};
    doc.mod = 'javascript模块路径，从js目录开始计算 \n';
    doc.mod += '\t 比如：lib/util/dom/event（下同），将会在 /js/lib/util/dom/ 目录下生成event.js \n';

    doc.sample = '';
    doc.sample += '是否生成例子目录，不设置默认true \n';
    doc.sample += '\t 将会在 /js/samples/lib/util/dom/event/ 目录下生成: \n';
    doc.sample += '\t index.html 测试页面，该文件默认引入：\n';
    doc.sample += '\t\t /themes/global.css \n';
    doc.sample += '\t\t /js/samples/samples.css \n';
    doc.sample += '\t\t style.css \n';
    doc.sample += '\t\t /js/lib/sea.js 并指定data-main为./app.js \n';
    doc.sample += '\t\t 如果配置了--css=true，还将包含：/themes/default/lib.util.dom.event.css \n';
    doc.sample += '\t app.js 测试页面的js，该文件默认引入：\n'
    doc.sample += '\t\t /js/samples/samples.js \n';
    doc.sample += '\t\t /js/lib/jquery/1.7.1/sea_jquery.js \n';
    doc.sample += '\t\t /js/lib/util/dom/event.js \n';
    doc.sample += '\t style.css 测试页面样式 \n';

    doc.css = '是否生成样式文件，不设置默认false \n';
    doc.css += '\t 显示时候，将会在 /themes/default/ 目录下生成lib.util.dom.event.css \n';

    doc.unit = '';
    doc.unit += '是否生成单元测试文件，不设置默认true \n';
    doc.unit += '\t 将会在 /js/tests/lib/util/dom/event/ 目录下生成: \n';
    doc.unit += '\t index.html Qunit的主文件，该文件默认引入：\n';
    doc.unit += '\t\t /js/lib/external/qunit/qunit.css \n';
    doc.unit += '\t\t /js/lib/sea.js 并指定data-main为./test.js \n';
    doc.unit += '\t test.js 测试脚本，该文件默认引入：\n';
    doc.unit += '\t\t /js/lib/external/qunit/sea_qunit.js \n';
    doc.unit += '\t\t /js/lib/util/dom/event.js \n';

    doc.doc = '是否生成doc目录，不设置默认true \n';
    doc.doc += '\t 将会 /js/docs/lib/util/dom/event/ 目录下生成index.html \n';

    doc.remove = '';
    doc.remove += '是否删除该脚本，不设置默认false \n';
    doc.remove += '\t 显示时候，会把上面所有生成的文件删除掉，具体如下：\n';
    doc.remove += '\t 核心文件 /js/lib/util/dom/event.js \n';
    doc.remove += '\t 例子目录 /js/samples/lib/util/dom/event/ 及其该目录下的所有文件 \n';
    doc.remove += '\t 样式文件 /themes/default/lib.util.dom.event.css \n';
    doc.remove += '\t 测试目录 /js/tests/lib/util/dom/event/ 及其该目录下的所有文件 \n';
    doc.remove += '\t 文档目录 /js/docs/lib/util/dom/event/ 及其该目录下的所有文件 \n';

    doc.help = '帮助 \n';

    program
        .version(version)
        .option('-m, --mod <file>', doc.mod)
        .option('-s, --sample <flag>', doc.sample, 'true')
        .option('-c, --css <flag>', doc.css, 'false')
        .option('-u, --unit <flag>', doc.unit, 'true')
        .option('-d, --doc <flag>', doc.doc, 'true')
        .option('-r, --remove', doc.remove)
        .parse(process.argv);

})();

/**
 * 配置参数
 */
var config = {
    charset:'utf-8',
    jquery:'1.7.1'
};

/**
 * 辅助函数
 */
var helper = {
    remove:function(p, folder) {
        if(path.existsSync(p)) {
            exec('rm ' + (folder ? ' -Rf ' : ' ') + p, function() {
                process.stdout.write('remove' + p + ' successful!\n');
            });
        } else {
            process.stdout.write(p + ' does not exists\n');
        }
    }
};

/**
 * 业务逻辑
 */
(function() {
    var root = path.resolve(path.dirname('../../')) + '/'; // 根路径
    var mod = program.mod;
    var pathTo = {};
    pathTo.js = root + 'js/';
    pathTo.css = root + 'themes/default/';
    pathTo.sample = pathTo.js + 'samples/';
    pathTo.unit = pathTo.js + 'tests/';
    pathTo.doc = pathTo.js + 'docs/';

    if(mod) {
        var pathArr = mod.split('/');
        var parents = (new Array(pathArr.length + 1)).join('../');
        var fileName = pathArr[pathArr.length - 1];
        if (program.remove) {

        } else {
            
        }
        console.log(program.css);
        console.log(program.sample);
        console.log(program.unit);
        console.log(program.doc);
    } else {
        console.log('必须指定javascript模块，例如：lib/util/dom/event')
    }
})();

