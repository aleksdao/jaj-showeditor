var scripts = document.getElementsByTagName("script")
var currentScriptPath = scripts[scripts.length-1].src;

app.directive('addEvent', function (NgTableParams, ShowFactory) {
  return {
    // templateUrl: currentScriptPath.replace('directive.js', 'directive.html'),
    templateUrl: '/addshow.directive.html',
    // scope: {
    //   actionTime: "=",
    //   actionTimes: "="
    // },
    link: function (scope, elem, attrs) {
      // scope.actionsObj = {};

      scope.actions = ['changeColor', 'fadeColorTo', 'changeText', 'resetScreen'];
      var actionLabels = ['Change Color', 'Fade Color To', 'Change Text', 'Reset Screen'];
      var selectLabels = ['Select Action', 'Select Start Time', 'Select Parameters'];

      scope.actionsObj = {
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

      scope.actions = [];
      scope.show = {};

      var self = this;
      var data = scope.actions;
      self.tableParams = new NgTableParams({}, { dataset: data });

      scope.addAction = function () {
        console.log(scope.startingIdx, scope.lastIdx);
        if (!scope.show.events) scope.show.events = [];

        scope.newAction.startTime = scope.eventStartTime;
        scope.newAction.endTime = scope.eventEndTime;
        scope.newAction.startIdx = scope.startingIdx;
        scope.newAction.endIdx = scope.lastIdx;
        scope.newAction.activeArrayKey = scope.activeArrayKey;
        scope.newAction.actionLabel = scope.actionsObj[scope.newAction.action].label;
        console.log(scope.newAction);
        scope.actions.push(scope.newAction);
        scope.show.events.push(scope.newAction);
        scope.highlightSaved(scope.newAction);
        scope.eventStartTime = null;
        scope.eventEndTime = null;
        scope.newAction = null;


      }



      scope.savedTimelines = {};



      scope.highlightSaved = function (newAction) {
        // console.log(newAction);
        if (!scope.savedTimelines[newAction.activeArrayKey]) {
          scope.savedTimelines[newAction.activeArrayKey] = {
            savedActions: [],
            savedIdx: []
          }
        }
        scope.savedTimelines[newAction.activeArrayKey].savedActions.push(newAction);
        for (var i = newAction.startIdx; i <= newAction.endIdx; i++) {
          console.log(i);
          scope.savedTimelines[newAction.activeArrayKey].savedIdx.push(i);
        }
        console.log(scope.savedTimelines);
      }

      scope.createShow = function () {
        console.log(scope.show);
        ShowFactory.createShow(scope.show)
          .then(function (show) {
            console.log('created show', show);
          })
      }

      scope.tabs = [
        { title: 'Edit' },
        { title: 'Preview'}
      ];



    }
  }
})
