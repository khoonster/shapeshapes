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
