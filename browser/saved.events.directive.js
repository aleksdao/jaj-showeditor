app.directive('savedEvents', function () {
  return {
    templateUrl: '/saved.events.directive.html',
    controller: function ($scope, NgTableParams, ShowFactory) {

      var self = this;
      var data = $scope.show.events;
      self.tableParams = new NgTableParams({}, { dataset: data });

      $scope.removeEvent = function (idx) {
        ShowFactory.removeEvent(idx);
        $scope.show = ShowFactory.getCurrentShow();
      }

    }
  }
})
