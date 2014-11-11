var Grid = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this);

    this.gridSpace = options.gridSpace;
    this.padding = options.padding;
    delete options.padding;

    this.addSequence(VerticalLine, 'width', options);
    this.addSequence(TopTick, 'width', options);
    this.addSequence(BottomTick, 'width', options);

    this.addSequence(HorizontalLine, 'height', options);
    this.addSequence(LeftTick, 'height', options);
    this.addSequence(RightTick, 'height', options);

    this.resize(size);
  },

  addSequence: function(klass, axis, options) {
    this.addChild(new GridSequence(klass, axis, options))
  },

  resize: function(size) {
    size -= this.padding * 2;
    this.width = this.maximumEdge(size.width);
    this.height = this.maximumEdge(size.height);

    for (var i=0; i < this.children.length; i++) {
      this.children[i].resize(new Size(this.width, this.height))
    };

    this.bounds.center = view.center.round()
  },

  maximumEdge: function(length) {
    return length - length % this.gridSpace
  }
})
