app.directive('addEvent', function (NgTableParams, ShowFactory) {
  return {
    templateUrl: '/show.create.directive.html',
    link: function (scope, elem, attrs) {

      var self = this;
      var data = scope.show.events;
      self.tableParams = new NgTableParams({}, { dataset: data });

      scope.data.notesPerMeasure = 8;

      scope.eventGroupings = ShowFactory.getEventGroupings();
      scope.actionsObj = ShowFactory.getActionsObj();

      scope.addAction = function () {

        ShowFactory.addAction(scope.newEvent);
        scope.newEvent = ShowFactory.getNewEvent();
        scope.startingIdx = ShowFactory.getStartingIdx();
        scope.lastIdx = ShowFactory.getLastIdx();
        scope.activeArrayKey = ShowFactory.getActiveArrayKey();

      }

      scope.createShow = function () {

        console.log(scope.show);

        ShowFactory.createShow(scope.show)
          .then(function (show) {

// TBD What we do after creating show

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
