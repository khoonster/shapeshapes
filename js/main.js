var path = new Path.Circle({
  center: view.center,
  radius: 30,
  strokeColor: 'black'
});

function onResize(event) {
  path.position = view.center;
}
