module.exports = Group.extend({
  initialize: function(el, size) {
    Group.prototype.initialize.call(this);

    this.path = this.importSVG(el);
    this.path.position = new Point(Math.random() * size.width,
                                   Math.random() * size.height);
    this.width = this.path.bounds.width;
    this.height = this.path.bounds.height;
    this.held = false;

    this.originalVector = new Point({
      angle: 360 * Math.random(),
      length: 0.2 * Math.random()
    });

    this.vector = this.originalVector.clone();

    this.onFrame = function() {
      if (!this.held) {
        this.iterate()
      };
    }

    this.onMouseUp = function() {
      this.held = false;
    }

    this.onMouseDown = function() {
      this.vector.length = 0;
      this.held = true;
    }

    this.onMouseDrag = function(event) {
      this.vector = new Point(event.delta);
      this.path.position += event.delta;
    }
  },

  iterate: function() {
    this.checkBorders();
    this.modulateVector();
    this.path.position += this.vector;
  },

  checkBorders: function() {
    var size = view.size,
        position = this.path.position;

    if (position.x < -this.width) {
      position.x = size.width + this.width;
      this.held = false;
    } else if (position.x > size.width + this.width) {
      position.x = -this.width;
      this.held = false;
    }

    if (position.y < -this.height) {
      position.y = size.height + this.height;
      this.held = false;
    } else if (position.y > size.height + this.height) {
      position.y = -this.height;
      this.held = false;
    }
  },
  
  modulateVector: function() {
    if (this.vector.length > this.originalVector.length) {
      this.vector.length *= 0.8;
    };
  }
})
