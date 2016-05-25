define(["dojo/_base/declare", "dojo/on", "dojo/_base/lang", "dojox/gfx/fx", "dijit/Tooltip", "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-style", "dojo/string", "dojo/has", "dojo/topic", "dojo/promise/all", "dojo/_base/array", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "application/utils", "dojo/domReady!"], function(declare, on, lang, fx, Tooltip, dom, domConstruct, domAttr, domClass, domStyle, string, has, topic, all, array, Query, QueryTask, FeatureLayer, appUtils) {
	return declare(null, {

		id : null,
		config : {},
		constructor : function(config) {

			// search settings

			this.config = config;
			// config will contain application and user defined info for the application such as i18n strings the web map id and application id, any url parameters and any application specific configuration information.

			// Gets parameters from the URL, convert them to an object and remove HTML tags.
		},

		startup : function() {
			this._init(this.id);

		},
		_init : function(_id) {
			id = _id;

			var timer = null;
			var inputElem = domConstruct.create("input", {
				id : "searchInput",
				style : has("ie") < 9 ? "padding-top:8px;" : "padding-top:0px;",
				className : "searchInputStart",
				value : "Søk i kartet",
				onclick : function() {
					if (this.className == "searchInputStart") {
						this.className = "searchInput";
						this.value = "";
					}
					domStyle.set("searchSelectDiv", "display", "none");
				}
			}, "searchInputDiv");

			on(inputElem, "keyup", lang.hitch(this, function() {
					clearTimeout(timer);
					timer = setTimeout(this.validate(), 800);
				}));

			domConstruct.create("ul", {
				id : "searchSelectDiv",
				class: "searchMenu",
				style : "display:none"
			}, dom.byId("searchInputDiv"));

			domConstruct.create("img", {
				src : "images/spinner.gif",
				height : "25",
				width : "25",
				style : "position:relative;top:-25px;left:50px;z-index:999"
			}, domConstruct.create("div", {
				id : "searchSpinner",
				style : "display:none"
			}, "searchInputDiv"));

			//search tooltip
			if (!(has("ios") || has("android"))) {
				var tooltipText = "";
				array.forEach(this.config.searchConfig.operationalLayers, function(opLayer) {
					//if (opLayer.loaded) {
					if (opLayer) {
						array.forEach(opLayer.layers, function(layerInfo) {
							if (layerInfo.search && layerInfo.search.searchTip) {
								tooltipText += layerInfo.search.searchTip + "<br/>";
							}
						});
					}
				});
				if (tooltipText.length > 0) {
					tooltipText = "Du kan søke på:<br/><br/>" + tooltipText;
					new Tooltip({
						connectId : [inputElem],
						label : tooltipText
					});
				}
			}

			//do find
			var findParam = appUtils.getURLParam("find");
			if (findParam != null) {
				if (dom.byId("searchInput") != null) {
					domClass.replace("searchInput", "searchInput", "searchInputStart");
					domAttr.set("searchInput", "value", findParam);
				}
				this.doSearch(findParam);
			}
		},

		validate: function(){
			this.doSearch(string.trim(dom.byId("searchInput").value));
		},

		doSearch : function(value) {
			topic.publish("search-started");

			this.showSpinner();
			var promises = [];
			getSearchQuery = this.getSearchQuery;
			getSearchItem = this.getSearchItem;
			querySelected = this.querySelected;
			showSpinner = this.showSpinner;
			hideSpinner = this.hideSpinner;
			map = this.config.map;
			array.forEach(this.config.searchConfig.operationalLayers, function(opLayer) {
				// if (opLayer.loaded && opLayer.layers) {
				var opLayer = opLayer;
				if (opLayer.layers) {
					array.forEach(opLayer.layers, function(layerInfo) {
						if (layerInfo.search) {
							// added layerInfo.layerObjs Date: 20150702
							params = {mode: FeatureLayer.MODE_SELECTION,outFields:"*"};
							layerInfo.layerObj = new FeatureLayer(opLayer.url + '/' + layerInfo.id, params);
							var query = getSearchQuery(layerInfo.search, value);
							if (query != null) {
								var deferred = layerInfo.layerObj.queryFeatures(query).addCallback(function(featureSet) {
									var items = [];
									array.forEach(featureSet.features, function(feature) {
										var objId = feature.attributes.OBJECTID;
										appUtils.formatAttributes(layerInfo.layerObj, feature);
										var name = string.substitute(layerInfo.search.displayTemplate, feature.attributes);
										var item = getSearchItem(items, name);
										if (item == null) {
											item = {
												id : objId.toString(),
												name : name,
												opLayer : opLayer,
												layerInfo : layerInfo,
												objIds : []
											};
											items.push(item);
										}
										item.objIds.push(objId);
									});
									return items;
								});
								promises.push(deferred);
							}
						}
					});
				}
			});
			if (promises.length > 0) {
				all(promises).then(function(results) {
					hideSpinner();
					searchResultDiv = dom.byId("searchSelectDiv");
					domConstruct.empty(searchResultDiv);
					domAttr.remove(searchResultDiv, "style");

					var items = [];
					array.forEach(results, function(result) {
						array.forEach(result, function(item) {
							items.push(item);
						});
					});

					if (items.length === 0) {// no result
						domStyle.set(searchResultDiv, "height", "30px");
						domStyle.set(searchResultDiv, "width", "250px");
						domConstruct.create("li", {
							className : "searchSelectItem",
							innerHTML : "Ingen treff",
							onclick : function() {
								domStyle.set(searchResultDiv, "display", "none");
							}
						}, searchResultDiv);
					} else if (items.length === 1) {
						//single result, zoom directly
						querySelected(items[0]);
						domAttr.set(dom.byId("searchInput"), "value", items[0].name);
					} else {
						// multiple result add to list
						array.forEach(items, function(item) {
							domConstruct.create("li", {
								className : "searchSelectItem",
								innerHTML : item.name,
								onclick : function() {
									querySelected(getSearchItem(items, item.name));
									domAttr.set(dom.byId("searchInput"), "value", item.name);
									domStyle.set(searchResultDiv, "display", "none");
								},
								onmouseover : function() {
									this.className = "searchSelectItemHover";
								},
								onmouseout : function() {
									this.className = "searchSelectItem";
								}
							}, searchResultDiv);
						});
						domStyle.set(searchResultDiv, "display", "inline");
						domStyle.set(searchResultDiv, "minWidth", "250px");
					}
				});
			} else {
				hideSpinner();
			}
		},

		getSearchItem : function(items, name) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].name == name) {
					return items[i];
				}
			}
			return null;
		},
		querySelected : function(item) {
			if (item == null) {
				return;
			}
			this.showSpinner();
			var flayer = item.layerInfo.layerObj;
			var query = new Query();
			query.objectIds = item.objIds;
			query.returnGeometry = true;
			query.geometryPrecision = 2;
			flayer.queryFeatures(query).then(handleQueryResults);

			function handleQueryResults(featureSet) {
				feature = featureSet.features[0];
				map = this.map;
				//map.graphics.remove(this.graphic);
				var searchItem = {
					id : flayer.id,
					features : featureSet.features,
					layerInfo : item.layerInfo
				};
				if (!searchItem.layerInfo.template) {
					array.forEach(featureSet.features, function(feature) {
						appUtils.formatAttributes(flayer, feature);
					});
				}
				if (feature.geometry.type == "point"){
					map.centerAndZoom(feature.geometry, map.getMaxZoom() - 2);
					var symbol = new esri.symbol.PictureMarkerSymbol({"angle":0,"xoffset":0,"yoffset":12,"type":"esriPMS","imageData":"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","contentType":"image/png","width":24,"height":24});
					this.graphic = new esri.Graphic(feature.geometry, new esri.symbol.SimpleMarkerSymbol({"color": [0,0,0,255], "size": 12}));
					//this.graphic = new esri.Graphic(feature.geometry, symbol);
				}else{
					map.setExtent(feature.geometry.getExtent());
					this.graphic = new esri.Graphic(feature.geometry, new esri.symbol.SimpleFillSymbol());
				}
				//map.graphics.add(this.graphic);
				var animate = setInterval(lang.partial(function(g) {
						map.graphics.remove(g);
						addG();
          }, this.graphic), 400);
				var addG= function(){setTimeout(lang.partial(function(g) {
							map.graphics.add(g);
	          }, this.graphic), 200);
					};
				setTimeout(lang.partial(function(i){
					clearInterval(i);
					map.graphics.remove(this.graphic)
				}, animate), 4000);
				topic.publish("search-complete", [searchItem]);
				this.hideSpinner();
			};
		},
		showSpinner : function() {
			domAttr.set("searchSpinner", "style", "display:block");
		},

		hideSpinner : function() {
			domAttr.set("searchSpinner", "style", "display:none");
		},

		getSearchQuery : function(searchInfo, value) {
			var replaceResult = null;
			var regexpr = null;
			var replaceValues = {
				value1 : value.toUpperCase(),
				value2 : "NODATA",
				value3 : "NODATA",
				value4 : "NODATA"
			};
			if (searchInfo.inputExpr) {
				regexpr = new RegExp(searchInfo.inputExpr);
				var matchResult = value.toUpperCase().match(regexpr);
				if (matchResult != null) {
					var index = 1;
					for (var fieldName in replaceValues) {
						if (replaceValues.hasOwnProperty(fieldName)) {
							if (matchResult[index] != null && matchResult[index].length > 0) {
								replaceValues[fieldName] = matchResult[index].replace(/^\s+|\s+$/g, "");
								//trim
							}
							index++;
						}
					}
				} else {
					return null;
				}
			}
			replaceResult = string.substitute(searchInfo.queryTemplate, replaceValues);
			var splitResult = replaceResult.split("AND");
			var where = "";
			array.forEach(splitResult, function(part) {
				if (part.indexOf("NODATA") === -1) {
					where += part + "AND";
				}
			});
			where = where.substr(0, where.lastIndexOf("AND"));
			//parsing field names
			regexpr = /\{(.*?)\}/g;
			var outFields = ["OBJECTID"];
			var results;
			while ( results = regexpr.exec(searchInfo.displayTemplate)) {
				outFields.push(results[1]);
			}
			var query = new Query();
			query.where = where;
			query.outFields = outFields;
			query.returnGeometry = false;

			if (searchInfo.orderByFields) {
				query.orderByFields = searchInfo.orderByFields;
			}
			return query;
		}
	});
});
