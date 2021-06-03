/**
 * Server code for Comm Comm Corgis using Express and WebSockets
 */

const DEBUG = true;

const express = require('express');
const path = require('path');
const { Server } = require('ws');
const { RoomManager, SUCCESS_STATUS, FAILURE_STATUS } = require('./rooms');

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

const ROOM_INFO = [
  {
    name: 'entrance',
    // bounds: [[-10, -10], [-10, 10000], [10000, 10000], [10000, -10]]
    bounds: [
      [-30, -30],
      [367, 5],
      [412, 277],
      [798, 277],
      [892, 290],
      [961, 5],
      [961, 55],
      [79, 362],
      [-49, 361]
    ]
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
  ws.socketId = socketIdCounter++;
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

/**
 * Update character's appearance
 * @param {WebSocket} ws - websocket for user identification and error responses
 * @param {Object} data - must have 'color'
 */
function handleChangeAttribute(ws, data) {
  if (data.attributes) {
    const changeAttributeResult = roomManager.changeAttribute(
      'entrance',
      ws.id,
      data.attributes
    );

    if (changeAttributeResult) {
      changeAttributeResult.action = 'modify_char';
      broadcastToAll(JSON.stringify(changeAttributeResult));

      debuggingDescription(
        '\u001b[34mChange attribute has been called:\u001b[0m',
        `${roomManager.getName(
          'entrance',
          ws.id
        )}'s appearance has been changed.`
      );
    }
  } else {
    error(ws, "Character 'attributes' not specified.");
  }
}

/**
 * Remove character from game
 * @param {WebSocket} ws - websocket for user identification and error responses
 */
function handleLeave(ws) {
  let removeCharacterResult = roomManager.removeCharacter('entrance', ws.id);

  if (removeCharacterResult) {
    removeCharacterResult.action = 'remove_char';
    broadcastToAll(JSON.stringify(removeCharacterResult));

    debuggingDescription(
      '\u001b[34mLeave has been called:\u001b[0m',
      `${roomManager.getName('entrance', ws.id)} has left.`
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
  let result = roomManager.listCharacters(data.room);

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
  if (data.x && data.y) {
    const updateCharacterResult = roomManager.updateCharacter(
      'entrance',
      ws.id,
      data.x,
      data.y
    );

    if (updateCharacterResult) {
      updateCharacterResult.action = 'move_char';
      broadcastToAll(JSON.stringify(updateCharacterResult));

      debuggingDescription(
        '\u001b[34mUpdate has been called:\u001b[0m',
        `${roomManager.getName('entrance', ws.id)} has been moved to x of ${
          data.x
        } and y of ${data.y}.`
      );
    } else {
      debuggingDescription(
        '\u001b[34mUpdate failed:\u001b[0m',
        `${roomManager.getName('entrance', ws.id)} can't be moved to x of ${
          data.x
        } and y of ${data.y}.`
      );
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

    let createCharResult = roomManager.addCharacter(
      'entrance',
      ws.id,
      data.name
    );

    createCharResult.userResponse.action = 'login_result';
    ws.send(JSON.stringify(createCharResult.userResponse));

    if (createCharResult.userResponse.status === SUCCESS_STATUS) {
      debuggingDescription(
        '\u001b[34mCreate has been called:\u001b[0m',
        `${data.name} has joined the game.`
      );

      if (createCharResult.broadcast) {
        createCharResult.broadcast.action = 'new_char';
        broadcastToAll(JSON.stringify(createCharResult.broadcast));
      }
    } else {
      debuggingDescription(
        '\u001b[34mCreate has been called:\u001b[0m',
        `${data.name} could not be created.  Reason: ${createCharResult.userResponse.explanation}`
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

  const listOfPlayers = roomManager.listCharacters();
  listOfPlayers.forEach((person) =>
    debug(
      `  \u001b[1m${person.name}\u001b[0m is at (${person.x}, ${person.y}) with a color of ${person.attributes.color}`
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
  if (msg) {
    fn(msg);
  } else {
    fn();
  }
}

// ==========DEBUG========== //
for (const [ptX, ptY] of ROOM_INFO[0].bounds) {
  roomManager.addCharacter('entrance', `[${ptX}, ${ptY}]`, ptX, ptY);
}
