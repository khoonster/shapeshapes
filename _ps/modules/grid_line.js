var GridLine = Path.extend({
  statics: {
    getStrokeWidth: function(i) {
      return this.strokePattern[i % this.subdivisions % this.strokePattern.length]
    },

    strokePattern: [2, 1],
    subdivisions: 2
  },

  initialize: function(position, container) {
    var left = this.get('left', arguments);
    var top = this.get('top', arguments);
    var angle = this.get('angle', arguments);
    var length = this.get('length', arguments);

    var start = new Point(left, top);
    var vector = new Point({angle: angle, length: length});
    var end = start + vector;

    Path.prototype.initialize.call(this, {
      segments: [start, end]
    });
  },
  
  get: function(attr, args) {
    var name = attr.charAt(0).toUpperCase() + attr.slice(1);
    var val = this['get' + name];
    if (typeof val == "function") {
      return val.apply(this, args);
    } else {
      return val
    }
  }
})

var VerticalLine = GridLine.extend({
  getTop: -15,
  getAngle: 90,
  
  getLeft: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.height + 30
  }
})

var HorizontalLine = GridLine.extend({
  getLeft: -15,
  getAngle: 0,
  
  getTop: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.width + 30
  }
})

var Tick = GridLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8
  }
})

var TopTick = Tick.extend({
  getAngle: 90,
  getTop: -10,
  getLength: 20,
  
  getLeft: function(position) {
    return position
  }
})

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - 10
  }
})

var LeftTick = Tick.extend({
  getAngle: 0,
  getLeft: -10,
  getLength: 20,
  
  getTop: function(position) {
    return position
  }
})

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - 10
  }
})
