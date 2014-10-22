var padding = 60;
var grid_space = 40;
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
  return make_line(x, 0);
}

function make_horizontal_line(y) {
  return make_line(0, y);
}

function make_line(x, y) {
  console.log(x, y)
  return new Path.Rectangle({
    from: [padding + x, padding + y],
    to: [view.size.width - padding + x, view.size.height - padding + y],
    strokeColor: 'white',
    strokeWidth: 2
  });
}
