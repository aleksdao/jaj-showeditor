app.directive('homeCreate', function () {
  return {
    templateUrl: '/homepage/home.create.directive.html',
    controller: function ($scope) {
      // var audioElem = angular.element(document.querySelector('#audio'));
      $scope.song = {};
      $scope.show = {
        bpm: 60
      };
      var audio = document.createElement('audio');
      var songPath = '../../public/songs/';
      $scope.$watch('files.length', function (newVal, oldVal) {
        console.log($scope.files);
        if ($scope.files) {
          if ($scope.files.length) {
            $scope.song.name = $scope.files[0].lfFileName;
            // audioElem.prop('src', songPath + $scope.files[0].lfFileName);
            audio.src = songPath + $scope.song.name;
            // console.log(audioElem, audioElem.prop('src'));
            // console.log(audioElem, audioElem.prop('duration'));
            console.log(audio);
            audio.load();


          }
        }

        // audioElem.on('onloadedmetadata', function (e) {
        //   console.log(e.currentTarget);
        // })

        audio.addEventListener('canplaythrough', function (e) {
          console.log(audio, e)
          console.log(audio.duration);
          $scope.song.duration = audio.duration;
          console.log($scope.song);
        })

      })


      // audio.src = ''
    }
  }
})
