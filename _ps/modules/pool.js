var Pool = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this);

    this.options = options;

    this.resize(size);
  },

  resize: function(size) {
    this.clear();

    var rect = Shape.Rectangle(new Point(0, 0), size);
    rect.fillColor = this.options.fillColor;

    this.addChild(rect);
  }
})

module.exports = Pool;
