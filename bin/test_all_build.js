#!/usr/bin/env node

/**
 * require 模块
 */
var fs = require('fs');
var path = require('path');

var helper = {
    tree: function(path, result) {
        var files = fs.readdirSync(path);
        if(result === true) {
            result = [];
        }
        files.forEach(function(file, index, arr) {
            if(file != coverage) {
                var pathname = path + '/' + file;
                var stat = fs.lstatSync(pathname);
                if(!stat.isDirectory()) {
                    if(file == 'test.js') {
                        result.push(pathname.replace(root + '/', ''));
                    }
                } else {
                    helper.tree(pathname, result);
                }
            }
        });
        return result;
    }
};

var root = path.resolve(path.dirname('../../')) + '/js/tests';

fs.writeFile(root + '/all.js', (function(result) {
    var content = '';
    var log = [];
    content += 'define(function(require, exports, modual) {\n';
    result.forEach(function(file, index, arr) {
        content += '    require(\'../../' + file + '\');\n';
        log[index] = (index + 1) + '. js/tests/' + file;
    });
    content += '});';
    console.log('包含以下单元测试文件：\n-------------------------------------------\n' + log.join('\n') + '\n-------------------------------------------\n');
    return content;
})(helper.tree(root, true)));
