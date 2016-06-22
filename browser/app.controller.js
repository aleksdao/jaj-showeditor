app.controller('AppCtrl', function ($scope, ShowFactory) {

  // $scope.myTitle = 'Awesome Sequence';
  $scope.data = {
    qtrResolution: false,
    notesPerMeasure: 8
  }



  ShowFactory.getShows()
    .then(function (shows) {
      $scope.shows = shows;
    })


})
