var Shape = require('./shape.js')

module.exports = Group.extend({
  initialize: function(svgs, size) {
    Group.prototype.initialize.call(this);

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = new Shape.Custom(svgs[i], size);
      this.addChild(shape);
    };
  }
})
