var LAZY=(function(){
	var pResizeTimer = null;
	var imgs={};
	function addEventHandler (oTarget, sEventType, fnHandler) {
		if (oTarget.addEventListener) {
			oTarget.addEventListener(sEventType, fnHandler, false);
		} else if (oTarget.attachEvent) {
			oTarget.attachEvent("on" + sEventType, fnHandler);
		} else {
			oTarget["on" + sEventType] = fnHandler;
		}
	};
	function resize(){
		if(pResizeTimer) return '';
		resize_run();
	}
	function resize_run(){
		var min={};
		var max={};
		//min.Top=document.documentElement.scrollTop;

		min.Top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        //min.Top = document.body.scrollTop + document.documentElement.scrollTop;
		min.Left = document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft;
		//min.Left=document.documentElement.scrollLeft;
		max.Top=min.Top+document.documentElement.clientHeight;
		max.Left=min.Left+document.documentElement.clientWidth;

		for(var i in imgs){
			if(imgs[i]){
				var _img=imgs[i];
				var img=document.getElementById(i);
				var width = img.clientWidth;
				var height = img.clientHeight;
				var wh=position(img);
				if(typeof jQuery !=='undefined'){
					wh = jQuery(img).offset();
					wh.Top = wh.top;
					wh.Left = wh.left;
				}			 
				if(
					(wh.Top>=min.Top && wh.Top<=max.Top && wh.Left>=min.Left && wh.Left<=max.Left)
					||
					((wh.Top+height)>=min.Top && wh.Top<=max.Top && (wh.Left+width)>=min.Left && wh.Left<=max.Left))
				{
					//setTimeout("document.getElementById(\""+i+"\").src=\""+_img.src+"\";",100) ;
					(function(imgobj,realsrc){
						setTimeout(
							function() {imgobj.src = realsrc ;}, 100
							) ;
					})(img,_img.src) ;
					delete imgs[i];
				}

			}
		}
	}

	function position(o){
		var p={Top:0,Left:0};
		while(!!o){
			p.Top+=o.offsetTop;
			p.Left+=o.offsetLeft;
			o=o.offsetParent;
		}
		return p;
	}
	
	return {
		init:function(){
			for(var i=0;i<document.images.length;i++){
				var img = document.images[i];
				var config={};
				config.id = img.id;
				config.src = img.getAttribute('_src');
				if(config.src && !config.id){
					config.id = encodeURIComponent(config.src) + Math.random();
					img.id = config.id;
				}
				if(!config.id || !config.src) continue;
				LAZY.push(config);
			}
		},
		push:function(config){
			imgs[config.id] = config;
		},
		run:function(){
			addEventHandler(window,'scroll',resize);
			resize_run();
			//addEventHandler(window,'resize',resize);
		}
	};
})();
