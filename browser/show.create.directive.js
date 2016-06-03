app.directive('addEvent', function (NgTableParams, ShowFactory) {
  return {
    // templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
    templateUrl: '/show.create.directive.html',
    // scope: {
    //   actionTime: "=",
    //   actionTimes: "="
    // },
    link: function (scope, elem, attrs) {
      // scope.actionsObj = {};

      scope.tabs = [
        { title: 'Edit' },
        { title: 'Preview'}
      ];

      scope.eventGroupings = {
        colors: {
          actions: ['changeColorTo', 'fadeColorTo'],
          label: 'Colors'
        },
        text: {
          actions: ['changeTextTo', 'resetScreen'],
          label: 'Text'
        },
        phone: {
          actions: ['flash', 'vibrate'],
          label: 'Phone'
        }
      }

      scope.actionsObj = {
        changeColorTo: {
          label: 'Change Color',
          params: ['color', 'backgroundColor']
        },
        fadeColorTo: {
          label: 'Fade Color To',
          params: ['color', 'backgroundColor', 'transitionTime']
        },
        changeTextTo: {
          label: 'Change Text',
          params: ['text', 'color', 'target']
        },
        resetScreen: {
          label: 'Reset Screen',
          params: ['text', 'color', 'backgroundColor']
        },
        flash: {
          label: 'Flash'
        },
        vibrate: {
          label: 'Vibrate'
        }
      };

      var actionParams = {
        changeColorTo: ['color', 'backgroundColor'],
        fadeColorTo: ['color', 'backgroundColor', 'transitionTime'],
        changeText: ['text', 'color', 'target'],
        resetScreen: ['text', 'color', 'backgroundColor']
      };
      if (!scope.show) scope.show = {};
      if (!scope.show.events)
        scope.show.events = [];

      var self = this;
      var data = scope.show.events;
      self.tableParams = new NgTableParams({}, { dataset: data });

      scope.addAction = function () {
        console.log(scope.startingIdx, scope.lastIdx);
        if (!scope.show.events) scope.show.events = [];

        scope.newEvent.startTime = scope.eventStartTime;
        scope.newEvent.endTime = scope.eventEndTime;
        scope.newEvent.startIdx = scope.startingIdx;
        scope.newEvent.endIdx = scope.lastIdx;
        scope.newEvent.activeArrayKey = scope.activeArrayKey;
        scope.newEvent.eventGrouping = scope.activeArrayKey;
        scope.newEvent.actionLabel = scope.actionsObj[scope.newEvent.action].label;
        console.log(scope.newEvent);
        scope.show.events.push(scope.newEvent);
        scope.highlightSaved(scope.newEvent);
        scope.eventStartTime = null;
        scope.eventEndTime = null;
        scope.newEvent = null;


      }

      scope.selectIdx = function (idx, arrayKey) {
        if (scope.activeArrayKey !== arrayKey) {
          scope.startingIdx = undefined;
          scope.lastIdx = undefined;
        }
        scope.activeArrayKey = arrayKey;

        if (scope.startingIdx === undefined) {

          scope.startingIdx = idx;
          scope.lastIdx = idx;

        }
        else if (scope.startingIdx >= idx) {
          scope.startingIdx = undefined;
          scope.lastIdx = undefined;
        }
        else {
          scope.lastIdx = idx;
        }
        scope.eventStartTime = ShowFactory.convertToMusicalTime(scope.startingIdx, scope.lastIdx, scope.qtrResolution).eventStartTime;
        scope.eventEndTime = ShowFactory.convertToMusicalTime(scope.startingIdx, scope.lastIdx, scope.qtrResolution).eventEndTime;

        console.log(scope.startingIdx, scope.lastIdx, arrayKey);


      }

      if (!scope.show.savedTimelines)
        scope.show.savedTimelines = {};



      scope.highlightSaved = function (newEvent) {
        // console.log(newEvent);
        if (!scope.show.savedTimelines[newEvent.activeArrayKey]) {
          scope.show.savedTimelines[newEvent.activeArrayKey] = {
            savedEvents: [],
            savedIdx: []
          }
        }
        scope.show.savedTimelines[newEvent.activeArrayKey].savedEvents.push(newEvent);
        for (var i = newEvent.startIdx; i <= newEvent.endIdx; i++) {
          console.log(i);
          scope.show.savedTimelines[newEvent.activeArrayKey].savedIdx.push(i);
        }
        console.log(scope.show.savedTimelines);
      }

      scope.createShow = function () {
        console.log(scope.show);
        ShowFactory.createShow(scope.show)
          .then(function (show) {
            scope.show = undefined;
            scope.savedTimelines = undefined;
            scope.show = undefined;
            scope.activeArrayKey = undefined;
            console.log('created show', show);
          })
      }


      // NEED TO REVISIT. ACCOUNT FOR EIGHTHTS SWITCHING TO QTR NOTES
      // NOT BEING ACCURATELY MEASURED

      scope.changeResolution = function (qtrResolution) {
        // console.log(resolution);
        if (qtrResolution) {
          scope.data.notesPerMeasure = 4
          if (scope.startingIdx) {
            scope.startingIdx = (scope.startingIdx - 1) / 2;
            scope.lastIdx = (scope.lastIdx - 1) / 2;
          }
        }
        else {
          scope.data.notesPerMeasure = 8;
          if (scope.startingIdx) {
            scope.startingIdx = scope.startingIdx * 2 + 1;
            scope.lastIdx = scope.lastIdx * 2 + 1;
          }
        }
        console.log(scope.startingIdx, scope.lastIdx);
      }

      scope.getDivHeight = function (idx) {
        var lineHeights = {
          bar: 32,
          quarter: 8,
          eighths: 4
        }

        var quarterWidth = 32;

        if (scope.data.notesPerMeasure === 8) {
          scope.width = quarterWidth / 2;

          if (idx % 8 === 0) {
            // scope.heightKey = lineHeights.bar;
            return lineHeights.bar;
          }
          else if (idx % 2 === 0) {
            // scope.heightKey = lineHeights.quarter;
            return lineHeights.quarter;
          }
          else {
            // scope.heightKey = lineHeights.eighths;
            return lineHeights.eighths;
          }
        }
        else {
          scope.width = quarterWidth + 1;

          if (scope.$index % 4 === 0) {
            scope.heightKey = lineHeights.bar;
          }
          else {
            scope.heightKey = lineHeights.quarter;
          }
        }
      }


// if eventGrouping === 'colors'
// show.event


      // var borderThickness = 2;



    }
  }
})
