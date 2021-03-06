var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  time: {
    type: String
  },
  endTime: {
    type: String
  },
  eventGrouping: {
    type: String,
  },
  action: {
    type: String,
    enum: ['fadeColorTo', 'changeColor', 'changeText', 'resetScreen', 'vibrate', 'strobeFlash']
  },
  params: {
    type: Object
  },
  group: {
    type: String
  },
  preload: {
    type: Boolean
  }
})

mongoose.model('Event', eventSchema);
