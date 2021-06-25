const DISPLACEMENT_CONSTANT = 10;
const CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT = [[[73, 331], 'hub_games']];

class CharacterManager {
  characters;
  doors;
  isCloseToDoor;

  constructor() {
    this.characters = new Map();
    this.doors = new Map(CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT);
    this.isCloseToDoor = true;
  }

  setDoors(newDoors) {
    this.doors = new Map(newDoors);
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
      for (const [position, roomName] of this.doors) {
        const distance =
          (userCharacter.currentX - position[0]) *
            (userCharacter.currentX - position[0]) +
          (userCharacter.currentY - position[1]) *
            (userCharacter.currentY - position[1]);
        if (distance > 1000) {
          this.isCloseToDoor = true;
        }
        if (distance < 1000) {
          if (this.isCloseToDoor) {
            this.sendChangeRoomRequestFromCharacter(roomName);
          }
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

  sendChangeRoomRequestFromCharacter(name) {
    console.log('RoomChange!!!');
    const confirmResult = confirm('Would you like to move to this room?');
    this.isCloseToDoor = false;
    if (confirmResult) {
      toggleLoadingScreen(true, 'mainPage');
      sendChangeRoomRequestToServer(name);
    }
  }

  isNearDoor(name) {
    for (const [position, roomName] of this.doors) {
      const distance =
        (name.currentX - position[0]) * (name.currentX - position[0]) +
        (name.currentY - position[1]) * (name.currentY - position[1]);
      if (distance > 1000) {
        this.isCloseToDoor = true;
      }
      return distance < 1000;
    }
  }
}
