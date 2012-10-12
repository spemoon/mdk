define(function(require, exports, module) {
    require('../../../../../../sample.js');
    var $ = require('jquery');
    // var xxx = require('{../../../../../../../../js/}');
    var upload = require('../../../../../../../lib/util/core/dom/html5/upload.js');

    $(function() {
        /**--------------------------------------------
         * 实例1：
         * --------------------------------------------*/
        (function() {
            var u1 = new upload({
                url: 'upload.php',
                container: document.getElementById('upload_box'),
                fileType: 'jpg, gif',
                beforeAdd: function(file, files) {
                    var size = file.size;
                    var flag = true;
                    if(size == 0) {
                        flag = false;
                        console.log(file, '空文件');
                    } else if(size > 1024 * 1024 * 50) {
                        flag = false;
                        console.log(file, '大于50M');
                    }
                    return flag;
                },
                filter: function(files, fileList) {
                    if(files.length + this.successList.length > 10) {
                        alert('文件上传不能超过10个');
                        return false;
                    }
                }
            });

            $(u1).bind({
                dragenter: function(event, e, files, fileList) {
                    console.log('dragenter');
                },
                dragover: function(event, e, files, fileList) {
                    //console.log('dragover');
                },
                dragleave: function(event, e, files, fileList) {
                    console.log('dragleave');
                },
                drop: function(event, e, files, fileList) {
                    console.log('drop', files);
                },
                successAdd: function(event, file, files) {
                    console.log('successAdd', file);
                    u1.upload();
                },
                failureAdd: function(event, file, files) {
                    console.log('failureAdd', file);
                },
                progress: function(event, e, file, loaded, total) {
                    console.log('progress', file, loaded / total);
                },
                success: function(event, file, data) {
                    console.log('success', file, data);
                },
                failure: function(event, file, data) {
                    console.log('failure', file, data);
                },
                error: function(event, file, data) {
                    console.log('error', file, data);
                },
                complete: function(event, file) {
                    console.log('complete');
                }
            });

        })();
    });
});
