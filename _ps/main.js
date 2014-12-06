'use strict';

var Score = require('./modules/score.js');
var Tick = require('./modules/tick.js');
var Padded = require('./modules/size/padded.js')
var Pool = require('./modules/pool.js');
var Grid = require('./modules/grid.js');
var SVGPresenter = require('./modules/svg_presenter.js');

var pool = new Pool(view.size);

var grid = new Grid(new Padded(view.size), {
  gridSpace: new Size(38, 38),
  y: [Score.Horizontal, Tick.Left, Tick.Right],
  x: [Score.Vertical, Tick.Top, Tick.Bottom]
});

var shapes = SVGPresenter.fromClassName('shape-container', view.size);

view.onResize = function(event) {
  var padded = new Padded(view.size);

  grid.resize(padded);
  grid.position = view.center.round();
  
  pool.resize(view.size);
  pool.position = view.center;
}
