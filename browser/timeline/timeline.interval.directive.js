app.directive('timelineDirective', function () {
  return {
    templateUrl: '/timeline/timeline.interval.directive.html',
    scope: {
      heightKey: "@",
      widthKey: "@",
      index: "@",
      startingIdx: "@",
      lastIdx: "@",
      eventGrouping: "@",
      data: "=",
      getDivHeight: "&"
    },
    link: function (scope) {

      //changing the $watch parameter to an object gets it to successfully
      //enter the IF-else loop.

      scope.$watch('data.notesPerMeasure', function (newValue, oldValue) {

        var quarterWidth = 32;

        var lineHeights = {
          bar: 32,
          quarter: 8,
          eighths: 4
        }

        if (newValue === 4) {

          scope.widthKey = quarterWidth + 1;

          if (scope.index % 4 === 0) {
            scope.heightKey = lineHeights.bar;
          }
          else {
            scope.heightKey = lineHeights.quarter;
          }

        }
        else {
          scope.widthKey = quarterWidth / 2;

          if (scope.index % 8 === 0) {
            scope.heightKey = lineHeights.bar;
          }
          else if (scope.index % 2 === 0) {
            scope.heightKey = lineHeights.quarter;
          }
          else {
            scope.heightKey = lineHeights.eighths;
          }
        }
      })

    }
  }
})
