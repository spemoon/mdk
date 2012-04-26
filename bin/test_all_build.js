#!/usr/bin/env node

/**
 * require 模块
 */
var fs = require('fs');
var path = require('path');

var root = path.resolve(path.dirname('../../')) + '/js/tests/';
var tree = function(path) {
    var files = fs.readdirSync(path);
    files.forEach(function(file, index, arr) {
        if(file != 'jsCoverage') {
            var pathname = root + file;
            var stat = fs.lstatSync(pathname);
            if(!stat.isDirectory()) {
                console.log(file);
            } else {
                console.log(pathname);
                tree(pathname);
            }
        }
    });
};
tree(root);