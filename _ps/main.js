var Pool = require('./modules/pool.js');
var Grid = require('./modules/grid.js');
var SVGPresenter = require('./modules/svg_presenter.js');

Size.prototype.with_padding = function() {
  if (this.width < 500 || this.height < 400) {
    var padding = new Size(25, 25);
  } else {
    var padding = new Size(100, 100);
  };
  return this - padding * 2;
}

var pool = new Pool(view.size);

var grid = new Grid(view.size.with_padding(), {
  gridSpace: new Size(38, 38)
});

var shapes = SVGPresenter.fromClassName('shape-container', view.size);

view.onResize = function(event) {
  grid.resize(view.size.with_padding());
  grid.position = view.center.round();
  
  pool.resize(view.size);
  pool.position = view.center;
}
