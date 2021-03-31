/**
 * Server code for Comm Comm Corgis using Express and WebSockets
 */

const express = require('express');
const { Server } = require('ws');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite');

const PORT = process.env.PORT || 3456;
const INDEX = './static/index.html';

const CHARACTERS = [];

const server = express()
  .use((req, res) => res.sendFile(INDEX, {root:__dirname}))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
  ws.on('message', (msg) => handleMessage(ws, msg));
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
      case 'chat':                        // chat messages
        handleChat(ws, data);
        break;
      case 'create':                      // create new character
        handleCreateChar(ws, data);
        break;
      case 'leave':                       // remove character from game
        handleLeave(ws, data);
        break;
      case 'update':                      // update character position
        handleUpdateChar(ws, data);
        break;
      case 'list':                        // list characters
        handleList(ws);
        break;
      default:
        error(ws, msg + " is not a valid action");
    }

  } else {
    error(ws, 'Please specify an action (chat, create, leave, update)');
  }
}

/**
 * Remove character from game
 * @param {WebSocket} ws - WebSocket for error responses
 * @param {Object} data - must have 'name'
 */
function handleLeave(ws, data) {
  if (data.name) {
    CHARACTERS
      .filter(a => a.name === data.name);
    let response = {
      'action': 'remove_char',
      'name': data.name
    };
    broadcastToAll(JSON.stringify(response));
    
    // db.serialize(() => {
    //   const removeCharQuery = `
    //   DELETE FROM Characters
    //   WHERE name = ?;
    //   `;
    //   let stmt = db.prepare(removeCharQuery);
    //   stmt.run(data.name);

    //   let response = {'action': 'remove_char'};
    //   response.name = data.name;
    //   broadcastToAll(JSON.stringify(response));
    // });
  } else {
    error(ws, "Character 'name' not specified.");
  }
}

/**
 * Lists characters and positions
 * @param {WebSocket} ws - WebSocket for response
 */
function handleList(ws) {
  let result = CHARACTERS
    .map(row => {
      return {name: row.name, x: row.x, y: row.y}
    });
  ws.send(JSON.stringify({action: 'list', list: result}));

  // db.serialize(() => {
  //   result = []


  //   db.each(
  //     // query
  //     `
  //       SELECT *
  //       FROM Characters;
  //     `,
  //     // query params
  //     [],
  //     // handle each row
  //     (err, row) => {
  //       result.push({
  //         name: row.name,
  //         x: row.x,
  //         y: row.y
  //       });
  //       console.log(row);
  //     },
  //     // run on completion
  //     () => {
  //       ws.send(JSON.stringify({list: result}));
  //     }
  //   );
  // });
}

/**
 * 
 * @param {WebSocket} ws - WebSocket for error handling
 * @param {Object} data - must contain 'name', 'x', and 'y' fields
 */
function handleUpdateChar(ws, data) {
  if (data.name && data.x && data.y) {

    for (let i = 0; i < CHARACTERS.length; i++) {
      if (CHARACTERS[i].name === data.name) {
        CHARACTERS[i].x = data.x;
        CHARACTERS[i].y = data.y;
      }
    }

    let response = {'action': 'move_char'};
    response.name = data.name;
    response.x = data.x;
    response.y = data.y;
    broadcastToAll(JSON.stringify(response));

    // db.serialize(() => {
    //   const updateCharQuery = `
    //   UPDATE Characters
    //   SET x = ?, y = ?
    //   WHERE name = ?;
    //   `;
    //   let stmt = db.prepare(updateCharQuery);
    //   stmt.run(data.x, data.y, data.name);

    //   let response = {'action': 'move_char'};
    //   response.name = data.name;
    //   response.x = data.x;
    //   response.y = data.y;
    //   broadcastToAll(JSON.stringify(response));
    // });
  } else {
    error(ws, "Must specify 'name', 'x', and 'y'.");
  }
}

/**
 * Adds new character when they join the game
 * @param {WebSocket} ws - websocket for error response
 * @param {Object} data - object with 'name' field for user
 */
function handleCreateChar(ws, data) {
  if (data.name) {

    CHARACTERS.push({
      name: data.name,
      x: 0,
      y: 0
    });

    let response = {'action': 'new_char'};
    response.name = data.name;
    response.x = 0;
    response.y = 0;
    broadcastToAll(JSON.stringify(response));

    // db.serialize(() => {
    //   const createCharQuery = `
    //   INSERT INTO Characters
    //   VALUES (?, 0, 0);
    //   `;
    //   let stmt = db.prepare(createCharQuery);
    //   stmt.run(data.name);

    //   let response = {'action': 'new_char'};
    //   response.name = data.name;
    //   response.x = 0;
    //   response.y = 0;
    //   broadcastToAll(JSON.stringify(response));
    // });
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
 * @param {WebSocket} ws - websocket for error responses
 * @param {Object} data - JSON object with 'user' and 'text' field
 */
function handleChat(ws, data) {
  if (data.user && data.text) {
    result = {'action': 'chat'};
    result.user = data.user;
    result.text = data.text;
    broadcastToAll(JSON.stringify(result));
  } else {
    error(ws, 'Chat messages must contain "user" and "text" fields.')
  }
}

/**
 * Sends error as plain text in format `ERROR:` followed by msg
 * @param {WebSocket} ws - websocket to use
 * @param {String} msg - message to send
 */
function error(ws, msg) {
  ws.send("ERROR: " + msg);
}