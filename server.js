/**
 * Server code for Comm Comm Corgis using Express and WebSockets
 */

const express = require("express");
const path = require("path");
const { Server } = require("ws");
const RoomManager = require("./rooms");

const PORT = process.env.PORT || 3456;
const INDEX = "./static/index.html";

const app = express();

app.use(express.static(path.join(__dirname, "static")));

const server = app
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
  });

const wss = new Server({ server });

const roomManager = new RoomManager(["entrance"]);

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("close", () => console.log("Client disconnected"));
  ws.on("message", (msg) => handleMessage(ws, msg));
});

/**
 * Handler for messages.  Each must have an 'action' field.
 * @param {String} msg - JSON formatted request
 */
function handleMessage(ws, msg) {
  data = JSON.parse(msg);
  if (data.action) {
    const action = data.action.toLowerCase();
    if (data.name) {
      data.name = data.name.replace(/[^\w]/gi,'').toLowerCase();
    }
    switch (action) {
      case "chat": // chat messages
        handleChat(ws, data);
        break;
      case "create": // create new character
        handleCreateChar(ws, data);
        break;
      case "leave": // remove character from game
        handleLeave(ws, data);
        break;
      case "update": // update character position
        handleUpdateChar(ws, data);
        break;
      case "list": // list characters
        handleList(ws, data);
        break;
      default:
        error(ws, msg + " is not a valid action");
    }
  } else {
    error(ws, "Please specify an action (chat, create, leave, update)");
  }
}

/**
 * Remove character from game
 * @param {WebSocket} ws - WebSocket for error responses
 * @param {Object} data - must have 'name'
 */
function handleLeave(ws, data) {
  if (data.name) {
    roomManager.removeCharacter("entrance", data.name);

    let response = {
      action: "remove_char",
      name: data.name,
    };
    broadcastToAll(JSON.stringify(response));
  } else {
    error(ws, "Character 'name' not specified.");
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

  ws.send(JSON.stringify({ action: "list", list: result }));
}

/**
 *
 * @param {WebSocket} ws - WebSocket for error handling
 * @param {Object} data - must contain 'name', 'x', and 'y' fields
 */
function handleUpdateChar(ws, data) {
  if (data.name && data.x && data.y) {
    roomManager.updateCharacter("entrance", data.name, data.x, data.y);

    let response = { action: "move_char" };
    response.name = data.name;
    response.x = data.x;
    response.y = data.y;
    broadcastToAll(JSON.stringify(response));
  } else {
    error(ws, "Must specify 'name', 'x', and 'y'.");
    console.log(data);
  }
}

/**
 * Adds new character when they join the game
 * @param {WebSocket} ws - websocket for error response
 * @param {Object} data - object with 'name' field for user
 */
function handleCreateChar(ws, data) {
  if (data.name) {
    let createCharResult = roomManager.addCharacter("entrance", data.name);

    if (createCharResult) {
      let response = { action: "new_char" };
      response.name = data.name;
      response.x = 0;
      response.y = 0;
      ws.send({
        action: "login",
        status: "success"
      });
      broadcastToAll(JSON.stringify(response));
    } else {
      ws.send({
        action: "login",
        status: "failure",
        reason: "user_already_exists"
      });
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
 * @param {WebSocket} ws - websocket for error responses
 * @param {Object} data - JSON object with 'user' and 'text' field
 */
function handleChat(ws, data) {
  if (data.user && data.text) {
    result = { action: "chat" };
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
  ws.send("ERROR: " + msg);
  console.error(msg);
}
