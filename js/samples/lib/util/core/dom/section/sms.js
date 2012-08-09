define(function(require, exports, module) {
    var helper = require('./helper.js');
    var tpl = {
        sms: require('./tpl/sms.tpl.js')
    };

    return function(node, data, status, params) {
        if(status == 'success') {
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
    };
});