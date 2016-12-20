function Listspace(parentNode,parentCode){

	var _bar=_e("div","bar",parentNode);
	var _content=_e("div","content",parentNode);
	var _parentCode=parentCode;

	_bar.addEventListener('selectstart',_selectStart,true);
	_bar.addEventListener('click',_barClick,true);

	_content.addEventListener('selectstart',_selectStart,true);
	_content.addEventListener('mousedown',_mouseDown,true);
	_content.addEventListener('click',_mouseClick,true);

	function _destroy(){
		_clear();
		_bar.removeEventListener('selectstart',_selectStart,true);
		_bar.removeEventListener('click',_barClick,true);

		_content.removeEventListener('selectstart',_selectStart,true);
		_content.removeEventListener('mousedown',_mouseDown,true);
		_content.removeEventListener('click',_mouseClick,true);

		_bar.parentNode.removeChild(_bar);
		_content.parentNode.removeChild(_content);
		
		_bar=null;
		_content=null;
		_parentCode=null;
	}
	
	function _render(banner){
		_clear();
		if(!banner || !banner.layers) return;
		var list=banner.layers;
		for(var cnt=0,m=list.length;cnt<m;cnt++){
			var o=list[cnt];
			var ele=null;
			switch(o.type){
				case 'text':
					var ele=_e("a","layer",_content);
					ele.innerHTML=o.value;
				break;
				case 'image':
					var ele=_e("a","layer",_content);
					var ico=_e("div","ico",ele);
					ico.style.backgroundImage="url("+o.src+")"
				break;
			}
 			if(ele){
				ele.href="#";
				ele.addEventListener('click',_passEvent,false);
				ele.addEventListener('dragstart',_dragStart,false);
				ele.addEventListener('dragend',_dragEnd,false);
			}
		}
	}
	
	function _clear(){
		var list=_content.querySelectorAll(".layer");
		for(var cnt=0,m=list.length;cnt<m;cnt++){
			list[cnt].removeEventListener('click',_passEvent);
			list[cnt].removeEventListener('dragstart',_dragStart);
			list[cnt].removeEventListener('dragend',_dragEnd);
		}
		_content.innerHTML='';
	}
	
	function _mouseDown(){
	}
	
	function _mouseClick(){
	}
	
	function _selectStart(){
	}
	
	function _barClick(){
	}

	function _dragStart(){
	}
	
	function _dragEnd(){
	}

	function _selectStart(e){
		if(!e) e=window.event;
	 	if (e.preventDefault) e.preventDefault(); 
  		if (e.stopPropagation) e.stopPropagation();		
		return false;
	}

	function _passEvent(e){
		if(!e) e=window.event;
		if (e.preventDefault) e.preventDefault();
		return false;	
	}
	
	function _e(tag,cls,parent){
		var o=document.createElement(tag);
		if(cls) o.className=cls;
		if(parent) parent.appendChild(o);
		return o;
	}

	return {
		destroy:_destroy,
		render:_render
	}
};