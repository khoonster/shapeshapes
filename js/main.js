var Grid = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this)

    this.gridSpace = options.gridSpace;
    this.overhang = options.overhang;
    this.subdivisions = options.subdivisions;
    this.padding = options.padding;

    this.resize(size);
  },

  resize: function(size) {
    this.s = size - this.padding * 2;
    this.width = this.maximumEdge(this.s.width);
    this.height = this.maximumEdge(this.s.height);
    this.drawLines('horizontal_lines', 'makeHorizontalLine', this.height);
    this.drawLines('vertical_lines', 'makeVerticalLine', this.width);
  },

  drawLines: function(set, func, size) {
    var count = this.linesWithin(size);

    if (typeof this[set] === "undefined") {
      this[set] = new Group();
    };

    for (var i=0; i < this[set].children.length; i++) {
      this[set].removeChildren(i);
    };

    for (var i=0; i <= count; i++) {
      var line = this[func](i * this.gridSpace / this.subdivisions);
      this[set].insertChild(i, line);
    };
    
    this[set].bounds.center = new Point(Math.round(view.center.x), Math.round(view.center.y));
  },

  makeVerticalLine: function(x) {
    return this.makeLine(this.verticalBounds(x), this.getStrokeWidth(x));
  },

  makeHorizontalLine: function(y) {
    return this.makeLine(this.horizontalBounds(y), this.getStrokeWidth(y));
  },

  linesWithin: function(l) {
    return Math.floor(l / this.gridSpace * this.subdivisions);
  },

  getStrokeWidth: function(n) {
    if (n % this.gridSpace) {
      return 1
    } else {
      return 2
    }
  },

  horizontalBounds: function(y) {
    var top = y,
        left = -this.overhang,
        right = this.width + this.overhang,
        from = new Point(left, top),
        to = new Point(right, top);
    return new LineBounds(from, to);
  },

  verticalBounds: function(x) {
    var left = x,
        top = -this.overhang,
        bottom = this.height + this.overhang,
        from = new Point(left, top),
        to = new Point(left, bottom);
    return new LineBounds(from, to);
  },

  maximumEdge: function(length) {
    return length - length % this.gridSpace
  },

  makeLine: function(bounds, strokeWidth) {
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
    this.resize(size);
  },
  
  resize: function(size) {
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
  padding: new Size(0, 0)
});

var grid = new Grid(view.size, {
  gridSpace: 40,
  overhang: 15,
  subdivisions: 2,
  padding: new Size(100, 100)
});

var container = document.getElementsByClassName('shape-container')[0];
var svgs = container.children;
var shapes = new SVGPresenter(svgs, view.size);

function onResize(event) {
  grid.resize(view.size);
  pool.resize(view.size);
}
