var RoundSize = Size.extend({
  initialize: function(size, grid) {
    var grid = new Size(grid);

    Size.prototype.initialize.call(this, size);

    this.width = this.maximum(this.width, grid.width);
    this.height = this.maximum(this.height, grid.height);
  },

  maximum: function(length, mod) {
    return length - length % mod;
  }
})

module.exports = RoundSize
