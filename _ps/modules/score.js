var GridLine = require('./grid_line.js');

var BaseScore = GridLine.extend({
  statics: {
    offsetPattern: [12, 9]
  },

  getOffset: function(_, _, i) {
    var lengths = this.constructor.offsetPattern;
    var index = i % this.constructor.subdivisions % lengths.length;
    return lengths[index]
  }
});

var VerticalScore = BaseScore.extend({
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
});

var HorizontalScore = BaseScore.extend({
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
});

module.exports = {
  Vertical: VerticalScore,
  Horizontal: HorizontalScore
}
