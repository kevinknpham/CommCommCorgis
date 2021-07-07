/**
 * Server code for Comm Comm Corgis using Express and WebSockets
 */

const DEBUG = true;

const express = require('express');
const path = require('path');
const { Server } = require('ws');
const { RoomManager } = require('./rooms');

const PORT = process.env.PORT || 3456;
const INDEX = './static/index.html';

const app = express();

app.use(express.static(path.join(__dirname, 'static')));

const server = app
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
  });

const wss = new Server({ server });

const DEFAULT_ROOM = 'ctc';
const ROOM_INFO = [
  {
    name: 'ctc',
    doors: [[[69, 318], 'hub_games']],
    bounds: [
      [-22, -19],
      [-22, 175],
      [36, 175],
      [36, 328],
      [596, 328],
      [596, -19],
      [441, -19],
      [441, 125],
      [368, 125],
      [368, 114],
      [200, 114],
      [200, -19]
    ],
    image: 'assets/ctc_main.png',
    width: 630,
    height: 359,
    defaultX: 69,
    defaultY: 318
  },
  {
    name: 'hub_games',
    doors: [[[114, 293], 'ctc']], // [[114, 293], 'ctc'], [[-2, 126], 'hub_pool'], [[582, 296], 'hub_bowling]
    bounds: [
      [-22, 93],
      [-22, 330],
      [599, 330],
      [599, -19],
      [356, -19],
      [356, 93]
    ],
    image: 'assets/hub_games_main.png',
    width: 636,
    height: 362,
    defaultX: 114,
    defaultY: 293
  }
];

const roomManager = new RoomManager(ROOM_INFO);

let socketIdCounter = 0;

wss.on('connection', (ws) => {
  debug('\u001b[32mClient connected\u001b[0m');
  ws.on('close', () => {
    handleLeave(ws);
    debug('\u001b[32mClient disconnected\u001b[0m');
  });
  ws.on('message', (msg) => handleMessage(ws, msg));
  ws.id = socketIdCounter++;
});

/**
 * Handler for messages.  Each must have an 'action' field.
 * @param {String} msg - JSON formatted request
 */
function handleMessage(ws, msg) {
  data = JSON.parse(msg);
  if (data.action) {
    const action = data.action.toLowerCase();

    switch (action) {
      case 'chat': // chat messages
        handleChat(ws, data);
        break;
      case 'update': // update character position
        handleUpdateChar(ws, data);
        break;
      case 'create': // create new character
        handleCreateChar(ws, data);
        break;
      case 'leave': // remove character from game
        handleLeave(ws);
        break;
      case 'change_room':
        handleChangeRoom(ws, data);
        break;
      case 'list': // list characters
        handleList(ws, data);
        break;
      case 'change_attribute':
        handleChangeAttribute(ws, data);
        break;
      default:
        error(ws, msg + ' is not a valid action');
    }
  } else {
    error(ws, 'Please specify an action (chat, create, leave, update)');
  }
}

function handleChangeRoom(ws, data) {
  if (data.new_room && roomManager.containsRoom(data.new_room)) {
    const oldCharacterInfo = roomManager.getCharacterInfo(ws.id);
    roomManager.removeCharacter(ws.id);
    roomManager.addCharacter(data.new_room, ws.id, oldCharacterInfo.name);

    const newCharacterInfo = roomManager.getCharacterInfo(ws.id);
    let userResult = {};
    userResult.action = 'change_room_result';
    userResult.roomInfo = roomManager.getRoomInfoFromId(ws.id);

    ws.send(JSON.stringify(userResult, replacer));

    let removeCharBroadcast = {};
    removeCharBroadcast.action = 'remove_char';
    removeCharBroadcast.name = oldCharacterInfo.name;
    removeCharBroadcast.room = oldCharacterInfo.room;
    broadcastToAll(JSON.stringify(removeCharBroadcast));

    let newCharBroadcast = {};
    newCharBroadcast.action = 'new_char';
    newCharBroadcast.name = oldCharacterInfo.name;
    newCharBroadcast.x = oldCharacterInfo.x;
    newCharBroadcast.y = oldCharacterInfo.y;
    newCharBroadcast.attributes = oldCharacterInfo.attributes;
    newCharBroadcast.room = newCharacterInfo.room;
    broadcastToAll(JSON.stringify(newCharBroadcast));

    debuggingDescription(
      '\u001b[34mChange room has been called:\u001b[0m',
      `${oldCharacterInfo.name} has moved from ${oldCharacterInfo.room} to ${newCharacterInfo.room}.`
    );
  } else {
    error(ws, 'new_room not specified or is not a valid room name.');
  }
}

/**
 * Update character's appearance
 * @param {WebSocket} ws - websocket for user identification and error responses
 * @param {Object} data - must have 'color'
 */
function handleChangeAttribute(ws, data) {
  if (data.attributes) {
    roomManager.changeAttribute(ws.id, data.attributes);
    const characterInfo = roomManager.getCharacterInfo(ws.id);

    let result = {};
    result.action = 'modify_char';
    result.name = characterInfo.name;
    result.attributes = characterInfo.attributes;
    result.room = characterInfo.room;

    broadcastToAll(JSON.stringify(result));

    debuggingDescription(
      '\u001b[34mChange attribute has been called:\u001b[0m',
      `${characterInfo.name}'s appearance has been changed.`
    );
  } else {
    error(ws, "Character 'attributes' not specified.");
  }
}

/**
 * Remove character from game
 * @param {WebSocket} ws - websocket for user identification and error responses
 */
