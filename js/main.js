var Grid = Group.extend({
  initialize: function(size, options) {
    this.grid_space = options.grid_space;
    this.overhang = options.overhang;
    this.subdivisions = options.subdivisions;
    this.padding = options.padding;
    this.write(size);
  },
  
  write: function(size) {
    this.width = size.width;
    this.height = size.height;
    this.offset_point = new Point(this.offset(this.width), this.offset(this.height));
    this.draw_lines('horizontal_lines', 'make_horizontal_line', this.height);
    this.draw_lines('vertical_lines', 'make_vertical_line', this.width);
  },

  draw_lines: function(set, func, size) {
    var count = this.lines_within(size);

    if (typeof this[set] === "undefined") {
      this[set] = new Group();
    };

    for (var i=0; i < this[set].children.length; i++) {
      this[set].removeChildren(i);
    };

    for (var i=0; i <= count; i++) {
      var line = this[func](i * this.grid_space / this.subdivisions);
      this[set].insertChild(i, line);
    };
  },

  make_vertical_line: function(x) {
    return this.make_line(this.vertical_bounds(x), this.stroke_width(x));
  },

  make_horizontal_line: function(y) {
    return this.make_line(this.horizontal_bounds(y), this.stroke_width(y));
  },

  lines_within: function(l) {
    return Math.floor(this.size(l) / this.grid_space * this.subdivisions);
  },

  size: function(l) {
    return this.maximum_edge(l) - this.padding;
  },

  offset: function(l) {
    return Math.floor(((l - this.padding * 2) % this.grid_space) / 2);
  },

  stroke_width: function(n) {
    if (n % this.grid_space) {
      return 1
    } else {
      return 2
    }
  },

  horizontal_bounds: function(y) {
    var top = this.padding + y,
        left = this.padding - this.overhang,
        right = this.maximum_edge(this.width) + this.overhang,
        from = new Point(left, top),
        to = new Point(right, top);
    return new LineBounds(from, to).add(this.offset_point);
  },

  vertical_bounds: function(x) {
    var left = this.padding + x,
        top = this.padding - this.overhang,
        bottom = this.maximum_edge(this.height) + this.overhang,
        from = new Point(left, top),
        to = new Point(left, bottom);
    return new LineBounds(from, to).add(this.offset_point);
  },

  maximum_edge: function(length) {
    return length - this.padding - length % this.grid_space
  },

  make_line: function(bounds, strokeWidth) {
    return new Path.Line({
      from: bounds.from,
      to: bounds.to,
      strokeColor: 'white',
      strokeWidth: strokeWidth || 2
    });
  }
})
function LineBounds(from, to, offset) {
  this.from = new Point(from) + offset;
  this.to = new Point(to) + offset;
}

LineBounds.prototype.add = function(point) {
  var offset = new Point(point);
  this.from = this.from + offset;
  this.to = this.to + offset;
  return this;
}

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

var SVGPresenter = Group.extend({
  initialize: function(svgs, size) {
    Group.prototype.initialize.call(this)

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = new Shape.Custom(svgs[i], size)
      this.addChild(shape)
    };
  }
})

Shape.Custom = Group.extend({
  initialize: function(el, size) {
    Group.prototype.initialize.call(this)

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
    this.checkBorders()
    this.modulateVector()
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

var pool = new Pool(view.size, {
  padding: new Size(40, 40)
});

var grid = new Grid(view.size, {
  grid_space: 40,
  overhang: 15,
  subdivisions: 2,
  padding: 100
});

var container = document.getElementsByClassName('shape-container')[0];
var svgs = container.children;
var shapes = new SVGPresenter(svgs, view.size);

function onResize(event) {
  grid.write(view.size);
  pool.write(view.size);
}
