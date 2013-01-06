define(function (require, exports, module) {
    require('../../../../sample.js');
    var $ = require('jquery');
    var array = require('../../../../../lib/util/core/array');
    var date = require('../../../../../lib/util/core/date');
    var calendar = require('../../../../../lib/cmp/core/calendar');

    $(function () {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function () {
            var cal = new calendar({
                params:{
                    bindTo:'#input1',
                    afterSelect:function (str, d) {
                        $('#tip1').text('选择了日期：' + str);
                    }
                }
            });
            cal.init();
        })();

        /**--------------------------------------------
         * 实例2：
         * --------------------------------------------*/
        (function () {
            var cal = new calendar({
                renderTo:'#box1',
                params:{
                    yearSelect:false,
                    monthSelect:false
                }
            });
            cal.init().render();
        })();

        /**--------------------------------------------
         * 实例3：
         * --------------------------------------------*/
        (function () {
            var cal = new calendar({
                renderTo:'#box2'
            });
            cal.init();
            $('#btn1').click(function () {
                var status = cal.getStatus();
                if (status == 1 || status == 3) {
                    cal.render();
                } else if (status == 2) {
                    cal.unrender();
                }
            });
        })();

        /**--------------------------------------------
         * 实例4：
         * --------------------------------------------*/
        (function () {
            var cal = new calendar({
                params:{
                    bindTo:'#input2',
                    showTime:true
                }
            });
            cal.init();
        })();

        /**--------------------------------------------
         * 实例5：
         * --------------------------------------------*/
        (function () {
            var cal = new calendar({
                renderTo:'#box3',
                params:{
                    afterSelect:function (str, d) {
                        $('#tip2').text('选择了日期：' + str);
                    }
                }
            });
            cal.init().render();

            var getWeek = function (d) {
                var t1 = d.getTime();
                var t2 = date.stringToDate(d.getFullYear() + '-01-01', config.date).getTime();
                return parseInt((t1 - t2) / (7 * 24 * 60 * 60 * 1000)) + 1;
            };
            var hasCheck = $(':radio[name="disdate"]:checked');
            if(hasCheck[0]) {
                hasCheck[0].checked = false;
            }
            $('#btn2').click(function (e) {
                var v = $(':radio[name="disdate"]:checked').val();
                var rule;
                if (v == 1) {
                    rule = [1, 4];
                } else if (v == 2) {
                    rule = {
                        max:new Date
                    };
                } else if (v == 3) {
                    rule = {
                        min:new Date(+new Date - 24 * 60 * 60 * 1000)
                    }
                } else if (v == 4) {
                    rule = function (d, s, date) {
                        var arr = ['2012-10-13', '2012-10-15', '2012-10-17', '2012-10-19'];
                        return array.indexOf(s, arr) != -1;
                    };
                } else if (v == 5) {
                    rule = function (d, s, date) {
                        var n = d.getDate();
                        var m = +d.getMonth() + 1;
                        return n % m == 0;
                    };
                }
                cal.disable(rule);
            });
        })();

        /**--------------------------------------------
         * 实例6：
         * --------------------------------------------*/
        (function () {
            var cal1 = new calendar({
                renderTo:'#box4',
                params:{
                    maxDate: new Date,
                    afterSelect: function(str, d) {
                        cal2.disable({
                            min: d
                        });
                    }
                }
            });
            var cal2 = new calendar({
                renderTo:'#box5',
                params:{
                    minDate: new Date,
                    afterSelect: function(str, d) {
                        cal1.disable({
                            max: d
                        });
                    }
                }
            });

            cal1.init().render();
            cal2.init().render();
        })();

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        (function () {
            var cal = new calendar({
                renderTo:'#box6'
            });
            cal.init().render();

            $('#btn3').click(function(e) {
                cal.setDate($('#txt1').val());
            });

            $('#btn4').click(function(e) {
                $('#txt1').val(date.format(cal.getDate()));
            });
        })();
    });
});
