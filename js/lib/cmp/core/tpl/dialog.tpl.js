define(function(){return {render:function(map) {var p=[],v =[];for(var i in map) {p.push(i);v.push(map[i]);}return (new Function(p, "var _s=[];_s.push(' <div class=\"m-dialog\"> <table class=\"border\"> <tr> <td class=\"nw\"></td> <td class=\"n\"></td> <td class=\"ne\"></td> </tr> <tr> <td class=\"w\"></td> <td class=\"c\"> <div class=\"inner\"> <table class=\"dialog\"> <tr> <td class=\"header\"> <div class=\"titleBar\"> <div class=\"title\">',title,'</div> <a href=\"#\" data-action=\"close\" class=\"close');if(close === false){_s.push(' hide');}_s.push(' \" title=\"关闭\">X</a> </div> </td> </tr> <tr> <td class=\"main\"> <div class=\"content\">',content,'</div> </td> </tr> <tr> <td class=\"footer\"> <div class=\"buttons\"> <button data-action=\"close\">关闭</button> </div> </td> </tr> </table> </div> </td> <td class=\"e\"></td> </tr> <tr> <td class=\"sw\"></td> <td class=\"s\"></td> <td class=\"se\"></td> </tr> </table> </div>'); return _s;")).apply(null, v).join("");}};});