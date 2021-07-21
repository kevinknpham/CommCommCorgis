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

const CORGI_IMAGE_WIDTH = 2048;
const CORGI_IMAGE_HEIGHT = 700;

function getImageFromURL(url) {
  const image = new Image();
  image.src = url;
  return image;
}

//background image is 633x361
const CANVAS_BACKGROUND_DEFAULT_URL = '../assets/ctc_main.png';

const COLOR_TO_IMAGE = Object.freeze(
  new Map([
    ['none', getImageFromURL('assets/corgi-slide-none.png')],
    ['red', getImageFromURL('assets/corgi-slide-red.png')],
    ['green', getImageFromURL('assets/corgi-slide-green.png')],
    ['blue', getImageFromURL('assets/corgi-slide-blue.png')]
  ])
);

const COLOR_TO_IMAGE_DEFAULT = Object.freeze(
  new Map([
    ['none', 'assets/corgi-slide-none-default.png'],
    ['red', 'assets/corgi-slide-red-default.png'],
    ['green', 'assets/corgi-slide-green-default.png'],
    ['blue', 'assets/corgi-slide-blue-default.png']
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

class CanvasManager {
  canvas;
  ctx;
  characterManager;

  backgroundUrl;
  backgroundWidth;
  backgroundHeight;

  backgroundImageMap;

  constructor(canvas, characterManager) {
    this.backgroundUrl = CANVAS_BACKGROUND_DEFAULT_URL;
    this.backgroundWidth = 633;
    this.backgroundHeight = 361;
    this.backgroundImageMap = new Map();

    this.canvas = canvas;
    this.canvas.width = this.backgroundWidth * SCALE_FACTOR;
    this.canvas.height = this.backgroundHeight * SCALE_FACTOR;
    this.ctx = canvas.getContext('2d');
    this.characterManager = characterManager;
  }

  getBackgroundImage(url) {
    const image = this.backgroundImageMap.get(url);
    if (image) {
      return image;
    } else {
      const newImage = getImageFromURL(url);
      this.backgroundImageMap.set(url, newImage);
      return newImage;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this.getBackgroundImage(this.backgroundUrl),
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
      drawNameOnImage(this.ctx, name, info.currentX * SCALE_FACTOR, info.currentY * SCALE_FACTOR);
      const { sx, sy, sWidth, sHeight } = this.getCharacterImageOrientation(
        info.attributes.direction
      );
      this.ctx.drawImage(
        COLOR_TO_IMAGE.get(info.attributes.color),
        sx,
        sy,
        sWidth,
        sHeight,
        info.currentX * SCALE_FACTOR,
        info.currentY * SCALE_FACTOR,
        CHARACTER_WIDTH,
        CHARACTER_LENGTH
      );
    }
  }

  getCharacterImageOrientation(direction) {
    switch (direction) {
      case 'right':
        return {
          sx: CORGI_IMAGE_WIDTH / 2,
          sy: 0,
          sWidth: CORGI_IMAGE_WIDTH / 2,
          sHeight: CORGI_IMAGE_HEIGHT
        };
      default:
        return { sx: 0, sy: 0, sWidth: CORGI_IMAGE_WIDTH / 2, sHeight: CORGI_IMAGE_HEIGHT };
    }
  }

  setUpCanvasInfo(backgroundUrl, width, height) {
    this.backgroundUrl = backgroundUrl;
    this.backgroundWidth = width;
    this.backgroundHeight = height;

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
