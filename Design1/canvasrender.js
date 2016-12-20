canvasrender=function(){
	var _images=[];
	var _canvas=null;
	var _context=null;
	var _curLayer=0;
	var _banner=null;
	
	function _render(banner){

		_banner=banner;
		_curLayer=_banner.layers.length-1;

		_canvas=document.createElement('canvas');
		_canvas.setAttribute("width",_banner.w);
		_canvas.setAttribute("height",_banner.h);
		
		_context=_canvas.getContext("2d");
		_renderLayer();		
	}

	function _renderLayer(){
		if(_curLayer<0){
			_finishRender();
			return;
		}
		var o=_banner.layers[_curLayer];
		switch(o.type){
			case 'text':
				_context.fillStyle=o.color;
				_context.font=o.size+"px "+o.font;
				_context.fillText(o.value,o.left,o.top);
				_curLayer--;
				_renderLayer();
			break;
			case 'image':
				var i=new Image();
				i.addEventListener("load",_onImgLoad,false);
				i.src=o.src;
				_images.push(i);
			break;
		}
	}
		
	function _onImgLoad(){
			canvasrender.drawImage(this);	
	}
	function _drawImage(img){
		var o=_banner.layers[_curLayer];
		_context.drawImage(img,o.left,o.top);
		_curLayer--;
		_renderLayer();
	}
	
	function _finishRender(){
		var dataURL = _canvas.toDataURL();
		var o=_e('div','renderresults',document.body);
		o.innerHTML='<div class="table"><div class="tr"><div class="td"></div></div></div>';
		var td=o.querySelector('.td');
		var img=_e('img','',td);
		img.src=dataURL;
		var close=_e('a','close',o);
		close.addEventListener('click',_closeResults,false);
		_clear();
	}

	function _closeResults(){
		var o=document.querySelector('.renderresults');
		var i=o.querySelector('.close');
		i.removeEventListener('click',_closeResults);
		o.innerHTML='';
		o.parentNode.removeChild(o);
	}
	function _clear(){
		for(var cnt=0,m=_images.length;cnt<m;cnt++){
			_images[cnt].removeEventListener("load",_onImgLoad);
			_images[cnt]=null;
		}
		_images=[];
		_context=null;
		_canvas=null;
	}

	function _e(tag,cls,parent){
		var o=document.createElement(tag);
		if(cls) o.className=cls;
		if(parent) parent.appendChild(o);
		return o;
	}

	return {
		render:_render,
		drawImage:_drawImage
	}
}();