var delegate = require('component-delegate');
var classes = require('component-classes');

document.addEventListener('touchmove', function(e) {
  e.preventDefault();
});

delegate.bind(document, '.close', 'click', function(e) {
  e.preventDefault();

  var exhibitionDetails = document.querySelector('.details');

  classes(exhibitionDetails).add('is-dismissed');
});
