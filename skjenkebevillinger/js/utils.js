/**
 * @author geiank
 */
define([
	"dojo/_base/array",
	"dojo/cookie",
	"dojo/date/locale"
], function(
	array,
	cookie,
	locale
) {
	var hiddenFields = ["OBJECTID", "SHAPE", "SHAPE.AREA", "SHAPE.LEN"];
	var dateFields = ["DATO", "DATE", "DATOFRA", "DATOTIL", "VARSLET_IGANGSATT", "IKRAFT", "AVGJDATO", "OPPDATERINGSDATO", "REGISTRERINGDATO", "CREATED", "MODIFIED", "ENDRINGSDATO", "DOKDATO", "FORRETNING_DOKDATO", "ETABLDATO", "DATAFANGSTDATO"];
	var emailPattern = new RegExp("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$");
	var urlPattern = new RegExp("^[A-Za-z]+://[A-Za-z0-9-]+\.[A-Za-z0-9]+");

	function _formatAttributes(flayer, feature) {
		if (flayer) {
			var formattedAttr = {};
			array.forEach(flayer.fields, function(field) {
				var value = feature.attributes[field.name];
				if (flayer.type === "Feature Layer") {
					if (flayer.typeIdField && flayer.typeIdField != null) {
						var subtype = getSubtype(flayer.types, feature.attributes[flayer.typeIdField]);
						if (subtype != null) {
							if (flayer.typeIdField === field.name) {
								value = subtype.name;
							} else if (subtype.domains.hasOwnProperty(field.name)) {
								var domain = subtype.domains[field.name];
								value = getDomainValue(domain.codedValues, value);
							}
						}
					}
					if (field.domain && field.domain != null) {
						value = getDomainValue(field.domain.codedValues, value);
					}
				}
				value = field.type === "esriFieldTypeDate" ? _formatDato(value) : _formatField(value);
				formattedAttr[field.alias] = value;
			});
			feature.setAttributes(formattedAttr);
		} else {
			_formatAttributesSimple(feature);
		}
	}

	function _formatAttributesSimple(feature) {
		var formattedAttr = {};
		for (var fieldName in feature.attributes) {
			var value = feature.attributes[fieldName];
			formattedAttr[fieldName] = array.indexOf(dateFields, fieldName) > -1 ? _formatDato(value) : _formatField(value);
		}
		feature.setAttributes(formattedAttr);
	}

	function getSubtype(subtypes, subtypeId) {
		for (var i = 0; i < subtypes.length; i++) {
			if (subtypes[i].id == subtypeId) {
				return subtypes[i];
			}
		}
		return null;
	}

	function getDomainValue(codedValues, value) {
		for (var i = 0; i < codedValues.length; i++) {
			if (codedValues[i].code == value) {
				return codedValues[i].name;
			}
		}
		return value;
	}

	function _formatDato(value) {
		if (value == null || value == "01.01.1753")
			return "";
		if (isNaN(value))
			return value;
		var date = new Date(value);
		var formatDate = locale.format(date, {
			selector : 'date',
			datePattern : 'dd.MM.yyyy'
		});
		formatDate = formatDate == "01.01.1753" ? "" : formatDate;
		return formatDate;
	}

	function _formatField(value) {
		if (value == undefined || value == null) {
			return "";
		}
		if (!isNaN(value)) {
			return value;
		}
		if (value.length == 0 || value.toUpperCase().indexOf("NULL") > -1) {
			return "";
		}
		if (urlPattern.test(value)) {// url
			var title = value.substr(value.lastIndexOf("/") + 1);
			return "<a href='" + value + "' target='_blank'>" + title + "</a>";
		} else if (emailPattern.test(value)) {// mail
			return "<a href='mailto:" + value + "?Subject=Henvendelse'>" + value + "</a>";
		}
		return value;
	}

	function _getURLParam(strParamName) {
		var strReturn = null;
		var strHref = window.location.href;
		if (strHref.indexOf("?") > -1) {
			var strQueryString = strHref.substr(strHref.indexOf("?"));
			var aQueryString = strQueryString.split("&");
			for (var iParam = 0; iParam < aQueryString.length; iParam++) {
				if (aQueryString[iParam].indexOf(strParamName + "=") > -1) {
					var aParam = aQueryString[iParam].split("=");
					strReturn = aParam[1];
					break;
				}
			}
		}
		return strReturn != null ? unescape(strReturn) : null;
	}
	
	// source for supports_local_storage function:
	// http://diveintohtml5.org/detect.html
	function _supportsLocalStorage() {
		try {
			return "localStorage" in window && window["localStorage"] !== null;
		} catch(e) {
			return false;
		}
	}
	
	function _setLocalData(name,data) {
		if (_supportsLocalStorage()) {
			localStorage.setItem(name, data);
		} else {
			cookie(name, data, {
				expires : 365
			});
		}
	}
	
	function _getLocalData(name) {
		if (_supportsLocalStorage()) {
			return localStorage.getItem(name);
		}
		return cookie(name);
	}
	
	function _clearLocalData(name) {
		if (_supportsLocalStorage()) {
			localStorage.removeItem(name);
		} else {
			cookie(name, null, {
				expires : -1
			});
		}
	}
	
	return {
		getURLParam : function(strParamName) {
			return _getURLParam(strParamName);
		},
		
		setLocalData : function(name,data) {
			_setLocalData(name,data);
		},
		
		getLocalData : function(name) {
			return _getLocalData(name);
		},
		
		clearLocalData : function(name) {
			_clearLocalData(name);
		},
		
		formatAttributes: function(flayer, feature) {
			_formatAttributes(flayer, feature);
		},
		
		formatAttributesSimple: function(feature) {
			_formatAttributesSimple(feature);
		},
		
		formatDato: function(value) {
			return _formatDato(value);
		},
		
		formatField: function(value) {
			return _formatField(value);
		},
		
		isHiddenField: function(fieldName) {
			return array.indexOf(hiddenFields, fieldName.toUpperCase()) > -1;
		}
	};
});

