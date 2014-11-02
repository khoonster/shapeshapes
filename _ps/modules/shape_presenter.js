var ShapePresenter = Group.extend({
  initialize: function(container, size) {
    var svgs = container.children;

    Group.prototype.initialize.call(this)

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = this.importSVG(svgs[i]);
      shape.position = new Point(Math.random() * size.width,
                                 Math.random() * size.height);
    };
  }
})
