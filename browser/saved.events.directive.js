app.directive('savedEvents', function () {
  return {
    templateUrl: '/saved.events.directive.html',
    controller: function ($scope, NgTableParams) {

      var self = this;
      var data = $scope.show.events;
      self.tableParams = new NgTableParams({}, { dataset: data });

    }
  }
})
