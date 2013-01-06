define(function(require, exports, module) {
    require('../../../../../sample.js');
    var $ = require('jquery');
    var position = require('../../../../../../lib/util/core/dom/position.js');

    $(function() {
        /**--------------------------------------------
         * 实例一：
         * --------------------------------------------*/
        (function() {
            //
            position.pin({
                element: '#tip',
                x: 'center',
                y: 'bottom'
            }, {
                element: '#box',
                x: 'center'
            })
        })();
    });
});
