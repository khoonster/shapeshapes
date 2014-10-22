var padding = 60;
var grid_space = 40;
var overhang = 10;
var vertical_count = lines_within(view.size.width);
var horizontal_count = lines_within(view.size.height);

for (var i=0; i <= vertical_count; i++) {
  make_vertical_line(i * grid_space)
};

for (var i=0; i <= horizontal_count; i++) {
  make_horizontal_line(i * grid_space)
};

function lines_within(size) {
  return Math.floor((size - padding * 2) / grid_space);
}

function make_vertical_line(x) {
  return make_line(vertical_bounds(x));
}

function make_horizontal_line(y) {
  return make_line(horizontal_bounds(y));
}

function horizontal_bounds(y) {
  return [
    new Point(padding - overhang, padding + y),
    new Point(view.size.width - padding + overhang, padding + y),
  ]
}

function vertical_bounds(x) {
  return [
    new Point(padding + x, padding - overhang),
    new Point(padding + x, view.size.height - padding + overhang),
  ]
}

function make_line(bounds) {
  return new Path.Line({
    from: bounds[0],
    to: bounds[1],
    strokeColor: 'white',
    strokeWidth: 2
  });
}
