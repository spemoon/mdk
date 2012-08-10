#!/usr/bin/env node
/*
 * 说明：本程序用来快速建立一个js模块的初始化脚本
 * -----------------------------------------------------
 * 用法：
 *     ./define.js path_to_file [--sample=false] [--css=true] [--test=false] [--doc=false] [--remove=true]
 * -----------------------------------------------------
 * 参数说明：
 *     --mod : js文件路径，比如：lib/util/dom/event（下同），将会在 /js/lib/util/dom/ 目录下生成event.js
 *
 *     --sample     : 是否生成例子目录，不设置默认true，将会在 /js/samples/lib/util/dom/event/ 目录下生成
 *                      index.html  测试页面，该文件默认引入：
 *                          /themes/global.css;
 *                          /js/samples/sample.css;
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
 *     --test       : 是否生成单元测试文件，不设置默认true，将会在 /js/tests/lib/util/dom/event/ 目录下生成
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
    doc.sample += '\t\t /js/samples/sample.css \n';
    doc.sample += '\t\t style.css \n';
    doc.sample += '\t\t /js/lib/sea.js 并指定data-main为./app.js \n';
    doc.sample += '\t\t 如果配置了--css=true，还将包含：/themes/default/lib.util.dom.event.css \n';
    doc.sample += '\t app.js 测试页面的js，该文件默认引入：\n'
    doc.sample += '\t\t /js/samples/samples.js \n';
    doc.sample += '\t\t /js/lib/jquery/x.y.z/jquery.js \n';
    doc.sample += '\t\t /js/lib/util/dom/event.js \n';
    doc.sample += '\t style.css 测试页面样式 \n';

    doc.css = '是否生成样式文件，不设置默认false \n';
    doc.css += '\t 显示时候，将会在 /themes/default/ 目录下生成lib.util.dom.event.css \n';

    doc.test = '';
    doc.test += '是否生成单元测试文件，不设置默认true \n';
    doc.test += '\t 将会在 /js/tests/lib/util/dom/event/ 目录下生成: \n';
    doc.test += '\t index.html Qtest的主文件，该文件默认引入：\n';
    doc.test += '\t\t /js/lib/external/qunit/qunit.css \n';
    doc.test += '\t\t /js/lib/sea.js 并指定data-main为./test.js \n';
    doc.test += '\t test.js 测试脚本，该文件默认引入：\n';
    doc.test += '\t\t /js/lib/external/qunit/sea_qunit.js \n';
    doc.test += '\t\t /js/lib/util/dom/event.js \n';

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

    program.version(version)
        .option('-m, --mod <file>', doc.mod)
        .option('-s, --sample <flag>', doc.sample, 'true')
        .option('-c, --css <flag>', doc.css, 'false')
        .option('-t, --test <flag>', doc.test, 'true')
        .option('-d, --doc <flag>', doc.doc, 'true')
        .option('-r, --remove', doc.remove)
        .parse(process.argv);

})();

/**
 * 配置参数
 */
var config = {
    charset: 'utf-8'
};

/**
 * 辅助函数
 */
