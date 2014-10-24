var grid = new Grid(view.size, {
  grid_space: 40,
  overhang: 15,
  subdivisions: 2,
  padding: 60
});

var shapeContainer = document.getElementsByClassName('shape-container')[0];
var shapes = new ShapePresenter(shapeContainer, view.size);

function onResize(event) {
  grid.draw(view.size);
  shapes.draw(view);
}
