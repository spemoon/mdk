define(function (require, exports, module) {
    var $ = require('jquery');
    var date = require('../../util/core/date');
    var lang = require('../../util/core/lang');
    var array = require('../../util/core/array');
    var widget = require('../widget');
    var position = require('../../util/core/dom/position');
    var browser = require('../../util/core/bom/browser');

    var config = {
        month:'yyyy-MM',
        date:'yyyy-MM-dd',
        minDate:date.stringToDate('1901-01-01', 'yyyy-MM-dd'), // 最小日期限制
        maxDate:date.stringToDate('2099-01-01', 'yyyy-MM-dd') // 最大日期限制
    };

    var helper = {
        /**
         * 获取该天位于该年的星期数
         */
        getWeek:function (d) {
            var t1 = date.stringToDate(date.format(d, config.month) + '-01', config.date).getTime();
            var t2 = date.stringToDate(d.getFullYear() + '-01-01', config.date).getTime();
            return parseInt((t1 - t2) / (7 * 24 * 60 * 60 * 1000)) + 1;
        },
        getMonthDayCount:function (month, d) {
            var ds = 31;
            if (month == 1) {
                ds = date.isLeap(d.getFullYear()) ? 29 : 28;
            } else if (month == 3 || month == 5 || month == 8 || month == 10) {
                ds = 30;
            }
            return ds;
        },
        /**
         * 从控件的结构获取日期
         */
        getDate:function () {
            var node = $(this.element);
            var yearNode = node.find('.m-cal-year');
            var year = this.yearSelect ? yearNode.val() : yearNode.text();
            var monthNode = node.find('.m-cal-month');
            var month = this.monthSelect ? monthNode.val() : monthNode.text();

            var d = node.find('.selected-item').text() || 1;
            var str = year + '-' + month + '-' + d;

            var format = 'yyyy-MM-d';
            if (this.showTime) { // 存在时间
                format += ' HH:mm';
                str += ' ' + node.find('.m-cal-hour').val() + ':' + node.find('.m-cal-minute').val();
            }
            return date.stringToDate(str, format);
        },
        /**
         * 设置头部年月信息
         */
        setHeadYear:function (year) {
            var node = $(this.element);
            var y1 = +(year ? year : date.format(this.date, 'yyyy'));
            var html;
            if (this.yearSelect) {
                var y2 = this.date.getFullYear();
                var max = Math.max(y1, y2) + 10;
                max = Math.min(max, config.maxDate.getFullYear());
                var min = max - this.yearRange;
                min = Math.max(min, config.minDate.getFullYear());

                html = [];
                for (var i = min; i < max; i++) {
                    html.push('<option value="' + i + '"' + (i == y1 ? ' selected="selected"' : '') + '>' + i + '</option>');
                }
                node.find('.m-cal-year').html(html.join(''));
            } else {
                node.find('.m-cal-year').text(y1);
            }
        },
        setHeadMonth:function (month) {
            var node = $(this.element);
            var m1 = month ? month : date.format(this.date, 'MM');
            var html;
            if (this.monthSelect) {
                var m2 = +m1;
                html = [];
                for (var i = 1; i <= 12; i++) {
                    var s = i < 10 ? '0' + i : i;
                    html.push('<option value="' + s + '"' + (i == m2 ? ' selected="selected"' : '') + '>' + s + '</option>');
                }
                node.find('.m-cal-month').html(html.join(''));
            } else {
                node.find('.m-cal-month').text(m1);
            }
        },

        setHead:function () {
            helper.setHeadYear.call(this);
            helper.setHeadMonth.call(this);
        },
        /**
         * 设置日历主体
         */
        setBody:function () {
            var node = $(this.element);
            var n = node.find('.m-cal-body');
            var prev = n.prev();
            n.remove();
            prev.after(helper.buildBody.call(this));
        },
        /**
         * 日历主体html拼接
         */
        buildBody:function () {
            var html = [];
            html.push('<table class="m-cal-body"><tbody>');
            var y = this.date.getFullYear();
            var m = this.date.getMonth();
            var dd = this.date.getDate();
            var d = new Date(y, m, '1');
            var sw = helper.getWeek(this.date);// 第几个星期
            var w = d.getDay();// 该月第一天是星期几
            var ds = helper.getMonthDayCount(m, this.date);// 该月有多少天
            var disType = lang.isArray(this.disabled) ? 1 : lang.isFunction(this.disabled) ? 2 : 3; // 1数组表示禁用周几；2表示函数禁用，返回true竟用；3表示object禁用range
            if (disType == 3) {
                this.disabled = this.disabled || {};
                this.disabled.format = this.disabled.format || this.format;
                this.disabled.min = this.disabled.min || this.minDate;
                this.disabled.max = this.disabled.max || this.maxDate;
                this.disabled.min = date.stringToDate(date.format(lang.isString(this.disabled.min) ? date.stringToDate(this.disabled.min, this.disabled.format) : this.disabled.min, config.date), config.date);
                this.disabled.max = date.stringToDate(date.format(lang.isString(this.disabled.max) ? date.stringToDate(this.disabled.max, this.disabled.format) : this.disabled.max, config.date), config.date);
            }
            html.push('<tr>');
            if (this.showWeek) {
                html.push('<td class="m-cal-weekday-info"><div class="m-cal-item" unselectable="on">', sw, '</div></td>');
            }
            sw++;
            var p = w - this.weekdayFirst;
            if (p < 0) {
                p += 7;
            }
            for (var j = 0; j < p; j++) {
                html.push('<td><div></div></td>');
            }
            var flag = true;
            var i = j;
            var k = 1;
            while (flag) {
                if (i != 0 && i % 7 == 0) {
                    html.push('</tr><tr>');
                    if (this.showWeek) {
                        html.push('<td class="m-cal-weekday-info"><div class="m-cal-item" unselectable="on">', sw, '</div></td>');
                        sw++;
                    }
                }
                var tm = m + 1;
                if (tm < 10) {
                    tm = '0' + '' + tm;
                }
                var tk = k;
                if (tk < 10) {
                    tk = '0' + '' + tk;
                }
                var disable = false;
                var sd = y + '-' + tm + '-' + tk;
                var xd = date.stringToDate(sd, config.date);
                if (disType == 1) { // 禁用周
                    disable = array.indexOf(i % 7, this.disabled) != -1;
                } else if (disType == 2) { // function禁用
                    disable = this.disabled.call(this, xd, sd, date);
                } else if (disType == 3) { // range禁用
                    disable = date.compare(this.disabled.min, xd) == -1 || date.compare(xd, this.disabled.max) == -1;
                }

                if (disable) { // 在禁用列表中
                    html.push('<td><div class="m-cal-dis-item m-cal-item" unselectable="on">', k, '</div></td>');
                } else {
                    html.push('<td><a href="#" class="m-cal-body-item m-cal-item' + (dd == k ? ' selected-item' : '') + '" unselectable="on">', k, '</a></td>');
                }
                i++;
                k++;
                if (k == ds + 1) {
                    flag = false;
                }
            }
            html.push('</tr></tbody></table>');
            return html.join('');
        },
        /**
         * 将数据渲染生成日历
         */
        load:function () {
            if (lang.callback(this.beforeLoad, {scope:this}) !== false) {
                helper.setHead.call(this);
                helper.setBody.call(this);
                lang.callback(this.afterLoad, {scope:this});
            }
        }
    }

    var calendar = widget.create({
        params:{
            bindTo:null, // 绑定的输入框input
            readonly:true, // 是否将日期输入框设置为只读
            position:'bottom', // 默认显示在bindTo的下方，可以设置为top
            date:new Date(), // 日期
            headerFormat:config.month, // 顶部月份格式
            format:config.date, // 选择后返回的日期格式
            showWeek:true, // 是否显示周数

            yearSelect:true, // 年份选择开关
            yearRange:40, // 年份选择时候跨度，默认40年，但受限于minDate和maxDate之间；同时，最大年份一般是比this.date或当前时间的最大值大10年，最小年份以最大年份往回推40年
            monthSelect:true, // 月份选择开关
            showTime:false, // 是否显示时分
            minuteRange:15, // 分钟间隔，15表示显示0/15/30/45；每分钟都显示设置为1

            okBtn:false,
            clearBtn:false,

            weekdayFirst:7, // 1表示周一,以此类推,周日为7
            minDate:config.minDate, // 最小日期限制
            maxDate:config.maxDate, // 最大日期限制
            disabled:null // array/function/object，匹配的日期将被禁用
        },
        tpl:function () {
            var html = '';
            html += '<div class="m-cal">';

            // 日历的头部';
            html += '<table class="m-cal-head"><tbody>';
            html += '    <tr>';
            html += '        <td><div class="m-cal-preyear" data-action="preyear"> </div></td>';
            html += '        <td><div class="m-cal-premonth" data-action="premonth"> </div></td>';
            html += '        <td><div class="m-cal-headtext">' + (this.yearSelect ? '<select class="m-cal-year"></select>' : '<span class="m-cal-year"> </span>') + ' - ' + (this.monthSelect ? '<select class="m-cal-month"></select>' : '<span class="m-cal-month" data-action="selmonth"> </span>') + '</div></td>';
            html += '        <td><div class="m-cal-nextmonth" data-action="nextmonth"> </div></td>';
            html += '        <td><div class="m-cal-nextyear" data-action="nextyear"> </div></td>';
            html += '    </tr>';
            html += '</tbody></table>';

            // 日历的日期列
            var weekdayDefaultArray = ['一', '二', '三', '四', '五', '六', '日'];
            var weekdayArray = [];
            for (var i = 0; i < 7; i++) {
                var t = this.weekdayFirst + i - 1;
                t = t >= 7 ? t - 7 : t;
                weekdayArray[i] = weekdayDefaultArray[t];
            }
            html += '<table class="m-cal-weekday"><tbody>';
            html += '    <tr>';
            if (this.showWeek) {
                html += '    <td class="m-cal-weekday-info"><div class="m-cal-item">星期</div></td>';
            }
            for (var i = 0; i < 7; i++) {
                html += '    <td><div class="m-cal-weekday-item m-cal-item">' + weekdayArray[i] + '</div></td>';
            }
            html += '    </tr>';
            html += '</tbody></table>';
            html += helper.buildBody.call(this);

            // 日历的时间列
            if (this.showTime) {
                var h = this.date.getHours();
                var m = this.date.getMinutes();
                html += '<table class="m-cal-bar"><tbody><tr>';
                html += '<td class="m-cal-time">';
                html += '    <select class="m-cal-hour">';
                for (var i = 0; i < 24; i++) {
                    var s = i < 10 ? '0' + i : i;
                    html += '<option value="' + s + '"' + (i == h ? ' selected="selected"' : '') + '>' + s + '</option>';
                }
                html += '    </select>';
                html += '    <em>:</em>';
                html += '    <select class="m-cal-minute">';
                for (var i = 0; i < 60; i += this.minuteRange) {
                    var s = i < 10 ? '0' + i : i;
                    html += '<option value="' + s + '"' + (i == m ? ' selected="selected"' : '') + '>' + s + '</option>';
                }
                html += '    </select>';
                html += '</td>';
                html += '<td>';
                if (this.bindTo && this.clearBtn) {
                    html += '    <input type="button" value="清除" data-action="clrdate"/>';
                }
                if (this.okBtn) {
                    html += '    <input type="button" value="确定" data-action="seldate"/>';
                }
                html += '</td>';
                html += '</tr></tbody></table>'
            }

            if (browser.ie6) {
                html += '<iframe width="220px" height="175px" style="position:absolute;z-index:-1;top:0px;left:0px;" border="0" frameborder="0" filter="progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";></iframe>';
            }

            html += '</div>';
            return html;
        },
        beforeInit:function () {
            if (lang.isString(this.date)) { // 传入this.date是字符串，则一般要设定自己的format
                this.date = date.stringToDate(this.date, this.format);
            } else {
                if (this.showTime) {
                    this.format = 'yyyy-MM-dd HH:mm';
                }
            }
            if (this.showTime) {
                this.okBtn = true;
                if (this.bindTo && this.readonly) {
                    this.clearBtn = true;
                }
            }
        },
        afterInit:function () {
            var _this = this;
            helper.load.call(this);
            var ipt = $(this.bindTo);
            if (this.bindTo) {
                this.isTextInput = ipt[0].tagName.toUpperCase() == 'INPUT' && ipt.attr('type') == 'text';
                ipt.bind('click focus', function () {
                    _this.render();
                    return false;
                });
                if (this.isTextInput && this.readonly) {
                    ipt.attr('readonly', 'readonly');
                }
            }
        },
        firstRender:function () {
            var node = $(this.element);
            var _this = this;
            if (this.yearSelect) {
                node.find('select.m-cal-year').change(function (e) { // 年份选择，要重构年份和日历主体
                    var y = this.value;
                    _this.date = helper.getDate.call(_this);
                    helper.setHeadYear.call(_this, y);
                    helper.setBody.call(_this);
                });
            }
            if (this.monthSelect) {
                node.find('select.m-cal-month').change(function (e) { // 月份选择，要重构日历主体
                    _this.date = helper.getDate.call(_this);
                    helper.setBody.call(_this);
                });
            }
        },
        proto:{
            render:function () {
                if (this.bindTo) {
                    var pos = this.position == 'top';
                    position.pin({
                        element:this.element,
                        x:'left',
                        y:pos ? 'bottom' : 'top'
                    }, {
                        element:this.bindTo,
                        x:'left',
                        y:pos ? 'top' : 'bottom'
                    })
                }
                this._render();
                return this;
            },
            getDate:function () {
                return this.date;
            },
            setDate:function (d) {
                var str;
                if (lang.isString(d)) {
                    this.date = date.stringToDate(d, this.format);
                    str = d;
                } else {
                    str = date.format(d, this.format);
                }
                helper.load.call(this);
                if (this.bindTo) {
                    $(this.bindTo).val(str);
                }
                return this;
            },
            disable:function (rule) {
                this.disabled = rule;
                helper.load.call(this);
                return this;
            }
        },
        events:[
            {
                preyear:function (e) { // 上一年
                    var d = date.distance(this.date, -1, 'y');
                    var d1 = date.stringToDate(date.format(d, config.month), config.month);
                    var d2 = date.stringToDate(date.format(this.minDate, config.month), config.month);
                    this.date = d;
                    helper.load.call(this);
                    return false;
                },
                premonth:function (e) { // 上一月
                    var d = date.distance(this.date, -1, 'M');
                    var d1 = date.stringToDate(date.format(d, config.month), config.month);
                    var d2 = date.stringToDate(date.format(this.minDate, config.month), config.month);
                    this.date = d;
                    helper.load.call(this);
                    return false;
                },
                nextmonth:function (e) { // 下一月
                    var d = date.distance(this.date, 1, 'M');
                    this.date = d;
                    helper.load.call(this);
                    return false;
                },
                nextyear:function (e) { // 下一年
                    var d = date.distance(this.date, 1, 'y');
                    this.date = d;
                    helper.load.call(this);
                    return false;
                },
                clrdate:function (e) { // 清除日期
                    if (this.bindTo) {
                        $(this.bindTo).val('');
                        this.unrender();
                        lang.callback(this.afterClear, {scope:this})
                    }
                    return false;
                }
            },
            {
                node:$(document),
                action:function (e) {
                    if (this.bindTo) {
                        this.unrender();
                    }
                }
            },
            {
                action:function (e) { // 点击选择日期
                    var target = e.target;
                    var n = $(target);
                    var node = $(this.element);
                    var flag = false;
                    if (n.hasClass('m-cal-body-item')) {
                        node.find('.selected-item').removeClass('selected-item');
                        n.addClass('selected-item');
                        if (!this.okBtn) {
                            flag = true;
                        }
                    }
                    if (flag || n.attr('data-action') == 'seldate') {
                        if (lang.callback(this.beforeSelect, {scope:this}) !== false) {
                            this.date = helper.getDate.call(this);
                            var v = date.format(this.date, this.format);
                            if (this.bindTo && this.isTextInput) {
                                $(this.bindTo).val(v);
                                this.unrender();
                            }
                            lang.callback(this.afterSelect, {
                                scope:this,
                                params:[v, this.date]
                            });
                        }
                    }
                    return false;
                }
            }
        ]
    });

    return calendar;
});