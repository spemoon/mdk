define(function (require, exports, module) {
    var lang = require('../../lang');
    var SWFUpload = require('./swfupload.js');

    /**
     * Queue Error错误码
     * SWFUpload.QUEUE_ERROR = {
     *     QUEUE_LIMIT_EXCEEDED : -100, // 文件数超过限定
     *     FILE_EXCEEDS_SIZE_LIMIT : -110, // 文件大小超过限定
     *     ZERO_BYTE_FILE : -120, // 存在空文件
     *     INVALID_FILETYPE : -130 // 存在不允许类型文件
     * };
     * file object 结构：文件属性，很多处理事件都会传递一个File Object参数来访问该文件的相关属性
     * {
     *     id : string, // SWFUpload控制的文件的id,通过指定该id可启动此文件的上传、退出上传等
     *     index : number, // 文件在选定文件队列（包括出错、退出、排队的文件）中的索引，getFile可使用此索引
     *     name : string, // 文件名，不包括文件的路径。
     *     size : number, // 文件字节数
     *     type : string, // 客户端操作系统设置的文件类型
     *     creationdate : Date, // 文件的创建时间
     *     modificationdate : Date, // 文件的最后修改时间
     *     filestatus : number // 文件的当前状态，对应的状态代码可查看SWFUpload.FILE_STATUS
     * }
     *
     * status object 结构：上传队列的状态信息，访问实例的getStats方法可获取此对象
     * {
     *     in_progress : number // 值为1或0，1表示当前有文件正在上传，0表示当前没有文件正在上传
     *     files_queued : number // 当前上传队列中存在的文件数量
     *     successful_uploads : number // 已经上传成功（uploadSuccess触发）的文件数量
     *     upload_errors : number // 已经上传失败的文件数量 (不包括退出上传的文件)
     *     upload_cancelled : number // 退出上传的文件数量
     *     queue_errors : number // 入队失败（fileQueueError触发）的文件数量
     * }
     */
    var config = {
        // 配置参数
        flash_url:seajs.pluginSDK.util.dirname(module.uri) + 'swfupload.swf', // flash地址，一个绝对的或者相对于SWF文件的完整URL。推荐使用完整的绝对路径，以避免由浏览器和FlashPlayer修改了基准路径设置而造成的请求路径错误
        upload_url:'', // 上传地址
        file_post_name:'upfile', // 该参数设置了POST信息中上传文件的name值,在Linux下面此参数设置无效，接收的name总为Filedata，因此为了保证最大的兼容性，建议此参数使用默认值。
        post_params:{}, // 包含值对的object类型数据，每个文件上传的时候，其中的值对都会被一同发送到服务端,值只能是字符串或者数字
        use_query_string:false, // 该属性可选值为true和false，设置post_params是否以GET方式发送。如果为false，那么则以POST形式发送
        requeue_on_error:false, // 如果设置为true，当文件对象发生uploadError时（除开fileQueue错误和FILE_CANCELLED错误），该文件对象会被重新插入到文件上传队列的前端，而不是被丢弃。如果需要，重新入队的文件可以被再次上传。如果要从上传队列中删除该文件对象，那么必须使用cancelUpload方法
        http_success:[], // 该数组可自定义触发success事件的HTTP状态值。200的状态值始终会触发success，并且只有200的状态会提供serverData。
        file_types:'*.jpg;*.gif;*.png;*.jpeg;*.bmp;*.JPG;*.GIF;*.PNG;*.JPEG;*.BMP', // 设置文件选择对话框的文件类型过滤规则，该属性接收的是以分号分隔的文件类型扩展名，例如“ *.jpg;*.gif”，则只允许用户在文件选择对话框中可见并可选jpg和gif类型的文件。默认接收所有类型的文件
        file_types_description:'选择图片', // 设置文件选择对话框中显示给用户的文件描述。
        file_size_limit:'5MB', // 设置文件选择对话框的文件大小过滤规则，该属性可接收一个带单位的数值，可用的单位有B,KB,MB,GB。如果忽略了单位，那么默认使用KB。特殊值0表示文件大小无限制
        file_upload_limit:40, // 设置SWFUpload实例允许上传的最多文件数量，同时也是设置对象中file_queue_limit属性的上限。一旦用户已经上传成功或者添加文件到队列达到上最大数量，那么就不能继续添加文件了。特殊值0表示允许上传的数量无限制。只有上传成功（上传触发了uploadSuccess事件）的文件才会在上传数量限制中记数。使用setStats方法可以修改成功上传的文件数量
        file_queue_limit:40, // 设置文件上传队列中等待文件的最大数量限制。当一个文件被成功上传，出错，或者被退出上传时，如果文件队列中文件数量还没有达到上限，那么可以继续添加新的文件入队，以顶替该文件在文件上传队列中的位置。如果允许上传的文件上限（file_upload_limit）或者剩余的允许文件上传数量小于文件队列上限（file_queue_limit），那么该值将采用这个更小的值
        prevent_swf_caching:true, // 该布尔值设置是否在Flash URL后添加一个随机值，用来防止浏览器缓存了该SWF影片。这是为了解决一些基于IE-engine的浏览器上的出现一个BUG
        debug:false, // 设置debug事件是否被触发
        button_placeholder_id:'', // 该必要参数指定了swfupload.swf将要替换的页面内的DOM元素的ID值。当对应的DOM元素被替换为SWF元素时，SWF的容器会被添加一个名称为"swfupload"的样式选择器供CSS自定义使用
        button_image_url:'', // 可以设置一个相对于该swf文件或者是绝对地址的图片（或者是SWF），作为按钮的UI展现。所有FLASH支持的图片类型都可以使用（gif,jpg,png,或者是一个SWF）。该按钮图片需要经过一定规则（CSS Sprite）的处理。按钮图片中需要包括按钮的4个状态，从上到下依次是normal, hover, down/click, disabled
        button_width:24, // 设置该SWF的宽度属性
        button_height:25, // 设置该SWF的高度属性（按钮图片高度的1/4）
        button_text:'', // 设置Flash Button中显示的文字，支持HTML。HTML文本的样式可以通过CSS选择器并配合button_text_style参数来设置
        button_text_style:'', // 此参数配合button_text参数，可以通过CSS样式来设置Flash Button中的文字样式
        button_text_top_padding:2, // 设置Flash Button上文字距离顶部的距离，可以使用负值
        button_text_left_padding:2, // 设置Flash Button上文字距离左侧的距离，可以使用负值
        button_action:SWFUpload.BUTTON_ACTION.SELECT_FILES, // 设置Flash Button点击以后的动作。默认为SWFUpload.BUTTON_ACTION.SELECT_FILES，点击按钮将会打开多文件上传的对话框。如果设置为SWFUpload.BUTTON_ACTION.SELECT_FILE，则为单文件上传。如果设置为SWFUpload.BUTTON_ACTION.START_UPLOAD，则启动文件上传
        button_disabled:false, // 设置Flash Button是否是禁用状态。当它处于禁用状态的时候，点击不会执行任何操作
        button_cursor:SWFUpload.CURSOR.ARROW, // 设置鼠标划过Flash Button时的光标状态。默认为SWFUpload.CURSOR.ARROW，如果设置为SWFUpload.CURSOR.HAND，则为手形
        button_window_mode:SWFUpload.WINDOW_MODE.TRANSPARENT, // 设置浏览器具体以哪种模式显示该SWF影片, 包括： SWFUpload.WINDOW_MODE.WINDOW是默认的模式. 该SWF将位于页面元素的最高层级。SWFUpload.WINDOW_MODE.OPAQUE　该SWF可以被页面类的其他元素通过层级的设置来覆盖它。SWFUpload.WINDOW_MODE.TRANSPARENT 该SWF的背景是透明的，可以透过它看到背后的页面元素
        custom_settings:{} // 接收一个Object类型数据，可用于安全地存储与SWFUpload实例关联的自定义信息，例如属性和方法，而不用担心跟SWFUpload内部的方法和属性冲突以及版本升级的兼容.设置完毕以后，可以通过实例的customSettings属性来访问
    };

    /**
     * 构造参数说明：
     * multi： 是否允许多文件上传，默认允许，只有强制设置未false才是单个上传 --->button_action
     * id：触发上传的dom节点ID --->button_placeholder_id
     * img： flash背景图片 --->button_image_url
     * text： flash上的文字 --->button_text
     * type：允许上传的类型，默认是图片 --->file_types
     * desc：上传文件类型描述 --->file_types_description
     * size：文件大小限制 --->file_size_limit
     * limit：文件个数限制 --->file_upload_limit
     * width：按钮宽度 --->button_width
     * height：按钮高度 --->button_height
     * url: 上传地址 --->upload_url
     * flash: flash地址 --->flash_url
     *
     * 回调函数说明：
     * flashLoaded： 载入flash后触发
     * dialogStart： 弹出选择文件对话框之前触发
     * successAdd(file)： 选择文件对话框消失时，文件成功加入队列时触发，每个文件加入成功都会触发
     * overLimit(n): 超过上传限制数量
     * errorAdd(file, code, message)： 选择文件对话框消失时，文件加入队列失败时触发，每个文件加入失败都会触发
     * dialogComplete(n1, n2): 选择文件完成后触发（无论成功失败）
     * uploadStart(file): 上传文件到服务端之前的事件，可以在这里做最后的验证，曾删改post数据等, 如果该function返回false，则不会上传该文件，同时触发uploadError
     * process(file, bytes, total): 上传文件过程中定时触发，一般用来做进度条等即时反馈, bytes 该文件已经上传的字节数, total 该文件的总字节数
     * error(file, code, message): 文件上传失败时或者被终止时触发，引起的可能性有：上传地址不存在/主动终止，退出/upload_start_handler返回false/HTTP错误/IO错误/文件数目超过限制
     * success(file, data): 文件成功上传时触发，文件上传途中不能开始下一个文件上传
     * complete(file): 当在进行多文件上传的时候，中途用cancelUpload取消了正在上传的文件，或者用stopUpload停止了正在上传的文件，那么在uploadComplete中就要很小心的使用this. startUpload()，因为在上述情况下，uploadError和uploadComplete会顺序执行，因此虽然停止了当前文件的上传，但会立即进行下一个文件的上传，你可能会觉得这很奇怪，但事实上程序并没有错。如果你希望终止整个队列的自动上传，那么你需要做额外的程序处理了。
     * debug(message): 如果debug setting设置为true，那么页面底部会自动添加一个textArea， SWFUpload库和Flash都会调用此事件来在页面底部的输出框中添加debug信息供调试使用
     */
    var upload = function (params) {
        var settings = {};
        var _this = this;
        params = params || {};
        settings.upload_url = params.url; // 上传地址，必须配置
        settings.flash_url = params.flash;
        settings.file_post_name = params.fileName;
        settings.post_params = params.data;
        settings.button_placeholder_id = params.id; // 替换的DOM节点id，必须配置
        settings.button_action = params.multi === false ? SWFUpload.BUTTON_ACTION.SELECT_FILE : SWFUpload.BUTTON_ACTION.SELECT_FILES; // 是否允许多文件上传，默认true
        settings.button_image_url = params.img; // 按钮背景图片
        settings.button_text = params.text; // 按钮文本
        settings.file_types = params.type; // 可允许上传类型
        settings.file_types_description = params.desc; // 描述
        settings.file_size_limit = params.size; // 文件大小限制
        if (params.limit) { // 上传数量限制
            settings.file_upload_limit = params.limit;
            settings.file_queue_limit = params.limit;
        }
        settings.button_width = params.width; // 按钮宽
        settings.button_height = params.height; // 按钮高

        // 回调函数
        // 该事件函数是内部事件，因此不能被重写。当SWFupload实例化，加载的FLASH完成所有初始化操作时触发此事件
        settings.swfupload_loaded_handler = function () {
            _this.loaded = true;
            params.flashLoaded && params.flashLoaded.call(_this);
            if(_this.disabled) {
                _this.disable();
            }
        };
        // 弹出选择文件对话框之前触发，该对话框单例模式
        settings.file_dialog_start_handler = function () {
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
            params.dialogStart && params.dialogStart.call(_this);
        };
        // 选择文件对话框消失时，文件成功加入队列时触发，每个文件加入成功都会触发
        settings.file_queued_handler = function (file) {
            (file && params.successAdd) && params.successAdd.call(_this, file);
        };
        // 选择文件对话框消失时，文件加入队列失败时触发，每个文件加入失败都会触发，加入队列失败的原因可能：文件大小限制，文件为0，超过文件队列限制，无效文件类型等
        settings.file_queue_error_handler = function (file, code, message) {
            if (code == SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                params.overLimit && params.overLimit.call(_this, settings.file_queue_limit);
            } else if (code == SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT) {
                params.overSize && params.overSize.call(_this, params.size || config.file_size_limit, file);
            } else if (code == SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE) {
                params.zeroSize && params.zeroSize.call(_this, file);
            } else if (code == SWFUpload.QUEUE_ERROR.INVALID_FILETYPE) {
                params.notAllowType && params.notAllowType.call(_this, file);
            }
            params.errorAdd && params.errorAdd.call(_this, file, code, message);
        };
        // 选择文件完成后触发（无论成功失败），如果要做自动上传，可以在这里调用this.startUpload() (事先最好判断是否满足上传条件)
        settings.file_dialog_complete_handler = function (n1, n2) {
            this.startUpload();
            params.dialogComplete && params.dialogComplete.call(_this, n2, n1);
        };
        // 上传文件到服务端之前的事件，可以在这里做最后的验证，曾删改post数据等, 如果该function返回false，则不会上传该文件，同时触发uploadError
        settings.upload_start_handler = function (file) {
            (file && params.uploadStart) && params.uploadStart.call(_this, file);
        };
        // 上传文件过程中定时触发，一般用来做进度条等即时反馈, bytes 该文件已经上传的字节数, total 该文件的总字节数
        settings.upload_progress_handler = function (file, bytes, total) {
            (file && params.progress) && params.progress.call(_this, file, bytes, total);
        };
        // 文件上传失败时或者被终止时触发，引起的可能性有：上传地址不存在/主动终止，退出/upload_start_handler返回false/HTTP错误/IO错误/文件数目超过限制
        settings.upload_error_handler = function (file, code, message) {
            (file && params.error) && params.error.call(_this, file, code, message);
        };
        // 文件成功上传时触发，文件上传途中不能开始下一个文件上传
        settings.upload_success_handler = function (file, data) {
            (file && params.success) && params.success.call(_this, file, data);
        };
        // 一个文件完成了一个上传周期，无论是成功(uoloadSuccess触发)还是失败(uploadError触发)，此事件都会被触发，这也标志着一个文件的上传完成，可以进行下一个文件的上传了
        // 当在进行多文件上传的时候，中途用cancelUpload取消了正在上传的文件，或者用stopUpload停止了正在上传的文件，那么在uploadComplete中就要很小心的使用this. startUpload()，因为在上述情况下，uploadError和uploadComplete会顺序执行，因此虽然停止了当前文件的上传，但会立即进行下一个文件的上传，你可能会觉得这很奇怪，但事实上程序并没有错。如果你希望终止整个队列的自动上传，那么你需要做额外的程序处理了。
        settings.upload_complete_handler = function (file) {
            this.startUpload(); // 开启下一个上传
            var stats = _this.obj.getStats();
            stats = stats || {};
            if (!stats.in_progress && stats.files_queued == 0) {
                params.complete && params.complete.call(_this, file);
            }
            (file && params.finish) && params.finish.call(_this, file);
        };
        // 如果debug setting设置为true，那么页面底部会自动添加一个textArea， SWFUpload库和Flash都会调用此事件来在页面底部的输出框中添加debug信息供调试使用
        settings.debug_handler = function (message) {
            params.debug && params.debug.call(_this, message);
        };
        for (var i in config) {
            if (lang.isUndefined(settings[i])) {
                settings[i] = config[i];
            }
        }
        this.obj = new SWFUpload(settings);
        params.afterInit && params.afterInit.call(this); // 初始化后的接口
    };
    upload.prototype = {
        constructor:upload,
        /**
         * 移除一个上传元素
         * @param index
         */
        remove:function (index, callback) {
            var stats = this.obj.getStats();
            stats.successful_uploads--;
            this.obj.setStats(stats);
            callback && callback.call(this);
        },
        reset:function (callback) {
            var swf = this.obj;
            //if (this.loaded) {
                var stats = swf.getStats();
                stats = stats || {};
                if (stats.in_progress) { // 有正在上传的终止上传
                    swf.stopUpload();
                }
                stats.successful_uploads = 0;
                stats.upload_errors = 0;
                stats.upload_cancelled = 0;
                stats.queue_errors = 0;
                swf.setStats(stats);
            //}
            this.enable();
            callback && callback.call(this);
            return this;
        },
        disable: function() {
            var swf = this.obj;
            this.disabled = true;
            //if (this.loaded) {
                swf.setButtonDisabled(true);
           // }
            return this;
        },
        enable: function() {
            var swf = this.obj;
            this.disabled = false;
            //if (this.loaded) {
                swf.setButtonDisabled(false);
            //}
            return this;
        }
    };

    module.exports = upload;
});