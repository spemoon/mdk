define(function(require, exports, module) {
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var section = require('../../../../../../lib/util/core/dom/section.js');
    var action = require('../../../../../../lib/util/core/dom/action.js');
    var lang = require('../../../../../../lib/util/core/lang.js');
    var ajax = require('../../../../../../lib/util/core/ajax.js');
    var scroll = require('../../../../../../lib/util/core/dom/scroll.js');
    var helper = require('./helper.js');

    var tpl = {
        publish: require('./tpl/publish.tpl.js'),
        feed: require('./tpl/feed.tpl.js'),
        search: require('./tpl/search.tpl.js'),
        sidebar: require('./tpl/sidebar.tpl.js'),
        groupSidebar: require('./tpl/group_sidebar.tpl.js'),
        nd: require('./tpl/nd.tpl.js'),
        noread: require('./tpl/noread.tpl.js'),
        mo: require('./tpl/mo.tpl.js'),
        post: require('./tpl/post.tpl.js')
    };

    var baseurl = 'http://momo.im/';
    var user = {
        id: 23,
        name: '洪军钊',
        avatar: 'http://momoimg.com/avatar/1074597_LrurOnCRM365Gc2OKhSP_aED-wfxg-DqccN0T1avEVUsGiLDRKM7L_Z1-QSvV6JaPyFELw_130.jpg'
    };
    $(function() {
        var firstLi = $('.timeline li').eq(0);
        var gotoTopNode = $('.div-to-top').eq(0);

        var xhr = {
            groupSidebar: ajax.single('groupSidebar'),
            plugin: ajax.single('plugin')
        };
        var abortXhr = function() {
            for(var name in xhr) {
                xhr[name].abort();
            }
        };
        var scrollFeed = {
            before: function(node) {
                node.find('.scrollloadingtip').show();
            },
            success: function(node, data) {
                helper.feed.call(this, {
                    node: node,
                    data: data,
                    uid: user.id,
                    tpl: tpl.feed,
                    append: true
                });
            }
        };

        $('.left li').click(function(e) {
            helper.highlight($(this));
        });

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
                    abortXhr();
                    node.find('.dynamic-list').html('');
                    node.find('.scrollloadingtip').show();
                },
                success: function(node, data) {
                    helper.feed.call(this, {
                        node: node,
                        data: data,
                        uid: user.id,
                        tpl: tpl.feed
                    });
                },
                error: function(node) {
                    node.find('.scrollloadingtip').hide();
                    node.find('.publish').append('<div class="error">服务端异常</div>');
                },
                scroll: scrollFeed
            },
            // 时间线
            timeline: {
                before: function(node) {
                    abortXhr();
                    node[0].innerHTML = tpl.publish.render({
                        baseurl: baseurl,
                        user: user,
                        groupId: 0,
                        syncSina: 1
                    });
                    node.find('.scrollloadingtip').show();
                },
                success: function(node, data) {
                    helper.feed.call(this, {
                        node: node,
                        data: data,
                        uid: user.id,
                        tpl: tpl.feed,
                        callback: function(node, data) {
                            node.find('.share').after(tpl.sidebar.render({
                                user: user
                            }));
                            // 异步事件绑定
                            // 注意：
                            //    必须在回调函数中增加判断，防止script载入太慢而用户在你载入之前切换了节点
                            //    而script载入后回调执行极有可能会找不到DOM而报错
                            var scope = this;
                            require.async('./feed.js', function(feedEvent) { // 事件绑定
                                if(scope == section.getActiveNode()) {
                                    feedEvent();
                                }
                            });
                        }
                    });
                },
                error: function(node) {
                    node.find('.scrollloadingtip').hide();
                    node.find('.publish').append('<div class="error">服务端异常</div>');
                },
                scroll: scrollFeed
            },
            // @推短信
            noread: {
                before: function(node) {
                    abortXhr();
                    node.find('.dynamic-list').html('');
                    node.find('.scrollloadingtip').show();
                },
                success: function(node, data) {
                    helper.noread.call(this, {
                        node: node,
                        data: data,
                        tpl: tpl.noread
                    });
                },
                error: function(node) {
                    node.find('.scrollloadingtip').hide();
                    node.find('.publish').append('<div class="error">服务端异常</div>');
                },
                scroll: {
                    before: scrollFeed.before,
                    success: function(node, data) {
                        helper.noread.call(this, {
                            node: node,
                            data: data,
                            tpl: tpl.noread,
                            append: true
                        });
                    }
                }
            },
            // MO我的
            mo: {
                before: function(node) {
                    abortXhr();
                    node.find('.dynamic-list').html('');
                    node.find('.scrollloadingtip').show();
                },
                success: function(node, data) {
                    helper.mo.call(this, {
                        node: node,
                        data: data,
                        tpl: tpl.mo
                    });
                },
                error: function(node) {
                    node.find('.scrollloadingtip').hide();
                    node.find('.publish').append('<div class="error">服务端异常</div>');
                },
                scroll: {
                    before: scrollFeed.before,
                    success: function(node, data) {
                        helper.mo.call(this, {
                            node: node,
                            data: data,
                            tpl: tpl.mo,
                            append: true
                        });
                    }
                }
            },
            // 群组
            group: {
                before: function(node) {
                    abortXhr();
                    node[0].innerHTML = tpl.publish.render({
                        baseurl: baseurl,
                        user: user,
                        groupId: $(this).attr('data-gid'),
                        syncSina: 1
                    });
                    node.find('.scrollloadingtip').show();
                },
                success: function(node, data) {
                    helper.feed.call(this, {
                        node: node,
                        data: data,
                        uid: user.id,
                        tpl: tpl.feed,
                        groupId: $(this).attr('data-gid'),
                        callback: function(node, data) {
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

                            // 异步事件绑定
                            // 注意：
                            //    必须在回调函数中增加判断，防止script载入太慢而用户在你载入之前切换了节点
                            //    而script载入后回调执行极有可能会找不到DOM而报错
                            var scope = this;
                            require.async('./feed.js', function(feedEvent) { // 事件绑定
                                if(scope == section.getActiveNode()) {
                                    feedEvent();
                                }
                            });
                        }
                    });
                },
                error: function(node) {
                    node.find('.scrollloadingtip').hide();
                    node.find('.publish').append('<div class="error">服务端异常</div>');
                },
                scroll: scrollFeed
            },
            // 通用iframe处理
            commonIframe: {
                before: function(node) {
                    node.html('<div class="loading">正在加载...</div>');
                },
                success: function(node, iframe, width, height) {
                    node.find('.loading').remove();
                    iframe.width = width;
                    iframe.height = height;
                }
            },
            // ND iframe + 说明
            nd: {
                before: function(node) {
                    abortXhr();
                    node.html(tpl.nd.render());
                },
                success: function(node, iframe, width, height) {
                    node.find('.iframe-lbar').html(iframe);
                    iframe.width = width;
                    iframe.height = height;
                }
            },
            // ajax插件，展示和事件通过data-script引入，目前包括：
            // 短信页/内部插件
            plugin: {
                before: function(node) {
                    abortXhr();
                    section.inject('plugin', { // 插入外部变量
                        xhr: xhr
                    });
                    node.html('<div class="loading">正在加载...</div>');
                }
            }
        });

        // 事件冒泡监听
        action.listen({
            // 高亮时间线
            highlight: function() {
                helper.highlight(firstLi);
            },
            unHighlight: function() {
                $('.left li.active').removeClass('active');
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
            },
            // 回到顶部
            gotoTop: function(e) {
                scroll.to(window, 0);
            },
            // 动态中的回复框展示
            replyBox: function(e) {
                var node = $(this);
                var postNode = node.next('.post');
                var textarea = postNode.find('textarea');
                if(!postNode[0]) {
                    var html = tpl.post.render({
                        baseurl: baseurl,
                        user: user
                    });
                    node.after(html);
                    postNode = node.next();
                    textarea = postNode.find('textarea');
                    textarea.blur(function() {
                        node.show();
                        postNode.hide();
                    });
                    helper.textareaListen(textarea, postNode.find('.m-button').eq(0));
                }
                node.hide();
                postNode.show();
                postNode.find('textarea').focus();
            }
        });

        // 滚动监听
        scroll.listen(window, {
            top: function(e, scrollTop, dir, status) {
                gotoTopNode.hide();
            },
            other: function(e, scrollTop, dir, status) {
                if(scrollTop > 50 && gotoTopNode.is(':hidden')) {
                    gotoTopNode.show();
                }
            }
        });

        helper.highlight($('.left').find('li[data-view="nd"]').eq(0)).click();
        if($(window).scrollTop() > 50) {
            gotoTopNode.show();
        }
    });
});
