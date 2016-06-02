var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  startTime: {
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
    enum: ['fadeColorTo', 'changeColorTo', 'changeTextTo', 'resetScreen', 'vibrate', 'flash']
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
