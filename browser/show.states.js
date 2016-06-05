app.config(function ($stateProvider) {
  $stateProvider
    .state('home', {
      url:'/',
      templateUrl: '/home.html',
      resolve: {
        shows: function (ShowFactory) {
          return ShowFactory.getShows();
        }
      },
      controller: function ($scope, shows, ShowFactory) {
        console.log('yo');
        $scope.options = ['Create New', 'Open'];
        $scope.shows = shows;
        $scope.makeActive = function (idx) {
          $scope.activeIdx = idx;
        }
      }
    })
    .state('createShow', {
      url: '/shows/create',
      templateUrl: '/show.new.html',
      controller: function ($scope, ShowFactory) {
        // if (!$scope.show) $scope.show = {};
        // if (!$scope.show.events)
        //   $scope.show.events = [];
        // if (!$scope.show.savedTimelines)
        //   $scope.show.savedTimelines = {};

        if (!$scope.show) {
          $scope.show = ShowFactory.initializeShow();
        }
        $scope.tabs = [
          { title: 'Edit' },
          { title: 'Preview'}
        ];
        $scope.isCurrentTimeline = function (currentIdx, startingIdx, lastIdx, eventGrouping) {
          // console.log(arguments);
          return currentIdx >= startingIdx && currentIdx <= lastIdx && $scope.activeArrayKey === eventGrouping;
        }
        $scope.isAddedToShow = function (currentIdx, eventGrouping) {
          // if ($scope.show) {
            // console.log($scope.show.savedTimelines);
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
    })
    .state('editShow', {
      url: '/shows/:id',
      templateUrl: '/show.edit.html',
      // controller: 'EditShowCtrl',
      resolve: {
        show: function ($stateParams, ShowFactory) {
            return ShowFactory.getShow($stateParams.id);
        }
      },
      controller: function ($scope, show) {
        $scope.show = show;
        $scope.isCurrentTimeline = function (currentIdx, startingIdx, lastIdx, eventGrouping) {
          // console.log(arguments);
          return currentIdx >= startingIdx && currentIdx <= lastIdx && $scope.activeArrayKey === eventGrouping;
        }
        $scope.isAddedToShow = function (currentIdx, eventGrouping) {
          // if ($scope.show) {
            // console.log($scope.show.savedTimelines);
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
        // $scope.myTitle = show.name;
      }
    })
})
