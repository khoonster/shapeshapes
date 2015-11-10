'use strict';

var Padded = require('./modules/size/padded.js')
var CuttingMat = require('./modules/cutting_mat.js');

var constrainToMaximum = function(size) {
  var maxSize = new Size(722, 760);

  return Size.min(size, maxSize);
}

var gridSize = new Size(38, 38);
var mat = new CuttingMat(constrainToMaximum(new Padded(view.size)), gridSize);

var closeButton = document.querySelector('.details .close');
var description = document.querySelector('.details .description');

view.onResize = function(event) {
  var padded = constrainToMaximum(new Padded(view.size));
  var matDimensions = padded - (padded % gridSize);
  var descriptionDimensions = matDimensions - new Size(2, 2) - (gridSize * 2) - (new Size(0, gridSize.height) * 3);

  mat.resize(padded);
  mat.position = view.center.round();

  closeButton.style.marginLeft = (matDimensions.width / 2 + 19) + "px";
  closeButton.style.marginTop = (-matDimensions.height / 2 - 38 - 19) + "px";
  closeButton.style.top = "50%";
  closeButton.style.left = "50%";

  description.style.marginLeft = -descriptionDimensions.width / 2 + "px";
  description.style.marginTop = (-descriptionDimensions.height / 2 + gridSize.height * 1.5) + "px";
  description.style.width = descriptionDimensions.width + "px";
  description.style.height = descriptionDimensions.height + "px";
  description.style.top = "50%";
  description.style.left = "50%";
}
