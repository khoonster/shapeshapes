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

var GridLine = Path.extend({
  statics: {
    getStrokeWidth: function(i) {
      return this.strokePattern[i % this.subdivisions % this.strokePattern.length]
    },

    strokePattern: [2, 1],
    subdivisions: 2
  },

  initialize: function() {
    this.args = arguments;

    var left = this.get('left');
    var top = this.get('top');
    var angle = this.get('angle');
    var length = this.get('length');

    var start = new Point(left, top);
    var vector = new Point({angle: angle, length: length});
    var end = start + vector;

    Path.prototype.initialize.call(this, {
      segments: [start, end]
    });
  },
  
  get: function(attr) {
    var name = attr.charAt(0).toUpperCase() + attr.slice(1);
    var val = this['get' + name];
    if (typeof val == "function") {
      return val.apply(this, this.args);
    } else {
      return val
    }
  }
})

var Score = GridLine.extend({
  statics: {
    offsetPattern: [12, 9]
  },
  
  getOffset: function(_, _, i) {
    var lengths = this.constructor.offsetPattern
    var index = i % this.constructor.subdivisions % lengths.length
    return lengths[index]
  }
})

var VerticalScore = Score.extend({
  getAngle: 90,
  
  getTop: function() {
    return - this.get('offset')
  },

  getLeft: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.height + this.get('offset') * 2
  }
})

var HorizontalScore = Score.extend({
  getAngle: 0,

  getLeft: function() {
    return - this.get('offset')
  },
  
  getTop: function(position, container) {
    return position
  },
  
  getLength: function(position, container) {
    return container.width + this.get('offset') * 2
  }
})

var Tick = GridLine.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8,
    lengthPattern: [0, 9, 18, 9]
  },
  
  getLength: function(_, _, i) {
    var lengths = this.constructor.lengthPattern
    var index = i % this.constructor.subdivisions % lengths.length
    return lengths[index]
  },
  
  getOffset: function(_, _, i) {
    return this.get('length') / 2
  }
})

var TopTick = Tick.extend({
  getAngle: 90,

  getTop: function() {
    return -this.get('offset')
  },

  getLeft: function(position) {
    return position
  }
})

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - this.get('offset')
  }
})

var LeftTick = Tick.extend({
  getAngle: 0,

  getLeft: function() {
    return -this.get('offset')
  },
  
  getTop: function(position) {
    return position
  }
})

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - this.get('offset')
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
    var line = new klass(position, new Size(this.width, this.height), i);
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

var Logo = Group.extend({
  initialize: function(point, size) {
    point = new Point(point);
    size = new Size(size);

    this.point = point;
    this.size = new Size(size.width, size.height - size.width / 3);

    var elements = document.getElementsByClassName('logo');
    var logo = elements[0];
    var svg = logo.children[0];

    var background = new Shape.Rectangle(new Point(0, 0), this.size);
    background.fillColor = 'black';
    background.strokeWidth = 2;
    background.strokeColor = 'white';

    var text = project.importSVG(svg);
    text.fillColor = 'white';
    text.bounds.center = this.size / 2;
    text.scale(1.8);

    Group.prototype.initialize.call(this, {
      children: [background, text],
      position: this.point
    });
  },
  
  resize: function(size) {
    this.bounds.point = this.point;
    this.visible = this.fitsWithin(size);
  },
  
  fitsWithin: function(size) {
    return (this.bounds.width + this.point.x < size.width &&
      this.bounds.height + this.point.y < size.height)
  }
})

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
  gridSpace: 38,
  padding: new Size(100, 100)
});

var container = document.getElementsByClassName('shape-container')[0];
var svgs = container.children;
var shapes = new SVGPresenter(svgs, view.size);

function onResize(event) {
  grid.resize(view.size);
  pool.resize(view.size);
}
