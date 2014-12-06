var Sequence = Group.extend({
  initialize: function(line, direction, options) {
    Group.prototype.initialize.call(this);

    this.line = line;
    this.direction = direction;
    this.gridSpace = options.gridSpace;
    this.interval = this.gridSpace[this.direction] / this.line.subdivisions;
  },
  
  resize: function(size) {
    this.height = size.height;
    this.width = size.width;
    this.drawLines(size);
  },
  
  drawLines: function(size) {
    var count = this.linesWithin(size[this.direction]);

    this.clear();

    for (var i=0; i <= count; i++) {
      var line = this.drawLine(i);
      this.insertChild(i, line);
    };
  },

  drawLine: function(i) {
    var position = i * this.interval;
    return this.makeLine(position, new Size(this.width, this.height), i);
  },

  makeLine: function(position, size, i) {
    var klass = this.line;
    return new klass(position, size, i);
  },

  linesWithin: function(l) {
    return Math.floor(l / this.interval);
  }
});

module.exports = Sequence;
