app.controller('AppCtrl', function ($scope) {

  $scope.myTitle = 'Awesome Sequence';
  $scope.data = {
    qtrResolution: false,
    notesPerMeasure: 8
  }

  $scope.tabs = [
    { title: 'Edit' },
    { title: 'Preview'}
  ];

  $scope.timelinesArray = {
    colors: Array(200),
    text: Array(200),
    phone: Array(200)
  }


  $scope.selectIdx = function (idx, arrayKey) {
    if ($scope.activeArrayKey !== arrayKey) {
      $scope.startingIdx = undefined;
      $scope.lastIdx = undefined;
    }
    $scope.activeArrayKey = arrayKey;

    if ($scope.startingIdx === undefined) {

      $scope.startingIdx = idx;
      $scope.lastIdx = idx;

    }
    else if ($scope.startingIdx >= idx) {
      $scope.startingIdx = undefined;
      $scope.lastIdx = undefined;
    }
    else {
      $scope.lastIdx = idx;
    }
    $scope.convertToMusicalTime($scope.startingIdx, $scope.lastIdx);
    console.log($scope.startingIdx, $scope.lastIdx, arrayKey);


  }

  $scope.shouldHighlight = function (index, arrayKey) {
    // console.log(scope.$index, scope.startingIdx, scope.lastIdx);
    return
  }


  $scope.changeResolution = function (resolution) {
    console.log(resolution);
    resolution ? $scope.data.notesPerMeasure = 4 : $scope.data.notesPerMeasure = 8;
  }

  $scope.convertToMusicalTime = function (startIdx, endIdx) {
    var configObj = {
      start: {
        idx: startIdx,
        scopeVar: 'actionTime'
      },
      end: {
        idx: endIdx,
        scopeVar: 'actionEndTime'
      }
    }
    var sixteenths;
    var quarters;
    var measures;
    var start;
    var end;
    for (var key in configObj) {
      var leftoverIdx = configObj[key].idx;
      if ($scope.qtrResolution) {
        measures = Math.floor((configObj[key].idx) / 4);
        quarters = (configObj[key].idx) - (measures * 4);
        sixteenths = 0;
      }
      else {
        measures = Math.floor((configObj[key].idx) / 8);
        leftoverIdx = leftoverIdx - (measures * 8);
        quarters = Math.floor(leftoverIdx / 2);
        leftoverIdx = leftoverIdx - quarters * 2;
        sixteenths = leftoverIdx * 2;
      }
      if (key === 'start')
        $scope.eventStartTime = measures + ':' + quarters + ':' + sixteenths;
      else {
        $scope.eventEndTime = measures + ':' + quarters + ':' + sixteenths;
      }
    }
  }
})
