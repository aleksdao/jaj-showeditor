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
          params: ['color', 'backgroundColor']
        },
        fadeColorTo: {
          label: 'Fade Color To',
          params: ['color', 'backgroundColor', 'transitionTime', 'preload']
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

      // if (!scope.show.events)
      //   scope.show.events = [];

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
        console.log(scope.newEvent);
        scope.show.events.push(scope.newEvent);
        scope.highlightSaved(scope.newEvent);
        resetEvent();
      }

      function resetEvent () {
        scope.eventStartTime = undefined;
        scope.eventEndTime = undefined;
        scope.newEvent = undefined;

        //better to reset startingIdx, lastIdx to undefined rather
        //than null because null seems to get treated like 0 when used
        //in >= and <=

        scope.startingIdx = undefined;
        scope.lastIdx = undefined;
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



      scope.convertToQuarters = function (idx, isQuarterResolution) {
        if (isQuarterResolution) {
          return idx * 2 + 1;
        }
        else {
          return (idx - 1) / 2;
        }
      }


      scope.highlightSaved = function (newEvent) {

        scope.show.savedTimelines[newEvent.activeArrayKey].savedEvents.push(newEvent);

        for (var i = newEvent.startIdx; i <= newEvent.endIdx; i++) {

          if (newEvent.activeArrayKey === 'colors') {
            if (scope.isQuarterResolution) {

              var eighthIdx = scope.convertToQuarters(i, true)
              scope.show.savedTimelines.colors.savedQuartersIdx[i] = newEvent.params.color;
              scope.show.savedTimelines.colors.savedEighthsIdx[eighthIdx] = newEvent.params.color;

            }
            else {

              var quarterIdx = scope.convertToQuarters(i, false)
              scope.show.savedTimelines.colors.savedEighthsIdx[i] = newEvent.params.color;
              scope.show.savedTimelines.colors.savedQuartersIdx[quarterIdx] = newEvent.params.color;

            }
          }
          else {
            if (scope.isQuarterResolution) {

              var eighthIdx = scope.convertToQuarters(i, true)
              scope.show.savedTimelines[newEvent.activeArrayKey].savedQuartersIdx.push(i);
              scope.show.savedTimelines[newEvent.activeArrayKey].savedEighthsIdx.push(eighthIdx);

            }
            else {

              var quarterIdx = scope.convertToQuarters(i, false)
              scope.show.savedTimelines[newEvent.activeArrayKey].savedEighthsIdx.push(i);
              scope.show.savedTimelines[newEvent.activeArrayKey].savedQuartersIdx.push(quarterIdx);

            }
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
