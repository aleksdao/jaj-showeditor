app.directive('showTemplate', function () {
  return {
    templateUrl: '/show.template.directive.html',
    controller: function ($scope, ShowFactory) {
      var numMeasures;
      var totalEighthNotes;

      function calculateNumMeasures () {
        //rounding up
        numMeasures = Math.ceil($scope.song.duration / (240 / $scope.show.settings.bpm));
        console.log(numMeasures);
        totalEighthNotes = numMeasures * 8;
      }

      calculateNumMeasures();

      $scope.timelinesArray = {
        colors: {
          array: Array(totalEighthNotes),
          icon: 'color_lens'
        },
        text: {
          array: Array(totalEighthNotes),
          icon: 'text_format'
        },
        phone: {
          array: Array(totalEighthNotes),
          icon: 'smartphone'
        }
      }

      $scope.tabs = [
        { title: 'Edit' },
        { title: 'Preview'}
      ];

      $scope.selectIdx = function (idx, checkArrayKey) {
        ShowFactory.selectIdx(idx, checkArrayKey, $scope.isQuarterResolution, $scope.show);
        $scope.newEvent = ShowFactory.getNewEvent();
        $scope.activeArrayKey = ShowFactory.getActiveArrayKey();
        $scope.startingIdx = ShowFactory.getStartingIdx();
        $scope.lastIdx = ShowFactory.getLastIdx();
        $scope.newEvent.time = ShowFactory.convertToMusicalTime($scope.startingIdx, $scope.lastIdx, $scope.isQuarterResolution).eventStartTime;
        $scope.newEvent.endTime = ShowFactory.convertToMusicalTime($scope.startingIdx, $scope.lastIdx, $scope.isQuarterResolution).eventEndTime;
      }

      $scope.isCurrentTimeline = function (currentIdx, startingIdx, lastIdx, eventGrouping, matchThis) {
        return currentIdx >= startingIdx && currentIdx <= lastIdx && $scope.activeArrayKey === eventGrouping && eventGrouping === matchThis;
      }

      $scope.isAddedToShow = function (currentIdx, eventGrouping, matchThis) {

        if (eventGrouping === 'colors' && matchThis === 'colors') {
          return ($scope.isQuarterResolution ?
            $scope.show.savedTimelines[eventGrouping].savedQuartersIdx[currentIdx] :
            $scope.show.savedTimelines[eventGrouping].savedEighthsIdx[currentIdx]
          );
        }
        else if (eventGrouping === matchThis) {
          return ($scope.isQuarterResolution ?
            $scope.show.savedTimelines[eventGrouping].savedQuartersIdx.indexOf(currentIdx) >=0 :
            $scope.show.savedTimelines[eventGrouping].savedEighthsIdx.indexOf(currentIdx) >=0
          )
        }
      }

      $scope.highlightCellOrNot = function (currentIdx, eventGrouping, matchThis) {
        return $scope.isCurrentTimeline(currentIdx, $scope.startingIdx, $scope.lastIdx, eventGrouping, matchThis) || $scope.isAddedToShow(currentIdx, eventGrouping, matchThis);
      }
    }
  }
})
