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
      roomData.addCharacter(name, x, y);
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
    this.#characters = [];
  }

  /**
   * Adds character to room
   * @param {String} name name of character
   * @param {Integer} x x position - defaults to 0
   * @param {Integer} y y position - defaults to 0
   */
  addCharacter(name, x = 0, y = 0) {
    this.#characters.push({
      name: data.name,
      x: 0,
      y: 0
    });
  }

  /**
   * Removes character from room
   * @param {*} name name of character
   */
  removeCharacter(name) {
    this.#characters = this.#characters
      .filter(a => a.name === name);
  }

  /**
   * Updates character's location in given room
   * @param {String} name name of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   */
  updateCharacter(name, x, y) {
    for (let i = 0; i < this.#characters.length; i++) {
      if (this.#characters[i].name === name) {
        this.#characters[i].x = x;
        this.#characters[i].y = y;
      }
    }
  }

  /**
   * List names and positions of characters in room
   */
  listCharacters() {
    return this.#characters.map(row => {
      return {name: row.name, x: row.x, y: row.y};
    });
  }
}

module.exports = RoomManager;