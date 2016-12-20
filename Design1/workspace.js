function Workspace(parentNode,parentCode){

	var _parentCode=parentCode;
	var _parentNode=parentNode;

	_parentNode.innerHTML='<div class="table"><div class="tr"><div class="td"></div></div></div>';		
	_content=_parentNode.querySelector(".td");

	function _destroy(){
		_parentNode.innerHTML='';
		_parentNode='';
		_parentCode='';
	}
	
	function _render(banner){
		_clear();
		if(!banner || !banner.layers) return;
		var field=_e("div","banner",_content);
		field.style.width=banner.w+"px";
		field.style.height=banner.h+"px";
		var list=banner.layers;
		for(var cnt=0,m=list.length;cnt<m;cnt++){
			var o=list[cnt];
			var ele=null;
			switch(o.type){
				case 'text':
					var ele=_e("a","layer",field);
					ele.innerHTML=o.value;
					ele.style.fontFamily=o.font;
					ele.style.fontSize=o.size+"px";
					ele.style.color=o.color;
				break;
				case 'image':
					var ele=_e("a","layer",field);
					var ico=_e("img","",ele);
					ico.src=o.src;
				break;
			}
 			if(ele){
				ele.style.zIndex=m-cnt;
				ele.style.left=o.left+"px";
				ele.style.top=o.top+"px";
				
//				ele.addEventListener('click',_passEvent,false);
//				ele.addEventListener('dragstart',_dragStart,false);
//				ele.addEventListener('dragend',_dragEnd,false);
			}
		}
	}
	
	function _clear(){
		_content.innerHTML='';
	}
	
	function _mouseDown(){
	}
	
	function _mouseClick(){
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