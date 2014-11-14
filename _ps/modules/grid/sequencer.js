var Sequence = require('./sequence.js')

module.exports = Group.extend({
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
