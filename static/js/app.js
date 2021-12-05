/**
 * Sends and handles requests for moving the characters.
 */

const characters = new CharacterManager();
const canvas = new CanvasManager(document.getElementById('myCanvas'), characters);
const canvasElement = document.getElementById('myCanvas');
const zoomFactor = window.devicePixelRatio;

/**
 * Animation for canvas
 * No parameters
 * Returns nothing
 */
function animate() {
  canvas.clearCanvas();
  canvas.saveCanvasState();
  canvas.drawOnCanvas();
  requestAnimationFrame(animate);
}

// Listens for click from the user and sends information to server.
canvasElement.addEventListener('click', event => {
  let x = ((event.offsetX - 67 / (zoomFactor)) / 1344) * canvas.getCanvasBackgroundImageWidth() * zoomFactor;
  let y = ((event.offsetY - 45 / (zoomFactor)) / 850) * canvas.getCanvasBackgroundImageHeight() * zoomFactor;
  sendMoveRequestToServer(username, x, y);
});

/**
 * Moves all character in given data appropriately.
 * @param {*} data
 */
function handleMoveChar(data) {
  if (roomCheck(data.room)) {
    if (data.name) {
      characters.moveCharacter(data.name, data.x, data.y);
    }
  }
}

/**
 * Sends a request to server to move character with the
 * given username to the given x and y.
 * @param {String} username
 * @param {Integer} x
 * @param {Integer} y
 */
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
