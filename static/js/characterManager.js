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

  /**
   * Creates a CharacterManager instance.
   */
  constructor() {
    this.characters = new Map();
    this.doors = new Map(CANVAS_BACKGROUND_IMAGE_URL_DOOR_DEFAULT);
    this.promptToLeaveRoom = new Map(
      Array.from(this.doors.keys()).map(roomName => [roomName, true])
    );
    this.activities = DEFAULT_ACTIVITIES;
    this.promptToDoActivity = new Map(this.activities.map(activity => [activity.name, true]));
    this.room = 'ctc';
  }

  /**
   * Keeps track of the doors in the current room.
   * @param {*} newDoors
   */
  setDoors(newDoors) {
    this.doors = new Map(newDoors);
    this.promptToLeaveRoom = new Map(
      Array.from(this.doors.keys()).map(roomName => [roomName, true])
    );
  }

  /**
   * Keeps track of the available activities in the room.
   */
  setActivities(newActivites) {
    this.activities = newActivites;
    this.promptToDoActivity = new Map(this.activities.map(activity => [activity.name, true]));
  }

  /**
   *
   * @param {String} name
   * @returns object with information associated with the character that has
   *          the given name.
   */
  getCharacterInfo(name) {
    return this.characters.get(name);
  }

  /**
   * Stores the given name, x, y, and color associated with a character inside
   * the current characterManager instance.
   * @param {String} name
   * @param {Double} x
   * @param {Double} y
   * @param {String} color
   */
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

  /**
   * Deletes the information associated with
   * the character that has the given name.
   * @param {String} name
   */
  removeCharacter(name) {
    this.characters.delete(name);
  }

  /**
   * Stores the given x and y of the location
   * that the character with the given name has moved to.
   * @param {String} name
   * @param {Double} x
   * @param {Double} y
   */
  moveCharacter(name, x, y) {
    const characterinfo = this.characters.get(name);
    characterinfo.targetX = x;
    characterinfo.targetY = y;

    characterinfo.attributes.direction =
      characterinfo.targetX > characterinfo.currentX ? 'right' : 'left';
  }

  /**
   * Updates each character's positions
   * and notifies the user if his character is at a door.
   */
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
        const distance =
          (userCharacter.currentX - activity.location[0]) *
            (userCharacter.currentX - activity.location[0]) +
          (userCharacter.currentY - activity.location[1]) *
            (userCharacter.currentY - activity.location[1]);
        if (distance > 400) {
          this.promptToDoActivity.set(activity.name, true);
        }
        if (distance < 400) {
          if (this.promptToDoActivity.get(activity.name)) {
            this.promptForActivity(activity);
            break;
          }
        }
      }
    }
  }

  /**
   * Stores the given color with the character that has the given name.
   * @param {String} name
   * @param {String} color
   */
  changeAttribute(name, color) {
    this.characters.get(name).attributes.color = color;
  }

  /**
   * Retrieves the names of all the characters in the website
   * @returns all the characters' names in the current instance.
   */
  listCharacters() {
    return Array.from(this.characters.keys());
  }

  /**
   * Removes all the characters' information stored inside
   * current instance.
   */
  clearCharacters() {
    this.characters.clear();
  }

  /**
   * If the given activity is a color type, sends request
   * to change the character's color.
   * Otherwise, it logs the following default text "my default for activities".
   * @param {*} activity
   */
  promptForActivity(activity) {
    switch (activity.type) {
      case 'color':
        this.sendChangeCollarRequestFromCharacter(activity);
        break;
      default:
        console.log('my default for activities');
    }
  }

  /**
   * Notifies user if they want to change into the color stored in the given
   * activity. Allows user to cancel or to proceed with color change.
   * @param {*} activity
   */
  sendChangeCollarRequestFromCharacter(activity) {
    console.log('Collar Change!!!!!');
    this.promptToDoActivity.set(activity.name, false);
    swal(`Would you like to change your collar color to: ${activity.color}`, {
      buttons: {
        no: 'No, I like my collar color',
        yes: 'Yes, I want that color'
      }
    }).then(value => {
      if (value === 'yes') {
        toggleLoadingScreen(true, 'mainPage');
        // this.changeAttribute(username, activity.color);
        sendUserColorToServer(activity.color);
      }
    });
  }

  /**
   * Sends a notification for the user to make sure that the
   * they want to move to the give newRoom. Allow user to choose
   * to move into newRoom or stay in current room.
   * @param {String} newRoom
   *
   */
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

  /**
   * Formats the given name with appropriate capitalization and spaces.
   * @param {String} name
   * @returns the character's name with the first letter capitalized and
   *          spaces in between each word.
   */
  formatRoomName(name) {
    return name
      .split(/_+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Retrieves the current room that the character is in.
   * @returns the room that the current character is in
   */
  getRoomName() {
    return this.room;
  }

  /**
   * Stores the given newRoom as the current room
   * inside the current characterManager.
   * @param {String} newRoom
   */
  setRoomName(newRoom) {
    this.room = newRoom;
  }
}
