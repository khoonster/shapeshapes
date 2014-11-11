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

var GridLine = Path.extend({
  statics: {
    getStrokeWidth: function(i) {
      return this.strokePattern[i % this.subdivisions % this.strokePattern.length]
    },

    strokePattern: [2, 1],
    subdivisions: 2
  },

  initialize: function(position, container) {
    var top = this.getTop.apply(this, arguments);
    var left = this.getLeft.apply(this, arguments);
    var angle = this.getAngle.apply(this, arguments);
    var length = this.getLength.apply(this, arguments);

    var start = new Point(left, top);
    var vector = new Point({angle: angle, length: length});
    var end = start + vector;

    Path.prototype.initialize.call(this, {
      segments: [start, end]
    });
  }
})

var VerticalLine = GridLine.extend({
  getTop: function(position, container) {
    return -15
  },
  
  getLeft: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.height + 30
  },
  
  getAngle: function(position, container) {
    return 90
  }
})

var HorizontalLine = GridLine.extend({
  getTop: function(position, container) {
    return position
  },
  
  getLeft: function(position, container) {
    return -15
  },
  
  getLength: function(position, container) {
    return container.width + 30
  },
  
  getAngle: function(position, container) {
    return 0
  }
})

var TopTick = VerticalLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8
  },
  
  getTop: function(position, container) {
    return -10
  },
  
  getLength: function(position, container) {
    return 20
  }
})

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - 10
  }
})

var LeftTick = HorizontalLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8
  },
  
  getLeft: function() {
    return -10
  },
  
  getLength: function(position, container) {
    return 20
  }
})

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - 10
  }
})

var GridSequence = Group.extend({
  initialize: function(line, direction, options) {
    Group.prototype.initialize.call(this);

    this.line = line;
    this.direction = direction;
    this.gridSpace = options.gridSpace;
  },
  
  resize: function(size) {
    this.height = size.height;
    this.width = size.width;
    this.drawLines(size)
  },
  
  drawLines: function(size) {
    var count = this.linesWithin(size[this.direction]);

    this.clear()

    for (var i=0; i <= count; i++) {
      var line = this.makeLine(i);
      this.insertChild(i, line);
    };
  },

  makeLine: function(i) {
    var klass = this.line;
    var position = i * this.gridSpace / klass.subdivisions
    var line = new klass(position, new Size(this.width, this.height));
    line.strokeColor = 'white';
    line.strokeWidth = klass.getStrokeWidth(i);
    return line;
  },

  linesWithin: function(l) {
    return Math.floor(l / this.gridSpace * this.line.subdivisions);
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
  padding: new Size(100, 100)
});

var container = document.getElementsByClassName('shape-container')[0];
var svgs = container.children;
var shapes = new SVGPresenter(svgs, view.size);

function onResize(event) {
  grid.resize(view.size);
  pool.resize(view.size);
}
