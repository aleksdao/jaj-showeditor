app.controller('EditShowCtrl', function ($scope, NgTableParams, ShowFactory) {

  $scope.actions = ['changeColor', 'fadeColorTo', 'changeText', 'resetScreen'];
  var actionLabels = ['Change Color', 'Fade Color To', 'Change Text', 'Reset Screen'];
  var selectLabels = ['Select Action', 'Select Start Time', 'Select Parameters'];

  $scope.actionsObj = {
    changeColor: {
      label: 'Change Color',
      params: ['color', 'backgroundColor']
    },
    fadeColorTo: {
      label: 'Fade Color To',
      params: ['color', 'backgroundColor', 'transitionTime']
    },
    changeText: {
      label: 'Change Text',
      params: ['text', 'color', 'target']
    },
    resetScreen: {
      label: 'Reset Screen',
      params: ['text', 'color', 'backgroundColor']
    }
  };

  var actionParams = {
    changeColor: ['color', 'backgroundColor'],
    fadeColorTo: ['color', 'backgroundColor', 'transitionTime'],
    changeText: ['text', 'color', 'target'],
    resetScreen: ['text', 'color', 'backgroundColor']
  };

  $scope.actions = [];
  $scope.show = {};

  var self = this;
  var data = $scope.actions;
  self.tableParams = new NgTableParams({}, { dataset: data });

  $scope.addAction = function () {
    if (!$scope.show.events) $scope.show.events = [];

    $scope.newAction.startTime = $scope.actionTime;
    $scope.newAction.actionLabel = $scope.actionsObj[$scope.newAction.action].label;
    console.log($scope.newAction);
    $scope.actions.push($scope.newAction);
    $scope.show.events.push($scope.newAction);
    $scope.actionTime = null;
    $scope.newAction = null;

  }

  $scope.createShow = function () {
    console.log($scope.show);
    ShowFactory.createShow($scope.show)
      .then(function (show) {
        console.log('created show', show);
      })
  }


})
