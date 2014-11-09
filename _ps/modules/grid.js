var Grid = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this)

    this.gridSpace = options.gridSpace;
    this.overhang = options.overhang;
    this.subdivisions = options.subdivisions;
    this.padding = options.padding;

    this.resize(size);
  },

  resize: function(size) {
    size -= this.padding * 2;
    this.width = this.maximumEdge(size.width);
    this.height = this.maximumEdge(size.height);

    this.drawLines('horizontal_lines', 'makeHorizontalLine', this.height);
    this.drawLines('vertical_lines', 'makeVerticalLine', this.width);

    this.bounds.center = view.center.round()
  },

  drawLines: function(set, func, size) {
    var count = this.linesWithin(size);

    if (typeof this.children[set] === "undefined") {
      var group = new Group();
      group.name = set;
      this.addChild(group);
    };

    for (var i=0; i < this.children[set].children.length; i++) {
      this.children[set].removeChildren(i);
    };

    for (var i=0; i <= count; i++) {
      var line = this[func](i * this.gridSpace / this.subdivisions);
      this.children[set].insertChild(i, line);
    };
  },

  makeVerticalLine: function(x) {
    return this.makeLine(this.verticalBounds(x), this.getStrokeWidth(x));
  },

  makeHorizontalLine: function(y) {
    return this.makeLine(this.horizontalBounds(y), this.getStrokeWidth(y));
  },

  linesWithin: function(l) {
    return Math.floor(l / this.gridSpace * this.subdivisions);
  },

  getStrokeWidth: function(n) {
    if (n % this.gridSpace) {
      return 1
    } else {
      return 2
    }
  },

  horizontalBounds: function(y) {
    var top = y,
        left = -this.overhang,
        right = this.width + this.overhang,
        from = new Point(left, top),
        to = new Point(right, top);
    return new LineBounds(from, to);
  },

  verticalBounds: function(x) {
    var left = x,
        top = -this.overhang,
        bottom = this.height + this.overhang,
        from = new Point(left, top),
        to = new Point(left, bottom);
    return new LineBounds(from, to);
  },

  maximumEdge: function(length) {
    return length - length % this.gridSpace
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
