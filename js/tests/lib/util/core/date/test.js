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
        qunit.ok(date.check('12-03-05', 'yy-MM-dd'), '12-03-05是合法的日期格式，yy-MM-dd格式');
        qunit.ok(date.check('12-03-5', 'yy-MM-d'), '12-03-5是合法的日期格式，yy-MM-d格式');
        qunit.ok(date.check('12-3-05', 'yy-M-dd'), '12-3-05是合法的日期格式，yy-M-dd格式');
        qunit.ok(date.check('12-3-5', 'yy-M-d'), '12-3-5是合法的日期格式，yy-M-d格式');

        qunit.ok(date.check('2012-03-05 06:05:03', 'yyyy-MM-dd HH:mm:ss'), '2012-03-05 08:05:03是合法的日期格式，yyyy-MM-dd HH:mm:ss格式');
        qunit.ok(date.check('2012-03-05 06:05:03 am', 'yyyy-MM-dd KK:mm:ss a'), '2012-03-05 18:05:03 a是合法的日期格式，yyyy-MM-dd KK:mm:ss a格式');
        qunit.ok(date.check('2012-03-05 6:05:03', 'yyyy-MM-dd H:mm:ss'), '2012-03-05 6:05:03是合法的日期格式，yyyy-MM-dd H:mm:ss格式');
        qunit.ok(date.check('2012-03-05 6:05:03 am', 'yyyy-MM-dd K:mm:ss a'), '2012-03-05 6:05:03 am是合法的日期格式，yyyy-MM-dd K:mm:ss a格式');
        qunit.ok(date.check('2012-03-05 06:5:03', 'yyyy-MM-dd HH:m:ss'), '2012-03-05 06:5:03是合法的日期格式，yyyy-MM-dd HH:m:ss格式');
        qunit.ok(date.check('2012-03-05 06:5:3', 'yyyy-MM-dd HH:m:s'), '2012-03-05 06:5:3是合法的日期格式，yyyy-MM-dd HH:m:s格式');
        qunit.ok(date.check('2012-03-05 06:05:3', 'yyyy-MM-dd HH:mm:s'), '2012-03-05 06:05:3是合法的日期格式，yyyy-MM-dd HH:mm:s格式');

        qunit.ok(date.check('2012/03/05', 'yyyy/MM/dd'), '2012/03/05是合法的日期格式，yyyy/MM/dd格式');
        qunit.ok(date.check('2012__03__05', 'yyyy__MM__dd'), '2012__03__05是合法的日期格式，yyyy__MM__dd格式');
        qunit.ok(date.check('2012_03#05&06:05-03', 'yyyy_MM#dd&HH:mm-ss'), '2012_03#05&06:05-03是合法的日期格式，yyyy_MM#dd&HH:mm-ss格式');

        qunit.equal(date.check('2012-02-30'), 0, '2012-02-30是不存在的日期，返回0');
    });

    qunit.test('compare(date1, date2)', function() {
        var d1 = new Date();
        var d2 = new Date(+d1 + 3600);
        qunit.equal(date.compare(d1, d2), 1, '前面日期小');
        qunit.equal(date.compare(d2, d1), -1, '前面日期大');
        qunit.equal(date.compare(d1, d1), 0, '两个日期一样大');
        qunit.raises(date.compare, '不传参数会导致异常');
        qunit.raises(function() {
            date.compare('ss', '2012-03-12');
        }, '不传日期对象参数会导致异常');
    });

    qunit.test('stringCompare(string1, pattern1, string2, pattern2)', function() {
        var d1 = '2012-03-23';
        var d2 = '2012-03-24 06:05:03';
        var f1 = 'yyyy-MM-dd';
        var f2 = 'yyyy-MM-dd HH:mm:ss'
        qunit.equal(date.stringCompare(d1, f1, d2, f2), 1, '前面日期小');
        qunit.equal(date.stringCompare(d2, f2, d1, f1), -1, '前面日期大');
        qunit.equal(date.stringCompare(d1, f1, d1, f1), 0, '两个日期一样大');
        qunit.raises(date.compare, '不传参数会导致异常');
        qunit.raises(function() {
            date.compare(d1, f1, d2, f1);
        }, '日期字符串和日期格式不匹配会导致异常');
    });

    qunit.test('stringToDate(val, pattern)', function() {
        qunit.ok(date.stringToDate('2012-03-05'), '2012-03-05可以转化为日期对象，默认yyyy-MM-dd格式');
        qunit.ok(date.stringToDate('2012-03-5', 'yyyy-MM-d'), '2012-03-5可以转化为日期对象，yyyy-MM-d格式');
        qunit.ok(date.stringToDate('2012-3-05', 'yyyy-M-dd'), '2012-3-05可以转化为日期对象，yyyy-M-dd格式');
        qunit.ok(date.stringToDate('2012-3-5', 'yyyy-M-d'), '2012-3-5可以转化为日期对象，yyyy-M-d格式');
        qunit.ok(date.stringToDate('12-03-05', 'yy-MM-dd'), '12-03-05可以转化为日期对象，yy-MM-dd格式');
        qunit.ok(date.stringToDate('12-03-5', 'yy-MM-d'), '12-03-5可以转化为日期对象，yy-MM-d格式');
        qunit.ok(date.stringToDate('12-3-05', 'yy-M-dd'), '12-3-05可以转化为日期对象，yy-M-dd格式');
        qunit.ok(date.stringToDate('12-3-5', 'yy-M-d'), '12-3-5可以转化为日期对象，yy-M-d格式');

        qunit.ok(date.stringToDate('2012-03-05 06:05:03', 'yyyy-MM-dd HH:mm:ss'), '2012-03-05 06:05:03可以转化为日期对象，yyyy-MM-dd HH:mm:ss格式');
        qunit.ok(date.stringToDate('2012-03-05 06:05:03 am', 'yyyy-MM-dd KK:mm:ss a'), '2012-03-05 06:05:03 a可以转化为日期对象，yyyy-MM-dd KK:mm:ss a格式');
        qunit.ok(date.stringToDate('2012-03-05 6:05:03', 'yyyy-MM-dd H:mm:ss'), '2012-03-05 6:05:03可以转化为日期对象，yyyy-MM-dd H:mm:ss格式');
        qunit.ok(date.stringToDate('2012-03-05 6:05:03 am', 'yyyy-MM-dd K:mm:ss a'), '2012-03-05 6:05:03 am可以转化为日期对象，yyyy-MM-dd K:mm:ss a格式');
        qunit.ok(date.stringToDate('2012-03-05 06:5:03', 'yyyy-MM-dd HH:m:ss'), '2012-03-05 06:5:03可以转化为日期对象，yyyy-MM-dd HH:m:ss格式');
        qunit.ok(date.stringToDate('2012-03-05 06:5:3', 'yyyy-MM-dd HH:m:s'), '2012-03-05 06:5:3可以转化为日期对象，yyyy-MM-dd HH:m:s格式');
        qunit.ok(date.stringToDate('2012-03-05 06:05:3', 'yyyy-MM-dd HH:mm:s'), '2012-03-05 06:05:3可以转化为日期对象，yyyy-MM-dd HH:mm:s格式');

        qunit.ok(date.stringToDate('2012/03/05', 'yyyy/MM/dd'), '2012/03/05可以转化为日期对象，yyyy/MM/dd格式');
        qunit.ok(date.stringToDate('2012__03__05', 'yyyy__MM__dd'), '2012__03__05可以转化为日期对象，yyyy__MM__dd格式');
        qunit.ok(date.stringToDate('2012_03#05&06:05-03', 'yyyy_MM#dd&HH:mm-ss'), '2012_03#05&06:05-03可以转化为日期对象，yyyy_MM#dd&HH:mm-ss格式');

        qunit.equal(date.stringToDate('2012-02-30'), 0, '2012-02-30是不存在的日期，返回0');
    });

    qunit.test('format(date, pattern)', function() {
        var d = date.stringToDate('2012-03-05 06:05:03', 'yyyy-MM-dd HH:mm:ss');
        qunit.equal(date.format(d), '2012-03-05', '格式化日期对象:' + d + ' 为字符串，默认yyyy-MM-dd格式');
        qunit.equal(date.format(d, 'yyyy-MM-d'), '2012-03-5', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-d格式');
        qunit.equal(date.format(d, 'yyyy-M-dd'), '2012-3-05', '格式化日期对象:' + d + ' 为字符串，yyyy-M-dd格式');
        qunit.equal(date.format(d, 'yyyy-M-d'), '2012-3-5', '格式化日期对象:' + d + ' 为字符串，yyyy-M-d格式');
        qunit.equal(date.format(d, 'yy-MM-dd'), '12-03-05', '格式化日期对象:' + d + ' 为字符串，yy-MM-dd格式');
        qunit.equal(date.format(d, 'yy-MM-d'), '12-03-5', '格式化日期对象:' + d + ' 为字符串，yy-MM-d格式');
        qunit.equal(date.format(d, 'yy-M-dd'), '12-3-05', '格式化日期对象:' + d + ' 为字符串，yy-M-dd格式');
        qunit.equal(date.format(d, 'yy-M-d'), '12-3-5', '格式化日期对象:' + d + ' 为字符串，yy-M-d格式');

        qunit.equal(date.format(d, 'yyyy-MM-dd HH:mm:ss'), '2012-03-05 06:05:03', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd HH:mm:ss格式');
        qunit.equal(date.format(d, 'yyyy-MM-dd KK:mm:ss a'), '2012-03-05 06:05:03 AM', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd KK:mm:ss a格式');
        qunit.equal(date.format(d, 'yyyy-MM-dd H:mm:ss'), '2012-03-05 6:05:03', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd H:mm:ss格式');
        qunit.equal(date.format(d, 'yyyy-MM-dd K:mm:ss a'), '2012-03-05 6:05:03 AM', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd K:mm:ss a格式');
        qunit.equal(date.format(d, 'yyyy-MM-dd HH:m:ss'), '2012-03-05 06:5:03', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd HH:m:ss格式');
        qunit.equal(date.format(d, 'yyyy-MM-dd HH:m:s'), '2012-03-05 06:5:3', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd HH:m:s格式');
        qunit.equal(date.format(d, 'yyyy-MM-dd HH:mm:s'), '2012-03-05 06:05:3', '格式化日期对象:' + d + ' 为字符串，yyyy-MM-dd HH:mm:s格式');

        qunit.equal(date.format(d, 'yyyy/MM/dd'), '2012/03/05', '格式化日期对象:' + d + ' 为字符串，yyyy/MM/dd格式');
        qunit.equal(date.format(d, 'yyyy__MM__dd'), '2012__03__05', '格式化日期对象:' + d + ' 为字符串，yyyy__MM__dd格式');
        qunit.equal(date.format(d, 'yyyy_MM#dd&HH:mm-ss'), '2012_03#05&06:05-03', '格式化日期对象:' + d + ' 为字符串，yyyy_MM#dd&HH:mm-ss格式');

        qunit.equal(date.format(d, 'HH:mm:ss'), date.format(date.stringToDate('2012-03-05 18:05:03', 'yyyy-MM-dd HH:mm:ss'), 'KK:mm:ss'), '18:05:03用12小时制表示是06:05:03');

        qunit.raises(date.format, '不传参数会导致异常');
        qunit.raises(function() {
            date.format('2012/03/05', 'yyyy-MM-d');
        }, '第一个参数不是日期对象会异常');
        qunit.raises(function() {
            date.format(null, 'yyyy-MM-d');
        }, '第一个参数不是日期对象（null）会异常');
        qunit.raises(function(a) {
            date.format(a, 'yyyy-MM-d');
        }, '第一个参数不是日期对象（undefined）会异常');
    });

    qunit.test('distance(date, n, unit)', function() {
        //具体单位分别是：y年，q季度，M月，h时，m分，s秒，w周，其他都是天
        var f = 'yyyy-MM-dd HH:mm:ss';
        var s = '2012-03-05 06:05:03';
        var d = date.stringToDate(s, f);

        qunit.equal(date.format(date.distance(d, 1, 'y'), f), '2013-03-05 06:05:03', s + ' 往后一年是：' + '2013-03-05 06:05:03');
        qunit.equal(date.format(date.distance(d, -1, 'y'), f), '2011-03-05 06:05:03', s + ' 往前一年是：' + '2011-03-05 06:05:03');
        qunit.equal(date.format(date.distance(d, 1, 'q'), f), '2012-06-05 06:05:03', s + ' 往后一个季度是：' + '2012-06-05 06:05:03');
        qunit.equal(date.format(date.distance(d, -1, 'q'), f), '2011-12-05 06:05:03', s + ' 往前一个季度是：' + '2011-12-05 06:05:03');
        qunit.equal(date.format(date.distance(d, 1, 'M'), f), '2012-04-05 06:05:03', s + ' 往后一个月是：' + '2012-04-05 06:05:03');
        qunit.equal(date.format(date.distance(d, -1, 'M'), f), '2012-02-05 06:05:03', s + ' 往前一个月是：' + '2012-02-05 06:05:03');
        qunit.equal(date.format(date.distance(d, 1, 'd'), f), '2012-03-06 06:05:03', s + ' 往后一天是：' + '2012-03-06 06:05:03');
        qunit.equal(date.format(date.distance(d, -1, 'd'), f), '2012-03-04 06:05:03', s + ' 往前一天是：' + '2012-03-04 06:05:03');
        qunit.equal(date.format(date.distance(d, 1, 'h'), f), '2012-03-05 07:05:03', s + ' 往后一个小时是：' + '2012-03-05 07:05:03');
        qunit.equal(date.format(date.distance(d, -1, 'h'), f), '2012-03-05 05:05:03', s + ' 往前一个小时是：' + '2012-03-05 05:05:03');
        qunit.equal(date.format(date.distance(d, 1, 'm'), f), '2012-03-05 06:06:03', s + ' 往后一分钟是：' + '2012-03-05 06:06:03');
        qunit.equal(date.format(date.distance(d, -1, 'm'), f), '2012-03-05 06:04:03', s + ' 往前一分钟是：' + '2012-03-05 06:04:03');
        qunit.equal(date.format(date.distance(d, 1, 's'), f), '2012-03-05 06:05:04', s + ' 往后一秒是：' + '2012-03-05 06:05:04');
        qunit.equal(date.format(date.distance(d, -1, 's'), f), '2012-03-05 06:05:02', s + ' 往前一秒是：' + '2012-03-05 06:05:02');

        qunit.equal(date.format(date.distance(new Date(2012, 1, 28), 1)), '2012-02-29', '2012-02-28后面一天是2012-02-29');
        qunit.equal(date.format(date.distance(new Date(2011, 1, 28), 1)), '2011-03-01', '2011-02-28后面一天是2011-03-01');
    });
});