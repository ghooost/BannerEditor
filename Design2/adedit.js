$.widget("snark.adedit",{
/*core*/
	gdatavar:'adeditdata',
	options:{},
	_create:function(){
		this.page1.init(this);
		this.page2.init(this);
		this.page3.init(this);

		bannersData.images=[];
			for(var o in bannersData.templates)
				if(bannersData.templates[o]){
					var tData=bannersData.templates[o];
					this.imageCollectionAdd(tData.sys.bg);
					this.imageCollectionAdd(tData.sys.logo);
					this.imageCollectionAdd(tData.custom.bg);
					this.imageCollectionAdd(tData.custom.logo);
				}

		this.checkCollectionsLoaded();
	},

	checkCollectionsLoaded:function(){
		var imgs=bannersData.images;
		for(var cnt=0,m=imgs.length;cnt<m;cnt++)
			if(!imgs[cnt].loaded){
				setTimeout($.proxy(this.checkCollectionsLoaded,this),100);
				return;
			}
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

	imageCollectionAdd:function(arr){
		for(cnt=0,m=arr.length;cnt<m;cnt++)
			arr[cnt]=this.imageAdd(arr[cnt]);
	},
	
	imageAdd:function(src){
		var img=new Image();
		bannersData.images.push({
			img:img,
			loaded:false
		});
		var cnt=bannersData.images.length-1;
 	 	$(img).on('load',function(){
			var w=this.width;
			var h=this.height;
			bannersData.images[cnt].loaded=true;
			bannersData.images[cnt].width=w;
			bannersData.images[cnt].height=h;
			var canvas=$('<canvas></canvas>').attr({
					width:w,
					height:h
				});
			try {
				var context=canvas.get(0).getContext("2d");
				context.drawImage(this,0,0);
				this.src=canvas.get(0).toDataURL();
			} catch (e){
				console.log(e.message);
			}
			$(this).off();
 	 	});
		img.src=src;
		return cnt;
	},

	globalVar:function(name,value){
		var g=this.gdatavar;
		if(!window[g]) window[g]={};
		if(value===undefined){
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
			for(var id in bannersData.systems)
				if(bannersData.systems[id]){
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
		};
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
		};
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

/*******************
Editor instance
********************/
		function _Editor(templateid,parentobj){
			var _templateid=templateid;
			var _banner={};
			var _container=null;
			var _activeLayer=-1;
			var _layers=[];
			
			//var _BGCOLORID=0;
			var _BGID=1;
			var _LOGOID=2;
			var _TXTSTART=3;
			
			_initEditor(parentobj);

			 function _initEditor(parentobj){
				var o='';
				var tData=bannersData.templates[_templateid];
				_banner={
					name:tData.name,
					w:tData.w,
					h:tData.h,
					texts:[],
					bg:{},
					logo:{}
				};
				for(var cnt=0,m=tData.texts.length;cnt<m;cnt++){
					var loc={};
					for(o in tData.texts[cnt])
						if(tData.texts[cnt])
							loc[o]=tData.texts[cnt][o];
					_banner.texts.push(loc);
				}
				for(o in tData.bg)
					if(tData.bg[o])
						_banner.bg[o]=tData.bg[o];
				for(o in tData.logo)
					if(tData.logo[o])
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
				$('<div></div>').addClass('bgcontainer').appendTo(_container.find('.workarea'));
				$('<div></div>').addClass('logocontainer').appendTo(_container.find('.workarea'));
				
				_container.appendTo(parentobj);
				$(_plugin.element.find('.templates .toolpanels')).clone().appendTo(_container.find('.tools'));

				_container.find('[data-btn="newlogo"]').on('click',_newImgStart);
				_container.find('[data-btn="newbg"]').on('click',_newImgStart);
				_container.find('#newimg').on('change',_newImgChoose);
				
				_renderIcons();

				_render();
			}
			
			function _setActiveLayer(cnt){
				_activeLayer=cnt;
				_render();
			}
			
			function _newImgStart(){
				_container.find('#newimg')[0].form.reset();
				$(_container.find('#newimg')).attr("data-type",$(this).attr('data-type')).click();
			}

			function _newImgChoose(){
				if(this.files.length){
					var type=$(this).attr('data-type');
					var collection='custom';
					var i=_plugin.imageAdd(
							window.URL.createObjectURL(this.files[this.files.length-1])
					);
					bannersData.templates[_templateid][collection][type].push(i);
					_renderIcons();

					_setImg(i,type);
					_render();
				}
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

//mark selected icons
				_container.find('.ico').attr('data-sel','');
				if(_banner.bg.id)
					_container.find('.ico[data-id="'+_banner.bg.id+'"]').attr('data-sel','1');
				if(_banner.logo.id)
					_container.find('.ico[data-id="'+_banner.logo.id+'"]').attr('data-sel','1');


				var bgImg=(_banner.bg.id!==undefined)?bannersData.images[_banner.bg.id]:{loaded:true};
				var logoImg=(_banner.logo.id!==undefined)?bannersData.images[_banner.logo.id]:{loaded:true};

//if images aren't loaded - try to wait a bit
				if(!bgImg.loaded || !logoImg.loaded)
					return setTimeout($.proxy(_render,this),100);

				//var tData=bannersData.templates[_templateid];
				var workarea=$(_container.find('.workarea'));
				workarea.empty();
				var layers=$(_container.find('.layers'));
				layers.empty();

//buuld layers
				//_layers=[_layerBgColor(_banner,_BGCOLORID,_activeLayer)];
				_layers=[];
//				if(_banner.bg.id)
				_layers.push(_layerBg(_banner.bg,_BGID,_activeLayer));
				if(_banner.logo.id)
					_layers.push(_layerLogo(_banner.logo,_LOGOID,_activeLayer));

				for(var cnt=0,m=_banner.texts.length;cnt<m;cnt++)
					_layers.push(_layerText(_banner.texts[cnt],cnt+_TXTSTART,_activeLayer));
				
				for(cnt=0,m=_layers.length;cnt<m;cnt++){
					_layers[cnt].render(workarea);
					_layers[cnt].renderItem(layers);
				}

				if(_activeLayer>-1){
//there is an active layer, let's drag it!
					var draggableLayer=$(workarea.find('[data-id="'+_activeLayer+'"]'));
					if(draggableLayer.length && draggableLayer.attr('data-draggable')){
						var dPosition=draggableLayer.position();
						$('<div></div>')
							.addClass('dragger')
							.draggable({
								drag: function( event, ui ) {
									var top=dPosition.top+ui.position.top;
									var left=dPosition.left+ui.position.left;
									draggableLayer.css({
										left:left,
										top:top
									});
								},
								stop: function( event, ui ) {
									var top=dPosition.top+ui.position.top;
									var left=dPosition.left+ui.position.left;
									draggableLayer.css({
										left:left,
										top:top
									});
									var id=draggableLayer.attr('data-id');
									if(id==_BGID){
										_banner.bg.top=top;
										_banner.bg.left=left;
									} else if(id==_LOGOID){
										_banner.logo.top=top;
										_banner.logo.left=left;									
									} else {
										_banner.texts[id-_TXTSTART].top=top;
										_banner.texts[id-_TXTSTART].left=left;
									}
									//console.log(_banner);
									_render();
								}
							})
							.appendTo(workarea);
						$('<span class="glyphicon glyphicon-move" aria-hidden="true"></span>').appendTo($('<div class="dragicon"></div>').appendTo(workarea));
					}
				}
			}

			function _fillImgs(collection,type){
				var obj=$(_container.find('.'+collection+' .'+type+' .icons'));
				obj.find('a').off();
				obj.find('a').remove();
				var imgs=bannersData.images;
				var arr=bannersData.templates[_templateid][collection][type];
				for(var cnt=0,m=arr.length;cnt<m;cnt++)
					$('<a></a>')
						.attr({
							"data-id":arr[cnt],
							"data-type":type
							})
						.addClass('ico')
						.css('backgroundImage','url('+imgs[arr[cnt]].img.src+')')
						.appendTo(obj)
						.on('click',_onIcoClick);
				return obj;			
			}
			
			function _onIcoClick(){
				var id=$(this).attr('data-id');
				var type=$(this).attr('data-type');
				_setImg(id,type);
			}
			
			function _setImg(id,type){
				if(_banner[type].id==id){
//switch off on click on active
					_banner[type]={};				
//drop selection if it isn't a bg layer
					if(type!='bg'){
						_activeLayer=-1;
					} else {
						_activeLayer=_BGID;
					}
				} else {
					_banner[type].id=id;

					switch(type){
						case 'bg':
							_activeLayer=_BGID;
						break;
						case 'logo':
							_activeLayer=_LOGOID;
						break;
					}
				}
 				_render();
			}
			function _layerBg(data,cnt,activeLayer){
				var _data=data;
				var _cnt=cnt;
				var _isActive=(cnt==activeLayer);
				var _img=null;
				function _renderItem(container){
					var item=$('<div></div>')
						.addClass('layer')
						.html('Фон')
						.attr('data-id',_cnt)
						.appendTo(container);

					if(_isActive){
						item.attr('data-sel',1);
						if(_data.id){
							$('<div></div>').addClass('scaleslide').appendTo(item).slider({
      							orientation: "horizontal",
				    			range: "min",
      							max: 100,
      							min: 1,
      							value: _data.scale,
      							slide: _scale,
      							change: _scale
							});
						}
					} else {
						item.on('click',function(){
							_setActiveLayer(_cnt);
						});
					}
				}
				function _scale(){
					_data.scale=$(this).slider( "value");	
					_img.css({
						'transform': 'scale('+_data.scale/100+')'
					});
				}
				function _render(container){
					if(!_data.scale) _data.scale=100;

					if(_data.id && bannersData.images[data.id])
						_img=$(bannersData.images[data.id].img).clone()
							.css({
								'transform': 'scale('+_data.scale/100+')'
							})
							.appendTo(
								$('<div></div>')
								.attr({'data-id':_cnt,'data-draggable':1})
								.addClass('layer')
								.css({
									'z-index':_cnt,
									'top':_data.top+'px',
									'left':_data.left+'px'
									})
								.appendTo(container)
						);
				}
				return {
					renderItem:_renderItem,
					render:_render
				};
			}

			function _layerLogo(data,cnt,activeLayer){
				var _data=data;
				var _cnt=cnt;
				var _isActive=(cnt==activeLayer);
				var _img=null;
				function _renderItem(container){
					var item=$('<div></div>')
						.addClass('layer')
						.html('Лого')
						.attr('data-id',_cnt)
						.appendTo(container);

					if(_isActive){
						item.attr('data-sel',1);
						if(_data.id){
							$('<div></div>').addClass('scaleslide').appendTo(item).slider({
      							orientation: "horizontal",
				    			range: "min",
      							max: 100,
      							min: 1,
      							value: _data.scale,
      							slide: _scale,
      							change: _scale
							});
						}
					} else {
						item.on('click',function(){
							_setActiveLayer(_cnt);
						});
					}
				}
				function _scale(){
					_data.scale=$(this).slider( "value");	
					_img.css({
						'transform': 'scale('+_data.scale/100+')'
					});
				}
				function _render(container){
					if(!_data.scale) _data.scale=100;

					if(_data.id && bannersData.images[data.id])
						_img=$(bannersData.images[data.id].img).clone()
							.css({
								'transform': 'scale('+_data.scale/100+')'
							})
							.appendTo(
								$('<div></div>')
								.attr({'data-id':_cnt,'data-draggable':1})
								.addClass('layer')
								.css({
									'z-index':_cnt,
									'top':_data.top+'px',
									'left':_data.left+'px'
									})
								.appendTo(container)
						);
				}
				return {
					renderItem:_renderItem,
					render:_render
				};
			}

			function _layerText(data,cnt,activeLayer){
				var _data=data;
				var _cnt=cnt;
				var _isActive=(cnt==activeLayer);

				function _renderItem(container){
					var item=$('<div></div>')
						.addClass('layer')
						.attr('data-id',_cnt)
						.on('click',function(){
							_setActiveLayer(_cnt);
						})
						.html(_data.text)
						.appendTo(container);
					if(_isActive)
						item.attr('data-sel',1);

				}
				function _render(container){
					if(_data.text)
						$('<div></div>')
							.addClass('layer text')
							.attr({'data-id':_cnt,'data-draggable':1})
							.css({
								'z-index':_cnt,
								'color':_data.color,
								'font-family':_data.font,
								'font-size':_data.fontSize,
								'text-align':_data.align,
								'top':_data.top+'px',
								'left':_data.left+'px'
								})	
							.html(_data.text)
							.appendTo(container);
				}
				return {
					renderItem:_renderItem,
					render:_render
				};
			}
			
			return {
				destroy:_destroy
			};
		}
/***********************
End of Editor
************************/
		
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
		};
	}(),
		
	test:function(str){
		console.log("Test catched: "+str);
	}
		
});
