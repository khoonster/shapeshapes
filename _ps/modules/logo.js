module.exports = Group.extend({
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
      this.bounds.height + this.point.y < size.height);
  }
});
