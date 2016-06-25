app.directive('showTemplate', function () {
  return {
    templateUrl: '/show.template.directive.html',
    controller: function ($scope, ShowFactory) {
      var numMeasures;
      var resolution = 8;
      var totalEighthNotes;
      var audioDuration;
      $scope.songPlaying = false;

      function createWaveSurfer () {

        $scope.wavesurfer = WaveSurfer.create({
          container: '#waveform',
          progressColor: '#1DE9B6',
          cursorColor: '#FFF',
          barWidth: 6
        });
        $scope.wavesurfer.load('../public/songs/' + $scope.show.song.fileName);
        $scope.wavesurfer.on('ready', function () {
          // wavesurfer.play();
          $scope.songLoaded = true;
          // audioDuration = $scope.wavesurfer.getDuration();
        });

      }

      $scope.toggleSong = function () {
        if (!$scope.songPlaying) {
          $scope.wavesurfer.play();
          $scope.songPlaying = true;
        }
        else {
          $scope.wavesurfer.pause();
          $scope.songPlaying = false;
        }
      }




      function calculateNumMeasures () {
        //rounding up
        console.log($scope.show);
        numMeasures = Math.ceil($scope.show.song.duration / (240 / $scope.show.settings.bpm));
        console.log(numMeasures);
        totalEighthNotes = numMeasures * 8;
        // $scope.timeline
        $scope.timelineWidth = totalEighthNotes * 17.33;
      }

      $scope.createTimelinesArray = function (resolution) {
        $scope.timelinesArray = {
          colors: {
            array: Array(numMeasures * resolution),
            icon: 'color_lens'
          },
          text: {
            array: Array(numMeasures * resolution),
            icon: 'text_format'
          },
          phone: {
            array: Array(numMeasures * resolution),
            icon: 'smartphone'
          }
        }
      }

      calculateNumMeasures();
      createWaveSurfer();
      $scope.createTimelinesArray(resolution);





      $scope.changeResolution = function (isQuarterResolution) {

        // isQuarterResolution ? scope.data.notesPerMeasure = 4 : scope.data.notesPerMeasure = 8;
        ShowFactory.changeResolution();
        $scope.data.notesPerMeasure = ShowFactory.getNotesPerMeasure();
        $scope.isQuarterResolution = ShowFactory.isQuarterResolution();
        console.log('scopeQtr', $scope.isQuarterResolution, 'localQtr', isQuarterResolution);
        if (isQuarterResolution) resolution = 4;
        else resolution = 8;

        $scope.createTimelinesArray(resolution);

        if ($scope.startingIdx) {
          $scope.startingIdx = ShowFactory.convertToIdx($scope.newEvent.time, isQuarterResolution);
          $scope.lastIdx = ShowFactory.convertToIdx($scope.newEvent.endTime, isQuarterResolution);
        }

        console.log($scope.startingIdx, $scope.lastIdx);
      }

      $scope.tabs = [
        { title: 'Edit' },
        { title: 'Preview'}
      ];

      $scope.selectIdx = function (idx, checkArrayKey) {
        ShowFactory.selectIdx(idx, checkArrayKey, $scope.isQuarterResolution, $scope.show);
        $scope.newEvent = ShowFactory.getNewEvent();
        $scope.activeArrayKey = ShowFactory.getActiveArrayKey();
        $scope.startingIdx = ShowFactory.getStartingIdx();
        $scope.lastIdx = ShowFactory.getLastIdx();
        $scope.newEvent.time = ShowFactory.convertToMusicalTime($scope.startingIdx, $scope.lastIdx, $scope.isQuarterResolution).eventStartTime;
        $scope.newEvent.endTime = ShowFactory.convertToMusicalTime($scope.startingIdx, $scope.lastIdx, $scope.isQuarterResolution).eventEndTime;
      }

      $scope.isCurrentTimeline = function (currentIdx, startingIdx, lastIdx, eventGrouping, matchThis) {
        return currentIdx >= startingIdx && currentIdx <= lastIdx && $scope.activeArrayKey === eventGrouping && eventGrouping === matchThis;
      }

      $scope.isAddedToShow = function (currentIdx, eventGrouping, matchThis) {

        if (eventGrouping === 'colors' && matchThis === 'colors') {
          return ($scope.isQuarterResolution ?
            $scope.show.savedTimelines[eventGrouping].savedQuartersIdx[currentIdx] :
            $scope.show.savedTimelines[eventGrouping].savedEighthsIdx[currentIdx]
          );
        }
        else if (eventGrouping === matchThis) {
          return ($scope.isQuarterResolution ?
            $scope.show.savedTimelines[eventGrouping].savedQuartersIdx.indexOf(currentIdx) >=0 :
            $scope.show.savedTimelines[eventGrouping].savedEighthsIdx.indexOf(currentIdx) >=0
          )
        }
      }

      $scope.highlightCellOrNot = function (currentIdx, eventGrouping, matchThis) {
        return $scope.isCurrentTimeline(currentIdx, $scope.startingIdx, $scope.lastIdx, eventGrouping, matchThis) || $scope.isAddedToShow(currentIdx, eventGrouping, matchThis);
      }
    }
  }
})
