var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var eventSchema = Event.schema;

var showSchema = new mongoose.Schema({
  name: String,
  startTime: Date,
  settings: {
    bpm: {
      type: Number,
      default: 60,
    },
    timeSig: {
      type: Number,
      default: 4
    },
    resolution: {   //resolution to run tranport at
      type: String,
      default: "16n"
    }
  },
  length: {
    type: String    // in 0:0:0 format
  },
  events: {
    type: [eventSchema]
  },
  savedTimelines: {
    type: Object
  }.
  song_path: {
    type: String
  }
});

mongoose.model('Show', showSchema);
