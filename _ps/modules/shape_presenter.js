function ShapePresenter(container, size) {
  var svgs = container.children;
  this.shapes = []

  for (var i=0; i < svgs.length; i++) {
    this.shapes.push(project.importSVG(svgs[i]));
  };
}

ShapePresenter.prototype.draw = function(view) {
  for (var i=0; i < this.shapes.length; i++) {
    var shape = this.shapes[i];
  };
}
