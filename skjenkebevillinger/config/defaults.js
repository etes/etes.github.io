/*global define,location */
/*jslint sloppy:true */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define({
    //Default configuration settings for the application. This is where you'll define things like a bing maps key,
    //default web map, default app color theme and more. These values can be overwritten by template configuration settings and url parameters.
    //"appid": "f318fc7028464323a34ff5bd6e669b0b",
    "webmap": "6ac9719afe604973b4d6af571e88c382",
    "oauthappid": "USbuqcw3KJj6YKqo", //"AFTKRmv16wj14N3z",
    //Group templates must support a group url parameter. This will contain the id of the group.
    //group: "",
    //Enter the url to the proxy if needed by the application. See the 'Using the proxy page' help topic for details
    //http://developers.arcgis.com/en/javascript/jshelp/ags_proxy.html
    "proxyurl": "http://kart.fredrikstad.kommune.no/proxy/proxy.ashx?",
    "bingKey": "", //Enter the url to your organizations bing maps key if you want to use bing basemaps
    //Defaults to arcgis.com. Set this value to your portal or organization host name.
    "sharinghost": location.protocol + "//" + "frstadkomm.maps.arcgis.com",
    //If you need localization set the localize value to true to get the localized strings
    //from the javascript/nls/resource files.
    //Note that we've included a placeholder nls folder and a resource file with one error string
    //to show how to setup the strings file.
    "localize": true,
    "units": null,
    //Theme defines the background color of the title area and tool dialog
    //Color defines the text color for the title and details. Note that
    //both these values must be specified as hex colors.
    "theme": "#00A9E6",
    "color": "#fff",
    //Specify the tool icon color for the tools on the toolbar and the menu icon.
    // Valid values are white and black.
    "icons": "white",
    "logo": "images/logo.png",
    //Set of tools that will be added to the toolbar
    "tools": [
        {"name": "legend", "enabled": true},
        {"name": "bookmarks", "enabled": true},
        {"name": "layers", "enabled": true},
        {"name": "basemap", "enabled": true},
        {"name": "overview", "enabled": false},
        {"name": "measure", "enabled": false},
        {"name": "edit", "enabled": true, "toolbar": false},
        {"name": "print", "enabled": true, "legend": false, "layouts":false, "format":"pdf"},
        {"name": "details", "enabled": false},
        {"name": "direction", "enabled": true},
        {"name": "share", "enabled": false}
    ],
    //Set the active tool on the toolbar. Note home and locate can't be the active tool.
    //Set to "" to display no tools at startup
    "activeTool": "legend",
    //Add the geocoding tool next to the title bar.
    "search": false,
    "locationSearch": true,
    //When searchExtent is true the locator will prioritize results within the current map extent.
    "searchExtent": true,
    "searchLayers":[{
        "id": "skjenkesteder_9701",
        "fields": ["SKJENKESTEDETS_NAVN", "STYRER_NAVN", "STEDFORTREDER_NAVN"],
        "type": "FeatureLayer"
    }],
    //Add the home extent button to the toolbar
    "home": true,
    //Add the geolocation button on the toolbar. Only displayed if browser supports geolocation
    "locate": true,
    // Add download CSV button to the toolbar and define the id of the layer to be downloaded.
    "download": {"layerId": "skjenkesteder_9701", "enabled": true},
    //When true display a scalebar on the map
    "scalebar": false,
    //Specify a title for the application. If not provided the web map title is used.
    "title": "Skjenkebevillinger i Fredrikstad",
    "level": null,
    "center": null,
    //Replace these with your own bitly key
    "bitlyLogin": "esrimarketing",
    "bitlyKey": "R_52f84981da0e75b23aea2b3b20cbafbc",
    "basemapgroup": {"id": "de2f7dc193f34833ae2ed1143c133ce9", "title": "Bakgrunnskart-enkelt", "owner": "ermtes"},
    "customSearch" : {
      operationalLayers : [{
        url : "http://kart.fredrikstad.kommune.no/arcgis/rest/services/Prosjekter/skjenkesteder/MapServer",
        title : "skjenkesteder",
        description : "Skjenkesteder i Fredrikstad",
        visibility : true,
        showInTOC : true,
        identify : true,
        returnGeometryOnIdentity : true,
        opacity : 1,
        type : "esri.layers.ArcGISDynamicMapServiceLayer",
        layers : [{
          name : "skjenkesteder",
          id: "0",
          search : {
            inputExpr : "^([A-ZÆØÅ -/.]{3,})$",
            queryTemplate : "UPPER(SKJENKESTEDETS_NAVN) LIKE '${value1}%'",
            orderByFields : ["SKJENKESTEDETS_NAVN"],
            displayTemplate : "${SKJENKESTEDETS_NAVN} (Skjenkestedets navn)",
            searchTip : "<b>Skjenkestedets navn:</b> Skriv inn skjenkestedets, minst 3 bokstaver"
          }
        }]
      }, {
        url : "http://kart.fredrikstad.kommune.no/arcgis/rest/services/Prosjekter/skjenkesteder/MapServer",
        title : "skjenkesteder",
        description : "Skjenkesteder i Fredrikstad",
        visibility : true,
        showInTOC : false,
        identify : true,
        returnGeometryOnIdentity : true,
        opacity : 1,
        type : "esri.layers.ArcGISDynamicMapServiceLayer",
        layers : [{
          name : "skjenkesteder",
          id: "0",
          search : {
            inputExpr : "^([A-ZÆØÅ -/.]{3,})$",
            queryTemplate : "UPPER(BEVILLINGSHAVER_NAVN) LIKE '${value1}%'",
            orderByFields : ["BEVILLINGSHAVER_NAVN"],
            displayTemplate : "${BEVILLINGSHAVER_NAVN} (Bevillingshavers navn)",
            searchTip : "<b>Bevillingshavers navn:</b> Skriv inn Bevillingshaver, minst 3 bokstaver"
          }
        }]
      }, {
        url : "http://kart.fredrikstad.kommune.no/arcgis/rest/services/Fredrikstad/Samferdsel/MapServer",
        title : "Samferdsel",
        description : "Samferdsel. Oppdateres kontinuerlig",
        visibility : true,
        showInTOC : true,
        identify : true,
        returnGeometryOnIdentity : true,
        opacity : 1,
        type : "esri.layers.ArcGISDynamicMapServiceLayer",
        layers : [{
          name : "Vegnettlinje",
          id: 0,
          search : {
            inputExpr : "^([A-ZÆØÅ -/.]{3,})$",
            queryTemplate : "UPPER(GATENAVN) LIKE '${value1}%'",
            orderByFields : ["GATENAVN"],
            displayTemplate : "${GATENAVN} (Gate/vei)",
            searchTip : "<b>Gate/vei:</b> Skriv inn gatenavn, minst 3 bokstaver"
          }
        }]
      }, {
        url : "http://kart.fredrikstad.kommune.no/arcgis/rest/services/Felles/Stedsnavn/MapServer",
        title : "Stedsnavn",
        description : "Stedsnavn fra Sentralt Stedsnavn Register (SSR)",
        visibility : true,
        showInTOC : true,
        identify : false,
        returnGeometryOnIdentity : false,
        opacity : 1,
        imageFormat : "png36",
        type : "esri.layers.ArcGISDynamicMapServiceLayer",
        layers : [{
          name : "SSR",
          id: "6",
          search : {
            inputExpr : "^([A-ZÆØÅ -/]{3,})$",
            queryTemplate : "KOMM = 106 AND UPPER(SNAVN) LIKE '${value1}%'",
            orderByFields : ["SNAVN"],
            displayTemplate : "${SNAVN} (${NAVNTYPE})",
            searchTip : "<b>Sted:</b> Skriv inn stedsnavn, minst 3 bokstaver"
          }
        }]
      },{
        url : "http://kart.fredrikstad.kommune.no/ArcGIS/rest/services/Felles/Eiendomskart/MapServer",
        title : "Eiendomskart",
        description : "Eiendom og adresseinformasjon fra Matrikkelen. Oppdateres to ganger i døgnet",
        link : "https://www.fredrikstad.kommune.no",
        visibility : true,
        showInTOC : true,
        identify : true,
        returnGeometryOnIdentity : true,
        opacity : 1,
        type : "esri.layers.ArcGISDynamicMapServiceLayer",
        layers : [{
          name : "Adressepunkt",
          id: "1",
          search : {
            inputExpr : "^([A-ZÆØÅ -.]{3,})([0-9]{1,3})?([A-ZÆØÅ])?$",
            queryTemplate : "KOMMUNEID = 106 AND UPPER(ADRESSENAVN) LIKE '${value1}%' AND NR = ${value2} AND UPPER(BOKSTAV) = '${value3}'",
            orderByFields : ["ADRESSENAVN","NR","BOKSTAV"],
            displayTemplate : "${ADRESSENAVN} ${NR}${BOKSTAV}",
            searchTip : "<span><b>Adresse:</b> Skriv inn gatenavn, husnummer og eventuell bokstav, eller bare gatenavn."
          }
        }]
      }]
    }
});
