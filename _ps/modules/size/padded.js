var PaddedSize = Size.extend({
  initialize: function(size, grid) {
    var grid = new Size(grid);
    var padding;

    Size.prototype.initialize.call(this, size);

    if (this.width < 500 || this.height < 400) {
      padding = new Size(25, 25);
    } else {
      padding = new Size(100, 100);
    }

    this.width -= padding.width * 2;
    this.height -= padding.height * 2;
  }
})

module.exports = PaddedSize;
