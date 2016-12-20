$.widget("snark.adedit",{
/*core*/
	gdatavar:'adeditdata',
	options:{},
	_create:function(){
		this.page1.init(this);
		this.page2.init(this);
		this.page3.init(this);
		
		this.page1.Activate();
		//this.page3.Activate("googlead",['b240x400']);
	},
	_setOption: function( key, value ) {
        	this._super( key, value );
	},
    _setOptions: function( options ) {
	    this._super( options );
	},
	_destroy:function(){
	},

/*custom*/
	globalVar:function(name,value){
		var g=this.gdatavar;
		if(!window[g]) window[g]={};
		if(value==undefined){
//get		
			value=window[g][name];
		} else {
//set
			window[g][name]=value;
		}
		return value;
	},

	setPage:function(pageid){
		this.element.find('.page').hide();
		switch(pageid){
			case 1:
				this.page1.Activate();
			break;
			case 2:
				serviceid=arguments[1];
				this.page2.Activate(serviceid);
			break;
			case 3:
				serviceid=arguments[1];
				templates=arguments[2];
				this.page3.Activate(serviceid,templates);
			break;
		}
	},

	page1:function(){
		var _plugin=null;
		function _init(plugin){
			_plugin=plugin;
			var place=$(_plugin.element.find('.p1 .buttons')).empty();
			for(var id in bannersData.systems){
				var o=bannersData.systems[id];
				var ele=$('<button type="button" class="btn btn-primary btn-lg btn-block" data-id="'+id+'">'+o.name+'</button>').appendTo(place);
				ele.on('click',_onClick);
			}
		}
		function _onClick(){
			_plugin.setPage(2,$(this).attr("data-id"));
		}
		function _Activate(){
			$(_plugin.element.find('.p1')).show();
		}
		return {
			init:_init,
			Activate:_Activate
		}
	}(),

	page2:function(){
		var _plugin=null;
		var _serviceid='';
		function _init(plugin){
			_plugin=plugin;
			var page=$(_plugin.element.find('.p2'));
			$(page.find('.banner')).on('click',_onClick);
			$(page.find('.btn')).on('click',_onButtonClick);
		}
		function _Activate(serviceid){
			_serviceid=serviceid;
			var serviceData=bannersData.systems[serviceid];
			var page=$(_plugin.element.find('.p2'));
			$(page.find('#title')).html(serviceData.name);
			$(page.find('.banner')).hide().attr('data-sel','');
			for(var cnt=0,m=serviceData.templates.length;cnt<m;cnt++){
				var templateid=serviceData.templates[cnt];
				$(page.find('.banner[data-id="'+templateid+'"]')).show();
			}
			page.show();
		}
		function _onButtonClick(){
			switch($(this).attr("data-btn")){
				case 'back':
					_plugin.setPage(1);
				break;
				case 'fwd':
					var templates=[];
					var page=$(_plugin.element.find('.p2'));
					var arr=(page.find('[data-sel="1"]'));
					for(var cnt=0,m=arr.length;cnt<m;cnt++){
						var a=$(arr[cnt]).attr("data-id");
						if(a) templates.push(a);
					}
					if(templates.length){
						_plugin.setPage(3,_serviceid,templates);
					}
				break;
			}
		}
		function _onClick(){
			if($(this).attr('data-sel')==1){
				$(this).attr('data-sel','');
			} else {
				$(this).attr('data-sel',1);
			}			
		}
		return {
			init:_init,
			Activate:_Activate
		}
	}(),
	
	page3:function(){
		var _plugin=null;
		var _serviceid='';
		var _editors=[];
		function _init(plugin){
			_plugin=plugin;
			var page=$(_plugin.element.find('.p3'));
			$(page.find('.btn')).on('click',_onButtonClick);
		}
		function _Activate(serviceid,templates){
			_serviceid=serviceid;
			var serviceData=bannersData.systems[serviceid];
			var page=$(_plugin.element.find('.p3'));
			$(page.find('#title')).html(serviceData.name);

			var content=$(page.find('.editors')).html('');

			_editors=[];
			for(var cnt=0,m=templates.length;cnt<m;cnt++)
				_editors.push(_Editor(templates[cnt],content));

			page.show();
		}

		function _Editor(templateid,parentobj){
			var _templateid=templateid;
			var _banner={}
			var _container=null;
			var _lastClick='';
			_init(parentobj);

			 function _init(parentobj){
				var tData=bannersData.templates[_templateid];
				_banner={
					name:tData['name'],
					w:tData['w'],
					h:tData['h'],
					texts:[],
					bg:{},
					logo:{}
				}
				for(var cnt=0,m=tData.texts.length;cnt<m;cnt++){
					var loc={};
					for(var o in tData.texts[cnt])
						loc[o]=tData.texts[cnt][o];
					_banner.texts.push(loc);
				}
				for(var o in tData.bg)
					_banner.bg[o]=tData.bg[o];
				for(var o in tData.logo)
					_banner.logo[o]=tData.logo[o];

				if(tData.w>tData.h){
//use landscape template
					_container=$(_plugin.element.find('.templates .editor.landscape')).clone();
				} else {
//use portrait template
					_container=$(_plugin.element.find('.templates .editor.portrait')).clone();
					$(_container.find('.td.banner')).css({"width":tData.w+10});
				}
				_container.attr('data-id',templateid);
				$(_container.find('#title')).html(tData.name);
				$(_container.find('.workarea')).css({"width":tData.w,"height":tData.h});
				$('<div></div>').addClass('logodrag').appendTo(_container.find('.workarea'));
				_container.appendTo(parentobj);
				$(_plugin.element.find('.templates .toolpanels')).clone().appendTo(_container.find('.tools'));

				_renderIcons()

				_render()
			}
			
			function _destroy(){
			}
			
			function _renderIcons(){
				_fillImgs('custom','bg');
				_fillImgs('custom','logo');
				_fillImgs('sys','bg');
				_fillImgs('sys','logo');
			}
			
			function _render(){
				var tData=bannersData.templates[_templateid];
				var workarea=$(_container.find('.workarea'));

//set bg
				_container.find('.bg .ico').attr('data-sel','');
				try {
					var src=tData[_banner.bg.collection].bg[_banner.bg.id]
					workarea.css('background-image','url('+src+')');
					_container.find('.'+_banner.bg.collection+' .bg .ico[data-id="'+_banner.bg.id+'"]').attr('data-sel','1');
				} catch(e){
					workarea.css('background-image','none');
				}				

				_container.find('.logo .ico').attr('data-sel','');
				try {
					var src=tData[_banner.logo.collection].logo[_banner.logo.id]
					workarea.find('.logodrag img').remove();
					$('<img>').attr('src',src).appendTo(workarea.find('.logodrag'));
					_container.find('.'+_banner.logo.collection+' .logo .ico[data-id="'+_banner.logo.id+'"]').attr('data-sel','1');
				} catch(e){
					workarea.find('.logodrag img').remove();
				}				

				workarea.find('.logodrag').draggable({ disabled: (_lastClick!='logo') });

			}

			function _fillImgs(collection,type){
				var obj=$(_container.find('.'+collection+' .'+type+' .icons'));
				obj.find('a').off();
				obj.find('a').remove();
				var arr=bannersData.templates[_templateid][collection][type];
				for(var cnt=0,m=arr.length;cnt<m;cnt++)
					$('<a></a>')
						.attr({
							"data-id":cnt,
							"data-collection":collection,
							"data-type":type
							})
						.addClass('ico')
						.css('backgroundImage','url('+arr[cnt]+')')
						.appendTo(obj)
						.on('click',_setImg);
				return obj;			
			}
			
			function _setImg(){
				var type=$(this).attr('data-type');
				var collection=$(this).attr('data-collection');
				var id=$(this).attr('data-id');
				if(type=='logo' && _banner[type].collection==collection && _banner[type].id==id){
					collection='';
					id=0;
				}
				_banner[type].collection=collection;
				_banner[type].id=id;
				_lastClick=type;
				_render();
			}
			
			return {
				destroy:_destroy
			}
		}

		
		function _onButtonClick(){
			switch($(this).attr("data-btn")){
				case 'back':
					_plugin.setPage(2,_serviceid);
				break;
			}
		}

		return {
			init:_init,
			Activate:_Activate
		}
	}(),
		
	test:function(str){
		console.log("Test catched: "+str);
	}
		
});