var helper = {
    remove: function(p, folder) {
        if(path.existsSync(p)) {
            exec('rm ' + (folder ? ' -Rf ' : ' ') + p, function() {
                process.stdout.write('删除成功：' + p + '\n');
            });
        } else {
            process.stdout.write('文件不存在：' + p + '\n');
        }
    },
    mkdir: function(dir, callback) {
        exec('mkdir -p ' + dir, callback);
    },
    create: function(source, dest, callback) {
        exec('cp ' + source + ' ' + dest, function() {
            fs.readFile(dest, config.charset, function(e, data) {
                callback && callback(dest, data);
            });
        });
    },
    relative: function(level) {
        return (new Array(level + 1)).join('../');
    },
    console: function(useCss) {
        var str = '创建模块成功:\n';
        str += '---- 模块文件: {mod}\n';
        if(useCss) {
            str += '---- 样式文件: {css}\n';
        }
        str += '---- 示范例子: {sample}\n';
        str += '\t---- index.html\n';
        str += '\t---- app.js\n';
        str += '\t---- style.css\n';
        str += '---- 单元测试: {test}\n';
        str += '\t---- index.html\n';
        str += '\t---- test.js\n';
        str += '---- 文档文件: {doc}\n';
        str += '\t---- index.html\n';
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

/**
 * 业务逻辑
 */
(function() {
    var root = path.resolve(path.dirname('../../')) + '/'; // 根路径
    var mod = program.mod;
    var pathTo = {
        root: {
            js: root + 'js/', // js根目录
            css: root + 'themes/' // css样式根目录
        }
    };
    pathTo.root.sample = pathTo.root.js + 'samples/'; // 例子根目录
    pathTo.root.test = pathTo.root.js + 'tests/'; // 测试用例根目录
    pathTo.root.doc = pathTo.root.js + 'docs/'; // 文档根目录

    if(mod) {
        var pathArr = mod.split('/');
        var pathLen = pathArr.length;
        var fileName = pathArr[pathLen - 1];
        var filePath = pathArr.slice(0, pathLen - 1).join('/') + '/';
        var cssName = pathArr.join('.') + '.css';
        pathTo.folder = {
            js: pathTo.root.js + filePath, // js模块所在目录
            css: pathTo.root.css + 'default/', // 默认样式所在目录
            sample: pathTo.root.sample + mod + '/', // 对应例子所在目录
            test: pathTo.root.test + mod + '/', // 对应单元测试所在目录
            doc: pathTo.root.doc + mod + '/', // 对应文档所在目录
            model: root + 'bin/model/'
        };
        pathTo.file = {
            js: pathTo.folder.js + fileName + '.js', // js模块路径
            css: pathTo.folder.css + cssName, // 默认样式路径
            sample: {
                html: pathTo.folder.sample + 'index.html', // 例子html路径
                js: pathTo.folder.sample + 'app.js', // 例子js路径
                css: pathTo.folder.sample + 'style.css' // 例子css路径
            },
            test: {
                html: pathTo.folder.test + 'index.html', // 单元测试html路径
                js: pathTo.folder.test + 'test.js' // 单元测试js路径
            },
            doc: pathTo.folder.doc + 'index.html' // 文档路径
        };
        pathTo.source = {
            js: pathTo.folder.model + 'mod.js',
            css: pathTo.folder.model + 'mod.css',
            sample: {
                html: pathTo.folder.model + 'sample/index.html',
                htmlWithCss: pathTo.folder.model + 'sample/index_with_css.html',
                js: pathTo.folder.model + 'sample/app.js',
                css: pathTo.folder.model + 'sample/style.css'
            },
            test: {
                html: pathTo.folder.model + 'test/index.html',
                js: pathTo.folder.model + 'test/test.js'
            },
            doc: pathTo.folder.model + 'doc/index.html'
        };
        pathTo.require = {
            seajs: 'js/lib/sea.js',
            seajs_config: 'js/lib/sea-config.js',
            //jquery: 'js/lib/jquery/sea_jquery.js',
            globalCss: 'themes/global.css',
            qunitCss: 'js/lib/external/qunit/qunit.css',
            qunit: 'js/lib/external/qunit/sea_qunit.js'
        };

        if(program.remove) {
            helper.remove(pathTo.file.js);
            helper.remove(pathTo.file.css);
            helper.remove(pathTo.folder.sample, true);
            helper.remove(pathTo.folder.test, true);
            helper.remove(pathTo.folder.doc, true);
        } else {
            var success = helper.console(program.css == 'true');
            helper.mkdir(pathTo.folder.js, function() { // 建立js模块目录
                helper.create(pathTo.source.js, pathTo.file.js, function(dest, data) { // 建立js模块文件
                    //fs.writeFile(dest, data.replace('{jquery}', helper.relative(pathLen) + pathTo.require.jquery));
                    fs.writeFile(dest, data.replace('{pathToJs}', helper.relative(pathLen) + 'js/'));
                    success.show(pathTo.file.js, 'mod');
                });
            });

            if(program.css == 'true') {
                helper.create(pathTo.source.css, pathTo.file.css, function(dest, data) { // 建立css文件
                    success.show(pathTo.file.css, 'css');
                });
            }

            if(program.sample == 'true') {
                helper.mkdir(pathTo.folder.sample, function() { // 建立例子目录
                    var html = program.css == 'true' ? pathTo.source.sample.htmlWithCss : pathTo.source.sample.html;
                    helper.create(html, pathTo.file.sample.html, function(dest, data) { // 例子HTML文件
                        data = data.replace('{name}', fileName)
                            .replace('{global.css}', helper.relative(pathLen + 2) + pathTo.require.globalCss)
                            .replace('{sample.css}', helper.relative(pathLen) + 'sample.css')
                            .replace('{style.css}', helper.relative(pathLen + 2) + 'themes/default/' + cssName)
                            .replace('{sea.js}', helper.relative(pathLen + 2) + pathTo.require.seajs)
                            .replace('{sea-config.js}', helper.relative(pathLen + 2) + pathTo.require.seajs_config);
                        fs.writeFile(dest, data);
                    });
                    helper.create(pathTo.source.sample.js, pathTo.file.sample.js, function(dest, data) { // 例子JS文件
                        data = data.replace('modName', fileName)
                            .replace('{mod}', helper.relative(pathLen + 1) + mod + '.js')
                            .replace('{sample}', helper.relative(pathLen) + 'sample.js')
                            .replace('{pathToJs}', helper.relative(pathLen + 2) + 'js/');
                            //.replace('{jquery}', helper.relative(pathLen + 2) + pathTo.require.jquery);
                        fs.writeFile(dest, data);
                    });
                    helper.create(pathTo.source.sample.css, pathTo.file.sample.css); // 例子css文件
                    success.show(pathTo.folder.sample, 'sample');
                });
            }

            if(program.test == 'true') {
                helper.mkdir(pathTo.folder.test, function() { // 建立单元测试目录
                    helper.create(pathTo.source.test.html, pathTo.file.test.html, function(dest, data) { // 单元测试HTML文件
                        data = data.replace('{qunit.css}', helper.relative(pathLen + 2) + pathTo.require.qunitCss)
                            .replace('{sea.js}', helper.relative(pathLen + 2) + pathTo.require.seajs);
                        fs.writeFile(dest, data);
                    });
                    helper.create(pathTo.source.test.js, pathTo.file.test.js, function(dest, data) { // 单元测试js文件
                        data = data.replace('{qunit}', helper.relative(pathLen + 2) + pathTo.require.qunit)
                            //.replace('{jquery}', helper.relative(pathLen + 2) + pathTo.require.jquery)
                            .replace('modName', fileName)
                            .replace('{mod}', helper.relative(pathLen + 2) + 'js/' + mod + '.js')
                            .replace('{package}', pathArr.join('.'));
                        fs.writeFile(dest, data);
                    });
                    success.show(pathTo.folder.test, 'test');
                });
            }

            if(program.doc == 'true') {
                helper.mkdir(pathTo.folder.doc, function() { // 建立例子目录
                    helper.create(pathTo.source.doc, pathTo.file.doc);
                    success.show(pathTo.folder.doc, 'doc');
                });
            }
        }
    } else {
        console.log('必须指定javascript模块，例如：lib/util/dom/event')
    }
})();