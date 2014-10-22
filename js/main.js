var grid_space = 40;
var overhang = 10;
var subdivisions = 2;
var padding = 60;
var vertical_count = lines_within(view.size.width);
var horizontal_count = lines_within(view.size.height);

for (var i=0; i <= vertical_count; i++) {
  make_vertical_line(i * grid_space / subdivisions)
};

for (var i=0; i <= horizontal_count; i++) {
  make_horizontal_line(i * grid_space / subdivisions)
};

function lines_within(l) {
  return Math.floor(grid_size(l) / grid_space * subdivisions);
}

function grid_size(l) {
  return maximum_edge(l) - padding;
}

function grid_offset(l) {
  return Math.floor(((l - padding * 2) % grid_space) / 2);
}

function make_vertical_line(x) {
  return make_line(vertical_bounds(x), stroke_width(x));
}

function make_horizontal_line(y) {
  return make_line(horizontal_bounds(y), stroke_width(y));
}

function stroke_width(n) {
  if (n % grid_space) {
    return 1
  } else {
    return 2
  }
}

function horizontal_bounds(y) {
  var from = new Point(padding - overhang, padding + y);
  var to = new Point(maximum_edge(view.size.width) + overhang, padding + y);
  return new LineBounds(from, to)
}

function vertical_bounds(x) {
  var from = new Point(padding + x, padding - overhang);
  var to = new Point(padding + x, maximum_edge(view.size.height) + overhang);
  return new LineBounds(from, to);
}

function maximum_edge(length) {
  return length - padding - length % grid_space
}

function make_line(bounds, strokeWidth) {
  return new Path.Line({
    from: bounds.from,
    to: bounds.to,
    strokeColor: 'white',
    strokeWidth: strokeWidth || 2
  });
}

function LineBounds(from, to) {
  var offset = new Point(
    grid_offset(view.size.width),
    grid_offset(view.size.height)
  );

  this.from = new Point(from) + offset;
  this.to = new Point(to) + offset;
}
