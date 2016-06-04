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


  // $scope.selectIdx = function (idx, arrayKey) {
  //   if ($scope.activeArrayKey !== arrayKey) {
  //     $scope.startingIdx = undefined;
  //     $scope.lastIdx = undefined;
  //   }
  //   $scope.activeArrayKey = arrayKey;
  //
  //   if ($scope.startingIdx === undefined) {
  //
  //     $scope.startingIdx = idx;
  //     $scope.lastIdx = idx;
  //
  //   }
  //   else if ($scope.startingIdx >= idx) {
  //     $scope.startingIdx = undefined;
  //     $scope.lastIdx = undefined;
  //   }
  //   else {
  //     $scope.lastIdx = idx;
  //   }
  //   $scope.convertToMusicalTime($scope.startingIdx, $scope.lastIdx);
  //   console.log($scope.startingIdx, $scope.lastIdx, arrayKey);
  //
  //
  // }




  // $scope.changeResolution = function (qtrResolution) {
  //   // console.log(resolution);
  //   if (qtrResolution) {
  //     $scope.data.notesPerMeasure = 4
  //     if ($scope.startingIdx) {
  //       $scope.startingIdx = ($scope.startingIdx - 1) / 2;
  //       $scope.lastIdx = ($scope.lastIdx - 1) / 2;
  //     }
  //   }
  //   else {
  //     $scope.data.notesPerMeasure = 8;
  //     if ($scope.startingIdx) {
  //       $scope.startingIdx = $scope.startingIdx * 2 + 1;
  //       $scope.lastIdx = $scope.lastIdx * 2 + 1;
  //     }
  //   }
  //   console.log($scope.startingIdx, $scope.lastIdx);
  // }


})
