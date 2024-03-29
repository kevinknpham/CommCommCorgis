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

/**
 * Inserts black text above the character image
 * @param {*} ctx
 * @param {String} text
 * @param {Integer} x
 * @param {Integer} y
 */
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

  /**
   * Creates CanvasManager instance.
   * Initializes all fields, two of which are initialized to the
   * given canvas and characterManager.
   * @param {canvas} canvas
   * @param {characterManager} characterManager
   */
  constructor(canvas, characterManager) {
    this.backgroundUrl = CANVAS_BACKGROUND_DEFAULT_URL;
    this.backgroundWidth = 633;
    this.backgroundHeight = 361;
    this.backgroundImageMap = new Map();

    this.canvas = canvas;
    this.canvas.style.width = this.backgroundWidth * SCALE_FACTOR;
    this.canvas.style.height = this.backgroundHeight * SCALE_FACTOR;
    this.ctx = canvas.getContext('2d');
    this.characterManager = characterManager;
  }

  /**
   * Find the image associated with the url. If it is the desired image,
   * uses image as background.
   * @param {String} url
   * @returns image associated with the given url.
   */
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

  /**
   * Clears the current canvas
   */
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

  /**
   * Saves the position of all the characters on the canvas.
   */
  saveCanvasState() {
    this.characterManager.updateAllCharacterCurrentPositions();
  }

  /**
   * Draws each character on the canvas.
   */
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

  /**
   * Creates an object based on the given direction to modify the character's image
   * to face in the given direction.
   * @param {String} direction
   * @returns an object containing information on how to orient the image.
   */
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

  /**
   * Stores the given backgroundUrl, width, height into the current instance.
   * @param {String} backgroundUrl
   * @param {Double} width
   * @param {Double} height
   */
  setUpCanvasInfo(backgroundUrl, width, height) {
    this.backgroundUrl = backgroundUrl;
    this.backgroundWidth = width;
    this.backgroundHeight = height;

    this.canvas.width = this.backgroundWidth * SCALE_FACTOR;
    this.canvas.height = this.backgroundHeight * SCALE_FACTOR;
  }

  /**
   * Retrieves the width of the background image
   * @returns background image width
   */
  getCanvasBackgroundImageWidth() {
    return this.backgroundWidth;
  }

  /**
   * Retrieves the width of the background image height
   * @returns background image height
   */
  getCanvasBackgroundImageHeight() {
    return this.backgroundHeight;
  }
}
