app.controller('AppCtrl', function ($scope, ShowFactory) {

  $scope.myTitle = 'Awesome Sequence';
  $scope.data = {
    qtrResolution: false,
    notesPerMeasure: 8
  }

  $scope.timelinesArray = {
    colors: Array(200),
    text: Array(200),
    phone: Array(200)
  }

  ShowFactory.getShows()
    .then(function (shows) {
      $scope.shows = shows;
    })


})
