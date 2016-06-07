app.factory("ShowFactory", function ($http) {
  var factory = {};
  // function formatShowForDb (show) {
  //
  // }

  var startingIdx;
  var lastIdx;
  var activeArrayKey;


  factory.createShow = function (show) {

    return $http.post('/api/shows', { show: show })
      .then(function (response) {
        console.log(response);
        return response.data;
      })
  }

  factory.getShow = function (id) {
    return $http.get('/api/shows/' + id)
      .then(function (response) {
        var show = response.data;
        return show;
      })
  }

  factory.getShows = function () {
    return $http.get('/api/shows')
      .then(function (response) {
        var shows = response.data;
        console.log(shows);
        return shows;
      })
  }

  factory.convertToIdx = function (time, isQuarterResolution) {
    var idx = 0;
    var nums = time.split(':');
    var musicalTime = {
      measures: Number(nums[0]),
      quarters: Number(nums[1]),
      sixteenths: Number(nums[2]),
    }
    if (isQuarterResolution) {
      idx += musicalTime.measures * 4 + musicalTime.quarters; // not accounting for sixteenths yet
    }
    else {
      idx += musicalTime.measures * 8 + musicalTime.quarters * 2 + musicalTime.sixteenths / 2;
    }

    return idx;

  }

  factory.convertToMusicalTime = function (startIdx, endIdx, isQuarterResolution) {
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
    var toReturn = {};
    var sixteenths;
    var quarters;
    var measures;
    var start;
    var end;

    for (var key in configObj) {
      var leftoverIdx = configObj[key].idx;
      if (isQuarterResolution) {
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
        toReturn.eventStartTime = measures + ':' + quarters + ':' + sixteenths;
      else {
        toReturn.eventEndTime = measures + ':' + quarters + ':' + sixteenths;
      }
    }

    return toReturn;

  };

  factory.initializeShow = function () {
    var show = {};
    var eventGroupings = ['colors', 'text', 'phone'];
    show.events = [];
    show.savedTimelines = {};
    eventGroupings.forEach(function (eventGrouping) {
      show.savedTimelines[eventGrouping] = {
        savedEvents: [],
        savedEighthsIdx: [],
        savedQuartersIdx: []
      }
    })
    show.events = [];
    show.settings = {};
    return show;
  }

  factory.getActiveArrayKey = function () {
    return activeArrayKey;
  }

  factory.getStartingIdx = function () {
    console.log(startingIdx);
    return startingIdx;
  }

  factory.getLastIdx = function () {
    return lastIdx;
  }

  factory.resetEvent = function () {
    startingIdx = undefined;
    lastIdx = undefined;
    // activeArrayKey = undefined;
  }

  factory.selectIdx = function (idx, checkArrayKey, isQuarterResolution, show) {
    // console.log(scope.show);
    if (activeArrayKey !== checkArrayKey) {
      startingIdx = undefined;
      lastIdx = undefined;
    }

    activeArrayKey = checkArrayKey;


    //if idx inside of savedQuarters, ignore completely. startingIdx = undefined
    // if (scope.show.savedTimelines.savedQuartersIdx)
    var checkThisSavedIdx;
    if (isQuarterResolution) {
      checkThisSavedIdx = show.savedTimelines[activeArrayKey].savedQuartersIdx;
    }
    else {
      checkThisSavedIdx = show.savedTimelines[activeArrayKey].savedEighthsIdx;
    };


    if (startingIdx === undefined) {
      if (activeArrayKey === 'colors') {
        if (checkThisSavedIdx[idx]) return;
      }
      else {
        if (checkThisSavedIdx.indexOf(idx) >= 0) return;
      }
      startingIdx = idx;
      lastIdx = idx;

    }
    else if (startingIdx >= idx) {
      startingIdx = undefined;
      lastIdx = undefined;
    }
    else {
      var iterator = startingIdx;

      //collided tracks whether or not the user's click for lastIdx conflicts with an already
      //existing event. if it detects a collision, we set collide to true. if there is no conflict,
      //collide remains false. we'll use the collided boolean to calculate lastIdx


      var collided = false;
      if (activeArrayKey === 'colors') {
        while (iterator < idx) {
          if (checkThisSavedIdx[iterator]) {
            collided = true;
            break;
          }
          iterator++;
        }
      }
      else {
        while (iterator < idx) {
          if (checkThisSavedIdx.indexOf(iterator) >= 0) {
            collided = true;
            break;
          }
          iterator++;
        }
      }

      //if there was a collision, we set the lastIdx to one index before the collision occurred
      //if no collision, we set lastIdx to where user clicked

      if (collided) lastIdx = iterator - 1;
      else lastIdx = iterator;
    }


    // console.log(scope.startingIdx, scope.lastIdx, arrayKey);
  }


  return factory;
})
