module.exports = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this);

    this.resize(size);
  },

  resize: function(size) {
    this.clear();

    var rect = Shape.Rectangle(new Point(0, 0), size);
    rect.fillColor = '000099';

    this.addChild(rect);
  }
})
