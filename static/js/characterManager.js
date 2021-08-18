const DISPLACEMENT_CONSTANT = 10;
const CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT = [['hub_games', [73, 331]]];
const DEFAULT_ACTIVITIES = [];

class CharacterManager {
  characters;
  doors;
  promptToLeaveRoom;
  room;
  activities;
  promptToDoActivity;

  constructor() {
    this.characters = new Map();
    this.doors = new Map(CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT);
    this.promptToLeaveRoom = new Map(
      Array.from(this.doors.keys()).map(roomName => [roomName, true])
    );
    this.activities = DEFAULT_ACTIVITIES;
    console.log(this.activities);
    this.promptToDoActivity = new Map(this.activities.map(activity => [activity.name, true]));
    this.room = 'ctc';
  }

  setDoors(newDoors) {
    this.doors = new Map(newDoors);
    this.promptToLeaveRoom = new Map(
      Array.from(this.doors.keys()).map(roomName => [roomName, true])
    );
    console.log('promptToLeaveRoom');
    console.log(this.promptToLeaveRoom);
  }

  setActivities(newActivites) {
    this.activites = newActivites;
    this.promptToDoActivity = new Map(this.activities.map(activity => [activity.name, true]));
    console.log('promptToDoActivity ');
    console.log(this.promptToDoActivity);
  }

  getCharacterInfo(name) {
    return this.characters.get(name);
  }

  addCharacter(name, x, y, color = 'none') {
    this.characters.set(name, {
      currentX: x,
      currentY: y,
      targetX: x,
      targetY: y,
      attributes: {
        color: color,
        direction: 'left'
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

    characterinfo.attributes.direction =
      characterinfo.targetX > characterinfo.currentX ? 'right' : 'left';
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
      for (const [roomName, position] of this.doors) {
        const distance =
          (userCharacter.currentX - position[0]) * (userCharacter.currentX - position[0]) +
          (userCharacter.currentY - position[1]) * (userCharacter.currentY - position[1]);
        if (distance > 1000) {
          this.promptToLeaveRoom.set(roomName, true);
        }
        if (distance < 1000) {
          if (this.promptToLeaveRoom.get(roomName)) {
            this.sendChangeRoomRequestFromCharacter(roomName);
            break;
          }
        }
      }
      for (const activity of this.activities) {
        console.log('in loop??');
        const { name, location } = activity;
        const distance =
          (userCharacter.currentX - location[0]) * (userCharacter.currentX - location[0]) +
          (userCharacter.currentY - location[1]) * (userCharacter.currentY - location[1]);
        if (distance > 400) {
          this.promptToDoActivity.set(name);
          console.log('too far??');
        }
        if (distance < 400) {
          console.log('activity');
          this.promptForActivity(activity);
          break;
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

  clearCharacters() {
    this.characters.clear();
  }

  promptForActivity(activity) {
    switch (activity.type) {
      case 'color':
        sendChangeCollarRequestFromCharacter(activity);
        break;
      default:
        console.log('my default for acivities');
    }
  }

  sendChangeCollarRequestFromCharacter(activity) {
    console.log('Collar Change!!!!!');
    swal(`Would you like to change your collar color to: ${activity.color}`, {
      buttons: {
        no: 'No, I like my collar color',
        yes: 'Yes, I want that color'
      }
    }).then(value => {
      if (value === 'yes') {
        // toggleLoadingScreen(true, 'mainPage');
        this.changeAttribute(username, color);
      }
    });
  }

  sendChangeRoomRequestFromCharacter(newRoom) {
    console.log('RoomChange!!!');
    this.promptToLeaveRoom.set(newRoom, false);
    swal(`Would you like to move to this room: ${this.formatRoomName(newRoom)}?`, {
      buttons: {
        stay: "No, I'm happy here",
        move: 'Yes, change rooms'
      }
    }).then(value => {
      if (value === 'move') {
        toggleLoadingScreen(true, 'mainPage');
        sendChangeRoomRequestToServer(newRoom);
      }
    });
  }

  formatRoomName(name) {
    return name
      .split(/_+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getRoomName() {
    return this.room;
  }

  setRoomName(newRoom) {
    this.room = newRoom;
  }
}
