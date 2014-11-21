var Score = require('./score.js');
var Tick = require('./tick.js');
var Logo = require('./logo.js');

var Grid = Group.extend({
  statics: {
    Sequencer: require('./grid/sequencer.js')
  },
  
  initialize: function(size, options) {
    this.gridSpace = options.gridSpace;

    this.sequencer = new Grid.Sequencer({
      'width': [Score.Vertical, Tick.Top, Tick.Bottom],
      'height': [Score.Horizontal, Tick.Left, Tick.Right]
    }, options);

    this.logo = new Logo(new Point(this.gridSpace), this.gridSpace * 3);

    Group.prototype.initialize.call(this, [this.sequencer, this.logo]);

    this.resize(size);
  },

  resize: function(size) {
    this.width = this.maximumEdge(size.width);
    this.height = this.maximumEdge(size.height);
    size = new Size(this.width, this.height);

    this.logo.resize(size);
    this.sequencer.resize(size);
  },

  maximumEdge: function(length) {
    return length - length % this.gridSpace;
  }
})

module.exports = Grid
