define(function(){return {render:function(map) {var p=[],v =[];for(var i in map) {p.push(i);v.push(map[i]);}return (new Function(p, "var _s=[];_s.push(' <div class=\"post\"> <a class=\"avatar\" href=\"',baseurl,user.id,'\"> <img height=\"32\" width=\"32\" src=\"',user.avatar,'\"> </a> <div class=\"post-form\"> <textarea class=\"ipt-0\" data-at=\"1\"></textarea> <div class=\"post-opt\"> <a data-action=\"face\" class=\"face-btn\" href=\"#\"></a> <span class=\"quick-send\">快捷键：ctrl+enter</span> <div class=\"m-button m-button-small m-button-dis\" tabindex=\"1\">评论</div> </div> </div> </div>'); return _s;")).apply(null, v).join("");}};});