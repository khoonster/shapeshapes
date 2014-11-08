var SVGPresenter = Group.extend({
  initialize: function(svgs, size) {
    Group.prototype.initialize.call(this)

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = new Shape.Custom(svgs[i], size)
      this.addChild(shape)
    };
  },
  
  iterate: function() {
    for (var i=0; i < this.children.length; i++) {
      this.children[i].iterate()
    };
  }
})
