const CANVAS_BACKGROUND_IMAGE_URL = '../assets/ctc_main.png';

const COLOR_TO_URL = Object.freeze(
  new Map([
    ['none', 'assets/corgi-slide-none.png'],
    ['red', 'assets/corgi-slide-red.png'],
    ['green', 'assets/corgi-slide-green.png'],
    ['blue', 'assets/corgi-slide-blue.png']
  ])
);

function placeImage(url) {
  const image = new Image();
  image.src = url;
  return image;
}

class CanvasManager {
  #canvas;
  #ctx;
  #characterManager;

  constructor(canvas, characterManager) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#characterManager = characterManager;
    this.#ctx.imageSmoothingEnabled = false;
  }

  clearCanvas() {
    this.#ctx.drawImage(
      placeImage(CANVAS_BACKGROUND_IMAGE_URL),
      0,
      0,
      this.#canvas.width,
      this.#canvas.height
    );
    this.#ctx.save();
  }

  saveCanvasState() {
    this.#characterManager.updateAllCharacterCurrentPositions();
  }

  drawOnCanvas() {
    const characterList = this.#characterManager.listCharacters();
    for (let i = 0; i < characterList.length; i++) {
      const name = characterList[i];
      const info = this.#characterManager.getCharacterInfo(name);
      this.#ctx.drawImage(
        placeImage('assets/corgi-slide-blue.png'),
        info.currentX,
        info.currentY,
        120,
        120
      );
      console.log(name + ' is in characterList');
    }
  }
}
