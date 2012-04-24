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

    qunit.test('parseJSON(str)', function() {
        var str1 = '{"name":"hello", "age":22, "male":true}';
        var str2 = '{"name":["hello", "world"], "age":22, "male":true}';
        var str3 = '{name:"hello", age:22, male:true}';
        var str4 = '[{"name":"hello", "age":22, "male":true}, {"name":["hello", "world"], "age":22, "male":true}]';

        var obj1 = string.parseJSON(str1);
        qunit.equal(obj1.name, 'hello', '把' + str1 + '转成对象，并获取name属性');
        qunit.equal(obj1.age, 22, '把' + str1 + '转成对象，并获取age属性');
        qunit.strictEqual(obj1.male, true, '把' + str1 + '转成对象，并获取male属性');

        var obj2 = string.parseJSON(str2);
        qunit.deepEqual(obj2.name, ['hello', 'world'], '把' + str2 + '转成对象，并获取name属性');
        qunit.equal(obj2.age, 22, '把' + str2 + '转成对象，并获取age属性');
        qunit.strictEqual(obj2.male, true, '把' + str2 + '转成对象，并获取male属性');

        qunit.raises(function() {
            string.parseJSON(str3);
        }, 'JSON字符串必须是严格格式的，key也需要带双引号，否则出错');

        var obj4 = string.parseJSON(str4);
        qunit.deepEqual(obj4, [{name:'hello', age:22, male:true}, {name:['hello', 'world'], age:22, male:true}], 'JSON深层次解析测试');

        qunit.raises(string.parseJSON, '不传参数导致出错');
        qunit.equal(string.parseJSON(1), 1, '传入数字返回数字');
        qunit.raises(function() {
            string.parseJSON('hello');
        }, '传入字符串必须是JSON格式，否则出错');
        qunit.deepEqual([1, 3, 'hello'], [1, 3, 'hello'], '传入数组返回数组');
    });

     qunit.test('blength(str)', function() {
         qunit.equal(string.blength('123 你好 456'), 12, '双字节字符按两个长度计算后的整个字符串长度');
         qunit.raises(string.blength, '不传参数将报错');
     });

     qunit.test('cut(string, n, params)', function() {
         var str = '123 你好 456 我没有什么';
         qunit.equal(string.cut(str, 6), '123 你好', '从' + str + '截取6个字符，所有字符按一个长度计算');
         qunit.equal(string.cut(str, 6, true), '123 你', '从' + str + '截取6个字符，全角字符按两个长度计算');
         qunit.equal(string.cut(str, 5 , true), '123 你', '从' + str + '截取5个字符，全角字符按两个长度计算，刚好截到汉字的一半将获取整个汉字');
         qunit.equal(string.cut(str, 6, {
             dir: 'right'
         }), ' 我没有什么', '从' + str + '截取6个字符，从右往左截取');
         qunit.equal(string.cut(str, 6, {
             dir: 'right',
             fullSharp:true
         }), '有什么', '从' + str + '截取3个字符，从右往左截取，全角字符按两个长度计算');
         qunit.equal(string.cut(str, 5, {
             dir: 'right',
             fullSharp:true
         }), '有什么', '从' + str + '截取3个字符，从右往左截取，全角字符按两个长度计算，刚好截到汉字的一半将获取整个汉字');
     });

     qunit.test('code(string, isDecode)', function() {
         var str1 = 'hello, <a href="#">link</a><<<good&&smail>>>';
         var str2 = 'hello, &lt;a href="#"&gt;link&lt;/a&gt;&lt;&lt;&lt;good&amp;&amp;smail&gt;&gt;&gt;';
         qunit.equal(string.code(str1), str2, '转义');
         qunit.equal(string.code(str2, true), str1, '反转义');
         qunit.raises(string.code, '不传参报错');
     });
});