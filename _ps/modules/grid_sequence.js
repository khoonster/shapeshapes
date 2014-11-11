var GridSequence = Group.extend({
  initialize: function(line, direction, options) {
    Group.prototype.initialize.call(this);

    this.line = line;
    this.direction = direction;
    this.gridSpace = options.gridSpace;
  },
  
  resize: function(size) {
    this.height = size.height;
    this.width = size.width;
    this.drawLines(size)
  },
  
  drawLines: function(size) {
    var count = this.linesWithin(size[this.direction]);

    this.clear()

    for (var i=0; i <= count; i++) {
      var line = this.makeLine(i);
      this.insertChild(i, line);
    };
  },

  makeLine: function(i) {
    var klass = this.line;
    var position = i * this.gridSpace / klass.subdivisions
    var line = new klass(position, new Size(this.width, this.height));
    line.strokeColor = 'white';
    line.strokeWidth = klass.getStrokeWidth(i);
    return line;
  },

  linesWithin: function(l) {
    return Math.floor(l / this.gridSpace * this.line.subdivisions);
  }
})
