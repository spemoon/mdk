define(function(require, exports, module) {
    var qunit = require('../../../../../lib/external/qunit/sea_qunit.js');
    var lang = require('../../../../../lib/util/core/lang.js');

    qunit.module("util.core.lang");

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

    qunit.test('isArray(mix)', function() {
        var a;
        qunit.ok(!lang.isArray(a), '仅声明未赋值的变量不是array');
        qunit.ok(!lang.isArray(1), '数字1不是array');
        qunit.ok(!lang.isArray('ss'), '字符串ss是array');
        qunit.ok(!lang.isArray(null), 'null不是array');
        qunit.ok(!lang.isArray({}), '{}不是array');
        qunit.ok(lang.isArray([]), '[]是array');
        qunit.ok(!lang.isArray(function() {
        }), 'function不是array');
        qunit.ok(!lang.isArray(), '空参数不是array');
        qunit.ok(!lang.isArray(arguments), 'arguments不是array');
    });

    qunit.test('isFunction(mix)', function() {
        var a;
        qunit.ok(!lang.isFunction(a), '仅声明未赋值的变量不是function');
        qunit.ok(!lang.isFunction(1), '数字1不是function');
        qunit.ok(!lang.isFunction('ss'), '字符串ss是function');
        qunit.ok(!lang.isFunction(null), 'null不是function');
        qunit.ok(!lang.isFunction({}), '{}不是function');
        qunit.ok(!lang.isFunction([]), '[]是function');
        qunit.ok(lang.isFunction(function() {
        }), 'function是function');
        qunit.ok(!lang.isFunction(), '空参数不是function');
    });

    qunit.test('extend(subClass, superClass, protoFns)', function() {
        var Base = function(name, age) {
            this.name = name;
            this.age = age;
        };
        Base.prototype.say = function(word) {
            return this.name + ':' + word;
        };
        // 基本继承
        var S1 = function(name, age, sex) {
            Base.call(this, name, age);
            this.sex = !!sex;
        };
        lang.extend(S1, Base, {
            getSex: function() {
                return this.sex ? 'M' : 'F';
            }
        });
        var s1 = new S1('David', 26, 1); // david，26岁，男性
        qunit.ok(lang.isFunction(s1.say), '从父类Base那里继承到say方法');
        qunit.equal(s1.say('hello'), 'David:hello', '使用继承到的say方法');
        qunit.equal(s1.getSex(), 'M', '使用自己的方法getSex');
        // 带override的继承
        var S2 = function(name, age, sex) {
            Base.call(this, name, age);
            this.sex = !!sex;
        };
        lang.extend(S2, Base, {
            say: function(word) {
                return 'haha,' + word;
            },
            getSex: function() {
                return this.sex ? 'M' : 'F';
            }
        });
        var s2 = new S2('Susan', 22, 0);
        qunit.ok(lang.isFunction(s2.say), '从父类Base那里继承到say方法');
        qunit.equal(s2.say('it is good'), 'haha,it is good', '使用重写的say方法');
        qunit.equal(s2.superClass.say.call(s2, 'it is good'), 'Susan:it is good', '访问父类的say方法，该方法虽然被重写');
        qunit.equal(s2.getSex(), 'F', '使用自己的方法getSex');
    });

    qunit.test('timer(params)', function() {
        var i = 0;
        qunit.stop();
        lang.timer({
            rule: function() {
                qunit.start();
                return i < 5;
            },
            start: function() {
                qunit.equal(i, 0, 'timer初始化的值');
            },
            fn: function() {
                i++;
                qunit.ok(i, '运行' + i + '次后的值');
                qunit.stop();
            },
            end: function() {
                qunit.start();
                qunit.equal(i, 5, 'timer结束后的值');
            }
        });
    });

    qunit.test('timer(params) test stop', function() {
        var i = 0;
        qunit.stop();
        var timer = lang.timer({
            rule: function() {
                qunit.start();
                return i < 5;
            },
            start: function() {
                qunit.equal(i, 0, 'timer初始化的值');
            },
            fn: function() {
                qunit.stop();
                i++;
                qunit.ok(i, '运行' + i + '次后的值');
                if(i == 3) {
                    timer.stop(); // 中断
                }
            },
            end: function() {
                qunit.start();
                qunit.equal(i, 3, 'timer结束后的值');
            }
        });
    });
});
