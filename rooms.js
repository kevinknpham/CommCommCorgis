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
      this.#roomOccupants.set(rooms[i].name, new Room(rooms[i].bounds));
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
    return false;
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
   * @return true iff successful
   */
  updateCharacter(room, name, x, y) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.updateCharacter(name, x, y);
    }
    return false;
  }

  /**
     * Updates character's attributes
     * @param {String} room room to update
     * @param {String} name name of character
     * @param {Object} newAttributes Object with updated attributes and values
     * @return attributes that were changed
     */
  changeAttribute(room, name, newAttributes) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.changeAttribute(name, newAttributes);
    }
    return {};
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

const COLORS = Object.freeze(['none', 'red', 'green', 'blue']);
const pointInPolygon = require('point-in-polygon');

/**
 * 
 */
class Room {
  #characters
  #bounds

  /**
   * Construct empty room.
   */
  constructor(bounds) {
    this.#characters = new Map();
    this.#bounds = bounds;
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
      y: 0,
      color: 'none'
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
   * @return true iff successful
   */
  updateCharacter(name, x, y) {
    if (this.#characters.has(name)) {
      if (pointInPolygon([x, y], this.#bounds)) {
        const target = this.#characters.get(name);
        target.x = x;
        target.y = y;
        return true;
      }
      return false;
    }
    return false;
  }

  /**
   * Updates character's attributes
   * @param {String} name name of character
   * @param {Object} newAttributes Object with updated attributes and values
   * @return attributes that were changed
   */
  changeAttribute(name, newAttributes) {
    const target = this.#characters.get(name);
    let result = {};
    if (target) {
      if (newAttributes.color) {
        if (COLORS.includes(newAttributes.color)) {
          target.color = newAttributes.color;
          result.color = newAttributes.color;
        }
      }
    }
    return result;
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
        y: value.y,
        attributes: {
          color: value.color
        }
      })
    }
    return result;
  }
}

module.exports = RoomManager;