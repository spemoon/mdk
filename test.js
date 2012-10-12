define(function(require, exports, modules) {
    var $ = require('jquery');
    var image = require('./js/lib/util/core/dom/image.js');

    $(function() {
        var url = 'http://spaceresource.dadunet.com/artweb/20110307092907389.jpg';

        function dataURItoBlob(dataURI) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for(var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var bb = new MozBlobBuilder();
            bb.append(ab);
            return bb.getBlob(mimeString);
        }

        image.load({
            url: url,
            ready: function() {
                console.log('ready');
            },
            load: function() {
                console.log('载入成功，图片宽：' + this.width + '，高：' + this.height);
                console.log(this.type);
                var aFileParts = [this.outerHTML];
                var oMyBlob = new Blob(aFileParts);

                var reader = new FileReader();
                reader.readAsDataURL(oMyBlob);
                reader.onload = function() {
                    console.log(dataURItoBlob(this.result));
                };
            },
            error: function() {
                status.text('载入失败');
            }
        });
    });
});