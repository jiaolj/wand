var Base = (function(){
	var _obj = {},
		_init = {}
	;
	return {
		mvvm : function(object){
			//增加或删除active
			object.find('[jui-click="active"]').each(function(k,i){
				var o = $(i),
					obj,
					tar = o.attr('jui-tar'), //点击元素
					to = o.attr('jui-to'), //直接目标元素
					son = o.attr('jui-son'), //子类目标元素
					pr = parseInt(o.attr('jui-prt')) || 0, //父类目标元素
					r = o.attr('jui-repeat'), //是否唯一
					k = o.attr('jui-callback') //回调函数
				;
				if(tar) obj = o.find(tar);
				else obj = o;
				obj.click(function(){
					var ob = $(this),
						prs = ob; //目标元素
					if(to){
						prs = $(to);
					}
					else if(son){
						prs = o.find(son);
					}
					else if(pr>0){
						for(var i=0;i<pr;i++) prs = prs.parent();
					}
					if(!r) o.find(tar+'.active').removeClass('active');
					if(prs.hasClass('active')) prs.removeClass('active');
					else prs.addClass('active');
					_init.callback[k] && _init.callback[k](ob);
				})
			})
			//切换tab切换div
			object.find('[jui-click="change-box"]').each(function(k,i){
				var ts = $(i),
					s = ts.attr('jui-tar'),
					to = ts.attr('jui-to'),
					obj = ts.find(s),
					k = ts.attr('jui-callback') //回调函数
				;
				obj.click(function(){
					var o = $(this),
						i = o.attr('i');
					ts.find('.active').removeClass('active');
					o.addClass('active');
					$('.'+to+'.active').removeClass('active');
					$('.'+to+'[i="'+i+'"]').addClass('active');
					_init.callback[k] && _init.callback[k](o);
				})
			})
		},
		tools : {
			getSize : function(x){
				document.getElementById('html').style.fontSize = document.body.clientWidth*x+'px';
			},
			getRequest : function() {
			   var url = window.location.search; //获取url中"?"符后的字串   
			   var theRequest = new Object();   
			   if (url.indexOf("?") != -1) {   
				  var str = url.substr(1);   
				  strs = str.split("&");   
				  for(var i = 0; i < strs.length; i ++) {
					 theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
				  }   
			   }
			   return theRequest;   
			},
			load : function(url,o,suc){
				$.ajax({
					url : url,
					success : function(temp){
						o.html(temp);
						_obj.mvvm(o);
						suc && suc();
					}
				})
			},
			str_to_int : function(d){
				return (new Date(Date.parse(d.replace(/-/g, "/"))).getTime()+'').substr(0, 10);
			},
			toDouble : function(d){
				if((d+'').length==1) return '0'+d;
				return d;
			},
			addDate : function(dd,dadd){
				var a = new Date(dd)
				a = a.valueOf()
				a = a + dadd * 24 * 60 * 60 * 1000
				a = new Date(a)
				return a;
			},
			past_time : function(d){
				var ntm = parseInt(new Date().getTime()/1000),
					td = ntm - d,
					day = parseInt(td/(3600*24)),
					bk = ''
				;
				if(day>3) bk = day + '天前';
				else if(day>2) bk = '前天';
				else if(day>1) bk = '昨天';
				else{
					var hour = parseInt(td/3600);
					if(hour>1) bk = hour + '小时前';
					else bk = parseInt(td/60) + '分钟前';
					if(parseInt(td/60)==0) bk = td + '秒前';
				}
				return bk;
			},
			sub : function(s,l){
				if(s.length>l) s = s.substring(0,l-3)+'...';
				return s;
			},
			int_to_str : function(d,arg) {
				var dt = new Date(parseInt(d) * 1000)
					back = '';
				if(arg==1) back = this.toDouble(dt.getHours())+':'+this.toDouble(dt.getMinutes());
				else back = dt.getFullYear()+'-'+this.toDouble(dt.getMonth()+1)+'-'+this.toDouble(dt.getDate());
				return back;
			},
			arrayRemove : function(list,s){var lb=[],x = list.indexOf(s);for(var i in list){if(i!=x){lb.push(list[i])}}return lb},
			getQueryString : function(key){
				var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
				var result = window.location.search.substr(1).match(reg);
				return result?decodeURIComponent(result[2]):null;
			},
			getRequest : function() {
				   var url = window.location.search; //获取url中"?"符后的字串   
				   var theRequest = new Object();   
				   if (url.indexOf("?") != -1) {   
					  var str = url.substr(1);   
					  strs = str.split("&");   
					  for(var i = 0; i < strs.length; i ++) {   
						  //就是这句的问题
						 theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]); 
						 //之前用了unescape()
						 //才会出现乱码  
					  }   
				   }   
				   return theRequest;
			}
		},
		turn : {
			is : 0,
			page : 1,
			end : 0,
			getScrollTop : function() {
				var scrollTop = 0; 
				if (document.documentElement && document.documentElement.scrollTop) { 
				scrollTop = document.documentElement.scrollTop; 
				} 
				else if (document.body) { 
				scrollTop = document.body.scrollTop; 
				} 
				return scrollTop; 
			},
			getClientHeight : function() { //获取当前可是范围的高度 
				var clientHeight = 0; 
				if (document.body.clientHeight && document.documentElement.clientHeight) { 
				clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight); 
				} 
				else { 
				clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight); 
				} 
				return clientHeight; 
			},
			getScrollHeight : function() { //获取文档完整的高度 
				return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); 
			},
			get : function(suc){
				window.onscroll = function () { 
					if (_obj.turn.getScrollTop() + _obj.turn.getClientHeight() == _obj.turn.getScrollHeight()) {
						suc && suc();
					} 
				}
			}
		},
		func : function(wd){
			wd.log = function(){for(var arg in arguments) console && console.log(arguments[arg])};
			wd.str = function(d){return JSON && JSON.stringify(d) || d};
			wd.json = function(d){return JSON && JSON.parse(d) || d};
		},
		init : function(init){
			_obj = this;
			_init = init || {};
			_init.callback = init.callback || {};
			_obj.func(window);
			_obj.getSize(_init.size || (100/320));
		}
	}
})();