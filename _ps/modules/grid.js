var Score = require('./score.js');
var Tick = require('./tick.js');
var Logo = require('./logo.js');
var Rounded = require('./size/rounded.js');

var GridLogo = Logo.extend({
  initialize: function(grid) {
    var size = new Size(grid.width * 3, grid.height * 2);
    Logo.prototype.initialize.call(this, new Point(grid), size)
  }
})

var Grid = Group.extend({
  statics: {
    Sequencer: require('./grid/sequencer.js'),
    horizontalLines: [Score.Horizontal, Tick.Left, Tick.Right],
    verticalLines: [Score.Vertical, Tick.Top, Tick.Bottom]
  },

  initialize: function(size, options) {
    var logoSize;

    this.gridSpace = options.gridSpace;

    this.sequencer = new Grid.Sequencer({
      'width': this.constructor.verticalLines,
      'height': this.constructor.horizontalLines
    }, options);

    this.logo = new GridLogo(this.gridSpace);

    Group.prototype.initialize.call(this, [this.sequencer, this.logo]);

    this.resize(size);
  },

  resize: function(size) {
    size = new Rounded(size, this.gridSpace);

    for (var i=0; i < this.children.length; i++) {
      this.children[i].resize(size);
    };
  }
})

module.exports = Grid;
