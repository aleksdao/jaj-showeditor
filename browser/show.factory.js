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

  factory.getShow = function (show) {
    return $http.get('/api/shows/' + show._id)
      .then(function (response) {
        var show = response.data;
        return show;
      })
  }

  factory.convertToIdx = function (time, resolution) {
    var idx = 0;
    var nums = time.split(':');
    var musicalTime = {
      measures: Number(nums[0]),
      quarters: Number(nums[1]),
      sixteenths: Number(nums[2]),
    }
    if (resolution === 'quarter') {
      idx += measures * 4 + quarters; // not accounting for sixteenths yet
    }
    else {
      idx += measures * 8 + quarters * 2 + sixteenths / 2;
    }

    return idx;

  }


  return factory;
})
