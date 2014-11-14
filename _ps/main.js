var Pool = require('./modules/pool.js');
var Grid = require('./modules/grid.js');
var SVGPresenter = require('./modules/svg_presenter.js');

var pool = new Pool(view.size, {
  padding: new Size(0, 0)
});

var grid = new Grid(view.size, {
  gridSpace: 38,
  padding: new Size(100, 100)
});

var shapes = new SVGPresenter('shape-container', view.size);

function onResize(event) {
  grid.resize(view.size);
  pool.resize(view.size);
}
