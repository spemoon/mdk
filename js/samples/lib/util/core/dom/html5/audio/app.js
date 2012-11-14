define(function(require, exports, module) {
    require('../../../../../../sample.js');
    var $ = require('jquery');
    // var xxx = require('{../../../../../../../../js/}');
    var audio = require('../../../../../../../lib/util/core/dom/html5/audio.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var a1 = new audio({
                src: '1.mp3'
            });
            a1.bind({
                loadStart: function(e, scope) {
                    for(var i = 0, len = list.length; i < len; i++) {
                        if(scope.src == list[i].src) {
                            songName.text(list[i].name);
                            break;
                        }
                    }
                    songTime.text(0);
                    songLoaded.text(0);
                    songNow.text(0);
                    songPercent.text(0);
                    songStatus.text('准备载入');
                },
                loaded: function(e, scope) {
                    songTime.text(scope.duration || scope.element.duration);
                    songStatus.text('载入完成');
                },
                // 载入进度
                progress: function(e, loaded, total, scope) {
                    songLoaded.text((loaded / total * 100).toFixed(2) + '%');
                },
                // 播放进度
                timeupdate: function(e, played, total, scope) {
                    songNow.text(played);
                    songPercent.text((played / total * 100).toFixed(2) + '%');
                    if(scope.status == 1) {
                        songStatus.text('播放');
                    }
                },
                play: function(e, scope) {
                    songStatus.text('播放');
                },
                pause: function(e, scope) {
                    songStatus.text('暂停');
                },
                skip: function(e, scope) {
                    console.log('跳转');
                },
                ended: function(e, scope) {
                    songStatus.text('结束');
                    if(playList.status) {
                        nextSong();
                    }
                },
                error: function(e, scope) {
                    songStatus.text('异常');
                }
            });

            var btn1 = $('#btn1');
            var btn2 = $('#btn2');
            var btn3 = $('#btn3');
            var btn4 = $('#btn4');
            var btn5 = $('#btn5');

            var btn6 = $('#btn6');
            var btn7 = $('#btn7');
            var btn8 = $('#btn8');
            var btn9 = $('#btn9');
            var btn10 = $('#btn10');
            var btn11 = $('#btn11');

            var btn12 = $('#btn12');
            var btn13 = $('#btn13');

            var songName = $('#song_name');
            var songTime = $('#song_time');
            var songLoaded = $('#song_loaded');
            var songNow = $('#song_now');
            var songPercent = $('#song_percent');
            var songStatus = $('#song_status');

            var helper = {
                view: function() {

                }
            };

            var list = [
                {
                    src: '1.mp3',
                    name: '可惜不是你'
                },
                {
                    src: '2.mp3',
                    name: '光辉岁月'
                },
                {
                    src: 'http://kolber.github.com/audiojs/demos/mp3/juicy.mp3?t=' + new Date(),
                    name: '远程歌曲'
                },
                {
                    src: '3.mp3',
                    name: 'the wrong hole'
                }
            ];

            // 载入并播放
            btn1.click(function() {
                a1.load(list[0].src);
            });
            // 暂停
            btn2.click(function() {
                if(a1.src == list[0].src) {
                    a1.pause();
                }
            });
            // 跳转
            btn3.click(function() {
                if(a1.src == list[0].src) {
                    a1.skipTo(50);
                }
            });
            // 播放/暂停 切换
            btn4.click(function() {
                if(a1.src == list[0].src) {
                    a1.toggle();
                }
            });
            // 结束
            btn5.click(function() {
                if(a1.src == list[0].src) {
                    a1.end();
                }
            });

            // 载入
            btn6.click(function() {
                a1.load({
                    autoplay: false,
                    src: list[1].src
                });
            });
            // 播放
            btn7.click(function() {
                if(a1.src == list[1].src) {
                    a1.play();
                }
            });
            // 暂停
            btn8.click(function() {
                if(a1.src == list[1].src) {
                    a1.pause();
                }
            });
            // 跳转
            btn9.click(function() {
                if(a1.src == list[1].src) {
                    a1.skipTo(90);
                }
            });
            // 播放/暂停 切换
            btn10.click(function() {
                if(a1.src == list[1].src) {
                    a1.toggle();
                }
            });
            // 结束
            btn11.click(function() {
                if(a1.src == list[1].src) {
                    a1.end();
                }
            });

            var playList = {
                status: false, // 是否播放列表中
                index: 0 // 播放第几首
            };
            var nextSong = function() {
                playList.index++;
                playList.index %= 4;
                a1.load(list[playList.index]);
            };
            // 播放列表
            btn12.click(function() {
                a1.end();
                a1.load(list[playList.index]);
            });
            // 下一首
            btn13.click(function() {
                nextSong();
            });

            $(document.body).click(function(e) {
                var target = e.target;
                var tagName = target.tagName.toUpperCase();
                if(tagName == 'INPUT') {
                    playList.status = target.id == 'btn13' || target.id == 'btn14';
                }
            });
        })();
    });
});
