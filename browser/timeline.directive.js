app.directive('timelineDirective', function () {
  return {
    templateUrl: '/timeline.directive.html',
    scope: {
      heightKey: "@",
      widthKey: "@",
      index: "@",
      eventGrouping: "@",
      data: "=",
      getDivHeight: "&"
    },
    link: function (scope) {

      // var lineHeights = {
      //   bar: 32,
      //   quarter: 8,
      //   eighths: 4
      // }
      //
      // var quarterWidth = 32;
      // // var borderThickness = 2;
      //
      // if (scope.data.notesPerMeasure === 8) {
      //   scope.width = quarterWidth / 2;
      //
      //   if (scope.$index % 8 === 0) {
      //     scope.heightKey = lineHeights.bar;
      //   }
      //   else if (scope.$index % 2 === 0) {
      //     scope.heightKey = lineHeights.quarter;
      //   }
      //   else {
      //     scope.heightKey = lineHeights.eighths;
      //   }
      // }
      // else {
      //   scope.width = quarterWidth + 1;
      //
      //   if (scope.$index % 4 === 0) {
      //     scope.heightKey = lineHeights.bar;
      //   }
      //   else {
      //     scope.heightKey = lineHeights.quarter;
      //   }
      // }


      // console.log(scope.data.notesPerMeasure);

      //changing the $watch parameter to an object gets it to successfully
      //enter the IF-else loop.

      scope.$watch('data.notesPerMeasure', function (newValue, oldValue) {
        // console.log(scope.notesPerMeasure, scope.index);

        // scope.heightKey = scope.getDivHeight(scope.index);
        // console.log(scope.heightKey);
        // console.log(newValue);
        // scope.notesPerMeasure = newValue;
        // scope.quarterWidth =
        var quarterWidth = 32;

        var lineHeights = {
          bar: 32,
          quarter: 8,
          eighths: 4
        }

        // scope.notesPerMeasure = newValue;

        if (newValue === 4) {


          scope.widthKey = quarterWidth + 1;

          if (scope.index % 4 === 0) {
            scope.heightKey = lineHeights.bar;
          }
          else {
            scope.heightKey = lineHeights.quarter;
          }
          // console.log(scope.$index)

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
