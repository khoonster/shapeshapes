(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Padded = require('./modules/size/padded.js')
var CuttingMat = require('./modules/cutting_mat.js');

var constrainToMaximum = function(size) {
  var maxSize = new Size(722, 760);

  return Size.min(size, maxSize);
}

var gridSize = new Size(38, 38);
var mat = new CuttingMat(constrainToMaximum(new Padded(view.size)), gridSize);

var closeButton = document.querySelector('.details .close');
var description = document.querySelector('.details .inset');

view.onResize = function(event) {
  var padded = constrainToMaximum(new Padded(view.size));
  var matDimensions = padded - (padded % gridSize);
  var descriptionDimensions = matDimensions - new Size(2, 2) - (gridSize * 2) - (new Size(0, gridSize.height) * 3);

  mat.resize(padded);
  mat.position = view.center.round();

  closeButton.style.marginLeft = (matDimensions.width / 2 + 19) + "px";
  closeButton.style.marginTop = (-matDimensions.height / 2 - 38 - 19) + "px";
  closeButton.style.top = "50%";
  closeButton.style.left = "50%";

  description.style.marginLeft = -descriptionDimensions.width / 2 + "px";
  description.style.marginTop = (-descriptionDimensions.height / 2 + gridSize.height * 1.5) + "px";
  description.style.width = descriptionDimensions.width + "px";
  description.style.height = descriptionDimensions.height + "px";
  description.style.top = "50%";
  description.style.left = "50%";
}

},{"./modules/cutting_mat.js":3,"./modules/size/padded.js":10}],2:[function(require,module,exports){
var Background = function() {
  this.color = document.body.getAttribute('data-fill-color') || "#111111";
}

module.exports = Background;

},{}],3:[function(require,module,exports){
var Score = require('./score.js');
var Tick = require('./tick.js');
var Grid = require('./grid.js');

var CuttingMat = Group.extend({
  initialize: function(size, gridSpace) {
    this.grid = new Grid(size, {
      gridSpace: gridSpace,
      y: [Score.Horizontal, Tick.Left, Tick.Right],
      x: [Score.Vertical, Tick.Top, Tick.Bottom]
    });

    Group.prototype.initialize.call(this, [this.grid]);
  },

  resize: function(size) {
    this.grid.resize(size);
  }
});

module.exports = CuttingMat;

},{"./grid.js":4,"./score.js":9,"./tick.js":12}],4:[function(require,module,exports){
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

},{"./grid/sequencer.js":6,"./logo.js":8,"./score.js":9,"./size/rounded.js":11,"./tick.js":12}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./sequence.js":5}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var Background = require('./background.js');

var Logo = Group.extend({
  initialize: function(point, size) {
    this.size = new Size(size);
    this.point = new Point(point);

    var elements = document.getElementsByClassName('logo');
    var logo = elements[0];
    var svg = logo.children[0];

    var background = new Background();

    var fill = new Shape.Rectangle(new Point(0, 0), this.size);
    fill.fillColor = background.color;
    fill.strokeWidth = 2;
    fill.strokeColor = 'white';

    var text = project.importSVG(svg);
    text.fillColor = 'white';
    text.bounds.center = this.size / 2;
    text.scale(1.8);

    Group.prototype.initialize.call(this, {
      children: [fill, text],
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

},{"./background.js":2}],9:[function(require,module,exports){
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

},{"./line.js":7}],10:[function(require,module,exports){
var PaddedSize = Size.extend({
  initialize: function(size, options) {
    this.options = options;
    this.padding = this.paddingForSize(size);

    Size.prototype.initialize.call(this, size);

    this.width -= this.padding.width * 2;
    this.height -= this.padding.height * 2;
  },

  paddingForSize: function(size) {
    if (size.width < 500 || size.height < 400) {
      return new Size(25, 25);
    } else {
      return new Size(100, 100);
    }
  }
})

module.exports = PaddedSize;

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./line.js":7}]},{},[1])