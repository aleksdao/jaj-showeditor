app.factory("ShowFactory", function ($http) {
  var factory = {};
  // function formatShowForDb (show) {
  //
  // }

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


  return factory;
})