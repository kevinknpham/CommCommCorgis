//background image is 740x468
const CANVAS_BACKGROUND_IMAGE_URL_DEFAULT = '../assets/ctc_main.png';
const CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT = [[[84, 425], 'hub_games']];

const SCALE_FACTOR = 5;

const CANVAS_WIDTH_DEFAULT = 740 * SCALE_FACTOR;
const CANVAS_HEIGHT_DEFAULT = 468 * SCALE_FACTOR;

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

  backgroundUrl;
  backgroundWidth;
  backgroundHeight;
  doors;

  constructor(canvas, characterManager) {
    this.canvas = canvas;
    this.canvas.width = CANVAS_WIDTH_DEFAULT;
    this.canvas.height = CANVAS_HEIGHT_DEFAULT;
    this.ctx = canvas.getContext('2d');
    this.characterManager = characterManager;

    this.backgroundWidth = CANVAS_WIDTH_DEFAULT;
    this.backgroundHeight = CANVAS_HEIGHT_DEFAULT;
    this.backgroundUrl = CANVAS_BACKGROUND_IMAGE_URL_DEFAULT;
    this.doors = new Map(CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      placeImage(CANVAS_BACKGROUND_IMAGE_URL_DEFAULT),
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

  setUpCanvasInfo(backgroundUrl, width, height, doors) {
    backgroundUrl = backgroundUrl;
    backgroundWidth = width;
    backgroundHeight = height;
    doors = doors;
  }
}
