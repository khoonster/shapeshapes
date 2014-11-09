var pool = new Pool(view.size, {
  padding: new Size(0, 0)
});

var grid = new Grid(view.size, {
  gridSpace: 40,
  overhang: 15,
  subdivisions: 2,
  padding: new Size(100, 100)
});

var container = document.getElementsByClassName('shape-container')[0];
var svgs = container.children;
var shapes = new SVGPresenter(svgs, view.size);

function onResize(event) {
  grid.resize(view.size);
  pool.resize(view.size);
}
