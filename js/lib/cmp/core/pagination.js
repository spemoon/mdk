/**
 * User: caolvchong@gmail.com
 * Date: 10/12/12
 * Time: 11:42 AM
 */
define(function (require, exports, module) {
    var $ = require('jquery');
    var lang = require('../../util/core/lang');
    var ajax = require('../../util/core/ajax');
    var widget = require('../widget');

    var helper = {
        /**
         * scope: this
         * @param {Integer} total 总页数
         * @param {Integer} size 每页数量
         * @param {Integer} current 当前页码
         * @param {Integer} x 当前页码附近显示页数
         * @param {Integer} y 省略号附近显示页数
         * @param {Boolean} showPN 是否显示上一页/下一页
         */
        html:function () {
            var url = this.url;
            var x = this.x;
            var y = this.y;
            var total = Math.ceil(this.total / this.size);
            var current = Math.max(Math.min(this.current, total), 1);
            var t = Math.ceil(x / 2), t1 = Math.max(0, t - 1), t2;
            var i, end;
            var html = '';
            url += url.indexOf('?') == -1 ? '?' : '&';
            if (url.indexOf(this.sizeName + '=') == -1) {
                url += this.sizeName + '=' + this.size + '&';
            }
            if (url.indexOf(this.pageName + '=') == -1) {
                url += this.pageName + '=';
            }
            if (this.showPN) {
                if (current == 1 || total == 0) {
                    html += '<a class="page-pre disabled" href="javascript:;" >上一页</a>';
                } else {
                    html += '<a class="page-pre" href="' + (url + (current - 1)) + '" data-page="' + (current - 1) + '" data-action="page">上一页</a>';
                }
            }
            if (current > y + t1 + 1) {
                for (i = 1, end = y; i <= end; i++) {
                    html += '<a href="' + (url + i) + '" data-page="' + i + '" data-action="page">' + i + '</a>';
                }
                html += '<span>...</span>';
                for (i = current - t1, end = current - 1; i <= end; i++) {
                    html += '<a href="' + (url + i) + '" data-page="' + i + '" data-action="page">' + i + '</a>';
                }
            } else {
                for (i = 1, end = current - 1; i <= end; i++) {
                    html += '<a href="' + (url + i) + '" data-page="' + i + '" data-action="page">' + i + '</a>';
                }
                t1 = end;
            }
            t2 = x - t1 - 1;
            html += '<a class="active" href="javascript:;">' + current + '</a>';
            if (current < total - y - t2 - 1) {
                for (i = current + 1, end = current + t2; i <= end; i++) {
                    html += '<a href="' + (url + i) + '" data-page="' + i + '" data-action="page">' + i + '</a>';
                }
                html += '<span>...</span>';
                for (i = total - y + 1, end = total; i <= end; i++) {
                    html += '<a href="' + (url + i) + '" data-page="' + i + '" data-action="page">' + i + '</a>';
                }
            } else {
                for (i = current + 1, end = total; i <= end; i++) {
                    html += '<a href="' + (url + i) + '" data-page="' + i + '" data-action="page">' + i + '</a>';
                }
            }
            if (this.showPN) {
                if (current == total || total == 0) {
                    html += '<a class="page-pre disabled" href="javascript:;" >下一页</a>';
                } else {
                    html += '<a class="page-next" href="' + (url + (current + 1)) + '" data-page="' + (current + 1) + '" data-action="page">下一页</a>';
                }
            }
            return html;
        },
        ajax:function (page) {
            var sa = ajax.single(this.xhr || 'pagination_' + this.id);
            var _this = this;
            var obj = {
                url:this.url,
                before:function () {
                    _this.before && _this.before.call(_this);
                },
                success:function (data) {
                    var total = data.data[_this.totalName];
                    if (total != _this.total) {
                        _this.reload({
                            total:total,
                            current:data.data[_this.pageName]
                        });
                    }
                    _this.success && _this.success.call(_this, data);
                },
                failure:function (data) {
                    _this.failure && _this.failure.call(_this, data);
                },
                error:function (xhr, status) {
                    _this.error && _this.error.call(_this, xhr, status);
                },
                complete:function (xhr, status) {
                    _this.complete && _this.complete.call(_this, xhr, status);
                },
                data:{}
            };
            if (this.url.indexOf(this.pageName + '=') == -1) {
                obj.data[this.pageName] = page;
            }
            if (this.url.indexOf(this.sizeName + '=') == -1) {
                obj.data[this.sizeName] = this.size;
            }
            this.reload({
                current:page
            });
            sa.send(obj);
        }
    };

    var pagination = widget.create({
        params:{
            url:'', // 获取数据的url
            data:null, // 提供data数组，则使用静态数据（此需求非常少见，但确实遇到了）
            ajax:true, // 是否使用ajax方式
            action:null, // 点击分页后的回调
            pageName:'page', // 传递给后端的页数参数名
            sizeName:'pagesize', // 传递给后端的每页数量参数名
            totalName:'total', // 后端返回总条数的参数名
            size:12, // 每页数量
            current:1, // 当前页
            total:0, // 数据总数
            showPN:true, // 是否显示 Prev（上一页） 和 Next（下一页）
            x:5, // 当前页附近显示的页数，比如（当前页1，显示 1，2，3，4，5；当前页2，显示1，2，3，4，5；当前页6，显示4，5，6，7，8。也就是尽量保持当前页码在中间）
            y:1 // 省略号旁边显示的页数
        },
        tpl:function () {
            var html = '';
            html += '<div class="m-pagination">';
            html += helper.html.call(this);
            html += '</div>';
            return html;
        },
        beforeInit:function () {
            if (this.data) {
                this.ajax = false;
                this.total = this.data.length;
            } else if (this.action) {
                this.ajax = false;
            }
        },
        firstRender:function () {
            if (this.ajax) {
                helper.ajax.call(this, 1);
            }
        },
        proto:{
            reload:function (params) {
                var node = $(this.element);
                params = params || {};
                if (!lang.isUndefined(params.url)) {
                    this.url = params.url;
                }
                if (!lang.isUndefined(params.size)) {
                    this.size = Math.max(params.size, 1);
                }
                if (!lang.isUndefined(params.total)) {
                    this.total = Math.max(params.total, 0);
                }
                if (!lang.isUndefined(params.x)) {
                    this.x = Math.max(params.x, 1);
                }
                if (!lang.isUndefined(params.y)) {
                    this.y = Math.max(params.y, 1);
                }
                if (!lang.isUndefined(params.current)) {
                    this.current = Math.max(params.current, 1);
                }
                node[0].innerHTML = helper.html.call(this);
                return this;
            },
            load:function (page) {
                page = page || this.current;
                if (this.ajax) {
                    helper.ajax.call(this, page);
                }
                return this;
            }
        },
        events:[
            {
                page:function (e) {
                    var page = e ? $(e.target).attr('data-page') : this.current;
                    if (this.ajax) {
                        helper.ajax.call(this, page);
                    } else {
                        if (this.data) {
                            var max = this.data.length;
                            var start = Math.max((page - 1) * this.size, 0);
                            var end = Math.min(start + this.size, max);
                            var data = this.data.slice(start, end);
                            if (data.length == 0) {
                                end = max;
                                start = Math.max(end - this.size, 0);
                                data = this.data.slice(start, end);
                            }
                            this.total = max;
                            this.reload({
                                current:page
                            });
                            this.success && this.success.call(this, data);
                        } else if (this.action) {
                            lang.callback(this.action, {
                                params:[page],
                                scope:this
                            });
                            this.reload({
                                current:page
                            });
                        }
                    }
                }
            }
        ]
    });

    return pagination;
});