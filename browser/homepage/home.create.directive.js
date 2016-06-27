app.directive('homeCreate', function () {
  return {
    templateUrl: '/homepage/home.create.directive.html',
    controller: function ($scope, $state) {
      // var audioElem = angular.element(document.querySelector('#audio'));
      $scope.song = {};
      $scope.show = {
        settings: {
          bpm: 60
        },
        song: {}
      }
      var audio = document.createElement('audio');
      var songPath = '../../public/songs/';
      $scope.$watch('files.length', function (newVal, oldVal) {
        console.log($scope.files);
        if ($scope.files) {
          if ($scope.files.length) {
            $scope.show.song.fileName = $scope.files[0].lfFileName;
            $scope.show.song.name = $scope.files[0].lfFileName.split('.')[0];

            audio.src = songPath + $scope.show.song.fileName;
            // console.log(audioElem, audioElem.prop('src'));
            // console.log(audioElem, audioElem.prop('duration'));
            audio.load();

          }
        }


        audio.addEventListener('canplaythrough', function (e) {
          console.log(audio, e)
          console.log(audio.duration);
          $scope.show.song.duration = audio.duration;
          $scope.$digest();
          console.log('were here', $scope.show, $scope.show.song.duration);
        })

      })

      $scope.goToTimelines = function () {
        $state.go('createShow', { show: $scope.show });
        $scope.disableSidebar = true;
      }


      // audio.src = ''
    }
  }
})
