'use strict';

var Padded = require('./modules/size/padded.js')
var CuttingMat = require('./modules/cutting_mat.js');

var constrainToMaximum = function(size) {
  var maxSize = new Size(722, 760);

  return Size.min(size, maxSize);
}

var mat = new CuttingMat(constrainToMaximum(view.size), new Size(38, 38));

var closeButton = document.querySelector('.details .close');

view.onResize = function(event) {
  var padded = constrainToMaximum(view.size);

  mat.resize(padded);
  mat.position = view.center.round();

  closeButton.style.marginLeft = (padded.width / 2 + 19) + "px";
  closeButton.style.marginTop = (-padded.height / 2 - 38 - 19) + "px";
  closeButton.style.top = "50%";
  closeButton.style.left = "50%";
}
