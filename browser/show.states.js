app.config(function ($stateProvider) {
  $stateProvider
    .state('createShow', {
      url: '/shows/create',
      templateUrl: '/show.new.state.html',
      params: {
        show: undefined
      },
      controller: function ($scope, ShowFactory, $stateParams) {

          $scope.show = ShowFactory.initializeShow($stateParams);
          console.log($scope.show);

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
