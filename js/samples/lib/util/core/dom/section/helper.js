define(function(require, exports, module) {
    var $ = require('../../../../../../../js/lib/jquery/sea_jquery.js');
    var string = require('../../../../../../lib/util/core/string.js');

    var baseurl = 'http://momo.im/';

    var r = {
        highlight: function(node) {
            if(!$(node).hasClass('active')) {
                $('.left li.active').removeClass('active');
                $(node).addClass('active');
            }
            return $(node);
        },
        highlightTab: function(node) {
            if(!node.hasClass('active')) {
                $('.tab-1-hd li.active').removeClass('active');
                node.addClass('active');
            }
            return node;
        },
        parseFace: (function() {
            var data = [
                {key: 'beyond_endurance', title: '[怒了]'},
                {key: 'bad_smile', title: '[坏笑]'},
                {key: 'big_smile', title: '[大笑]'},
                {key: 'i_have_no_idea', title: '[没办法]'},
                {key: 'cry', title: '[泪奔]'},
                {key: 'the_devil', title: '[恶魔]'},
                {key: 'embarrassed', title: '[尴尬]'},
                {key: 'greeding', title: '[花心]'},
                {key: 'just_out', title: '[汗]'},
                {key: 'misdoubt', title: '[鄙视]'},
                {key: 'pretty_smile', title: '[可爱]'},
                {key: 'rockn_roll', title: '[摇滚]'},
                {key: 'shame', title: '[害羞]'},
                {key: 'sigh', title: '[失落]'},
                {key: 'smile', title: '[微笑]'},
                {key: 'surprise', title: '[惊讶]'},
                {key: 'unbelievable', title: '[无语]'},
                {key: 'unhappy', title: '[郁闷]'},
                {key: 'what', title: '[困惑]'},
                {key: 'wicked', title: '[生气]'}
            ];
            var keyData = (function() {
                var obj = {};
                for(var i = 0, len = data.length; i < len; i++) {
                    obj[data[i].title] = data[i].key;
                }
                return obj;
            })();
            return function(text) {
                return text.replace(/(\[[^\[|^\]]+\])/g, function($0, $1) {
                    var img = keyData[$1];
                    var str;
                    if(img) {
                        str = '<img src="' + baseurl + 'js/lib/MDK/resource/image/face/' + keyData[$1] + '.png" alt="' + $1 + '" title="' + $1 + '"/>';
                    } else {
                        str = $1;
                    }
                    return str;
                });
            };
        })(),
        content: function(content) {
            var result = '';
            if(content.text) {
                result = r.parseFace(string.content(content.text));
            } else if(content.picture) {
                result = '发送了一张图片' + ' 【<a href="' + content.picture.url.replace(/_\d+\.jpg$/, '.jpg') + '" target="_blank">查看</a>】';
            } else if(content.file) {
                result = '发送了一个文件：' + content.file.name + ' 【<a href="' + content.file.url + '" target="_blank">下载</a>】';
            } else if(content.audio) {
                result = '发送了一段音频' + ' 【<a href="' + content.audio.url + '?filetype=mp3" target="_blank">下载</a>】';
            } else if(content.location) {
                result = '发送了一个地理位置' + ' 【<a href="http://ditu.google.cn/maps?daddr=' + content.location.latitude + ',' + content.location.longitude + '&dirflg=r' + '" target="_blank">查看</a>】' ;
            } else if(content.sender_card) {
                result = '发送了一张名片' + ' 【<a href="' + baseurl + 'user/' + content.sender_card.id + '" target="_blank">查看</a>】';
            } else if(content.text_long) {
                result = r.parseFace(string.content(content.text_long));
            } else if(content.mobile_modify) {
                result = content.mobile_modify.text;
            }
            return result;
        },
        feed: function(node, data, uid, callback) {
            require.async('./tpl/feed.tpl.js', function(feedTpl) {
                var html = [];
                for(var i = 0, len = data.data.length; i < len; i++) {
                    var json = data.data[i];
                    html[i] = feedTpl.render({
                        baseurl: baseurl,
                        json: json,
                        selectedId: 0,
                        groupId: 0,
                        meId: uid,
                        likeBar: json.like_list && json.like_count > 0,
                        commentBar: json.comment_list && json.comment_count > json.comment_list.length
                    });
                }
                node.find('.scrollloadingtip').hide();
                node.find('.dynamic-list').html(html.join(''));
                callback && callback.call(this, node, data);
            });
        }
    };
    return r;
});