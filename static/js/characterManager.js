const DISPLACEMENT_CONSTANT = 10;
let isCloseToDoor = true;

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
    // console.log('moveChar: ' + x + ' ' + y);
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
    }
    const userCharacter = this.characters.get(username);

    if (
      userCharacter &&
      userCharacter.currentX === userCharacter.targetX &&
      userCharacter.currentY === userCharacter.targetY
    ) {
      if (this.isNearDoor(userCharacter)) {
        if (isCloseToDoor) {
          this.changeRoom(userCharacter);
        }
      }
    }
  }

  changeAttribute(name, color) {
    this.characters.get(name).attributes.color = color;
  }

  listCharacters() {
    return Array.from(this.characters.keys());
  }

  changeRoom(name) {
    console.log('RoomChange!!!');
    confirm('Would you like to move to this room?');
    isCloseToDoor = false;
  }

  isNearDoor(name) {
    const doorPositionX = 84;
    const doorPositionY = 425;

    const distance =
      (name.currentX - doorPositionX) * (name.currentX - doorPositionX) +
      (name.currentY - doorPositionY) * (name.currentY - doorPositionY);
    if (distance > 1000) {
      isCloseToDoor = true;
    }
    return distance < 1000;
  }
}
