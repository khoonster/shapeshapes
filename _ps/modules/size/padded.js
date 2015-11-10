var PaddedSize = Size.extend({
  initialize: function(size, options) {
    this.options = options;
    this.padding = this.paddingForSize(size);

    Size.prototype.initialize.call(this, size);

    this.width -= this.padding.width * 2;
    this.height -= this.padding.height * 2;
  },

  paddingForSize: function(size) {
    if (size.width < 500 || size.height < 400) {
      return new Size(25, 25);
    } else {
      return new Size(100, 100);
    }
  }
})

module.exports = PaddedSize;
