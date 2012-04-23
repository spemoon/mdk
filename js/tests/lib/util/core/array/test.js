define(function(require, exports, module) {
    var qunit = require('../../../../../lib/external/qunit/sea_qunit.js');
    var array = require('../../../../../lib/util/core/array.js');

    qunit.module("util.core.array 测试");

    qunit.test('indexOf(v, arr)', function() {
        var obj = {};
        var a, b;
        var arr = [1 ,3 , 'hello', '1', {}, obj, true, 1, false, null, a, function(){}];
        qunit.equal(array.indexOf(1, arr), 0, '找到数字1在数组中第一次出现的位置为0');
        qunit.equal(array.indexOf('hello', arr), 2, '找到字符串hello在数组中第一次出现的位置为2');
        qunit.equal(array.indexOf('1', arr), 3, '找到字符串1在数组中第一次出现的位置为3');
        qunit.equal(array.indexOf({}, arr), -1, '找不到引用类型直接量{}');
        qunit.equal(array.indexOf(obj, arr), 5, '找到obj在数组中第一次出现的位置为5');
        qunit.equal(array.indexOf(true, arr), 6, '找到布尔值true在数组中第一次出现的位置为6');
        qunit.equal(array.indexOf(false, arr), 8, '找到布尔值false在数组中第一次出现的位置为8');
        qunit.equal(array.indexOf(null, arr), 9, '找到null在数组中第一次出现的位置为9');
        qunit.equal(array.indexOf(a, arr), 10, '找到变量a在数组中第一次出现的位置为10');
        qunit.equal(array.indexOf(b, arr), 10, '找到undefined在数组中第一次出现的位置为10');
        qunit.equal(array.indexOf(function(){}, arr), -1, '找不到引用类型直接量function(){}');
        qunit.equal(array.indexOf(2, arr), -1, '找不到数字2');
        qunit.raises(function() {array.indexOf(2);}, '不输入第二个参数（被搜索的数组，将导致异常）');
        qunit.raises(function() {array.indexOf(2 , 1);}, '第二个参数不是数组将导致异常');
        qunit.raises(function() {array.indexOf(2 , {});}, '第二个参数不是数组将导致异常');
    });

    qunit.test('forEach(callback, arr, scope)', function() {
        var arr = [1 ,3 , 5, 'hello', '1', 8];
        array.forEach(function(value, index, a) {
            if(index == 3) {
                qunit.equal(value, 'hello', '遍历到第4个值是字符串hello');
            } else if(index == a.length - 1) {
                qunit.equal(value, 8, '遍历到最后一个值是字符串8');
            }
        }, arr);

        var obj = {
            name: 'my scope'
        };
        array.forEach(function(value, index, a) {
            if(index == 0) {
                qunit.equal(a, arr, '第三个参数就是数组本身');
                qunit.equal(this, obj, 'this是指定的对象');
            }
        }, arr, obj);
    });
});