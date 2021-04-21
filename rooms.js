/**
 * Object to hold rooms and their relationship to one another.
 */
class RoomManager {
  #roomOccupants

  /**
   * @param {String[]} rooms list of room names
   */
  constructor(rooms) {
    this.#roomOccupants = new Map();
    for (let i = 0; i < rooms.length; i++) {
      this.#roomOccupants.set(rooms[i], new Room());
    }
  }

  /**
   * Adds character to given room
   * @param {String} room room to add character to
   * @param {String} name name of character
   * @param {Integer} x x position - defaults to 0
   * @param {Integer} y y position - defaults to 0
   */
  addCharacter(room, name, x = 0, y = 0) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.addCharacter(name, x, y);
    }
  }

  /**
   * Removes character from given room
   * @param {String} room room to remove from
   * @param {*} name name of character
   */
  removeCharacter(room, name) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      roomData.removeCharacter(name);
    }
  }

  /**
   * Updates character's location in given room
   * @param {String} room room to update
   * @param {String} name name of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   */
  updateCharacter(room, name, x, y) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      roomData.updateCharacter(name, x, y);
    }
  }

  /**
   * List names and positions of characters
   * @param {*} room room to list characters from.
   *                 If undefined, uses all rooms.
   * @returns Object[] containing characters in the given room or all rooms if
   *          not specified.
   */
  listCharacters(room = undefined) {
    if (room) {
      let roomData = this.#roomOccupants.get(room);
      if (roomData) {
        return roomData.listCharacters();
      }
    } else {
      let result = [];
      for (let roomData of this.#roomOccupants.values()) {
        result = result.concat(roomData.listCharacters());
      }
      return result;
    }
  }
}

/**
 * 
 */
class Room {
  #characters

  /**
   * Construct empty room.
   */
  constructor() {
    this.#characters = new Map();
  }

  /**
   * Adds character to room
   * @param {String} name name of character
   * @param {Integer} x x position - defaults to 0
   * @param {Integer} y y position - defaults to 0
   */
  addCharacter(name, x = 0, y = 0) {
    if (this.#characters.has(name)) {
      return false;
    }
    this.#characters.set(name, {
      x: 0,
      y: 0
    });
    return true;
  }

  /**
   * Removes character from room
   * @param {*} name name of character
   */
  removeCharacter(name) {
    this.#characters.delete(name);
  }

  /**
   * Updates character's location in given room
   * @param {String} name name of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   */
  updateCharacter(name, x, y) {
    if (this.#characters.has(name)) {
      this.#characters.set(name, {
        x: x,
        y: y
      });
    }
  }

  /**
   * List names and positions of characters in room
   */
  listCharacters() {
    let result = [];
    for (let [key, value] of this.#characters) {
      result.push({
        name: key,
        x: value.x,
        y: value.y
      })
    }
    return result;
  }
}

module.exports = RoomManager;