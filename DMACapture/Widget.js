//Chart.js: https://github.com/chartjs/Chart.js

define([
  'dojo/_base/declare', 
  'jimu/BaseWidget',
  'dojo/dom',
  'dojo/dom-style',
  './ChartJs/Chart.min',
  "dijit/form/Textarea", 
  'dijit/_WidgetsInTemplateMixin',
  "dijit/registry"
],
  function(
    declare, 
    BaseWidget,
    dom,  
    domStyle,
    ChartJs,Textarea,
    _WidgetsInTemplateMixin,
    registry
    ) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget,_WidgetsInTemplateMixin], {
      // Custom widget code goes here

      baseClass: 'jimu-widget-DMACapture',

      //this property is set by the framework when widget is loaded.
      name: 'DMACapture',
      radarConfig: null,
      radarChart: null,
      userId: '',

      //methods to communication with app container:
      postCreate: function() {
        this.inherited(arguments);
        console.log('DMACapture: postCreate');
      },

      randomScalingFactor: function() {
        return Math.round(Math.random() * 100);
      },
      startup: function() {
       this.inherited(arguments);
       //this.mapIdNode.innerHTML = 'map id:' + this.map.id;
       console.log('startup');
      },

      onOpen: function(){
        console.log('DMACapture: onOpen');
        
        var widgetPanel = dom.byId(this.id+'_panel');
        if(widgetPanel){
          domStyle.set(widgetPanel, 'width', '1500px');
          domStyle.set(widgetPanel, 'height', '700px');
        }
        
        this.radarConfig = {
          type: 'radar',
          data: {
            labels: [
              "STRATEGY & BUDGET", 
              "EXPLORATION PORTFOLIO FIT", 
              "DEVELOPMENT CONCEPT", 
              "TECHNICAL/SUBSURFACE", 
              "ABOVE GROUND", 
              "COMERCIAL"],
            datasets: []
          },
          options: {
            title:{
              display: false,
              text: "Decision Metrics Assessments Radar Chart"
            },
            scale: {
              ticks: {
                beginAtZero: true
              }
            }
          }
        };

        this.radarChart = new ChartJs.Chart(dom.byId('radarChartCanvas'), this.radarConfig);

      },

      // onClose: function(){
      //   console.log('onClose');
      // },

      // onMinimize: function(){
      //   console.log('onMinimize');
      // },

      // onMaximize: function(){
      //   console.log('onMaximize');
      // },

      onSignIn: function(credential){
        /* jshint unused:false*/
        console.log('DMACapture: onSignIn');
        //this.userId = credential.userId;
        //this.reviewerName.text = credential.userId;
        console.log(credential.userId);

        var txtBoxName = registry.byId("reviewerName");
        txtBoxName.set("value",  credential.userId);
      },

      // onSignOut: function(){
      //   console.log('onSignOut');
      // }

      // onPositionChange: function(){
      //   console.log('onPositionChange');
      // },

      resize: function(){
        console.log('DMACapture: resize');
      },

      _addDMA: function(){
        console.log('_addDMA');

        var color = ChartJs.Chart.helpers.color;
        var r = Math.round(Math.random()*255);
        var g = Math.round(Math.random()*255);
        var b = Math.round(Math.random()*255);

        var colorString = 'rgb('+r+','+g+','+b+')';
        var DMA2 = {
          label: 'DMA2',
          backgroundColor: color(colorString).alpha(0.2).rgbString(),
          borderColor: colorString,
          pointBackgroundColor: colorString,
          data: [
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor(),
            this.randomScalingFactor()
          ]
        };

        this.radarConfig.data.datasets.push(DMA2);
        this.radarChart.update();
      },

      _saveDMA: function(){
        console.log('_saveDMA');

      },

      _calculate: function(){
        console.log("DMACapture: _calculate.");
        // return this.selectedSBQ1.validate();
        try{
          if(this.DMAQuestionsForm.validate())
          {
            this.scoreSBQ1.innerHTML = this.selectedSBQ1.value;
            this.scoreSBQ2.innerHTML = this.selectedSBQ2.value;
            this.scoreSBQ3.innerHTML = this.selectedSBQ3.value;
            this.scoreSBQ4.innerHTML = this.selectedSBQ4.value;


            return false;
          }
        }
        catch(exception){
          alert("An exception captured!");
          console.error(exception);
        }
        return false;

      },

      _showSpiderChart: function(){

      }

      //methods to communication between widgets:

    });
  });