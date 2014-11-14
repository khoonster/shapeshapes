var Shape = require('./shape.js')

module.exports = Group.extend({
  statics: {
    fromClassName: function(name, size) {
      var container = document.getElementsByClassName(name)[0];
      new this(container.children, size);
    }
  },

  initialize: function(svgs, size) {
    Group.prototype.initialize.call(this);

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = new Shape.Custom(svgs[i], size);
      shape.path.position = new Point.random() * size;
      this.addChild(shape);
    };
  }
})
