const DISPLACEMENT_PER_FRAME = 1;

class CharacterManager {
  #characters;

  constructor() {
    this.#characters = new Map();
  }

  getCharacterInfo(name) {
    return this.#characters.get(name);
  }

  addCharacter(name, x = 0, y = 0) {
    this.#characters.set(name, {
      currentX: x,
      currentY: y,
      targetX: x,
      targetY: y,
      attributes: {
        color: 'none'
      }
    });
  }

  removeCharacter(name) {
    this.#characters.delete(name);
  }

  moveCharacter(name, x, y) {
    const characterinfo = this.#characters.get(name);
    characterinfo.targetX = x;
    characterinfo.targetY = y;
  }

  updateAllCharacterCurrentPositions() {
    for (let [character, info] of this.#characters) {
      if (info.targetX > info.currentX) {
        info.currentX += DISPLACEMENT_PER_FRAME;
      } else if (info.targetX < info.currentX) {
        info.currentX -= DISPLACEMENT_PER_FRAME;
      }

      if (info.targetY > info.currentY) {
        info.currentY += DISPLACEMENT_PER_FRAME;
      } else if (info.targetY < info.currentY) {
        info.currentY -= DISPLACEMENT_PER_FRAME;
      }
    }
  }

  changeAttribute(name, color) {
    this.#characters.get(name).attributes.color = color;
  }

  listCharacters() {
    return Array.from(this.#characters.keys());
  }
}
