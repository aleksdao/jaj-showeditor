app.directive('showTemplate', function () {
  return {
    templateUrl: '/show.template.directive.html',
    controller: function ($scope) {
      // if (!show) {
      //   console.log($stateParams.showName);
      //   $scope.show = ShowFactory.initializeShow();
      //   $scope.show.name = $stateParams.showName;
      //   $scope.show.settings.bpm = $stateParams.bpm;
      // }
      // else {
      //   $scope.show = show;
      // }

      $scope.tabs = [
        { title: 'Edit' },
        { title: 'Preview'}
      ];

      $scope.isCurrentTimeline = function (currentIdx, startingIdx, lastIdx, eventGrouping) {
        return currentIdx >= startingIdx && currentIdx <= lastIdx && $scope.activeArrayKey === eventGrouping;
      }

      $scope.isAddedToShow = function (currentIdx, eventGrouping) {

        if (eventGrouping === 'colors') {
          return ($scope.isQuarterResolution ?
            $scope.show.savedTimelines[eventGrouping].savedQuartersIdx[currentIdx] :
            $scope.show.savedTimelines[eventGrouping].savedEighthsIdx[currentIdx]
          );
        }
        else {
          return ($scope.isQuarterResolution ?
            $scope.show.savedTimelines[eventGrouping].savedQuartersIdx.indexOf(currentIdx) >=0 :
            $scope.show.savedTimelines[eventGrouping].savedEighthsIdx.indexOf(currentIdx) >=0
          )
        }
      }
    }
  }
})