app.directive('homeDirective', function () {
  return {
    templateUrl: '/home.html',
    controller: function ($scope, ShowFactory) {

      $scope.options = ['Create New', 'Open'];
      $scope.shows = ShowFactory.getShows();
      $scope.makeActive = function (idx) {
        $scope.activeIdx = idx;
      }
    }
  }
})
