///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define([
  'dojo/_base/declare', 
  'dojo/dom-style',
  'dojo/dom',
  'jimu/BaseWidget',
  'esri/layers/FeatureLayer',
  'esri/dijit/FeatureTable',
  'esri/tasks/query',
  'dojo/_base/lang'
],
function(
  declare, 
  domStyle,
  dom,
  BaseWidget,
  FeatureLayer, 
  FeatureTable,
  Query,
  lang
  ) {
  //To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-RelatedData',
    featureTable: null,
    selectedFeatureLayer: null,

    postCreate: function() {
      this.inherited(arguments);
      console.log('RelatedData: postCreate');
      
      this.map.on('resize',lang.hitch(this,this.resizeWidgetPanel));
    },

    startup: function() {
      this.inherited(arguments);
      console.log('RelatedData: startup');      
    },

    onOpen: function(){
      console.log('RelatedData: onOpen');
      this.resizeWidgetPanel();
    },

    onClose: function(){
      console.log('RelatedData: onClose');
      this.position.left = -1000;
    },

    onMinimize: function(){
      console.log('RelatedData: onMinimize');
    },

    onMaximize: function(){
      console.log('RelatedData: onMaximize');
    },

    onSignIn: function(credential){
      /* jshint unused:false*/
      console.log('RelatedData: onSignIn');
    },

    onSignOut: function(){
      console.log('RelatedData: onSignOut');
    },

    //Codes modified from this sample: 
    //https://developers.arcgis.com/javascript/3/sandbox/sandbox.html?sample=featuretable_relatedrecords
    showRelatedData: function(featureSet){                   
      var layerId = featureSet.features[0]._layer.id;    
      this.selectedFeatureLayer = this.map._layers[layerId];
      
      //re-select the selected feature to add the selection into the later recreated feature table.
      //there should be another easy way to select in the table directly.
      var feature = featureSet.features[0];      
      var featureId = feature.attributes[this.selectedFeatureLayer.objectIdField];
      var query = new Query();
      query.returnGeometry = false;
      query.objectIds = [featureId];
      query.where = "1=1";
      this.selectedFeatureLayer.selectFeatures(query,FeatureLayer.SELECTION_NEW);

      if(!this.featureTable){
        this.featureTable = new FeatureTable({
          featureLayer : this.selectedFeatureLayer,
          map : this.map,
          syncSelection: true,
          showRelatedRecords: true,
          showAttachments: true,
          fieldInfos: [
            {
              name: 'AnalysisArea', 
              alias: 'Area SQ/KM', 
              editable: false,
              format: {
                template: "${value}",
                places: 3 // number of decimal places
                // digitSeparator: true // default is true
              }
            }
          ],
          // outfields 
          outFields: ["TRACTCE10", "BLOCKCE10", "GEOID", "NAME", "MTFCC", "ALAND", "AnalysisArea", "Point_Count", "Join_ID"],
        }, 'myTableNode');   
            
        this.featureTable.on('load', lang.hitch(this, this.filterBySelection));    
        this.featureTable.on('row-select', lang.hitch(this, this.filterBySelection));  

        this.featureTable.startup(); 
      }            
    },

    filterBySelection: function(){
      this.featureTable.filterSelectedRecords();
    },

    resizeWidgetPanel: function(){
      var widgetPanel = dom.byId(this.id+'_panel');
      if(widgetPanel){
        domStyle.set(widgetPanel, 'width', this.map.width+'px');
        domStyle.set(widgetPanel, 'left', '0');
      }
      if(this.featureTable){
        this.featureTable.resize();
      }
    }
  });
});