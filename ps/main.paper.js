(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Score = require('./modules/score.js');
var Tick = require('./modules/tick.js');
var Padded = require('./modules/size/padded.js')
var Pool = require('./modules/pool.js');
var Grid = require('./modules/grid.js');
var SVGPresenter = require('./modules/svg_presenter.js');

var pool = new Pool(view.size);

var grid = new Grid(new Padded(view.size), {
  gridSpace: new Size(38, 38),
  y: [Score.Horizontal, Tick.Left, Tick.Right],
  x: [Score.Vertical, Tick.Top, Tick.Bottom]
});

var shapes = SVGPresenter.fromClassName('shape-container', view.size);

view.onResize = function(event) {
  var padded = new Padded(view.size);

  grid.resize(padded);
  grid.position = view.center.round();
  
  pool.resize(view.size);
  pool.position = view.center;
}

},{"./modules/grid.js":2,"./modules/pool.js":7,"./modules/score.js":8,"./modules/size/padded.js":11,"./modules/svg_presenter.js":13,"./modules/tick.js":14}],2:[function(require,module,exports){
var Score = require('./score.js');
var Tick = require('./tick.js');
var Logo = require('./logo.js');
var Rounded = require('./size/rounded.js');

var GridLogo = Logo.extend({
  initialize: function(grid) {
    var size = new Size(grid.width * 3, grid.height * 2);
    Logo.prototype.initialize.call(this, new Point(grid), size)
  }
})

var Grid = Group.extend({
  statics: {
    Sequencer: require('./grid/sequencer.js')
  },

  initialize: function(size, options) {
    this.gridSpace = options.gridSpace;

    this.sequencer = new Grid.Sequencer({
      'width': options.x,
      'height': options.y
    }, options);

    this.logo = new GridLogo(this.gridSpace);

    Group.prototype.initialize.call(this, [this.sequencer, this.logo]);

    this.resize(size);
  },

  resize: function(size) {
    size = new Rounded(size, this.gridSpace);

    for (var i=0; i < this.children.length; i++) {
      this.children[i].resize(size);
    };
  }
})

module.exports = Grid;

},{"./grid/sequencer.js":4,"./logo.js":6,"./score.js":8,"./size/rounded.js":12,"./tick.js":14}],3:[function(require,module,exports){
var Sequence = Group.extend({
  initialize: function(line, direction, options) {
    Group.prototype.initialize.call(this);

    this.line = line;
    this.direction = direction;
    this.gridSpace = options.gridSpace;
    this.interval = this.gridSpace[this.direction] / this.line.subdivisions;
  },
  
  resize: function(size) {
    this.height = size.height;
    this.width = size.width;
    this.drawLines(size);
  },
  
  drawLines: function(size) {
    var count = this.linesWithin(size[this.direction]);

    this.clear();

    for (var i=0; i <= count; i++) {
      var line = this.drawLine(i);
      this.insertChild(i, line);
    };
  },

  drawLine: function(i) {
    var position = i * this.interval;
    return this.makeLine(position, new Size(this.width, this.height), i);
  },

  makeLine: function(position, size, i) {
    var klass = this.line;
    return new klass(position, size, i);
  },

  linesWithin: function(l) {
    return Math.floor(l / this.interval);
  }
});

module.exports = Sequence;

},{}],4:[function(require,module,exports){
var Sequence = require('./sequence.js');

var Sequencer = Group.extend({
  initialize: function(sequences, options) {
    var axes = ['width', 'height'];

    this.options = options;

    Group.prototype.initialize.call(this);

    for (var i=0; i < axes.length; i++) {
      var axis = axes[i];
      for (var a=0; a < sequences[axis].length; a++) {
        this.add(sequences[axis][a], axis, this.options)
      };
    };
  },

  add: function(klass, axis, options) {
    this.addChild(new Sequence(klass, axis, options))
  },

  resize: function(size) {
    for (var i=0; i < this.children.length; i++) {
      this.children[i].resize(size);
    }
  }
})

module.exports = Sequencer;

},{"./sequence.js":3}],5:[function(require,module,exports){
var Line = Path.extend({
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
    
    this.strokeColor = 'white';
    this.strokeWidth = this.constructor.getStrokeWidth(this.args[2]);
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

module.exports = Line;

},{}],6:[function(require,module,exports){
var Logo = Group.extend({
  initialize: function(point, size) {
    this.size = new Size(size);
    this.point = new Point(point);

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
      this.bounds.height + this.point.y < size.height);
  }
});

module.exports = Logo;

},{}],7:[function(require,module,exports){
module.exports = Group.extend({
  initialize: function(size, options) {
    Group.prototype.initialize.call(this);

    this.resize(size);
  },
  
  resize: function(size) {
    this.clear();
    
    var rect = Shape.Rectangle(new Point(0, 0), size);
    rect.fillColor = 'black';
    
    this.addChild(rect);
  }
})

},{}],8:[function(require,module,exports){
var Line = require('./line.js');

var BaseScore = Line.extend({
  statics: {
    offsetPattern: [12, 9]
  },

  getOffset: function(_, _, i) {
    var lengths = this.constructor.offsetPattern;
    var index = i % this.constructor.subdivisions % lengths.length;
    return lengths[index]
  }
});

var VerticalScore = BaseScore.extend({
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
});

var HorizontalScore = BaseScore.extend({
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
});

module.exports = {
  Vertical: VerticalScore,
  Horizontal: HorizontalScore
}

},{"./line.js":5}],9:[function(require,module,exports){
module.exports = {
  Custom: require('./shape/custom.js')
}

},{"./shape/custom.js":10}],10:[function(require,module,exports){
var CustomShape = Group.extend({
  initialize: function(el, size) {
    Group.prototype.initialize.call(this);

    this.path = this.importSVG(el);
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

module.exports = CustomShape;

},{}],11:[function(require,module,exports){
var PaddedSize = Size.extend({
  initialize: function(size, grid) {
    var grid = new Size(grid);
    var padding;

    Size.prototype.initialize.call(this, size);

    if (this.width < 500 || this.height < 400) {
      padding = new Size(25, 25);
    } else {
      padding = new Size(100, 100);
    }

    this.width -= padding.width * 2;
    this.height -= padding.height * 2;
  }
})

module.exports = PaddedSize;

},{}],12:[function(require,module,exports){
var RoundedSize = Size.extend({
  initialize: function(size, grid) {
    var grid = new Size(grid);

    Size.prototype.initialize.call(this, size);

    this.width = this.maximum(this.width, grid.width);
    this.height = this.maximum(this.height, grid.height);
  },

  maximum: function(length, mod) {
    return length - length % mod;
  }
})

module.exports = RoundedSize;

},{}],13:[function(require,module,exports){
var Shape = require('./shape.js')

module.exports = Group.extend({
  statics: {
    fromClassName: function(name, size) {
      var container = document.getElementsByClassName(name)[0];
      new this(container.children, size);
    }
  },

  initialize: function(svgs, size) {
    Group.prototype.initialize.call(this);

    for (var i = svgs.length - 1; i >= 0; i--){
      var shape = new Shape.Custom(svgs[i], size);
      shape.path.position = new Point.random() * size;
      this.addChild(shape);
    };
  }
})

},{"./shape.js":9}],14:[function(require,module,exports){
var Line = require('./line.js');

var Tick = Line.extend({
  statics: {
    strokePattern: [0, 1, 1, 1],
    subdivisions: 8,
    lengthPattern: [0, 9, 18, 9]
  },
  
  getLength: function(_, _, i) {
    var lengths = this.constructor.lengthPattern;
    var index = i % this.constructor.subdivisions % lengths.length;
    return lengths[index]
  },
  
  getOffset: function(_, _, i) {
    return this.get('length') / 2
  }
});

var TopTick = Tick.extend({
  getAngle: 90,

  getTop: function() {
    return -this.get('offset')
  },

  getLeft: function(position) {
    return position
  }
});

var BottomTick = TopTick.extend({
  getTop: function(position, container) {
    return container.height - this.get('offset')
  }
});

var LeftTick = Tick.extend({
  getAngle: 0,

  getLeft: function() {
    return -this.get('offset')
  },
  
  getTop: function(position) {
    return position
  }
});

var RightTick = LeftTick.extend({
  getLeft: function(position, container) {
    return container.width - this.get('offset')
  }
});

module.exports = {
  Top: TopTick,
  Bottom: BottomTick,
  Left: LeftTick,
  Right: RightTick
}

},{"./line.js":5}]},{},[1])