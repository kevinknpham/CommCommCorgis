const DISPLACEMENT_CONSTANT = 10;

class CharacterManager {
  characters;

  constructor() {
    this.characters = new Map();
  }

  getCharacterInfo(name) {
    return this.characters.get(name);
  }

  addCharacter(name, x = 0, y = 0) {
    this.characters.set(name, {
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
    this.characters.delete(name);
  }

  moveCharacter(name, x, y) {
    const characterinfo = this.characters.get(name);
    characterinfo.targetX = x;
    characterinfo.targetY = y;
  }

  updateAllCharacterCurrentPositions() {
    for (let [character, info] of this.characters) {
      const displacementX = info.targetX - info.currentX;
      const displacementY = info.targetY - info.currentY;
      if (info.targetX !== info.currentX) {
        if (displacementX < 1 && displacementX > -1) {
          info.currentX = info.targetX;
        } else {
          info.currentX += displacementX / DISPLACEMENT_CONSTANT;
        }
      }
      if (info.targetY !== info.currentY) {
        if (displacementY < 1 && displacementY > -1) {
          info.currentY = info.targetY;
        } else {
          info.currentY += displacementY / DISPLACEMENT_CONSTANT;
        }
      }
      // if (info.targetX > info.currentX) {
      //   info.currentX += DISPLACEMENT_PER_FRAME;
      // } else if (info.targetX < info.currentX) {
      //   info.currentX -= DISPLACEMENT_PER_FRAME;
      // }

      // if (info.targetY > info.currentY) {
      //   info.currentY += DISPLACEMENT_PER_FRAME;
      // } else if (info.targetY < info.currentY) {
      //   info.currentY -= DISPLACEMENT_PER_FRAME;
      // }
    }
  }

  changeAttribute(name, color) {
    this.characters.get(name).attributes.color = color;
  }

  listCharacters() {
    return Array.from(this.characters.keys());
  }
}
