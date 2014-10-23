var grid = new Grid(view.size, {
  grid_space: 40,
  overhang: 10,
  subdivisions: 2,
  padding: 60
});

function onResize(event) {
  grid.draw(view.size)
}