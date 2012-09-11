###ajax.js  —— ajax连接池相关处理###
|--- setLoginPage             设置登录页面的URL，该方法最多调用一次 
|--- setNoPermissionAction    设置无权限时候的默认动作，默认是跳转到登录页面，该方法最多调用一次 
|--- setErrorAction 
|--- base                     基类ajax
|--- pool                     构建ajax连接池，存放在pool中(保证多个ajax请求处理的顺序) 
|--- single                   AJAX单例模式 

###array.js —— 数组扩展### 
|--- indexOf                  查找数组中是否存在某个值
|--- forEach                  遍历一个数组，每个元素执行callback，callback作用域是scope 

###date.js —— 日期工具类### 
|--- isLeap                   判断是否是闰年
|--- check                    检测是否是一个符合格式的日期字符串 
|--- compare                  比较两个日期的前后顺序 
|--- stringCompare            比较两个日期字符串的前后顺序 
|--- stringToDate             字符串转化为日期对象 
|--- format                   格式化日期,将日期对象按照需要的格式输出 
|--- distance                 距离给定的date的n个时间的日期 

###lang.js —— lang工具类###
|--- isUndefined
|--- isString
|--- isArray
|--- isFunction
|--- extend                   继承
|--- callback
|--- timer                    定时器

###regexp.js—— 正则
|--- trim 
|--- serialize                将对象转化成url格式的字符串(序列化) 
|--- parseJSON 
|--- blength                  返回字符串的长度,全角字符算两个长度 
|--- cut                      从字符串的左边或者右边截取需要长度的字符串(默认左边) 
|--- code                     将html标签的字符串转义(或者将转义后的转回来) 
|--- content                  解析字符串为可读格式：先转义标签为实体，然后解析空格和换行，最后解析链接 
