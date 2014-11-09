var Grid = Group.extend({
  initialize: function(size, options) {
    this.gridSpace = options.gridSpace;
    this.overhang = options.overhang;
    this.subdivisions = options.subdivisions;
    this.padding = options.padding;
    this.write(size);
  },
  
  write: function(size) {
    this.width = size.width;
    this.height = size.height;
    this.drawLines('horizontal_lines', 'makeHorizontalLine', this.height);
    this.drawLines('vertical_lines', 'makeVerticalLine', this.width);
  },

  drawLines: function(set, func, size) {
    var count = this.linesWithin(size);

    if (typeof this[set] === "undefined") {
      this[set] = new Group();
    };

    for (var i=0; i < this[set].children.length; i++) {
      this[set].removeChildren(i);
    };

    for (var i=0; i <= count; i++) {
      var line = this[func](i * this.gridSpace / this.subdivisions);
      this[set].insertChild(i, line);
    };
    
    this[set].bounds.center = new Point(Math.round(view.center.x), Math.round(view.center.y));
  },

  makeVerticalLine: function(x) {
    return this.makeLine(this.verticalBounds(x), this.getStrokeWidth(x));
  },

  makeHorizontalLine: function(y) {
    return this.makeLine(this.horizontalBounds(y), this.getStrokeWidth(y));
  },

  linesWithin: function(l) {
    return Math.floor(this.size(l) / this.gridSpace * this.subdivisions);
  },

  size: function(l) {
    return this.maximumEdge(l) - this.padding;
  },

  offset: function(l) {
    return Math.floor(((l - this.padding * 2) % this.gridSpace) / 2);
  },

  getStrokeWidth: function(n) {
    if (n % this.gridSpace) {
      return 1
    } else {
      return 2
    }
  },

  horizontalBounds: function(y) {
    var top = this.padding + y,
        left = this.padding - this.overhang,
        right = this.maximumEdge(this.width) + this.overhang,
        from = new Point(left, top),
        to = new Point(right, top);
    return new LineBounds(from, to);
  },

  verticalBounds: function(x) {
    var left = this.padding + x,
        top = this.padding - this.overhang,
        bottom = this.maximumEdge(this.height) + this.overhang,
        from = new Point(left, top),
        to = new Point(left, bottom);
    return new LineBounds(from, to);
  },

  maximumEdge: function(length) {
    return length - this.padding - length % this.gridSpace
  },

  makeLine: function(bounds, strokeWidth) {
    return new Path.Line({
      from: bounds.from,
      to: bounds.to,
      strokeColor: 'white',
      strokeWidth: strokeWidth || 2
    });
  }
})