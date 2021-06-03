const COLORS = Object.freeze(['none', 'red', 'green', 'blue']);
const pointInPolygon = require('point-in-polygon');
const SUCCESS_STATUS = 'success';
const FAILURE_STATUS = 'failure';

/**
 * Object to hold rooms and their relationship to one another.
 */
class RoomManager {
  #roomOccupants;

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
   * @param {Integer} id id of character
   * @param {String} name name of character
   * @param {Integer} x x position - defaults to 0
   * @param {Integer} y y position - defaults to 0
   * @return {Object} contains userResponse for user and broadcast with message
   *                  for all users
   */
  addCharacter(room, id, name, x = 0, y = 0) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.addCharacter(id, name, x, y);
    }
    let res = {};
    res.userResponse = {};
    res.userResponse.status = FAILURE_STATUS;
    res.userResponse.reason = 'database_error';
    res.userResponse.explanation = 'The database has not been set up.';
    res.userResponse.requested_name = name;
    return res;
  }

  /**
   * Removes character from given room
   * @param {String} room room to remove from
   * @param {Integer} id id of character
   * @return {Object} response to broadcast to all users or null if no change
   */
  removeCharacter(room, id) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.removeCharacter(id);
    }
    return null;
  }

  /**
   * Updates character's location in given room
   * @param {String} room room to update
   * @param {Integer} id id of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   * @return {Object} response to broadcast to all users
   */
  updateCharacter(room, id, x, y) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.updateCharacter(id, x, y);
    }
    return null;
  }

  /**
   * Updates character's attributes
   * @param {String} room room to update
   * @param {Integer} id id of character
   * @param {Object} newAttributes Object with updated attributes and values
   * @return {Object} response to broadcast to all users or null if no change
   */
  changeAttribute(room, id, newAttributes) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.changeAttribute(id, newAttributes);
    }
    return null;
  }

  /**
   * List names and positions of characters
   * @param {*} room room to list characters from.
   *                 If undefined, uses all rooms.
   * @returns Object[] containing characters in the given room or all rooms if
   *          not specified.
   */
  listCharacters(includeId, room = undefined) {
    if (room) {
      let roomData = this.#roomOccupants.get(room);
      if (roomData) {
        return roomData.listCharacters(includeId);
      }
    } else {
      let result = [];
      for (let roomData of this.#roomOccupants.values()) {
        result = result.concat(roomData.listCharacters(includeId));
      }
      return result;
    }
  }

  /**
   * Get name of user using id
   * @param {String} room room character is in
   * @param {Integer} id id of character
   * @returns name of user matching id or null if not found
   */
  getName(room, id) {
    let roomData = this.#roomOccupants.get(room);
    if (roomData) {
      return roomData.getName(id);
    }
    return null;
  }
}

/**
 *
 */
class Room {
  #characters;
  #bounds;

  /**
   * Construct empty room.
   */
  constructor(bounds) {
    this.#characters = new Map();
    this.#bounds = bounds;
  }

  /**
   * Adds character to room
   * @param {Integer} id id of character
   * @param {String} name name of character
   * @param {Integer} x x position - defaults to 0
   * @param {Integer} y y position - defaults to 0
   * @return {Object} contains userResponse for user and broadcast with message
   *                  for all users
   */
  addCharacter(id, name, x = 0, y = 0) {
    if (this.#characters.has(name)) {
      let res = {};
      res.userResponse = {};
      res.userResponse.status = FAILURE_STATUS;
      res.userResponse.reason = 'user_already_exists';
      res.userResponse.explanation =
        'The requested username has been taken by another user.';
      res.userResponse.requested_name = name;
      return res;
    }

    this.#characters.set(id, {
      name: name,
      x: x,
      y: y,
      attributes: {
        color: 'none'
      }
    });

    let res = {};

    res.broadcast = {};
    res.broadcast.name = name;
    res.broadcast.x = x;
    res.broadcast.y = y;
    res.broadcast.attributes = {};
    res.broadcast.attributes.color = 'none';

    res.userResponse = {};
    res.userResponse.status = SUCCESS_STATUS;
    res.userResponse.name = name;

    return res;
  }

  /**
   * Removes character from room
   * @param {Integer} id id of character
   * @return {Object} response to broadcast to all users or null if no change
   */
  removeCharacter(id) {
    const removedData = this.#characters.get(id);
    if (removedData) {
      this.#characters.delete(id);
      return { name: removedData.name };
    }
    return null;
  }

  /**
   * Updates character's location in given room
   * @param {Integer} id id of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   * @return {Object} response to broadcast to all users or null if no change
   */
  updateCharacter(id, x, y) {
    if (this.#characters.has(id)) {
      // if (pointInPolygon([x, y], this.#bounds)) {
      const target = this.#characters.get(id);
      target.x = x;
      target.y = y;
      return {
        name: target.name,
        x: x,
        y: y
      };
      // }
      // return false;
    }
    return null;
  }

  /**
   * Updates character's attributes
   * @param {Integer} id id of character
   * @param {Object} newAttributes Object with updated attributes and values
   * @return {Object} response to broadcast to all users
   */
  changeAttribute(id, newAttributes) {
    const target = this.#characters.get(id);
    let result = {};
    if (target) {
      if (newAttributes.color) {
        if (COLORS.includes(newAttributes.color)) {
          target.attributes.color = newAttributes.color;
          result.color = newAttributes.color;
        }
      }
    }
    return {
      name: target.name,
      attributes: result
    };
  }

  /**
   * List names and positions of characters in room
   */
  listCharacters(includeId = false) {
    let result = [];
    for (let [key, value] of this.#characters) {
      result.push({
        id: includeId ? key : null,
        name: value.name,
        x: value.x,
        y: value.y,
        attributes: {
          color: value.attributes.color
        }
      });
    }
    return result;
  }

  /**
   * Get name of user using id
   * @param {Integer} id id of character
   * @returns name of user matching id or null if not found
   */
  getName(id) {
    return this.#characters.has(id) ? this.#characters.get(id) : null;
  }
}

module.exports = {
  RoomManager: RoomManager,
  SUCCESS_STATUS: SUCCESS_STATUS,
  FAILURE_STATUS: FAILURE_STATUS
};
