define(function(require, exports, module) {
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var section = require('../../../../../../lib/util/core/dom/section.js');
    var action = require('../../../../../../lib/util/core/dom/action.js');
    var ajax = require('../../../../../../lib/util/core/ajax.js');
    var helper = require('./helper.js');

    var tpl = {
        publish: require('./tpl/publish.tpl.js'),
        search: require('./tpl/search.tpl.js'),
        sidebar: require('./tpl/sidebar.tpl.js'),
        feed: require('./tpl/feed.tpl.js'),
        groupSidebar: require('./tpl/group_sidebar.tpl.js'),
        sms: require('./tpl/sms.tpl.js'),
        nd: require('./tpl/nd.tpl.js'),
        noread: require('./tpl/noread.tpl.js'),
        mo: require('./tpl/mo.tpl.js')
    };

    var baseurl = 'http://momo.im/';
    var user = {
        id: 23,
        name: '洪军钊',
        avatar: 'http://momoimg.com/avatar/1074597_LrurOnCRM365Gc2OKhSP_aED-wfxg-DqccN0T1avEVUsGiLDRKM7L_Z1-QSvV6JaPyFELw_130.jpg'
    };
    $(function() {
        var firstLi = $('.timeline li').eq(0);
        var xhr = {
            groupSidebar: ajax.single('groupSidebar')
        };
        $('.left li').click(function(e) {
            helper.highlight($(this));
        });

        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {

            section.view({
                // 搜索
                search: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        helper.highlight(firstLi);
                        node.html('<div class="scrollloadingtip">&nbsp;</div>');
                        return {
                            keyword: $.trim($(this).prev('input[name="keyword"]').val())
                        };
                    },
                    success: function(node, data) {
                        node.html(tpl.search.render({title: data.data,
                            avatar: user.avatar
                        }));
                    }
                },
                // 动态
                feed: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        node.find('.dynamic-list').html('');
                        node.find('.scrollloadingtip').show();
                    },
                    success: function(node, data) {
                        helper.feed.call(this, node, data, user.id);
                    },
                    error: function(node) {
                        node.find('.scrollloadingtip').hide();
                        node.find('.publish').append('<div class="error">服务端异常</div>');
                    }
                },
                // 时间线
                timeline: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        node[0].innerHTML = tpl.publish.render({
                            baseurl: baseurl,
                            user: user,
                            groupId: 0,
                            syncSina: 1
                        });
                        node.find('.scrollloadingtip').show();
                    },
                    success: function(node, data) {
                        helper.feed.call(this, node, data, user.id, function(node, data) {
                            node.find('.share').after(tpl.sidebar.render({
                                user: user
                            }));
                            require.async('./feed.js?_t=' + (+new Date()), function(feedEvent) { // 事件绑定
                                feedEvent();
                            });
                        });
                    },
                    error: function(node) {
                        node.find('.scrollloadingtip').hide();
                        node.find('.publish').append('<div class="error">服务端异常</div>');
                    }
                },
                // @推短信
                noread: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        node.find('.dynamic-list').html('');
                        node.find('.scrollloadingtip').show();
                    },
                    success: function(node, data) {
                        var html = [];
                        for(var i = 0, len = data.data.length; i < len; i++) {
                            html[i] = tpl.noread.render({
                                baseurl: baseurl,
                                data: data.data[i]
                            });
                        }
                        node.find('.scrollloadingtip').hide();
                        node.find('.dynamic-list').html(html.join(''));
                    },
                    error: function(node) {
                        node.find('.scrollloadingtip').hide();
                        node.find('.publish').append('<div class="error">服务端异常</div>');
                    }
                },
                // MO我的
                mo: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        node.find('.dynamic-list').html('');
                        node.find('.scrollloadingtip').show();
                    },
                    success: function(node, data) {
                        var html = [];
                        for(var i = 0, len = data.data.length; i < len; i++) {
                            html[i] = tpl.mo.render({
                                baseurl: baseurl,
                                data: data.data[i]
                            });
                        }
                        node.find('.scrollloadingtip').hide();
                        node.find('.dynamic-list').html(html.join(''));
                    },
                    error: function(node) {
                        node.find('.scrollloadingtip').hide();
                        node.find('.publish').append('<div class="error">服务端异常</div>');
                    }
                },
                // 群组
                group: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        node[0].innerHTML = tpl.publish.render({
                            baseurl: baseurl,
                            user: user,
                            groupId: $(this).attr('data-gid'),
                            syncSina: 1
                        });
                        node.find('.scrollloadingtip').show();
                    },
                    success: function(node, data) {
                        var html = [];
                        for(var i = 0, len = data.data.length; i < len; i++) {
                            var json = data.data[i];
                            html[i] = tpl.feed.render({
                                baseurl: baseurl,
                                json: json,
                                selectedId: 0,
                                groupId: 0,
                                meId: user.id,
                                likeBar: json.like_list && json.like_count > 0,
                                commentBar: json.comment_list && json.comment_count > json.comment_list.length
                            });
                        }
                        node.find('.scrollloadingtip').hide();
                        node.find('.dynamic-list').html(html.join(''));
                        xhr.groupSidebar.send({
                            url: 'data/group_info.php?id=' + $(this).attr('data-gid'),
                            success: function(data) {
                                node.find('.share').after(tpl.groupSidebar.render({
                                    data: data.data,
                                    isCreator: user.id == data.data.groupInfo.creator_id,
                                    isManager: (function() {
                                        var flag = false;
                                        for(var i = 0, len = data.data.groupManager.length; i < len; i++) {
                                            if(user.id == data.data.groupManager[i].uid) {
                                                flag = true;
                                            }
                                        }
                                        return flag;
                                    })(),
                                    baseurl: 'http://pre.momo.im/'
                                }));
                            }
                        });
                        require.async('./feed.js?_t=' + (+new Date()), function(feedEvent) { // 事件绑定
                            feedEvent();
                        });
                    },
                    error: function(node) {
                        node.find('.scrollloadingtip').hide();
                        node.find('.publish').append('<div class="error">服务端异常</div>');
                    }
                },
                // 短信页
                sms: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        $('.left li.active').removeClass('active');
                    },
                    success: function(node, data) {
                        node[0].innerHTML = tpl.sms.render({
                            user: {
                                avatar: 'http://momoimg.com/avatar/1074597_LrurOnCRM365Gc2OKhSP_aED-wfxg-DqccN0T1avEVUsGiLDRKM7L_Z1-QSvV6JaPyFELw_130.jpg',
                                weibo: 'http://weibo.com/1644259427',
                                sex: '男',
                                birthday: '1970-12-25',
                                address: '中国 福建省 福州市'
                            },
                            data: data.data,
                            parse: helper.content
                        });
                        node.find('.loading').hide();
                    }
                },
                // ND iframe + 说明
                nd: {
                    before: function(node) {
                        xhr.groupSidebar.abort();
                        node.html(tpl.nd.render());
                    },
                    success: function(node, iframe, width, height) {
                        node.find('.iframe-lbar').html(iframe);
                        iframe.width = width;
                        iframe.height = height;
                    }
                }
            });

            //
            action.listen({
                // 高亮时间线
                highlight: function() {
                    helper.highlight(firstLi);
                },
                // 回到时间线
                gotoTimeline: function() {
                    $('.left').find('li:first').eq(0).click();
                },
                // 展示/隐藏动态过滤的下拉窗口
                feedMenu: {
                    is: function(e) {
                        $('.dynamic-type-panel').show();
                    },
                    not: function(e) {
                        $('.dynamic-type-panel').hide();
                    }
                },
                // 设置动态tab的文字等信息
                setFeedTabText: function(e) {
                    var node = $(this);
                    $('.dynamic-filter-link').prev('span').text(node.text()).attr('data-uri', node.attr('data-uri')).attr('data-view', node.attr('data-view'));
                    helper.highlightTab($('.tab-1-hd li.first'));
                },
                // 高亮tab
                highlightTab: function(e) {
                    helper.highlightTab($(this).parents('li'));
                }
            });

            helper.highlight($('.left').find('li[data-view="nd"]').eq(0)).click();
        })();
    });
});
