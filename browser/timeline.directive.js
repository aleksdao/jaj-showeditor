app.directive('timelineDirective', function () {
  return {
    templateUrl: '/timeline.directive.html',
    link: function (scope) {
      var lineHeights = {
        bar: 32,
        quarter: 8,
        eighths: 4
      }

      var quarterWidth = 32;
      // var borderThickness = 2;

      if (scope.data.notesPerMeasure === 8) {
        scope.width = quarterWidth / 2;

        // console.log(scope.$index)
        if (scope.$index % 8 === 0) {
          scope.heightKey = lineHeights.bar;
        }
        else if (scope.$index % 2 === 0) {
          scope.heightKey = lineHeights.quarter;
        }
        else {
          scope.heightKey = lineHeights.eighths;
        }
      }
      else {
        scope.width = quarterWidth + 1;

        if (scope.$index % 4 === 0) {
          scope.heightKey = lineHeights.bar;
        }
        else {
          scope.heightKey = lineHeights.quarter;
        }
      }


      // console.log(scope.data.notesPerMeasure);
      scope.$watch('data.notesPerMeasure', function (newValue, oldValue) {
        // console.log(newValue);
        scope.data.notesPerMeasure = newValue;
        if (scope.data.notesPerMeasure === 4) {
          // console.log(scope.data.notesPerMeasure);

          scope.width = quarterWidth + 1;
          // scope.leftBorder = borderThickness;

        }
        else {
          scope.width = quarterWidth / 2;
          // scope.leftBorder = borderThickness / 2;

        }

        if (scope.data.notesPerMeasure === 8) {
          if (scope.$index % 8 === 0) {
            scope.heightKey = lineHeights.bar;
          }
          else if (scope.$index % 2 === 0) {
            scope.heightKey = lineHeights.quarter;
          }
          else {
            scope.heightKey = lineHeights.eighths;
          }
        }
        else {
          if (scope.$index % 4 === 0) {
            scope.heightKey = lineHeights.bar;
          }
          else {
            scope.heightKey = lineHeights.quarter;
          }
        }
      })



    }
  }
})
