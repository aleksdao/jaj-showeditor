app.config(function ($stateProvider) {
  $stateProvider
    // .state('home', {
    //   url:'/',
    //   templateUrl: '/home.html',
    //   resolve: {
    //     shows: function (ShowFactory) {
    //       return ShowFactory.getShows();
    //     }
    //   },
    //   controller: function ($scope, shows, ShowFactory) {
    //
    //     $scope.options = ['Create New', 'Open'];
    //     $scope.shows = shows;
    //     $scope.makeActive = function (idx) {
    //       $scope.activeIdx = idx;
    //     }
    //
    //   }
    // })
    .state('createShow', {
      url: '/shows/create',
      templateUrl: '/show.new.state.html',
      params: {
        showName: undefined,
        bpm: undefined
      },
      controller: function ($scope, ShowFactory, $stateParams) {

          $scope.show = ShowFactory.initializeShow();
          $scope.show.name = $stateParams.showName;
          $scope.show.settings.bpm = $stateParams.bpm;

      }
    })
    .state('editShow', {
      url: '/shows/:id',
      templateUrl: '/show.edit.state.html',
      resolve: {
        show: function ($stateParams, ShowFactory) {
            return ShowFactory.getShow($stateParams.id);
        }
      },
      controller: function ($scope, show) {
        console.log('show');
          $scope.show = show;

      }
    })
})
