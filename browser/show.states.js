app.config(function ($stateProvider) {
  $stateProvider
    .state('shows', {
      url:'/shows',
      templateUrl: '/shows.html',
      controller: ''
    })
    .state('createShow', {
      url: '/shows/create',
      templateUrl: '/show.new.html',
      controller: function ($scope) {
        $scope.tabs = [
          { title: 'Edit' },
          { title: 'Preview'}
        ];
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
        // $scope.myTitle = show.name;
      }
    })
})
