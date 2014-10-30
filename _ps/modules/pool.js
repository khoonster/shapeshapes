var Pool = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this)
    
    this.padding = new Size(options.padding);
    this.write(size);
  },
  
  write: function(size) {
    this.clear()
    
    var rect = Shape.Rectangle(new Point(0, 0), size - this.padding * 2);
    rect.fillColor = 'black';
    
    this.addChild(rect);
    this.position = view.center
  }
})
