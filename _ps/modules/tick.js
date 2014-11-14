var Line = require('./line.js');

var Tick = Line.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8,
    lengthPattern: [0, 9, 18, 9]
  },
  
  getLength: function(_, _, i) {
    var lengths = this.constructor.lengthPattern;
    var index = i % this.constructor.subdivisions % lengths.length;
    return lengths[index]
  },
  
  getOffset: function(_, _, i) {
    return this.get('length') / 2
  }
});

var TopTick = Tick.extend({
  getAngle: 90,

  getTop: function() {
    return -this.get('offset')
  },

  getLeft: function(position) {
    return position
  }
});

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - this.get('offset')
  }
});

var LeftTick = Tick.extend({
  getAngle: 0,

  getLeft: function() {
    return -this.get('offset')
  },
  
  getTop: function(position) {
    return position
  }
});

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - this.get('offset')
  }
});

module.exports = {
  Top: TopTick,
  Bottom: BottomTick,
  Left: LeftTick,
  Right: RightTick
}
