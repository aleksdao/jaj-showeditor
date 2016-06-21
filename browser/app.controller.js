app.controller('AppCtrl', function ($scope, ShowFactory) {

  // $scope.myTitle = 'Awesome Sequence';
  $scope.data = {
    qtrResolution: false,
    notesPerMeasure: 8
  }

  $scope.timelinesArray = {
    colors: {
      array: Array(200),
      icon: 'color_lens'
    },
    text: {
      array: Array(200),
      icon: 'text_format'
    },
    phone: {
      array: Array(200),
      icon: 'smartphone'
    }
  }

  ShowFactory.getShows()
    .then(function (shows) {
      $scope.shows = shows;
    })


})
