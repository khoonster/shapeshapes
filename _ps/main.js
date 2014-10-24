var shape = project.importSVG(document.getElementById('foo'));

var grid = new Grid(view.size, {
  grid_space: 40,
  overhang: 15,
  subdivisions: 2,
  padding: 60
});

function onResize(event) {
  grid.draw(view.size);
  shape.remove()
  shape.position = view.center;
  project.activeLayer.addChild(shape);
}
