app.config(function ($stateProvider) {
  $stateProvider
    // .state('show', {
    //   url: '/show',
    //   templateUrl: '/show.html',
    // })
    .state('show', {
      url: '/show/edit',
      templateUrl: '/editshow.html',
      controller: 'EditShowCtrl'
    })
})
