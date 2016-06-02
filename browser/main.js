'use strict';

var app = angular.module('showEditor', ['gg.editableText', 'ngMaterial', 'ngTable', 'ngMaterialDatePicker', 'ui.router', 'mdColorPicker']);

app.config(function ($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  // $urlRouterProvider.otherwise('/show/edit');
})
