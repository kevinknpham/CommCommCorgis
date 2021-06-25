//background image is 633x361
const CANVAS_BACKGROUND_IMAGE_URL_DEFAULT = '../assets/ctc_main.png';
const CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT = [[[84, 425], 'hub_games']];

const SCALE_FACTOR = 5;

// Current corgi image is 1024x700
const CHARACTER_WIDTH = 67 * SCALE_FACTOR;
const CHARACTER_LENGTH = 45 * SCALE_FACTOR;

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

  backgroundUrl;
  backgroundWidth;
  backgroundHeight;
  doors;

  constructor(canvas, characterManager) {
    this.backgroundUrl = CANVAS_BACKGROUND_IMAGE_URL_DEFAULT;
    this.backgroundWidth = 633;
    this.backgroundHeight = 361;
    this.doors = new Map(CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT);

    this.canvas = canvas;
    this.canvas.width = this.backgroundWidth * SCALE_FACTOR;
    this.canvas.height = this.backgroundHeight * SCALE_FACTOR;
    this.ctx = canvas.getContext('2d');
    this.characterManager = characterManager;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      placeImage(this.backgroundUrl),
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
    }
  }

  setUpCanvasInfo(backgroundUrl, width, height, doors) {
    this.backgroundUrl = backgroundUrl;
    this.backgroundWidth = width;
    this.backgroundHeight = height;
    this.doors = doors;

    this.canvas.width = this.backgroundWidth * SCALE_FACTOR;
    this.canvas.height = this.backgroundHeight * SCALE_FACTOR;
  }

  getCanvasBackgroundImageWidth() {
    return this.backgroundWidth;
  }

  getCanvasBackgroundImageHeight() {
    return this.backgroundHeight;
  }
}
