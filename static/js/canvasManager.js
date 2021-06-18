//background image is 740x468
const CANVAS_BACKGROUND_IMAGE_URL = '../assets/ctc_main.png';

const SCALE_FACTOR = 5;

const CANVAS_WIDTH = 740 * SCALE_FACTOR;
const CANVAS_HEIGHT = 468 * SCALE_FACTOR;

// Current corgi image is 1024x700
const CHARACTER_WIDTH = 75 * SCALE_FACTOR;
const CHARACTER_LENGTH = 51 * SCALE_FACTOR;

const NAME_VERTICAL_TEXT_OFFSET = 10;
const NAME_HORIZONTAL_BUFFER = 5;
const NAME_TEXT_MAX_WIDTH = CHARACTER_WIDTH + 2 * NAME_HORIZONTAL_BUFFER;
const NAME_FONT_SIZE_PX = 50;
const NAME_FONT_FAMILY = 'monospace';
const NAME_FONT = `${NAME_FONT_SIZE_PX}px ${NAME_FONT_FAMILY}`;

const COLOR_TO_URL = Object.freeze(
  new Map([
    ['none', 'assets/corgi-slide-none.png'],
    ['red', 'assets/corgi-slide-red.png'],
    ['green', 'assets/corgi-slide-green.png'],
    ['blue', 'assets/corgi-slide-blue.png']
  ])
);

function drawNameOnImage(ctx, text, x, y) {
  textX = x + CHARACTER_WIDTH * 0.5;
  textY = y - NAME_VERTICAL_TEXT_OFFSET;

  ctx.font = NAME_FONT;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 7;
  ctx.lineWidth = 5;
  ctx.strokeText(text, textX, textY, NAME_TEXT_MAX_WIDTH);

  ctx.shadowBlur = 0;
  ctx.fillStyle = 'black';
  ctx.fillText(text, textX, textY, NAME_TEXT_MAX_WIDTH);
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
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.ctx = canvas.getContext('2d');
    this.characterManager = characterManager;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
      drawNameOnImage(
        this.ctx,
        name,
        info.currentX * SCALE_FACTOR,
        info.currentY * SCALE_FACTOR
      );
      this.ctx.drawImage(
        placeImage(COLOR_TO_URL.get(info.attributes.color)),
        info.currentX * SCALE_FACTOR,
        info.currentY * SCALE_FACTOR,
        CHARACTER_WIDTH,
        CHARACTER_LENGTH
      );
      //console.log(name + ' is in characterList');
      //console.log(info.attributes.color + ' color');
    }
  }
}
