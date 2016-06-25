app.factory("ShowFactory", function ($http) {
  var factory = {};
  // function formatShowForDb (show) {
  //
  // }

  var startingIdx;
  var lastIdx;
  var activeArrayKey;
  // var newEvent = {};
  var _newEvent = {};
  var eventStartTime;
  var eventEndTime;
  var show;
  // var width;
  var isQuarterResolution = false;

  var notesPerMeasure = 8;

  var lineHeights = {
    bar: 32,
    quarter: 8,
    eighths: 4
  }


  var eventGroupings = {
    colors: {
      actions: ['changeColorTo', 'fadeColorTo'],
      label: 'Colors'
    },
    text: {
      actions: ['changeTextTo', 'resetScreen'],
      label: 'Text'
    },
    phone: {
      actions: ['flash', 'vibrate'],
      label: 'Phone'
    }
  }

  var actionsObj = {
    changeColorTo: {
      label: 'Change Color',
      params: ['color']
    },
    fadeColorTo: {
      label: 'Fade Color To',
      params: ['color', 'transitionTime', 'preload']
    },
    changeTextTo: {
      label: 'Change Text',
      params: ['text', 'color', 'target']
    },
    resetScreen: {
      label: 'Reset Screen',
      params: ['text', 'color', 'backgroundColor']
    },
    flash: {
      label: 'Flash'
    },
    vibrate: {
      label: 'Vibrate'
    }
  };


  factory.getActionsObj = function () {
    return actionsObj;
  }

  factory.getEventGroupings = function () {
    return eventGroupings;
  }

// Factory API FUNCTIONS to Grab Data from Backend

  factory.createShow = function (show) {

    return $http.post('/api/shows', { show: show })
      .then(function (response) {
        console.log(response);
        return response.data;
      })
  }

  factory.getShow = function (id) {
    return $http.get('/api/shows/' + id)
      .then(function (response) {
        var show = response.data;
        return show;
      })
  }

  factory.getShows = function () {
    return $http.get('/api/shows')
      .then(function (response) {
        var shows = response.data;
        console.log(shows);
        return shows;
      })
  }

//Frontend factory functions used to manage
//the timelines

  factory.convertToIdx = function (time, isQuarterResolution) {
    var idx = 0;
    var nums = time.split(':');
    var musicalTime = {
      measures: Number(nums[0]),
      quarters: Number(nums[1]),
      sixteenths: Number(nums[2]),
    }
    if (isQuarterResolution) {
      idx += musicalTime.measures * 4 + musicalTime.quarters; // not accounting for sixteenths yet
    }
    else {
      idx += musicalTime.measures * 8 + musicalTime.quarters * 2 + musicalTime.sixteenths / 2;
    }

    return idx;

  }

  factory.convertToMusicalTime = function (startingIdx, lastIdx, isQuarterResolution) {
    var configObj = {
      start: {
        idx: startingIdx,
        scopeVar: 'actionTime'
      },
      end: {
        idx: lastIdx,
        scopeVar: 'actionEndTime'
      }
    }
    var toReturn = {};
    var sixteenths;
    var quarters;
    var measures;
    var start;
    var end;

    for (var key in configObj) {
      var leftoverIdx = configObj[key].idx;
      if (isQuarterResolution) {
        measures = Math.floor((configObj[key].idx) / 4);
        quarters = (configObj[key].idx) - (measures * 4);
        sixteenths = 0;
      }
      else {
        measures = Math.floor((configObj[key].idx) / 8);
        leftoverIdx = leftoverIdx - (measures * 8);
        quarters = Math.floor(leftoverIdx / 2);
        leftoverIdx = leftoverIdx - quarters * 2;
        sixteenths = leftoverIdx * 2;
      }

      if (key === 'start') {
        eventStartTime = measures + ':' + quarters + ':' + sixteenths;
        toReturn.eventStartTime = measures + ':' + quarters + ':' + sixteenths;
      }
      else {
        eventEndTime = measures + ':' + quarters + ':' + sixteenths;
        toReturn.eventEndTime = measures + ':' + quarters + ':' + sixteenths;
      }
    }

    return toReturn;

  };

  factory.changeResolution = function () {
    isQuarterResolution = !isQuarterResolution;
    if (isQuarterResolution) {
      notesPerMeasure = 4;
    }
    else {
      notesPerMeasure = 8;
    }
  }


  //seeds a show with empty objects and arrays

  factory.initializeShow = function (stateParams) {
    show = stateParams.show;
    var eventGroupings = ['colors', 'text', 'phone'];
    show.events = [];
    show.savedTimelines = {};
    eventGroupings.forEach(function (eventGrouping) {
      show.savedTimelines[eventGrouping] = {
        savedEvents: [],
        savedEighthsIdx: [],
        savedQuartersIdx: []
      }
    })
    show.events = [];
    // show.settings = {};
    // show.name = stateParams.showName;
    // show.settings.bpm = stateParams.bpm;
    // show.song = {
    //   name: stateParams.songName,
    //   duration: stateParams.songDuration,
    //   fileName: stateParams.songFileName
    // }
    console.log(stateParams);

    return show;
  }

  factory.getActiveArrayKey = function () {
    return activeArrayKey;
  }

  factory.getStartingIdx = function () {
    return startingIdx;
  }

  factory.getLastIdx = function () {
    return lastIdx;
  }

  factory.getNewEvent = function () {
    return _newEvent;
  }

  factory.isQuarterResolution = function () {
    return isQuarterResolution;
  }

  factory.getNotesPerMeasure = function () {
    return notesPerMeasure;
  }

  factory.resetEvent = function () {

    //better to reset startingIdx, lastIdx to undefined rather
    //than null because null seems to get treated like 0 when used
    //in >= and <=

    startingIdx = undefined;
    lastIdx = undefined;
    activeArrayKey = undefined;
    eventStartTime = undefined;
    eventEndTime = undefined;
    _newEvent = {};
  }

  //one of the core factory functions, selectIdx
  //sets the startingIdx & lastIdx values so as to
  //determine which cells get highlighted based on
  //user selection. it also has to detect if there are
  //existing events on timeilne and not to overwrite those

  factory.selectIdx = function (idx, checkArrayKey, isQuarterResolution, show) {
    // console.log(scope.show);
    // if (!_newEvent) _newEvent = {};
    if (activeArrayKey !== checkArrayKey) {
      startingIdx = undefined;
      lastIdx = undefined;
    }

    activeArrayKey = checkArrayKey;


    //if idx inside of savedQuarters, ignore completely. startingIdx = undefined
    // if (scope.show.savedTimelines.savedQuartersIdx)
    var checkThisSavedIdx;
    if (isQuarterResolution) {
      checkThisSavedIdx = show.savedTimelines[activeArrayKey].savedQuartersIdx;
    }
    else {
      checkThisSavedIdx = show.savedTimelines[activeArrayKey].savedEighthsIdx;
    };


    if (startingIdx === undefined) {
      if (activeArrayKey === 'colors') {
        if (checkThisSavedIdx[idx]) return;
      }
      else {
        if (checkThisSavedIdx.indexOf(idx) >= 0) return;
      }
      startingIdx = idx;
      lastIdx = idx;
      console.log('here startingidx', startingIdx, 'lastIdx', lastIdx)
    }
    else if (startingIdx > idx) {
      startingIdx = undefined;
      lastIdx = undefined;
      activeArrayKey = undefined;
      _newEvent.action = undefined;
    }
    else {
      console.log('get into last else')
      var iterator = startingIdx;

      //collided tracks whether or not the user's click for lastIdx conflicts with an already
      //existing event. if it detects a collision, we set collide to true. if there is no conflict,
      //collide remains false. we'll use the collided boolean to calculate lastIdx


      var collided = false;
      if (activeArrayKey === 'colors') {
        while (iterator < idx) {
          console.log('iterator', iterator, 'idx', idx)
          iterator++;
          if (checkThisSavedIdx[iterator]) {
            console.log('stops here', iterator)
            collided = true;
            break;
          }
          console.log('does this get added?', iterator)
        }
      }
      else {
        while (iterator < idx) {
          iterator++;
          if (checkThisSavedIdx.indexOf(iterator) >= 0) {
            collided = true;
            break;
          }
        }
      }

      //if there was a collision, we set the lastIdx to one index before the collision occurred
      //if no collision, we set lastIdx to where user clicked

      if (collided) lastIdx = iterator - 1;
      else lastIdx = iterator;
      console.log('collided?', collided, 'lastIdx', lastIdx, 'iterator', iterator, 'startingIdx', startingIdx, 'lastIdx', lastIdx)

    }

  }

  factory.addAction = function (newEvent) {
    _newEvent = newEvent;
    if (!show.events)
      show.events = [];

    console.log(startingIdx, lastIdx);

    // newEvent.time = eventStartTime;
    // newEvent.endTime = eventEndTime;
    _newEvent.startingIdx = startingIdx;
    _newEvent.lastIdx = lastIdx;
    _newEvent.activeArrayKey = activeArrayKey;
    _newEvent.eventGrouping = activeArrayKey;
    _newEvent.actionLabel = actionsObj[_newEvent.action].label;
    if (_newEvent.action === 'fadeColorTo') {
      _newEvent.preload = true;
    }
    console.log(_newEvent);
    show.events.push(_newEvent);
    factory.highlightSavedEvent(_newEvent);
    factory.resetEvent();
  }

  factory.grabQandEIdx = function (event) {
    var startingQuarterIdx;
    var lastQuarterIdx;
    var startingEighthIdx;
    var lastEighthIdx;

    if (isQuarterResolution) {
      startingQuarterIdx = newEvent.startingIdx;
      lastQuarterIdx = newEvent.lastIdx;
      startingEighthIdx = factory.convertToIdx(eventStartTime, false);
      lastEighthIdx = factory.convertToIdx(eventEndTime, false);
    }
    else {
      startingQuarterIdx = factory.convertToIdx(eventStartTime, true)
      lastQuarterIdx = factory.convertToIdx(eventEndTime, true)
      startingEighthIdx = newEvent.startingIdx;
      lastEighthIdx = newEvent.lastIdx;
    }
  }

  factory.highlightSavedEvent = function (newEvent) {
    show.savedTimelines[newEvent.activeArrayKey].savedEvents.push(newEvent);
    var startingQuarterIdx;
    var lastQuarterIdx;
    var startingEighthIdx;
    var lastEighthIdx;

    if (isQuarterResolution) {
      startingQuarterIdx = newEvent.startingIdx;
      lastQuarterIdx = newEvent.lastIdx;
      startingEighthIdx = factory.convertToIdx(eventStartTime, false);
      lastEighthIdx = factory.convertToIdx(eventEndTime, false);
    }
    else {
      startingQuarterIdx = factory.convertToIdx(eventStartTime, true)
      lastQuarterIdx = factory.convertToIdx(eventEndTime, true)
      startingEighthIdx = newEvent.startingIdx;
      lastEighthIdx = newEvent.lastIdx;
    }

    if (newEvent.activeArrayKey === 'colors') {
      for (var i = startingQuarterIdx; i <= lastQuarterIdx; i++) {
        show.savedTimelines.colors.savedQuartersIdx[i] = newEvent.params.color;
      }
      for (var j = startingEighthIdx; j <= lastEighthIdx; j++) {
        // console.log(j);
        show.savedTimelines.colors.savedEighthsIdx[j] = newEvent.params.color;
        console.log(j, show.savedTimelines.colors.savedEighthsIdx[j]);
      }
    }
    else {
      for (var i = startingQuarterIdx; i <= lastQuarterIdx; i++) {
        show.savedTimelines[newEvent.activeArrayKey].savedQuartersIdx.push(i);
      }
      for (var j = startingEighthIdx; j <= lastEighthIdx; j++) {
        show.savedTimelines[newEvent.activeArrayKey].savedEighthsIdx.push(j);
      }
    }

    console.log(show.savedTimelines);
  }

  factory.getDivHeight = function (idx) {
    if (notesPerMeasure === 8) {
      if (idx % 8 === 0) {
        return lineHeights.bar;
      }
      else if (idx % 2 === 0) {
        return lineHeights.quarter;
      }
      else {
        return lineHeights.eighths;
      }
    }
    else {
      if (idx % 4 === 0) {
        return lineHeights.bar;
      }
      else {
        return lineHeights.quarter;
      }
    }
  }

  factory.removeIdx = function (event) {
    var startingQuarterIdx;
    var lastQuarterIdx;
    var startingEighthIdx;
    var lastEighthIdx;

    if (isQuarterResolution) {
      startingQuarterIdx = event.startingIdx;
      lastQuarterIdx = event.lastIdx;
      startingEighthIdx = factory.convertToIdx(event.time, false);
      lastEighthIdx = factory.convertToIdx(event.endTime, false);
    }
    else {
      startingQuarterIdx = factory.convertToIdx(event.time, true);
      lastQuarterIdx = factory.convertToIdx(event.endTime, true);
      startingEighthIdx = event.startingIdx;
      lastEighthIdx = event.lastIdx;
    }

    if (event.eventGrouping === 'colors') {
      for (var i = startingQuarterIdx; i <= lastQuarterIdx; i++) {
        show.savedTimelines.colors.savedQuartersIdx[i] = null;
      }
      for (var j = startingEighthIdx; j <= lastEighthIdx; j++) {
        // console.log(j);
        show.savedTimelines.colors.savedEighthsIdx[j] = null;
        console.log(j, show.savedTimelines.colors.savedEighthsIdx[j]);
      }
    }
    else {
      for (var i = startingQuarterIdx; i <= lastQuarterIdx; i++) {
        var idxToRemove = show.savedTimelines[event.activeArrayKey].savedQuartersIdx.indexOf(i);
        show.savedTimelines[event.activeArrayKey].savedQuartersIdx.splice(idxToRemove);
      }
      for (var j = startingEighthIdx; j <= lastEighthIdx; j++) {
        var idxToRemove = show.savedTimelines[event.activeArrayKey].savedQuartersIdx.indexOf(j);
        show.savedTimelines[event.activeArrayKey].savedEighthsIdx.splice(idxToRemove);
      }
    }

  }

  factory.getCurrentShow = function () {
    return show;
  }

  factory.removeEvent = function (idx) {
    factory.removeIdx(show.events[idx]);
    show.events.splice(idx, 1);
  }




  return factory;
})
