'use strict';

var Padded = require('./modules/size/padded.js')
var CuttingMat = require('./modules/cutting_mat.js');

var mat = new CuttingMat(new Padded(view.size), new Size(38, 38));

view.onResize = function(event) {
  var padded = new Padded(view.size);

  mat.resize(padded);
  mat.position = view.center.round();
}
