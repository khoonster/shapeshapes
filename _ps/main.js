'use strict';

Size.prototype.withPadding = function() {
  var padding;
  if (this.width < 500 || this.height < 400) {
    padding = new Size(25, 25);
  } else {
    padding = new Size(100, 100);
  }
  return this - padding * 2;
}

var Pool = require('./modules/pool.js');
var Grid = require('./modules/grid.js');
var SVGPresenter = require('./modules/svg_presenter.js');

var pool = new Pool(view.size);

var grid = new Grid(view.size.withPadding(), {
  gridSpace: new Size(38, 38)
});

var shapes = SVGPresenter.fromClassName('shape-container', view.size);

view.onResize = function(event) {
  grid.resize(view.size.withPadding());
  grid.position = view.center.round();
  
  pool.resize(view.size);
  pool.position = view.center;
}
