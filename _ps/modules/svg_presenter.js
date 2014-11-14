var Shape = require('./shape.js')

module.exports = Group.extend({
  initialize: function(selector, size) {
    Group.prototype.initialize.call(this);

    var container = document.getElementsByClassName(selector)[0];
    var svgs = container.children;

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = new Shape.Custom(svgs[i], size);
      shape.path.position = new Point.random() * size;
      this.addChild(shape);
    };
  }
})
