Shape.Custom = Group.extend({
  initialize: function(el, size) {
    Group.prototype.initialize.call(this)
    
    this.path = this.importSVG(el);
    this.path.position = new Point(Math.random() * size.width,
                                   Math.random() * size.height);

    this.onFrame = function() {
      this.iterate()
    }

    this.vector = new Point({
      angle: 360 * Math.random(),
      length: 0.5 * Math.random()
    });
  },
  
  iterate: function() {
    this.checkBorders()
    this.path.position += this.vector;
  },
  
  checkBorders: function() {
    var size = view.size;
    if (this.path.position.x < -this.path.bounds.width) {
      this.path.position.x = size.width + this.path.bounds.width;
    } else if (this.path.position.x > size.width + this.path.bounds.width) {
      this.path.position.x = -this.path.bounds.width;
    }
    
    if (this.path.position.y < -this.path.bounds.height) {
      this.path.position.y = size.height + this.path.bounds.height;
    } else if (this.path.position.y > size.height + this.path.bounds.height) {
      this.path.position.y = -this.path.bounds.height;
    }
  },
})
