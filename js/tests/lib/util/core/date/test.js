define(function(require, exports, module) {
    var qunit = require('../../../../../lib/external/qunit/sea_qunit.js');
    var date = require('../../../../../lib/util/core/date.js');

    qunit.module("util.core.date 测试");

    qunit.test('isLeap(year)', function() {
        qunit.ok(date.isLeap(2000), '2000年是闰年');
        qunit.ok(date.isLeap(0), '0年是闰年');
        qunit.ok(!date.isLeap(2100), '2100年不是闰年');
        qunit.ok(date.isLeap(2012), '2012年是闰年');
        qunit.ok(!date.isLeap(2013), '2013年不是闰年');
        qunit.ok(!date.isLeap(), '不传参数的不是闰年');
    });

    qunit.test('check(val, pattern)', function() {
        qunit.ok(date.check('2012-03-05'), '2012-03-05是合法的日期格式，默认yyyy-MM-dd格式');
        qunit.ok(date.check('2012-03-5', 'yyyy-MM-d'), '2012-03-5是合法的日期格式，yyyy-MM-d格式');
        qunit.ok(date.check('2012-3-05', 'yyyy-M-dd'), '2012-3-05是合法的日期格式，yyyy-M-dd格式');
        qunit.ok(date.check('2012-3-5', 'yyyy-M-d'), '2012-3-5是合法的日期格式，yyyy-M-d格式');
        qunit.ok(date.check('12-03-05', 'yy-M-d'), '是合法的日期格式，yy-MM-dd格式');
        qunit.ok(date.check(''), '是合法的日期格式，yy-MM-d格式');
        qunit.ok(date.check(''), '是合法的日期格式，yy-M-dd格式');
        qunit.ok(date.check(''), '是合法的日期格式，yy-M-d格式');

        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd HH:mm:ss格式');
        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd KK:mm:ss格式');
        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd H:mm:ss格式');
        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd K:mm:ss格式');
        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd HH:m:ss格式');
        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd HH:m:s格式');
        qunit.ok(date.check(''), '是合法的日期格式，yyyy-MM-dd HH:mm:s格式');

        qunit.ok(date.check(''), '是合法的日期格式，yyyy/MM/dd格式');
    });

    qunit.test('compare(date1, date2)', function() {

    });

    qunit.test('stringCompare(string1, pattern1, string2, pattern2)', function() {

    });

    qunit.test('stringToDate(val, pattern)', function() {

    });

    qunit.test('format(date, pattern)', function() {

    });

    qunit.test('distance(date, n, unit)', function() {

    });
});