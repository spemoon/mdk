define(function(require, exports, module) {
    var qunit = require('../../../../qunit/sea_qunit.js');
    var lang = require('../../../../../lib/util/core/lang.js');

    qunit.module("util.core.lang 测试");

    qunit.test('isUndefined(mix)', function() {
        var a;
        qunit.ok(lang.isUndefined(a), '仅声明未赋值的变量是undefined');
        qunit.ok(!lang.isUndefined(1), '数字1不是undefined');
        qunit.ok(!lang.isUndefined('ss'), '字符串ss不是undefined');
        qunit.ok(!lang.isUndefined(null), 'null不是undefined');
        qunit.ok(!lang.isUndefined({}), '{}不是undefined');
        qunit.ok(!lang.isUndefined([]), '[]不是undefined');
        qunit.ok(!lang.isUndefined(function() {
        }), 'function不是undefined');
        qunit.ok(lang.isUndefined(), '空参数是undefined');
    });

    qunit.test('isString(mix)', function() {
        var a;
        qunit.ok(!lang.isString(a), '仅声明未赋值的变量不是string');
        qunit.ok(!lang.isString(1), '数字1不是string');
        qunit.ok(lang.isString('ss'), '字符串ss是string');
        qunit.ok(!lang.isString(null), 'null不是string');
        qunit.ok(!lang.isString({}), '{}不是string');
        qunit.ok(!lang.isString([]), '[]不是string');
        qunit.ok(!lang.isString(function() {
        }), 'function不是string');
        qunit.ok(!lang.isString(), '空参数不是string');
    });

    qunit.test('timer(params)', function() {
        var i = 0;
        var step = 125;
        stop();
        lang.timer({
            rule:function() {
                return true;
            },
            fn:function() {
                i += 1;
            }
        });

        setTimeout(function() {
            start();
            qunit.ok(i == 8);
        }, 2100);
    });
});
