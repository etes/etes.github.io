/** esriJson2Excel.js v0.1
 * @author etes
 * 2015. [CCBY2]
 * https://github.com/etes/esriJson2Excel
*/
define(["dojo/_base/declare", "dojo/_base/array", "dojo/request", "dojo/request/script", "dojo/date"], function(declare, array, request, script, date) {
	return declare(null, {

		esriJson2Excel : function(data) {
			request.get(data).then(function(json) {
				console.log("The file's contents is: " + json);
			}, function(error) {
				console.log("An error occurred: " + error);
			});
		},
		getJSON : function(data) {

			var features,
				result,
			    fields;
			return script.get(data, {
				jsonp : "callback"
			}).then(function(jsonData) {
				var message = "";
				if (jsonData.features && jsonData.features.length) {
					// the returned features
					for (var i = 0; i < jsonData.features.length; i++) {
						var geom = jsonData.features[i].geometry;
						jsonData.features[i].attributes.X = geom.x;
						jsonData.features[i].attributes.Y = geom.y;
					};
					jsonData.fields.push({"name": "X", "type": "esriFieldTypeDouble"});
					jsonData.fields.push({"name": "Y", "type": "esriFieldTypeDouble"});
					result = jsonData;
				} else {// Output "no features" message
					message = "No features available for this request.";
				}
				console.log(message);
				return result;
			}, function(err) {
				// Handle the error condition
				console.log("Service is not available.");
			});
			return result;
		},
		jsonToSsXml : function(jsonObject, dataTypes) {
			var row;
			var col;
			var xml;
			var data = typeof jsonObject != "object" ? JSON.parse(jsonObject) : jsonObject;

			headers = this.findHeaders(data, 30);

			emitXmlHeader = function() {
				var headerRow = '<ss:Row>\n';
				for (var colName in headers) {
					headerRow += '  <ss:Cell>\n';
					headerRow += '    <ss:Data ss:Type="String">';
					headerRow += headers[colName] + '</ss:Data>\n';
					headerRow += '  </ss:Cell>\n';
				}
				headerRow += '</ss:Row>\n';

				return '<?xml version="1.0"?>\n' +
								'<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n' +
								'<ss:Worksheet ss:Name="Sheet1">\n' +
								'<ss:Table>\n\n' +
								headerRow;
			};

			emitXmlFooter = function() {
				return '\n</ss:Table>\n' +
								'</ss:Worksheet>\n' +
								'</ss:Workbook>\n';
			};

			xml = emitXmlHeader();

			for ( row = 0; row < data.length; row++) {
				xml += '<ss:Row>\n';
				for (col in data[row]) {
					var dataType = 'String';
					cellValue = data[row][col];
					if (cellValue && dataTypes[col] == "esriFieldTypeDate"){ //Handle DateTime format
						d = new Date(data[row][col]);
						cellValue = d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();
						//dataType = 'DateTime';
					};
					xml += '  <ss:Cell>\n';
					xml += '    <ss:Data ss:Type="' + dataType + '">';
					xml += cellValue + '</ss:Data>\n';
					xml += '  </ss:Cell>\n';
				}

				xml += '</ss:Row>\n';
			}

			xml += emitXmlFooter();
			return xml;
		},

		findHeaders : function(data, lookInFirst) {
			var headers;
			headers = [];
			array.forEach(data, function(r) {
				var p;
				for (p in r) {
					if (array.indexOf(headers, p) < 0) {
						headers.push(p);
					}
				}

			});
			headers = dojo.map(headers, function(h) {
				return h.replace(/^([a-z])/, function(r) {
					return r.toUpperCase();
				}).replace(/\w\_\w/g, function(r) {
					return r[0] + " " + r[2].toUpperCase();
				});
			});
			return headers;
		}
	});

});
