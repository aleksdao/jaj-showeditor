app.directive('addEvent', function (NgTableParams, ShowFactory) {
  return {
    templateUrl: '/show.create.directive.html',
    link: function (scope, elem, attrs) {

      scope.data.notesPerMeasure = 8;

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
          params: ['color']
        },
        fadeColorTo: {
          label: 'Fade Color To',
          params: ['color', 'transitionTime', 'preload']
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

      var self = this;
      var data = scope.show.events;
      self.tableParams = new NgTableParams({}, { dataset: data });

      scope.addAction = function () {

        if (!scope.show.events)
          scope.show.events = [];

        console.log(scope.startingIdx, scope.lastIdx);

        scope.newEvent.time = scope.eventStartTime;
        scope.newEvent.endTime = scope.eventEndTime;
        scope.newEvent.startIdx = scope.startingIdx;
        scope.newEvent.endIdx = scope.lastIdx;
        scope.newEvent.activeArrayKey = scope.activeArrayKey;
        scope.newEvent.eventGrouping = scope.activeArrayKey;
        scope.newEvent.actionLabel = scope.actionsObj[scope.newEvent.action].label;
        if (scope.newEvent.action === 'fadeColorTo') {
          scope.newEvent.preload = true;
        }
        console.log(scope.newEvent);
        scope.show.events.push(scope.newEvent);
        scope.highlightSaved(scope.newEvent);
        resetEvent();
      }

      function resetEvent () {
        scope.eventStartTime = undefined;
        scope.eventEndTime = undefined;
        scope.newEvent = undefined;
        scope.activeArrayKey = undefined;

        //better to reset startingIdx, lastIdx to undefined rather
        //than null because null seems to get treated like 0 when used
        //in >= and <=

        ShowFactory.resetEvent();
        scope.startingIdx = ShowFactory.getStartingIdx();
        scope.lastIdx = ShowFactory.getLastIdx();
      }

      scope.highlightSaved = function (newEvent) {

        scope.show.savedTimelines[newEvent.activeArrayKey].savedEvents.push(newEvent);
        var startingQuarterIdx;
        var lastQuarterIdx;
        var startingEighthIdx;
        var lastEighthIdx;

        if (scope.isQuarterResolution) {
          startingQuarterIdx = newEvent.startIdx;
          lastQuarterIdx = newEvent.endIdx;
          startingEighthIdx = ShowFactory.convertToIdx(scope.eventStartTime, false);
          lastEighthIdx = ShowFactory.convertToIdx(scope.eventEndTime, false);
        }
        else {
          startingQuarterIdx = ShowFactory.convertToIdx(scope.eventStartTime, true)
          lastQuarterIdx = ShowFactory.convertToIdx(scope.eventEndTime, true)
          startingEighthIdx = newEvent.startIdx;
          lastEighthIdx = newEvent.endIdx;
        }

        if (newEvent.activeArrayKey === 'colors') {
          for (var i = startingQuarterIdx; i <= lastQuarterIdx; i++) {
            scope.show.savedTimelines.colors.savedQuartersIdx[i] = newEvent.params.color;
          }
          for (var j = startingEighthIdx; j <= lastEighthIdx; j++) {
            scope.show.savedTimelines.colors.savedEighthsIdx[j] = newEvent.params.color;
          }
        }
        else {
          for (var i = startingQuarterIdx; i <= lastQuarterIdx; i++) {
            scope.show.savedTimelines[newEvent.activeArrayKey].savedQuartersIdx.push(i);
          }
          for (var j = startingEighthIdx; j <= lastEighthIdx; j++) {
            scope.show.savedTimelines[newEvent.activeArrayKey].savedEighthsIdx.push(j);
          }
        }

        console.log(scope.show.savedTimelines);
      }

      scope.createShow = function () {

        console.log(scope.show);

        ShowFactory.createShow(scope.show)
          .then(function (show) {

            //DO WE RESET OR WHAT HAPPENS AFTER USER CREATES SHOW
            // scope.show = undefined;
            // scope.savedTimelines = undefined;
            // scope.show = undefined;
            // scope.activeArrayKey = undefined;

            console.log('created show', show);
            return show;
          })
      }

      // NEED TO REVISIT. ACCOUNT FOR EIGHTHTS SWITCHING TO QTR NOTES
      // NOT BEING ACCURATELY MEASURED

      scope.changeToResolution = function (isQuarterResolution) {

        isQuarterResolution ? scope.data.notesPerMeasure = 4 : scope.data.notesPerMeasure = 8;

        if (scope.startingIdx) {
          scope.startingIdx = ShowFactory.convertToIdx(scope.eventStartTime, isQuarterResolution);
          scope.lastIdx = ShowFactory.convertToIdx(scope.eventEndTime, isQuarterResolution);
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
            return lineHeights.bar;
          }
          else if (idx % 2 === 0) {
            return lineHeights.quarter;
          }
          else {
            return lineHeights.eighths;
          }
        }
        else {
          scope.width = quarterWidth + 1;

          if (idx % 4 === 0) {
            return lineHeights.bar;
          }
          else {
            return lineHeights.quarter;
          }
        }
      }
    }
  }
})
