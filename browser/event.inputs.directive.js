app.directive('eventInputs', function (NgTableParams, ShowFactory) {
  return {
    templateUrl: '/event.inputs.directive.html',
    link: function (scope, elem, attrs) {

      // var self = this;
      // var data = scope.show.events;
      // self.tableParams = new NgTableParams({}, { dataset: data });

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

      // scope.changeResolution = function (isQuarterResolution) {
      //
      //   // isQuarterResolution ? scope.data.notesPerMeasure = 4 : scope.data.notesPerMeasure = 8;
      //   ShowFactory.changeResolution();
      //   scope.data.notesPerMeasure = ShowFactory.getNotesPerMeasure();
      //   scope.isQuarterResolution = ShowFactory.isQuarterResolution();
      //
      //   if (scope.startingIdx) {
      //     scope.startingIdx = ShowFactory.convertToIdx(scope.newEvent.time, isQuarterResolution);
      //     scope.lastIdx = ShowFactory.convertToIdx(scope.newEvent.endTime, isQuarterResolution);
      //   }
      //
      //   console.log(scope.startingIdx, scope.lastIdx);
      // }

      scope.getDivHeight = function (idx) {


        var quarterWidth = 32;

        if (scope.data.notesPerMeasure === 8) {
          scope.width = quarterWidth / 2;
        }
        else {
          scope.width = quarterWidth + 1;
        }
        return ShowFactory.getDivHeight(idx);
      }
    }
  }
})
