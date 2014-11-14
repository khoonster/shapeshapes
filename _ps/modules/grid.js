var Grid = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this);

    this.gridSpace = options.gridSpace;
    this.padding = options.padding;
    delete options.padding;

    this.sequences = new Group()
    this.sequences.name = "sequences"
    this.addChild(this.sequences)

    this.addSequence(VerticalScore, 'width', options);
    this.addSequence(TopTick, 'width', options);
    this.addSequence(BottomTick, 'width', options);

    this.addSequence(HorizontalScore, 'height', options);
    this.addSequence(LeftTick, 'height', options);
    this.addSequence(RightTick, 'height', options);

    this.logo = new Logo(new Point(this.gridSpace), this.gridSpace * 3)
    this.addChild(this.logo)

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

    this.bounds.center = view.center.round()
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
