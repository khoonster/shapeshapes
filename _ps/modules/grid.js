function Grid(size, options) {
  this.grid_space = options.grid_space;
  this.overhang = options.overhang;
  this.subdivisions = options.subdivisions;
  this.padding = options.padding;
  this.write(size);
}

Grid.prototype.write = function(size) {
  this.width = size.width;
  this.height = size.height;
  this.offset_point = new Point(this.offset(this.width), this.offset(this.height));
  this.draw_lines('horizontal_lines', 'make_horizontal_line', this.height);
  this.draw_lines('vertical_lines', 'make_vertical_line', this.width);
}

Grid.prototype.draw_lines = function(set, func, size) {
  var count = this.lines_within(size);

  if (typeof this[set] === "undefined") {
    this[set] = new Group();
  };

  for (var i=0; i < this[set].children.length; i++) {
    if (typeof this[set].children[i] !== "undefined") {
      this[set].removeChildren(i);
    };
  };

  for (var i=0; i <= count; i++) {
    var line = this[func](i * this.grid_space / this.subdivisions);
    this[set].insertChild(i, line);
  };
}

Grid.prototype.make_vertical_line = function(x) {
  return this.make_line(this.vertical_bounds(x), this.stroke_width(x));
}

Grid.prototype.make_horizontal_line = function(y) {
  return this.make_line(this.horizontal_bounds(y), this.stroke_width(y));
}

Grid.prototype.lines_within = function(l) {
  return Math.floor(this.size(l) / this.grid_space * this.subdivisions);
}

Grid.prototype.size = function(l) {
  return this.maximum_edge(l) - this.padding;
}

Grid.prototype.offset = function(l) {
  return Math.floor(((l - this.padding * 2) % this.grid_space) / 2);
}

Grid.prototype.stroke_width = function(n) {
  if (n % this.grid_space) {
    return 1
  } else {
    return 2
  }
}

Grid.prototype.horizontal_bounds = function(y) {
  var top = this.padding + y,
      left = this.padding - this.overhang,
      right = this.maximum_edge(this.width) + this.overhang,
      from = new Point(left, top),
      to = new Point(right, top);
  return new LineBounds(from, to).add(this.offset_point);
}

Grid.prototype.vertical_bounds = function(x) {
  var left = this.padding + x,
      top = this.padding - this.overhang,
      bottom = this.maximum_edge(this.height) + this.overhang,
      from = new Point(left, top),
      to = new Point(left, bottom);
  return new LineBounds(from, to).add(this.offset_point);
}

Grid.prototype.maximum_edge = function(length) {
  return length - this.padding - length % this.grid_space
}

Grid.prototype.make_line = function(bounds, strokeWidth) {
  return new Path.Line({
    from: bounds.from,
    to: bounds.to,
    strokeColor: 'white',
    strokeWidth: strokeWidth || 2
  });
}
