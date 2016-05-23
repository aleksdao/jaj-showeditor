app.controller('AppCtrl', function ($scope) {
  var canvas = document.getElementById('myCanvas');
  canvas.addEventListener('mousedown', returnTick, false);

//   $scope.createEvent = function () {
// //
//     EventFactory.createEvent($scope.musicalTiming)
//
//   }



  function returnTick (event) {
    var rect = canvas.getBoundingClientRect();
    var canvasX = event.clientX - boundingRect.left;
    var canvasY = event.clientY - boundingRect.top;
    var closestTick = ((canvasX - 100) / 12.5);
    var tick;
    var bars;
    var quarters;
    var sixteenths;
    // console.log(; // timeline starts at 100px
    if (.8 <= closestTick % 1 && closestTick % 1 <= 1) {
      console.log('between .8 and 1. taking ceiling: ', Math.ceil((canvasX - 100) / 12.5), ' sixteenths');
      tick = Math.ceil((canvasX - 100) / 12.5);
    }
    else if (0 <= closestTick % 1 && closestTick % 1 <= .2) {
      console.log('between 0 and .2. taking floor: ', Math.floor((canvasX - 100) / 12.5), ' sixteenths');
      tick = Math.floor((canvasX - 100) / 12.5);
    }
    else {
      console.log('No Match');
      return;
    }
    // return canvasX;
    if (tick >= 16) {
      bars = Math.floor(tick / 16);
      tick = tick - bars * 16;
    }
    else {
      bars = 0;
    }
    if (tick >= 4) {
      quarters = Math.floor(tick / 4);
      tick = tick - quarters * 4;
    }
    else {
      quarters = 0;
    }
    sixteenths = tick;
    $scope.actionTime = bars + ':' + quarters + ':' + sixteenths;
    console.log($scope.actionTime);
    if (!$scope.actionTimes) $scope.actionTimes = [];
    $scope.actionTimes.push($scope.actionTime);


  }
})
