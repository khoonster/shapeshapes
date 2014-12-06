var Score = require('./score.js');
var Tick = require('./tick.js');
var Logo = require('./logo.js');
var RoundSize = require('./round_size.js')

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
    size = new RoundSize(size, this.gridSpace);

    for (var i=0; i < this.children.length; i++) {
      this.children[i].resize(size);
    };
  }
})

module.exports = Grid
