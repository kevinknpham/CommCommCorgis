const characters = new CharacterManager();
const canvas = new CanvasManager(
  document.getElementById('myCanvas'),
  characters
);
const canvasElement = document.getElementById('myCanvas');

function animate() {
  canvas.clearCanvas();
  canvas.saveCanvasState();
  canvas.drawOnCanvas();
  // console.log('after draw on canvas');
  requestAnimationFrame(animate);
}

// function moveCharacter(name) {
//   let x = 1;
//   let y = 1;
//   console.log('I am here?');
//   canvasElement.addEventListener('click', (event) => {
//     x = event.offsetX;
//     y = event.offsetY;
//   });
//   console.log(x + ': location of x');
//   console.log(y + ': location of y');
//   sendMoveRequestToServer(name, x, y);
// }

canvasElement.addEventListener('click', (event) => {
  let x =
    ((event.offsetX - 75 / 1.25) / 1344) *
    canvas.getCanvasBackgroundImageWidth();
  let y =
    ((event.offsetY - 75 / 1.25) / 850) *
    canvas.getCanvasBackgroundImageHeight();
  console.log(username + ' ' + x + ' ' + y);
  sendMoveRequestToServer(username, x, y);
});

function handleMoveChar(data) {
  if (data.name) {
    characters.moveCharacter(data.name, data.x, data.y);
  }
  console.log(
    data.name + ' is trying to move to (' + data.x + ', ' + data.y + ').'
  );
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
// characters.addCharacter('Kevin');

// setTimeout(() => characters.moveCharacter('Kevin', 100, 200), 10000);
