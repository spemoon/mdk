define(function(require, exports, module) {
    var qunit = require('../../../../../lib/external/qunit/sea_qunit.js');
    var string = require('../../../../../lib/util/core/string.js');

    qunit.module("util.core.string 测试");

    qunit.test('trim(str)', function() {
        qunit.equal(string.trim(' abc'), 'abc', '去掉" abc"两侧的空白');
        qunit.equal(string.trim('abc '), 'abc', '去掉"abc "两侧的空白');
        qunit.equal(string.trim(' abc   '), 'abc', '去掉" abc   "两侧的空白');
        qunit.raises(string.trim, '传入参数为空会导致异常');
        qunit.raises(function() {string.trim(1)}, '传入参数非字符串会导致异常');
    });

    qunit.test('serialize(obj)', function() {
        qunit.equal(string.serialize({name: 'hello', age: 22}), 'name=hello&age=22', '把{name:\'hello\', age:22}序列化');
        qunit.equal(string.serialize({name: ['hello', 'world'], age: 22}), 'name=hello&name=world&age=22', '把{name:[\'hello\', \'world\'], age:22}序列化');
        qunit.equal(string.serialize({}), '', '把{}序列化得到空字符串');
        qunit.equal(string.serialize(), '', '把空参数序列化得到空字符串');
        qunit.equal(string.serialize(1), '', '把非对象参数序列化得到空字符串');
        qunit.equal(string.serialize([1, 3, 5]), '0=1&1=3&2=5', '把数组[1, 3, 5]序列化得到0=1&1=3&2=5');
    });
    /*
     qunit.test('parseJSON(str)', function() {
     });

     qunit.test('blength(str)', function() {
     });

     qunit.test('cut(string, n, params)', function() {
     });

     qunit.test('code(string, isDecode)', function() {
     });
     */
});