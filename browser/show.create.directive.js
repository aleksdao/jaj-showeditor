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

      scope.eventGrouping = {
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

        scope.newAction.startTime = scope.eventStartTime;
        scope.newAction.endTime = scope.eventEndTime;
        scope.newAction.startIdx = scope.startingIdx;
        scope.newAction.endIdx = scope.lastIdx;
        scope.newAction.activeArrayKey = scope.activeArrayKey;
        scope.newAction.eventGrouping = scope.activeArrayKey;
        scope.newAction.actionLabel = scope.actionsObj[scope.newAction.action].label;
        console.log(scope.newAction);
        scope.show.events.push(scope.newAction);
        scope.highlightSaved(scope.newAction);
        scope.eventStartTime = null;
        scope.eventEndTime = null;
        scope.newAction = null;


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



      scope.highlightSaved = function (newAction) {
        // console.log(newAction);
        if (!scope.show.savedTimelines[newAction.activeArrayKey]) {
          scope.show.savedTimelines[newAction.activeArrayKey] = {
            savedEvents: [],
            savedIdx: []
          }
        }
        scope.show.savedTimelines[newAction.activeArrayKey].savedEvents.push(newAction);
        for (var i = newAction.startIdx; i <= newAction.endIdx; i++) {
          console.log(i);
          scope.show.savedTimelines[newAction.activeArrayKey].savedIdx.push(i);
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




    }
  }
})
