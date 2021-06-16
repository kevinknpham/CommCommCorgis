const CANVAS_BACKGROUND_IMAGE_URL = '../assets/ctc_main.png';
const CHARACTER_LENGTH = 75;

const COLOR_TO_URL = Object.freeze(
  new Map([
    ['none', 'assets/corgi-slide-none.png'],
    ['red', 'assets/corgi-slide-red.png'],
    ['green', 'assets/corgi-slide-green.png'],
    ['blue', 'assets/corgi-slide-blue.png']
  ])
);

function drawNameOnImage(ctx, text, x, y) {
  ctx.font = '50px monospace';
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 7;
  ctx.lineWidth = 5;
  ctx.strokeText(text, x + 10, y);
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'black';
  ctx.fillText(text, x + 10, y);
}

function placeImage(url) {
  const image = new Image();
  image.src = url;
  return image;
}

class CanvasManager {
  canvas;
  ctx;
  characterManager;

  constructor(canvas, characterManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.characterManager = characterManager;
  }

  clearCanvas() {
    this.ctx.drawImage(
      placeImage(CANVAS_BACKGROUND_IMAGE_URL),
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.ctx.save();
  }

  saveCanvasState() {
    this.characterManager.updateAllCharacterCurrentPositions();
  }

  drawOnCanvas() {
    const characterList = this.characterManager.listCharacters();
    for (let i = 0; i < characterList.length; i++) {
      const name = characterList[i];
      const info = this.characterManager.getCharacterInfo(name);
      drawNameOnImage(this.ctx, name, info.currentX, info.currentY);
      this.ctx.drawImage(
        placeImage(COLOR_TO_URL.get(info.attributes.color)),
        info.currentX,
        info.currentY,
        CHARACTER_LENGTH,
        CHARACTER_LENGTH
      );
      //console.log(name + ' is in characterList');
      //console.log(info.attributes.color + ' color');
    }
  }
}
