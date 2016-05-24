var scripts = document.getElementsByTagName("script")
var currentScriptPath = scripts[scripts.length-1].src;

app.directive('addEvent', function (NgTableParams, ShowFactory) {
  return {
    // templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
    templateUrl: '/addshow.directive.html',
    // scope: {
    //   actionTime: "=",
    //   actionTimes: "="
    // },
    link: function (scope, elem, attrs) {
      // scope.actionsObj = {};
      scope.actions = ['changeColor', 'fadeColorTo', 'changeText', 'resetScreen'];
      var actionLabels = ['Change Color', 'Fade Color To', 'Change Text', 'Reset Screen'];
      var selectLabels = ['Select Action', 'Select Start Time', 'Select Parameters'];

      scope.actionsObj = {
        changeColor: {
          label: 'Change Color',
          params: ['color', 'backgroundColor']
        },
        fadeColorTo: {
          label: 'Fade Color To',
          params: ['color', 'backgroundColor', 'transitionTime']
        },
        changeText: {
          label: 'Change Text',
          params: ['text', 'color', 'target']
        },
        resetScreen: {
          label: 'Reset Screen',
          params: ['text', 'color', 'backgroundColor']
        }
      };

      var actionParams = {
        changeColor: ['color', 'backgroundColor'],
        fadeColorTo: ['color', 'backgroundColor', 'transitionTime'],
        changeText: ['text', 'color', 'target'],
        resetScreen: ['text', 'color', 'backgroundColor']
      };

      scope.actions = [];
      scope.show = {};

      var self = this;
      var data = scope.actions;
      self.tableParams = new NgTableParams({}, { dataset: data });

      scope.addAction = function () {
        if (!scope.show.events) scope.show.events = [];

        scope.newAction.time = scope.actionTime;
        scope.newAction.actionLabel = scope.actionsObj[scope.newAction.action].label;
        console.log(scope.newAction);
        scope.actions.push(scope.newAction);
        scope.show.events.push(scope.newAction);
        scope.actionTime = null;
        scope.newAction = null;

      }

      scope.createShow = function () {
        console.log(scope.show);
        ShowFactory.createShow(scope.show)
          .then(function (show) {
            console.log('created show', show);
          })
      }

      scope.tabs = [
        { title: 'Edit' },
        { title: 'Preview'}
      ];

      scope.myTitle = "Awesome Sequence (editable)";

      // scope.actionTime = 0;
      var canvas1 = angular.element(document.getElementById('myCanvas'))
      var canvas = angular.element(document.getElementById('myCanvas'))[0];
      // var canvas = elem.find('canvas');
      console.log(canvas1);

      var test = angular.element(elem.find('md-tabs'));
      console.log(test);
      // console.log()
      canvas.addEventListener('mousedown', returnTick, false);


      function returnTick (event) {
        // var canvas = angular.element(document.getElementById('myCanvas'))[0];
        var rect = canvas.getBoundingClientRect();
        var layoutPadding = 8;
        console.log(rect)
        var canvasX = event.pageX - rect.left - layoutPadding;
        var canvasY = event.pageY - rect.top - layoutPadding;
        var closestTick = ((canvasX - 100) / 12.5);
        var tick;
        var bars;
        var quarters;
        var sixteenths;
        // console.log(; // timeline starts at 100px
        console.log(event.pageX, event.pageY, canvasX, canvasY);
        if (.8 <= closestTick % 1 && closestTick % 1 <= 1) {
          console.log('between .8 and 1. taking ceiling: ', Math.ceil((canvasX - 100) / 12.5), ' sixteenths');
          tick = Math.ceil((canvasX - 100) / 12.5);
        }
        else if (0 <= closestTick % 1 && closestTick % 1 <= .2) {
          console.log('between 0 and .2. taking floor: ', Math.floor((canvasX - 100) / 12.5), ' sixteenths');
          tick = Math.floor((canvasX - 100) / 12.5);
        }
        else {
          console.log('No Match');
          return;
        }
        // return canvasX;
        if (tick >= 16) {
          bars = Math.floor(tick / 16);
          tick = tick - bars * 16;
        }
        else {
          bars = 0;
        }
        if (tick >= 4) {
          quarters = Math.floor(tick / 4);
          tick = tick - quarters * 4;
        }
        else {
          quarters = 0;
        }
        sixteenths = tick;
        scope.actionTime = bars + ':' + quarters + ':' + sixteenths;
        scope.$digest(); // there needs to exist an actionTime property on the scope to display certain HTML elements.
                         // the actionTime assignment above is not consistently being included in the digest phase, so I am manually adding a $digest
        console.log(scope.actionTime);
        if (!scope.actionTimes) scope.actionTimes = [];
        scope.actionTimes.push(scope.actionTime);


      }

      //DRAWING THE TIMELINE

      function drawTimeline () {
        // var canvas = document.getElementById('myCanvas');
        var ctx = canvas.getContext('2d');

        // ctx.beginPath();
        // ctx.moveTo(100,50);
        // ctx.lineTo(900,50);
        // ctx.stroke();

        var numBars = 4;
        var numQuarters = 4;
        var numSixteenths = 4;

        var startingX = 100;
        var startingY = 50;
        drawTicks(ctx, startingX, startingY, numBars, numQuarters, numSixteenths);

      }

      function drawTicks (ctx, startingX, startingY, numBars, numQuarters, numSixteenths) {
        for (var i = 0; i < numBars; i++) {
          endingX = startingX + 200;
          ctx.beginPath();
          ctx.moveTo(endingX, startingY - 10);
          ctx.lineTo(endingX, startingY + 10);
          ctx.stroke();
          drawQuarters(ctx, startingX, startingY, numQuarters, numSixteenths);
          startingX = endingX;
        }
      }

      function drawQuarters (ctx, startingX, startingY, numQuarters, numSixteenths) {
        for (var i = 0; i < numQuarters; i++) {
          endingX = startingX + 50;
          ctx.beginPath();
          ctx.moveTo(endingX, startingY - 5);
          ctx.lineTo(endingX, startingY + 5);
          ctx.stroke();
          drawSixteenths(ctx, startingX, startingY, numSixteenths);
          startingX = endingX;
        }
      }

      function drawSixteenths (ctx, startingX, startingY, numSixteenths) {
        for (var i = 0; i < numSixteenths; i++) {
          ctx.beginPath();
          ctx.moveTo(startingX, startingY);
          endingX = startingX + 12.5;
          ctx.lineTo(endingX, startingY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(endingX, startingY - 2.5);
          ctx.lineTo(endingX, startingY + 2.5);
          ctx.stroke();
          startingX = endingX;
        }
      }




      // var canvas = document.getElementById('myCanvas');
      // var boundingRect = canvas.getBoundingClientRect();
      drawTimeline();


    }
  }
})
