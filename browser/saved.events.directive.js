app.directive('savedEvents', function () {
  return {
    templateUrl: '/saved.events.directive.html',
    controller: function ($scope, NgTableParams, ShowFactory, $mdToast) {

      var self = this;
      var data = $scope.show.events;
      self.tableParams = new NgTableParams({}, { dataset: data });

      $scope.removeEvent = function (idx) {
        ShowFactory.removeEvent(idx);
        $scope.show = ShowFactory.getCurrentShow();
      }

      $scope.createShow = function () {

        console.log($scope.show);

        ShowFactory.createShow($scope.show)
          .then(function (show) {
            $mdToast.show({
              hideDelay: 3000,
              position: 'top right',
              templateUrl: '/created.show.toast.html',
              controller: function ($scope, $mdToast) {
                $scope.dismissToast = function () {
                  $mdToast.hide();
                }

              }
            })


// TBD What we do after creating show

            console.log('created show', show);
            return show;
          })
      }

    }
  }
})
