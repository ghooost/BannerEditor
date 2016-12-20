var layers=function(){
	var banner=null;

	var defData={
		w:240,
		h:400,
		layers:[
			{
				type:"text",
				value:"This is a sample text",
				top:10,
				left:10,
				color:"#ffffff",
				font:"Roboto",
				size:"16"
			},
			{
				type:"text",
				value:"Other text",
				top:60,
				left:10,
				color:"#ff0000",
				font:"Nova Script",
				size:"22"
			},
			{
				type:"image",
				src:"l.jpg",
				top:0,
				left:0
			}
		]
	}

	var listspace=null;
	var workspace=null;

	function _init(strid){
		var o=document.querySelector(strid);
		if(o){
			listspace=Listspace(_e('div','listspace',o));
			workspace=Workspace(_e('div','workspace',o));
			var render=_e('a','renderbutton',o);
			render.innerHTML="Render"
			render.addEventListener('click',_onRender,false);
		}
		_loadData();
	}

	function _loadData(){
//test
		banner=null;
		listspace.render(banner);		
		workspace.render(banner);		
		_onDataLoaded();
	}
	
	function _onDataLoaded(){
		banner=defData;
		listspace.render(banner);		
		workspace.render(banner);		
	}

	function _onRender(){
		canvasrender.render(banner);
	}

	function _e(tag,cls,parent){
		var o=document.createElement(tag);
		if(cls) o.className=cls;
		if(parent) parent.appendChild(o);
		return o;
	}

	return {
		init:_init
	}
}();