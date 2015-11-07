var Score = require('./score.js');
var Tick = require('./tick.js');
var Grid = require('./grid.js');

var CuttingMat = Group.extend({
  initialize: function(size, gridSpace) {
    this.grid = new Grid(size, {
      gridSpace: gridSpace,
      y: [Score.Horizontal, Tick.Left, Tick.Right],
      x: [Score.Vertical, Tick.Top, Tick.Bottom]
    });

    Group.prototype.initialize.call(this, [this.grid]);
  },

  resize: function(size) {
    this.grid.resize(size);
  }
});

module.exports = CuttingMat;
