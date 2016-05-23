var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  time: {
    type: String
  },
  action: {
    type: String,
    enum: ['fadeColor', 'changeColorTo', 'changeText', 'resetScreen']
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
