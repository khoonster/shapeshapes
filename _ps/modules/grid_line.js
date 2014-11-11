var GridLine = Path.extend({
  statics: {
    getStrokeWidth: function(i) {
      return this.strokePattern[i % this.subdivisions % this.strokePattern.length]
    },

    strokePattern: [2, 1],
    subdivisions: 2
  },

  initialize: function() {
    this.args = arguments;

    var left = this.get('left');
    var top = this.get('top');
    var angle = this.get('angle');
    var length = this.get('length');

    var start = new Point(left, top);
    var vector = new Point({angle: angle, length: length});
    var end = start + vector;

    Path.prototype.initialize.call(this, {
      segments: [start, end]
    });
  },
  
  get: function(attr) {
    var name = attr.charAt(0).toUpperCase() + attr.slice(1);
    var val = this['get' + name];
    if (typeof val == "function") {
      return val.apply(this, this.args);
    } else {
      return val
    }
  }
})

var Score = GridLine.extend({
  statics: {
    offsetPattern: [20, 15]
  },
  
  getOffset: function(_, _, i) {
    var lengths = this.constructor.offsetPattern
    var index = i % this.constructor.subdivisions % lengths.length
    return lengths[index]
  }
})

var VerticalLine = Score.extend({
  getAngle: 90,
  
  getTop: function() {
    return - this.get('offset')
  },

  getLeft: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.height + this.get('offset') * 2
  }
})

var HorizontalLine = Score.extend({
  getAngle: 0,

  getLeft: function() {
    return - this.get('offset')
  },
  
  getTop: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.width + this.get('offset') * 2
  }
})

var Tick = GridLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8,
    lengthPattern: [0, 10, 20, 10]
  },
  
  getLength: function(_, _, i) {
    var lengths = this.constructor.lengthPattern
    var index = i % this.constructor.subdivisions % lengths.length
    return lengths[index]
  },
  
  getOffset: function(_, _, i) {
    return this.get('length') / 2
  }
})

var TopTick = Tick.extend({
  getAngle: 90,

  getTop: function() {
    return -this.get('offset')
  },

  getLeft: function(position) {
    return position
  }
})

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - this.get('offset')
  }
})

var LeftTick = Tick.extend({
  getAngle: 0,

  getLeft: function() {
    return -this.get('offset')
  },
  
  getTop: function(position) {
    return position
  }
})

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - this.get('offset')
  }
})