function handleLeave(ws) {
  if (roomManager.containsId(ws.id)) {
    const characterInfo = roomManager.getCharacterInfo(ws.id);

    roomManager.removeCharacter(ws.id);

    let result = {};
    result.action = 'remove_char';
    result.name = characterInfo.name;
    result.room = characterInfo.room;
    broadcastToAll(JSON.stringify(result));

    debuggingDescription(
      '\u001b[34mLeave has been called:\u001b[0m',
      `${characterInfo.name} has left.`
    );
  }
}

/**
 * Lists characters and their positions
 * @param {WebSocket} ws - WebSocket for response
 * @param {Object} data - data from request.  If data contains 'room', will
 *                        only list characters in that room.
 */
function handleList(ws, data) {
  let result = roomManager.listCharacters(false, data.room);

  ws.send(JSON.stringify({ action: 'list', list: result }));

  debug('\u001b[34mList has been called:\u001b[0m');
  debug('');
}

/**
 *
 * @param {WebSocket} ws - WebSocket for error handling
 * @param {Object} data - must contain 'x' and 'y' fields
 */
function handleUpdateChar(ws, data) {
  if ((data.x || data.x === 0) && (data.y || data.y === 0)) {
    if (roomManager.containsId(ws.id)) {
      roomManager.updateCharacter(ws.id, data.x, data.y);
      const characterInfo = roomManager.getCharacterInfo(ws.id);

      let result = {};
      result.action = 'move_char';
      result.name = characterInfo.name;
      result.x = characterInfo.x;
      result.y = characterInfo.y;
      result.room = characterInfo.room;
      broadcastToAll(JSON.stringify(result));

      debuggingDescription(
        '\u001b[34mUpdate has been called:\u001b[0m',
        `${characterInfo.name} is now at x of ${data.x} and y of ${data.y}.`
      );
    } else {
      error(ws, 'Character not added yet.');
      console.log(data);
    }
  } else {
    error(ws, "Must specify 'x' and 'y'.");
    console.log(data);
  }
}

/**
 * Adds new character when they join the game
 * @param {WebSocket} ws - websocket for user identification and error response
 * @param {Object} data - object with 'name' field for user
 */
function handleCreateChar(ws, data) {
  if (data.name) {
    // Remove non-alphanumeric characters
    data.name = data.name.replace(/[^\w]/gi, '');

    if (data.room) {
      roomManager.addCharacter(room, ws.id, data.name);
    } else {
      roomManager.addCharacter(DEFAULT_ROOM, ws.id, data.name);
    }

    if (roomManager.containsId(ws.id)) {
      const characterInfo = roomManager.getCharacterInfo(ws.id);
      let userResult = {};
      userResult.action = 'login_result';
      userResult.status = 'success';
      userResult.name = characterInfo.name;
      userResult.roomInfo = roomManager.getRoomInfoFromId(ws.id);

      ws.send(JSON.stringify(userResult, replacer));

      let broadcastResult = {};
      broadcastResult.action = 'new_char';
      broadcastResult.name = characterInfo.name;
      broadcastResult.x = characterInfo.x;
      broadcastResult.y = characterInfo.y;
      broadcastResult.attributes = characterInfo.attributes;
      broadcastResult.room = characterInfo.room;
      broadcastToAll(JSON.stringify(broadcastResult));

      debuggingDescription(
        '\u001b[34mCreate has been called:\u001b[0m',
        `${characterInfo.name} has joined the game.`
      );
    } else {
      let userResult = {};
      userResult.action = 'login_result';
      userResult.status = 'failure';
      userResult.reason = 'user_already_exists';
      userResult.explanation =
        'The requested username has been taken by another user.';
      userResult.requestedName = data.name;
      ws.send(JSON.stringify(userResult));

      debuggingDescription(
        '\u001b[34mCreate has been called:\u001b[0m',
        `${data.name} could not be created.`
      );
    }
  } else {
    error(ws, "Character 'name' not specified.");
  }
}

/**
 * Send message to all sockets
 * @param {String} msg - message to be broadcast
 */
function broadcastToAll(msg) {
  wss.clients.forEach((client) => {
    client.send(msg);
  });
}

/**
 * Broadcasts chat messages to everyone
 * @param {WebSocket} ws - websocket for user identification and error responses
 * @param {Object} data - JSON object with 'user' and 'text' field
 */
function handleChat(ws, data) {
  if (data.user && data.text) {
    result = { action: 'chat' };
    result.user = data.user;
    result.text = data.text;
    result.room = roomManager.getRoomInfoFromId(ws.id).name;
    broadcastToAll(JSON.stringify(result));
  } else {
    error(ws, 'Chat messages must contain "user" and "text" fields.');
  }
}

/**
 * Sends error as plain text in format `ERROR:` followed by msg
 * @param {WebSocket} ws - websocket to use
 * @param {String} msg - message to send
 */
function error(ws, msg) {
  ws.send('ERROR: ' + msg);
  debug('\u001b[31mERROR:\u001b[0m' + msg, console.error);
}

/**
 * If DEBUG is true, prints all the characters to the console.
 */
function printList() {
  debug('The list of players is as follows:');

  const listOfPlayers = roomManager.listCharacters(true);
  listOfPlayers.forEach((person) =>
    debug(
      `  \u001b[1m(${person.id})${person.name}\u001b[0m is at (${person.x}, ${person.y}) with a color of ${person.attributes.color}`
    )
  );
}

/**
 * Prints description to console when DEBUG is true
 * @param  {...any} statements - descriptions to print
 */
function debuggingDescription(...statements) {
  for (statement of statements) {
    debug(statement);
  }
  debug('');
  printList();
  debug('');
}

/**
 * Logs things to console if DEBUG is true
 * @param {*} msg - thing to log to console
 * @param {function} fn - fn to use, defaults to console.log
 */
function debug(msg, fn = console.log) {
  if (DEBUG) {
    if (msg) {
      fn(msg);
    } else {
      fn();
    }
  }
}

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()) // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}
