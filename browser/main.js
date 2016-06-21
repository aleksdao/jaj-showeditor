'use strict';

var app = angular.module('showEditor', ['gg.editableText', 'ngMaterial', 'ngTable', 'ngMaterialDatePicker', 'ui.router', 'mdColorPicker']);

app.config(function ($urlRouterProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.html5Mode(true);
  $mdThemingProvider.theme('default')
     .primaryPalette('grey')
     .accentPalette('teal', {
       default:'A400'
     })
     .dark();
})
