function Grid(options) {
  this.grid_space = 40;
  this.overhang = 10;
  this.subdivisions = 2;
  this.padding = 60;
  this.horizontal_lines = []
  this.vertical_lines = []
  this.draw(view.size.width, view.size.height);
}

Grid.prototype.draw = function(width, height) {
  this.offset_point = new Point(this.offset(width), this.offset(height));
  this.draw_lines('horizontal_lines', 'make_horizontal_line', height);
  this.draw_lines('vertical_lines', 'make_vertical_line', width);
}

Grid.prototype.draw_lines = function(set, func, size) {
  var count = this.lines_within(size);
  
  for (var i=this[set].length; i <= count; i++) {
    this[set].push(this[func](i * this.grid_space / this.subdivisions));
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
  var from = new Point(this.padding - this.overhang, this.padding + y);
  var to = new Point(this.maximum_edge(view.size.width) + this.overhang, this.padding + y);
  return new LineBounds(from, to).add(this.offset_point);
}

Grid.prototype.vertical_bounds = function(x) {
  var from = new Point(this.padding + x, this.padding - this.overhang);
  var to = new Point(this.padding + x, this.maximum_edge(view.size.height) + this.overhang);
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
