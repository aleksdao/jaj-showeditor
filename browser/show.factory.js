app.factory("ShowFactory", function ($http) {
  var factory = {};
  // function formatShowForDb (show) {
  //
  // }

  factory.createShow = function (show) {

    return $http.post('/api/shows', { show: show })
      .then(function (response) {
        return response.data;
      })
  }
  return factory;
})
