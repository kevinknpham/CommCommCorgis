const characters = new CharacterManager();
const canvas = new CanvasManager(
  document.getElementById('myCanvas'),
  characters
);

function animate() {
  canvas.clearCanvas();
  canvas.saveCanvasState();
  canvas.drawOnCanvas();
  requestAnimationFrame(animate);
}

function handleMoveChar(data) {
  if (data.name && data.x && data.y) {
  }
}

function sendMoveRequestToServer(username, x, y) {
  let datum = {
    name: username,
    x: parseInt(x),
    y: parseInt(y),
    action: 'update'
  };
  ws.send(JSON.stringify(datum));
  console.log(datum);
}
