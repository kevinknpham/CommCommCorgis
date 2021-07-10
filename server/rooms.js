const COLORS = Object.freeze(['none', 'red', 'green', 'blue']);

/**
 * Object to hold rooms and their relationship to one another.
 */
class RoomManager {
  #roomOccupants;
  #names;
  #idToRoomName;

  /**
   * @param {String[]} rooms list of room names
   */
  constructor(rooms) {
    this.#roomOccupants = new Map();
    this.#names = new Set();
    this.#idToRoomName = new Map();
    for (let i = 0; i < rooms.length; i++) {
      const roomInfo = rooms[i];
      this.#roomOccupants.set(
        roomInfo.name,
        new Room(
          roomInfo.name,
          roomInfo.exitDoors,
          roomInfo.entranceLocations,
          roomInfo.bounds,
          roomInfo.image,
          roomInfo.width,
          roomInfo.height,
          roomInfo.defaultX,
          roomInfo.defaultY
        )
      );
    }
  }

  /**
   * Adds character to given room
   * @param {String} room room to add character to
   * @param {Integer} id id of character
   * @param {String} name name of character
   * @param {String} previousRoom name of previous room (to figure out position in new room)
   */
  addCharacter(room, id, name, previousRoom) {
    let roomData = this.#roomOccupants.get(room);
    if (!this.#idToRoomName.has(id) && roomData) {
      if (!this.#idToRoomName.has(id) && !this.#names.has(name)) {
        this.#idToRoomName.set(id, room);
        this.#names.add(name);
        roomData.addCharacter(id, name, previousRoom);
      }
    }
  }

  /**
   * Removes character from given room
   * @param {String} room room to remove from
   * @param {Integer} id id of character
   */
  removeCharacter(id) {
    let roomData = this.#roomOccupants.get(this.#idToRoomName.get(id));
    if (roomData) {
      const deletedData = roomData.getCharacterInfo(id);
      if (deletedData) {
        roomData.removeCharacter(id);
        this.#names.delete(deletedData.name);
        this.#idToRoomName.delete(id);
      }
    }
  }

  /**
   * Updates character's location in given room
   * @param {String} room room to update
   * @param {Integer} id id of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   */
  updateCharacter(id, x, y) {
    let roomData = this.#roomOccupants.get(this.#idToRoomName.get(id));
    if (roomData) {
      roomData.updateCharacter(id, x, y);
    }
  }

  /**
   * Updates character's attributes
   * @param {String} room room to update
   * @param {Integer} id id of character
   * @param {Object} newAttributes Object with updated attributes and values
   */
  changeAttribute(id, newAttributes) {
    let roomData = this.#roomOccupants.get(this.#idToRoomName.get(id));
    if (roomData) {
      roomData.changeAttribute(id, newAttributes);
    }
  }

  /**
   * List names and positions of characters
   * @param {String} room room to list characters from.
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
   * @returns info of user matching id or null if not found
   */
  getCharacterInfo(id) {
    const roomName = this.#idToRoomName.get(id);
    let roomData = this.#roomOccupants.get(roomName);
    if (roomData) {
      let res = roomData.getCharacterInfo(id);
      res.room = roomName;
      return res;
    }
    return null;
  }

  /**
   * Checks if user exists
   * @param {Integer} id
   * @returns true iff id is being tracked by this RoomManager
   */
  containsId(id) {
    return this.#idToRoomName.has(id);
  }

  /**
   * Gets room of user
   * @param {Integer} id id of user
   * @returns room of user
   */
  getRoomInfoFromId(id) {
    const roomName = this.#idToRoomName.get(id);
    const roomInfo = this.#roomOccupants.get(roomName).getRoomInfo();
    return roomInfo;
  }

  /**
   * Checks if room exists
   * @param {String} room name of room
   * @returns true iff the room exists
   */
  containsRoom(room) {
    return this.#roomOccupants.has(room);
  }
}

const { Bounds } = require('./bounds');

/**
 *
 */
class Room {
  #name;
  #characters;
  #doors;
  #entrances;
  #bounds;
  #url;
  #width;
  #height;
  #defaultX;
  #defaultY;

  /**
   * Construct empty room.
   */
  constructor(name, doors, entrances, bounds, imageUrl, width, height, defaultX, defaultY) {
    this.#name = name;
    this.#characters = new Map();
    this.#doors = new Map(doors);
    this.#entrances = new Map(entrances);
    this.#bounds = new Bounds(bounds);
    this.#url = imageUrl;
    this.#width = width;
    this.#height = height;
    this.#defaultX = defaultX;
    this.#defaultY = defaultY;
  }

  /**
   * Adds character to room
   * @param {Integer} id id of character
   * @param {String} name name of character
   * @param {String} previousRoom name of previous room
   */
  addCharacter(id, name, previousRoom) {
    let x = this.#defaultX;
    let y = this.#defaultY;
    if (previousRoom && this.#entrances.has(previousRoom)) {
      [x, y] = this.#entrances.get(previousRoom);
    }
    if (!this.#characters.has(name)) {
      this.#characters.set(id, {
        name: name,
        x: x,
        y: y,
        attributes: {
          color: 'none'
        }
      });
    }
  }

  /**
   * Removes character from room
   * @param {Integer} id id of character
   */
  removeCharacter(id) {
    this.#characters.delete(id);
  }

  /**
   * Updates character's location in given room
   * @param {Integer} id id of character
   * @param {Integer} x new x location
   * @param {Integer} y new y location
   */
  updateCharacter(id, x, y) {
    if (this.#characters.has(id)) {
      const target = this.#characters.get(id);
      const destination = this.#bounds.findNearestCollisionPoint(target.x, target.y, x, y);
      target.x = destination[0];
      target.y = destination[1];
    }
  }

  /**
   * Updates character's attributes
   * @param {Integer} id id of character
   * @param {Object} newAttributes Object with updated attributes and values
   */
  changeAttribute(id, newAttributes) {
    const target = this.#characters.get(id);
    if (target) {
      if (newAttributes.color) {
        if (COLORS.includes(newAttributes.color)) {
          target.attributes.color = newAttributes.color;
        }
      }
    }
  }

  /**
   * List names and positions of characters in room
   * @returns list for this room
   */
  listCharacters(includeId = false) {
    let result = [];
    for (let [key, value] of this.#characters) {
      result.push({
        id: includeId ? key : null,
        room: this.#name,
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
   * @returns info of user matching id or null if not found
   */
  getCharacterInfo(id) {
    return this.#characters.has(id) ? this.#characters.get(id) : null;
  }

  /**
   * Gets information about room and rendering it on client side
   */
  getRoomInfo() {
    return {
      name: this.#name,
      backgroundUrl: this.#url,
      width: this.#width,
      height: this.#height,
      doors: this.#doors
    };
  }
}

module.exports = {
  RoomManager: RoomManager
};
