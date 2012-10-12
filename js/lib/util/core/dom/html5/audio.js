define(function(require, exports, module) {
    var $ = require('jquery');
    var mVar = require('../mVar');
    var helper = {
        flashInstanceName: 'myAudioJs',
        useFlash: (function() {
            var a = document.createElement('audio');
            return !(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')) || navigator.userAgent.indexOf('Chromium') != -1;
        })(),
        create: {
            /**
             * 创建html5 audio标签
             * @param params
             *     preload: 是否预加载
             *     src: 资源地址
             *     autoplay: 是否自动播放
             * @return {Node} audio节点
             */
            html5: function(params) {
                params = params || {};
                var html = '<audio src="' + (params.src ? params.src : '') + '"></audio>';
                var fragment = document.createDocumentFragment();
                var doc = fragment.createElement ? fragment : document;
                doc.createElement('audio');
                var div = doc.createElement('div');
                fragment.appendChild(div);
                div.innerHTML = html;
                return div.firstChild;
            },
            flash: function(params) {
                var flash = seajs.pluginSDK.util.dirname(module.uri) + 'audiojs.swf';
                var id = mVar.id();
                var t = +new Date + Math.random();
                var html = '';
                var firefox = $.browser.mozilla;
                html += '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ' + (firefox ? '' : ('name="' + id + '" id="' + id + '"')) + ' width="1" height="1" style="position: absolute; left: -1px;">';
                html += '<param name="movie" value="' + flash + '?playerInstance=' + helper.flashInstanceName + '[\'' + id + '\']&datetime=' + t + '">';
                html += '<param name="allowscriptaccess" value="always">';
                html += '<embed name="' + id + '" src="' + flash + '?playerInstance=' + helper.flashInstanceName + '[\'' + id + '\']&datetime=' + t + '" width="1" height="1" allowscriptaccess="always"></embed>';
                html += '</object>';
                $(document.body).append(html);

                if(!window[helper.flashInstanceName]) {
                    window[helper.flashInstanceName] = {};
                }
                window[helper.flashInstanceName][id] = this;

                var swf = document[id] || window[id];
                return swf.length > 1 ? swf[swf.length - 1] : swf; // element 存放的是object flash元素
            }
        },
        /**
         * 格式化好load方法的参数，需要绑定this
         * @param params
         * @return {Object}
         */
        loadParams: function(params) {
            var p = {};
            if(typeof params == 'string') {
                p.src = params;
                p.preload = true;
                p.autoplay = true;
            } else {
                params = params || {};
                p.src = params.src;
                p.preload = params.preload !== false;
                p.autoplay = params.autoplay !== false;
            }
            this.src = p.src;
            this.preload = p.preload;
            this.autoplay = p.autoplay;
            this.status = 0;
            return p;
        },
        progress: function() {
            if(!this.timer) {
                this.timer = {
                    start: null, // 准备载入数据的监听器
                    progress: null // 载入过程的监听器
                };
            } else {
                clearInterval(this.timer.start);
                clearInterval(this.timer.progress);
            }
            if(this.preload) {
                var _this = this;
                var scope = $(this);
                _this.timer.start = setInterval(function() {
                    if(_this.element.readyState > 1) { // 已经开始接收数据
                        if(_this.autoplay) { // 自动播放则开始播放
                            _this.play();
                        }
                        clearInterval(_this.timer.start);

                        var prePercent = 0;
                        var count = 0;
                        var percent;
                        _this.timer.progress = setInterval(function() { // 进度条加载
                            var durationLoaded = _this.element.buffered.end(_this.element.buffered.length - 1); // 载入时长
                            percent = durationLoaded / _this.element.duration;
                            if(percent != prePercent) {
                                prePercent = percent;
                            } else {
                                count++;
                                if(count == 5) { // 缓存检测
                                    durationLoaded = _this.element.duration;
                                    _this._event.trigger('loaded', [_this]); // 触发载入完成事件
                                    clearInterval(_this.timer.progress);
                                }
                            }
                            _this._event.trigger('progress', [durationLoaded, _this.element.duration, _this]); // 触发载入进度事件
                            if(percent >= 1) { // 大于1表示加载完毕
                                _this._event.trigger('loaded', [_this]); // 触发载入完成事件
                                clearInterval(_this.timer.progress);
                            }
                        }, 32);
                    }
                }, 10);
            }
        }
    };

    /**
     * mp3音乐播放工具，流程包括：
     *     载入mp3（load），触发事件：loadStart, progress, loaded，异常触发：error
     *     播放，触发事件：play, timeupdate
     *     暂停，触发事件：pause
     *     结束，触发事件：ended
     *     跳转，触发事件：skip
     *
     * 当不支持audio播放mp3时，使用flash来播放，该flash内部暴露以下方法：
     *     init: 调用load
     *     load: 载入资源
     *     playPause: 播放/暂停
     *     pplay: 播放
     *     ppause: 暂停
     *     skipTo: 跳转
     *     setVolume: 设置音量
     *     updatePlayhead: 播放进度
     *     loadProgress: 载入进度
     *     loadError: 载入异常
     *     trackEnded: 结束
     * @param params
     */
    var audio = function(params) {
        var _this = this;
        this.status = 0; // 0: 非播放/暂停状态；1: 播放中； 2: 暂停
        this.src = '';
        this._event = $({});
        if(helper.useFlash) {
            this.element = helper.create.flash.call(this, params);
            this.prevPercent = 0; // 上一次播放进度，flash会出现接近100%但是无法到达100%的情况
            this.percentCount = 0; // 相同播放进度累积次数
        } else {
            this.element = helper.create.html5(params);
            $(this.element).bind('timeupdate',function(e) { // 播放进度
                _this._event.trigger('timeupdate', [_this.element.currentTime, _this.element.duration, _this]);
            }).bind('ended',function(e) { // 结束
                    _this._event.trigger('ended', [_this]);
                }).bind('error', function(e) { // 错误
                    if(_this.timer) {
                        clearInterval(_this.timer.start);
                        clearInterval(_this.timer.progress);
                    }
                    _this._event.trigger('error', [_this]);
                });
        }
        if(params && params.src) {
            this.load(params);
        }
    };

    if(helper.useFlash) {
        audio.prototype = {
            constructor: audio,
            /**
             * 载入资源
             * @param params
             */
            load: function(params) {
                helper.loadParams.call(this, params);
                this.element.load(this.src); // 调用flash载入mp3
                this._event.trigger('loadStart', [this]); // 触发开始载入事件
                if(this.autoplay) {
                    this.play();
                }
            },
            /**
             * 此方法提供给flash内部调用
             * 载入开始后的初始化
             * @return {*}
             */
            loadStarted: function() {
                this.element.init(this.src);
                if(this.autoplay) {
                    this.play();
                }
                return this;
            },
            /**
             * 此方法提供给flash内部调用
             * 载入进度
             * @param percent flash提供，已经载入的百分比
             * @param duration flash提供，播放总长度
             */
            loadProgress: function(percent, duration) {
                this.loadedPercent = percent;
                this.duration = duration;
                if(duration != 0) {
                    this._event.trigger('progress', [duration * percent, duration, this]); // 触发载入进度事件
                }
                if(percent >= 1) {
                    this._event.trigger('loaded', [this]); // 触发载入完成事件
                }
                return this;
            },
            /**
             * 此方法提供给flash内部调用
             * 更新播放进度，相当于timeupdate
             * @param percent
             */
            updatePlayhead: function(percent) {
                this._event.trigger('timeupdate', [percent * this.duration, this.duration, this]);
                if(this.prevPercent != percent) {
                    this.prevPercent = percent;
                } else {
                    this.percentCount++;
                    if(this.percentCount > 3) {
                        percent = 1;
                        this._event.trigger('timeupdate', [percent * this.duration, this.duration, this]);
                        this._event.trigger('ended', [this]);
                    }
                }
                return this;
            },
            skipTo: function(percent) {
                percent /= 100;
                if(percent <= this.loadedPercent) {
                    this.element.skipTo(percent); // 调用flash跳转到某个进度
                    this._event.trigger('skip', [percent, this]);
                }
                return this;
            },
            setVolume: function(num) {
                this.element.setVolume(num);
                return this;
            },
            end: function(e) { // 设置结束
                this.skipTo(0);
                this.pause();// 跳到初始位置并暂停
                this._event.trigger('ended', [this]);
                return this;
            },
            loadError: function() { // 载入异常
                this._event.trigger('error', [this]);
                return this;
            }
        };
    } else {
        audio.prototype = {
            constructor: audio,
            /**
             * 载入资源，处理自动预加载和自动播放问题
             * @param params
             *     src: 资源
             *     preload: 预加载
             *     autoplay: 自动播放
             */
            load: function(params) {
                helper.loadParams.call(this, params);
                this.preload ? this.element.setAttribute('preload', 'true') : this.element.removeAttribute('preload');
                this.autoplay ? this.element.setAttribute('autoplay', 'true') : this.element.removeAttribute('autoplay');
                this.element.setAttribute('src', this.src);
                this.element.load();
                helper.progress.call(this); // 调用载入进度
                this._event.trigger('loadStart', [this]); // 触发开始载入事件
                return this;
            },
            skipTo: function(percent) {
                try {
                    this.element.currentTime = this.element.duration * percent / 100; // 设置播放位置
                    this._event.trigger('skip', [percent, this]);
                } catch(e) {}
                return this;
            },
            end: function() {
                this.pause();
                this.skipTo(0);
                this.status = 0;
                this._event.trigger('ended', [this]);
                return this;
            },
            setVolume: function(num) {
                this.element.volume = num / 100;
                return this;
            }
        };
    }
    /**
     * 播放
     */
    audio.prototype.play = function() {
        helper.useFlash ? (this.status != 1 && this.element.pplay()) : this.element.play();
        this.status = 1;
        this._event.trigger('play', [this]); // 触发播放事件，和timeupdate区别是播放中一直触发timeupdate，play仅调用播放时触发一次
        return this;
    };
    /**
     * 暂停
     */
    audio.prototype.pause = function() {
        if(this.status == 1) {
            this.status = 2;
            helper.useFlash ? this.element.ppause() : this.element.pause();
            this._event.trigger('pause', [this]); // 触发暂停事件
        }
        return this;
    };
    /**
     * 切换播放/暂停
     */
    audio.prototype.toggle = function() {
        this.status == 1 ? this.pause() : this.play();
        return this;
    };
    audio.prototype.bind = function() {
        var len = arguments.length;
        if(len == 1) {
            this._event.bind(arguments[0]);
        } else if(len == 2) {
            this._event.bind(arguments[0], arguments[1]);
        }
        return this;
    };
    audio.prototype.unbind = function() {
        var len = arguments.length;
        if(len == 1) {
            this._event.unbind(arguments[0]);
        } else if(len == 2) {
            this._event.unbind(arguments[0], arguments[1]);
        }
        return this;
    };
    return audio;
});