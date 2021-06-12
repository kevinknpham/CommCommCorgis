const characters = new CharacterManager();
const canvas = new CanvasManager(
  document.getElementById('myCanvas'),
  characters
);
const canvasElement = document.getElementById('myCanvas');

function animate() {
  canvas.clearCanvas();
  console.log('after clear canvas');
  canvas.saveCanvasState();
  console.log('after save canvas');
  canvas.drawOnCanvas();
  console.log('after draw on canvas');
  requestAnimationFrame(animate);
}

function moveCharacter(name) {
  let x = 1;
  let y = 1;

  canvasElement.addEventListener('click', (event) => {
    x = event.offsetX;
    y = event.offsetY;
  });
  console.log(x + ': location of x');
  console.log(y + ': location of y');
  sendMoveRequestToServer(name, x, y);
}

function handleMoveChar(data) {
  if (data.name && data.x && data.y) {
    characters.moveCharacter(data.name, data.x, data.y);
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

animate();
characters.addCharacter('Kevin');

setTimeout(() => characters.moveCharacter('Kevin', 100, 200), 10000);
