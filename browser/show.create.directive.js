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

        scope.startingIdx = undefined;
        scope.lastIdx = undefined;
      }

      scope.selectIdx = function (idx, arrayKey) {
        console.log(scope.show);
        if (scope.activeArrayKey !== arrayKey) {
          scope.startingIdx = undefined;
          scope.lastIdx = undefined;
        }
        scope.activeArrayKey = arrayKey;


        //if idx inside of savedQuarters, ignore completely. startingIdx = undefined
        // if (scope.show.savedTimelines.savedQuartersIdx)
        var checkThisSavedIdx;
        if (scope.isQuarterResolution) {
          checkThisSavedIdx = scope.show.savedTimelines[arrayKey].savedQuartersIdx;
        }
        else {
          checkThisSavedIdx = scope.show.savedTimelines[arrayKey].savedEighthsIdx;
        };


        if (scope.startingIdx === undefined) {
          if (arrayKey === 'colors') {
            if (checkThisSavedIdx[idx]) return;
          }
          else {
            if (checkThisSavedIdx.indexOf(idx) >= 0) return;
          }
          scope.startingIdx = idx;
          scope.lastIdx = idx;

        }
        else if (scope.startingIdx >= idx) {
          scope.startingIdx = undefined;
          scope.lastIdx = undefined;
        }
        else {
          var iterator = scope.startingIdx;
          var collided = false;
          if (arrayKey === 'colors') {
            while (iterator < idx) {
              if (checkThisSavedIdx[iterator]) {
                collided = true;
                break;
              }
              iterator++;
            }
          }
          else {
            while (iterator < idx) {
              if (checkThisSavedIdx.indexOf(iterator) >= 0) {
                collided = true;
                break;
              }
              iterator++;
            }
          }

          if (collided) scope.lastIdx = iterator - 1;
          else  scope.lastIdx = iterator;
        }
        scope.eventStartTime = ShowFactory.convertToMusicalTime(scope.startingIdx, scope.lastIdx, scope.isQuarterResolution).eventStartTime;
        scope.eventEndTime = ShowFactory.convertToMusicalTime(scope.startingIdx, scope.lastIdx, scope.isQuarterResolution).eventEndTime;

        console.log(scope.startingIdx, scope.lastIdx, arrayKey);

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
