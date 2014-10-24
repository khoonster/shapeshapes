var ShapePresenter = Group.extend({
  initialize: function(container, size) {
    var svgs = container.children;

    Group.prototype.initialize.call(this)

    for (var i=0; i < svgs.length; i++) {
      var shape = project.importSVG(svgs[i]);
      shape.position = new Point(Math.random() * size.width,
                                 Math.random() * size.height);
      this.addChild(shape);
    };
  }
})
