var GridLine = Path.extend({
  statics: {
    getStrokeWidth: function(i) {
      return this.strokePattern[i % this.subdivisions % this.strokePattern.length]
    },

    strokePattern: [2, 1],
    subdivisions: 2
  },

  initialize: function(position, container) {
    var top = this.getTop.apply(this, arguments);
    var left = this.getLeft.apply(this, arguments);
    var angle = this.getAngle.apply(this, arguments);
    var length = this.getLength.apply(this, arguments);

    var start = new Point(left, top);
    var vector = new Point({angle: angle, length: length});
    var end = start + vector;

    Path.prototype.initialize.call(this, {
      segments: [start, end]
    });
  }
})

var VerticalLine = GridLine.extend({
  getTop: function(position, container) {
    return -15
  },
  
  getLeft: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.height + 30
  },
  
  getAngle: function(position, container) {
    return 90
  }
})

var HorizontalLine = GridLine.extend({
  getTop: function(position, container) {
    return position
  },
  
  getLeft: function(position, container) {
    return -15
  },
  
  getLength: function(position, container) {
    return container.width + 30
  },
  
  getAngle: function(position, container) {
    return 0
  }
})

var TopTick = VerticalLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8
  },
  
  getTop: function(position, container) {
    return -10
  },
  
  getLength: function(position, container) {
    return 20
  }
})

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - 10
  }
})

var LeftTick = HorizontalLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8
  },
  
  getLeft: function() {
    return -10
  },
  
  getLength: function(position, container) {
    return 20
  }
})

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - 10
  }
})
