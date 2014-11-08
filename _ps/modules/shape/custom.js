Shape.Custom = Group.extend({
  initialize: function(el, size) {
    Group.prototype.initialize.call(this)

    this.path = this.importSVG(el);
    this.path.position = new Point(Math.random() * size.width,
                                   Math.random() * size.height);
    this.width = this.path.bounds.width;
    this.height = this.path.bounds.height;


    this.onFrame = function() {
      this.iterate()
    }

    this.vector = new Point({
      angle: 360 * Math.random(),
      length: 0.1 * Math.random()
    });
  },

  iterate: function() {
    this.checkBorders()
    this.path.position += this.vector;
  },

  checkBorders: function() {
    var size = view.size,
        position = this.path.position;

    if (position.x < -this.width) {
      position.x = size.width + this.width;
    } else if (position.x > size.width + this.width) {
      position.x = -this.width;
    }

    if (position.y < -this.height) {
      position.y = size.height + this.height;
    } else if (position.y > size.height + this.height) {
      position.y = -this.height;
    }
  },
})
