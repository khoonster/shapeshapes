var pool = new Pool(view.size, {
  padding: new Size(40, 40)
});

var grid = new Grid(view.size, {
  grid_space: 40,
  overhang: 15,
  subdivisions: 2,
  padding: 100
});

var shapeContainer = document.getElementsByClassName('shape-container')[0];
var shapes = new ShapePresenter(shapeContainer, view.size);

function onResize(event) {
  grid.write(view.size);
  pool.write(view.size);
}
