var Score = require('./score.js');
var Tick = require('./tick.js');
var GridSequence = require('./grid_sequence.js');
var Logo = require('./logo.js');

module.exports = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this);

    this.gridSpace = options.gridSpace;
    this.padding = options.padding;
    delete options.padding;

    this.sequences = new Group();
    this.sequences.name = "sequences";
    this.addChild(this.sequences);

    this.addSequence(Score.Vertical, 'width', options);
    this.addSequence(Tick.Top, 'width', options);
    this.addSequence(Tick.Bottom, 'width', options);

    this.addSequence(Score.Horizontal, 'height', options);
    this.addSequence(Tick.Left, 'height', options);
    this.addSequence(Tick.Right, 'height', options);

    this.logo = new Logo(new Point(this.gridSpace), this.gridSpace * 3);
    this.addChild(this.logo);

    this.resize(size);
  },

  addSequence: function(klass, axis, options) {
    this.sequences.addChild(new GridSequence(klass, axis, options))
  },

  resize: function(size) {
    size -= this.padding * 2;
    this.width = this.maximumEdge(size.width);
    this.height = this.maximumEdge(size.height);
    size = new Size(this.width, this.height);

    this.logo.resize(size);
    this.resizeSequences(size);

    this.bounds.center = view.center.round();
  },

  maximumEdge: function(length) {
    return length - length % this.gridSpace;
  },

  resizeSequences: function(size) {
    for (var i=0; i < this.sequences.children.length; i++) {
      this.sequences.children[i].resize(size);
    }
  }
})
